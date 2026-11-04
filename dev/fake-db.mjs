// DB tiruan untuk verifikasi lokal: meniru builder satu tabel platform
// (from/select/eq/order/limit/insert/insertIfAbsent/update) beserta kunci uniknya.
// File ini TIDAK pernah ikut paket publikasi (dev/ di luar webDirectory & functionDirectory).

const UNIQUE = {
  users: [['identity']],
  user_state: [['user_id']],
  courses: [['slug']],
  modules: [['slug']],
  banks: [['id']],
  ranks: [['rank_key']],
  tournaments: [['key']],
  ad_slots: [['slot_key']],
  limiter: [['key']],
  attempts: [['user_id', 'bank_id', 'attempt_no']],
  progress: [['user_id', 'lesson_id']],
  answers: [['attempt_id', 'question_id']],
  xp_events: [['user_id', 'kind', 'ref_id']],
  votes: [['thread_id', 'post_id', 'user_id']],
  entries: [['tournament_id', 'user_id']],
  downloads: [['id']],
  threads: [['id']],
  posts: [['id']],
  sessions: [['id']],
  flags: [['id']],
  ad_events: [['id']],
  questions: [['id']],
  lessons: [['id']],
};

const DEFAULTS = {
  user_state: { xp: 0, rank_key: 'pemula', streak: 0, longest_streak: 0, last_active_date: '', prefs: {}, version: 1 },
  attempts: { status: 'running', score: 0, correct: 0, total: 0, offline: false },
  threads: { answer_count: 0, pinned: false, locked: false, accepted_post_id: null },
  posts: { accepted: false },
  ad_slots: { enabled: true, priority: 1 },
};

export function createFakeDb(seedRows = {}) {
  const tables = new Map();
  const table = (name) => {
    if (!tables.has(name)) tables.set(name, Array.isArray(seedRows[name]) ? seedRows[name].map((r) => ({ ...r })) : []);
    return tables.get(name);
  };

  function conflicts(name, row, keys) {
    return table(name).some((existing) => keys.every((key) => existing[key] !== undefined && existing[key] === row[key]));
  }

  function query(name) {
    const state = { columns: null, filters: [], order: [], limit: 1000, mode: 'read', values: null, conflict: null };
    const run = () => {
      if (state.mode === 'insert') {
        const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...(DEFAULTS[name] ?? {}), ...state.values };
        const keys = state.conflict ?? (UNIQUE[name] ?? []).flat();
        if (keys.length && conflicts(name, row, keys)) return { data: [], error: null };
        if ((UNIQUE[name] ?? []).some((keys) => keys.length && conflicts(name, row, keys))) return { data: [], error: { code: 'unique_violation', status: 409 } };
        table(name).push(row);
        return { data: project([row], state.columns), error: null };
      }
      let result = table(name).filter((row) => state.filters.every(([key, value]) => row[key] === value));
      if (state.mode === 'update') {
        const keys = (UNIQUE[name] ?? []).flat();
        result.forEach((row) => Object.assign(row, state.values));
        if (keys.length && result.length) persist();
      }
      for (const [key, ascending] of [...state.order].reverse()) {
        result = [...result].sort((a, b) => {
          const left = a[key] ?? '';
          const right = b[key] ?? '';
          const delta = left < right ? -1 : left > right ? 1 : 0;
          return delta * (ascending ? 1 : -1);
        });
      }
      return { data: project(result.slice(0, state.limit), state.columns), error: null };
    };
    const project = (rows, columns) => (columns ? rows.map((row) => Object.fromEntries(columns.split(',').map((key) => [key, row[key]]))) : rows.map((row) => ({ ...row })));

    const builder = {
      select(columns) { state.columns = columns; return builder; },
      eq(key, value) { state.filters.push([key, value]); return builder; },
      order(key, options = {}) { state.order.push([key, options.ascending !== false]); return builder; },
      limit(value) { state.limit = value; return builder; },
      insert(values) { state.mode = 'insert'; state.values = values; return builder; },
      insertIfAbsent(values, options) { state.mode = 'insert'; state.values = values; state.conflict = String(options.onConflict).split(','); return builder; },
      update(values) { state.mode = 'update'; state.values = values; return builder; },
      then(fulfilled, rejected) { return Promise.resolve().then(run).then(fulfilled, rejected); },
    };
    return builder;
  }

  function persist() {
    if (!onPersist) return;
    onPersist(Object.fromEntries([...tables.entries()].map(([key, rows]) => [key, rows])));
  }

  let onPersist = null;
  return {
    from: (name) => query(name),
    __tables: tables,
    __row: (name, predicate) => table(name).find(predicate) ?? null,
    __count: (name) => table(name).length,
    __attach: (listener) => { onPersist = listener; },
    __dump: () => Object.fromEntries([...tables.entries()].map(([key, rows]) => [key, rows.map((r) => ({ ...r }))])),
  };
}
