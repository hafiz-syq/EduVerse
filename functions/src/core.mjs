// EduVerse Function core: HTTP ampul, akses tabel, dan identitas.
// Aturan platform: tanpa Node API, tanpa import path alias, hanya builder satu tabel.

export const TABLES = {
  users: 'users',
  sessions: 'sessions',
  userState: 'user_state',
  courses: 'courses',
  modules: 'modules',
  lessons: 'lessons',
  progress: 'progress',
  banks: 'banks',
  questions: 'questions',
  attempts: 'attempts',
  answers: 'answers',
  xpEvents: 'xp_events',
  ranks: 'ranks',
  threads: 'threads',
  posts: 'posts',
  votes: 'votes',
  tournaments: 'tournaments',
  entries: 'entries',
  adSlots: 'ad_slots',
  adEvents: 'ad_events',
  flags: 'flags',
  limiter: 'limiter',
  downloads: 'downloads',
};

export class AppError extends Error {
  constructor(code, status, detail) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

export const fail = (code, status, detail) => {
  throw new AppError(code, status, detail);
};

export const json = (value, status = 200, headers = {}) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers },
  });

export const errorJson = (code, status, requestId) =>
  json({ error: code, ok: false, request_id: requestId }, status);

/** Ampul galat yang sama dipakai index.ts, dev server, dan asap uji. Galat lain dikirim `null` supaya penangan host yang memroses. */
export const typedResponse = (error, requestId) =>
  typeof error?.code === 'string' && Number.isInteger(error?.status) ? errorJson(error.code, error.status, requestId) : null;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const isUuid = (value) => typeof value === 'string' && UUID_RE.test(value);

export const text = (value, min, max) =>
  typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;

export const clampInt = (value, min, max) =>
  Number.isInteger(value) && value >= min && value <= max;

export const isoWeekKey = (date) => {
  const d = new Date(date);
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

export const utcDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

/** Gateway mengganti segmen `app` dengan nama fisik, dan bisa membuang `/functions/v1`. */
export function applicationPath(pathname) {
  const match = pathname.match(/^\/(?:functions\/v1\/)?(?:app|app-d[0-9a-f]{32})(\/.*)?$/);
  return match ? match[1] || '/' : null;
}

export async function readJson(request, maxBytes = 65536) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) fail('invalid_input', 400);
  const reader = request.body?.getReader();
  if (!reader) fail('invalid_input', 400);
  let size = 0;
  const chunks = [];
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > maxBytes) {
        await reader.cancel();
        fail('payload_too_large', 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    fail('invalid_input', 400);
  }
}

export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function requireMutationOrigin(request) {
  if (!sameOrigin(request)) fail('origin_mismatch', 403);
}

export function cookieValue(request, name) {
  const header = request.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
  }
  return null;
}

export function sessionCookie(name, token, maxAgeSeconds) {
  return `${name}=${encodeURIComponent(token)}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

export function clearCookie(name) {
  return `${name}=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

/** Hasil {data,error} dari builder DB: error diteruskan sebagai AppError. */
export function rows(result) {
  if (result?.error) fail(result.error.code || 'database_unavailable', result.error.status || 503);
  return result?.data ?? [];
}

export function makeStore(db) {
  const list = async (table, columns, filters, order, limit) => {
    let query = db.from(table).select(columns);
    for (const [key, value] of filters) query = query.eq(key, value);
    if (order) query = query.order(order.column, { ascending: order.ascending === true });
    return rows(await query.limit(limit ?? 100));
  };
  return {
    list,
    one: async (table, columns, filters) => (await list(table, columns, filters))[0] ?? null,
    all: (table, columns, order, limit) => list(table, columns, [], order, limit),
    insert: async (table, row) => rows(await db.from(table).insert(row)),
    insertAbsent: async (table, row, onConflict) =>
      rows(await db.from(table).insertIfAbsent(row, { onConflict })),
    patch: async (table, patch, filters, columns = 'id') =>
      rows(await filters.reduce((q, [k, v]) => q.eq(k, v), db.from(table).update(patch)).select(columns)),
  };
}

/** Pembatas laju CAS: baris per (action, principal, window). Baris lama tetap tersimpan; lihat retensi. */
export async function rateLimit(store, { action, principal, limit, windowSeconds }) {
  const now = Date.now();
  const key = `${action}:${principal}`;
  const existing = await store.one('limiter', 'key,count,window_start', [['key', key]]);
  const windowStart = now - (now % (windowSeconds * 1000));
  if (!existing) {
    await store.insertAbsent('limiter', { key, count: 1, window_start: new Date(windowStart).toISOString(), updated_at: new Date(now).toISOString() }, 'key');
    return { allowed: true, remaining: limit - 1 };
  }
  const inWindow = new Date(existing.window_start).getTime() === windowStart;
  const count = inWindow ? existing.count + 1 : 1;
  if (count > limit) return { allowed: false, remaining: 0 };
  const columns = inWindow ? { count, updated_at: new Date(now).toISOString() } : { count, window_start: new Date(windowStart).toISOString(), updated_at: new Date(now).toISOString() };
  await store.patch('limiter', columns, [['key', key], ['count', existing.count]], 'key');
  return { allowed: true, remaining: limit - count };
}

const TOKEN_BYTES = 32;

export async function hashToken(token, secret) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export const randomToken = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(TOKEN_BYTES)), (b) => b.toString(16).padStart(2, '0')).join('');

/** Urutan peringkat. Ambang XP dinaikkan lewat kuis modul dan Uji Kompetensi. */
export const RANK_LADDER = [
  { rank_key: 'pemula', title: 'Pemula', threshold: 0, color: 'var(--rank-pemula)', order_no: 1 },
  { rank_key: 'madya', title: 'Madya', threshold: 600, color: 'var(--rank-madya)', order_no: 2 },
  { rank_key: 'maha', title: 'Maha', threshold: 1800, color: 'var(--rank-maha)', order_no: 3 },
  { rank_key: 'master', title: 'Master', threshold: 4200, color: 'var(--rank-master)', order_no: 4 },
];

export const rankForXp = (xp) =>
  [...RANK_LADDER].reverse().find((rank) => xp >= rank.threshold) ?? RANK_LADDER[0];

export const nextRank = (rankKey) => {
  const index = RANK_LADDER.findIndex((rank) => rank.rank_key === rankKey);
  return index >= 0 && index < RANK_LADDER.length - 1 ? RANK_LADDER[index + 1] : null;
};
