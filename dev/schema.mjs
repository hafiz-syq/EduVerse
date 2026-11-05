// Pembaca migrations/*.sql untuk verifikasi lokal: aturan subset DDL AppHub, kolom
// yang benar-benar dipakai Function, kunci UNIQUE untuk insertIfAbsent, dan nilai DEFAULT.
// Hanya dipakai alat dev; Function produksi tidak mengimpornya.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const ALLOWED_TYPES = new Set(['boolean', 'integer', 'bigint', 'text', 'uuid', 'timestamptz', 'jsonb']);

const splitTop = (body) => {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const char of body) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
};

const statements = (sql) => sql
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('--'))
  .join('\n')
  .split(';')
  .map((part) => part.trim())
  .filter(Boolean);

function resolveDefault(raw, column, problems) {
  if (raw === 'gen_random_uuid()') return () => crypto.randomUUID();
  if (raw === 'now()') return () => new Date().toISOString();
  const literal = /^'([^']*)'$/.exec(raw);
  if (literal) return literal[1];
  if (/^-?\d+$/.test(raw)) return Number(raw);
  if (raw === 'true' || raw === 'false') return raw === 'true';
  problems.push(`default tidak didukung: ${column} ${raw}`);
  return undefined;
}

function readTable(name, body, problems, tables) {
  if (tables.has(name)) problems.push(`tabel dibuat dua kali: ${name}`);
  const table = { name, columns: new Map(), uniques: [], indexes: [], foreignKeys: [] };
  for (const part of splitTop(body)) {
    const group = /^UNIQUE \(([^)]*)\)$/.exec(part);
    if (group) {
      table.uniques.push(group[1].split(',').map((column) => column.trim()));
      continue;
    }
    const [column, type, ...rest] = part.split(/\s+/);
    if (!/^[a-z_][a-z0-9_]*$/.test(column) || !ALLOWED_TYPES.has(type)) {
      problems.push(`kolom di luar subset: ${name}.${part}`);
      continue;
    }
    const flags = rest.join(' ');
    if (/\bCHECK\b|\bGENERATED\b|\bIDENTITY\b|\[[^\]]*\]/.test(flags)) problems.push(`opsi kolom tidak didukung: ${name}.${column}`);
    const isPk = /\bPRIMARY KEY\b/.test(flags);
    const rawDefault = /DEFAULT\s+(\S+)/.exec(flags)?.[1];
    const reference = /REFERENCES app\.([a-z_]+) \(([a-z_]+)\)/.exec(flags);
    if (flags.includes('REFERENCES') && !reference) problems.push(`references di luar bentuk app.tabel (kolom): ${name}.${column}`);
    if (/\bNOT NULL\b/.test(flags) && isPk) problems.push(`primary key tidak perlu NOT NULL: ${name}.${column}`);
    table.columns.set(column, {
      name: column,
      type,
      pk: isPk,
      notNull: isPk || /\bNOT NULL\b/.test(flags),
      unique: isPk || /(?:^|\s)UNIQUE(?:\s|$)/.test(flags),
      default: rawDefault === undefined ? undefined : resolveDefault(rawDefault, `${name}.${column}`, problems),
      references: reference ? { table: reference[1], column: reference[2] } : null,
    });
    if (isPk) table.uniques.push([column]);
    if (/(?:^|\s)UNIQUE(?:\s|$)/.test(flags)) table.uniques.push([column]);
  }
  tables.set(name, table);
  return table;
}

export function parseMigrations(dir) {
  const problems = [];
  const tables = new Map();
  const files = readdirSync(dir).filter((file) => file.endsWith('.sql')).sort();
  for (const file of files) {
    for (const statement of statements(readFileSync(join(dir, file), 'utf8'))) {
      const create = /^CREATE TABLE app\.([a-z_]+) \(([\s\S]+)\)$/s.exec(statement);
      if (create) {
        readTable(create[1], create[2], problems, tables);
        continue;
      }
      const simple = /^CREATE ([A-Z ]*?)INDEX ([a-z0-9_]+) ON app\.([a-z_]+) \(([^()]*)\)$/.exec(statement);
      if (simple) {
        if (simple[1].trim()) problems.push(`index khusus tidak didukung: ${simple[2]}`);
        const table = tables.get(simple[3]);
        if (!table) {
          problems.push(`index ke tabel yang belum dibuat: ${simple[3]}`);
          continue;
        }
        const columns = simple[4].split(',').map((column) => column.trim());
        for (const column of columns) {
          if (!/^[a-z_][a-z0-9_]*$/.test(column)) problems.push(`index dengan ekspresi/urutan: ${simple[2]} (${column})`);
          else if (!table.columns.has(column)) problems.push(`kolom index tidak ada: ${simple[3]}.${column}`);
        }
        table.indexes.push({ name: simple[2], columns });
        continue;
      }
      const fk = /^ALTER TABLE app\.([a-z_]+) ADD CONSTRAINT ([a-z0-9_]+) FOREIGN KEY \(([a-z_]+)\) REFERENCES app\.([a-z_]+) \(([a-z_]+)\)( ON DELETE (RESTRICT|CASCADE|SET NULL))?$/.exec(statement);
      if (fk) {
        const [, nama, kunci, kolom, targetTabel, targetKolom, , aksi] = fk;
        const sumber = tables.get(nama);
        if (!sumber) problems.push(`ALTER ke tabel yang belum dibuat: ${nama}`);
        else {
          const kolomSumber = sumber.columns.get(kolom);
          if (!kolomSumber) problems.push(`kolom FK tidak ada: ${nama}.${kolom}`);
          if (!aksi) problems.push(`FK tanpa ON DELETE eksplisit: ${kunci}`);
          else if (aksi === 'SET NULL' && kolomSumber?.notNull) problems.push(`SET NULL pada kolom NOT NULL: ${nama}.${kolom}`);
          const target = tables.get(targetTabel);
          if (!target) problems.push(`references ke tabel tak dikenal: ${nama}.${kolom}`);
          else {
            const kolomTarget = target.columns.get(targetKolom);
            if (!kolomTarget) problems.push(`kolom sasaran FK tidak ada: ${targetTabel}.${targetKolom}`);
            else if (!kolomTarget.pk && !kolomTarget.unique) problems.push(`sasaran FK harus UNIQUE: ${targetTabel}.${targetKolom}`);
          }
          sumber.foreignKeys.push({
            name: kunci,
            column: kolom,
            references: { table: targetTabel, column: targetKolom },
            onDelete: aksi ?? null,
          });
        }
        continue;
      }
      problems.push(`pernyataan di luar subset: ${statement.slice(0, 48)}`);
    }
  }
  for (const table of tables.values()) {
    for (const column of table.columns.values()) {
      if (column.references && !tables.has(column.references.table)) problems.push(`references ke tabel tak dikenal: ${table.name}.${column.name}`);
    }
  }
  return { tables, problems, files };
}

/** Baris baru memakai DEFAULT dari skema; kolom NOT NULL tanpa nilai menjadi error, seperti Postgres. */
export function applyDefaults(table, row) {
  const out = { ...row };
  const missing = [];
  for (const column of table.columns.values()) {
    if (out[column.name] !== undefined) continue;
    if (typeof column.default === 'function') out[column.name] = column.default();
    else if (column.default !== undefined) out[column.name] = column.default;
    else if (column.notNull) missing.push(column.name);
  }
  return { row: out, missing };
}

export const uniqueGroups = (table) => table.uniques.filter((group) => group.every((column) => table.columns.has(column)));
