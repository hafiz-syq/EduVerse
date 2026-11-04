// Bootstrap konten pertama EduVerse. Idempoten lewat insertIfAbsent dengan UUID tetap,
// dijalankan malas (saat katalog pertama dibaca), bukan sebagai DML migrasi.

const uuid = (n) => `0f5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const COURSES = [
  {
    id: uuid(1),
    slug: 'web-dasar',
    title: 'Dasar Web: HTML, CSS, dan Tampilan',
    summary: 'Membangun halaman pertama sampai tampil rapi di ponsel. Cocok untuk yang belum pernah menyentuh kode.',
    level: 'pemula',
    order_no: 1,
  },
  {
    id: uuid(2),
    slug: 'javascript-untuk-pemula',
    title: 'JavaScript untuk Pemula',
    summary: 'Logika pemrograman lewat bahasa yang langsung jalan di browser: variabel, fungsi, dan array.',
    level: 'pemula',
    order_no: 2,
  },
  {
    id: uuid(3),
    slug: 'struktur-data',
    title: 'Struktur Data & Algoritma Praktis',
    summary: 'Bentuk data yang dipakai aplikasi nyata, dan cara memilih yang tepat saat wawancara kerja.',
    level: 'madya',
    order_no: 3,
  },
];

const MODULES = [
  ['web-dasar', 'html-pertama', 'Struktur Halaman HTML', 3, 2],
  ['web-dasar', 'css-dasar', 'Mengatur Tampilan dengan CSS', 3, 2],
  ['web-dasar', 'responsif', 'Layout Responsif dan Flexbox', 3, 2],
  ['javascript-untuk-pemula', 'js-dasar', 'Variabel, Tipe, dan Operator', 4, 2],
  ['javascript-untuk-pemula', 'js-fungsi', 'Fungsi, Scope, dan Method Array', 3, 2],
  ['struktur-data', 'stack-queue', 'Antrian dan Stack di Dunia Nyata', 3, 2],
];

// blok: p = paragraf, h2 = subjudul, code = blok kode, list = butir, tip = catatan
const LESSONS = [
  ['html-pertama', 'Apa itu HTML', [
    { t: 'p', x: 'HTML bukan bahasa pemrograman, melainkan bahasa penanda (markup). Tugasnya memberi tahu browser bagian mana judul, mana paragraf, mana gambar.' },
    { t: 'code', lang: 'html', x: '<!doctype html>\n<html lang="id">\n  <body>\n    <h1>Halo, EduVerse</h1>\n    <p>Halaman pertama saya.</p>\n  </body>\n</html>' },
    { t: 'tip', x: 'Baris <!doctype html> memberi tahu browser untuk memakai mode standar. Tanpanya, tampilan bisa berubah sendiri.' },
  ], 8],
  ['html-pertama', 'Semantik: memilih tag yang benar', [
    { t: 'p', x: 'Tag semantik describing makna, bukan tampilan. <nav> untuk navigasi, <main> untuk isi utama, <article> untuk konten mandiri, <section> untuk bagian bertopik.' },
    { t: 'list', items: ['<header> dan <footer>: pembuka dan penutup halaman atau artikel', '<article>: konten yang masih masuk akal jika dipindah ke halaman lain', '<section>: bagian dalam satu topik, biasanya punya judul sendiri'] },
    { t: 'p', x: 'Alasan ini penting: pembaca layar, hasil pencarian Google, dan EdiVerse mode luring semuanya bergantung pada struktur, bukan warna.' },
  ], 10],
  ['html-pertama', 'Tautan, gambar, dan formulir', [
    { t: 'p', x: 'Tiga elemen yang hampir selalu ada: tautan (<a href>), gambar (<img src alt>), dan formulir (<form> dengan <input>).' },
    { t: 'code', lang: 'html', x: '<a href="/materi/css-dasar">Lanjut ke CSS</a>\n<img src="diagram.svg" alt="Diagram alur antrian" width="480" />\n<label for="email">Email</label>\n<input id="email" type="email" required />' },
    { t: 'tip', x: 'alt bukan hiasan. Tanpa alt, pengguna pembaca layar hanya mendengar nama file.' },
  ], 9],
  ['css-dasar', 'Selector dan kotak', [
    { t: 'p', x: 'CSS memilih elemen lalu mengubah tampilannya. Setiap elemen adalah kotak: konten, padding, border, margin.' },
    { t: 'code', lang: 'css', x: '.kartu {\n  padding: 16px;\n  border: 1px solid #e4eaf2;\n  border-radius: 12px;\n}\n\n.kartu h2 {\n  margin: 0 0 8px;\n}' },
    { t: 'p', x: 'Gunakan class, bukan id, untuk gaya yang berulang. Id unik per halaman dan punyaspecificity lebih tinggi sehingga menyusahkan di kemudian hari.' },
  ], 11],
  ['css-dasar', 'Variabel warna dan tema', [
    { t: 'p', x: 'Simpan warna sebagai variabel agar satu perubahan mengubah seluruh situs, termasuk mode gelap.' },
    { t: 'code', lang: 'css', x: ':root {\n  --primary: #1f6feb;\n  --foreground: #14243b;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --primary: #5ea0f5;\n    --foreground: #e8eef7;\n  }\n}' },
    { t: 'tip', x: 'Kontras teks ke latar minimal 4.5:1 untuk teks biasa. Biru #1F6FEB di atas putih lolos; kuning murni di atas krem biasanya tidak.' },
  ], 10],
  ['css-dasar', 'Unit: px, rem, dan %', [
    { t: 'list', items: ['px untuk garis tepi dan detail kecil yang memang harus tegas', 'rem untuk ukuran teks dan jarak, karena mengikuti pengaturan font pengguna', '% atau fr untuk lebar kolom yang mengikuti wadah'] },
    { t: 'code', lang: 'css', x: 'body { font-size: 1rem; line-height: 1.6; }\n.judul { font-size: 1.75rem; margin-bottom: 0.5rem; }' },
  ], 7],
  ['responsif', 'Mobile first dan media query', [
    { t: 'p', x: 'Mulai dari tampilan ponsel, lalu tambah aturan untuk layar lebar. Lebih mudah menambah daripada mencabut.' },
    { t: 'code', lang: 'css', x: '.daftar { display: grid; gap: 12px; }\n\n@media (min-width: 720px) {\n  .daftar { grid-template-columns: 2fr 1fr; }\n}' },
  ], 9],
  ['responsif', 'Flexbox untuk deretan', [
    { t: 'p', x: 'Flexbox mengatur satu baris. justify-content mengatur sumbu utama, align-items sumbu silang, gap menggantikan margin tempel.' },
    { t: 'code', lang: 'css', x: '.toolbar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.toolbar .spacer { margin-left: auto; }' },
  ], 9],
  ['responsif', 'Grid dua kolom yang tidak patah', [
    { t: 'code', lang: 'css', x: '.layout {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n  gap: 16px;\n}' },
    { t: 'tip', x: 'auto-fit plus minmax membuat kartu menyesuaikan sendiri tanpa satu pun media query.' },
  ], 8],
  ['js-dasar', 'Variabel dan tipe data', [
    { t: 'p', x: 'Pakai const untuk nilai yang tidak diganti, let untuk yang berubah. var adalah warisan lama dan sebaiknya ditinggalkan.' },
    { t: 'code', lang: 'js', x: 'const nama = "Rafi";\nlet skor = 0;\nskor += 10;\n\n// tipe dasar: string, number, boolean, null, undefined, bigint, symbol' },
  ], 8],
  ['js-dasar', 'Operator dan pengecohan', [
    { t: 'p', x: 'Gunakan === dan !==. Perbandingan longgar melakukan konversi tipe yang mengejutkan: 0 == "" bernilai true.' },
    { t: 'code', lang: 'js', x: '0 == "";   // true, hindari\n0 === "";  // false\nnull ?? "cadangan"; // null hanya untuk kosongkan nilai' },
  ], 9],
  ['js-dasar', 'Array dan objek', [
    { t: 'code', lang: 'js', x: 'const peserta = [\n  { nama: "Kanaya", skor: 3410 },\n  { nama: "Rafi", skor: 3120 },\n];\n\nconst terbaik = peserta[0].nama;' },
    { t: 'list', items: ['Array untuk urutan, objek untuk pasangan kunci-nilai', 'Destructuring: const { nama } = peserta[0]', 'Optional chaining: peserta[99]?.nama tidak melempar error'] },
  ], 10],
  ['js-dasar', 'Alur: percabangan dan perulangan', [
    { t: 'code', lang: 'js', x: 'for (const item of peserta) {\n  if (item.skor >= 3000) console.log(`${item.nama}: emas`);\n  else console.log(`${item.nama}: lanjut latihan`);\n}' },
    { t: 'tip', x: 'for...of untuk nilai, for...in untuk kunci objek dan mudah salah pada array. Pilih for...of.' },
  ], 9],
  ['js-fungsi', 'Mendefinisikan fungsi', [
    { t: 'code', lang: 'js', x: 'function hitungXp(benar, total) {\n  if (total === 0) return 0;\n  return Math.round((benar / total) * 100);\n}\n\nconst bonus = (xp, kelipatan = 2) => xp * kelipatan;' },
  ], 8],
  ['js-fungsi', 'Scope dan closure', [
    { t: 'p', x: 'Fungsi yang ingat variabel di sekitarnya disebut closure. Ini dasar dari pembuatan counter dan modul pola factory.' },
    { t: 'code', lang: 'js', x: 'function pembuatCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst counter = pembuatCounter();\ncounter(); // 1\ncounter(); // 2' },
  ], 10],
  ['js-fungsi', 'Method array yang dipakai tiap hari', [
    { t: 'list', items: ['map: mengubah setiap item jadi bentuk baru', 'filter: menyaring tanpa mengubah isi', 'reduce: memadatkan jadi satu nilai (hati-hati keterbacaan)', 'find / some / every: cek keberadaan'] },
    { t: 'code', lang: 'js', x: 'const lulus = attempts\n  .filter(a => a.status === "lulus")\n  .map(a => a.score)\n  .reduce((max, s) => Math.max(max, s), 0);' },
  ], 11],
  ['stack-queue', 'Stack: terakhir masuk, pertama keluar', [
    { t: 'p', x: 'Stack cocok untuk urutan yang harus kembali ke keadaan terakhir: tombol undo, riwayat navigasi, dan tanda kurung yang berpasangan.' },
    { t: 'code', lang: 'js', x: 'const tumpukan = [];\ntumpukan.push("buka file a.txt");\ntumpukan.push("ketik 12 karakter");\nconst undoTerakhir = tumpukan.pop();' },
  ], 9],
  ['stack-queue', 'Queue: pertama masuk, pertama dilayani', [
    { t: 'p', x: 'Antrian menjaga urutan adil: pesanan, job email, dan penjadwal tugas. Operasi dequeue pada array JavaScript adalah O(n) karena indeks bergeser.' },
    { t: 'code', lang: 'js', x: 'class Antrian {\n  constructor() { this.depan = 0; this.item = []; }\n  enqueue(x) { this.item.push(x); }\n  dequeue() {\n    if (this.depan >= this.item.length) return undefined;\n    const nilai = this.item[this.depan];\n    this.depan += 1;\n    return nilai;\n  }\n}' },
    { t: 'tip', x: 'Penunjuk indeks (this.depan) membuat dequeue O(1) tanpa menggeser isi array.' },
  ], 12],
  ['stack-queue', 'Memilih struktur saat wawancara', [
    { t: 'list', items: ['Butuh "yang terbaru" dulu: stack', 'Butuh "yang paling lama menunggu" dulu: queue', 'Butuh dua arah: deque (双端) atau linked list', 'Butuh pencarian cepat: hash map, bukan array'] },
    { t: 'p', x: 'Soal klasik seperti "valid parentheses" hampir selalu diselesaikan dengan stack, dan "hot reload job order" dengan queue.' },
  ], 8],
];

const BANKS = [
  {
    module: 'html-pertama',
    title: 'Kuis Struktur HTML',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tag mana yang menandai isi utama halaman?', ['<section>', '<main>', '<article>', '<div>'], 1, '<main> hanya satu per halaman dan menjadi jangkar utama bagi teknologi bantu.'],
      ['Fungsi atribut alt pada gambar adalah…', ['menentukan tinggi gambar', 'teks pengganti saat gambar tidak terlihat', 'memberi judul tooltip', 'menyimpan hak cipta'], 1, 'alt dibaca pembaca layar dan tampil saat gambar gagal dimuat.'],
      ['Baris <!doctype html> berguna untuk…', ['memuat stylesheet', 'meminta browser memakai mode standar', 'menutup dokumen', 'mendeklarasikan bahasa'], 1, 'Tanpanya browser masuk quirks mode dan kotak model bisa berbeda.'],
      ['Elemen mana paling tepat untuk satu postingan di feed?', ['<div class="post">', '<article>', '<section>', '<aside>'], 1, 'Artikel adalah konten mandiri yang masih masuk akal jika dipindah.'],
      ['Manakah formulir email yang benar?', ['<input type="text" name="email">', '<input type="email" required>', '<input mail>', '<textarea email>'], 1, 'type="email" memvalidasi format dan membuka keyboard yang tepat di ponsel.'],
      ['Tag <footer> boleh dipakai…', ['hanya sekali di akhir halaman', 'di dalam <article> juga', 'hanya jika ada <nav>', 'tidak boleh sama sekali'], 1, '<footer> bisa menutup halaman, artikel, atau section.'],
    ],
  },
  {
    module: 'js-dasar',
    title: 'Kuis Variabel dan Tipe',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Deklarasi mana yang tepat untuk nilai yang tidak akan diganti?', ['var', 'let', 'const', 'static'], 2, 'const mencegah penugasan ulang dan membuat maksud kode jelas.'],
      ['Hasil dari 0 === "" adalah…', ['true', 'false', 'TypeError', 'undefined'], 1, '=== membandingkan tipe dan nilai, jadi berbeda.'],
      ['Tipe mana yang BUKAN tipe dasar JavaScript?', ['symbol', 'bigint', 'float', 'boolean'], 2, 'JavaScript hanya punya number (floating point), tidak ada float.'],
      ['Nilai peserta[99]?.nama saat peserta hanya berisi 2 item adalah…', ['TypeError', 'undefined', 'null', '"" '], 1, 'Optional chaining berhenti dan menghasilkan undefined.'],
      ['Loop mana yang memberi nilai elemen array?', ['for...in', 'for...of', 'while (arr)', 'forEach.index'], 1, 'for...of mengiterasi nilai; for...in mengiterasi kunci.'],
      ['Manakah cara menambah 10 pada skor dengan tepat?', ['skor =+ 10', 'skor += 10', 'skor := 10', 'add skor 10'], 1, '+= menambahkan lalu menugaskan kembali.'],
    ],
  },
  {
    module: 'stack-queue',
    title: 'Kuis Struktur Data: Antrian dan Stack',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Struktur mana yang cocok untuk fitur undo?', ['Queue', 'Stack', 'Hash map', 'Heap'], 1, 'Undo mengembalikan tindakan terakhir: last in, first out.'],
      ['Operasi dequeue pada array biasa costing O(n) karena…', ['memori penuh', 'indeks seluruh elemen bergeser', 'array tidak terurut', 'butuh recursion'], 1, 'Menggeser n elemen adalah pekerjaan linear.'],
      ['Untuk urutan layanan adil (yang dulu, dilayani dulu) pakai…', ['Stack', 'Queue', 'Tree', 'Set'], 1, 'Queue menjaga first in, first out.'],
      ['Kompleksitas lookup kunci pada hash map rata-rata…', ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], 2, 'Hash map menghitung indeks dari kunci, jadi rata-rata konstan.'],
      ['Soal tanda kurung berpasangan paling alami diselesaikan dengan…', ['queue', 'stack', 'sort', 'binary search'], 1, 'Kurung terakhir yang terbuka adalah yang pertama harus ditutup.'],
      ['Penunjuk this.depan pada kelas Antrian berfungsi untuk…', ['menghemat memori string', 'menghindari pergeseran elemen saat dequeue', 'mempercepat push', 'menjaga urutan kunci hash'], 1, 'Dengan indeks depan, dequeue menjadi O(1).'],
    ],
  },
];

const AD_SLOTS = [
  { slot_key: 'top-banner', kind: 'banner', title: 'Ruang sponsor Anda', sponsor: 'Iklan', target_url: '', priority: 1 },
  { slot_key: 'sidebar', kind: 'card', title: 'Tawaran untuk pembelajar', sponsor: 'Iklan', target_url: '', priority: 2 },
  { slot_key: 'in-feed', kind: 'native', title: 'Dukungan EduVerse', sponsor: 'Disponsori', target_url: '', priority: 3 },
];

function now() {
  return new Date();
}

/** Jumat 19.00 WIB (12.00 UTC) pada minggu berjalan dan berikutnya. */
function upcomingFriday(from) {
  const date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 12, 0, 0));
  const add = (5 - date.getUTCDay() + 7) % 7;
  date.setUTCDate(date.getUTCDate() + add);
  return date;
}

async function ensureRanks(store) {
  const existing = await store.all('ranks', 'rank_key', { column: 'order_no', ascending: true }, 10);
  if (existing.length) return;
  const ranks = [
    { rank_key: 'pemula', title: 'Pemula', threshold: 0, color: '#7FA8CF', order_no: 1 },
    { rank_key: 'madya', title: 'Madya', threshold: 600, color: '#2E9E6B', order_no: 2 },
    { rank_key: 'maha', title: 'Maha', threshold: 1800, color: '#1F6FEB', order_no: 3 },
    { rank_key: 'master', title: 'Master', threshold: 4200, color: '#F0749F', order_no: 4 },
  ];
  for (const [index, rank] of ranks.entries()) {
    await store.insertAbsent('ranks', { id: uuid(900 + index), ...rank, created_at: new Date().toISOString() }, 'rank_key');
  }
}

async function ensureCatalog(store) {
  const courses = await store.all('courses', 'id,slug', { column: 'order_no', ascending: true }, 20);
  if (courses.length) return;
  const createdAt = new Date().toISOString();
  let counter = 1000;
  for (const course of COURSES) {
    await store.insertAbsent('courses', { ...course, published: true, created_at: createdAt }, 'slug');
  }
  for (const [courseSlug, moduleSlug, title, minutes, offline] of MODULES) {
    const course = COURSES.find((c) => c.slug === courseSlug);
    const siblings = MODULES.filter((m) => m[0] === courseSlug);
    await store.insertAbsent(
      'modules',
      {
        id: uuid(counter += 1),
        course_id: course.id,
        slug: moduleSlug,
        title,
        summary: `${title} — bagian dari ${course.title}.`,
        order_no: siblings.findIndex((m) => m[1] === moduleSlug) + 1,
        minutes,
        offline_ok: Boolean(offline),
        published: true,
        created_at: createdAt,
      },
      'slug'
    );
  }
  const moduleIds = new Map();
  const moduleRows = await store.all('modules', 'id,slug', { column: 'order_no', ascending: true }, 40);
  for (const row of moduleRows) moduleIds.set(row.slug, row.id);

  for (const [moduleSlug, lessonTitle, blocks, minutes] of LESSONS) {
    counter += 1;
    const order = LESSONS.filter((l) => l[0] === moduleSlug).findIndex((l) => l[1] === lessonTitle) + 1;
    await store.insertAbsent(
      'lessons',
      {
        id: uuid(counter),
        module_id: moduleIds.get(moduleSlug),
        title: lessonTitle,
        body: { blocks: blocks.map((b) => ({ type: b.t, text: b.x, lang: b.lang, items: b.items })) },
        order_no: order,
        minutes,
        created_at: createdAt,
      },
      'id'
    );
  }

  for (const bank of BANKS) {
    counter += 1;
    const bankId = uuid(counter);
    await store.insertAbsent(
      'banks',
      {
        id: bankId,
        module_id: moduleIds.get(bank.module),
        title: bank.title,
        time_limit_seconds: bank.time_limit_seconds,
        pass_score: bank.pass_score,
        published: true,
        created_at: createdAt,
      },
      'id'
    );
    for (const [index, [prompt, options, answer, explanation]] of bank.questions.entries()) {
      counter += 1;
      await store.insertAbsent(
        'questions',
        {
          id: uuid(counter),
          bank_id: bankId,
          prompt,
          options,
          answer,
          explanation,
          order_no: index + 1,
          created_at: createdAt,
        },
        'id'
      );
    }
  }
}

async function ensureTournaments(store) {
  const existing = await store.all('tournaments', 'key', { column: 'key', ascending: true }, 5);
  if (existing.length) return;
  const banks = await store.all('banks', 'id', { column: 'created_at', ascending: true }, 10);
  if (!banks.length) return;
  const base = now();
  for (const offset of [0, 7]) {
    const starts = upcomingFriday(new Date(base.getTime() + offset * 86400000));
    const ends = new Date(starts.getTime() + 24 * 3600000);
    const key = starts.toISOString().slice(0, 10);
    await store.insertAbsent(
      'tournaments',
      {
        id: uuid(2000 + offset),
        key,
        title: `Uji Kompetensi #${starts.getUTCFullYear()}-${key}`,
        starts_at: starts.toISOString(),
        ends_at: ends.toISOString(),
        duration_seconds: 900,
        question_count: 8,
        bank_ids: banks.map((b) => b.id),
        seed: `ev-${key}`,
        status: 'scheduled',
        created_at: base.toISOString(),
      },
      'key'
    );
  }
}

async function ensureAdSlots(store) {
  const existing = await store.all('ad_slots', 'slot_key', { column: 'priority', ascending: true }, 10);
  if (existing.length) return;
  for (const [index, slot] of AD_SLOTS.entries()) {
    await store.insertAbsent('ad_slots', { id: uuid(3000 + index), ...slot, enabled: true, image_path: '', starts_at: null, ends_at: null, created_at: new Date().toISOString() }, 'slot_key');
  }
}

/** Dipanggil sebelum permintaan baca katalog; setiap ensure memeriksa kehadiran baris lebih dulu. */
export async function bootstrap(store) {
  await ensureRanks(store);
  await ensureCatalog(store);
  await ensureTournaments(store);
  await ensureAdSlots(store);
}
