// Draf playground tersimpan di perangkat (localStorage), bukan di server: kode yang
// sedang diketik bukan data milik bersama, dan luring harus tetap bisa menulis.
import type { Mode, Project } from "./runner";

export interface Draf {
  mode: Mode;
  project: Project;
  tugasId: string | null;
  pembaruan: number;
}

export interface Semai {
  mode: Mode;
  project: Project;
  sumber?: string;
}

export const KUNCI_DRAF = "ev_playground_draf";
export const KUNCI_SEMAI = "ev_playground_semai";

interface Simpanan {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Fallback untuk Node, tes, dan mode privat tanpa DOM. */
export const simpananMemori = (): Simpanan => {
  const isi = new Map<string, string>();
  return {
    getItem: (key) => isi.get(key) ?? null,
    setItem: (key, value) => void isi.set(key, value),
    removeItem: (key) => void isi.delete(key),
  };
};

export const simpanan = (): Simpanan => {
  try {
    if (typeof localStorage !== "undefined") return localStorage;
  } catch {
    // Mode privat atau frame tanpa akses storage: pakai memori.
  }
  return simpananMemori();
};

const proyekSah = (nilai: unknown): nilai is Project => {
  if (!nilai || typeof nilai !== "object") return false;
  const calon = nilai as Record<string, unknown>;
  return ["html", "css", "js"].every((kunci) => typeof calon[kunci] === "string");
};

export const simpanDraf = (store: Simpanan, draf: Draf) => {
  try {
    store.setItem(KUNCI_DRAF, JSON.stringify(draf));
  } catch {
    // Kuota penuh: draf hilang senyap, lebih baik daripada menulis di tengah ketikan.
  }
};

export const bacaDraf = (store: Simpanan): Draf | null => {
  const mentah = store.getItem(KUNCI_DRAF);
  if (!mentah) return null;
  try {
    const nilai = JSON.parse(mentah) as Partial<Draf>;
    if (nilai.mode !== "web" && nilai.mode !== "js") return null;
    if (!proyekSah(nilai.project)) return null;
    return { mode: nilai.mode, project: nilai.project, tugasId: typeof nilai.tugasId === "string" ? nilai.tugasId : null, pembaruan: Number(nilai.pembaruan) || 0 };
  } catch {
    return null;
  }
};

/** Materi memakai tombol "Coba" untuk menitipkan potongan kode ke playground. */
export const semai = (store: Simpanan, benih: Semai) => {
  try {
    store.setItem(KUNCI_SEMAI, JSON.stringify(benih));
  } catch {
    /* biarkan default */
  }
};

export const ambilSemai = (store: Simpanan): Semai | null => {
  const mentah = store.getItem(KUNCI_SEMAI);
  if (!mentah) return null;
  store.removeItem(KUNCI_SEMAI);
  try {
    const nilai = JSON.parse(mentah) as Partial<Semai>;
    if (nilai.mode !== "web" && nilai.mode !== "js") return null;
    if (!proyekSah(nilai.project)) return null;
    return { mode: nilai.mode, project: nilai.project, sumber: typeof nilai.sumber === "string" ? nilai.sumber : undefined };
  } catch {
    return null;
  }
};

/** Potongan kode dari Materi: tebak bahasa dari isinya, bukan hanya dari label. */
export const benihDariKode = (kode: string, lang?: string): Semai => {
  const label = (lang || "").toLowerCase();
  if (label === "html" || /^\s*</.test(kode)) return { mode: "web", project: { html: kode, css: "", js: "" }, sumber: "materi" };
  if (label === "css" || /^[.#][\w-]+\s*\{/.test(kode.trim())) {
    return { mode: "web", project: { html: '<div id="contoh">Contoh</div>', css: kode, js: "" }, sumber: "materi" };
  }
  return { mode: "js", project: { html: "", css: "", js: kode }, sumber: "materi" };
};
