// Titik masuk Netlify Function. Jalur URL dijaga sama persis dengan versi Qoder Sites
// (/functions/v1/app/*) supaya frontend, service worker, dan aturan asal permintaan
// tidak perlu cabang khusus host.
import pg from 'pg';

import { application } from '../../functions/src/application.mjs';
import { fail, typedResponse } from '../../functions/src/core.mjs';
import { createPgStore } from '../../functions/pg-store.mjs';

const nilaiEnv = (name) => process.env[name] ?? '';

// Gagal cepat di log Function lebih baik daripada situs hidup dengan tombol yang mati.
if (!nilaiEnv('DATABASE_URL')) {
  throw new Error('DATABASE_URL belum diisi. Pakai URL endpoint pooled (bernada -pooler) dari Postgres Anda.');
}

// Pool dibuat sekali per kontainer. Membuat koneksi baru setiap invikasi akan
// menghabiskan jatah koneksi serverless Postgres begitu trafik naik.
const pool = new pg.Pool({
  connectionString: nilaiEnv('DATABASE_URL'),
  max: Number(nilaiEnv('DATABASE_POOL_MAX') || 3),
  ssl: nilaiEnv('DATABASE_SSL') === 'disable' ? false : { rejectUnauthorized: true },
  connectionTimeoutMillis: 5000,
});

const env = {
  APP_SESSION_SECRET: nilaiEnv('APP_SESSION_SECRET'),
  APP_ADMIN_IDENTITIES: nilaiEnv('APP_ADMIN_IDENTITIES'),
  APP_GOOGLE_CLIENT_ID: nilaiEnv('APP_GOOGLE_CLIENT_ID'),
  APP_GOOGLE_CLIENT_SECRET: nilaiEnv('APP_GOOGLE_CLIENT_SECRET'),
  APP_GITHUB_CLIENT_ID: nilaiEnv('APP_GITHUB_CLIENT_ID'),
  APP_GITHUB_CLIENT_SECRET: nilaiEnv('APP_GITHUB_CLIENT_SECRET'),
  // Opsional. Kosong = alamat permintaan dipakai sebagai asal redirect OAuth.
  APP_PUBLIC_URL: nilaiEnv('APP_PUBLIC_URL'),
};

// Gambar iklan dikelola sendiri, jadi unggahnya butuh bucket yang bisa memberi URL
// publik. Netlify Blobs tidak punya URL publik (tiap tayangan akan membayar compute),
// jadi unggah ditolak dengan pesan yang sudah dikenali UI sampai bucket dipilih.
const storage = {
  createSignedUrl: async () => fail('storage_not_configured', 503),
  createSignedUploadUrl: async () => fail('storage_not_configured', 503),
};

const handle = application({
  db: createPgStore(pool),
  storage,
  env,
  // Tanpa contextUser: identitas EduVerse sepenuhnya dari cookie __Host-ev_session,
  // dan halaman masuk menawarkan OAuth milik aplikasi, bukan identitas platform.
});

export default async function (request, context) {
  const requestId = context?.requestId ?? `nl-${Date.now().toString(36)}`;
  try {
    return await handle({ request, requestId });
  } catch (error) {
    return (
      typedResponse(error, requestId) ??
      new Response(JSON.stringify({ ok: false, error: 'internal_error', request_id: requestId }), {
        status: 500,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      })
    );
  }
}

export const config = {
  path: '/functions/v1/app/*',
};
