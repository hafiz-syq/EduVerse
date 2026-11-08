// Tes titik masuk Vercel Function di Node, tanpa cloud dan tanpa Postgres asli.
// Dua hal yang dijaga terpisah:
//   1. Bentuk ekspor api/index.mjs (Web `fetch`) meneruskan rute /api/... ke router
//      yang sama, dan kegagalan koneksi database menjadi JSON 503 — bukan tumpukan galat.
//      Rute publiknya "/api"; seluruh "/api/..." masuk lewat rewrite di vercel.json,
//      dan kontrak itu dikunci dev/route-sync.test.mjs.
//   2. Jembatan (req,res) Node yang ditiru apa adanya: cookie, body, content-type dan
//      status JSON tetap utuh kalau request dibangun ulang dari IncomingMessage, jadi
//      bentuk handler Node lama pun tidak akan kehilangan sesi.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { test } from 'node:test';

process.env.DATABASE_URL = 'postgres://eduverse:rahasia-uji@127.0.0.1:1/eduverse';
process.env.DATABASE_SSL = 'disable';
process.env.APP_SESSION_SECRET = 'rahasia-uji-cukup-panjang-0123456789';
process.env.APP_ADMIN_IDENTITIES = '';

const modul = await import('../api/index.mjs');
const titikMasuk = modul.default;

const panggil = (path, init) => titikMasuk.fetch(new Request(`https://eduverse.test${path}`, init));

test('titik masuk Vercel hanya mengekspor handler Web fetch, tanpa config jalur lama', () => {
  assert.equal(typeof titikMasuk.fetch, 'function');
  assert.equal(modul.config, undefined, 'rute diambil dari nama berkas, bukan config.path');
});

test('/api/health dijawab tanpa menyentuh database', async () => {
  const respons = await panggil('/api/health');
  assert.equal(respons.status, 200);
  const body = await respons.json();
  assert.equal(body.ok, true);
  assert.equal(body.providers.google, false);
  assert.equal(body.providers.platform, false);
});

test('katalog dengan koneksi mati menjadi 503 database_unavailable, bukan kebocoran galat', async () => {
  const respons = await panggil('/api/catalog');
  assert.equal(respons.status, 503);
  assert.equal(respons.headers.get('cache-control'), 'no-store');
  const body = await respons.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, 'database_unavailable');
  assert.match(body.request_id, /^vc-/);
  assert.doesNotMatch(JSON.stringify(body), /127\.0\.0\.1|ECONNREFUSED|at .*\.mjs/);
});

test('prefiks lama sengaja masih dikenali selama Netlify dan Vercel hidup berdampingan', async () => {
  const lama = await panggil('/functions/v1/app/api/health');
  assert.equal(lama.status, 200, 'router dipakai bersama; rute Vercel hanya menambah bentuk /api');

  const asing = await panggil('/api/bukan-endpoint');
  assert.equal(asing.status, 404);

  // Seed dicek lebih dulu daripada login (application.mjs:252), jadi dengan koneksi mati
  // yang terbukti di sini adalah penjaga asal mutasi bekerja lewat titik masuk baru.
  const lintasAsal = await panggil('/api/quiz/start', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'http://situs-lain.test' },
    body: '{}',
  });
  assert.equal(lintasAsal.status, 403);
  assert.equal((await lintasAsal.json()).error, 'origin_mismatch');
});

test('jembatan (req,res) Node meneruskan cookie, body, dan status galat JSON', async () => {
  const terlihat = [];
  const server = createServer((req, res) => {
    const chunks = [];
    req.on('data', (potong) => chunks.push(potong));
    req.on('end', async () => {
      const isi = Buffer.concat(chunks);
      const headers = new Headers();
      for (const [nama, nilai] of Object.entries(req.headers)) {
        if (Array.isArray(nilai)) for (const satu of nilai) headers.append(nama, satu);
        else headers.set(nama, String(nilai));
      }
      // Host diambil dari header, seperti platform menyusun URL mutlak permintaan.
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : isi,
      });
      // Duplikat dibaca setelah handler memakai yang asli: bukti body benar-benar mengalir.
      terlihat.push(request.clone());
      const respons = await titikMasuk.fetch(request);
      const cookies = (respons.headers.getSetCookie?.() ?? []).map((satu) =>
        satu.replace('__Host-ev_session', 'ev_dev_session').replace(/;\s*Secure/i, ''));
      const header = Object.fromEntries(respons.headers.entries());
      // Cookie harus masuk sebelum writeHead: lihat tes terakhir di berkas ini.
      if (cookies.length) header['set-cookie'] = cookies;
      res.writeHead(respons.status, header);
      res.end(Buffer.from(await respons.arrayBuffer()));
    });
  });
  await new Promise((selesai) => server.listen(0, '127.0.0.1', selesai));
  const asal = `http://127.0.0.1:${server.address().port}`;
  try {
    const gagal = await fetch(`${asal}/api/catalog`, {
      headers: { cookie: '__Host-ev_session=abc', origin: asal },
    });
    assert.equal(gagal.status, 503);
    assert.equal((await gagal.json()).error, 'database_unavailable');
    assert.equal(terlihat.at(-1).headers.get('cookie'), '__Host-ev_session=abc', 'cookie sampai ke handler');

    const kirim = await fetch(`${asal}/api/progress`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: asal, cookie: '__Host-ev_session=abc' },
      body: JSON.stringify({ lesson_id: 'l-1', done: true }),
    });
    assert.equal(kirim.status, 503, 'koneksi mati terbukti sebagai JSON, bukan 500 berhalaman');
    assert.equal((await kirim.json()).error, 'database_unavailable');
    assert.deepEqual(await terlihat.at(-1).json(), { lesson_id: 'l-1', done: true }, 'body utuh setelah konversi');

    const lintasAsal = await fetch(`${asal}/api/progress`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://situs-lain.test', cookie: '__Host-ev_session=abc' },
      body: JSON.stringify({ lesson_id: 'l-1', done: true }),
    });
    assert.equal(lintasAsal.status, 403, 'penjaga asal bekerja lewat socket Node nyata');
    assert.equal((await lintasAsal.json()).error, 'origin_mismatch');
  } finally {
    await new Promise((selesai) => server.close(selesai));
  }
});

// Dev server lokal pernah mati saat logout: writeHead() lalu setHeader('set-cookie')
// melempar ERR_HTTP_HEADERS_SENT, dan galat itu menjalar ke penangkap galat yang menulis
// header untuk kedua kalinya. Dua respons tanpa cookie (503/403 di atas) tidak pernah
// menyentuh jalur itu, jadi hanya bentuk ber-cookie yang diuji di sini.
test('jembatan Node menulis set-cookie sebelum writeHead, bukan sesudahnya', async () => {
  const KUKI = ['ev_a=1; Path=/; SameSite=Lax', 'ev_b=2; Path=/; HttpOnly'];
  // Dibangun dengan append() seperti oauth.mjs redirect(): mengirim array lewat
  // konstruktor Headers justru digabung jadi satu string dan cookie keduanya cacat.
  const buatRespons = () => {
    const respons = new Response('{"ok":true}', { status: 200, headers: { 'content-type': 'application/json' } });
    for (const satu of KUKI) respons.headers.append('set-cookie', satu);
    return respons;
  };

  const jalankan = async (susunan) => {
    let lempar = null;
    const server = createServer(async (_req, res) => {
      const respons = buatRespons();
      const cookies = respons.headers.getSetCookie();
      const header = Object.fromEntries(respons.headers.entries());
      try {
        if (susunan === 'salah') {
          res.writeHead(respons.status, header);
          res.setHeader('set-cookie', cookies);
        } else {
          header['set-cookie'] = cookies;
          res.writeHead(respons.status, header);
        }
        res.end(Buffer.from(await respons.arrayBuffer()));
      } catch (galat) {
        lempar = galat.code;
        res.destroy();
      }
    });
    await new Promise((selesai) => server.listen(0, '127.0.0.1', selesai));
    const asal = `http://127.0.0.1:${server.address().port}`;
    let diterima = [];
    try {
      const response = await fetch(asal).catch(() => null);
      diterima = response ? response.headers.getSetCookie() : [];
      return { lempar, status: response?.status ?? 0, diterima, isi: response ? await response.text().catch(() => '') : '' };
    } finally {
      await new Promise((selesai) => server.close(selesai));
    }
  };

  const benar = await jalankan('benar');
  assert.equal(benar.lempar, null, 'urutan yang benar tidak boleh melempar');
  assert.equal(benar.status, 200);
  assert.deepEqual(benar.diterima, KUKI, 'kedua cookie sampai ke klien apa adanya');
  assert.equal(benar.isi, '{"ok":true}', 'body tidak hilang karena header');

  const salah = await jalankan('salah');
  assert.equal(salah.lempar, 'ERR_HTTP_HEADERS_SENT', 'pola lama harus terbukti melempar, bukan sekadar dipercaya');
});
