// Kuis modul dengan jam server. Nilai dihitung ulang di server dari kunci jawaban,
// klien tidak pernah mengirim skor.

import { fail, isUuid, clampInt, text } from './core.mjs';
import { XP } from './xp.mjs';

const GRACE_MS = 30_000;
const MAX_QUESTIONS = 40;

/** Soal dibekukan bersama attempt supaya nilai dihitung dari soal yang dilihat peserta. */
export const toSnapshot = (questions) =>
  questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options, answer: q.answer, explanation: q.explanation ?? '' }));

export function createQuiz({ store, xp, identity }) {
  async function myAttempts(userId, bankId, limit = 50) {
    const all = await store.list('attempts', 'id,bank_id,attempt_no,status,score,correct,total,started_at,finished_at,offline', [['user_id', userId]], { column: 'started_at', ascending: false }, limit);
    return bankId ? all.filter((a) => a.bank_id === bankId) : all;
  }

  async function bankQuestions(bankId) {
    return store.list('questions', 'id,prompt,options,answer,explanation,order_no', [['bank_id', bankId]], { column: 'order_no', ascending: true }, MAX_QUESTIONS);
  }

  async function start(user, body) {
    if (!isUuid(body?.bank_id)) fail('invalid_input', 400);
    const bank = await store.one('banks', 'id,module_id,title,time_limit_seconds,pass_score', [['id', body.bank_id]]);
    if (!bank) fail('not_found', 404);
    const questions = await bankQuestions(bank.id);
    if (!questions.length) fail('empty_bank', 409);
    const history = await myAttempts(user.id, bank.id, 200);
    const attemptNo = history.reduce((max, a) => Math.max(max, a.attempt_no ?? 0), 0) + 1;
    const now = Date.now();
    const attempt = {
      id: crypto.randomUUID(),
      user_id: user.id,
      bank_id: bank.id,
      tournament_id: isUuid(body?.tournament_id) ? body.tournament_id : null,
      attempt_no: attemptNo,
      status: 'running',
      started_at: new Date(now).toISOString(),
      deadline_at: new Date(now + bank.time_limit_seconds * 1000).toISOString(),
      correct: 0,
      total: questions.length,
      score: 0,
      offline: false,
      snapshot: toSnapshot(questions),
      created_at: new Date(now).toISOString(),
    };
    await store.insert('attempts', attempt);
    await xp.touchStreak(user);
    return {
      attempt: { id: attempt.id, deadline_at: attempt.deadline_at, server_time: new Date(now).toISOString(), attempt_no: attemptNo, total: questions.length, pass_score: bank.pass_score, time_limit_seconds: bank.time_limit_seconds },
      bank: { id: bank.id, title: bank.title, module_id: bank.module_id },
      questions: questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
    };
  }

  async function loadOwned(user, attemptId) {
    const attempt = await store.one('attempts', 'id,user_id,bank_id,status,deadline_at,attempt_no,tournament_id,snapshot', [['id', attemptId]]);
    if (!attempt || attempt.user_id !== user.id) fail('not_found', 404);
    return attempt;
  }

  async function answer(user, body) {
    if (!isUuid(body?.attempt_id) || !isUuid(body?.question_id) || !clampInt(body?.chosen, 0, 9)) fail('invalid_input', 400);
    const attempt = await loadOwned(user, body.attempt_id);
    if (attempt.status !== 'running') fail('attempt_closed', 409);
    if (!attempt.snapshot.some((q) => q.id === body.question_id)) fail('invalid_input', 400);
    const deadline = new Date(attempt.deadline_at).getTime();
    const late = Date.now() > deadline + GRACE_MS;
    const existing = await store.one('answers', 'attempt_id,question_id,chosen', [['attempt_id', attempt.id], ['question_id', body.question_id]]);
    if (existing) {
      if (existing.chosen === body.chosen) return { ok: true, late, saved: true };
      await store.patch('answers', { chosen: body.chosen, answered_at: new Date().toISOString() }, [['attempt_id', attempt.id], ['question_id', body.question_id]], 'attempt_id');
    } else {
      await store.insert('answers', { attempt_id: attempt.id, question_id: body.question_id, chosen: body.chosen, answered_at: new Date().toISOString() });
    }
    return { ok: true, late, saved: true, remaining_ms: Math.max(0, deadline - Date.now()) };
  }

  /** Menerima jawaban yang tertahan luring; kalau lewat batas, dinilai tapi tidak dihitung untuk peringkat. */
  async function finish(user, body) {
    const attempt = await loadOwned(user, body?.attempt_id);
    if (attempt.status !== 'running') {
      const saved = await store.one('attempts', 'id,status,score,correct,total,offline', [['id', attempt.id]]);
      return { attempt: saved, review: await reviewFor(attempt), replayed: true };
    }
    const queued = Array.isArray(body?.answers) ? body.answers.slice(0, MAX_QUESTIONS) : [];
    for (const item of queued) {
      if (!isUuid(item?.question_id) || !clampInt(item?.chosen, 0, 9)) continue;
      if (!attempt.snapshot.some((q) => q.id === item.question_id)) continue;
      const existing = await store.one('answers', 'attempt_id,question_id', [['attempt_id', attempt.id], ['question_id', item.question_id]]);
      if (existing) await store.patch('answers', { chosen: item.chosen, answered_at: new Date().toISOString() }, [['attempt_id', attempt.id], ['question_id', item.question_id]], 'attempt_id');
      else await store.insert('answers', { attempt_id: attempt.id, question_id: item.question_id, chosen: item.chosen, answered_at: new Date().toISOString() });
    }
    const review = await reviewFor(attempt);
    const correct = review.reduce((sum, row) => sum + (row.correct ? 1 : 0), 0);
    const total = attempt.snapshot.length || 1;
    const score = Math.round((correct / total) * 100);
    const bank = await store.one('banks', 'id,pass_score,title,module_id', [['id', attempt.bank_id]]);
    const now = Date.now();
    const late = now > new Date(attempt.deadline_at).getTime() + GRACE_MS || Boolean(body?.offline);
    const status = late ? 'late' : score >= (bank?.pass_score ?? 70) ? 'pass' : 'fail';
    const finished = {
      id: attempt.id,
      status,
      score,
      correct,
      total,
      finished_at: new Date(now).toISOString(),
      offline: Boolean(body?.offline),
      duration_ms: Math.max(0, now - new Date(attempt.started_at).getTime()),
    };
    await store.patch('attempts', finished, [['id', attempt.id], ['status', 'running']], 'id');

    let granted = 0;
    let promoted = null;
    if (!late) {
      const amount = score >= 90 ? XP.quiz_top : status === 'pass' ? XP.quiz_pass : XP.quiz_try;
      const award = await xp.award(user, score >= 90 ? 'quiz_top' : status === 'pass' ? 'quiz_pass' : 'quiz_try', attempt.id, amount, { bank_id: attempt.bank_id, score });
      granted = award.granted;
      promoted = award.rank;
      if (status === 'pass') await xp.award(user, 'quiz_first_pass', `${user.id}:${attempt.bank_id}`, 40, { bank_id: attempt.bank_id });
    }
    const streak = await xp.touchStreak(user);
    const fresh = await identity.attachState(await store.one('users', 'id,name,email,picture,role', [['id', user.id]]));
    return {
      attempt: { ...finished, pass_score: bank?.pass_score ?? 70, bank_id: attempt.bank_id, module_id: bank?.module_id ?? '', tournament_id: attempt.tournament_id ?? null },
      review,
      awarded: { xp: granted, rank: promoted, practice: late },
      standing: fresh ? { xp: fresh.xp, rank_title: fresh.rank_title, streak: streak.streak } : null,
    };
  }

  async function reviewFor(attempt) {
    const answers = await store.list('answers', 'question_id,chosen', [['attempt_id', attempt.id]], undefined, MAX_QUESTIONS);
    const chosen = new Map(answers.map((a) => [a.question_id, a.chosen]));
    return attempt.snapshot.map((q) => ({
      id: q.id, prompt: q.prompt, options: q.options,
      chosen: chosen.get(q.id) ?? null, answer: q.answer,
      correct: chosen.get(q.id) === q.answer, explanation: q.explanation,
    }));
  }

  async function history(user, bankId) {
    const attempts = await myAttempts(user.id, bankId, 50);
    return { attempts, best: attempts.reduce((max, a) => Math.max(max, a.score ?? 0), 0) };
  }

  return { answer, finish, history, start };
}
