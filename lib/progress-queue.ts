import { apiPost } from "./api";

/**
 * Antrean tulis yang tertahan saat luring. Dua macam aksi:
 *  - "pelajaran": tanda selesai per pelajaran (pola lama, bentuk { lesson_id, done }).
 *  - "code": hasil lab koding yang sudah lulus dinilai di browser.
 * Bentuk lama tanpa kunci `jenis` dinormalisasi supaya antrean yang sudah ada di perangkat
 * pelajar tidak hilang ketika berkas ini naik versi.
 */
type Aksi =
  | { jenis: "pelajaran"; lesson_id: string; done: boolean }
  | { jenis: "code"; task_key: string; mode: "js" | "web"; passed: boolean; duration_ms: number | null };

const KEY = "ev_progress_queue";

const normalisasi = (item: Record<string, unknown>): Aksi | null => {
  if (item.jenis === "code" && typeof item.task_key === "string") {
    return {
      jenis: "code",
      task_key: item.task_key,
      mode: item.mode === "web" ? "web" : "js",
      passed: item.passed === true,
      duration_ms: typeof item.duration_ms === "number" ? item.duration_ms : null,
    };
  }
  const pelajaran = item.jenis === undefined || item.jenis === "pelajaran";
  if (pelajaran && typeof item.lesson_id === "string") {
    return { jenis: "pelajaran", lesson_id: item.lesson_id, done: item.done !== false };
  }
  return null;
};

/** Kunci lipat: pelajaran cukup satu per id, tiap pengiriman kode dihitung terpisah. */
const tanda = (item: Aksi) => (item.jenis === "pelajaran" ? `pelajaran:${item.lesson_id}` : `code:${item.task_key}:${item.duration_ms ?? 0}`);

const read = (): Aksi[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((item) => normalisasi(item)).filter((item): item is Aksi => item !== null) : [];
  } catch {
    return [];
  }
};

const write = (items: Aksi[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* Penyimpanan privat tidak tersedia: tanda selesai tidak bertahan, tapi tidak merusak aplikasi. */
  }
};

const adalahPelajaran = (item: Aksi, lessonId: string) => item.jenis === "pelajaran" && item.lesson_id === lessonId;

export const pendingProgress = () => read().length;

export function queueProgress(lessonId: string, done: boolean) {
  const item: Aksi = { jenis: "pelajaran", lesson_id: lessonId, done };
  write([...read().filter((sebelum) => !adalahPelajaran(sebelum, lessonId)), item]);
}

export const forgetQueued = (lessonId: string) => write(read().filter((item) => !adalahPelajaran(item, lessonId)));

/** Tahan hasil lab yang lulus; pengiriman ulang terjadi saat terhubung lagi. */
export function queueCodeRun(taskKey: string, mode: "js" | "web", durationMs: number | null) {
  const item: Aksi = { jenis: "code", task_key: taskKey, mode, passed: true, duration_ms: durationMs };
  const tersisa = read().filter((sebelum) => tanda(sebelum) !== tanda(item));
  write([...tersisa, item]);
}

async function kirim(item: Aksi) {
  if (item.jenis === "pelajaran") {
    await apiPost("/progress", { lesson_id: item.lesson_id, done: item.done });
    return;
  }
  await apiPost("/code/run", { task_key: item.task_key, mode: item.mode, passed: item.passed, duration_ms: item.duration_ms });
}

/** Kirim aksi yang tertahan; antrean dibersihkan hanya untuk yang benar-benar diterima server. */
export async function flushProgress(): Promise<number> {
  const items = read();
  if (!items.length) return 0;
  let terkirim = 0;
  const gagal: Aksi[] = [];
  for (const item of items) {
    try {
      await kirim(item);
      terkirim += 1;
    } catch {
      gagal.push(item);
    }
  }
  write(gagal);
  return terkirim;
}
