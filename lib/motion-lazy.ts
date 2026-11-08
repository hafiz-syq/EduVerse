// Pemanggil malas untuk helper anime.js.
//
// Dua hal yang dijaga di sini:
//  1. lib/motion.ts mengimpor anime.js secara statis, jadi berkas yang ikut chunk awal
//     tidak boleh mengimpornya langsung. Lewat import() di dalam efek, chunk `anime`
//     hanya diminta saat rute yang memakainya benar-benar menampilkan animasi.
//  2. Penjaga prefers-reduced-motion diperiksa sebelum import() supaya pelajar yang
//     mematikan gerakan tidak mengunduh 33 kB pustaka yang tidak pernah dipakai.
//     lib/motion.ts memeriksa ulang guard yang sama — itu penjaga terakhir, bukan duplikasi.
import { useEffect, useRef, type RefObject } from "react";

export type MotionApi = typeof import("@/lib/motion");

type Efek<T> = (motion: MotionApi, root: T) => void;

/** Penjaga yang sama dipakai sebelum import() dan sebelum menggambar elemen hiasan. */
export const gerakanDilarang = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

/**
 * Menjalankan `efek` pada elemen yang dirujuk hasil hook, setiap kali `deps` berubah.
 * `deps` dipakai apa adanya (bukan `[deps]`) karena efeknya mengikuti data yang tiba
 * dari server, dan fungsinya sendiri tidak ikut dibandingkan.
 */
export function gunakanAnimasi<T extends HTMLElement>(deps: unknown[], efek: Efek<T>): RefObject<T | null> {
  const root = useRef<T>(null);

  useEffect(() => {
    if (gerakanDilarang()) return;
    let aktif = true;
    void import("@/lib/motion").then((motion) => {
      const elemen = root.current;
      if (!aktif || !elemen || !motion.bolehGerak()) return;
      efek(motion, elemen);
    });
    return () => {
      aktif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}

/** Anak langsung dari sebuah wadah, siap dipakai sebagai sasaran helper motion. */
export const anakDari = (root: HTMLElement, selector: string) => Array.from(root.querySelectorAll(selector));
