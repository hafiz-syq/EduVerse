// Kontrak adapter Postgres: SQL dan urutan parameter harus sama persis dengan yang
// dijanjikan dev/fake-db.mjs, karena 158 pemanggilan store di functions/src tidak diubah.
import assert from 'node:assert/strict';
import test from 'node:test';

import { createPgStore } from '../netlify/pg-store.mjs';
import { makeStore } from '../functions/src/core.mjs';

function perekam(rows = []) {
  const log = [];
  return {
    log,
    async query(text, params) {
      log.push({ text, params });
      return { rows };
    },
  };
}

const satu = (rows) => {
  const pool = perekam(rows);
  return { pool, store: makeStore(createPgStore(pool)) };
};

test('bacaan memakai kolom, filter, order, dan limit yang diparameter', async () => {
  const { pool, store } = satu([{ id: 'u1', name: 'Rangga' }]);
  const user = await store.one('users', 'id,name', [['id', 'u1']]);

  assert.deepEqual(user, { id: 'u1', name: 'Rangga' });
  assert.deepEqual(pool.log, [{
    text: 'SELECT "id","name" FROM "app"."users" WHERE "id" = $1 LIMIT $2',
    params: ['u1', 100],
  }]);
});

test('order mengikuti pilihan ascending, termasuk descending untuk papan peringkat', async () => {
  const { pool, store } = satu([]);
  await store.all('tournaments', 'id,key,starts_at', { column: 'starts_at', ascending: false }, 20);
  assert.equal(pool.log[0].text, 'SELECT "id","key","starts_at" FROM "app"."tournaments" ORDER BY "starts_at" DESC LIMIT $1');

  await store.all('modules', 'id,slug', { column: 'order_no', ascending: true }, 120);
  assert.equal(pool.log[1].text, 'SELECT "id","slug" FROM "app"."modules" ORDER BY "order_no" ASC LIMIT $1');
});

test('insert melewati kolom bernilai undefined supaya DEFAULT kerja di server', async () => {
  const { pool, store } = satu([]);
  await store.insert('users', { id: 'u1', name: 'A', picture: undefined, role: 'pembelajar' });
  assert.deepEqual(pool.log[0], {
    text: 'INSERT INTO "app"."users" ("id","name","role") VALUES ($1,$2,$3) RETURNING *',
    params: ['u1', 'A', 'pembelajar'],
  });
});

test('insertAbsent jadi ON CONFLICT DO NOTHING dan diam saat baris sudah ada', async () => {
  const pool = perekam([]);
  await makeStore(createPgStore(pool)).insertAbsent('user_state', { user_id: 'u1', xp: 0 }, 'user_id');
  assert.deepEqual(pool.log[0], {
    text: 'INSERT INTO "app"."user_state" ("user_id","xp") VALUES ($1,$2) ON CONFLICT ("user_id") DO NOTHING RETURNING *',
    params: ['u1', 0],
  });
});

test('update menaruh nilai SET sebelum nilai WHERE', async () => {
  const { pool, store } = satu([{ key: 'k' }]);
  await store.patch('limiter', { count: 6 }, [['key', 'k'], ['count', 5]], 'key');
  assert.deepEqual(pool.log[0], {
    text: 'UPDATE "app"."limiter" SET "count" = $1 WHERE "key" = $2 AND "count" = $3 RETURNING "key"',
    params: [6, 'k', 5],
  });
});

test('galat Postgres diterjemahkan ke kode yang dikenal frontend', async () => {
  const tabrak = perekam();
  tabrak.query = async () => { throw Object.assign(new Error('duplicate'), { code: '23505', constraint: 'users_identity_key' }); };
  const hasil = await createPgStore(tabrak).from('users').insert({ identity: 'qoder:x' });
  assert.deepEqual(hasil, { data: [], error: { code: 'unique_violation', status: 409, detail: 'users_identity_key' } });

  const kosong = perekam();
  kosong.query = async () => { throw Object.assign(new Error('null'), { code: '23502', column: 'title' }); };
  const dua = await createPgStore(kosong).from('lessons').insert({ title: null });
  assert.equal(dua.error.code, 'not_null_violation');
  assert.equal(dua.error.status, 400);

  const tipeSalah = perekam();
  tipeSalah.query = async () => { throw Object.assign(new Error('bad uuid'), { code: '22P02' }); };
  const tiga = await createPgStore(tipeSalah).from('users').select('id');
  assert.equal(tiga.error.code, 'invalid_input');
  assert.equal(tiga.error.status, 400);

  const jatuh = perekam();
  jatuh.query = async () => { throw Object.assign(new Error('server closed'), { code: '57P01' }); };
  const empat = await createPgStore(jatuh).from('courses').select('id');
  assert.equal(empat.error.code, 'database_unavailable');
  assert.equal(empat.error.status, 503);
});

test('store mengubah galat adapter menjadi AppError dengan kode dan status', async () => {
  const pool = perekam();
  pool.query = async () => { throw Object.assign(new Error('duplicate'), { code: '23505', constraint: 'users_identity_key' }); };
  await assert.rejects(
    () => makeStore(createPgStore(pool)).insert('users', { identity: 'qoder:x' }),
    (error) => error.code === 'unique_violation' && error.status === 409,
  );
});

test('identifier yang bukan nama kolom tabel ditolak sebagai bug kode, bukan sebagai data', async () => {
  const { store, pool } = satu([]);
  await assert.rejects(() => store.one('users', 'id FROM users; DROP TABLE users; --', [['id', 'u1']]), TypeError);
  await assert.rejects(() => store.all('modules;drop', 'id'), TypeError);
  assert.equal(pool.log.length, 0, 'query tidak boleh dikirim ke server');
});

test('builder tidak mengirim apa pun sebelum diawait', async () => {
  const pool = perekam([]);
  const db = createPgStore(pool);
  db.from('courses').select('id').eq('slug', 'x').limit(5);
  assert.equal(pool.log.length, 0);
});
