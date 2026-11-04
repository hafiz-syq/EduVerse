// DB tiruan untuk verifikasi lokal: meniru builder satu tabel platform
// (from/select/eq/order/limit/insert/insertIfAbsent/update) dengan kunci unik, DEFAULT,
// dan NOT NULL yang dibaca langsung dari migrations/*.sql.
// File ini TIDAK pernah ikut paket publikasi (dev/ di luar webDirectory & functionDirectory).
import { applyDefaults, uniqueGroups } from './schema.mjs';

export function createFakeDb(schema, seedRows = {}) {
  const tables = new Map();

  const definition = (name) => {
    const table = schema.tables.get(name);
    if (!table) throw new Error(`tabel tanpa skema: ${name}`);
    return table;
  };
  const rowsOf = (name) => {
    if (!tables.has(name)) {
      definition(name);
      tables.set(name, (Array.isArray(seedRows[name]) ? seedRows[name] : []).map((row) => ({ ...row })));
    }
    return tables.get(name);
  };
  const conflicts = (name, row, keys) => rowsOf(name).some((existing) => keys.every((key) => existing[key] === row[key]));

  function query(name) {
    const state = { columns: null, filters: [], order: [], limit: 1000, mode: 'read', values: null, conflict: null };
    const project = (result, columns) => (columns
      ? result.map((row) => Object.fromEntries(columns.split(',').map((key) => [key, row[key]])))
      : result.map((row) => ({ ...row })));

    const run = () => {
      const table = definition(name);
      if (state.mode === 'insert') {
        const { row, missing } = applyDefaults(table, state.values);
        if (missing.length) return { data: [], error: { code: 'not_null_violation', status: 400, detail: missing.join(',') } };
        const groups = uniqueGroups(table);
        if (state.conflict) {
          const group = groups.find((keys) => keys.join(',') === state.conflict.join(','));
          if (!group) return { data: [], error: { code: 'unique_index_missing', status: 400, detail: state.conflict.join(',') } };
          if (conflicts(name, row, group)) return { data: [], error: null };
        }
        const clash = groups.find((keys) => keys.every((key) => row[key] !== undefined) && conflicts(name, row, keys));
        if (clash) return { data: [], error: { code: 'unique_violation', status: 409, detail: clash.join(',') } };
        rowsOf(name).push(row);
        return { data: project([row], state.columns), error: null };
      }
      let result = rowsOf(name).filter((row) => state.filters.every(([key, value]) => row[key] === value));
      if (state.mode === 'update') {
        result.forEach((row) => Object.assign(row, state.values));
        persist();
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

    const builder = {
      select(columns) { state.columns = columns; return builder; },
      eq(key, value) { state.filters.push([key, value]); return builder; },
      order(key, options = {}) { state.order.push([key, options.ascending !== false]); return builder; },
      limit(value) { state.limit = value; return builder; },
      insert(values) { state.mode = 'insert'; state.values = values; return builder; },
      insertIfAbsent(values, options) {
        state.mode = 'insert';
        state.values = values;
        state.conflict = String(options.onConflict).split(',').map((key) => key.trim());
        return builder;
      },
      update(values) { state.mode = 'update'; state.values = values; return builder; },
      then(fulfilled, rejected) { return Promise.resolve().then(run).then(fulfilled, rejected); },
    };
    return builder;
  }

  let onPersist = null;
  const dump = () => Object.fromEntries([...tables.entries()].map(([key, rows]) => [key, rows.map((row) => ({ ...row }))]));
  function persist() {
    if (onPersist) onPersist(dump());
  }

  return {
    from: (name) => query(name),
    __tables: tables,
    __schema: schema,
    __row: (name, predicate) => rowsOf(name).find(predicate) ?? null,
    __count: (name) => rowsOf(name).length,
    __attach: (listener) => { onPersist = listener; },
    __dump: dump,
  };
}
