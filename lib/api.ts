export const API_BASE = "/api";

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly detail?: string;

  constructor(code: string, status: number, detail?: string) {
    super(code);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.detail = detail;
  }
}

const PESAN: Record<string, string> = {
  login_required: "Masuk dulu untuk membuka bagian ini.",
  forbidden: "Akun Anda tidak punya akses ke tindakan ini.",
  invalid_input: "Periksa lagi isian yang diminta.",
  not_found: "Data yang dicari tidak ada.",
  method_not_allowed: "Cara permintaan tidak didukung.",
  window_closed: "Jendela tantangan sedang tidak dibuka.",
  entry_limit: "Kesertaan Anda di tantangan ini sudah habis.",
  rate_limited: "Terlalu sering dicoba. Tunggu sebentar, lalu ulangi.",
  attempt_closed: "Percobaan kuis ini sudah ditutup.",
  empty_bank: "Bank soal sedang kosong.",
  duplicate: "Entri sudah tercatat.",
  dev_server_error: "Server dev mengalami galat tak terduga.",
  thread_locked: "Diskusi ini dikunci, jadi belum bisa dibalas.",
  self_vote: "Anda tidak bisa menilai tulisan sendiri.",
  origin_mismatch: "Permintaan ditolak karena berasal dari situs lain.",
  provider_unavailable: "Masuk dengan Google/GitHub belum dikonfigurasi di situs ini.",
  state_mismatch: "Sesi login tidak cocok. Mulai lagi dari halaman masuk.",
  code_missing: "Kode otorisasi tidak diterima. Silakan coba lagi.",
  email_missing: "Akun tersebut tidak membagikan email, jadi tidak bisa dipakai masuk.",
  unknown_provider: "Penyedia login itu tidak dikenal.",
  payload_too_large: "Isi permintaan terlalu besar untuk dikirim.",
  storage_not_configured: "Penyimpanan gambar iklan belum disiapkan di situs ini.",
  session_secret_missing: "Server belum punya rahasia sesi. Hubungi pengelola situs.",
  unreachable: "Layanan sedang tidak merespons. Coba beberapa menit lagi, atau lanjutkan lewat paket luring Anda.",
};

/** Galat yang berarti permintaan tidak sampai ke server, jadi aman ditahan untuk dikirim ulang. */
export const isUnreachable = (error: unknown) =>
  error instanceof ApiError ? error.code === "unreachable" : error instanceof TypeError;

export function messageFor(error: unknown): string {
  if (error instanceof ApiError) return PESAN[error.code] ?? error.detail ?? "Terjadi kesalahan.";
  if (error instanceof TypeError) return "Koneksi ke server gagal. Cek jaringan Anda.";
  return "Terjadi kesalahan.";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "same-origin",
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; error?: string; detail?: string }
    | null;
  if (!response.ok || payload?.error) {
    const kode = payload?.error ?? (payload === null ? "unreachable" : `http_${response.status}`);
    throw new ApiError(kode, response.status, payload?.detail);
  }
  return payload as T;
}

export const apiGet = <T>(path: string, signal?: AbortSignal) =>
  request<T>(path, { method: "GET", signal });

export const apiPost = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) });
