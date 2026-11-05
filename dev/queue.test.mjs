// Tes antrean tulis luring. Node tidak punya localStorage, jadi ditiru dengan Map dan
// fetch yang mencatat permintaan — tidak ada jaringan yang benar-benar dipakai.
import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

const kanvas = new Map();
globalThis.localStorage = {
  getItem: (key) => (kanvas.has(key) ? kanvas.get(key) : null),
  setItem: (key, value) => kanvas.set(key, String(value)),
  removeItem: (key) => kanvas.delete(key),
};

const permintaan = [];
let tolak = false;
globalThis.fetch = async (url, init) => {
  permintaan.push({ url: String(url), method: init?.method, body: init?.body ? JSON.parse(init.body) : undefined });
  if (tolak) throw new TypeError('offline');
  return new Response(JSON.stringify({ ok: true, granted: 40 }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};

// Node tidak memetakan "./api" ke "./api.ts" seperti Vite, jadi dipasang kait resolver
// yang menambahkan ekstensi .ts untuk impor relatif tanpa ekstensi di dalam lib/.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('./') && !/\.[a-z]{2,4}$/i.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        /* lanjutkan seperti biasa bila ternyata bukan berkas TS */
      }
    }
    return nextResolve(specifier, context);
  },
});

const antrean = await import('../lib/progress-queue.ts');
const KEY = 'ev_progress_queue';
const isiAntrean = () => JSON.parse(kanvas.get(KEY) ?? '[]');
const kosongkan = () => {
  permintaan.length = 0;
  tolak = false;
  kanvas.clear();
};

test('baris lama tanpa kunci jenis dipetakan sebagai pelajaran, bukan dibuang', async () => {
  kosongkan();
  kanvas.set(KEY, JSON.stringify([{ lesson_id: 'l-1', done: true }]));
  assert.equal(antrean.pendingProgress(), 1);
  const terkirim = await antrean.flushProgress();
  assert.equal(terkirim, 1);
  assert.equal(permintaan[0].url.endsWith('/functions/v1/app/api/progress'), true);
  assert.deepEqual(permintaan[0].body, { lesson_id: 'l-1', done: true });
  assert.equal(kanvas.get(KEY), '[]');
});

test('entri rusak dianggap tidak ada, bukan membuat flush gagal', async () => {
  kosongkan();
  kanvas.set(KEY, '{bukan json');
  assert.equal(antrean.pendingProgress(), 0);
  assert.equal(await antrean.flushProgress(), 0);
  kanvas.set(KEY, JSON.stringify([{ junk: true }, { lesson_id: 'l-2', done: false }]));
  assert.equal(antrean.pendingProgress(), 1, 'entri tak dikenal disaring, yang sah tetap ada');
});

test('hasil lab ditahan saat luring dan dikirim dengan bentuk yang benar', async () => {
  kosongkan();
  tolak = true;
  antrean.queueProgress('l-3', true);
  antrean.queueCodeRun('warna-brand', 'web', 8123);
  assert.equal(await antrean.flushProgress(), 0, 'semua gagal terkirim');
  assert.equal(antrean.pendingProgress(), 2, 'antrean tidak dibersihkan saat server tak terjangkau');

  tolak = false;
  assert.equal(await antrean.flushProgress(), 2);
  const kode = permintaan.find((item) => item.url.endsWith('/api/code/run'));
  assert.deepEqual(kode.body, { task_key: 'warna-brand', mode: 'web', passed: true, duration_ms: 8123 });
  assert.equal(antrean.pendingProgress(), 0);
});

test('tanda selesai dilipat per pelajaran, tiap pengiriman lab tetap terpisah', () => {
  kosongkan();
  antrean.queueProgress('l-4', true);
  antrean.queueProgress('l-4', false);
  assert.equal(isiAntrean().filter((item) => item.lesson_id === 'l-4').length, 1);
  assert.equal(isiAntrean()[0].done, false, 'nilai terakhir yang menang');

  antrean.queueCodeRun('sapa', 'js', 1000);
  antrean.queueCodeRun('sapa', 'js', 1000);
  antrean.queueCodeRun('sapa', 'js', 900);
  const lab = isiAntrean().filter((item) => item.jenis === 'code');
  assert.equal(lab.length, 2, 'pengiriman identik dilipat, durasi beda dihitung dua kali');
});

test('forgetQueued hanya menghapus baris pelajaran, menyisakan kiriman lab', () => {
  kosongkan();
  antrean.queueProgress('l-5', true);
  antrean.queueCodeRun('daftar', 'js', 2000);
  antrean.forgetQueued('l-5');
  const tersisa = isiAntrean();
  assert.equal(tersisa.length, 1);
  assert.equal(tersisa[0].jenis, 'code');
});
