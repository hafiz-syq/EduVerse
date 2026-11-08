// Asap uji Function EduVerse yang berjalan di Node (Deno belum tersedia di mesin ini).
// Semua request masuk lewat router yang sama dengan produksi; hanya DB dan storage yang tiruan.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { application } from '../functions/src/application.mjs';
import { TASK_KEYS } from '../functions/src/playground.mjs';
import { typedResponse } from '../functions/src/core.mjs';
import { createFakeDb } from './fake-db.mjs';
import { parseMigrations } from './schema.mjs';

const BASE = 'http://eduverse.test';
const PREFIX = '/functions/v1/app';
const ACCOUNTS = { 'learner-a': 'Rangga', 'learner-b': 'Wisnu', admin: 'Hafiz' };
const SCHEMA = parseMigrations(join(import.meta.dirname, '..', 'migrations'));

function createClient(envExtra = {}) {
  const db = createFakeDb(SCHEMA);
  const storage = {
    async createSignedUrl(path) { return { signedUrl: `/dev-assets/${path}` }; },
    async createSignedUploadUrl(path) { return { signedUrl: `/dev-assets/${path}?put=1`, path }; },
  };
  const contextUser = (ctx) => {
    const key = ctx.request.headers.get('x-dev-account');
    return key && ACCOUNTS[key] ? { user_id: `dev-${key}`, name: ACCOUNTS[key], picture: '' } : null;
  };
  const handle = application({ db, storage, env: { APP_ADMIN_IDENTITIES: 'qoder:dev-admin', APP_SESSION_SECRET: 'test-only-session-secret-0123456789', ...envExtra }, contextUser });
  const call = async (method, path, { account, body, origin = BASE, mount = PREFIX, cookie } = {}) => {
    const headers = { origin };
    if (account) headers['x-dev-account'] = account;
    if (cookie) headers.cookie = cookie;
    const init = { method, headers };
    if (body !== undefined) {
      headers['content-type'] = 'application/json';
      init.body = JSON.stringify(body);
    }
    // Ampul galat disalin dari functions/index.ts: AppError menjadi JSON bertipe dengan status aslinya.
    let response;
    try {
      response = await handle({ request: new Request(`${BASE}${mount}${path}`, init), requestId: 'test' });
    } catch (error) {
      // Ampul galat dipakai lewat core.typedResponse, sama dengan index.ts dan dev server.
      const failure = typedResponse(error, 'test');
      if (!failure) throw error;
      return { status: failure.status, headers: failure.headers, json: await failure.json() };
    }
    return { status: response.status, headers: response.headers, json: await response.json().catch(() => null) };
  };
  return { call, db };
}

// Jam dipindahkan lewat subclass Date, bukan hanya Date.now, karena sebagian kode
// membaca kalender dari `new Date()` (misalnya kunci minggu ISO papan mingguan).
function withNow(ms, run) {
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) { super(...(args.length ? args : [ms])); }
    static now() { return ms; }
  }
  globalThis.Date = FakeDate;
  return Promise.resolve().then(run).finally(() => { globalThis.Date = RealDate; });
}

const keysFor = (db, questionIds) => {
  const byId = new Map(db.__dump().questions.map((q) => [q.id, q]));
  return questionIds.map((id) => ({ question_id: id, chosen: byId.get(id).answer }));
};

test('kesehatan dan sesi publik, isi materi hanya untuk akun', async () => {
  const { call } = createClient();
  const health = await call('GET', '/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.json.ok, true);
  assert.equal(health.json.providers.platform, true);
  assert.equal(health.json.providers.google, false);

  // Dua rute ini satu-satunya yang boleh dipanggil halaman publik (landing dan halaman
  // masuk). Landing tidak menyentuh rute materi, jadi tidak ada angka yang hilang.
  const sesi = await call('GET', '/api/session');
  assert.equal(sesi.status, 200, 'halaman masuk butuh daftar penyedia tanpa akun');
  assert.equal(sesi.json.user, null);

  const masuk = await call('GET', '/api/catalog', { account: 'learner-a' });
  assert.equal(masuk.status, 200);
  assert.ok(masuk.json.length >= 3, 'seed minimal tiga kursus');
  const modul = masuk.json[0].modules[0];
  assert.ok(modul.bank, 'setiap modul punya bank soal');
  assert.equal(modul.lessons.length > 0, true);
  const slug = modul.slug;

  const detail = await call('GET', `/api/module/${slug}`, { account: 'learner-a' });
  assert.equal(detail.status, 200);
  assert.ok(detail.json.module.lessons[0].body.blocks.length > 0);

  for (const path of ['/api/home', '/api/catalog', `/api/module/${slug}`, `/api/discussion/${slug}`, '/api/arena', '/api/arena/alltime']) {
    const anonim = await call('GET', path);
    assert.equal(anonim.status, 401, `${path} tidak lagi terbuka untuk anonim`);
    assert.equal(anonim.json.error, 'login_required');
  }
});

// Peta jalan id seed. Angka-angka ini bukan milik file ini: database produksi sudah
// berisi baris dengan id tersebut (diukur via .dev/produksi-ids.json). Kalau sebuah
// perubahan menggeser satu saja, penjaga per baris mengira barisnya belum ada dan
// menyisipkan materi kembar — jadi kunciannya berjalan di sini, bukan di produksi.
test('peta id materi yang sudah tayang tidak bergeser saat modul baru ditambahkan', async () => {
  const { call, db } = createClient();
  assert.equal((await call('GET', '/api/catalog', { account: 'learner-a' })).status, 200);
  const dump = db.__dump();
  const id = (n) => `0f5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
  const punya = (baris) => new Set(baris.map((r) => r.id));
  const modul = punya(dump.modules);
  const pelajaran = punya(dump.lessons);
  const bank = punya(dump.banks);
  const soal = punya(dump.questions);

  for (let n = 1001; n <= 1006; n += 1) assert.ok(modul.has(id(n)), `modul tayang ${n} hilang`);
  for (let n = 1007; n <= 1025; n += 1) assert.ok(pelajaran.has(id(n)), `pelajaran tayang ${n} hilang`);
  for (const n of [1026, 1033, 1040]) assert.ok(bank.has(id(n)), `bank tayang ${n} hilang`);
  for (const [awal, akhir] of [[1027, 1032], [1034, 1039], [1041, 1046]]) {
    for (let n = awal; n <= akhir; n += 1) assert.ok(soal.has(id(n)), `soal tayang ${n} hilang`);
  }
  assert.equal(dump.lessons.length, 24, '19 pelajaran tayang + 5 pelajaran peta jalan');

  // Baris baru harus tinggal di bloknya sendiri (4xxx) agar counter 1xxx tidak bergeser.
  for (const n of [4001, 4002]) assert.ok(modul.has(id(n)), `modul peta jalan ${n} hilang`);
  for (let n = 4101; n <= 4105; n += 1) assert.ok(pelajaran.has(id(n)), `pelajaran peta jalan ${n} hilang`);
  const tabrakan = [...bank].filter((b) => pelajaran.has(b.id));
  assert.deepEqual(tabrakan, [], 'id bank tidak boleh dipakai ulang oleh pelajaran');
});

test('rute privat menolak anonim, lalu memberi XP saat progres dicatat', async () => {
  const { call } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const lesson = catalog.json[0].modules[0].lessons[0];

  const anon = await call('POST', '/api/progress', { body: { lesson_id: lesson.id, done: true } });
  assert.equal(anon.status, 401);
  assert.equal(anon.json.error, 'login_required');

  const saved = await call('POST', '/api/progress', { account: 'learner-a', body: { lesson_id: lesson.id, done: true } });
  assert.equal(saved.status, 200);
  assert.equal(saved.json.granted >= 12, true, 'pelajaran selesai memberi XP');

  const again = await call('POST', '/api/progress', { account: 'learner-a', body: { lesson_id: lesson.id, done: true } });
  assert.equal(again.json.granted, 0, 'progress yang sama tidak menghasilkan XP kedua');

  const session = await call('GET', '/api/session', { account: 'learner-a' });
  assert.equal(session.json.user.source, 'platform');
  assert.equal(session.json.user.rank_title, 'Pemula');
  assert.ok(session.json.user.xp > 0);
});

test('lab koding: hasil lulus tercatat sekali dan memberi XP code_pass', async () => {
  const { call, db } = createClient();

  const anon = await call('POST', '/api/code/run', { body: { task_key: 'sapa', mode: 'js', passed: true, duration_ms: 4200 } });
  assert.equal(anon.status, 401);
  assert.equal(anon.json.error, 'login_required');

  const lulus = await call('POST', '/api/code/run', { account: 'learner-a', body: { task_key: 'sapa', mode: 'js', passed: true, duration_ms: 4200 } });
  assert.equal(lulus.status, 200);
  assert.equal(lulus.json.granted, 40, 'XP code_pass = 40');
  assert.equal(lulus.json.attempts, 1);

  const ulang = await call('POST', '/api/code/run', { account: 'learner-a', body: { task_key: 'sapa', mode: 'js', passed: true, duration_ms: 3100 } });
  assert.equal(ulang.json.granted, 0, 'latihan yang sama tidak memberi XP kedua');
  assert.equal(ulang.json.attempts, 2, 'pengulangan tetap dihitung');

  const asing = await call('POST', '/api/code/run', { account: 'learner-a', body: { task_key: 'sihir', mode: 'js', passed: true } });
  assert.equal(asing.status, 400);
  assert.equal(asing.json.error, 'invalid_input', 'task_key di luar daftar latihan ditolak');

  const mode = await call('POST', '/api/code/run', { account: 'learner-a', body: { task_key: 'sapa', mode: 'kosakata', passed: true } });
  assert.equal(mode.status, 400);

  const runs = db.__dump().playground_runs;
  assert.equal(runs.length, 1, 'satu baris per (user, task_key)');
  assert.equal(runs[0].attempts, 2);
  assert.equal(runs[0].duration_ms, 3100, 'durasi terakhir yang disimpan');
  const hadiah = db.__dump().xp_events.filter((e) => e.kind === 'code_pass');
  assert.equal(hadiah.length, 1, 'xp_events hanya menampung code_pass pertama');

  const profile = await call('GET', '/api/profile', { account: 'learner-a' });
  assert.equal(profile.json.lab.passed, 1);
  assert.equal(profile.json.lab.total, TASK_KEYS.size);
});

test('daftar latihan di server sama persis dengan daftar di klien', () => {
  const sumber = readFileSync(join(import.meta.dirname, '..', 'lib', 'playground', 'tasks.ts'), 'utf8');
  const idKlien = [...sumber.matchAll(/^\s+id: "([a-z0-9-]+)",$/gm)].map((match) => match[1]);
  assert.ok(idKlien.length >= 8, `regex penangkap id hanya ketemu ${idKlien.length} latihan`);
  assert.deepEqual([...TASK_KEYS].sort(), [...new Set(idKlien)].sort());
});

test('kuis: soal dikirim tanpa kunci, nilai dihitung server', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const bank = catalog.json[0].modules[0].bank;

  const started = await call('POST', '/api/quiz/start', { account: 'learner-a', body: { bank_id: bank.id } });
  assert.equal(started.status, 200);
  assert.equal(started.json.questions.length > 0, true);
  assert.equal(started.json.questions.some((q) => 'answer' in q), false, 'kunci jawaban tidak pernah turun ke klien');
  assert.ok(started.json.attempt.deadline_at);

  const one = started.json.questions[0];
  const answered = await call('POST', '/api/quiz/answer', { account: 'learner-a', body: { attempt_id: started.json.attempt.id, question_id: one.id, chosen: 0 } });
  assert.equal(answered.status, 200);
  assert.equal(answered.json.late, false);

  const finished = await call('POST', '/api/quiz/finish', {
    account: 'learner-a',
    body: { attempt_id: started.json.attempt.id, answers: keysFor(db, started.json.questions.map((q) => q.id)) },
  });
  assert.equal(finished.status, 200);
  assert.equal(finished.json.attempt.score, 100);
  assert.equal(finished.json.attempt.status, 'pass');
  assert.equal(finished.json.awarded.practice, false);
  assert.equal(finished.json.awarded.xp >= 150, true, 'skor 100 masuk jalur quiz_top');
  assert.equal(finished.json.review.every((r) => typeof r.answer === 'number'), true, 'review membuka kunci setelah dinilai');

  const replay = await call('POST', '/api/quiz/finish', { account: 'learner-a', body: { attempt_id: started.json.attempt.id } });
  assert.equal(replay.json.replayed, true);
  assert.equal(replay.json.attempt.score, 100, 'finish ulang tidak mengubah nilai');
});

test('kuis lewat batas waktu dinilai sebagai latihan tanpa XP', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const bank = catalog.json[0].modules[1].bank ?? catalog.json[0].modules[0].bank;
  const started = await call('POST', '/api/quiz/start', { account: 'learner-b', body: { bank_id: bank.id } });
  const before = await call('GET', '/api/session', { account: 'learner-b' });

  const lateAt = Date.parse(started.json.attempt.deadline_at) + 60_000;
  const finished = await withNow(lateAt, () => call('POST', '/api/quiz/finish', {
    account: 'learner-b',
    body: { attempt_id: started.json.attempt.id, answers: keysFor(db, started.json.questions.map((q) => q.id)) },
  }));
  assert.equal(finished.json.attempt.status, 'late');
  assert.equal(finished.json.attempt.score, 100, 'tetapi dinilai');
  assert.equal(finished.json.awarded.practice, true);
  assert.equal(finished.json.awarded.xp, 0);

  const after = await call('GET', '/api/session', { account: 'learner-b' });
  assert.equal(after.json.user.xp, before.json.user.xp, 'XP tidak berubah untuk latihan');
});

test('bonus coba ditambatkan per bank sehingga XP kuis tidak bisa ditambang', async () => {
  const { call } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const bank = catalog.json[0].modules[0].bank;

  const kosong = await call('POST', '/api/quiz/start', { account: 'learner-a', body: { bank_id: bank.id } });
  const dinilaiKosong = await call('POST', '/api/quiz/finish', { account: 'learner-a', body: { attempt_id: kosong.json.attempt.id, answers: [] } });
  assert.equal(dinilaiKosong.json.attempt.score, 0);
  assert.equal(dinilaiKosong.json.awarded.xp, 0, 'percobaan tanpa satu pun jawaban tidak menambah XP');

  const sesi = await call('GET', '/api/session', { account: 'learner-a' });
  const xpSetelahKosong = sesi.json.user.xp;

  const salah = await call('POST', '/api/quiz/start', { account: 'learner-a', body: { bank_id: bank.id } });
  const jawabanSalah = salah.json.questions.map((q) => ({ question_id: q.id, chosen: 9 }));
  const percobaanPertama = await call('POST', '/api/quiz/finish', { account: 'learner-a', body: { attempt_id: salah.json.attempt.id, answers: jawabanSalah } });
  assert.equal(percobaanPertama.json.attempt.status, 'fail');
  assert.equal(percobaanPertama.json.awarded.xp, 15, 'sekali saja bonus ikut serta dibayar');

  const ulangi = await call('POST', '/api/quiz/start', { account: 'learner-a', body: { bank_id: bank.id } });
  const percobaanKedua = await call('POST', '/api/quiz/finish', { account: 'learner-a', body: { attempt_id: ulangi.json.attempt.id, answers: jawabanSalah } });
  assert.equal(percobaanKedua.json.awarded.xp, 0, 'percobaan berikutnya pada bank yang sama tidak menambah bonus');

  const akhir = await call('GET', '/api/session', { account: 'learner-a' });
  assert.equal(akhir.json.user.xp, xpSetelahKosong + 15, 'total XP bertambah tepat satu bonus');
});

test('diskusi: tanya, jawab, dan terima jawaban terbaik', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const moduleId = db.__dump().modules.find((m) => m.slug === catalog.json[0].modules[0].slug).id;

  const asked = await call('POST', '/api/discussion/thread', {
    account: 'learner-a',
    body: { module_id: moduleId, title: 'Kenapa const bisa diubah isinya?', body: 'Saya punya array const tapi bisa push. Bukankah const berarti tetap?' },
  });
  assert.equal(asked.status, 200);
  const threadId = asked.json.thread_id;

  const answered = await call('POST', '/api/discussion/post', {
    account: 'learner-b',
    body: { thread_id: threadId, body: 'Yang tetap itu binding-nya, bukan objek yang dirujuk. Pakai Object.freeze kalau isinya ikut dikunci.' },
  });
  assert.equal(answered.status, 200);
  assert.equal(answered.json.awarded, 8);

  const wrongOwner = await call('POST', '/api/discussion/accept', {
    account: 'learner-b',
    body: { thread_id: threadId, post_id: answered.json.post_id },
  });
  assert.equal(wrongOwner.status, 403, 'penjawab tidak bisa menerima jawabannya sendiri lewat akun lain');

  const vote = await call('POST', '/api/discussion/vote', {
    account: 'learner-a',
    body: { thread_id: threadId, post_id: answered.json.post_id, value: 1 },
  });
  assert.equal(vote.json.votes, 1);

  const accepted = await call('POST', '/api/discussion/accept', {
    account: 'learner-a',
    body: { thread_id: threadId, post_id: answered.json.post_id },
  });
  assert.equal(accepted.json.awarded, 60);

  const detail = await call('GET', `/api/thread/${threadId}`, { account: 'learner-b' });
  assert.equal(detail.json.answered, true);
  assert.equal(detail.json.posts[0].accepted, true);
  assert.equal(detail.json.posts[0].votes, 1);
  assert.equal(detail.json.thread.can_accept, false, 'pengunjung lain tidak bisa menerima');

  const slugTopik = catalog.json[0].modules[0].slug;
  const bacaAnonim = await call('GET', `/api/discussion/${slugTopik}`);
  assert.equal(bacaAnonim.status, 401, 'diskusi tidak lagi terbuka untuk pengunjung tanpa akun');
  assert.equal(bacaAnonim.json.error, 'login_required');

  const list = await call('GET', `/api/discussion/${slugTopik}`, { account: 'learner-b' });
  assert.equal(list.json.threads[0].answer_count, 1);
  assert.equal(list.json.can_post, true, 'peserta yang masuk boleh ikut menjawab');
});

test('vote dan tandai kunci tidak bisa dipakai menambang XP sendiri', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const moduleId = db.__dump().modules.find((m) => m.slug === catalog.json[0].modules[0].slug).id;

  const asked = await call('POST', '/api/discussion/thread', {
    account: 'learner-a',
    body: { module_id: moduleId, title: 'Bolehkah menjawab pertanyaan sendiri?', body: 'Sayaajukan pertanyaan ini lalu menjawabnya sendiri untuk menguji aturan XP.' },
  });
  const threadId = asked.json.thread_id;

  const voteSendiri = await call('POST', '/api/discussion/vote', {
    account: 'learner-a',
    body: { thread_id: threadId, post_id: threadId, value: 1 },
  });
  assert.equal(voteSendiri.status, 409, 'pemilik topik tidak bisa vote pada pertanyaannya sendiri');
  assert.equal(voteSendiri.json.error, 'self_vote');

  const answered = await call('POST', '/api/discussion/post', {
    account: 'learner-a',
    body: { thread_id: threadId, body: 'Jawaban sendiri: binding tetap, objek yang dirujuk boleh berubah.' },
  });
  const sebelum = await call('GET', '/api/session', { account: 'learner-a' });

  const diterima = await call('POST', '/api/discussion/accept', {
    account: 'learner-a',
    body: { thread_id: threadId, post_id: answered.json.post_id },
  });
  assert.equal(diterima.json.awarded, 0, 'menandai jawaban sendiri tetap boleh, tetapi tanpa XP hadiah');

  const sesudah = await call('GET', '/api/session', { account: 'learner-a' });
  assert.equal(sesudah.json.user.xp, sebelum.json.user.xp, 'total XP tidak bergerak');
});

test('Uji Kompetensi: jendela live, soal identik, papan kelas, penyelesaian malas', async () => {
  const { call, db } = createClient();
  const arena = await call('GET', '/api/arena', { account: 'learner-a' });
  assert.equal(arena.status, 200);
  assert.equal(arena.json.tournaments.length >= 2, true, 'jendela berjalan dan berikutnya');
  const tournament = arena.json.tournaments[0];
  const liveAt = Date.parse(tournament.starts_at) + 3_600_000;

  await withNow(liveAt, async () => {
    const before = await call('POST', '/api/arena/start', { account: 'learner-a', body: { tournament_id: tournament.id } });
    assert.equal(before.status, 200);
    assert.equal(before.json.questions.length, tournament.question_count);
    assert.equal(before.json.questions.some((q) => 'answer' in q), false);

    const second = await call('POST', '/api/arena/start', { account: 'learner-b', body: { tournament_id: tournament.id } });
    assert.deepEqual(
      second.json.questions.map((q) => q.id),
      before.json.questions.map((q) => q.id),
      'seed turnamen memberi urutan soal yang sama untuk semua peserta'
    );

    for (const [account, started] of [['learner-a', before], ['learner-b', second]]) {
      const finished = await call('POST', '/api/quiz/finish', {
        account,
        body: { attempt_id: started.json.attempt.id, answers: keysFor(db, started.json.questions.map((q) => q.id)) },
      });
      assert.equal(finished.json.attempt.tournament_id, tournament.id);
      assert.equal(finished.json.placement.tournament_id, tournament.id, 'penyelesaian papan berjalan otomatis');
    }

    const board = await call('GET', `/api/arena/${tournament.id}/leaderboard`, { account: 'learner-a' });
    assert.equal(board.json.entries.length, 2);
    assert.equal(board.json.entries[0].best_score, 100);
    assert.ok(board.json.entries[0].best_duration_ms <= board.json.entries[1].best_duration_ms, 'skor sama dimenangkan yang lebih cepat');

    const weekly = await call('GET', '/api/arena/weekly', { account: 'learner-a' });
    assert.equal(weekly.json.entries.some((e) => e.me), true);
  });

  const closedAt = Date.parse(tournament.ends_at) + 60_000;
  await withNow(closedAt, async () => {
    const board = await call('GET', `/api/arena/${tournament.id}/leaderboard`, { account: 'learner-b' });
    assert.equal(board.json.tournament.derived_status, 'closed');
    const champion = await call('GET', '/api/session', { account: 'learner-a' });
    const xpAfterPrize = champion.json.user.xp;
    await call('GET', `/api/arena/${tournament.id}/leaderboard`, { account: 'learner-b' });
    const again = await call('GET', '/api/session', { account: 'learner-a' });
    assert.equal(again.json.user.xp, xpAfterPrize, 'hadiah peringkat dibayar sekali walau papan dibaca ulang');
  });

  const allTime = await call('GET', '/api/arena/alltime', { account: 'learner-a' });
  assert.equal(allTime.json.entries[0].xp > 0, true);
  const history = await call('GET', `/api/arena/${tournament.id}/history`, { account: 'learner-a' });
  assert.equal(history.json.attempts.length, 1);
});

test('slot iklan: baca publik, event tercatat, konfigurasi hanya untuk pemilik', async () => {
  const { call } = createClient();
  const slots = await call('GET', '/api/ads');
  assert.equal(slots.status, 200);
  assert.equal(slots.json.slots.length, 4);
  assert.equal(slots.json.slots.every((s) => 'image_url' in s), true);

  const view = await call('POST', '/api/ads/event', { body: { slot_key: 'top-banner', kind: 'view' } });
  assert.equal(view.json.counted, true);
  const bad = await call('POST', '/api/ads/event', { body: { slot_key: 'popup', kind: 'view' } });
  assert.equal(bad.status, 400);

  const forbidden = await call('POST', '/api/admin/ad', { account: 'learner-a', body: { slot_key: 'in-feed', title: 'Iklan diri sendiri' } });
  assert.equal(forbidden.status, 403);

  const saved = await call('POST', '/api/admin/ad', {
    account: 'admin',
    body: { slot_key: 'in-feed', kind: 'card', title: 'Kelas Rust Online', sponsor: 'Rust ID', target_url: 'https://example.com/rust' },
  });
  assert.equal(saved.status, 200);
  const insecure = await call('POST', '/api/admin/ad', { account: 'admin', body: { slot_key: 'sidebar', title: 'Spam lama', target_url: 'http://telah-bajakan.example' } });
  assert.equal(insecure.status, 400, 'target iklan harus https');

  const listed = await call('GET', '/api/ads?slot=in-feed');
  assert.equal(listed.json.slots.length, 1);
  assert.equal(listed.json.slots[0].title, 'Kelas Rust Online');

  const overview = await call('GET', '/api/admin/overview', { account: 'admin' });
  assert.equal(overview.status, 200);
  assert.equal(overview.json.ranks.length, 4);
  assert.equal(overview.json.ads.slots.some((s) => s.slot_key === 'in-feed' && s.enabled), true);
  const notAdmin = await call('GET', '/api/admin/overview', { account: 'learner-b' });
  assert.equal(notAdmin.status, 403);
});

test('paket luring menurunkan isi modul tanpa kunci jawaban', async () => {
  const { call } = createClient();
  const catalog = await call('GET', '/api/catalog', { account: 'learner-a' });
  const slug = catalog.json[0].modules[0].slug;
  const anon = await call('GET', `/api/pack/${slug}`);
  assert.equal(anon.status, 401, 'paket tercatat per pengguna');

  const packed = await call('GET', `/api/pack/${slug}`, { account: 'learner-a' });
  assert.equal(packed.status, 200);
  assert.ok(packed.json.pack.lessons.length > 0);
  assert.equal(packed.json.pack.questions.every((q) => !('answer' in q)), true, 'kunci tidak ikut terbawa ke paket luring');

  const profile = await call('GET', '/api/profile', { account: 'learner-a' });
  assert.equal(profile.json.downloads.length, 1);
});

test('metode salah, rute tak dikenal, dan asal lintas situs ditolak', async () => {
  const { call } = createClient();
  assert.equal((await call('PUT', '/api/catalog')).status, 405);
  assert.equal((await call('GET', '/api/tidak-ada')).status, 404);
  assert.equal((await call('GET', '/api/health')).status, 200);

  const crossSite = await call('POST', '/api/progress', { account: 'learner-a', origin: 'http://situs-lain.test', body: {} });
  assert.equal(crossSite.status, 403, 'mutasi dari asal lain ditolak');
  assert.equal(crossSite.json.error, 'origin_mismatch');

  const wrongMount = await call('GET', '/api/health', { mount: '/functions/v1/lain' });
  assert.equal(wrongMount.status, 404, 'di luar mount Function tidak dilayani');
});

test('tanpa APP_SESSION_SECRET layanan menolak start, bukan menandatangani sesi dengan konstanta publik', () => {
  const db = createFakeDb(SCHEMA);
  assert.throws(
    () => application({ db, storage: {}, env: { APP_ADMIN_IDENTITIES: '' }, contextUser: () => null }),
    (error) => error.code === 'session_secret_missing' && error.status === 500,
  );
});

test('masuk Google: tanpa rahasia ditolak, dengan rahasia diarahkan ke penyedia, state wajib cocok', async () => {
  const kosong = createClient();
  const tertutup = await kosong.call('GET', '/api/auth/start?provider=google');
  assert.equal(tertutup.status, 503);
  assert.equal(tertutup.json.error, 'provider_unavailable');
  assert.equal((await kosong.call('GET', '/api/health')).json.providers.google, false);

  const siap = createClient({ APP_GOOGLE_CLIENT_ID: 'klien-test', APP_GOOGLE_CLIENT_SECRET: 'rahasia-test' });
  assert.equal((await siap.call('GET', '/api/health')).json.providers.google, true);

  const alih = await siap.call('GET', '/api/auth/start?provider=google');
  assert.equal(alih.status, 302);
  const target = new URL(alih.headers.get('location'));
  assert.equal(target.origin, 'https://accounts.google.com');
  assert.equal(target.searchParams.get('client_id'), 'klien-test');
  assert.equal(target.searchParams.get('redirect_uri'), `${BASE}${PREFIX}/api/auth/callback`);
  assert.ok(target.searchParams.get('state'), 'state anti-CSRDF dikirim');
  const cookie = alih.headers.get('set-cookie');
  assert.match(cookie, /ev_oauth=/);
  assert.match(cookie, /HttpOnly/);

  const palsu = await siap.call('GET', '/api/auth/callback?provider=google&code=abc&state=palsu', { cookie: 'ev_oauth=asli' });
  assert.equal(palsu.status, 400);
  assert.equal(palsu.json.error, 'state_mismatch');

  const tanpaKode = await siap.call('GET', '/api/auth/callback?provider=google&state=asli', { cookie: 'ev_oauth=asli' });
  assert.equal(tanpaKode.status, 400);
  assert.equal(tanpaKode.json.error, 'code_missing');
});

// Bentuk rute Vercel: Function mengambil request langsung di /api/... tanpa prefiks
// mount. Yang dijaga di sini adalah redirect_uri OAuth ikut turun ke /api, bukan
// masih menempel /functions/v1/app, karena penyedia menolak URI yang tidak terdaftar.
test('bentuk rute Vercel (/api tanpa prefiks) melayani router yang sama', async () => {
  const siap = createClient({ APP_GOOGLE_CLIENT_ID: 'klien-test', APP_GOOGLE_CLIENT_SECRET: 'rahasia-test' });

  const sehat = await siap.call('GET', '/api/health', { mount: '' });
  assert.equal(sehat.status, 200);
  assert.equal(sehat.json.ok, true);

  const katalog = await siap.call('GET', '/api/catalog', { mount: '', account: 'learner-a' });
  assert.equal(katalog.status, 200);
  assert.ok(katalog.json.length >= 3, 'katalog terbaca di rute baru');

  const alih = await siap.call('GET', '/api/auth/start?provider=google', { mount: '' });
  assert.equal(alih.status, 302);
  const target = new URL(alih.headers.get('location'));
  assert.equal(target.searchParams.get('redirect_uri'), `${BASE}/api/auth/callback`, 'redirect_uri ikut ke /api');
  const state = target.searchParams.get('state');
  assert.ok(state, 'state anti-CSRDF dikirim');
  assert.match(alih.headers.get('set-cookie'), /ev_oauth=/, 'cookie state terpasang di rute baru');

  const salahState = await siap.call('GET', '/api/auth/callback?provider=google&code=abc&state=palsu', {
    mount: '',
    cookie: `ev_oauth=${state}`,
  });
  assert.equal(salahState.status, 400);
  assert.equal(salahState.json.error, 'state_mismatch');

  const lintasAsal = await siap.call('POST', '/api/progress', {
    mount: '',
    origin: 'http://situs-lain.test',
    account: 'learner-a',
    body: {},
  });
  assert.equal(lintasAsal.status, 403, 'penjaga asal mutasi berlaku di rute baru');
  assert.equal(lintasAsal.json.error, 'origin_mismatch');

  const diLuarRute = await siap.call('GET', '/api/health', { mount: '/functions/v1/lain' });
  assert.equal(diLuarRute.status, 404, 'prefiks lama yang salah tetap bukan endpoint');
});

test('masuk Google paripurna: dua cookie terpisah, mendarat di /dashboard, sesi terbaca balik', async () => {
  const asli = globalThis.fetch;
  const ditukar = [];
  globalThis.fetch = async (url, init) => {
    const teks = String(url);
    if (teks.endsWith('/token')) {
      ditukar.push(Object.fromEntries(new URLSearchParams(init.body)));
      return Response.json({ access_token: 'token-akses' });
    }
    if (teks.includes('userinfo')) {
      return Response.json({ email: 'Baru@Kampus.test', name: 'Pelajar Baru', picture: 'https://contoh.test/a.png' });
    }
    return new Response('tidak distub', { status: 500 });
  };

  try {
    const klien = createClient({ APP_GOOGLE_CLIENT_ID: 'klien', APP_GOOGLE_CLIENT_SECRET: 'rahasia' });
    const alih = await klien.call('GET', '/api/auth/start?provider=google');
    const state = alih.headers.get('set-cookie').match(/ev_oauth=([^;]+)/)[1];

    const masuk = await klien.call('GET', `/api/auth/callback?provider=google&code=abc&state=${state}`, {
      cookie: `ev_oauth=${state}`,
    });

    assert.equal(masuk.status, 302);
    assert.equal(masuk.headers.get('location'), '/dashboard', 'sesi aktif dibuka di dasbor, bukan di landing');
    assert.equal(ditukar.length, 1, 'code ditukar sekali');
    assert.equal(ditukar[0].redirect_uri, `${BASE}${PREFIX}/api/auth/callback`, 'redirect_uri penukaran sama dengan yang didaftarkan');

    const cookies = masuk.headers.getSetCookie();
    assert.equal(cookies.length, 2, 'cookie sesi dan penghapusan state wajib jadi dua header sendiri');
    const sesi = cookies.find((satu) => satu.startsWith('__Host-ev_session='));
    const stateLama = cookies.find((satu) => satu.startsWith('ev_oauth='));
    assert.ok(sesi && stateLama, `cookie yang muncul: ${cookies.join(' | ')}`);
    assert.doesNotMatch(sesi, /ev_oauth/, 'nilai cookie sesi tidak boleh menelan cookie kedua');
    assert.match(sesi, /;\s*Secure\b/, '__Host- menuntut Secure');
    assert.match(sesi, /;\s*Path=\/(;|$)/, '__Host- menuntut Path=/');
    assert.doesNotMatch(sesi, /Domain=/, '__Host- tidak boleh punya Domain');
    assert.match(sesi, /Max-Age=\d{6,}/, 'sesi 30 hari, bukan cookie-per-session');
    assert.match(stateLama, /Max-Age=0/, 'state dibuang setelah dipakai');

    const token = sesi.split(';')[0].slice('__Host-ev_session='.length);
    const siapa = await klien.call('GET', '/api/session', { cookie: `__Host-ev_session=${token}` });
    assert.equal(siapa.status, 200);
    assert.equal(siapa.json.user.email, 'baru@kampus.test', 'email dinormalisasi lowercase');
    assert.equal(siapa.json.user.name, 'Pelajar Baru');
    assert.equal(siapa.json.user.role, 'pembelajar');
  } finally {
    globalThis.fetch = asli;
  }
});

