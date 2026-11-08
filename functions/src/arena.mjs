// Uji Kompetensi: jendela tantangan asinkron. Soal identik untuk semua peserta karena
// diacak dengan seed tetap dari kunci turnamen, dan penyelesaian papan dibuat malas
// (platform tidak punya cron).

import { fail, isUuid, isoWeekKey, rateLimit } from './core.mjs';
import { XP } from './xp.mjs';
import { toSnapshot } from './quiz.mjs';

const MAX_ENTRIES = 200;

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(items, seedValue) {
  const random = rng(hashSeed(seedValue));
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const statusOf = (tournament, nowMs) => {
  const start = new Date(tournament.starts_at).getTime();
  const end = new Date(tournament.ends_at).getTime();
  if (nowMs < start) return 'upcoming';
  if (nowMs >= end) return 'closed';
  return 'live';
};

export function createArena({ store, xp, identity }) {
  async function tournamentQuestions(tournament) {
    const pool = [];
    for (const bankId of tournament.bank_ids ?? []) {
      if (!isUuid(bankId)) continue;
      const rows = await store.list('questions', 'id,bank_id,prompt,options,answer,explanation,order_no', [['bank_id', bankId]], { column: 'order_no', ascending: true }, 40);
      pool.push(...rows);
    }
    return shuffled(pool, tournament.seed || tournament.key).slice(0, tournament.question_count);
  }

  async function list(user) {
    const rows = await store.all('tournaments', 'id,key,title,starts_at,ends_at,duration_seconds,question_count,status', { column: 'starts_at', ascending: false }, 40);
    const nowMs = Date.now();
    const withState = [];
    for (const row of rows) {
      const status = statusOf(row, nowMs);
      const entry = user ? await store.one('entries', 'user_id,best_score,best_duration_ms,attempts,submitted_at', [['tournament_id', row.id], ['user_id', user.id]]) : null;
      withState.push({ ...row, derived_status: status, remaining_ms: Math.max(0, new Date(row.ends_at).getTime() - nowMs), my_entry: entry });
    }
    const live = withState.find((t) => t.derived_status === 'live') ?? null;
    return { tournaments: withState.slice(0, 12), live, upcoming: withState.filter((t) => t.derived_status === 'upcoming').slice(0, 3) };
  }

  async function start(user, body) {
    if (!isUuid(body?.tournament_id)) fail('invalid_input', 400);
    const tournament = await store.one('tournaments', 'id,key,title,starts_at,ends_at,duration_seconds,question_count,bank_ids,seed', [['id', body.tournament_id]]);
    if (!tournament) fail('not_found', 404);
    if (statusOf(tournament, Date.now()) !== 'live') fail('window_closed', 409);
    const limit = await rateLimit(store, { action: 'arena', principal: user.id, limit: 3, windowSeconds: 86400 });
    if (!limit.allowed) fail('rate_limited', 429);
    const mine = await store.list('attempts', 'id', [['user_id', user.id], ['tournament_id', tournament.id]], undefined, 10);
    if (mine.length >= 3) fail('entry_limit', 409);
    const questions = await tournamentQuestions(tournament);
    if (!questions.length) fail('empty_bank', 409);
    const bankId = questions[0].bank_id;
    // attempt_no unik per (user, bank), jadi nomor dihitung dari semua attempt bank itu, bukan dari turnamen saja.
    const sameBank = await store.list('attempts', 'attempt_no', [['user_id', user.id], ['bank_id', bankId]], undefined, 200);
    const now = Date.now();
    const hardEnd = Math.min(now + tournament.duration_seconds * 1000, new Date(tournament.ends_at).getTime());
    const attempt = {
      id: crypto.randomUUID(),
      user_id: user.id,
      bank_id: bankId,
      tournament_id: tournament.id,
      attempt_no: sameBank.reduce((max, row) => Math.max(max, row.attempt_no ?? 0), 0) + 1,
      status: 'running',
      started_at: new Date(now).toISOString(),
      deadline_at: new Date(hardEnd).toISOString(),
      correct: 0,
      total: questions.length,
      score: 0,
      offline: false,
      snapshot: toSnapshot(questions),
      created_at: new Date(now).toISOString(),
    };
    await store.insert('attempts', attempt);
    await xp.award(user, 'tournament_entry', `${tournament.id}`, XP.tournament_entry, { title: tournament.title });
    return {
      tournament: { id: tournament.id, key: tournament.key, title: tournament.title, duration_seconds: tournament.duration_seconds },
      attempt: { id: attempt.id, deadline_at: attempt.deadline_at, server_time: new Date(now).toISOString(), total: questions.length },
      questions: questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
    };
  }

  function better(candidate, current) {
    if (!current) return true;
    if (candidate.score !== current.best_score) return candidate.score > current.best_score;
    return candidate.duration_ms < current.best_duration_ms;
  }

  /** Dipanggil Function kuis setelah attempt bertournament dinilai. */
  async function settle(user, attempt, result) {
    if (!attempt.tournament_id || result.status === 'late') return null;
    const tournament = await store.one('tournaments', 'id,key,title,ends_at', [['id', attempt.tournament_id]]);
    if (!tournament) return null;
    const existing = await store.one('entries', 'tournament_id,user_id,best_score,best_duration_ms,attempts', [['tournament_id', tournament.id], ['user_id', user.id]]);
    const candidate = { score: result.score, duration_ms: result.duration_ms ?? 0 };
    const now = new Date().toISOString();
    if (!existing) {
      await store.insertAbsent('entries', { tournament_id: tournament.id, user_id: user.id, best_score: candidate.score, best_duration_ms: candidate.duration_ms, attempts: 1, submitted_at: now, rank_key: user.rank_key, display_name: user.name }, 'tournament_id,user_id');
    } else if (better(candidate, existing)) {
      await store.patch('entries', { best_score: candidate.score, best_duration_ms: candidate.duration_ms, attempts: existing.attempts + 1, submitted_at: now }, [['tournament_id', tournament.id], ['user_id', user.id]], 'tournament_id');
    } else {
      await store.patch('entries', { attempts: existing.attempts + 1 }, [['tournament_id', tournament.id], ['user_id', user.id]], 'tournament_id');
    }
    const board = await leaderboard(tournament.id, { limit: 100 });
    const rank = board.entries.findIndex((e) => e.user_id === user.id) + 1;
    return { tournament_id: tournament.id, title: tournament.title, score: candidate.score, place: rank || null, total: board.entries.length };
  }

  async function leaderboard(tournamentId, options = {}) {
    if (!isUuid(tournamentId)) fail('invalid_input', 400);
    const tournament = await store.one('tournaments', 'id,key,title,starts_at,ends_at', [['id', tournamentId]]);
    if (!tournament) fail('not_found', 404);
    const raw = await store.list('entries', 'user_id,best_score,best_duration_ms,attempts,submitted_at,display_name,rank_key', [['tournament_id', tournament.id]], undefined, MAX_ENTRIES);
    const entries = raw
      .filter((e) => e.user_id)
      .sort((a, b) => b.best_score - a.best_score || a.best_duration_ms - b.best_duration_ms || new Date(a.submitted_at) - new Date(b.submitted_at))
      .slice(0, options.limit ?? 50)
      .map((e, index) => ({ place: index + 1, ...e }));

    // Penyelesaian hadiah dilakukan malas saat papan dibaca setelah jendela tutup.
    if (statusOf(tournament, Date.now()) === 'closed') {
      for (const entry of entries.slice(0, 3)) {
        const amount = entry.place === 1 ? XP.tournament_win : entry.place === 2 ? XP.tournament_place_2 : XP.tournament_place;
        const account = await identity.attachState(await store.one('users', 'id,name,email,picture,role', [['id', entry.user_id]]));
        if (account) await xp.award(account, 'tournament_place', `${tournament.id}:${entry.place}`, amount, { place: entry.place });
      }
    }

    const names = [];
    for (const entry of entries.slice(0, 20)) {
      const user = await store.one('users', 'id,name,picture', [['id', entry.user_id]]);
      names.push({ ...entry, name: user?.name || entry.display_name || 'Peserta', picture: user?.picture || '' });
    }
    return { tournament: { ...tournament, derived_status: statusOf(tournament, Date.now()) }, entries: names };
  }

  /** Papan mingguan: gabungan entri turnamen pada minggu ISO berjalan. */
  async function weekly(user) {
    const week = isoWeekKey(new Date());
    const rows = await store.all('tournaments', 'id,key,title,starts_at,ends_at', { column: 'starts_at', ascending: false }, 30);
    const inWeek = rows.filter((t) => isoWeekKey(new Date(t.starts_at)) === week);
    const merged = [];
    for (const tournament of inWeek) {
      const entries = await store.list('entries', 'user_id,best_score,best_duration_ms,submitted_at,display_name', [['tournament_id', tournament.id]], undefined, 100);
      merged.push(...entries.map((e) => ({ ...e, tournament_id: tournament.id })));
    }
    const bestByUser = new Map();
    for (const entry of merged) {
      const current = bestByUser.get(entry.user_id);
      const score = entry.best_score ?? 0;
      if (!current || score > current.best_score || (score === current.best_score && entry.best_duration_ms < current.best_duration_ms)) bestByUser.set(entry.user_id, entry);
    }
    const ranked = [...bestByUser.values()].sort((a, b) => b.best_score - a.best_score || a.best_duration_ms - b.best_duration_ms);
    const rowsOut = [];
    for (const [index, entry] of ranked.slice(0, 30).entries()) {
      // `profile` bukan `user`: nama loop yang menimpa parameter `weekly(user)` membuat
      // perbandingan di bawah menjadi entry.user_id === entry.user_id, sehingga SEMUA baris
      // mengaku milik pembaca.
      const profile = await store.one('users', 'id,name,picture', [['id', entry.user_id]]);
      const state = await store.one('user_state', 'xp,rank_key', [['user_id', entry.user_id]]);
      rowsOut.push({ place: index + 1, user_id: entry.user_id, name: profile?.name ?? entry.display_name ?? 'Peserta', picture: profile?.picture ?? '', best_score: entry.best_score, best_duration_ms: entry.best_duration_ms, xp: state?.xp ?? 0, rank_key: state?.rank_key ?? 'pemula', me: Boolean(user && entry.user_id === user.id) });
    }
    return { week, tournaments: inWeek, entries: rowsOut, my_place: user ? rowsOut.findIndex((r) => r.user_id === user.id) + 1 || null : null };
  }

  /** Rekap sepanjang masa: diambil dari user_state.xp (sudah diaudit di xp_events). */
  async function allTime(user) {
    const states = await store.all('user_state', 'user_id,xp,rank_key,streak,longest_streak', { column: 'xp', ascending: false }, 60);
    const rowsOut = [];
    for (const [index, state] of states.filter((s) => s.xp > 0).entries()) {
      const profile = await store.one('users', 'id,name,picture', [['id', state.user_id]]);
      rowsOut.push({ place: index + 1, user_id: state.user_id, name: profile?.name ?? 'Pengguna', picture: profile?.picture ?? '', xp: state.xp, rank_key: state.rank_key, streak: state.streak, me: user?.id === state.user_id });
    }
    return { entries: rowsOut.slice(0, 50), generated_at: new Date().toISOString() };
  }

  async function history(user, tournamentId) {
    const attempts = await store.list('attempts', 'id,score,correct,total,status,started_at,finished_at,duration_ms,offline', [['user_id', user.id], ['tournament_id', tournamentId]], { column: 'started_at', ascending: false }, 10);
    return { attempts: attempts.filter((a) => a.id).map((a, index) => ({ ...a, attempt_no: index + 1 })) };
  }

  return { history, leaderboard, list, settle, start, statusOf, tournamentQuestions, weekly, allTime };
}
