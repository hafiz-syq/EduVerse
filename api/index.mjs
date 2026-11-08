// Titik masuk Vercel Function. Berkas ini menempati rute "/api" dan vercel.json mengirim
// seluruh "/api/..." ke sini lewat rewrite { "/api/(.*)": "/api" }: nama berkas berkotak
// seperti "[...path]" bukan konvensi yang didokumentasikan untuk direktori api/ di proyek
// non-Next, dan deployment pertama membuktikannya — hanya satu segmen yang sampai ke
// Function (/api/home dijawab, /api/arena/weekly dibalas 404 platform tanpa memanggil kode kita).
// Router di functions/src/application.mjs tetap satu-satunya pemilik "rute mana yang butuh login".
//
// Bentuk handler memakai export Web `fetch(request)` yang dokumentasi Vercel rekomendasikan
// untuk direktori api/: Function EduVerse sejak awal bekerja dengan Request/Response Web
// (readJson, cookieValue, sessionCookie), sehingga tidak ada jembatan (req,res) yang bisa
// salah meneruskan body atau set-cookie.
import pg from 'pg';

import { application } from '../functions/src/application.mjs';
import { fail, typedResponse } from '../functions/src/core.mjs';
import { createPgStore } from '../functions/pg-store.mjs';

const nilaiEnv = (name) => process.env[name] ?? '';

// Gagal cepat di log Function lebih baik daripada situs hidup dengan tombol yang mati.
if (!nilaiEnv('DATABASE_URL')) {
  throw new Error('DATABASE_URL belum diisi. Pakai URL endpoint pooled (bernada -pooler) dari Postgres Anda.');
}

// Pool dibuat sekali per instance. Membuat koneksi baru setiap invokasi akan
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

// Gambar iklan dikelola sendiri, jadi unggahnya butuh penyimpanan ber-URL publik.
// Pilihan Vercel Blob belum disetujui pemilik proyek, jadi unggah ditolak dengan pesan
// yang sudah dikenali UI sampai bucket itu dipilih (lihat APP_BLOB_READ_WRITE_TOKEN).
const storage = {
  createSignedUrl: async () => fail('storage_not_configured', 503),
  createSignedUploadUrl: async () => fail('storage_not_configured', 503),
};

const handle = application({
  db: createPgStore(pool),
  storage,
  env,
  // Tanpa identitas platform: sesi EduVerse sepenuhnya cookie __Host-ev_session, dan
  // halaman masuk menawarkan OAuth milik aplikasi.
});

export default {
  async fetch(request) {
    const requestId = `vc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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
  },
};
