// Adapter Postgres untuk kontrak builder satu tabel yang dipakai functions/src/*.
// Nilai selalu jadi parameter ($1, $2); nama tabel/kolom divalidas identifier dan tidak
// pernah diterima dari input pengguna. Builder lazy: SQL dibangun saat diawait, sama seperti
// dev/fake-db.mjs, supaya 158 pemanggilan store di aplikasi tidak perlu diubah.

const IDENT = /^[a-z_][a-z0-9_]*$/;

// Galat Postgres dipetakan ke kode yang sudah dikenal frontend (lib/api.ts).
const KODE_GALAT = {
  23505: ['unique_violation', 409],
  23502: ['not_null_violation', 400],
  23503: ['invalid_input', 400],
  23514: ['invalid_input', 400],
  '22P02': ['invalid_input', 400],
};

const quote = (name, apa) => {
  if (typeof name !== 'string' || !IDENT.test(name)) {
    throw new TypeError(`identifier ${apa} ditolak: ${String(name).slice(0, 40)}`);
  }
  return `"${name}"`;
};

const daftarKolom = (columns) => {
  const parts = String(columns).split(',').map((part) => part.trim()).filter(Boolean);
  if (!parts.length) throw new TypeError('daftar kolom kosong');
  return parts.map((part) => quote(part, 'kolom')).join(',');
};

const isi = (values) => {
  const entries = Object.entries(values ?? {}).filter(([, value]) => value !== undefined);
  return {
    columns: entries.map(([key]) => quote(key, 'kolom')),
    params: entries.map(([, value]) => value),
  };
};

export function createPgStore(pool, { schema = 'app' } = {}) {
  const namaSkema = quote(schema, 'skema');

  function from(table) {
    const namaTabel = `${namaSkema}.${quote(table, 'tabel')}`;
    const state = { columns: null, filters: [], order: [], limit: null, mode: 'read', values: null, conflict: null };
    let berjalan = null;

    const build = () => {
      const params = [];
      // Placeholder memakai posisi dalam params, jadi potongan SQL harus disusun
      // tepat pada urutan kemunculannya di pernyataan akhir.
      const arg = (value) => {
        params.push(value);
        return `$${params.length}`;
      };
      const kembalikan = state.columns ? daftarKolom(state.columns) : '*';

      if (state.mode === 'insert') {
        const row = isi(state.values);
        if (!row.columns.length) throw new TypeError('insert tanpa kolom');
        const tabrakan = state.conflict
          ? ` ON CONFLICT (${state.conflict.map((key) => quote(key, 'konflik')).join(',')}) DO NOTHING`
          : '';
        params.push(...row.params);
        const nilai = row.columns.map((_, index) => `$${index + 1}`).join(',');
        return { text: `INSERT INTO ${namaTabel} (${row.columns.join(',')}) VALUES (${nilai})${tabrakan} RETURNING ${kembalikan}`, params };
      }

      if (state.mode === 'update') {
        const row = isi(state.values);
        if (!row.columns.length) throw new TypeError('update tanpa kolom');
        const set = row.columns.map((kolom, index) => `${kolom} = $${index + 1}`).join(',');
        params.push(...row.params);
        const where = state.filters.length
          ? ` WHERE ${state.filters.map(([key, value]) => `${quote(key, 'kolom')} = ${arg(value)}`).join(' AND ')}`
          : '';
        return { text: `UPDATE ${namaTabel} SET ${set}${where} RETURNING ${kembalikan}`, params };
      }

      const where = state.filters.length
        ? ` WHERE ${state.filters.map(([key, value]) => `${quote(key, 'kolom')} = ${arg(value)}`).join(' AND ')}`
        : '';
      const urutan = state.order.length
        ? ` ORDER BY ${state.order.map(([key, ascending]) => `${quote(key, 'kolom')} ${ascending ? 'ASC' : 'DESC'}`).join(',')}`
        : '';
      const batas = state.limit === null ? '' : ` LIMIT ${arg(state.limit)}`;
      return { text: `SELECT ${kembalikan} FROM ${namaTabel}${where}${urutan}${batas}`, params };
    };

    const jalankan = async () => {
      const { text, params } = build();
      try {
        const hasil = await pool.query(text, params);
        return { data: hasil.rows ?? [], error: null };
      } catch (error) {
        const [kode, status] = KODE_GALAT[error?.code] ?? ['database_unavailable', 503];
        return {
          data: [],
          error: { code: kode, status, detail: error?.constraint ?? error?.column ?? String(error?.message ?? '').slice(0, 200) },
        };
      }
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
        state.conflict = String(options.onConflict).split(',').map((key) => key.trim()).filter(Boolean);
        if (!state.conflict.length) throw new TypeError('insertIfAbsent tanpa onConflict');
        return builder;
      },
      update(values) { state.mode = 'update'; state.values = values; return builder; },
      then(fulfilled, rejected) {
        berjalan ??= jalankan();
        return berjalan.then(fulfilled, rejected);
      },
    };

    return builder;
  }

  return { from };
}
