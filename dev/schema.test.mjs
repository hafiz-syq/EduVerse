// Penjaga drift skema: migrations/*.sql harus tetap masuk subset DDL AppHub dan
// harus memuat setiap tabel/kolom yang benar-benar dipakai Function.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  // 13 berkas sejak 2026-11-18: sepuluh yang sudah diterapkan + 0011 catatan + 0012 perf indexes + 0013 login manual.
  // Angka ini naik hanya lewat keputusan pemilik, jadi menambah berkas = menyentuh tes ini.
  assert.equal(files.length, 13, `berkas migrations berubah jumlahnya: ${files.join(', ')}`);
  assert.equal(tables.size, 24, '0011 tidak boleh menambah tabel — ia berkas catatan');
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

// Cakupan penjaga ini HANYA FK bentuk ALTER TABLE ... ADD CONSTRAINT. 0001..0009 menulis
// REFERENCES inline, yang oleh Postgres dinamai otomatis dan dipakai default NO ACTION
// (confdeltype 'a' — bukan RESTRICT; setara RESTRICT selama constraint tidak DEFERRABLE, dan
// 0/31 deferrable di produksi, terukur 2026-11-14 lewat pg_constraint). Angka 5 dan 26 di
// bawah adalah hitungan yang dicocokkan dengan katalog itu: kalau salah satunya berubah, ada
// referensi baru yang keputusannya belum tercatat di mana pun.
test('5 FK bentuk ALTER punya ON DELETE tertulis, dan 26 REFERENCES inline masih default (dilaporkan, bukan dijaga)', () => {
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

  // Penjaga buta terhadap REFERENCES inline: ia tidak pernah memeriksa kolom itu, jadi
  // Jumlahnya dikunci di sini supaya celahnya terlihat, bukan tersamar di balik nama tes.
  let inline = 0;
  for (const table of tables.values()) {
    for (const column of table.columns.values()) if (column.references) inline += 1;
  }
  let bentukAlter = 0;
  for (const table of tables.values()) bentukAlter += table.foreignKeys.length;
  assert.equal(bentukAlter, 5, 'FK bentuk ALTER yang dijaga aturan ON DELETE berubah dari 5');
  assert.equal(inline, 26, 'REFERENCES inline tanpa keputusan ON DELETE tercatat berubah dari 26');
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

// Ledger app.ev_schema_migrations adalah pemilik checksum, bukan kita. Nilainya di bawah saya
// salin dari `SELECT name, checksum FROM app.ev_schema_migrations ORDER BY name` di Neon produksi
// (read-only, terukur 2026-11-18). Penjaga ini ada supaya satu suntingan komentar tidak lagi
// ketahuan lewat skrip migrasi yang mati di depan produksi, melainkan lewat tes yang gagal di CI
// lokal — dan supaya rambatan core.autocrlf tidak bisa menyelinap sebagai "berkas berubah".
const LEDGER = {
  '0001_identity.sql': 'c204027520882a6c864b4981b8d4e99cdc1fc23f1622227e2188506acd57d45a',
  '0002_catalog.sql': '1001a58d4a1a32fdb9ee5335964b55f567ad13fac7941456b8686a3eeaf0e82c',
  '0003_progress.sql': '9634a1a0837fb11a5bc2bdd889eba8a938f058ad6e4f8f7bec94721f6a05aa17',
  '0004_arena.sql': '86fe46547c8fab64a9bd0edee5ee13983efff85abe1987220343095c9a888048',
  '0005_quiz.sql': '5184659224e25554ba9a8e56696104d443c0f3594cc9a2ba9abdb419f71f865e',
  '0006_xp.sql': '37f2f304db1cacce00356dc20b54a95e456b5e34ca69d50cc8fc556665c7cdab',
  '0007_discussion.sql': '2cdcfae87283bc9f5a0729aaa74602a69a30402fa5fe979d577d4522286eb711',
  '0008_ads.sql': '376cecc64c78b3ee879b85949f33c311325342eb1b18bb09e087d3ac94e48558',
  '0009_playground.sql': 'a847a68c17f8fc7f50881992baf9b6b2023c6fe52f2d1b59f4c71a7ca4d6917e',
  '0010_key_integrity.sql': '22cb8f59b99310bf72be07ed6dbbcec34453ff924eced4e240a2ecd9d5f20272',
  '0012_perf_indexes.sql': '50d0bec56caa6188aa85f40a00653063340b8dc63d07096b1a32b1a4005ea199',
  '0013_users_manual_login.sql': 'c1ae7a8a5ea5a04a0e9d60db8441ed544e281ff3847ff096b07a47a072c26bb7',
};

test('berkas yang sudah diterapkan cocok byte-per-byte dengan checksum ledger', () => {
  for (const [nama, checksum] of Object.entries(LEDGER)) {
    const isi = readFileSync(join(MIGRATIONS, nama), 'utf8');
    assert.equal(
      createHash('sha256').update(isi).digest('hex'),
      checksum,
      `${nama} diubah setelah pernah diterapkan — scripts/apply-migrations.mjs:45-51 akan melempar ` +
        'dan menolak seluruh jalur migrasi sesudahnya. Tulis berkas baru, jangan sunting yang lama.',
    );
  }
});

test('0011 adalah berkas catatan: nol pernyataan, dan ia satu-satunya yang belum dibekukan', () => {
  const nama = readdirSync(MIGRATIONS).filter((f) => f.endsWith('.sql')).sort();
  assert.deepEqual(
    nama.filter((f) => !(f in LEDGER)),
    ['0011_integrity_catatan.sql'],
    'berkas di luar ledger harus persatu: 0011 catatan; migrasi DDL baru wajib lewat keputusan pemilik',
  );
  const isi = readFileSync(join(MIGRATIONS, '0011_integrity_catatan.sql'), 'utf8');
  const pernyataan = isi.split(/\r?\n/).filter((baris) => !baris.startsWith('--') && baris.trim() !== '');
  assert.deepEqual(pernyataan, [], '0011 tidak boleh berisi DDL — ia hanya catatan koreksi 0010');
  assert.ok(!isi.includes('\r'), 'berkas migrasi harus LF; .gitattributes memegang aturan ini');
  for (const butir of ['NO ACTION', 'confdeltype', 'Delapan']) {
    assert.ok(isi.includes(butir), `koreksi "${butir}" hilang dari catatan 0011`);
  }
});
