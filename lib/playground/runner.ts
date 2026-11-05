// Mesin jalan sandbox untuk playground EduVerse.
//
// Dua mode:
//  - "web" : HTML + CSS + JS di dalam <iframe sandbox="allow-scripts">. Atribut sandbox
//    TANPA allow-same-origin membuat dokumen punya asal opaque, jadi kode pengguna tidak
//    bisa membaca DOM induk, tidak membawa cookie EduVerse, dan tidak menyentuh storage.
//  - "js"  : JavaScript murni di Web Worker. Worker bisa dihentikan paksa (terminate),
//    jadi perulangan tak berujung tidak mengunci tab — karena itu mode ini dipakai untuk
//    latihan algoritma.
//
// Kode pengguna tidak pernah disisipkan apa adanya ke dalam <script>: hanya string hasil
// JSON.stringify yang sudah dibersihkan ("<" -> "＜") yang masuk, sehingga "</script>"
// di dalam kode pengguna tidak bisa keluar dari tag skrip kami. CSS ditulis lewat
// textContent saat runtime, bukan lewat <style> di markup, dengan alasan yang sama.

export type Mode = "web" | "js";

export interface Project {
  html: string;
  css: string;
  js: string;
}

export type LogKind = "log" | "info" | "warn" | "error" | "system" | "success";

export interface LogLine {
  kind: LogKind;
  text: string;
}

export interface CheckSpec {
  selector: string;
  text?: string;
  style?: string;
  equals?: string;
}

export interface CekHasil {
  selector: string;
  ok: boolean;
  detail: string;
}

/** Pesan yang dikirim sandbox ke halaman induk. */
export interface SandboxBerita {
  source: "eduverse-sandbox";
  kind: "out" | "done" | "fail" | "check";
  level?: string;
  text?: string;
  ok?: boolean;
  detail?: string;
  selector?: string;
  /** Nomor "Jalankan" yang menghasilkan pesan ini; dipakai untuk membuang berita kedaluwarsa. */
  run?: number;
}

export const PROYEK_AWAL: Project = {
  html: '<h1 id="judul">Halo, EduVerse!</h1>\n<button id="tombol">Klik saya</button>\n<p id="hasil"></p>',
  css: "body { font-family: system-ui, sans-serif; padding: 20px; color: #14243b; }\n#judul { color: #1f6feb; }",
  js: 'const hasil = document.querySelector("#hasil");\nhasil.textContent = "Tekan tombol untuk mulai."; ',
};

export const PROYEK_JS = `// Latihan algoritma dijalankan di Web Worker: tanpa DOM, tapi bisa dihentikan paksa.
function jumlahkan(angka) {
  return angka.reduce((total, n) => total + n, 0);
}

print(jumlahkan([1, 2, 3, 4]));`;

/**
 * Isi payload yang dikirim ke dalam sandbox. `cek` dieksekusi DI DALAM frame karena
 * halaman induk tidak bisa membaca DOM lintas asal (justru itu sandbox-nya bekerja).
 */
export interface Payload {
  css: string;
  js: string;
  cek: CheckSpec[];
  klik: string | null;
  run: number;
}

export const amanJSON = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

// Shim: dibungkus fungsi agar variabelnya tidak mencemari realm sandbox.
const SHIM = `(() => {
  const isWorker = typeof window === "undefined";
  const kirim = (msg) => {
    msg.source = "eduverse-sandbox";
    msg.run = self.__ev_run;
    try {
      if (isWorker) self.postMessage(msg);
      else window.parent.postMessage(msg, "*");
    } catch (e) {}
  };
  const ringkas = (v, kedalaman) => {
    kedalaman = kedalaman || 0;
    if (typeof v === "string") return kedalaman > 0 ? JSON.stringify(v) : v;
    if (v === null) return "null";
    if (v === undefined) return "undefined";
    if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") return String(v);
    if (typeof v === "function") return "[Function " + (v.name || "anonim") + "]";
    if (v instanceof Error) return v.name + ": " + v.message;
    if (typeof v === "symbol") return String(v);
    if (kedalaman > 2) return Array.isArray(v) ? "[...]" : "{...}";
    try {
      if (Array.isArray(v)) return "[" + v.map((x) => ringkas(x, kedalaman + 1)).join(", ") + "]";
      const kunci = Object.keys(v).slice(0, 12);
      const isi = kunci.map((k) => k + ": " + ringkas(v[k], kedalaman + 1));
      return (v.constructor && v.constructor.name !== "Object" ? v.constructor.name + " " : "") + "{" + isi.join(", ") + "}";
    } catch (e) {
      return "[tidak bisa ditampilkan]";
    }
  };
  const keluar = (level) => (...args) => kirim({ kind: "out", level, text: args.map((a) => ringkas(a, 0)).join(" ") });
  const console2 = { log: keluar("log"), info: keluar("info"), warn: keluar("warn"), error: keluar("error"), debug: keluar("log") };
  self.console = console2;
  self.print = console2.log;
  // Sandbox tidak boleh keluar ke jaringan atau memanggil API situs.
  self.fetch = () => Promise.reject(new Error("fetch dinonaktifkan di sandbox"));
  self.XMLHttpRequest = function () { throw new Error("XMLHttpRequest dinonaktifkan di sandbox"); };
  self.WebSocket = function () { throw new Error("WebSocket dinonaktifkan di sandbox"); };
  if (!isWorker) {
    self.alert = (...a) => console2.log.apply(null, a);
    self.confirm = () => true;
    self.prompt = (t) => { console2.log("[prompt] " + t); return ""; };
    self.onerror = (e) => kirim({ kind: "fail", text: e.message || String(e) });
    self.addEventListener("unhandledrejection", (e) => kirim({ kind: "fail", text: "Promise ditolak: " + ringkas(e.reason, 0) }));
  } else {
    self.onerror = (e) => kirim({ kind: "fail", text: e.message || String(e) });
  }
  self.__ev_kirim = kirim;
  self.__ev_ringkas = ringkas;
})()
const __ev_cek = (spesifikasi) => spesifikasi.map((c) => {
  const simpul = document.querySelector(c.selector);
  if (!simpul) return { selector: c.selector, ok: false, detail: c.selector + " tidak ditemukan" };
  if (c.style) {
    const nilai = getComputedStyle(simpul)[c.style] || "";
    const cocok = nilai.replace(/\\s+/g, " ").trim() === String(c.equals).replace(/\\s+/g, " ").trim();
    return { selector: c.selector, ok: cocok, detail: c.selector + " { " + c.style + ": " + nilai + " }" + (cocok ? "" : ", seharusnya " + c.equals) };
  }
  const teks = (simpul.textContent || "").trim();
  const butuh = c.text === undefined ? teks.length > 0 : teks === c.text;
  return { selector: c.selector, ok: butuh, detail: c.selector + ' berisi "' + teks + '"' + (butuh ? "" : ", seharusnya '" + c.text + "'") };
});
const __ev_jalankan = (payload) => {
  const kirim = self.__ev_kirim;
  if (!kirim) return;
  // Setiap berita membawa nomor ini supaya induk bisa menolak pesan dari run
  // sebelumnya: iframe yang srcdoc-nya diganti tetap memakai contentWindow yang sama.
  self.__ev_run = payload.run;
  if (payload.css && typeof document !== "undefined") {
    const gaya = document.createElement("style");
    gaya.textContent = payload.css;
    document.head.appendChild(gaya);
  }
  const selesaikan = (galat) => {
    if (galat) kirim({ kind: "fail", text: self.__ev_ringkas(galat, 0) });
    if (payload.cek.length && typeof document !== "undefined") {
      if (payload.klik) {
        const sasaran = document.querySelector(payload.klik);
        if (sasaran) sasaran.click();
      }
      const laporkan = () => __ev_cek(payload.cek).forEach((hasil) => kirim({ kind: "check", selector: hasil.selector, ok: hasil.ok, detail: hasil.detail }));
      setTimeout(laporkan, 0);
      setTimeout(laporkan, 400);
    }
    kirim({ kind: "done" });
  };
  try {
    new Function(payload.js)();
    selesaikan(null);
  } catch (e) {
    selesaikan(e);
  }
};`;

export const buildPayload = (
  project: Project,
  cek: CheckSpec[] = [],
  klik: string | null = null,
  run: number,
): Payload => ({
  css: project.css,
  js: project.js,
  cek,
  klik,
  run,
});

/** Dokumen srcdoc untuk mode "web". HTML pengguna dibiarkan mentah: ia hanya hidup di dalam frame ber-asal opaque. */
export const bangunDokumenWeb = (project: Project, payload: Payload) =>
  [
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>Pratinjau EduVerse</title></head><body>",
    project.html,
    `<script>${SHIM}\n__ev_jalankan(${amanJSON(payload)});<\/script>`,
    "</body></html>",
  ].join("");

/** Sumber Blob worker untuk mode "js". */
export const bangunKodeWorker = (payload: Payload) => `${SHIM}\n__ev_jalankan(${amanJSON(payload)});`;

/**
 * Pesan keluar/fail → baris konsol. Pesan dari sumber lain diabaikan: ekstensi browser
 * atau halaman lain bisa ikut mengirim postMessage ke jendela ini.
 */
export const tafsirkanBerita = (data: unknown): LogLine | null => {
  const berita = data as SandboxBerita | undefined;
  if (!berita || berita.source !== "eduverse-sandbox") return null;
  if (berita.kind === "out") return { kind: (berita.level as LogKind) || "log", text: berita.text ?? "" };
  if (berita.kind === "fail") return { kind: "error", text: berita.text ?? "galat tanpa pesan" };
  return null;
};

/** Hasil penilaian yang dihitung di dalam frame (hanya mode "web"). */
export const tafsirkanCek = (data: unknown): CekHasil | null => {
  const berita = data as SandboxBerita | undefined;
  if (!berita || berita.source !== "eduverse-sandbox" || berita.kind !== "check") return null;
  return { selector: berita.selector ?? "?", ok: Boolean(berita.ok), detail: berita.detail ?? "" };
};
