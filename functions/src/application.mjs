// Router Function EduVerse. ctx dari gateway berisi request yang sudah diverifikasi.
// Keputusan "rute mana yang butuh login" hidup di sini, bukan di konfigurasi artefak.

import {
  AppError, applicationPath, errorJson, fail, isUuid, json, makeStore, readJson, requireMutationOrigin, text, clampInt,
} from './core.mjs';
import { createIdentity } from './identity.mjs';
import { createXp, XP } from './xp.mjs';
import { createContent } from './content.mjs';
import { createQuiz } from './quiz.mjs';
import { createSocial } from './social.mjs';
import { createArena } from './arena.mjs';
import { createAds } from './ads.mjs';
import { createPlayground } from './playground.mjs';
import { createOAuth } from './oauth.mjs';
import { bootstrap } from './seed.mjs';

const strip = (value, max = 4000) => (typeof value === 'string' ? value.slice(0, max) : '');

export function application({ db, storage, env = {}, contextUser }) {
  const store = makeStore(db);
  const identity = createIdentity({ store, env, userFromContext: contextUser });
  const xp = createXp({ store });
  const content = createContent({ store, xp });
  const quiz = createQuiz({ store, xp, identity });
  const social = createSocial({ store, xp, identity });
  const arena = createArena({ store, xp, identity });
  const ads = createAds({ store, storage });
  const code = createPlayground({ store, xp });
  const oauth = createOAuth({ env, identity });

  let seeding = null;
  function ensureSeeded() {
    if (!seeding) {
      seeding = bootstrap(store).catch((error) => {
        seeding = null;
        throw error;
      });
    }
    return seeding;
  }

  const auth = {
    google: Boolean(env.APP_GOOGLE_CLIENT_ID && env.APP_GOOGLE_CLIENT_SECRET),
    github: Boolean(env.APP_GITHUB_CLIENT_ID && env.APP_GITHUB_CLIENT_SECRET),
    platform: Boolean(contextUser),
  };

  async function overview(admin) {
    const [courses, modules, lessons, banks, questions, tournaments, flags, attempts] = await Promise.all([
      store.all('courses', 'id,slug,title', { column: 'order_no', ascending: true }, 30),
      store.all('modules', 'id,slug,title,course_id', { column: 'order_no', ascending: true }, 120),
      store.all('lessons', 'id,module_id,title,order_no', { column: 'order_no', ascending: true }, 400),
      store.all('banks', 'id,module_id,title', { column: 'created_at', ascending: true }, 120),
      store.all('questions', 'id,bank_id,prompt,order_no', { column: 'order_no', ascending: true }, 400),
      store.all('tournaments', 'id,key,title,starts_at,ends_at', { column: 'starts_at', ascending: false }, 20),
      store.all('flags', 'id,target_kind,target_id,reason,status,created_at', { column: 'created_at', ascending: false }, 60),
      store.all('attempts', 'id,user_id,bank_id,score,status,started_at', { column: 'started_at', ascending: false }, 60),
    ]);
    const metrics = await ads.metrics();
    return {
      counts: { courses: courses.length, modules: modules.length, lessons: lessons.length, banks: banks.length, questions: questions.length, tournaments: tournaments.length },
      open_flags: flags.filter((f) => f.status === 'open'),
      recent_attempts: attempts.slice(0, 20),
      ads: metrics,
      ranks: xp.ladder(),
      edited_by: admin.name,
    };
  }

  async function saveQuestion(admin, body) {
    if (!isUuid(body?.bank_id) || !text(body?.prompt, 6, 600)) fail('invalid_input', 400);
    if (!Array.isArray(body?.options) || body.options.length < 2 || body.options.length > 6) fail('invalid_input', 400);
    if (!clampInt(body?.answer, 0, body.options.length - 1)) fail('invalid_input', 400);
    const bank = await store.one('banks', 'id,module_id', [['id', body.bank_id]]);
    if (!bank) fail('not_found', 404);
    const row = {
      bank_id: bank.id,
      prompt: body.prompt.trim(),
      options: body.options.slice(0, 6).map((o) => strip(o, 240)),
      answer: body.answer,
      explanation: strip(body.explanation, 1200),
      order_no: clampInt(body.order_no, 1, 200) ? body.order_no : 1,
    };
    if (isUuid(body.id)) {
      await store.patch('questions', row, [['id', body.id], ['bank_id', bank.id]], 'id');
      return { id: body.id, ...row };
    }
    const id = crypto.randomUUID();
    await store.insert('questions', { id, ...row, created_at: new Date().toISOString() });
    return { id, ...row };
  }

  async function saveModule(admin, body) {
    if (!isUuid(body?.course_id) || !text(body?.slug, 3, 60) || !text(body?.title, 4, 120)) fail('invalid_input', 400);
    const course = await store.one('courses', 'id,slug', [['id', body.course_id]]);
    if (!course) fail('not_found', 404);
    const row = {
      course_id: course.id,
      slug: body.slug.trim().toLowerCase(),
      title: body.title.trim(),
      summary: strip(body.summary, 400),
      minutes: clampInt(body.minutes, 1, 600) ? body.minutes : 10,
      offline_ok: body.offline_ok !== false,
      order_no: clampInt(body.order_no, 1, 200) ? body.order_no : 1,
      published: body.published !== false,
    };
    if (isUuid(body.id)) {
      await store.patch('modules', row, [['id', body.id]], 'id');
      return { id: body.id, ...row };
    }
    const id = crypto.randomUUID();
    await store.insert('modules', { id, ...row, created_at: new Date().toISOString() });
    return { id, ...row };
  }

  async function saveBank(admin, body) {
    if (!isUuid(body?.module_id) || !text(body?.title, 4, 120)) fail('invalid_input', 400);
    const module = await store.one('modules', 'id,slug', [['id', body.module_id]]);
    if (!module) fail('not_found', 404);
    const row = {
      module_id: module.id,
      title: body.title.trim(),
      time_limit_seconds: clampInt(body.time_limit_seconds, 60, 3600) ? body.time_limit_seconds : 600,
      pass_score: clampInt(body.pass_score, 30, 100) ? body.pass_score : 70,
      published: body.published !== false,
    };
    if (isUuid(body.id)) {
      await store.patch('banks', row, [['id', body.id]], 'id');
      return { id: body.id, ...row };
    }
    const id = crypto.randomUUID();
    await store.insert('banks', { id, ...row, created_at: new Date().toISOString() });
    return { id, ...row };
  }

  async function moderate(admin, body) {
    if (!isUuid(body?.flag_id) || !['resolved', 'dismissed'].includes(body?.status)) fail('invalid_input', 400);
    await store.patch('flags', { status: body.status, resolved_at: new Date().toISOString(), resolved_by: admin.id }, [['id', body.flag_id]], 'id');
    return { ok: true };
  }

  async function handleProfile(user) {
    const [xpEvents, threads, posts, attempts] = await Promise.all([
      store.list('xp_events', 'kind,amount,ref_id,occurred_at', [['user_id', user.id]], { column: 'occurred_at', ascending: false }, 60),
      store.list('threads', 'id,title,module_id,created_at,accepted_post_id', [['user_id', user.id]], { column: 'created_at', ascending: false }, 30),
      store.list('posts', 'id,thread_id,body,created_at,accepted', [['user_id', user.id]], { column: 'created_at', ascending: false }, 30),
      store.list('attempts', 'id,bank_id,score,status,started_at,offline', [['user_id', user.id]], { column: 'started_at', ascending: false }, 40),
    ]);
    const catalog = await content.catalog(user);
    const downloads = await store.list('downloads', 'module_id,pack_hash,bytes,created_at', [['user_id', user.id]], { column: 'created_at', ascending: false }, 40);
    const accepted = posts.filter((p) => p.accepted).length;
    const lab = await code.summary(user);
    const badgeCount = [
      attempts.some((a) => a.score >= 90) && 'Jawap Kilat',
      accepted >= 1 && 'Penolong Pertama',
      user.streak >= 7 && 'Rajin 7 Hari',
      catalog.some((c) => c.percent === 100) && 'Tuntas Satu Kursus',
      user.xp >= 600 && 'Naik ke Madya',
    ].filter(Boolean);
    return {
      user,
      ladder: xp.ladder(),
      xp_recent: xpEvents.map((e) => ({ kind: e.kind, amount: e.amount, at: e.occurred_at })),
      activity: { threads: threads.length, answers: posts.length, accepted },
      attempts: attempts.slice(0, 20),
      downloads: downloads.filter((d) => d.module_id),
      lab,
      badges: badgeCount,
      course_progress: catalog.map((c) => ({ slug: c.slug, title: c.title, percent: c.percent })),
    };
  }

  const routes = [
    { method: 'GET', path: /^\/api\/health$/, auth: false, run: () => ({ ok: true, server_time: new Date().toISOString(), providers: auth }) },
    { method: 'GET', path: /^\/api\/session$/, auth: false, run: (_c, user) => ({ user, providers: auth }) },
    { method: 'POST', path: /^\/api\/auth\/logout$/, auth: true, run: async (_c, user) => {
      const cookie = await identity.endSession(_c.request);
      return json({ ok: true, signed_out: user.name }, 200, { 'set-cookie': cookie });
    } },
    { method: 'GET', path: /^\/api\/auth\/start$/, auth: false, run: (c) => oauth.start(c.query.get('provider') || 'google', c.request) },
    { method: 'GET', path: /^\/api\/auth\/callback$/, auth: false, run: (c) => oauth.finish(c.query.get('provider') || 'google', c.request, c.query) },

    // Kebijakan: materi, diskusi, dan arena hanya untuk akun. Halaman publik (`/` dan
    // `/masuk`) tidak boleh memanggil rute di blok ini — kalau memanggil, angkanya
    // hilang saat pengunjung belum masuk.
    { method: 'GET', path: /^\/api\/home$/, auth: true, run: (_c, user) => content.home(user) },
    { method: 'GET', path: /^\/api\/catalog$/, auth: true, run: (_c, user) => content.catalog(user) },
    { method: 'GET', path: /^\/api\/module\/([a-z0-9-]{3,60})$/, auth: true, run: (c, user, m) => content.moduleDetail(m[1], user) },
    { method: 'GET', path: /^\/api\/pack\/([a-z0-9-]{3,60})$/, auth: true, run: (c, user, m) => content.pack(m[1], user) },
    { method: 'POST', path: /^\/api\/progress$/, auth: true, run: (c, user) => content.markProgress(user, c.body) },
    { method: 'POST', path: /^\/api\/code\/run$/, auth: true, run: (c, user) => code.recordRun(user, c.body) },
    { method: 'GET', path: /^\/api\/ranks$/, auth: false, run: () => ({ ranks: xp.ladder() }) },
    { method: 'GET', path: /^\/api\/profile$/, auth: true, run: (_c, user) => handleProfile(user) },

    { method: 'POST', path: /^\/api\/quiz\/start$/, auth: true, run: (c, user) => quiz.start(user, c.body) },
    { method: 'POST', path: /^\/api\/quiz\/answer$/, auth: true, run: (c, user) => quiz.answer(user, c.body) },
    { method: 'POST', path: /^\/api\/quiz\/finish$/, auth: true, run: async (c, user) => {
      const result = await quiz.finish(user, c.body);
      if (!result.replayed && result.attempt.tournament_id) {
        const placed = await arena.settle(user, { tournament_id: result.attempt.tournament_id }, result.attempt);
        if (placed) result.placement = placed;
      }
      return result;
    } },
    { method: 'GET', path: /^\/api\/quiz\/history\/([0-9a-f-]{36})$/, auth: true, run: (c, user, m) => quiz.history(user, m[1]) },

    { method: 'GET', path: /^\/api\/discussion\/([a-z0-9-]{3,60})$/, auth: true, run: (c, user, m) => social.list(m[1], user) },
    { method: 'GET', path: /^\/api\/thread\/([0-9a-f-]{36})$/, auth: true, run: (c, user, m) => social.detail(m[1], user) },
    { method: 'GET', path: /^\/api\/discussion$/, auth: true, run: (_c, user) => social.mine(user) },
    { method: 'POST', path: /^\/api\/discussion\/thread$/, auth: true, run: (c, user) => social.createThread(user, c.body) },
    { method: 'POST', path: /^\/api\/discussion\/post$/, auth: true, run: (c, user) => social.createPost(user, c.body) },
    { method: 'POST', path: /^\/api\/discussion\/vote$/, auth: true, run: (c, user) => social.vote(user, c.body) },
    { method: 'POST', path: /^\/api\/discussion\/accept$/, auth: true, run: (c, user) => social.accept(user, c.body) },
    { method: 'POST', path: /^\/api\/discussion\/flag$/, auth: true, run: (c, user) => social.flag(user, c.body) },

    { method: 'GET', path: /^\/api\/arena$/, auth: true, run: (_c, user) => arena.list(user) },
    { method: 'GET', path: /^\/api\/arena\/weekly$/, auth: true, run: (_c, user) => arena.weekly(user) },
    { method: 'GET', path: /^\/api\/arena\/alltime$/, auth: true, run: (_c, user) => arena.allTime(user) },
    { method: 'GET', path: /^\/api\/arena\/([0-9a-f-]{36})\/leaderboard$/, auth: true, run: (c, _u, m) => arena.leaderboard(m[1]) },
    { method: 'GET', path: /^\/api\/arena\/([0-9a-f-]{36})\/history$/, auth: true, run: (c, user, m) => arena.history(user, m[1]) },
    { method: 'POST', path: /^\/api\/arena\/start$/, auth: true, run: (c, user) => arena.start(user, c.body) },

    { method: 'GET', path: /^\/api\/ads$/, auth: false, run: (c) => ads.list(c.query.get('slot') || undefined) },
    { method: 'POST', path: /^\/api\/ads\/event$/, auth: false, run: (c, user) => ads.event(user, c.body) },

    { method: 'GET', path: /^\/api\/admin\/overview$/, auth: 'admin', run: (_c, user) => overview(user) },
    { method: 'POST', path: /^\/api\/admin\/module$/, auth: 'admin', run: (c, user) => saveModule(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/lesson$/, auth: 'admin', run: (c, user) => content.editLesson(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/bank$/, auth: 'admin', run: (c, user) => saveBank(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/question$/, auth: 'admin', run: (c, user) => saveQuestion(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/ad$/, auth: 'admin', run: (c, user) => ads.save(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/ad-image$/, auth: 'admin', run: (c, user) => ads.signImage(user, c.body) },
    { method: 'POST', path: /^\/api\/admin\/moderate$/, auth: 'admin', run: (c, user) => moderate(user, c.body) },
  ];

  return async (ctx) => {
    const request = ctx.request;
    const pathname = new URL(request.url).pathname;
    const path = applicationPath(pathname);
    if (path === null) fail('not_found', 404);
    const url = new URL(request.url);
    if (request.method !== 'GET' && request.method !== 'POST') fail('method_not_allowed', 405);
    if (request.method === 'POST') requireMutationOrigin(request);

    let matched = null;
    let groups = null;
    for (const route of routes) {
      if (route.method !== request.method) continue;
      const m = route.path.exec(path);
      if (m) { matched = route; groups = m; break; }
    }
    if (!matched) fail('not_found', 404);

    if (path !== '/api/health') await ensureSeeded();

    const user = await identity.resolve(ctx);
    if (matched.auth === true && !user) fail('login_required', 401);
    if (matched.auth === 'admin' && user?.role !== 'admin') fail(user ? 'forbidden' : 'login_required', user ? 403 : 401);

    const body = request.method === 'POST' ? await readJson(request) : {};
    const payload = await matched.run({ request, body, query: url.searchParams, ctx }, user, groups);
    if (payload instanceof Response) return payload;
    return json(payload ?? { ok: true });
  };
}

export { AppError, errorJson };
