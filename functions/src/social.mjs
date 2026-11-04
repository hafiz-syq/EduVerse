// Diskusi per modul: tanya, jawab, pilih jawaban terbaik, upvote, dan laporkan.
// Nama penulis diambil satu per satu karena query satu tabel tidak mendukung JOIN.

import { fail, isUuid, text, rateLimit } from './core.mjs';
import { XP } from './xp.mjs';

export function createSocial({ store, xp, identity }) {
  const nameCache = new Map();

  async function authorOf(userId) {
    if (!userId) return { id: '', name: 'Anonim', picture: '', rank_key: 'pemula' };
    if (nameCache.has(userId)) return nameCache.get(userId);
    const row = await store.one('users', 'id,name,picture', [['id', userId]]);
    const state = row ? await store.one('user_state', 'rank_key,xp', [['user_id', userId]]) : null;
    const value = { id: userId, name: row?.name ?? 'Pengguna', picture: row?.picture ?? '', rank_key: state?.rank_key ?? 'pemula' };
    nameCache.set(userId, value);
    return value;
  }

  async function moduleIdBySlug(slug) {
    const module = await store.one('modules', 'id,slug,title', [['slug', slug]]);
    if (!module) fail('not_found', 404);
    return module;
  }

  async function list(moduleSlug, user) {
    const module = await moduleIdBySlug(moduleSlug);
    const threads = await store.list('threads', 'id,title,created_at,last_activity_at,answer_count,accepted_post_id,pinned,locked,user_id', [['module_id', module.id]], { column: 'last_activity_at', ascending: false }, 60);
    const withAuthors = [];
    for (const thread of threads.filter((t) => t.title)) {
      withAuthors.push({ ...thread, author: await authorOf(thread.user_id), answered: Boolean(thread.accepted_post_id) });
    }
    return { module: { id: module.id, slug: module.slug, title: module.title }, threads: withAuthors, can_post: Boolean(user) };
  }

  async function detail(threadId, user) {
    if (!isUuid(threadId)) fail('invalid_input', 400);
    const thread = await store.one('threads', 'id,module_id,user_id,title,body,created_at,accepted_post_id,pinned,locked', [['id', threadId]]);
    if (!thread) fail('not_found', 404);
    const posts = await store.list('posts', 'id,thread_id,user_id,body,created_at,accepted', [['thread_id', threadId]], { column: 'created_at', ascending: true }, 100);
    const votes = await store.list('votes', 'post_id,user_id,value', [['thread_id', threadId]], undefined, 800);
    const totals = new Map();
    const mine = new Map();
    for (const vote of votes) {
      totals.set(vote.post_id, (totals.get(vote.post_id) ?? 0) + vote.value);
      if (user && vote.user_id === user.id) mine.set(vote.post_id, vote.value);
    }
    const module = await store.one('modules', 'id,slug,title', [['id', thread.module_id]]);
    const mapped = [];
    for (const post of posts) mapped.push({ ...post, author: await authorOf(post.user_id), votes: totals.get(post.id) ?? 0, my_vote: mine.get(post.id) ?? 0 });
    return {
      thread: { ...thread, module: module ?? null, my_thread: Boolean(user && user.id === thread.user_id), can_accept: Boolean(user && (user.id === thread.user_id || user.role === 'admin')) },
      question: { id: thread.id, kind: 'question', body: thread.body, author: await authorOf(thread.user_id), votes: totals.get(thread.id) ?? 0, created_at: thread.created_at },
      posts: mapped,
      answered: Boolean(thread.accepted_post_id),
    };
  }

  async function createThread(user, body) {
    if (!isUuid(body?.module_id) || !text(body?.title, 8, 140) || !text(body?.body, 10, 4000)) fail('invalid_input', 400);
    const limit = await rateLimit(store, { action: 'thread', principal: user.id, limit: 6, windowSeconds: 3600 });
    if (!limit.allowed) fail('rate_limited', 429);
    const module = await store.one('modules', 'id,slug', [['id', body.module_id]]);
    if (!module) fail('not_found', 404);
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    await store.insert('threads', { id, module_id: module.id, user_id: user.id, title: body.title.trim(), body: body.body.trim(), created_at: now, last_activity_at: now, accepted_post_id: null, pinned: false, locked: false, answer_count: 0 });
    await xp.touchStreak(user);
    return { thread_id: id, module_slug: module.slug };
  }

  async function createPost(user, body) {
    if (!isUuid(body?.thread_id) || !text(body?.body, 4, 4000)) fail('invalid_input', 400);
    const limit = await rateLimit(store, { action: 'post', principal: user.id, limit: 20, windowSeconds: 3600 });
    if (!limit.allowed) fail('rate_limited', 429);
    const thread = await store.one('threads', 'id,locked,answer_count,last_activity_at,user_id,module_id', [['id', body.thread_id]]);
    if (!thread) fail('not_found', 404);
    if (thread.locked) fail('thread_locked', 409);
    const id = crypto.randomUUID();
    await store.insert('posts', { id, thread_id: thread.id, user_id: user.id, body: body.body.trim(), created_at: new Date().toISOString(), accepted: false });
    await store.patch('threads', { answer_count: thread.answer_count + 1, last_activity_at: new Date().toISOString() }, [['id', thread.id]], 'id');
    const posted = await xp.award(user, 'answer_post', id, XP.answer_post);
    const streak = await xp.touchStreak(user);
    return { post_id: id, awarded: posted.granted, streak: streak.streak };
  }

  async function vote(user, body) {
    if (!isUuid(body?.post_id) || ![-1, 0, 1].includes(body?.value)) fail('invalid_input', 400);
    const thread = await store.one('threads', 'id', [['id', body.thread_id]]);
    if (!thread) fail('not_found', 404);
    const post = body.post_id === thread.id ? { id: thread.id } : await store.one('posts', 'id,user_id', [['id', body.post_id], ['thread_id', thread.id]]);
    if (!post) fail('not_found', 404);
    if (user.id === post.user_id) fail('self_vote', 409);
    const existing = await store.one('votes', 'post_id,user_id,value', [['thread_id', thread.id], ['post_id', body.post_id], ['user_id', user.id]]);
    if (body.value === 0) {
      if (existing) await store.patch('votes', { value: 0, created_at: new Date().toISOString() }, [['thread_id', thread.id], ['post_id', body.post_id], ['user_id', user.id]], 'post_id');
    } else if (existing) {
      await store.patch('votes', { value: body.value, created_at: new Date().toISOString() }, [['thread_id', thread.id], ['post_id', body.post_id], ['user_id', user.id]], 'post_id');
    } else {
      await store.insert('votes', { thread_id: thread.id, post_id: body.post_id, user_id: user.id, value: body.value, created_at: new Date().toISOString() });
    }
    const all = await store.list('votes', 'post_id,value', [['thread_id', thread.id]], undefined, 800);
    return { post_id: body.post_id, votes: all.filter((v) => v.post_id === body.post_id).reduce((sum, v) => sum + v.value, 0) };
  }

  /** Hanya pemilik topik atau admin. XP penjawab diberikan sekali (ref post id). */
  async function accept(user, body) {
    if (!isUuid(body?.thread_id) || !isUuid(body?.post_id)) fail('invalid_input', 400);
    const thread = await store.one('threads', 'id,user_id,accepted_post_id', [['id', body.thread_id]]);
    if (!thread) fail('not_found', 404);
    if (user.role !== 'admin' && user.id !== thread.user_id) fail('forbidden', 403);
    const post = await store.one('posts', 'id,user_id,thread_id', [['id', body.post_id], ['thread_id', thread.id]]);
    if (!post) fail('not_found', 404);
    if (thread.accepted_post_id) await store.patch('posts', { accepted: false }, [['id', thread.accepted_post_id]], 'id');
    await store.patch('posts', { accepted: true }, [['id', post.id]], 'id');
    await store.patch('threads', { accepted_post_id: body.unaccept ? null : post.id, last_activity_at: new Date().toISOString() }, [['id', thread.id]], 'id');
    if (body.unaccept) return { ok: true, awarded: 0 };
    const answerer = await identity.attachState(await store.one('users', 'id,name,email,picture,role', [['id', post.user_id]]));
    const awarded = answerer ? await xp.award(answerer, 'answer_accepted', post.id, XP.answer_accepted, { thread_id: thread.id }) : { granted: 0 };
    return { ok: true, awarded: awarded.granted, answerer: answerer?.name ?? '' };
  }

  async function flag(user, body) {
    if (!isUuid(body?.target_id) || !text(body?.reason, 3, 300)) fail('invalid_input', 400);
    await store.insert('flags', { id: crypto.randomUUID(), target_kind: body.target_kind === 'thread' ? 'thread' : 'post', target_id: body.target_id, reporter_id: user.id, reason: body.reason.trim(), status: 'open', created_at: new Date().toISOString() });
    return { ok: true };
  }

  async function mine(user) {
    const threads = await store.list('threads', 'id,title,module_id,created_at,answer_count,accepted_post_id', [['user_id', user.id]], { column: 'created_at', ascending: false }, 50);
    const posts = await store.list('posts', 'id,thread_id,body,created_at,accepted', [['user_id', user.id]], { column: 'created_at', ascending: false }, 50);
    return { threads: threads.filter((t) => t.title), posts: posts.filter((p) => p.body) };
  }

  return { accept, createPost, createThread, detail, flag, list, mine, vote };
}
