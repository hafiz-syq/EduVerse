// Identitas aplikasi: sesi cookie milik EduVerse, atau identitas platform Qoder dari gateway.
// Browser tidak pernah mengirim user id sebagai bukti; selalu diturunkan dari server.

import { AppError, cookieValue, hashToken, isUuid, randomToken, sessionCookie, clearCookie, RANK_LADDER } from './core.mjs';

const COOKIE = '__Host-ev_session';
const SESSION_TTL = 30 * 24 * 3600;

function projection(row, state) {
  return {
    id: row.id,
    name: row.name || 'Pengguna EduVerse',
    email: row.email || '',
    picture: row.picture || '',
    role: row.role || 'pembelajar',
    xp: state?.xp ?? 0,
    rank_key: state?.rank_key ?? 'pemula',
    rank_title: RANK_LADDER.find((r) => r.rank_key === (state?.rank_key ?? 'pemula'))?.title ?? 'Pemula',
    streak: state?.streak ?? 0,
    longest_streak: state?.longest_streak ?? 0,
    version: state?.version ?? 1,
  };
}

export function createIdentity({ store, env, userFromContext }) {
  // Tanpa Secret dari Site Settings kita menolak melayani sesi, alih-alih menandatangani
  // cookie dengan konstanta yang tertulis di kode sumber dan bisa dipalsukan siapa saja.
  const secret = env.APP_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new AppError('session_secret_missing', 500, 'APP_SESSION_SECRET wajib diisi, minimal 16 karakter.');
  }

  async function attachState(user) {
    const state = await store.one('user_state', 'user_id,xp,rank_key,streak,longest_streak,version', [['user_id', user.id]]);
    return projection(user, state);
  }

  async function upsert({ identity, email, name, picture }) {
    const existing = await store.one('users', 'id,identity,name,email,picture,role', [['identity', identity]]);
    const adminList = (env.APP_ADMIN_IDENTITIES || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (existing) {
      const patch = {};
      if (name && name !== existing.name) patch.name = name;
      if (email && email !== existing.email) patch.email = email;
      if (picture && picture !== existing.picture) patch.picture = picture;
      if (adminList.includes(existing.identity) && existing.role !== 'admin') patch.role = 'admin';
      if (Object.keys(patch).length) await store.patch('users', patch, [['id', existing.id]], 'id');
      const user = await store.one('users', 'id,identity,name,email,picture,role', [['id', existing.id]]);
      return ensureState(user);
    }
    const id = crypto.randomUUID();
    const role = adminList.includes(identity) ? 'admin' : 'pembelajar';
    await store.insert('users', {
      id,
      identity,
      email: email || '',
      name: name || 'Pengguna EduVerse',
      picture: picture || '',
      role,
      created_at: new Date().toISOString(),
    });
    const created = await store.one('users', 'id,identity,name,email,picture,role', [['id', id]]);
    return ensureState(created ?? { id, identity, email, name, picture, role });
  }

  async function ensureState(user) {
    await store.insertAbsent('user_state', {
      user_id: user.id,
      xp: 0,
      rank_key: 'pemula',
      streak: 0,
      longest_streak: 0,
      last_active_date: '',
      prefs: {},
      version: 1,
      updated_at: new Date().toISOString(),
    }, 'user_id');
    return attachState(user);
  }

  async function startSession(user) {
    const token = randomToken();
    const hashed = await hashToken(token, secret);
    const expires = new Date(Date.now() + SESSION_TTL * 1000);
    await store.insert('sessions', {
      id: hashed,
      user_id: user.id,
      expires_at: expires.toISOString(),
      created_at: new Date().toISOString(),
    });
    return { token, cookie: sessionCookie(COOKIE, token, SESSION_TTL), expires_at: expires.toISOString() };
  }

  async function fromCookie(request) {
    const token = cookieValue(request, COOKIE);
    if (!token || token.length < 16) return null;
    const hashed = await hashToken(token, secret);
    const session = await store.one('sessions', 'id,user_id,expires_at', [['id', hashed]]);
    if (!session || new Date(session.expires_at).getTime() <= Date.now()) return null;
    const user = await store.one('users', 'id,identity,name,email,picture,role', [['id', session.user_id]]);
    if (!user) return null;
    return { user: await attachState(user), session };
  }

  async function endSession(request) {
    const token = cookieValue(request, COOKIE);
    if (!token) return clearCookie(COOKIE);
    const hashed = await hashToken(token, secret);
    await store.patch('sessions', { expires_at: new Date(Date.now() - 1000).toISOString() }, [['id', hashed]], 'id');
    return clearCookie(COOKIE);
  }

  /** Urutan: sesi aplikasi (cookie) → konteks identitas gateway. */
  async function resolve(ctx) {
    const viaCookie = await fromCookie(ctx.request);
    if (viaCookie) return { ...viaCookie.user, source: 'session' };
    const contextUser = userFromContext ? userFromContext(ctx) : null;
    if (contextUser?.user_id) {
      const user = await upsert({
        identity: `qoder:${contextUser.user_id}`,
        name: contextUser.name || '',
        picture: contextUser.picture || '',
      });
      return { ...user, source: 'platform' };
    }
    return null;
  }

  function require(ctx) {
    return resolve(ctx).then((user) => {
      if (!user) throw new AppError('login_required', 401);
      return user;
    });
  }

  function requireAdmin(ctx) {
    return require(ctx).then((user) => {
      if (user.role !== 'admin') throw new AppError('forbidden', 403);
      return user;
    });
  }

  return { COOKIE, attachState, ensureState, endSession, fromCookie, projection, require, requireAdmin, resolve, startSession, upsert };
}

export const identityShapeOk = (value) => Boolean(value) && isUuid(value.id);
