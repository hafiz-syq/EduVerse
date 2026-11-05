// Tes titik masuk Netlify Function di Node, tanpa cloud dan tanpa Postgres asli.
// Yang dijaga: graf impor masih bisa dibundel (esbuild Node), environment dibaca,
// path /functions/v1/app/ dikenali, dan kegagalan koneksi DB menjadi JSON 503 —
// bukan tumpukan galat atau Response kosong.
import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.DATABASE_URL = 'postgres://eduverse:rahasia-uji@127.0.0.1:1/eduverse';
process.env.DATABASE_SSL = 'disable';
process.env.APP_SESSION_SECRET = 'rahasia-uji-cukup-panjang-0123456789';
process.env.APP_ADMIN_IDENTITIES = '';

const modul = await import('../netlify/functions/api.mjs');
const fungsi = modul.default;
const konfigurasi = modul.config;

const panggil = (path, init) =>
  fungsi(new Request(`https://eduverse.test${path}`, init), { requestId: 'uji-netlify' });

test('titik masuk Netlify memasang fungsi di path yang sama dengan frontend', () => {
  assert.equal(konfigurasi.path, '/functions/v1/app/*');
});

test('/api/health dijawab tanpa menyentuh database', async () => {
  const respons = await panggil('/functions/v1/app/api/health');
  assert.equal(respons.status, 200);
  const body = await respons.json();
  assert.equal(body.ok, true);
  assert.equal(body.providers.google, false);
  assert.equal(body.providers.github, false);
  assert.ok(Number.isFinite(Date.parse(body.server_time)));
});

test('koneksi database mati menjadi 503 database_unavailable, bukan kebocoran galat', async () => {
  const respons = await panggil('/functions/v1/app/api/catalog');
  assert.equal(respons.status, 503);
  const body = await respons.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, 'database_unavailable');
  assert.equal(body.request_id, 'uji-netlify');
  assert.doesNotMatch(JSON.stringify(body), /127\.0\.0\.1|ECONNREFUSED|at .*\.mjs/);
});

test('jalur yang bukan milik aplikasi tidak dianggap endpoint', async () => {
  const respons = await panggil('/functions/v1/app/not-a-route');
  assert.equal(respons.status, 404);
});
