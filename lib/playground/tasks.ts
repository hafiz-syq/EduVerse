// Daftar latihan playground. Sengaja data murni: tidak ada DOM, tidak ada jaringan,
// supaya bisa diuji di Node dan tetap jalan saat luring.
import type { CheckSpec, Mode, Project } from "./runner";

export type Tingkat = "dasar" | "menengah" | "lanjutan";

export interface Tugas {
  id: string;
  judul: string;
  mode: Mode;
  tingkat: Tingkat;
  ringkas: string;
  petunjuk: string[];
  mulai: Project;
  /** Mode "web": kondisi yang dinilai DI DALAM frame. */
  cek: CheckSpec[];
  /** Mode "web": selector yang diklik sebelum penilaian (melatih event). */
  klik?: string;
  /** Mode "js": baris konsol yang harus muncul, berurutan dan persis. */
  harapan: string[];
}

const proyekJS = (js: string): Project => ({ html: "", css: "", js });

export const TUGAS: Tugas[] = [
  {
    id: "sapa",
    judul: "Perbaiki sapaan",
    mode: "js",
    tingkat: "dasar",
    ringkas: "Cetak teks persis: Halo, EduVerse!",
    petunjuk: ["Teks dicetak dengan print().", "Tanda kutip dan huruf besar dihitung persis."],
    mulai: proyekJS('print("Halo dunia");'),
    cek: [],
    harapan: ["Halo, EduVerse!"],
  },
  {
    id: "jumlah",
    judul: "Perbaiki total",
    mode: "js",
    tingkat: "dasar",
    ringkas: "jumlahkan([1, 2, 3, 4, 5]) harus mencetak 15.",
    petunjuk: ["reduce() butuh nilai awal.", "Coba telusuri: total = 0, lalu total + 1, + 2, ..."],
    mulai: proyekJS(`function jumlahkan(angka) {
  return angka.reduce((total, n) => total * n);
}

print(jumlahkan([1, 2, 3, 4, 5]));`),
    cek: [],
    harapan: ["15"],
  },
  {
    id: "kuadrat",
    judul: "Cetak angka kuadrat",
    mode: "js",
    tingkat: "dasar",
    ringkas: "Cetak kuadrat 1 sampai 5, satu angka per baris: 1 4 9 16 25.",
    petunjuk: ["Kuadrat = n * n.", "Satu print() menghasilkan satu baris konsol."],
    mulai: proyekJS(`for (let n = 1; n <= 5; n++) {
  print(n * 2);
}`),
    cek: [],
    harapan: ["1", "4", "9", "16", "25"],
  },
  {
    id: "fizzbuzz",
    judul: "FizzBuzz lengkap",
    mode: "js",
    tingkat: "menengah",
    ringkas: "Kelipatan 3 = Fizz, kelipatan 5 = Buzz, keduanya = FizzBuzz.",
    petunjuk: ["Urutan kondisi penting: cek % 15 lebih dulu, atau gunakan % 3 dan % 5 bersama.", "Sisa bagi memakai operator %."],
    mulai: proyekJS(`for (let n = 1; n <= 15; n++) {
  if (n % 3 === 0) {
    print("Fizz");
  } else {
    print(n);
  }
}`),
    cek: [],
    harapan: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
  },
  {
    id: "judul",
    judul: "Beri identitas pada judul",
    mode: "web",
    tingkat: "dasar",
    ringkas: "Judul <h1> harus punya id=\"judul\" dan tulisan \"Selamat datang\".",
    petunjuk: ["id ditambahkan di tag pembuka: <h1 id=\"judul\">.", "Penilai mencari elemen dengan #judul."],
    mulai: {
      html: "<h1>Selamat datang</h1>\n<p>Ini halaman pertamamu.</p>",
      css: "body { font-family: system-ui, sans-serif; padding: 20px; }",
      js: "// Tidak perlu JavaScript untuk tugas ini.",
    },
    cek: [{ selector: "#judul", text: "Selamat datang" }],
    harapan: [],
  },
  {
    id: "tombol-klik",
    judul: "Sambungkan tombol",
    mode: "web",
    tingkat: "dasar",
    ringkas: "Saat #tombol diklik, #hasil harus berisi \"Diklik!\".",
    petunjuk: ['addEventListener("click", ...) pada #tombol.', "Di dalam fungsi, ubah teksContent #hasil menjadi Diklik!"],
    mulai: {
      html: '<h1 id="judul">Latihan klik</h1>\n<button id="tombol">Klik saya</button>\n<p id="hasil">Belum diklik</p>',
      css: "body { font-family: system-ui, sans-serif; padding: 20px; }\nbutton { padding: 8px 14px; border-radius: 8px; border: 1px solid #1f6feb; background: #1f6feb; color: white; }",
      js: `const hasil = document.querySelector("#hasil");
document.querySelector("#tombol").addEventListener("click", () => {
  hasil.textContent = "Halo";
});`,
    },
    cek: [{ selector: "#hasil", text: "Diklik!" }],
    klik: "#tombol",
    harapan: [],
  },
  {
    id: "warna-brand",
    judul: "Warna biru EduVerse",
    mode: "web",
    tingkat: "menengah",
    ringkas: "Ubah latar #kotak menjadi biru #1F6FEB.",
    petunjuk: ["Tulis di panel CSS: #kotak { background-color: #1f6feb; }", "Browser menghitung #1f6feb menjadi rgb(31, 111, 235)."],
    mulai: {
      html: '<div id="kotak">Kotak warna</div>',
      css: "#kotak {\n  padding: 24px;\n  border-radius: 12px;\n  color: white;\n  background-color: #f0749f;\n}",
      js: "",
    },
    cek: [{ selector: "#kotak", style: "background-color", equals: "rgb(31, 111, 235)" }],
    harapan: [],
  },
  {
    id: "daftar",
    judul: "Bangun daftar dari data",
    mode: "web",
    tingkat: "lanjutan",
    ringkas: "#daftar harus punya 3 item, dan #jumlah berisi angka 3.",
    petunjuk: ["Buat elemen dengan document.createElement lalu appendChild.", "Array.length memberi jumlah item."],
    mulai: {
      html: '<h1 id="judul">Daftar kelas</h1>\n<ul id="daftar"></ul>\n<p id="jumlah">0</p>',
      css: "body { font-family: system-ui, sans-serif; padding: 20px; }",
      js: `const kelas = ["JavaScript", "CSS", "HTML"];
const daftar = document.querySelector("#daftar");

for (const nama of kelas) {
  // TODO: buat <li> lalu tambahkan ke daftar.
}

document.querySelector("#jumlah").textContent = "0";`,
    },
    cek: [{ selector: "#jumlah", text: "3" }, { selector: "#daftar li:nth-child(3)" }],
    harapan: [],
  },
];

export const cariTugas = (id: string | null | undefined) => TUGAS.find((t) => t.id === id) ?? null;

/** Baris konsol 'log' saja yang dibandingkan, supaya warning/error tidak ikut dihitung. */
export const logBiasa = (logs: { kind: string; text: string }[]) =>
  logs.filter((line) => line.kind === "log").map((line) => line.text.trim());

export const nilaiOutput = (harapan: string[], logs: { kind: string; text: string }[]) => {
  const aktual = logBiasa(logs);
  if (!harapan.length) return { lulus: false, detail: "Tugas ini tidak punya harapan output." };
  const cocok = harapan.length === aktual.length && harapan.every((baris, indeks) => baris === aktual[indeks]);
  return {
    lulus: cocok,
    detail: cocok
      ? `${harapan.length} baris output cocok.`
      : `Diharapkan ${harapan.length} baris (${harapan.slice(0, 3).join(" | ")}...), aktual ${aktual.length} baris (${aktual.slice(0, 3).join(" | ")}...).`,
  };
};

/** Semua cek yang dikirim sandbox harus masuk, berurutan, dan lulus. */
export const nilaiCekWeb = (jumlah: number, hasil: { ok: boolean; detail: string }[]) => {
  if (jumlah === 0) return { lulus: false, detail: "Tidak ada kondisi untuk dinilai." };
  if (hasil.length < jumlah) return { lulus: false, detail: `${hasil.length}/${jumlah} kondisi belum dinilai.` };
  const gagal = hasil.filter((item) => !item.ok);
  return { lulus: gagal.length === 0, detail: gagal.length ? `${gagal.length} kondisi belum terpenuhi.` : `${jumlah} kondisi terpenuhi.` };
};
