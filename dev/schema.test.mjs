// Penjaga drift skema: migrations/*.sql harus tetap masuk subset DDL AppHub dan
// harus memuat setiap tabel/kolom yang benar-benar dipakai Function.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
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
  assert.equal(files.length, 8);
  assert.equal(tables.size, 23);
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
