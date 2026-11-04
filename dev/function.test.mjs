// Asap uji Function EduVerse yang berjalan di Node (Deno belum tersedia di mesin ini).
// Semua request masuk lewat router yang sama dengan produksi; hanya DB dan storage yang tiruan.
import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { application } from '../functions/src/application.mjs';
import { typedResponse } from '../functions/src/core.mjs';
import { createFakeDb } from './fake-db.mjs';
import { parseMigrations } from './schema.mjs';

const BASE = 'http://eduverse.test';
const PREFIX = '/functions/v1/app';
const ACCOUNTS = { 'learner-a': 'Rangga', 'learner-b': 'Wisnu', admin: 'Hafiz' };
const SCHEMA = parseMigrations(join(import.meta.dirname, '..', 'migrations'));

function createClient() {
  const db = createFakeDb(SCHEMA);
  const storage = {
    async createSignedUrl(path) { return { signedUrl: `/dev-assets/${path}` }; },
    async createSignedUploadUrl(path) { return { signedUrl: `/dev-assets/${path}?put=1`, path }; },
  };
  const contextUser = (ctx) => {
    const key = ctx.request.headers.get('x-dev-account');
    return key && ACCOUNTS[key] ? { user_id: `dev-${key}`, name: ACCOUNTS[key], picture: '' } : null;
  };
  const handle = application({ db, storage, env: { APP_ADMIN_IDENTITIES: 'qoder:dev-admin', APP_SESSION_SECRET: 'test-only-session-secret-0123456789' }, contextUser });
  const call = async (method, path, { account, body, origin = BASE, mount = PREFIX } = {}) => {
    const headers = { origin };
    if (account) headers['x-dev-account'] = account;
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
      return { status: failure.status, json: await failure.json() };
    }
    return { status: response.status, json: await response.json().catch(() => null) };
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

test('katalog dan kesehatan layanan bisa dibaca tanpa login', async () => {
  const { call } = createClient();
  const health = await call('GET', '/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.json.ok, true);
  assert.equal(health.json.providers.platform, true);
  assert.equal(health.json.providers.google, false);

  const catalog = await call('GET', '/api/catalog');
  assert.equal(catalog.status, 200);
  assert.ok(catalog.json.length >= 3, 'seed minimal tiga kursus');
  const module = catalog.json[0].modules[0];
  assert.ok(module.bank, 'setiap modul punya bank soal');
  assert.equal(module.lessons.length > 0, true);

  const detail = await call('GET', `/api/module/${module.slug}`);
  assert.equal(detail.status, 200);
  assert.ok(detail.json.module.lessons[0].body.blocks.length > 0);
});

test('rute privat menolak anonim, lalu memberi XP saat progres dicatat', async () => {
  const { call } = createClient();
  const catalog = await call('GET', '/api/catalog');
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

test('kuis: soal dikirim tanpa kunci, nilai dihitung server', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog');
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
  const catalog = await call('GET', '/api/catalog');
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

test('diskusi: tanya, jawab, dan terima jawaban terbaik', async () => {
  const { call, db } = createClient();
  const catalog = await call('GET', '/api/catalog');
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

  const detail = await call('GET', `/api/thread/${threadId}`);
  assert.equal(detail.json.answered, true);
  assert.equal(detail.json.posts[0].accepted, true);
  assert.equal(detail.json.posts[0].votes, 1);
  assert.equal(detail.json.thread.can_accept, false, 'pengunjung lain tidak bisa menerima');

  const list = await call('GET', `/api/discussion/${catalog.json[0].modules[0].slug}`);
  assert.equal(list.json.threads[0].answer_count, 1);
  assert.equal(list.json.can_post, false, 'anonym hanya membaca');
});

test('Uji Kompetensi: jendela live, soal identik, papan kelas, penyelesaian malas', async () => {
  const { call, db } = createClient();
  const arena = await call('GET', '/api/arena');
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
    const board = await call('GET', `/api/arena/${tournament.id}/leaderboard`);
    assert.equal(board.json.tournament.derived_status, 'closed');
    const champion = await call('GET', '/api/session', { account: 'learner-a' });
    const xpAfterPrize = champion.json.user.xp;
    await call('GET', `/api/arena/${tournament.id}/leaderboard`);
    const again = await call('GET', '/api/session', { account: 'learner-a' });
    assert.equal(again.json.user.xp, xpAfterPrize, 'hadiah peringkat dibayar sekali walau papan dibaca ulang');
  });

  const allTime = await call('GET', '/api/arena/alltime');
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
  const catalog = await call('GET', '/api/catalog');
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
