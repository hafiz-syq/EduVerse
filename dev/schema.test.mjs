// Penjaga drift skema: migrations/*.sql harus tetap masuk subset DDL AppHub dan
// harus memuat setiap tabel/kolom yang benar-benar dipakai Function.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseMigrations, uniqueGroups } from './schema.mjs';
import { TABLES } from '../functions/src/core.mjs';

const MIGRATIONS = join(import.meta.dirname, '..', 'migrations');
const FUNCTION_DIR = join(import.meta.dirname, '..', 'functions', 'src');
const SOURCES = readdirSync(FUNCTION_DIR)
  .filter((file) => file.endsWith('.mjs'))
  .map((name) => ({ name, text: readFileSync(join(FUNCTION_DIR, name), 'utf8') }));

/** Mengambil rentang argumen dari `store.<metode>( ... )` dengan menyeimbangkan kurung. */
function callSpans(text) {
  const spans = [];
  const finder = /store\.(list|one|all|insert|insertAbsent|patch)\(/g;
  let match;
  while ((match = finder.exec(text))) {
    const start = finder.lastIndex;
    let depth = 1;
    let index = start;
    while (index < text.length && depth > 0) {
      const char = text[index];
      if (char === '(' || char === '{' || char === '[') depth += 1;
      else if (char === ')' || char === '}' || char === ']') depth -= 1;
      else if (char === "'") {
        index += 1;
        while (index < text.length && text[index] !== "'") index += 1;
      }
      index += 1;
    }
    spans.push({ method: match[1], args: text.slice(start, index - 1) });
  }
  return spans;
}

const literal = (part) => /^'([^']*)'$/.exec(String(part ?? '').trim())?.[1] ?? null;

/** Memecah argumen pada kurung tingkat terluar, tanpa memecah di dalam string/kurung bersarang. */
function splitArgs(args) {
  const parts = [];
  let depth = 0;
  let buffer = '';
  let quote = null;
  for (let index = 0; index < args.length; index += 1) {
    const char = args[index];
    if (quote) {
      buffer += char;
      if (char === '\\' && index + 1 < args.length) {
        buffer += args[index + 1];
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      buffer += char;
      continue;
    }
    if (char === '(' || char === '{' || char === '[') depth += 1;
    if (char === ')' || char === '}' || char === ']') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(buffer.trim());
      buffer = '';
      continue;
    }
    buffer += char;
  }
  if (buffer.trim()) parts.push(buffer.trim());
  return parts;
}

/** Nama kolom pada baris object literal; mengembalikan null bila argumennya variabel. */
function rowKeys(part) {
  const text = String(part ?? '').trim();
  if (!text.startsWith('{')) return null;
  let depth = 0;
  let index = 1;
  while (index < text.length) {
    const char = text[index];
    if (char === "'") {
      index += 1;
      while (index < text.length && text[index] !== "'") index += 1;
    } else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) break;
    }
    index += 1;
  }
  const keys = [];
  let nested = 0;
  let buffer = '';
  const push = (token) => {
    const key = /^([a-z_][a-z0-9_]*)\s*:/.exec(token) ?? /^'([a-z_][a-z0-9_]*)'\s*:/.exec(token) ?? /^([a-z_][a-z0-9_]*)$/.exec(token);
    if (key) keys.push(key[1]);
  };
  for (const char of text.slice(1, index)) {
    if (char === '{' || char === '(' || char === '[') nested += 1;
    if (char === '}' || char === ')' || char === ']') nested -= 1;
    if (char === ',' && nested === 0) {
      push(buffer.trim());
      buffer = '';
      continue;
    }
    buffer += char;
  }
  push(buffer.trim());
  return keys;
}

/** Daftar kolom `select`; mengembalikan null bila bukan string harfiah berbentuk daftar. */
const columnList = (part) => {
  const value = literal(part);
  return value && /^[a-z_][a-z0-9_]*(\s*,\s*[a-z_][a-z0-9_]*)*$/.test(value)
    ? value.split(',').map((column) => column.trim())
    : null;
};

/** Kunci filter pada argumen `[['kolom', nilai], ...]`. */
function filterKeys(part) {
  return [...String(part ?? '').matchAll(/\[\s*'([a-z_][a-z0-9_]*)'\s*,/g)].map((match) => match[1]);
}

/** Kolom `order` pada argumen `{ column: 'kolom', ascending: ... }`. */
const orderColumn = (part) => /column:\s*'([a-z_][a-z0-9_]*)'/.exec(String(part ?? ''))?.[1] ?? null;

// Posisi argumen tiap metode store, sesuai pembungkus di functions/src/core.mjs.
const POSITIONS = {
  list: { columns: 1, filters: 2, order: 3 },
  one: { columns: 1, filters: 2 },
  all: { columns: 1, order: 2 },
  insert: { row: 1 },
  insertAbsent: { row: 1, conflict: 2 },
  patch: { row: 1, filters: 2 },
};

test('migrations masuk subset DDL yang didukung AppHub', () => {
  const { problems, files, tables } = parseMigrations(MIGRATIONS);
  assert.deepEqual(problems, [], `ditemukan ${problems.length} masalah DDL: ${problems.join(' | ')}`);
  assert.equal(files.length, 10);
  assert.equal(tables.size, 24);
});

test('setiap tabel yang dipakai Function ada di skema, dan tidak ada tabel yatim', () => {
  const { tables } = parseMigrations(MIGRATIONS);
  const expected = new Set(Object.values(TABLES));
  assert.deepEqual([...tables.keys()].sort(), [...expected].sort());
});

test('kolom yang dibaca dan ditulis Function ada dalam skema', () => {
  const { tables } = parseMigrations(MIGRATIONS);
  const drift = [];
  for (const source of SOURCES) {
    for (const { method, args } of callSpans(source.text)) {
      const parts = splitArgs(args);
      const table = tables.get(literal(parts[0]));
      if (!table) {
        drift.push(`${source.name}: tabel tak dikenal "${literal(parts[0])}"`);
        continue;
      }
      const check = (column, why) => {
        if (column && !table.columns.has(column)) drift.push(`${source.name}: ${table.name}.${column} (${why}, metode ${method})`);
      };
      const at = (key) => (key === undefined ? undefined : parts[key]);
      for (const column of columnList(at(POSITIONS[method].columns)) ?? []) check(column, 'select');
      for (const column of rowKeys(at(POSITIONS[method].row)) ?? []) check(column, 'isi baris');
      for (const column of filterKeys(at(POSITIONS[method].filters))) check(column, 'filter');
      check(orderColumn(at(POSITIONS[method].order)), 'order');
      const conflict = literal(at(POSITIONS[method].conflict));
      if (conflict !== null && !uniqueGroups(table).some((group) => group.join(',') === conflict)) {
        drift.push(`${source.name}: onConflict "${conflict}" tidak punya UNIQUE di ${table.name}`);
      }
    }
  }
  assert.deepEqual(drift, [], `drift kolom:\n${drift.join('\n')}`);
});

// Penjaga keputusan integritas (migrasi 0010): setiap FK baru harus punya ON DELETE yang
// tertulis, kalau tidak Postgres diam-diam memakai RESTRICT dan admins menemukan dirinya
// tidak bisa menghapus baris tanpa alasan yang tercatat di suatu berkas.
test('setiap referensi tanpa kunci punya keputusan: FK dengan ON DELETE atau alasan tertulis', () => {
  const { tables, problems } = parseMigrations(MIGRATIONS);
  assert.deepEqual(problems, [], `ditemukan ${problems.length} masalah DDL: ${problems.join(' | ')}`);

  const harapan = [
    ['user_state', 'rank_key', 'ranks', 'rank_key', 'RESTRICT'],
    ['entries', 'rank_key', 'ranks', 'rank_key', 'RESTRICT'],
    ['threads', 'accepted_post_id', 'posts', 'id', 'SET NULL'],
    ['flags', 'resolved_by', 'users', 'id', 'SET NULL'],
    ['ad_events', 'slot_key', 'ad_slots', 'slot_key', 'RESTRICT'],
  ];
  const found = new Map();
  for (const table of tables.values()) {
    for (const fk of table.foreignKeys) found.set(`${table.name}.${fk.column}`, fk);
  }
  for (const [tabel, kolom, sasaran, kolomSasaran, aksi] of harapan) {
    const fk = found.get(`${tabel}.${kolom}`);
    assert.ok(fk, `FK ${tabel}.${kolom} tidak ditemukan`);
    assert.equal(fk.references.table, sasaran);
    assert.equal(fk.references.column, kolomSasaran);
    assert.equal(fk.onDelete, aksi, `ON DELETE ${tabel}.${kolom} berubah dari keputusan yang ditulis`);
  }

  // Empat butir yang sengaja dibiarkan tanpa FK harus tetap tertulis alasannya di migrasi,
  // dan votes.post_id tidak boleh diam-diam diberi FK: isinya juga id thread (pertanyaan).
  const teks = readFileSync(join(MIGRATIONS, '0010_key_integrity.sql'), 'utf8');
  for (const butir of ['flags.target_kind', 'votes.post_id', 'ad_events.user_id', 'tournaments.bank_ids']) {
    assert.ok(teks.includes(butir), `${butir} hilang dari catatan 0010_key_integrity.sql`);
  }
  assert.deepEqual(tables.get('votes').foreignKeys, [], 'votes.post_id jangan diberi FK — berisi id thread atau id post');
});

test('penjaga DDL menolak FK tanpa ON DELETE, sasaran tak dikenal, dan SET NULL di kolom NOT NULL', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ev-ddl-'));
  try {
    writeFileSync(
      join(dir, '0001_a.sql'),
      [
        'CREATE TABLE app.induk (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kunci text NOT NULL UNIQUE, lepas text);',
        'CREATE TABLE app.anak (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), wajib text NOT NULL, lepasan text, asing text, sasaran text);',
      ].join('\n'),
      'utf8',
    );
    writeFileSync(
      join(dir, '0002_b.sql'),
      [
        'ALTER TABLE app.anak ADD CONSTRAINT anak_sasaran_fkey FOREIGN KEY (sasaran) REFERENCES app.induk (kunci) ON DELETE RESTRICT;',
        'ALTER TABLE app.anak ADD CONSTRAINT anak_wajib_fkey FOREIGN KEY (wajib) REFERENCES app.induk (kunci);',
        'ALTER TABLE app.anak ADD CONSTRAINT anak_setnull_fkey FOREIGN KEY (wajib) REFERENCES app.induk (kunci) ON DELETE SET NULL;',
        'ALTER TABLE app.anak ADD CONSTRAINT anak_asing_fkey FOREIGN KEY (asing) REFERENCES app.tabel_hantu (kunci) ON DELETE CASCADE;',
        'ALTER TABLE app.anak ADD CONSTRAINT anak_unik_fkey FOREIGN KEY (lepasan) REFERENCES app.induk (lepas) ON DELETE SET NULL;',
      ].join('\n'),
      'utf8',
    );
    const { problems } = parseMigrations(dir);
    const ikut = (teks) => problems.some((p) => p.includes(teks));
    assert.equal(problems.length, 4, `harus tepat 4 masalah, dapat:\n${problems.join('\n')}`);
    assert.ok(ikut('FK tanpa ON DELETE eksplisit: anak_wajib_fkey'), problems.join(' | '));
    assert.ok(ikut('SET NULL pada kolom NOT NULL: anak.wajib'), problems.join(' | '));
    assert.ok(ikut('references ke tabel tak dikenal: anak.asing'), problems.join(' | '));
    assert.ok(ikut('sasaran FK harus UNIQUE: induk.lepas'), problems.join(' | '));
    // Baris pertama (FK sah) tidak boleh ikut dilaporkan.
    assert.ok(!ikut('anak_sasaran_fkey'), 'FK yang benar ikut ditolak');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
