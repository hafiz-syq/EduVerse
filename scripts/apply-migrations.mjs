// Penerapan migrations/*.sql ke Postgres eksternal (Neon, Supabase, dll).
// Netlify menerapkan migrasi otomatis hanya untuk Netlify Database, jadi skema EduVerse
// dinaikkan lewat skrip ini: satu transaksi per berkas, dicatat di ledger, dan ditolak
// kalau berkas yang sudah pernah diterapkan berubah (checksum drift).
//
// Pemakaian: DATABASE_URL=postgres://... node scripts/apply-migrations.mjs [--dry-run]
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import pg from 'pg';

const DIR = join(import.meta.dirname, '..', 'migrations');
const LEDGER = '"app"."ev_schema_migrations"';
const kering = process.argv.includes('--dry-run');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL belum diisi. Pakai endpoint pooled Postgres Anda.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: process.env.DATABASE_SSL === 'disable' ? false : { rejectUnauthorized: true },
});

const sha256 = (isi) => createHash('sha256').update(isi).digest('hex');

try {
  await client.connect();
  await client.query('CREATE SCHEMA IF NOT EXISTS app');
  await client.query(
    `CREATE TABLE IF NOT EXISTS ${LEDGER} (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`,
  );

  const tercatat = new Map(
    (await client.query(`SELECT name, checksum FROM ${LEDGER} ORDER BY name`)).rows.map((row) => [row.name, row.checksum]),
  );
  const berkas = readdirSync(DIR).filter((nama) => nama.endsWith('.sql')).sort();
  const tertinggi = tercatat.size ? [...tercatat.keys()].sort().at(-1) : '';
  let baru = 0;

  for (const nama of berkas) {
    const sql = readFileSync(join(DIR, nama), 'utf8');
    const checksum = sha256(sql);
    const lama = tercatat.get(nama);

    if (lama !== undefined) {
      if (lama !== checksum) {
        throw new Error(`${nama} diubah setelah pernah diterapkan. Tulis berkas migrasi baru, jangan edit yang lama.`);
      }
      continue;
    }

    if (tertinggi && nama < tertinggi) {
      throw new Error(`${nama} menyelip di belakang ${tertinggi} yang sudah diterapkan. Pakai prefix waktu baru, jangan menyisip di tengah.`);
    }

    if (kering) {
      console.log(`akan diterapkan: ${nama}`);
      baru += 1;
      continue;
    }

    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query(`INSERT INTO ${LEDGER} (name, checksum) VALUES ($1, $2)`, [nama, checksum]);
      await client.query('COMMIT');
      console.log(`diterapkan: ${nama}`);
      baru += 1;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`${nama} gagal: ${error.message}`);
    }
  }

  console.log(baru ? `${baru} migrasi baru${kering ? ' (dry-run, tidak ada perubahan)' : ''}.` : 'Semua migrasi sudah diterapkan; tidak ada perubahan.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
