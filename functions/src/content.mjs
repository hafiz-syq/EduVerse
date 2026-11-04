// Katalog materi, pembaca modul, progres belajar, dan paket luring.
// Semua agregasi dihitung dari baris terbatas karena DB hanya bisa query satu tabel.

import { bootstrap } from './seed.mjs';
import { XP } from './xp.mjs';
import { isUuid, fail, clampInt, text } from './core.mjs';

const limitFor = (n) => n;

export function createContent({ store, xp }) {
  async function rawCatalog() {
    await bootstrap(store);
    const [courses, modules, lessons, banks] = await Promise.all([
      store.all('courses', 'id,slug,title,summary,level,order_no', { column: 'order_no', ascending: true }, 30),
      store.all('modules', 'id,course_id,slug,title,summary,order_no,minutes,offline_ok', { column: 'order_no', ascending: true }, limitFor(120)),
      store.all('lessons', 'id,module_id,title,order_no,minutes', { column: 'order_no', ascending: true }, limitFor(400)),
      store.all('banks', 'id,module_id,title,time_limit_seconds,pass_score', { column: 'created_at', ascending: true }, limitFor(120)),
    ]);
    return { courses, modules, lessons, banks };
  }

  async function progressOf(userId) {
    if (!userId) return [];
    return store.list('progress', 'lesson_id,done', [['user_id', userId]], undefined, 800);
  }

  function assemble(catalog, progress, user) {
    const done = new Set(progress.filter((p) => p.done).map((p) => p.lesson_id));
    return catalog.courses
      .filter((c) => c.title)
      .map((course) => {
        const courseModules = catalog.modules
          .filter((m) => m.course_id === course.id)
          .map((module) => {
            const moduleLessons = catalog.lessons.filter((l) => l.module_id === module.id);
            const finished = moduleLessons.filter((l) => done.has(l.id)).length;
            const bank = catalog.banks.find((b) => b.module_id === module.id) ?? null;
            return {
              id: module.id,
              slug: module.slug,
              title: module.title,
              summary: module.summary,
              minutes: module.minutes,
              offline_ok: module.offline_ok,
              lesson_count: moduleLessons.length,
              lessons: moduleLessons.map((l) => ({ id: l.id, title: l.title, minutes: l.minutes, done: done.has(l.id) })),
              bank: bank ? { id: bank.id, title: bank.title, time_limit_seconds: bank.time_limit_seconds, pass_score: bank.pass_score } : null,
              percent: moduleLessons.length ? Math.round((finished / moduleLessons.length) * 100) : 0,
              completed: moduleLessons.length > 0 && finished === moduleLessons.length,
            };
          });
        const totalLessons = courseModules.reduce((sum, m) => sum + m.lesson_count, 0);
        const doneLessons = courseModules.reduce((sum, m) => sum + m.lessons.filter((l) => l.done).length, 0);
        return {
          ...course,
          modules: courseModules,
          percent: totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0,
          lesson_count: totalLessons,
        };
      });
  }

  async function catalog(user) {
    const [catalogData, progress] = await Promise.all([rawCatalog(), progressOf(user?.id)]);
    return assemble(catalogData, progress, user);
  }

  async function moduleDetail(slug, user) {
    const catalogData = await rawCatalog();
    const module = catalogData.modules.find((m) => m.slug === slug);
    if (!module) fail('not_found', 404);
    const [full, lessons, bank, threads] = await Promise.all([
      store.one('modules', 'id,slug,title,summary,minutes,offline_ok,course_id', [['id', module.id]]),
      store.list('lessons', 'id,title,body,order_no,minutes', [['module_id', module.id]], { column: 'order_no', ascending: true }, 60),
      store.one('banks', 'id,title,time_limit_seconds,pass_score', [['module_id', module.id]]),
      store.list('threads', 'id,title,created_at,answer_count,accepted_post_id', [['module_id', module.id]], { column: 'last_activity_at', ascending: false }, 20),
    ]);
    const course = catalogData.courses.find((c) => c.id === module.course_id);
    const progress = await progressOf(user?.id);
    const done = new Set(progress.filter((p) => p.done).map((p) => p.lesson_id));
    return {
      module: {
        ...full,
        course: course ? { slug: course.slug, title: course.title, level: course.level } : null,
        lessons: lessons.map((l) => ({ ...l, body: l.body ?? { blocks: [] }, done: done.has(l.id) })),
        bank: bank ?? null,
        threads: threads.map((t) => ({ ...t, answered: Boolean(t.accepted_post_id) })),
      },
    };
  }

  async function markProgress(user, body) {
    if (!isUuid(body?.lesson_id)) fail('invalid_input', 400);
    const done = body.done !== false;
    const lesson = await store.one('lessons', 'id,module_id,title', [['id', body.lesson_id]]);
    if (!lesson) fail('not_found', 404);
    const existing = await store.one('progress', 'lesson_id,done', [['user_id', user.id], ['lesson_id', lesson.id]]);
    if (existing) {
      if (existing.done === done) return { granted: 0, already: true };
      await store.patch('progress', { done, updated_at: new Date().toISOString() }, [['user_id', user.id], ['lesson_id', lesson.id]], 'lesson_id');
    } else {
      await store.insert('progress', { user_id: user.id, lesson_id: lesson.id, done, updated_at: new Date().toISOString() });
    }
    if (!done) return { granted: 0 };
    const earned = await xp.award(user, 'lesson_done', lesson.id, XP.lesson_done, { title: lesson.title });
    let moduleEarned = { granted: 0, rank: null };
    const siblings = await store.list('lessons', 'id', [['module_id', lesson.module_id]], undefined, 60);
    const mine = await store.list('progress', 'lesson_id,done', [['user_id', user.id]], undefined, 800);
    const finished = new Set(mine.filter((p) => p.done).map((p) => p.lesson_id));
    if (siblings.length && siblings.every((l) => finished.has(l.id))) {
      moduleEarned = await xp.award(user, 'module_done', lesson.module_id, XP.module_done);
    }
    const streak = await xp.touchStreak(user);
    return { granted: earned.granted + moduleEarned.granted, rank: moduleEarned.rank ?? earned.rank, streak: streak.streak };
  }

  /** Paket luring: isi pelajaran + diskusi, TANPA kunci jawaban soal. */
  async function pack(slug, user) {
    const detail = await moduleDetail(slug, user);
    const module = detail.module;
    const posts = [];
    for (const thread of module.threads.slice(0, 10)) {
      const rows = await store.list('posts', 'id,body,created_at,accepted,user_id', [['thread_id', thread.id]], { column: 'created_at', ascending: true }, 20);
      posts.push({ thread_id: thread.id, title: thread.title, posts: rows });
    }
    const banks = module.bank ? await store.list('questions', 'id,prompt,options,order_no', [['bank_id', module.bank.id]], { column: 'order_no', ascending: true }, 40) : [];
    const hash = `${module.slug}-${new Date().toISOString().slice(0, 10)}`;
    if (user) {
      await store.insert('downloads', { id: crypto.randomUUID(), user_id: user.id, module_id: module.id, pack_hash: hash, bytes: JSON.stringify(detail).length, created_at: new Date().toISOString() });
    }
    return {
      pack: {
        hash,
        downloaded_at: new Date().toISOString(),
        module: { slug: module.slug, title: module.title, summary: module.summary, minutes: module.minutes, course: module.course },
        lessons: module.lessons,
        questions: banks.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
        discussion: posts,
      },
    };
  }

  async function home(user) {
    const courses = await catalog(user);
    const flat = courses.flatMap((c) => c.modules.map((m) => ({ ...m, course: { slug: c.slug, title: c.title } })));
    const inProgress = flat.filter((m) => m.percent > 0 && !m.completed).sort((a, b) => b.percent - a.percent)[0] ?? null;
    const next = flat.find((m) => m.percent === 0) ?? flat.filter((m) => !m.completed).sort((a, b) => a.percent - b.percent)[0] ?? null;
    const tournaments = await store.all('tournaments', 'id,key,title,starts_at,ends_at,status', { column: 'starts_at', ascending: true }, 20);
    const nowMs = Date.now();
    const live = tournaments.find((t) => new Date(t.starts_at).getTime() <= nowMs && new Date(t.ends_at).getTime() > nowMs) ?? null;
    const upcoming = tournaments.filter((t) => new Date(t.starts_at).getTime() > nowMs).slice(0, 2);
    return {
      continue: inProgress,
      next,
      courses: courses.map((c) => ({ slug: c.slug, title: c.title, level: c.level, percent: c.percent, module_count: c.modules.length, lesson_count: c.lesson_count })),
      totals: { modules: flat.length, lessons: flat.reduce((sum, m) => sum + m.lesson_count, 0), done: flat.reduce((sum, m) => sum + m.lessons.filter((l) => l.done).length, 0) },
      tournament: live ? { mode: 'live', ...live } : upcoming[0] ? { mode: 'upcoming', ...upcoming[0] } : null,
      stats: user ? { xp: user.xp, rank_title: user.rank_title, streak: user.streak } : null,
    };
  }

  async function editLesson(user, body) {
    if (!isUuid(body?.lesson_id) || !Array.isArray(body?.blocks)) fail('invalid_input', 400);
    if (!text(body.title, 3, 120)) fail('invalid_input', 400);
    const lesson = await store.one('lessons', 'id,module_id', [['id', body.lesson_id]]);
    if (!lesson) fail('not_found', 404);
    const blocks = body.blocks.slice(0, 60).map((b) => ({ type: ['p', 'h2', 'h3', 'code', 'list', 'tip'].includes(b.type) ? b.type : 'p', text: typeof b.text === 'string' ? b.text.slice(0, 4000) : '', lang: typeof b.lang === 'string' ? b.lang.slice(0, 20) : '', items: Array.isArray(b.items) ? b.items.slice(0, 30).map((i) => String(i).slice(0, 400)) : undefined }));
    await store.patch('lessons', { title: body.title.trim(), body: { blocks } }, [['id', lesson.id]], 'id');
    return { ok: true, lesson_id: lesson.id };
  }

  return { catalog, editLesson, home, markProgress, moduleDetail, pack };
}
