import { apiPost } from "./api";

interface QueuedProgress {
  lesson_id: string;
  done: boolean;
}

const KEY = "ev_progress_queue";

const read = (): QueuedProgress[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as QueuedProgress[]) : [];
  } catch {
    return [];
  }
};

const write = (items: QueuedProgress[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* Penyimpanan privat tidak tersedia: tanda selesai tidak bertahan, tapi tidak merusak aplikasi. */
  }
};

export const pendingProgress = () => read().length;

export function queueProgress(lessonId: string, done: boolean) {
  const items = read().filter((item) => item.lesson_id !== lessonId);
  items.push({ lesson_id: lessonId, done });
  write(items);
}

export const forgetQueued = (lessonId: string) => write(read().filter((item) => item.lesson_id !== lessonId));

/** Kirim tanda selesai yang tertahan; antrean dibersihkan hanya kalau server menerimanya. */
export async function flushProgress(): Promise<number> {
  const items = read();
  if (!items.length) return 0;
  let terkirim = 0;
  const gagal: QueuedProgress[] = [];
  for (const item of items) {
    try {
      await apiPost("/progress", { lesson_id: item.lesson_id, done: item.done });
      terkirim += 1;
    } catch {
      gagal.push(item);
    }
  }
  write(gagal);
  return terkirim;
}
