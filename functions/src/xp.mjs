// XP dan peringkat. Semua hadiah dicatat sekali per (user, kind, ref) agar idempoten,
// lalu user_state dinaikkan dengan CAS berbasis version (tidak ada transaksi di platform).

import { RANK_LADDER, rankForXp, nextRank } from './core.mjs';

export const XP = {
  lesson_done: 12,
  module_done: 60,
  quiz_pass: 90,
  quiz_top: 150,
  quiz_try: 15,
  quiz_first_pass: 40,
  answer_post: 8,
  answer_accepted: 60,
  tournament_entry: 25,
  tournament_win: 150,
  // Kunci `tournament_place` adalah kind yang dikirim ke xp_events; tempat 1 memakai
  // tournament_win dan tempat 2 memakai tournament_place_2, jadi tidak ada angka telanjang
  // di arena.mjs dan setiap kind punya kunci di tabel ini.
  tournament_place: 60,
  tournament_place_2: 100,
  streak_day: 6,
  code_pass: 40,
};

export function createXp({ store }) {
  async function bump(user, amount) {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const state = await store.one('user_state', 'user_id,xp,rank_key,streak,longest_streak,last_active_date,version', [['user_id', user.id]]);
      if (!state) return null;
      const xp = Math.max(0, state.xp + amount);
      const rank = rankForXp(xp);
      const promoted = rank.rank_key !== state.rank_key ? rank.rank_key : state.rank_key;
      const updated = await store.patch(
        'user_state',
        { xp, rank_key: promoted, version: state.version + 1, updated_at: new Date().toISOString() },
        [['user_id', user.id], ['version', state.version]],
        'user_id,xp,rank_key,version'
      );
      if (updated.length) {
        return { before: state, after: updated[0], promoted: rank.rank_key !== state.rank_key ? rank : null };
      }
    }
    return null;
  }

  /** Mengembalikan jumlah XP yang benar-benar baru diberikan (0 kalau sudah pernah). */
  async function award(user, kind, refId, amount = XP[kind] ?? 0, meta = {}) {
    if (!amount) return { granted: 0, rank: null };
    const inserted = await store.insertAbsent('xp_events', {
      id: crypto.randomUUID(),
      user_id: user.id,
      kind,
      amount,
      ref_id: refId,
      meta,
      occurred_at: new Date().toISOString(),
    }, 'user_id,kind,ref_id');
    if (!inserted.length) return { granted: 0, rank: null };
    const result = await bump(user, amount);
    return { granted: amount, rank: result?.promoted ?? null };
  }

  /** Satu bonus streak per hari kalender UTC; harian dibatasi 7 hari berturut lalu berhenti sendiri. */
  async function touchStreak(user) {
    const today = new Date().toISOString().slice(0, 10);
    const state = await store.one('user_state', 'user_id,streak,longest_streak,last_active_date,version', [['user_id', user.id]]);
    if (!state || state.last_active_date === today) return { streak: state?.streak ?? 0, changed: false };
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const streak = state.last_active_date === yesterday ? state.streak + 1 : 1;
    const longest = Math.max(state.longest_streak, streak);
    await store.patch('user_state', { streak, longest_streak: longest, last_active_date: today, version: state.version + 1, updated_at: new Date().toISOString() }, [['user_id', user.id], ['version', state.version]], 'user_id');
    const bonus = streak <= 30 ? XP.streak_day : 0;
    if (bonus) await award(user, 'streak_day', today, bonus);
    return { streak, changed: true };
  }

  const ladder = () => RANK_LADDER.map((rank) => ({ ...rank, next: nextRank(rank.rank_key)?.title ?? null }));

  return { award, bump, ladder, touchStreak };
}
