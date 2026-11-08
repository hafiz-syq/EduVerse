// Penjaga sinkron rute. Jebakan yang ditutup: netlify.toml memetakan rute satu per satu,
// jadi rute baru (mis. /dashboard) menghasilkan 404 di produksi kalau konfigurasinya
// tidak ikut diubah. Verifikasi rewrittenya lewat curl baru bisa setelah deploy, jadi
// perbandingan sumber kebenaran ini yang berjalan di npm run test:function.
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const ROOT = join(import.meta.dirname, '..');
const baca = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const app = baca('src/App.tsx');
const vercel = JSON.parse(baca('vercel.json'));
const shell = baca('components/app-shell.tsx');
const sw = baca('public/sw.js');
const api = baca('lib/api.ts');
const toml = baca('netlify.toml');
const landing = baca('src/pages/landing.tsx');
const oauth = baca('functions/src/oauth.mjs');
const lessonBody = baca('components/lesson-body.tsx');

const polaRute = [...app.matchAll(/pattern:\s*"([^"]+)"/g)].map((m) => m[1]);
const sumberRewrite = vercel.rewrites.map((r) => r.source);
const ruteNav = [...shell.matchAll(/to:\s*"([^"]+)"/g)].map((m) => m[1]);
const redirectNetlify = [...toml.matchAll(/from\s*=\s*"([^"]+)"/g)].map((m) => m[1]);

/** `/modul/:slug` dipetakan Netlify sebagai `/modul/*`; rute polos ditulis apa adanya. */
const jadiGlob = (pola) => (pola.includes(':') ? `${pola.slice(0, pola.lastIndexOf('/'))}/*` : pola);

test('setiap rute aplikasi punya rewrite di vercel.json', () => {
  assert.ok(polaRute.length >= 12, `RUTE terbaca ${polaRute.length} entri`);
  const hilang = polaRute.filter((p) => p !== '/' && !sumberRewrite.includes(p));
  assert.deepEqual(hilang, [], `rute tanpa rewrite: ${hilang.join(', ')}`);
});

test('seluruh /api dikirim ke satu Function dan tidak ditelan rewrite SPA', () => {
  // Direktori api/ di proyek non-Next tidak punya tangkap-semua yang terdokumentasi, jadi
  // kontrak rute ada di sini: satu berkas Function + satu rewrite di depan semuanya.
  const api = vercel.rewrites.filter((r) => r.source === '/api/(.*)');
  assert.equal(api.length, 1, 'tepat satu rewrite yang mengirim /api ke Function');
  assert.equal(sumberRewrite[0], '/api/(.*)', 'rewrite Function harus entri pertama');
  assert.equal(api[0].destination, '/api');
  const berkas = join(ROOT, 'api', 'index.mjs');
  assert.ok(existsSync(berkas), 'api/index.mjs harus ada; rute Function mengikuti nama berkas');
  const menelanApi = sumberRewrite.filter((s) => s === '/(.*)');
  assert.deepEqual(menelanApi, [], 'catch-all SPA akan menutup /api');
  const asing = sumberRewrite.filter((s) => s !== '/api/(.*)' && !polaRute.includes(s));
  assert.deepEqual(asing, [], `rewrite yang tidak dikenal src/App.tsx: ${asing.join(', ')}`);
});

test('navigasi shell menunjuk rute yang benar-benar ada', () => {
  const hilang = ruteNav.filter((to) => !polaRute.includes(to) && !to.includes(':'));
  assert.deepEqual(hilang, [], `tautan nav mati: ${hilang.join(', ')}`);
});

test('service worker tidak pernah melayan dari cache untuk bentuk rute Function baru', () => {
  assert.match(api, /export const API_BASE = "\/api"/, 'frontend memanggil /api');
  assert.match(sw, /url\.pathname === "\/api" \|\| url\.pathname\.startsWith\("\/api\/"\)/, 'sw melewati /api');
  assert.doesNotMatch(sw, /functions\//, 'sw tidak lagi menyebut prefiks lama');
  for (const sumber of [...sw.matchAll(/CEPAT_SAJA = \[([^\]]+)\]/g)][0][1].split(',').map((s) => s.trim().replace(/"/g, ''))) {
    if (sumber.endsWith('.html') || sumber.endsWith('.webmanifest') || sumber.endsWith('.svg') || sumber.endsWith('.png')) {
      assert.ok(existsSync(join(ROOT, 'public', sumber)), `aset precache hilang: ${sumber}`);
    }
  }
});

test('konfigurasi Vercel menjaga region, keluaran, dan header setara netlify.toml', () => {
  assert.deepEqual(vercel.regions, ['sin1'], 'Function harus serumah dengan endpoint Neon ap-southeast-1');
  assert.equal(vercel.outputDirectory, 'dist');
  assert.equal(vercel.buildCommand, 'npm run build');
  const header = (source) => vercel.headers.find((h) => h.source === source)?.headers ?? [];
  assert.equal(header('/assets/(.*)').find((h) => h.key === 'Cache-Control')?.value, 'public, max-age=31536000, immutable');
  assert.equal(header('/sw.js').find((h) => h.key === 'Cache-Control')?.value, 'public, max-age=0, must-revalidate');
  const global = header('/(.*)');
  assert.equal(global.find((h) => h.key === 'X-Content-Type-Options')?.value, 'nosniff');
  assert.equal(global.find((h) => h.key === 'Referrer-Policy')?.value, 'strict-origin-when-cross-origin');
});

// Jebakan yang dinamai di rencana: netlify.toml tidak punya /* -> /index.html, jadi tiap
// rute baru wajib ditulis sendiri atau tautan dalam peramban jatuh ke 404 di produksi.
test('netlify.toml ikut memetakan rute baru satu per satu', () => {
  const dibutuhkan = polaRute.filter((p) => p !== '/').map(jadiGlob);
  const hilang = dibutuhkan.filter((p) => !redirectNetlify.includes(p));
  assert.deepEqual(hilang, [], `redirect Netlify hilang untuk: ${hilang.join(', ')}`);
  assert.ok(redirectNetlify.includes('/dashboard'), '/dashboard harus ada sebelum Vercel hidup');
});

// Kebijakan baru: materi hanya untuk akun. Yang dijaga di sini dua hal — landing tidak
// memanggil satu pun rute yang kini 401 untuk anonim, dan penjaga frontend benar-benar
// mengantar pengunjung tanpa sesi ke /masuk sebelum merender isi.
test('`/` adalah landing publik tanpa data terkunci, sisanya dijaga ke /masuk', () => {
  assert.ok(polaRute.includes('/dashboard'), 'rute dasbor terdaftar di src/App.tsx');
  assert.match(landing, /navigate\("\/dashboard", \{ replace: true \}\)/, 'sesi aktif digeser ke dasbor');

  for (const ruteTerkunci of ['"/catalog"', '"/home"', '"/arena/weekly"', '"/profile"', 'apiGet', 'useData(']) {
    assert.ok(!landing.includes(ruteTerkunci), `landing memanggil ${ruteTerkunci} yang butuh login`);
  }
  assert.match(landing, /onClick=\{\(\) => navigate\("\/masuk"\)\}/, 'CTA landing menuju halaman masuk');
  assert.doesNotMatch(landing, /Materi terbuka tanpa akun/, 'halaman tidak boleh lagi menjanjikan materi bebas akun');

  assert.equal(shell.includes('export const PUBLIK = ["/", "/masuk", "/kebijakan-privasi"]'), true, 'daftar rute publik ada di shell');
  assert.match(app, /rutePublik\(pathname\)/, 'penjaga memakai daftar rute publik dari shell');
  assert.match(app, /if \(!publik && !user\) return <TulangRangka \/>/, 'isi terkunci tidak dirender tanpa sesi');
  assert.match(app, /\/masuk\?dari=\$\{encodeURIComponent\(pathname\)\}/, 'pengunjung diantar dengan alamat asal');
  assert.match(shell, /if \(!user && \(rutePublik\(pathname\) \|\| ready\)\) return <KulitPublik>/, 'anonim memakai kulit navbar atas');
  assert.match(shell, /<aside className="sticky top-0 hidden h-dvh/, 'kulit setelah login (sidebar) tetap utuh');

  assert.match(oauth, /redirect\('\/dashboard'/, 'callback OAuth mendarat di dasbor');
  assert.ok(ruteNav.includes('/dashboard'), 'nav shell menunjuk dasbor');
});

// Jebakan yang baru ditutup: dev/local-backend.mjs hanya meneruskan Client ID, bukan
// Secret-nya. Akibatnya /api/health melaporkan penyedia mati dan login OAuth tidak bisa
// dicoba secara lokal walaupun .env sudah terisi penuh — keysimbolan itu dikunci di sini.
test('harness dev dan titik masuk Vercel meneruskan ID dan Secret tiap penyedia', () => {
  const sumber = { 'dev/local-backend.mjs': baca('dev/local-backend.mjs'), 'api/index.mjs': baca('api/index.mjs') };
  for (const [nama, isi] of Object.entries(sumber)) {
    for (const kunci of ['APP_GOOGLE_CLIENT_ID', 'APP_GOOGLE_CLIENT_SECRET', 'APP_GITHUB_CLIENT_ID', 'APP_GITHUB_CLIENT_SECRET', 'APP_PUBLIC_URL']) {
      assert.ok(isi.includes(kunci), `${nama} tidak meneruskan ${kunci}`);
    }
  }
  assert.match(baca('package.json'), /--env-file-if-exists=\.env/, 'npm run dev:api harus memuat berkas env');
});

// Persiapan monetisasi. Yang dijaga empat hal yang pernah salah sendiri: halaman kebijakan
// privasi harus benar-benar terbuka tanpa akun dan tidak mengklaim fitur yang belum ada di
// kode, berkas perayap tidak boleh mendaftarkan rute terkunci atau mencampur dua domain, dan
// kalimat iklan di landing tidak boleh lagi menjadi janji permanen.
test('kebijakan privasi publik, berkas perayap, dan kalimat iklan yang tetap benar nanti', () => {
  const privasi = baca('src/pages/privacy.tsx');
  const consent = baca('components/consent-bar.tsx');
  const robots = baca('public/robots.txt');
  const sitemap = baca('public/sitemap.xml');

  assert.ok(polaRute.includes('/kebijakan-privasi'), 'rute kebijakan privasi terdaftar di src/App.tsx');
  assert.ok(sumberRewrite.includes('/kebijakan-privasi'), 'vercel.json harus me-rewrite /kebijakan-privasi');
  assert.ok(redirectNetlify.includes('/kebijakan-privasi'), 'netlify.toml harus memetakan /kebijakan-privasi');
  assert.match(shell, /to="\/kebijakan-privasi"/, 'kulit shell menautkan kebijakan privasi');
  assert.match(consent, /to="\/kebijakan-privasi"/, 'banner persetujuan mengarah ke kebijakan privasi');

  // Satu panggilan yang menuntut sesi akan membuat halaman ini tampak rusak bagi perayap,
  // jadi halaman privasi ditulis tanpa data sama sekali.
  for (const terlarang of ['apiGet', 'useData(', 'useApp(']) {
    assert.ok(!privasi.includes(terlarang), `halaman privasi memakai ${terlarang} yang bisa menuntut sesi`);
  }
  assert.doesNotMatch(privasi, /tautan yang dikirim ke email/, 'portal belum punya login lewat email');
  // Butir yang diminta Google untuk situs yang kelak memakai iklan pihak ketiga.
  for (const wajib of ['vendor pihak ketiga', 'Setelan iklan Google', 'aboutads.info']) {
    assert.ok(privasi.includes(wajib), `kebijakan privasi tidak memuat "${wajib}"`);
  }

  const lokasi = [...sitemap.matchAll(/<loc>(https?:\/\/[^/<]+)([^<]*)<\/loc>/g)];
  assert.equal(lokasi.length, 3, `entri sitemap terbaca ${lokasi.length}, harus tiga rute publik`);
  const asalSitemap = [...new Set(lokasi.map((m) => m[1]))];
  assert.equal(asalSitemap.length, 1, 'sitemap tidak boleh mencampur dua domain');
  const asalRobots = (robots.match(/^Sitemap:\s*(https?:\/\/[^/<]+)\//m) ?? [])[1] ?? '(baris Sitemap tidak ada)';
  assert.equal(asalRobots, asalSitemap[0], 'baris Sitemap di robots.txt harus domain yang sama dengan sitemap.xml');
  assert.match(robots, /^User-agent: \*$/m, 'robots tidak boleh membatasi robot iklan');
  assert.match(robots, /^Allow: \/$/m);
  const rutePublikTerdaftar = lokasi.map((m) => m[2]);
  assert.deepEqual(rutePublikTerdaftar, ['/', '/masuk', '/kebijakan-privasi'], 'isi sitemap harus persis rute publik');
  for (const ruteTerkunci of ['/materi', '/modul', '/kuis', '/koding', '/diskusi', '/arena', '/profil', '/dashboard', '/admin']) {
    assert.ok(!sitemap.includes(`${asalSitemap[0]}${ruteTerkunci}<`), `sitemap mendaftarkan rute terkunci ${ruteTerkunci}`);
  }

  assert.doesNotMatch(landing, /Tidak ada langganan,\s*tidak ada jaringan iklan pihak ketiga/, 'landing tidak menjanjikan ketiadaan jaringan iklan selamanya');
  assert.doesNotMatch(landing, /Gratis, iklannya kami kelola sendiri/, 'badge tidak mengunci skema pendanaan yang bisa berubah');
  assert.match(landing, /belum memakai jaringan iklan pihak ketiga/, 'status iklan sekarang harus disebut apa adanya');
  assert.match(landing, /Kalau nanti kami menambahkan jaringan iklan pihak ketiga/, 'perubahan harus diumumkan lebih dulu');
});

// Materi peta jalan isinya tautan ke roadmap.sh. Tanpa auto-link, alamat panjang hanya
// jadi teks yang tidak bisa diklik; tanpa batas skema, teks materi bisa berubah menjadi
// tautan javascript: yang bisa diklik. Keduanya dikunci di sini.
test('blok materi menautkan https dan menolak skema lain', () => {
  assert.match(lessonBody, /matchAll\(\/https:\\\/\\\/\[/, 'hanya https yang dikenali sebagai alamat');
  assert.doesNotMatch(lessonBody, /matchAll\(\/\[a-z\]\+:/, 'skema bebas tidak boleh ditautkan');
  assert.match(lessonBody, /rel="noopener noreferrer"/, 'tautan luar tidak boleh membuka jendela tanpa rel');
  assert.match(lessonBody, /target="_blank"/);
  // Kelas karakter dibaca dari sumber supaya kegagalan menyebut isinya, bukan tebakan.
  const kelas = (lessonBody.match(/matchAll\(\/https:\\\/\\\/\[(.*?)\]\+/) ?? [])[1] ?? '(tidak ketemu)';
  assert.ok(kelas.startsWith('^'), `kelas harus negatif (mengabaikan), terbaca: ${kelas}`);
  for (const haru of ['\\s', ')', ']', '<', '>', '"', "'"]) {
    assert.ok(kelas.includes(haru), `kelas karakter harus mengecualikan ${haru}, terbaca: ${kelas}`);
  }
  const cabangTeks = [...lessonBody.matchAll(/tautanDalamTeks\(/g)].length;
  assert.equal(cabangTeks, 4, `satu definisi + tiga cabang teks (paragraf, tip, butir list), terbaca ${cabangTeks}`);
});


// API_BASE klien adalah '/api', tapi Function Netlify dulu hanya memasang prefiks warisan
// '/functions/v1/app/*'. Git CD Netlify membangun dari main, jadi tiap push membuat salinan
// Netlify melayani frontend yang memanggil /api/* sementara tidak ada satu pun rute di sana:
// seluruh login, katalog, dan penilaian mati tanpa satu pun galat yang terlihat di build.
test('setiap host melayani prefiks API yang sama dengan yang dipakai klien', () => {
  const base = (baca('lib/api.ts').match(/API_BASE = "([^"]+)"/) ?? [, '(API_BASE tidak ketemu)'])[1];
  assert.ok(base.startsWith('/') && !base.endsWith('/'), `API_BASE harus path relatif tanpa garis miring akhir, terbaca: ${base}`);

  // Router inti yang mengenali prefiks ini, bukan aplikasi: kalau baris ini hilang, semua
  // rewrite di dunia tetap menghasilkan 404.
  const core = baca('functions/src/core.mjs');
  assert.ok(core.includes(`'${base}'`), `router inti tidak mengenali prefiks ${base} (functions/src/core.mjs)`);

  const sumberVercel = JSON.parse(baca('vercel.json'));
  const keFunction = sumberVercel.rewrites.filter((r) => r.destination === base);
  assert.equal(keFunction.length, 1, `harus tepat satu rewrite yang mengirim ${base} ke Function, terbaca ${keFunction.length}`);

  const fnNetlify = baca('netlify/functions/api.mjs');
  const blokPath = (fnNetlify.match(/path:\s*(\[[^\]]*\]|'[^']*')/) ?? [, '(config.path tidak ketemu)'])[1];
  const daftarPath = [...blokPath.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const fromToml = [...toml.matchAll(/^from\s*=\s*"([^"]+)"$/gm)].map((m) => m[1]);
  const lewatConfig = daftarPath.some((p) => p === `${base}/*`);
  const lewatRedirect = fromToml.includes(base) || fromToml.includes(`${base}/*`);
  assert.ok(
    lewatConfig || lewatRedirect,
    `Netlify tidak melayani ${base}/* — config.path=${JSON.stringify(daftarPath)}, redirect=${JSON.stringify(fromToml.slice(0, 3))}`,
  );

  // Prefiks lama harus tetap terpasang: sesi yang sudah terbit di Netlify menunjuk ke sana,
  // dan menghapusnya memutuskan pengguna yang sedang aktif.
  assert.ok(daftarPath.includes('/functions/v1/app/*'), `prefiks warisan hilang dari config.path: ${JSON.stringify(daftarPath)}`);

  // Urutan: tidak boleh ada catch-all SPA yang bisa menelan ${base} sebelum aturan Function.
  assert.deepEqual(fromToml.filter((f) => f === '/*'), [], `redirect /* akan menutup ${base}`);
});

test('pembagian host prefiks warisan tertulis, bukan diandaikan', () => {
  // Penjaga nama ini ada karena test titik masuk sempat dibaca seolah DUA host melayani
  // '/functions/v1/app/*'. Faktanya tidak: Vercel mengambil rute dari nama berkas
  // (api/index.mjs -> "/api") dan tidak punya rewrite untuk prefiks itu, jadi di
  // eduverselearn.vercel.app path tersebut 404 halaman NOT_FOUND platform (terukur
  // 2026-11-09: 404 79 B), sementara Netlify memasangnya lewat config.path dan hanya
  // bisa dibuktikan dari dalam karena Team protection Netlify membalas 401 untuk semua path.
  const sumberVercel = JSON.parse(baca('vercel.json'));
  const sentuhanLama = [
    ...sumberVercel.rewrites,
    ...(sumberVercel.redirects ?? []),
  ].filter((r) => (r.source ?? r.from ?? '').includes('/functions/v1'));
  assert.deepEqual(sentuhanLama, [], 'vercel.json tidak boleh pura-pura melayani prefiks warisan');

  // Diambil dari blok config.path saja, bukan dari seluruh berkas: prefiks itu juga tertulis
  // di komentar penjaga api.mjs, dan pencocokan seluruh berkas menghitungnya dua kali.
  const blokLama = (baca('netlify/functions/api.mjs').match(/path:\s*(\[[^\]]*\]|'[^']*')/) ?? [, '(config.path tidak ketemu)'])[1];
  const pathNetlify = [...blokLama.matchAll(/['"](\/functions\/v1\/app\/\*)['"]/g)].map((m) => m[1]);
  assert.deepEqual(pathNetlify, ['/functions/v1/app/*'], 'prefiks warisan hanya boleh dipasang di titik masuk Netlify');
});

test('setiap nama env yang ditulis di dokumen benar-benar dibaca salah satu titik masuk', () => {
  // Penyakit yang sama muncul dua kali: dokumen menyebut nama variabel yang tidak ada di
  // kode mana pun. APP_ALLOWED_ORIGINS dikira menyetir penjaga origin, padahal yang
  // bekerja adalah sameOrigin(request) di functions/src/core.mjs — tanpa env apa pun.
  // Nama env karangan adalah instruksi palsu untuk operator (dia akan menambah variabel
  // yang tidak dibaca aplikasi), jadi tulisan di docs wajib terbukti di sumber titik masuk.
  const sumber = [baca('api/index.mjs'), baca('netlify/functions/api.mjs')].join('\n');
  const dokumen = readdirSync(join(ROOT, 'docs'), { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md'))
    .map((e) => [`docs/${e.name}`, baca(`docs/${e.name}`)]);
  assert.ok(dokumen.length >= 1, 'tidak ada dokumen untuk dijaga');
  for (const [nama, teks] of dokumen) {
    const token = [...new Set([...teks.matchAll(/\bAPP_[A-Z][A-Z0-9_]*\b/g)].map((m) => m[0]))].sort();
    const palsu = token.filter((t) => !sumber.includes(t));
    assert.deepEqual(
      palsu,
      [],
      `${nama} menyebut ${palsu.length} env yang tidak dibaca api/index.mjs maupun netlify/functions/api.mjs: ${JSON.stringify(palsu)} (tercocok ${token.length} token: ${token.join(', ')})`,
    );
  }
});

test('setiap kind yang dikirim ke xp.award punya kunci di tabel XP', () => {
  // award(user, kind, ref, amount = XP[kind] ?? 0) — kind di luar tabel berarti dua hal:
  // jumlah harus dituliskan telanjang di pemanggil, dan kalau argumen jumlah terlupa
  // hadiahnya diam-diam jadi 0 tanpa galat. Penjaga ini yang membuat keduanya tidak bisa
  // lolos dari repo.
  const berkas = readdirSync(join(ROOT, 'functions', 'src'), { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.mjs'))
    .map((e) => `functions/src/${e.name}`);
  const kinds = new Map();
  const catat = (k, dari) => { if (!kinds.has(k)) kinds.set(k, dari); };
  for (const rel of berkas) {
    const isi = baca(rel);
    // Bentuk 1: literal langsung di posisi argumen kedua, termasuk award() internal modul.
    for (const m of isi.matchAll(/(?:xp\.)?award\(\s*[^,)]+,\s*'([a-z0-9_]+)'/g)) catat(m[1], rel);
    // Bentuk 2: variabel (quiz.mjs memilih kind lewat ternary). Literal pembentuk variabel
    // itu ikut diperiksa, kalau tidak kind kuis lolos tanpa pernah menyentuh tabel.
    for (const m of isi.matchAll(/(?:xp\.)?award\(\s*[^,)]+,\s*(\w+)\s*[,)]/g)) {
      const penegas = new RegExp(`const ${m[1]} = ([^\\n]+)`, 'g');
      for (const t of isi.matchAll(penegas)) {
        // Bandingkan dulu: `status === 'pass'` adalah operand, bukan kandidat kind.
        const ekspresi = t[1].replace(/[!=]==?\s*'[^']*'/g, '');
        const literal = [...ekspresi.matchAll(/'([a-z0-9_]+)'/g)].map((l) => l[1]);
        assert.ok(literal.length, `kind variabel ${m[1]} di ${rel} tidak punya literal pembentuk yang terbaca — penjaga buta bentuk ini`);
        for (const k of literal) catat(k, `${rel} (via ${m[1]})`);
      }
    }
  }
  const blok = (baca('functions/src/xp.mjs').match(/export const XP = \{([\s\S]*?)\n\};/) ?? [, ''])[1];
  const kunci = [...blok.matchAll(/^\s*([a-z0-9_]+):/gm)].map((m) => m[1]);

  assert.ok(kinds.size >= 12, `kind terbaca cuma ${kinds.size} — regex-nya mungkin sudah tidak cocok`);
  assert.ok(kunci.length >= kinds.size, `kunci XP ${kunci.length} lebih sedikit dari kind ${kinds.size}`);
  const hilang = [...kinds.keys()].filter((k) => !kunci.includes(k));
  assert.deepEqual(hilang, [], `kind tanpa kunci di XP: ${hilang.map((k) => `${k} (${kinds.get(k)})`).join(', ')}`);
});
