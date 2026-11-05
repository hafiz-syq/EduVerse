// Lab koding. Penilaiannya hidup di browser (lib/playground/runner.ts), jadi catatan yang
// masuk ke sini adalah laporan diri. Dua batas menjaganya tetap masuk akal: task_key harus
// salah satu latihan yang benar-benar ada, dan XP 'code_pass' hanya sekali per
// (user, kind, ref) karena keunikan pada xp_events.

import { clampInt, fail, rateLimit, text } from './core.mjs';
import { XP } from './xp.mjs';

// Sumber kebenaran latihan ada di lib/playground/tasks.ts; dev/function.test.mjs menjaga
// supaya kedua daftar tidak bisa bergerak sendiri-sendiri.
export const TASK_KEYS = new Set([
  'sapa',
  'jumlah',
  'kuadrat',
  'fizzbuzz',
  'judul',
  'tombol-klik',
  'warna-brand',
  'daftar',
]);

const MODES = new Set(['js', 'web']);

export function createPlayground({ store, xp }) {
  async function recordRun(user, body) {
    const taskKey = text(body?.task_key, 2, 60) ? body.task_key.trim() : '';
    if (!TASK_KEYS.has(taskKey)) fail('invalid_input', 400);
    if (!MODES.has(body?.mode)) fail('invalid_input', 400);
    const passed = body?.passed === true;
    const duration = clampInt(body?.duration_ms, 1, 3_600_000) ? body.duration_ms : null;

    const limit = await rateLimit(store, { action: 'code_run', principal: user.id, limit: 120, windowSeconds: 86400 });
    if (!limit.allowed) fail('rate_limited', 429);

    const now = new Date().toISOString();
    const existing = await store.one('playground_runs', 'id,attempts,passed', [['user_id', user.id], ['task_key', taskKey]]);
    let attempts;
    if (existing) {
      attempts = existing.attempts + 1;
      await store.patch(
        'playground_runs',
        { passed: existing.passed || passed, duration_ms: duration, attempts, occurred_at: now, updated_at: now },
        [['user_id', user.id], ['task_key', taskKey]],
        'id'
      );
    } else {
      attempts = 1;
      await store.insertAbsent(
        'playground_runs',
        {
          id: crypto.randomUUID(),
          user_id: user.id,
          task_key: taskKey,
          mode: body.mode,
          passed,
          duration_ms: duration,
          attempts,
          occurred_at: now,
        },
        'user_id,task_key'
      );
    }

    if (!passed) return { granted: 0, rank: null, attempts, streak: user.streak };
    const earned = await xp.award(user, 'code_pass', taskKey, XP.code_pass, { mode: body.mode });
    const streak = await xp.touchStreak(user);
    return { granted: earned.granted, rank: earned.rank, attempts, streak: streak.streak };
  }

  /** Ringkasan lab untuk profil: latihan yang pernah lulus saja, urut terbaru. */
  async function summary(user) {
    const runs = await store.list(
      'playground_runs',
      'task_key,mode,passed,duration_ms,attempts,occurred_at',
      [['user_id', user.id]],
      { column: 'occurred_at', ascending: false },
      100
    );
    const lulus = runs.filter((r) => r.passed);
    return {
      total: TASK_KEYS.size,
      passed: lulus.length,
      attempts: runs.reduce((jumlah, r) => jumlah + r.attempts, 0),
      recent: lulus.slice(0, 8),
    };
  }

  return { recordRun, summary };
}
