// Helper animasi berbasis Anime.js v4.
//
// Aturan yang dijaga di sini:
//  1. prefers-reduced-motion = nilai akhir diterapkan tanpa gerak. Blok global di
//     globals.css hanya menekan animasi CSS; transform yang di-set lewat JS tidak
//     terpengaruh, jadi penjagaannya harus di modul ini.
//  2. Tidak ada animasi yang menahan interaksi: semuanya singkat (<700ms), tanpa loop
//     tak berujung, dan hanya menganimasikan transform/opacity agar halus di ponsel.
import { animate, stagger } from "animejs";

type Simpul = HTMLElement | SVGElement;
/**
 * Semua bentuk sasaran yang wajar dipakai pemanggil: selector, elemen tunggal,
 * koleksi hasil `.children`, array, ref React, atau ref yang masih null.
 * null/undefined berarti "belum terpasang" dan dianggap daftar kosong.
 */
type Sasaran = string | Element | readonly Element[] | { current: Element | null } | null | undefined;

const daftarSimpul = (target: Sasaran): Simpul[] => {
  if (target == null) return [];
  if (typeof target === "string") return Array.from(document.querySelectorAll<HTMLElement>(target));
  if ("current" in target) return target.current ? [target.current as Simpul] : [];
  if (Array.isArray(target)) return target.slice() as Simpul[];
  if ("nodeType" in target) return [target as Simpul];
  return Array.from(target as unknown as ArrayLike<Simpul>);
};

export const bolehGerak = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const nilaiAkhir = (target: Sasaran, opacity: string, transform: string) => {
  for (const el of daftarSimpul(target)) {
    const gaya = (el as HTMLElement).style;
    gaya.opacity = opacity;
    gaya.transform = transform;
  }
};

/** Munculkan elemen dari bawah sambil mengudar — kartu, baris konsol, panel. */
export const munculkan = (
  target: Sasaran,
  opts: { jarak?: number; jeda?: number; antar?: number; durasi?: number } = {},
) => {
  const { jarak = 16, jeda = 0, antar = 60, durasi = 520 } = opts;
  const simpul = daftarSimpul(target);
  if (!simpul.length) return null;
  if (!bolehGerak()) {
    nilaiAkhir(simpul, "1", "translateY(0px)");
    return null;
  }
  return animate(simpul, {
    opacity: [0, 1],
    translateY: [jarak, 0],
    duration: durasi,
    delay: stagger(antar, { start: jeda }),
    ease: "out(3)",
  });
};

/** Kartu masuk per kisi: jarak stagger dihitung dari kolom, jadi gelombangnya merata. */
export const munculkanKisi = (target: Sasaran, kolom = 3, antar = 55) => {
  const simpul = daftarSimpul(target);
  if (!simpul.length) return null;
  if (!bolehGerak()) {
    for (const el of simpul) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0px) scale(1)";
    }
    return null;
  }
  const baris = Math.max(1, Math.ceil(simpul.length / Math.max(1, kolom)));
  return animate(simpul, {
    opacity: [0, 1],
    scale: [0.94, 1],
    translateY: [18, 0],
    duration: 560,
    delay: stagger(antar, { grid: [kolom, baris], from: "center" }),
    ease: "out(4)",
  });
};

/** Denyut singkat saat tombol Jalankan ditekan. */
export const denyut = (target: Sasaran) => {
  const simpul = daftarSimpul(target);
  if (!simpul.length || !bolehGerak()) return null;
  return animate(simpul, { scale: [1, 0.93, 1], duration: 300, ease: "out(5)" });
};

/** Getar pendek untuk kode yang gagal atau jawaban salah. */
export const getar = (target: Sasaran) => {
  const simpul = daftarSimpul(target);
  if (!simpul.length || !bolehGerak()) return null;
  return animate(simpul, { translateX: [0, -7, 6, -4, 3, 0], duration: 360, ease: "out(2)" });
};

/** Percik: elemen titik yang sudah ada di DOM diterbangkan ke segala arah lalu hilang. */
export const percik = (target: Sasaran, jarak = 62) => {
  const simpul = daftarSimpul(target);
  if (!simpul.length || !bolehGerak()) return null;
  const jumlah = simpul.length;
  return animate(simpul, {
    opacity: [1, 0],
    translateX: (_t: unknown, i?: number) => Math.cos((((i ?? 0) + 0.5) / jumlah) * Math.PI * 2) * jarak,
    translateY: (_t: unknown, i?: number) => Math.sin((((i ?? 0) + 0.5) / jumlah) * Math.PI * 2) * jarak,
    scale: [0.6, 1.25],
    duration: 520,
    ease: "out(3)",
  });
};

/** Angka skor/XP yang menghitung naik untuk banner hasil. */
export const hitungNaik = (target: Sasaran, ke: number) => {
  const simpul = daftarSimpul(target)[0] as HTMLElement | undefined;
  if (!simpul) return null;
  if (!bolehGerak()) {
    simpul.textContent = String(ke);
    return null;
  }
  const nilai = { n: 0 };
  return animate(nilai, {
    n: ke,
    duration: 640,
    ease: "out(3)",
    onUpdate: () => {
      simpul.textContent = String(Math.round(nilai.n));
    },
  });
};
