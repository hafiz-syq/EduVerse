// Bootstrap konten pertama EduVerse. Idempoten lewat insertIfAbsent dengan UUID tetap,
// dijalankan malas (saat katalog pertama dibaca), bukan sebagai DML migrasi.

const uuid = (n) => `0f5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;

const COURSES = [
  // ============ TRACK 1: FONDASI ============
  {
    id: uuid(1),
    slug: 'logika-algoritma',
    title: 'Logika Pemrograman dan Algoritma',
    summary: 'Pemikiran komputasi dari nol: alur, percabangan, perulangan, dan pseudocode. Tidak perlu pengalaman kode sebelumnya.',
    level: 'pemula',
    order_no: 1,
  },
  {
    id: uuid(2),
    slug: 'struktur-data',
    title: 'Struktur Data & Algoritma Praktis',
    summary: 'Bentuk data yang dipakai aplikasi nyata, dan cara memilih yang tepat saat wawancara kerja.',
    level: 'madya',
    order_no: 2,
  },
  {
    id: uuid(3),
    slug: 'oop-dasar',
    title: 'Pemrograman Berorientasi Objek (OOP)',
    summary: 'Kelas, objek, pewarisan, enkapsulasi, dan polimorfisme dengan contoh dalam bahasa Indonesia.',
    level: 'madya',
    order_no: 3,
  },
  {
    id: uuid(4),
    slug: 'vcs-dasar',
    title: 'Version Control System (VCS)',
    summary: 'Melacak perubahan kode, mengembalikan versi lama, dan bekerja bersama tanpa salim menimpa.',
    level: 'pemula',
    order_no: 4,
  },
  {
    id: uuid(5),
    slug: 'git-github',
    title: 'Git dan GitHub Praktis',
    summary: 'Commit, branch, merge, pull request, dan kolaborasi tim lewat GitHub. Dari nol sampai pertama kali push.',
    level: 'pemula',
    order_no: 5,
  },
  // ============ TRACK 2: WEB DEVELOPMENT ============
  {
    id: uuid(6),
    slug: 'web-dasar',
    title: 'Dasar Web: HTML, CSS, dan Tampilan',
    summary: 'Membangun halaman pertama sampai tampil rapi di ponsel. Cocok untuk yang belum pernah menyentuh kode.',
    level: 'pemula',
    order_no: 6,
  },
  {
    id: uuid(7),
    slug: 'typescript-dasar',
    title: 'TypeScript untuk Pemula',
    summary: 'JavaScript dengan tipe data statis. Tangkap error sebelum runtime dan buat kode lebih mudah dirawat.',
    level: 'madya',
    order_no: 7,
  },
  {
    id: uuid(8),
    slug: 'reactjs-dasar',
    title: 'ReactJs',
    summary: 'Membangun antarmuka pengguna dengan komponen yang dapat digunakan ulang. Props, state, dan lifecycle.',
    level: 'madya',
    order_no: 8,
  },
  {
    id: uuid(9),
    slug: 'nextjs-dasar',
    title: 'NextJs',
    summary: 'Framework React untuk produksi: server-side rendering, routing, dan API route.',
    level: 'maha',
    order_no: 9,
  },
  {
    id: uuid(10),
    slug: 'nodejs-dasar',
    title: 'NodeJs',
    summary: 'JavaScript di sisi server. Membangun REST API, menangani request, dan berinteraksi dengan database.',
    level: 'madya',
    order_no: 10,
  },
  {
    id: uuid(11),
    slug: 'php-dasar',
    title: 'PHP',
    summary: 'Bahasa skrip sisi server untuk web. Variabel, fungsi, form, dan koneksi database.',
    level: 'pemula',
    order_no: 11,
  },
  {
    id: uuid(12),
    slug: 'laravel-dasar',
    title: 'Laravel',
    summary: 'Framework PHP modern. Eloquent ORM, Blade templating, routing, dan migrasi database.',
    level: 'maha',
    order_no: 12,
  },
  {
    id: uuid(13),
    slug: 'codeigniter-dasar',
    title: 'CodeIgniter',
    summary: 'Framework PHP ringan untuk pemula. MVC, database query, dan pembuatan aplikasi web cepat.',
    level: 'madya',
    order_no: 13,
  },
  // ============ TRACK 3: MOBILE DEVELOPMENT ============
  {
    id: uuid(14),
    slug: 'android-dasar',
    title: 'Pengembangan Aplikasi Android (Kotlin/Java)',
    summary: 'Buat aplikasi Android native dengan Kotlin dan Java. Layout, activity, dan publish ke Play Store.',
    level: 'madya',
    order_no: 14,
  },
  {
    id: uuid(15),
    slug: 'ios-dasar',
    title: 'Pengembangan Aplikasi iOS (Swift)',
    summary: 'Buat aplikasi iPhone dan iPad dengan Swift. Xcode, SwiftUI, dan App Store.',
    level: 'madya',
    order_no: 15,
  },
  {
    id: uuid(16),
    slug: 'flutter-dasar',
    title: 'Flutter',
    summary: 'Cross-platform mobile dengan Dart. Satu kodebase untuk Android dan iOS.',
    level: 'madya',
    order_no: 16,
  },
  {
    id: uuid(17),
    slug: 'react-native-dasar',
    title: 'React Native',
    summary: 'Buat aplikasi mobile native dengan React dan JavaScript. Expo dan navigasi antar layar.',
    level: 'madya',
    order_no: 17,
  },
  // ============ TRACK 4: SOFTWARE ENGINEERING DAN QA ============
  {
    id: uuid(18),
    slug: 'pengembangan-perangkat-lunak',
    title: 'Pengembangan Perangkat Lunak (Software Development)',
    summary: 'Siklus hidup pembuatan software dari perencanaan sampai peluncuran. Analisis kebutuhan dan desain.',
    level: 'madya',
    order_no: 18,
  },
  {
    id: uuid(19),
    slug: 'rekayasa-perangkat-lunak',
    title: 'Rekayasa Perangkat Lunak (SDLC, Agile, Scrum)',
    summary: 'Metodologi pengembangan: SDLC, manajemen proyek IT, Agile, dan Scrum.',
    level: 'madya',
    order_no: 19,
  },
  {
    id: uuid(20),
    slug: 'qa-testing',
    title: 'Software Quality Assurance (QA) dan Testing',
    summary: 'Uji perangkat lunak: unit test, integrasi, sistem, dan user acceptance testing.',
    level: 'madya',
    order_no: 20,
  },
  // ============ TRACK 5: DATABASE, DATA SCIENCE, DAN AI ============
  {
    id: uuid(21),
    slug: 'basis-data-sql',
    title: 'Sistem Basis Data (SQL: MySQL dan PostgreSQL)',
    summary: 'Database relasional: tabel, query, JOIN, indeks, dan transaksi di MySQL dan PostgreSQL.',
    level: 'madya',
    order_no: 21,
  },
  {
    id: uuid(22),
    slug: 'nosql-mongodb',
    title: 'NoSQL dengan MongoDB',
    summary: 'Database dokumen yang fleksibel. Collection, document, query, dan agregasi data.',
    level: 'madya',
    order_no: 22,
  },
  {
    id: uuid(23),
    slug: 'data-science',
    title: 'Data Science dan Analisis Data (Python, R, SQL)',
    summary: 'Olah data dengan Python, R, dan SQL. Statistik deskriptif, visualisasi, dan insight bisnis.',
    level: 'maha',
    order_no: 23,
  },
  {
    id: uuid(24),
    slug: 'ai-machine-learning',
    title: 'Kecerdasan Buatan (AI) dan Machine Learning',
    summary: 'Dasar AI dan ML: algoritma pembelajaran, model prediksi, dan implementasi praktis.',
    level: 'maha',
    order_no: 24,
  },
  // ============ TRACK 6: JARINGAN, INFRASTRUKTUR, DAN KEAMANAN SIBER ============
  {
    id: uuid(25),
    slug: 'jaringan-komputer',
    title: 'Jaringan Komputer (IP Address, Subnetting, TCP/IP, Routing, Switching)',
    summary: 'Dasar jaringan: alamat IP, subnetting, model TCP/IP, routing, dan switching.',
    level: 'madya',
    order_no: 25,
  },
  {
    id: uuid(26),
    slug: 'sistem-operasi',
    title: 'Sistem Operasi (Linux Ubuntu/CentOS, Windows, macOS)',
    summary: 'Dasar sistem operasi: manajemen file, proses, pengguna, dan baris perintah di Linux, Windows, dan macOS.',
    level: 'pemula',
    order_no: 26,
  },
  {
    id: uuid(27),
    slug: 'cloud-computing',
    title: 'Cloud Computing (AWS, GCP, Azure)',
    summary: 'Komputasi awan: infrastruktur sebagai layanan, platform sebagai layanan, dan perangkat lunak sebagai layanan.',
    level: 'maha',
    order_no: 27,
  },
  {
    id: uuid(28),
    slug: 'cyber-security',
    title: 'Cyber Security (Kriptografi, Ethical Hacking, Pertahanan Jaringan)',
    summary: 'Keamanan siber: enkripsi, uji penetrasi, pertahanan jaringan, dan pencegahan malware.',
    level: 'maha',
    order_no: 28,
  },
];

const MODULES = [
  // ============ TRACK 1: FONDASI ============
  ['logika-algoritma', 'pemikiran-komputasi', 'Pemikiran Komputasi', 4, 2],
  ['logika-algoritma', 'alur-dan-pseudocode', 'Alur dan Pseudocode', 4, 2],
  ['logika-algoritma', 'percabangan-dan-perulangan', 'Percabangan dan Perulangan', 4, 2],
  ['logika-algoritma', 'fungsi-dan-rekursi', 'Fungsi dan Rekursi', 4, 2],
  ['logika-algoritma', 'kompleksitas-waktu', 'Kompleksitas Waktu dan Ruang', 4, 2],
  ['struktur-data', 'array-dan-list', 'Array dan List', 3, 2],
  ['struktur-data', 'stack-dan-queue', 'Stack dan Queue', 3, 2],
  ['struktur-data', 'linked-list', 'Linked List', 3, 2],
  ['struktur-data', 'hash-map', 'Hash Map dan Set', 3, 2],
  ['struktur-data', 'pemilihan-struktur', 'Memilih Struktur Data yang Tepat', 3, 2],
  ['oop-dasar', 'kelas-dan-objek', 'Kelas dan Objek', 4, 2],
  ['oop-dasar', 'enkapsulasi', 'Enkapsulasi', 3, 2],
  ['oop-dasar', 'pewarisan', 'Pewarisan', 3, 2],
  ['oop-dasar', 'polimorfisme', 'Polimorfisme', 3, 2],
  ['oop-dasar', 'abstraksi-dan-interface', 'Abstraksi dan Interface', 3, 2],
  ['vcs-dasar', 'apa-itu-vcs', 'Apa itu Version Control', 3, 2],
  ['vcs-dasar', 'repository-dan-commit', 'Repository dan Commit', 3, 2],
  ['vcs-dasar', 'branch-dan-merge', 'Branch dan Merge', 3, 2],
  ['vcs-dasar', 'resolve-konflik', 'Menangani Konflik', 3, 2],
  ['git-github', 'install-git', 'Menginstal Git', 3, 2],
  ['git-github', 'konfigurasi-dan-perintah-dasar', 'Konfigurasi dan Perintah Dasar', 3, 2],
  ['git-github', 'branch-dan-pull-request', 'Branch dan Pull Request', 4, 2],
  ['git-github', 'kolaborasi-tim', 'Kolaborasi Tim di GitHub', 4, 2],
  ['git-github', 'issues-dan-project', 'Issues dan Project Board', 3, 2],
  // ============ TRACK 2: WEB DEVELOPMENT ============
  ['web-dasar', 'html-pertama', 'Struktur Halaman HTML', 3, 2],
  ['web-dasar', 'css-dasar', 'Mengatur Tampilan dengan CSS', 3, 2],
  ['web-dasar', 'responsif', 'Layout Responsif dan Flexbox', 3, 2],
  ['web-dasar', 'javascript-dasar', 'JavaScript Dasar di Browser', 4, 2],
  ['web-dasar', 'backend-database', 'Alur Back-end dan Database', 4, 2],
  ['typescript-dasar', 'ts-apa-itu', 'Apa itu TypeScript', 3, 2],
  ['typescript-dasar', 'tipe-data', 'Tipe Data di TypeScript', 3, 2],
  ['typescript-dasar', 'interface-dan-type', 'Interface dan Type Alias', 3, 2],
  ['typescript-dasar', 'fungsi-dan-generic', 'Fungsi dan Generic', 3, 2],
  ['reactjs-dasar', 'react-apa-itu', 'Apa itu React', 3, 2],
  ['reactjs-dasar', 'komponen-dan-props', 'Komponen dan Props', 3, 2],
  ['reactjs-dasar', 'state-dan-event', 'State dan Event Handling', 3, 2],
  ['reactjs-dasar', 'hook-dasar', 'Hook Dasar: useState dan useEffect', 4, 2],
  ['reactjs-dasar', 'proyek-mini', 'Proyek Mini: Daftar Tugas', 5, 2],
  ['nextjs-dasar', 'next-apa-itu', 'Apa itu Next.js', 3, 2],
  ['nextjs-dasar', 'routing-dan-ssr', 'Routing dan Server-Side Rendering', 4, 2],
  ['nextjs-dasar', 'api-route', 'API Route', 3, 2],
  ['nextjs-dasar', 'deploy', 'Deployment Next.js', 3, 2],
  ['nodejs-dasar', 'node-apa-itu', 'Apa itu Node.js', 3, 2],
  ['nodejs-dasar', 'modul-dan-npm', 'Modul dan NPM', 3, 2],
  ['nodejs-dasar', 'rest-api', 'Membangun REST API', 4, 2],
  ['nodejs-dasar', 'database-koneksi', 'Koneksi ke Database', 3, 2],
  ['php-dasar', 'php-apa-itu', 'Apa itu PHP', 3, 2],
  ['php-dasar', 'variabel-dan-fungsi', 'Variabel dan Fungsi', 3, 2],
  ['php-dasar', 'form-dan-database', 'Form dan Koneksi Database', 4, 2],
  ['php-dasar', 'session-dan-keamanan', 'Session dan Keamanan Dasar', 3, 2],
  ['laravel-dasar', 'laravel-apa-itu', 'Apa itu Laravel', 3, 2],
  ['laravel-dasar', 'eloquent-dan-blade', 'Eloquent ORM dan Blade', 4, 2],
  ['laravel-dasar', 'routing-dan-migrasi', 'Routing dan Migrasi', 3, 2],
  ['laravel-dasar', 'proyek-mini', 'Proyek Mini: Blog Sederhana', 5, 2],
  ['codeigniter-dasar', 'ci-apa-itu', 'Apa itu CodeIgniter', 3, 2],
  ['codeigniter-dasar', 'mvc-dasar', 'MVC di CodeIgniter', 3, 2],
  ['codeigniter-dasar', 'query-builder', 'Query Builder dan Database', 3, 2],
  ['codeigniter-dasar', 'proyek-mini', 'Proyek Mini: Manajemen Kontak', 5, 2],
  // ============ TRACK 3: MOBILE DEVELOPMENT ============
  ['android-dasar', 'android-studio', 'Menginstal Android Studio', 3, 2],
  ['android-dasar', 'kotlin-dasar', 'Kotlin Dasar', 4, 2],
  ['android-dasar', 'layout-dan-activity', 'Layout dan Activity', 4, 2],
  ['android-dasar', 'publish-play-store', 'Publish ke Play Store', 3, 2],
  ['ios-dasar', 'xcode-dan-swift', 'Xcode dan Swift Dasar', 4, 2],
  ['ios-dasar', 'swiftui-dasar', 'SwiftUI Dasar', 4, 2],
  ['ios-dasar', 'navigasi-dan-layar', 'Navigasi Antar Layar', 3, 2],
  ['ios-dasar', 'app-store', 'Publish ke App Store', 3, 2],
  ['flutter-dasar', 'install-flutter', 'Menginstal Flutter', 3, 2],
  ['flutter-dasar', 'dart-dasar', 'Dart Dasar', 4, 2],
  ['flutter-dasar', 'widget-dasar', 'Widget Dasar', 4, 2],
  ['flutter-dasar', 'proyek-mini', 'Proyek Mini: Aplikasi Catatan', 5, 2],
  ['react-native-dasar', 'expo-dasar', 'Expo dan React Native', 3, 2],
  ['react-native-dasar', 'javascript-dasar-react-native', 'JavaScript untuk React Native', 3, 2],
  ['react-native-dasar', 'navigasi', 'Navigasi Antar Layar', 3, 2],
  ['react-native-dasar', 'proyek-mini', 'Proyek Mini: Aplikasi Cuaca', 5, 2],
  // ============ TRACK 4: SOFTWARE ENGINEERING DAN QA ============
  ['pengembangan-perangkat-lunak', 'analisis-kebutuhan', 'Analisis Kebutuhan', 3, 2],
  ['pengembangan-perangkat-lunak', 'desain-perangkat-lunak', 'Desain Perangkat Lunak', 3, 2],
  ['pengembangan-perangkat-lunak', 'implementasi-dan-uji', 'Implementasi dan Pengujian', 3, 2],
  ['pengembangan-perangkat-lunak', 'peluncuran-dan-pemeliharaan', 'Peluncuran dan Pemeliharaan', 3, 2],
  ['rekayasa-perangkat-lunak', 'sdlc', 'SDLC (Siklus Hidup Pengembangan Perangkat Lunak)', 3, 2],
  ['rekayasa-perangkat-lunak', 'manajemen-proyek', 'Manajemen Proyek IT', 3, 2],
  ['rekayasa-perangkat-lunak', 'agile-scrum', 'Agile dan Scrum', 4, 2],
  ['rekayasa-perangkat-lunak', 'dokumentasi', 'Dokumentasi Perangkat Lunak', 3, 2],
  ['qa-testing', 'jenis-pengujian', 'Jenis-Jenis Pengujian', 3, 2],
  ['qa-testing', 'unit-test', 'Unit Test', 3, 2],
  ['qa-testing', 'integrasi-dan-sistem', 'Pengujian Integrasi dan Sistem', 3, 2],
  ['qa-testing', 'uat-dan-laporan', 'UAT dan Laporan Bug', 3, 2],
  // ============ TRACK 5: DATABASE, DATA SCIENCE, DAN AI ============
  ['basis-data-sql', 'relasional-dasar', 'Database Relasional Dasar', 3, 2],
  ['basis-data-sql', 'query-sql', 'Query SQL: SELECT, INSERT, UPDATE, DELETE', 4, 2],
  ['basis-data-sql', 'join-dan-indeks', 'JOIN dan Indeks', 3, 2],
  ['basis-data-sql', 'mysql-postgresql', 'MySQL dan PostgreSQL', 3, 2],
  ['nosql-mongodb', 'nosql-apa-itu', 'Apa itu NoSQL', 3, 2],
  ['nosql-mongodb', 'mongodb-dasar', 'MongoDB Dasar', 3, 2],
  ['nosql-mongodb', 'query-dokumen', 'Query Dokumen', 3, 2],
  ['nosql-mongodb', 'agregasi', 'Agregasi Data', 3, 2],
  ['data-science', 'python-untuk-data', 'Python untuk Analisis Data', 4, 2],
  ['data-science', 'statistika-deskriptif', 'Statistika Deskriptif', 3, 2],
  ['data-science', 'visualisasi-data', 'Visualisasi Data', 3, 2],
  ['data-science', 'insight-bisnis', 'Insight Bisnis dari Data', 3, 2],
  ['ai-machine-learning', 'ai-dasar', 'Apa itu Kecerdasan Buatan', 3, 2],
  ['ai-machine-learning', 'ml-dasar', 'Machine Learning Dasar', 4, 2],
  ['ai-machine-learning', 'model-prediksi', 'Model Prediksi', 3, 2],
  ['ai-machine-learning', 'implementasi', 'Implementasi Praktis AI', 3, 2],
  // ============ TRACK 6: JARINGAN, INFRASTRUKTUR, DAN KEAMANAN SIBER ============
  ['jaringan-komputer', 'ip-address-subnetting', 'IP Address dan Subnetting', 4, 2],
  ['jaringan-komputer', 'tcpip-dan-osi', 'Model TCP/IP dan OSI', 3, 2],
  ['jaringan-komputer', 'routing-switching', 'Routing dan Switching', 3, 2],
  ['jaringan-komputer', 'jaringan-nirkabel', 'Jaringan Nirkabel dan Keamanan Dasar', 3, 2],
  ['sistem-operasi', 'linux-dasar', 'Linux Dasar (Ubuntu/CentOS)', 4, 2],
  ['sistem-operasi', 'windows-dasar', 'Windows Dasar', 3, 2],
  ['sistem-operasi', 'macos-dasar', 'macOS Dasar', 3, 2],
  ['sistem-operasi', 'baris-perintah', 'Baris Perintah dan Manajemen File', 3, 2],
  ['cloud-computing', 'cloud-apa-itu', 'Apa itu Cloud Computing', 3, 2],
  ['cloud-computing', 'aws-dasar', 'AWS Dasar', 3, 2],
  ['cloud-computing', 'gcp-dasar', 'GCP Dasar', 3, 2],
  ['cloud-computing', 'azure-dasar', 'Azure Dasar', 3, 2],
  ['cyber-security', 'kriptografi', 'Kriptografi Dasar', 3, 2],
  ['cyber-security', 'ethical-hacking', 'Ethical Hacking Dasar', 3, 2],
  ['cyber-security', 'pertahanan-jaringan', 'Pertahanan Jaringan', 3, 2],
  ['cyber-security', 'pencegahan-malware', 'Pencegahan Malware', 3, 2],
];

// blok: p = paragraf, h2 = subjudul, code = blok kode, list = butir, tip = catatan
const LESSONS = [
// ============ TRACK 1: FONDASI ============
  // --- logika-algoritma ---
  ['pemikiran-komputasi', 'Apa itu Pemikiran Komputasi', [
    { t: 'p', x: 'Pemikiran komputasi adalah cara memecah masalah besar menjadi langkah-langkah kecil yang dapat dipahami komputer. Bayangkan kamu memasak mie instan: ada urutan langkah, ada pilihan, dan ada hal yang diulang-ulang.' },
    { t: 'list', items: ['Mecahkan masalah (dekomposisi): pecah masalah besar menjadi bagian-bagian kecil', 'Pengenalan pola: lihat kesamaan antar masalah', 'Abstraksi: ambil bagian penting, buang detail yang tidak perlu', 'Alur langkah (algoritma): urutan instruksi yang jelas dan dapat diukur'] },
    { t: 'tip', x: 'Komputer tidak berpikir. Komputer hanya mengikuti instruksi yang kamu tulis, langkah demi langkah.' },
  ], 4],
  ['pemikiran-komputasi', 'Alur dan Pseudocode', [
    { t: 'p', x: 'Sebelum mengetik kode, tulis dulu alurnya dalam bahasa sehari-hari. Ini disebut pseudocode: campuran bahasa manusia dan logika komputer.' },
    { t: 'code', lang: 'text', x: 'MULAI\\n  Masukkan angka pertama\\n  Masukkan angka kedua\\n  Jumlahkan keduanya\\n  Tampilkan hasil\\nSELESAI' },
    { t: 'tip', x: 'Pseudocode tidak perlu berjalan di komputer. Fungsinya agar kamu tidak bingung saat mulai mengetik kode yang benar.' },
  ], 4],
  ['pemikiran-komputasi', 'Percabangan dan Perulangan', [
    { t: 'p', x: 'Percabangan adalah "jika... maka...": jika cuaca hujan, bawa payung; jika tidak, tidak perlu. Perulangan adalah melakukan hal yang sama berulang kali.' },
    { t: 'list', items: ['Jika (if): jalankan kode hanya jika kondisi terpenuhi', 'Jika tidak (else): jalankan kode alternatif', 'Sambil (while): ulangi selama kondisi masih benar', 'Untuk setiap (for): ulangi untuk setiap item dalam kumpulan'] },
    { t: 'code', lang: 'text', x: 'UNTUK setiap mahasiswa dalam daftar\\n  Jika nilai >= 70\\n    Tampilkan \"Lulus\"\\n  Jika tidak\\n    Tampilkan \"Remedial\"\\nSELESAI UNTUK' },
  ], 4],
  ['pemikiran-komputasi', 'Fungsi dan Rekursi', [
    { t: 'p', x: 'Fungsi adalah kotak alat yang dapat digunakan berkali-kali. Rekursi adalah fungsi yang memanggil dirinya sendiri, seperti cermin yang mencerminkan cermin.' },
    { t: 'code', lang: 'text', x: 'FUNGSI hitungFaktorial(n):\\n  Jika n <= 1: kembalikan 1\\n  Kembalikan n * hitungFaktorial(n - 1)\\nSELESAI FUNGSI' },
    { t: 'tip', x: 'Rekursi elegan tetapi bisa kehabisan memori jika tidak ada batas henti. Selalu berikan kondisi berhenti.' },
  ], 4],
  ['pemikiran-komputasi', 'Kompleksitas Waktu dan Ruang', [
    { t: 'p', x: 'Kompleksitas waktu mengukur seberapa lama program berjalan seiring bertambahnya data. Kompleksitas ruang mengukur seberapa banyak memori yang dibutuhkan.' },
    { t: 'list', items: ['O(1): waktu sama, tidak peduli seberapa besar data', 'O(n): waktu tumbuh sebanding dengan jumlah data', 'O(n^2): waktu tumbuh sangat cepat, biasanya karena dua perulangan bersarang'] },
    { t: 'tip', x: 'Pilih algoritma yang cepat saat data besar. Untuk data kecil, yang penting kode mudah dibaca.' },
  ], 4],
  // --- struktur-data ---
  ['array-dan-list', 'Array dan List', [
    { t: 'p', x: 'Array adalah kotak-kotak berurutan yang masing-masing menampung satu nilai. Kamu dapat mengakses isinya dengan nomor urut (indeks), dimulai dari 0.' },
    { t: 'code', lang: 'text', x: 'daftarBelanja = [\"beras\", \"minyak\", \"gula\", \"garam\"]\\n// indeks 0 = \"beras\", indeks 1 = \"minyak\", dst.' },
    { t: 'list', items: ['Indeks selalu dimulai dari 0, bukan 1', 'Array dapat menampung tipe data yang berbeda-beda', 'Panjang array dapat bertambah atau berkurang'] },
    { t: 'tip', x: 'Jangan mengakses indeks yang tidak ada, misal daftarBelanja[10] saat hanya ada 4 item. Itu akan menyebabkan error.' },
  ], 3],
  ['array-dan-list', 'Operasi Array Dasar', [
    { t: 'p', x: 'Kamu dapat menambah, menghapus, dan mengubah isi array. Operasi umum: push (tambah di akhir), pop (hapus dari akhir), shift (hapus dari depan), unshift (tambah di depan).' },
    { t: 'code', lang: 'text', x: 'daftarBelanja.push(\"teh\")        // tambah di akhir\\ndaftarBelanja.pop()            // hapus dari akhir\\ndaftarBelanja[0] = \"beras premium\"  // ubah elemen pertama' },
    { t: 'tip', x: 'Menghapus dari depan (shift) lebih lambat dari akhir (pop) karena semua elemen harus geser ke depan.' },
  ], 3],
  ['array-dan-list', 'Kesalahan Umum dengan Array', [
    { t: 'p', x: 'Pemula sering lupa bahwa indeks dimulai dari 0, jadi daftarBelanja[1] adalah item kedua, bukan pertama. Mereka juga sering mencoba mengakses elemen yang di luar jangkauan.' },
    { t: 'list', items: ['Menggunakan indeks 1 untuk elemen pertama (harus 0)', 'Mengakses indeks di luar panjang array (undefined)', 'Mengubah array sambil mengiterasi (akan melewati elemen)'] },
    { t: 'tip', x: 'Selalu periksa panjang array sebelum mengakses elemen dengan indeks tertentu.' },
  ], 3],
  // --- oop-dasar ---
  ['kelas-dan-objek', 'Kelas dan Objek', [
    { t: 'p', x: 'Kelas adalah cetak biru, objek adalah hasil cetaknya. Bayangkan kelas adalah cetak biru rumah, dan objek adalah rumah yang sudah dibangun dari cetak biru itu.' },
    { t: 'code', lang: 'text', x: 'KELAS Hewan:\\n  properti nama\\n  properti jenis\\n  fungsi bersuara():\\n    tampilkan nama + \" berbicara\"\\nSELESAI KELAS\\n\\nkucing = Hewan()\\nkucing.nama = \"Milo\"\\nkucing.bersuara()  // Milo berbicara' },
    { t: 'list', items: ['Kelas mendefinisikan properti dan perilaku', 'Objek adalah instance dari kelas', 'Satu kelas dapat menghasilkan banyak objek'] },
    { t: 'tip', x: 'Berikan nama kelas dalam kata benda tunggal, misal Hewan, Mobil, Pengguna.' },
  ], 4],
  ['kelas-dan-objek', 'Membuat Objek dari Kelas', [
    { t: 'p', x: 'Untuk membuat objek, gunakan kata kunci new diikuti nama kelas. Objek yang dihasilkan punya semua properti dan fungsi yang didefinisikan di kelas.' },
    { t: 'code', lang: 'text', x: 'mobil1 = new Mobil(\"Toyota\", \"Avanza\")\\nmobil2 = new Mobil(\"Honda\", \"Brio\")\\n\\nmobil1.nama  // \"Toyota\"\\nmobil2.nama  // \"Honda\"' },
    { t: 'tip', x: 'Setiap objek punya data sendiri. Mengubah mobil1 tidak mempengaruhi mobil2.' },
  ], 3],
  ['kelas-dan-objek', 'Kesalahan Umum: Lupa new', [
    { t: 'p', x: 'Jika lupa menuliskan new saat membuat objek, fungsi konstruktor akan dijalankan dalam konteks yang salah dan properti tidak akan tersimpan dengan benar.' },
    { t: 'list', items: ['Selalu pakai new saat memanggil konstruktor kelas', 'Periksa apakah objek berhasil dibuat dengan mencetaknya', 'Gunakan nama variabel yang jelas untuk setiap objek'] },
    { t: 'tip', x: 'Beberapa bahasa modern tidak perlu new, tetapi pelajari aturan bahasa yang kamu pakai.' },
  ], 3],
  // --- vcs-dasar ---
  ['apa-itu-vcs', 'Apa itu Version Control', [
    { t: 'p', x: 'Version Control System (VCS) adalah catatan perubahan file seiring waktu. Bayangkan kamu menyalin dokumen menjadi versi_v1.doc, versi_v2_final.doc, versi_v3_revisi.doc — VCS mengotomatisasi hal itu.' },
    { t: 'list', items: ['Menyimpan setiap perubahan sebagai versi terpisah', 'Mengizinkan kembali ke versi lama kapan saja', 'Menunjukkan siapa yang mengubah apa dan kapan', 'Mengizinkan banyak orang bekerja pada file yang sama'] },
    { t: 'tip', x: 'Tanpa VCS, kembali ke versi sebelum rusak sangat sulit dan rentan kesalahan.' },
  ], 3],
  ['apa-itu-vcs', 'Mengapa Perlu VCS', [
    { t: 'p', x: 'Tanpa VCS, satu kesalahan typing dapat menghapus jam-jam kerja. Dengan VCS, kamu dapat melihat apa yang berubah dan membatalkannya dengan satu perintah.' },
    { t: 'code', lang: 'text', x: 'Tanpa VCS:\\n  file_asli.txt -> file_edit1.txt -> file_edit_final.txt -> file_edit_final_REALLY.txt\\n\\nDengan VCS:\\n  commit 1 -> commit 2 -> commit 3 (dapat diakses kapan saja)' },
    { t: 'tip', x: 'Commit sering, jangan tunggu sampai pekerjaan selesai. Setiap commit adalah titik pulang yang aman.' },
  ], 3],

// --- web-dasar ---
  ['html-pertama', 'Struktur Halaman HTML', [
    { t: 'p', x: 'HTML bukan bahasa pemrograman, melainkan bahasa penanda (markup). Tugasnya memberi tahu browser bagian mana judul, mana paragraf, dan mana gambar.' },
    { t: 'code', lang: 'html', x: '<!doctype html>\\n<html lang=\"id\">\\n  <body>\\n    <h1>Halo, EduVerse</h1>\\n    <p>Halaman pertama saya.</p>\\n  </body>\\n</html>' },
    { t: 'tip', x: 'Baris <!doctype html> memberi tahu browser untuk memakai mode standar. Tanpanya, tampilan bisa berubah sendiri.' },
  ], 8],
  ['html-pertama', 'Tag Semantik', [
    { t: 'p', x: 'Tag semantik menggambarkan makna, bukan tampilan. <nav> untuk navigasi, <main> untuk isi utama, <article> untuk konten mandiri, <section> untuk bagian bertopik.' },
    { t: 'list', items: ['<header> dan <footer>: pembuka dan penutup halaman atau artikel', '<article>: konten yang masih masuk akal jika dipindah ke halaman lain', '<section>: bagian dalam satu topik, biasanya punya judul sendiri'] },
    { t: 'p', x: 'Ini penting bagi pembaca layar, hasil pencarian Google, dan mode luring EduVerse yang bergantung pada struktur, bukan warna.' },
  ], 10],
  ['html-pertama', 'Tautan, Gambar, dan Formulir', [
    { t: 'p', x: 'Tiga elemen yang hampir selalu ada: tautan (<a href>), gambar (<img src alt>), dan formulir (<form> dengan <input>).' },
    { t: 'code', lang: 'html', x: '<a href=\"/materi/css-dasar\">Lanjut ke CSS</a>\\n<img src=\"diagram.svg\" alt=\"Diagram alur\" width=\"480\" />\\n<label for=\"email\">Email</label>\\n<input id=\"email\" type=\"email\" required />' },
    { t: 'tip', x: 'alt bukan hiasan. Tanpa alt, pengguna pembaca layar hanya mendengar nama file.' },
  ], 9],
  ['css-dasar', 'Selector dan Kotak Model', [
    { t: 'p', x: 'CSS memilih elemen lalu mengubah tampilannya. Setiap elemen adalah kotak: konten, padding, border, dan margin.' },
    { t: 'code', lang: 'css', x: '.kartu {\\n  padding: 16px;\\n  border: 1px solid #e4eaf2;\\n  border-radius: 12px;\\n}\\n.kartu h2 { margin: 0 0 8px; }' },
    { t: 'p', x: 'Gunakan class, bukan id, untuk gaya yang berulang. Id unik per halaman dan punya specificity lebih tinggi yang menyusahkan di kemudian hari.' },
  ], 11],
  ['css-dasar', 'Variabel Warna dan Tema', [
    { t: 'p', x: 'Simpan warna sebagai variabel agar satu perubahan mengubah seluruh situs, termasuk mode gelap.' },
    { t: 'code', lang: 'css', x: ':root { --primary: #1f6feb; --foreground: #14243b; }\\n@media (prefers-color-scheme: dark) { :root { --primary: #5ea0f5; --foreground: #e8eef7; } }' },
    { t: 'tip', x: 'Kontras teks ke latar minimal 4.5:1 untuk teks biasa. Biru #1F6FEB di atas putih lolos; kuning murni di atas krem biasanya tidak.' },
  ], 10],
  ['css-dasar', 'Unit: px, rem, dan %', [
    { t: 'list', items: ['px untuk garis tepi dan detail kecil yang harus tegas', 'rem untuk ukuran teks dan jarak, mengikuti pengaturan font pengguna', '% atau fr untuk lebar kolom yang mengikuti wadah'] },
    { t: 'code', lang: 'css', x: 'body { font-size: 1rem; line-height: 1.6; }\\n.judul { font-size: 1.75rem; margin-bottom: 0.5rem; }' },
  ], 7],
  ['responsif', 'Mobile First dan Media Query', [
    { t: 'p', x: 'Mulai dari tampilan ponsel, lalu tambah aturan untuk layar lebar. Lebih mudah menambah daripada mencabut.' },
    { t: 'code', lang: 'css', x: '.daftar { display: grid; gap: 12px; }\\n@media (min-width: 720px) { .daftar { grid-template-columns: 2fr 1fr; } }' },
  ], 9],
  ['responsif', 'Flexbox untuk Deretan', [
    { t: 'p', x: 'Flexbox mengatur satu baris. justify-content mengatur sumbu utama, align-items sumbu silang, gap menggantikan margin tempel.' },
    { t: 'code', lang: 'css', x: '.toolbar { display: flex; align-items: center; gap: 8px; }\\n.toolbar .spacer { margin-left: auto; }' },
  ], 9],
  ['responsif', 'Grid Dua Kolom', [
    { t: 'code', lang: 'css', x: '.layout { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }' },
    { t: 'tip', x: 'auto-fit plus minmax membuat kartu menyesuaikan sendiri tanpa satu pun media query.' },
  ], 8],
  ['javascript-dasar', 'Variabel dan Tipe Data', [
    { t: 'p', x: 'Pakai const untuk nilai yang tidak diganti, let untuk yang berubah. var adalah warisan lama dan sebaiknya ditinggalkan.' },
    { t: 'code', lang: 'js', x: 'const nama = \"Rafi\";\\nlet skor = 0;\\nskor += 10;\\n// tipe dasar: string, number, boolean, null, undefined, bigint, symbol' },
  ], 8],
  ['javascript-dasar', 'Operator dan Coercion', [
    { t: 'p', x: 'Gunakan === dan !==. Perbandingan longgar melakukan konversi tipe yang mengejutkan: 0 == \"\" bernilai true.' },
    { t: 'code', lang: 'js', x: '0 == \"\";   // true, hindari\\n0 === \"\";  // false\\nnull ?? \"cadangan\"; // null hanya untuk kosongkan nilai' },
  ], 9],
  ['javascript-dasar', 'Array dan Objek', [
    { t: 'code', lang: 'js', x: 'const peserta = [\\n  { nama: \"Kanaya\", skor: 3410 },\\n  { nama: \"Rafi\", skor: 3120 },\\n];\\nconst terbaik = peserta[0].nama;' },
    { t: 'list', items: ['Array untuk urutan, objek untuk pasangan kunci-nilai', 'Destructuring: const { nama } = peserta[0]', 'Optional chaining: peserta[99]?.nama tidak melempar error'] },
  ], 10],
  ['javascript-dasar', 'Percabangan dan Perulangan', [
    { t: 'code', lang: 'js', x: 'for (const item of peserta) {\\n  if (item.skor >= 3000) console.log(`${item.nama}: emas`);\\n  else console.log(`${item.nama}: lanjut latihan`);\\n}' },
    { t: 'tip', x: 'for...of untuk nilai, for...in untuk kunci objek dan mudah salah pada array. Pilih for...of.' },
  ], 9],
  ['backend-database', 'Alur Request-Response', [
    { t: 'p', x: 'Browser mengirim permintaan (request) ke server, server memprosesnya, lalu mengirim balasan (response) kembali ke browser. Ini adalah dasar semua aplikasi web.' },
    { t: 'list', items: ['Klien (browser) mengirim HTTP request', 'Server menerima dan memproses request', 'Server mengirim HTTP response dengan status dan isi', 'Browser menampilkan response kepada pengguna'] },
    { t: 'tip', x: 'Status code 200 berarti sukses, 404 berarti tidak ditemukan, 500 berarti error di server.' },
  ], 4],
  ['backend-database', 'Koneksi ke Database', [
    { t: 'p', x: 'Server web perlu database untuk menyimpan data pengguna, konten, dan transaksi. Koneksi dibuat melalui driver database yang sesuai.' },
    { t: 'code', lang: 'text', x: 'const pg = require(\"pg\")\\nconst client = new pg.Client({ host: \"localhost\", port: 5432, database: \"eduverse\" })\\nclient.connect()' },
    { t: 'tip', x: 'Jangan pernah simpan password database langsung dalam kode. Gunakan variabel lingkungan (environment variables).' },
  ], 4],

// --- typescript-dasar ---
  ['ts-apa-itu', 'Apa itu TypeScript', [
    { t: 'p', x: 'TypeScript adalah JavaScript dengan tipe data statis. Kamu bisa menentukan tipe data untuk variabel, fungsi, dan objek, sehingga error ditangkap sebelum program dijalankan.' },
    { t: 'code', lang: 'ts', x: 'let nama: string = \"Rafi\";\\nlet umur: number = 20;\\nlet lulus: boolean = true;\\n\\nfunction sapa(orang: string): string {\\n  return \"Halo, \" + orang;\\n}' },
    { t: 'tip', x: 'TypeScript perlu dikompilasi (transpile) menjadi JavaScript sebelum berjalan di browser.' },
  ], 3],
  ['ts-apa-itu', 'Menginstal TypeScript', [
    { t: 'p', x: 'Pasang TypeScript melalui npm, manajer paket Node.js. Setelah itu, gunakan tsc untuk mengompilasi file .ts menjadi .js.' },
    { t: 'code', lang: 'bash', x: 'npm install -g typescript\\ntsc --version\\ntsc file.ts' },
    { t: 'list', items: ['Instal Node.js dari nodejs.org', 'Jalankan npm install -g typescript di terminal', 'Buat file dengan akhiran .ts', 'Kompilasi dengan tsc namafile.ts'] },
    { t: 'tip', x: 'Gunakan npx tsc jika tidak ingin menginstal secara global.' },
  ], 3],
  ['ts-apa-itu', 'Konfigurasi tsconfig.json', [
    { t: 'p', x: 'File tsconfig.json mengatur opsi kompilasi TypeScript, seperti target versi JavaScript dan folder output.' },
    { t: 'code', lang: 'json', x: '{\\n  \"compilerOptions\": {\\n    \"target\": \"ES2020\",\\n    \"module\": \"commonjs\",\\n    \"strict\": true,\\n    \"outDir\": \"./dist\"\\n  },\\n  \"include\": [\"src/**/*\"]\\n}' },
    { t: 'tip', x: 'Jalankan tsc --init untuk membuat tsconfig.json default di proyek kamu.' },
  ], 3],
  ['ts-apa-itu', 'Kesalahan Umum: Tipe Tidak Cocok', [
    { t: 'p', x: 'TypeScript akan menampilkan error saat kamu mencoba menyimpan nilai dengan tipe yang berbeda ke variabel yang sudah ditentukan tipenya.' },
    { t: 'list', items: ['Mengassign string ke variabel number', 'Memanggil fungsi dengan jumlah argumen yang salah', 'Mengakses properti yang tidak ada pada objek', 'Mengabaikan error tipe dengan paksa (any)'] },
    { t: 'tip', x: 'Jangan terlalu sering menggunakan any. Itu menghilangkan manfaat utama TypeScript.' },
  ], 3],
  // --- tiype-data ---
  ['tipe-data', 'Tipe Dasar TypeScript', [
    { t: 'p', x: 'TypeScript punya tipe data dasar: string, number, boolean, null, undefined, dan symbol. Setiap variabel dapat diberi tipe yang jelas.' },
    { t: 'code', lang: 'ts', x: 'let judul: string = \"Belajar TypeScript\";\\nlet halaman: number = 150;\\nlet selesai: boolean = false;\\nlet kosong: null = null;\\nlet belumDiisi: undefined = undefined;' },
    { t: 'list', items: ['string: teks', 'number: angka (bulat atau desimal)', 'boolean: benar atau salah', 'null: sengaja dikosongkan', 'undefined: belum diberi nilai'] },
    { t: 'tip', x: 'TypeScript biasanya bisa menebak tipe (type inference), jadi kamu tidak selalu perlu menuliskan tipe secara eksplisit.' },
  ], 3],
  ['tipe-data', 'Array dan Tuple', [
    { t: 'p', x: 'Array dalam TypeScript dapat dibatasi hanya menampung satu tipe data. Tuple adalah array dengan panjang dan tipe per elemen yang tetap.' },
    { t: 'code', lang: 'ts', x: 'let angka: number[] = [1, 2, 3];\\nlet nama: string[] = [\"Rafi\", \"Kanaya\"];\\n\\nlet data: [string, number] = [\"Rafi\", 20]; // nama, umur' },
    { t: 'tip', x: 'Tuple berguna saat kamu ingin pasangan data dengan tipe yang berbeda dan urutan yang pasti.' },
  ], 3],
  ['tipe-data', 'Enum dan Any', [
    { t: 'p', x: 'Enum untuk kumpulan konstanta terkait. Any untuk tipe yang tidak diketahui, tapi sebaiknya dihindari karena menutup mata TypeScript.' },
    { t: 'code', lang: 'ts', x: 'enum Status { Aktif, NonAktif, Pending }\\nlet statusSiswa: Status = Status.Aktif;\\n\\nlet bebas: any = \"apa saja\";\\nbebas = 100; // diizinkan, tapi tidak disarankan' },
    { t: 'tip', x: 'Gunakan unknown alih-alih any jika kamu tidak yakin tipe data, lalu periksa tipe sebelum menggunakannya.' },
  ], 3],
  ['tipe-data', 'Kesalahan Umum: Mengabaikan Error Tipe', [
    { t: 'p', x: 'Beberapa pemula mengabaikan error TypeScript atau memaksa tipe dengan any. Akibatnya, error baru muncul saat program berjalan (runtime), yang seharusnya sudah ditangkap TypeScript.' },
    { t: 'list', items: ['Menggunakan any terlalu sering', 'Mengabaikan tanda merah di editor', 'Menonaktifkan pemeriksaan tipe di tsconfig', 'Tidak menjalankan tsc sebelum deploy'] },
    { t: 'tip', x: 'Perbaiki error TypeScript segera muncul. Jangan biarkan menumpuk.' },
  ], 3],
  // --- interface-dan-type ---
  ['interface-dan-type', 'Interface untuk Objek', [
    { t: 'p', x: 'Interface mendefinisikan bentuk objek: properti apa saja yang harus ada dan tipe masing-masing. Ini seperti kontrak yang harus dipatuhi objek.' },
    { t: 'code', lang: 'ts', x: 'interface Siswa {\\n  nama: string;\\n  umur: number;\\n  lulus: boolean;\\n}\\n\\nconst rafi: Siswa = { nama: \"Rafi\", umur: 20, lulus: true };' },
    { t: 'tip', x: 'Interface memastikan objek yang diterima fungsi punya semua properti yang dibutuhkan.' },
  ], 3],
  ['interface-dan-type', 'Type Alias', [
    { t: 'p', x: 'Type alias memberi nama pada sebuah tipe data. Berguna untuk tipe gabungan (union) atau tipe yang kompleks.' },
    { t: 'code', lang: 'ts', x: 'type ID = string | number;\\nlet userId: ID = \"u123\";\\nuserId = 456; // diizinkan\\n\\ntype Warna = \"merah\" | \"biru\" | \"hijau\";\\nlet warna: Warna = \"merah\";' },
    { t: 'tip', x: 'Gunakan interface untuk objek, type alias untuk union atau tipe primitif.' },
  ], 3],
  ['interface-dan-type', 'Optional dan Readonly', [
    { t: 'p', x: 'Properti optional boleh tidak ada di objek. Readonly berarti nilai tidak boleh diubah setelah diassign.' },
    { t: 'code', lang: 'ts', x: 'interface Produk {\\n  nama: string;\\n  diskon?: number; // optional\\n  readonly id: string; // tidak bisa diubah\\n}\\n\\nconst item: Produk = { nama: \"Buku\", id: \"p001\" }; // diskon boleh diabaikan' },
    { t: 'tip', x: 'Tanda ? setelah nama properti berarti optional. readonly mencegah perubahan nilai setelah pembuatan.' },
  ], 3],
  ['interface-dan-type', 'Kesalahan Umum: Properti Hilang', [
    { t: 'p', x: 'Jika objek tidak memiliki properti wajib yang didefinisikan di interface, TypeScript akan menampilkan error. Ini sebenarnya membantu mencegah bug.' },
    { t: 'list', items: ['Lupa menambahkan properti wajib', 'Memberikan nilai dengan tipe yang salah', 'Mengubah properti readonly', 'Mengakses properti yang tidak ada di interface'] },
    { t: 'tip', x: 'Baca pesan error TypeScript dengan teliti. Ia biasanya mengatakan tepat properti mana yang hilang.' },
  ], 3],
  // --- fungsi-dan-generic ---
  ['fungsi-dan-generic', 'Fungsi dengan Tipe', [
    { t: 'p', x: 'Fungsi dalam TypeScript dapat diberi tipe untuk parameter dan nilai kembali. Ini mencegah pemanggilan fungsi dengan argumen yang salah.' },
    { t: 'code', lang: 'ts', x: 'function tambah(a: number, b: number): number {\\n  return a + b;\\n}\\n\\ntambah(10, 5);   // 15\\ntambah(\"10\", 5); // error: tipe tidak cocok' },
    { t: 'tip', x: 'Selalu beri tipe pada parameter fungsi agar TypeScript dapat memeriksa pemanggilan.' },
  ], 3],
  ['fungsi-dan-generic', 'Generic Fungsi', [
    { t: 'p', x: 'Generic memungkinkan fungsi bekerja dengan berbagai tipe data sambil tetap menjaga keamanan tipe. Tipe ditentukan saat pemanggilan.' },
    { t: 'code', lang: 'ts', x: 'function identitas<T>(nilai: T): T {\\n  return nilai;\\n}\\n\\nlet teks = identitas<string>(\"hello\");\\nlet angka = identitas<number>(100);' },
    { t: 'tip', x: '<T> adalah placeholder tipe. Kamu dapat memberi nama lain, misal <Item> atau <TItem>.' },
  ], 3],
  ['fungsi-dan-generic', 'Generic dengan Array', [
    { t: 'p', x: 'Array juga menggunakan generic. number[] sama dengan Array<number>. Ini memastikan semua elemen array punya tipe yang sama.' },
    { t: 'code', lang: 'ts', x: 'let daftar: Array<string> = [\"Rafi\", \"Kanaya\"];\\ndaftar.push(100); // error: tidak boleh menambahkan number ke array string' },
    { t: 'tip', x: 'Gunakan Array<T> atau T[] untuk array dengan tipe elemen yang jelas.' },
  ], 3],
  ['fungsi-dan-generic', 'Kesalahan Umum: Tipe Tidak Konsisten', [
    { t: 'p', x: 'Campur tipe data dalam satu array atau fungsi generic tanpa perencanaan akan menyebabkan error TypeScript yang sulit dipecah.' },
    { t: 'list', items: ['Masukkan tipe campuran dalam array tunggal', 'Mengabaikan tipe parameter generic', 'Menggunakan any sebagai pintasan', 'Tidak menentukan tipe saat memanggil fungsi generic'] },
    { t: 'tip', x: 'Rancang tipe data sebelum mengetik kode. Konsistensi tipe mencegah banyak bug.' },
  ], 3],
  // --- reactjs-dasar ---
  ['react-apa-itu', 'Apa itu React', [
    { t: 'p', x: 'React adalah pustaka JavaScript untuk membangun antarmuka pengguna. Kamu membagi tampilan menjadi komponen-komponen kecil yang dapat digunakan kembali.' },
    { t: 'code', lang: 'jsx', x: 'function Selamat() {\\n  return <h1>Halo, EduVerse</h1>;\\n}' },
    { t: 'list', items: ['Komponen adalah fungsi yang mengembalikan JSX', 'JSX mirip HTML tapi ditulis dalam JavaScript', 'Komponen dapat digunakan berkali-kali', 'React memperbarui tampilan hanya pada bagian yang berubah'] },
    { t: 'tip', x: 'React dikembangkan oleh Meta dan digunakan oleh banyak situs besar di seluruh dunia.' },
  ], 3],
  ['react-apa-itu', 'Menginstal React', [
    { t: 'p', x: 'Cara termudah memulai React adalah menggunakan Vite, alat pembangun yang cepat. Kamu butuh Node.js terlebih dahulu.' },
    { t: 'code', lang: 'bash', x: 'npm create vite@latest belajar-react -- --template react\\ncd belajar-react\\nnpm install\\nnpm run dev' },
    { t: 'list', items: ['Instal Node.js dari nodejs.org', 'Jalankan perintah npm create vite@latest', 'Pilih template React', 'Jalankan npm install dan npm run dev'] },
    { t: 'tip', x: 'Vite lebih cepat dari Create React App untuk pengembangan dan pembuildan.' },
  ], 3],
  ['react-apa-itu', 'JSX Dasar', [
    { t: 'p', x: 'JSX memungkinkan kamu menulis sintaks mirip HTML di dalam JavaScript. Elemen JSX harus ditutup dan hanya boleh ada satu elemen induk.' },
    { t: 'code', lang: 'jsx', x: 'function Profil() {\\n  return (\\n    <div>\\n      <h1>Rafi</h1>\\n      <p>Pelajar EduVerse</p>\\n    </div>\\n  );\\n}' },
    { t: 'list', items: ['Tag JSX harus ditutup (misal <br />)', 'Satu elemen induk untuk setiap komponen', 'Gunakan kurung kurawal untuk ekspresi JavaScript: {nama}', 'class menjadi className di JSX'] },
    { t: 'tip', x: 'Ingat: JSX bukan HTML. Beberapa atribut berbeda, seperti className alih-alih class.' },
  ], 3],
  ['react-apa-itu', 'Kesalahan Umum: Lupa Return', [
    { t: 'p', x: 'Komponen React harus mengembalikan JSX atau null. Jika lupa return, komponen tidak akan menampilkan apa-apa.' },
    { t: 'list', items: ['Lupa perintah return di dalam komponen', 'Mengembalikan lebih dari satu elemen tanpa induk', 'Menulis HTML murni bukan JSX', 'Lupa tutup tag JSX'] },
    { t: 'tip', x: 'Jika ingin mengembalikan banyak elemen, bungkus dengan <div> atau gunakan fragment <>...</>.' },
  ], 3],
  // --- komponen-dan-props ---
  ['komponen-dan-props', 'Komponen dan Props', [
    { t: 'p', x: 'Props adalah data yang diterima komponen dari komponen induk. Props bersifat read-only (hanya boleh dibaca, tidak diubah).' },
    { t: 'code', lang: 'jsx', x: 'function Sapaan({ nama }: { nama: string }) {\\n  return <h1>Halo, {nama}</h1>;\\n}\\n\\n// Penggunaan:\\n<Sapaan nama=\"Rafi\" />\\n<Sapaan nama=\"Kanaya\" />' },
    { t: 'list', items: ['Props diterima sebagai parameter fungsi', 'Props tidak boleh diubah oleh komponen penerima', 'Props dapat berupa string, angka, objek, atau fungsi', 'Berikan nama props yang jelas dan deskriptif'] },
    { t: 'tip', x: 'Props mirip atribut HTML, tapi bisa berupa tipe data apa saja dalam JavaScript.' },
  ], 3],
  ['komponen-dan-props', 'Mengirim Props ke Komponen', [
    { t: 'p', x: 'Kamu mengirim props saat menggunakan komponen, seperti menambahkan atribut pada elemen HTML. Komponen penerima kemudian menampilkan props tersebut.' },
    { t: 'code', lang: 'jsx', x: 'function Kartu({ judul, isi }: { judul: string; isi: string }) {\\n  return (\\n    <div className=\"kartu\">\\n      <h2>{judul}</h2>\\n      <p>{isi}</p>\\n    </div>\\n  );\\n}\\n\\n<Kartu judul=\"Pengumuman\" isi=\"Selamat belajar!\" />' },
    { t: 'tip', x: 'Gunakan destructuring {nama} untuk langsung mengambil props dari parameter.' },
  ], 3],
  ['komponen-dan-props', 'Props dengan TipeScript', [
    { t: 'p', x: 'Dengan TypeScript, kamu dapat mendefinisikan tipe props agar komponen hanya menerima data dengan bentuk yang benar.' },
    { t: 'code', lang: 'tsx', x: 'interface Props {\\n  judul: string;\\n  jumlah: number;\\n}\\n\\nfunction Tampilan({ judul, jumlah }: Props) {\\n  return <div>{judul}: {jumlah}</div>;\\n}' },
    { t: 'tip', x: 'Jika lupa memberikan props wajib, TypeScript akan memberikan error saat pengembangan.' },
  ], 3],
  ['komponen-dan-props', 'Kesalahan Umum: Mengubah Props', [
    { t: 'p', x: 'Props bersifat read-only. Jika kamu mencoba mengubah props di dalam komponen, React akan memberikan peringatan dan perubahan tidak akan diterapkan.' },
    { t: 'list', items: ['Mengubah nilai props secara langsung', 'Menggunakan props untuk state yang berubah', 'Menganggap props dapat diubah seperti variabel biasa', 'Tidak membedakan props dan state'] },
    { t: 'tip', x: 'Jika data perlu berubah, gunakan state (useState), bukan props.' },
  ], 3],

// --- state-dan-event ---
  ['state-dan-event', 'State dengan useState', [
    { t: 'p', x: 'State adalah data yang dielola di dalam komponen dan dapat berubah seiring waktu. Saat state berubah, React akan merender ulang komponen.' },
    { t: 'code', lang: 'jsx', x: 'import { useState } from \"react\";\\n\\nfunction Hitung() {\\n  const [jumlah, setJumlah] = useState(0);\\n\\n  return (\\n    <div>\\n      <p>Jumlah: {jumlah}</p>\\n      <button onClick={() => setJumlah(jumlah + 1)}>Tambah</button>\\n    </div>\\n  );\\n}' },
    { t: 'list', items: ['useState mengembalikan nilai state dan fungsi untuk mengubahnya', 'Nilai awal useState adalah argumen pertama', 'Panggil fungsi setter untuk mengubah state', 'State perubahan memicu re-render komponen'] },
    { t: 'tip', x: 'Jangan mengubah state secara langsung (misal jumlah++). Selalu gunakan fungsi setter dari useState.' },
  ], 4],
  ['state-dan-event', 'Event Handling', [
    { t: 'p', x: 'Event handling dalam React menggunakan camelCase (onClick, onChange, onSubmit) dan fungsi sebagai pengendali, bukan string.' },
    { t: 'code', lang: 'jsx', x: 'function Formulir() {\\n  function tanganiKlik() {\\n    alert(\"Tombol diklik\");\\n  }\\n\\n  return <button onClick={tanganiKlik}>Klik Saya</button>;\\n}' },
    { t: 'list', items: ['Gunakan onClick untuk klik tombol', 'Gunakan onChange untuk input teks', 'Gunakan onSubmit untuk formulir', 'Kirim fungsi, bukan panggilan fungsi: onClick={fn} bukan onClick={fn()}' ] },
    { t: 'tip', x: 'Jangan tambahkan kurung saat memberikan fungsi ke event handler, kecuali kamu ingin memanggilnya segera.' },
  ], 3],
  ['state-dan-event', 'Form dan Input Terkontrol', [
    { t: 'p', x: 'Input terkontrol adalah input yang nilainya diatur oleh state React. Setiap kali pengguna mengetik, state diperbarui dan input menampilkan nilai baru.' },
    { t: 'code', lang: 'jsx', x: 'function InputNama() {\\n  const [nama, setNama] = useState(\"\");\\n\\n  return (\\n    <div>\\n      <input value={nama} onChange={e => setNama(e.target.value)} />\\n      <p>Nama: {nama}</p>\\n    </div>\\n  );\\n}' },
    { t: 'tip', x: 'Selalu gunakan value dan onChange bersama untuk input terkontrol. Jangan hanya salah satunya.' },
  ], 3],
  ['state-dan-event', 'Kesalahan Umum: State Tidak Berubah', [
    { t: 'p', x: 'Pemula sering mengubah state langsung tanpa fungsi setter, sehingga React tidak tahu state telah berubah dan tidak merender ulang.' },
    { t: 'list', items: ['Mengubah state langsung: jumlah++', 'Mengubah objek state secara langsung: user.nama = \"baru\"', 'Menggunakan state lama untuk perhitungan baru tanpa functional update', 'Menganggap state berubah segera setelah setter dipanggil'] },
    { t: 'tip', x: 'Untuk memperbarui state berdasarkan state lama, gunakan bentuk fungsi: setJumlah(j => j + 1).' },
  ], 3],
  // --- hook-dasar ---
  ['hook-dasar', 'useEffect untuk Sampingan', [
    { t: 'p', x: 'useEffect digunakan untuk melakukan sampingan (side effect) setelah render, seperti mengambil data dari API, mengatur timer, atau berlangganan event.' },
    { t: 'code', lang: 'jsx', x: 'import { useState, useEffect } from \"react\";\\n\\nfunction Data() {\\n  const [info, setInfo] = useState(null);\\n\\n  useEffect(() => {\\n    fetch(\"https://api.contoh.com/data\")\\n      .then(res => res.json())\n      .then(data => setInfo(data));\n  }, []); // array kosong = jalankan sekali saat mount\\n\\n  return <div>{info ? info.judul : \"Memuat...\"}</div>;\\n}' },
    { t: 'list', items: ['useEffect dijalankan setelah setiap render secara default', 'Array dependensi mengatur kapan effect dijalankan', 'Array kosong [] berarti hanya sekali saat mounting', 'Fungsi kembalian (cleanup) untuk membatalkan efek'] },
    { t: 'tip', x: 'Jika ingin effect berjalan hanya sekali, berikan array kosong sebagai argumen kedua.' },
  ], 4],
  ['hook-dasar', 'Array Dependensi useEffect', [
    { t: 'p', x: 'Array dependensi menentukan kapan useEffect harus dijalankan ulang. Jika nilai dalam array berubah, effect akan berjalan lagi.' },
    { t: 'code', lang: 'jsx', x: 'useEffect(() => {\\n  console.log(\"Id berubah: \" + id);\\n}, [id]); // jalankan saat id berubah\\n\\nuseEffect(() => {\\n  console.log(\"Hanya sekali\");\\n}, []); // hanya saat mounting' },
    { t: 'list', items: ['Tanpa array: berjalan setelah setiap render', 'Dengan array [id]: berjalan saat id berubah', 'Dengan array []: berjalan sekali saat mounting', 'Masukkan semua nilai yang digunakan dalam effect ke array'] },
    { t: 'tip', x: 'Eslint react-hooks/exhaustive-deps akan memperingatkan jika kamu lupa variabel dalam dependensi.' },
  ], 3],
  ['hook-dasar', 'Custom Hook', [
    { t: 'p', x: 'Custom hook adalah fungsi yang memakai hook bawaan React dan dapat digunakan kembali di banyak komponen. Nama custom hook harus diawali dengan kata use.' },
    { t: 'code', lang: 'jsx', x: 'function useJudulHalaman(judul) {\\n  useEffect(() => {\\n    document.title = judul;\\n  }, [judul]);\\n}\\n\\nfunction Halaman() {\\n  useJudulHalaman(\"Belajar React\");\\n  return <h1>Halo</h1>;\\n}' },
    { t: 'tip', x: 'Custom hook harus diawali dengan use agar React mengenainya sebagai hook dan mematuhi aturan hook.' },
  ], 3],
  ['hook-dasar', 'Aturan Hook', [
    { t: 'p', x: 'Hook hanya boleh dipanggil di tingkat teratas komponen atau custom hook, bukan di dalam loop, kondisi, atau fungsi bersarang.' },
    { t: 'list', items: ['Jangan panggil hook di dalam if, for, atau switch', 'Jangan panggil hook di dalam fungsi biasa (bukan komponen)', 'Panggil hook di tingkat teratas komponen', 'Pastikan pemanggilan hook konsisten setiap render'] },
    { t: 'tip', x: 'Aturan hook memastikan state dan effect selalu terhubung ke komponen yang sama di setiap render.' },
  ], 3],
  ['hook-dasar', 'Kesalahan Umum: Lupa Array Dependensi', [
    { t: 'p', x: 'Jika lupa memberikan array dependensi ke useEffect, effect akan berjalan setelah setiap render dan dapat menyebabkan loop tak terbatas.' },
    { t: 'list', items: ['Lupa array dependensi di useEffect', 'Mengubah state dalam useEffect tanpa dependensi', 'Memanggil fungsi setter secara berulang dalam effect', 'Menggunakan useEffect untuk sesuatu yang bisa dilakukan saat render'] },
    { t: 'tip', x: 'Jika perlu mengubah state sebagai reaksi pada prop, pertimbangkan apakah butuh useEffect atau cukup dengan render langsung.' },
  ], 3],
  // --- proyek-mini ---
  ['proyek-mini', 'Proyek Mini: Daftar Tugas', [
    { t: 'p', x: 'Buat aplikasi daftar tugas sederhana menggunakan React. Kamu akan menerapkan useState, event handling, dan input terkontrol dalam satu proyek nyata.' },
    { t: 'list', items: ['Tambah tugas baru', 'Tandai tugas selesai', 'Hapus tugas', 'Tampilkan jumlah tugas aktif dan selesai'] },
    { t: 'code', lang: 'jsx', x: 'import { useState } from \"react\";\\n\\nfunction DaftarTugas() {\\n  const [tugas, setTugas] = useState([]);\\n  const [input, setInput] = useState(\"\");\\n\\n  function tambah() {\\n    if (!input.trim()) return;\\n    setTugas([...tugas, { teks: input, selesai: false }]);\\n    setInput(\"\");\\n  }\\n\\n  return (\\n    <div>\\n      <input value={input} onChange={e => setInput(e.target.value)} />\\n      <button onClick={tambah}>Tambah</button>\\n      <ul>\\n        {tugas.map((t, i) => (\\n          <li key={i}>{t.teks}</li>\\n        ))}\\n      </ul>\\n    </div>\\n  );\\n}' },
    { t: 'tip', x: 'Selalu berikan key pada elemen dalam daftar yang di-render dengan map agar React dapat mengidentifikasi setiap item.' },
  ], 5],
  // --- nextjs-dasar ---
  ['next-apa-itu', 'Apa itu Next.js', [
    { t: 'p', x: 'Next.js adalah framework React untuk produksi. Menyediakan fitur seperti server-side rendering, routing otomatis, dan API route tanpa konfigurasi tambahan.' },
    { t: 'list', items: ['Routing berbasis file (folder jadi halaman)', 'Server-Side Rendering (SSR) dan Static Site Generation (SSG)', 'API route dalam folder app/api', 'Optimasi gambar dan font otomatis', 'Dikembangkan oleh Vercel'] },
    { t: 'tip', x: 'Next.js cocok untuk situs yang perlu SEO baik dan performa muat awal cepat.' },
  ], 3],
  ['next-apa-itu', 'Menginstal Next.js', [
    { t: 'p', x: 'Gunakan npx create-next-app untuk membuat proyek Next.js baru. Pilih opsi TypeScript, Tailwind CSS, dan App Router sesuai kebutuhan.' },
    { t: 'code', lang: 'bash', x: 'npx create-next-app@latest belajar-next\\ncd belajar-next\\nnpm run dev' },
    { t: 'list', items: ['Pastikan Node.js terinstal', 'Jalankan npx create-next-app@latest nama-proyek', 'Pilih konfigurasi yang diinginkan', 'Jalankan npm run dev untuk mengembangkan'] },
    { t: 'tip', x: 'App Router (folder app) adalah pendekatan terbaru dan direkomendasikan untuk proyek baru.' },
  ], 3],
  ['next-apa-itu', 'Routing Berbasis File', [
    { t: 'p', x: 'Dalam Next.js App Router, setiap folder di dalam mewakili satu route. File page.js di dalam folder menjadi halaman untuk route tersebut.' },
    { t: 'code', lang: 'text', x: 'app/\\n  page.js          // halaman /\\n  tentang/\\n    page.js        // halaman /tentang\\n  kontak/\\n    page.js        // halaman /kontak' },
    { t: 'tip', x: 'Gunakan folder dengan kurung siku [id] untuk route dinamis, misal produk/[id]/page.js untuk /produk/123.' },
  ], 3],
  ['next-apa-itu', 'Kesalahan Umum: Lupa Export Default', [
    { t: 'p', x: 'Setiap halaman Next.js harus mengekspor komponen default. Jika lupa, halaman tidak akan ditampilkan dan akan muncul error.' },
    { t: 'list', items: ['Lupa export default di file page.js', 'Menggunakan export bernama alih-alih default', 'File halaman tidak bernama page.js', 'Menempatkan komponen di luar folder app'] },
    { t: 'tip', x: 'Selalu gunakan export default function Halaman() { ... } di setiap file page.js.' },
  ], 3],
  // --- routing-dan-ssr ---
  ['routing-dan-ssr', 'Server-Side Rendering (SSR)', [
    { t: 'p', x: 'SSR artinya halaman dirender di server sebelum dikirim ke browser. Pengguna melihat konten segera tanpa menunggu JavaScript di sisi klien.' },
    { t: 'code', lang: 'jsx', x: 'export default async function Halaman() {\\n  const res = await fetch(\"https://api.contoh.com/data\", { cache: \"no-store\" });\\n  const data = await res.json();\\n\\n  return <div>{data.judul}</div>;\\n}' },
    { t: 'tip', x: 'Halaman dengan async function dan fetch otomatis menjadi SSR di Next.js App Router.' },
  ], 4],
  ['routing-dan-ssr', 'Static Site Generation (SSG)', [
    { t: 'p', x: 'SSG menghasilkan halaman sebagai file statis pada waktu pembuatan (build). Cocok untuk konten yang tidak sering berubah, seperti blog atau dokumentasi.' },
    { t: 'list', items: ['Halaman dibangun sekali saat build', 'Dikirim sebagai file HTML statis', 'Sangat cepat diakses pengguna', 'Tidak perlu server untuk setiap request'] },
    { t: 'tip', x: 'Gunakan SSG untuk konten statis dan SSR untuk konten yang selalu segar.' },
  ], 3],
  ['routing-dan-ssr', 'Route Dinamis', [
    { t: 'p', x: 'Route dinamis memungkinkan halaman yang menyesuaikan berdasarkan parameter URL, seperti halaman produk dengan ID yang berbeda.' },
    { t: 'code', lang: 'text', x: 'app/produk/[id]/page.js\\n\\nexport default function Produk({ params }) {\\n  return <div>Produk ID: {params.id}</div>;\\n}' },
    { t: 'tip', x: 'params.id berisi nilai dari segmen URL yang sesuai dengan [id].' },
  ], 3],
  ['routing-dan-ssr', 'Kesalahan Umum: Mengakses Window di SSR', [
    { t: 'p', x: 'Objek window dan document hanya tersedia di browser, tidak di server. Mengaksesnya dalam komponen SSR akan menyebabkan error.' },
    { t: 'list', items: ['Mengakses window.localDate di komponen server', 'Menggunakan document.getElementById di SSR', 'Mengira kode berjalan di browser saat build', 'Tidak memeriksa apakah code berjalan di client'] },
    { t: 'tip', x: 'Gunakan useEffect untuk mengakses window atau document, karena useEffect hanya berjalan di browser.' },
  ], 3],
  // --- api-route ---
  ['api-route', 'API Route', [
    { t: 'p', x: 'API route memungkinkan kamu membuat endpoint API di dalam aplikasi Next.js tanpa perlu server terpisah. File route.js di folder app/api menjadi endpoint.' },
    { t: 'code', lang: 'js', x: 'app/api/sapa/route.js\\n\\nexport async function GET() {\\n  return Response.json({ pesan: \"Halo dari Next.js\" });\\n}' },
    { t: 'tip', x: 'API route mendukung metode GET, POST, PUT, DELETE, dan lainnya.' },
  ], 3],
  ['api-route', 'Mengambil Data dari API Route', [
    { t: 'p', x: 'Frontend dapat memanggil API route yang sama menggunakan fetch. Ini cocok untuk membangun aplikasi fullstack dengan satu proyek.' },
    { t: 'code', lang: 'jsx', x: 'useEffect(() => {\\n  fetch(\"/api/sapa\")\\n    .then(res => res.json())\n    .then(data => console.log(data.pesan));\n}, []);' },
    { t: 'tip', x: 'API route di Next.js dapat diakses dengan path relatif seperti /api/nama-endpoint.' },
  ], 3],
  ['api-route', 'Kesalahan Umum: Lupa Return Response', [
    { t: 'p', x: 'Setiap handler API route harus mengembalikan Response. Jika lupa, klien akan menerima respons kosong atau timeout.' },
    { t: 'list', items: ['Lupa return Response.json(...)', 'Mengembalikan objek langsung bukan Response', 'Tidak mengatur status code yang sesuai', 'Mengabaikan penanganan error'] },
    { t: 'tip', x: 'Selalu kembalikan Response.json() dengan data dan status code yang tepat.' },
  ], 3],
  // --- deploy ---
  ['deploy', 'Deployment Next.js', [
    { t: 'p', x: 'Next.js dapat di-deploy ke berbagai platform, termasuk Vercel (pembuat Next.js), Netlify, dan Railway. Prosesnya biasanya hanya perlu menghubungkan repositori GitHub.' },
    { t: 'list', items: ['Push kode ke GitHub', 'Hubungkan repositori ke platform deploy', 'Konfigurasi variabel lingkungan jika diperlukan', 'Platform akan membangun dan mendistribusikan aplikasi otomatis'] },
    { t: 'tip', x: 'Vetcel menyediakan integrasi paling lancar dengan Next.js karena dibuat oleh tim yang sama.' },
  ], 3],
  ['deploy', 'Variabel Lingkungan', [
    { t: 'p', x: 'Variabel lingkungan digunakan untuk menyimpan konfigurasi sensitif seperti kunci API dan URL database. Di Next.js, gunakan file .env.local.' },
    { t: 'code', lang: 'text', x: '# .env.local\\nDATABASE_URL=\"postgresql://user:pass@localhost:5432/db\"\\nAPI_KUNCI=\"rahasia-123\"' },
    { t: 'list', items: ['Buat file .env.local di root proyek', 'Tambahkan variabel dengan format NAMA=nilai', 'Variabel diakses melalui process.env.NAMA', 'Jangan commit .env.local ke GitHub'] },
    { t: 'tip', x: 'Tambahkan .env.local ke file .gitignore agar tidak terunggah ke repositori publik.' },
  ], 3],
  ['deploy', 'Build Produksi', [
    { t: 'p', x: 'Sebelum di-deploy, jalankan npm run build untuk menghasilkan versi produksi aplikasi. Build mengoptimasi kode untuk kecepatan dan ukuran.' },
    { t: 'code', lang: 'bash', x: 'npm run build\\nnpm start' },
    { t: 'tip', x: 'npm start menjalankan server produksi setelah build selesai.' },
  ], 3],
  ['deploy', 'Kesalahan Umum: Build Gagal di Produksi', [
    { t: 'p', x: 'Beberapa kode yang berjalan baik di pengembangan (dev) mungkin gagal di build produksi, terutama jika mengakses window atau document di luar useEffect.' },
    { t: 'list', items: ['Akses window/document di luar useEffect', 'Impor modul yang hanya bekerja di browser', 'Variabel lingkungan tidak tersedia di produksi', 'Kode yang bergantung pada ukuran layar saat render'] },
    { t: 'tip', x: 'Uji build produksi secara lokal sebelum di-deploy dengan menjalankan npm run build dan npm start.' },
  ], 3],

// --- nodejs-dasar ---
  ['node-apa-itu', 'Apa itu Node.js', [
    { t: 'p', x: 'Node.js adalah runtime JavaScript yang memungkinkan JavaScript berjalan di luar browser, di sisi server. Dengan Node.js, kamu bisa membangun backend menggunakan bahasa yang sama dengan frontend.' },
    { t: 'list', items: ['JavaScript di sisi server', 'Dibangun pada mesin V8 Chrome', 'Berjalan secara non-blokir dan berbasis event', 'Cocok untuk aplikasi real-time dan API'] },
    { t: 'tip', x: 'Node.js bukan bahasa pemrograman baru, melainkan JavaScript yang dijalankan di server.' },
  ], 3],
  ['node-apa-itu', 'Menginstal Node.js', [
    { t: 'p', x: 'Unduh dan instal Node.js dari nodejs.org. npm (Node Package Manager) terinstal bersama Node.js dan digunakan untuk mengelola paket dan dependensi proyek.' },
    { t: 'code', lang: 'bash', x: 'node --version\\nnpm --version\\nnpm init -y\\nnpm install express' },
    { t: 'list', items: ['Kunjungi nodejs.org dan unduh versi LTS', 'Jalankan installer dan ikuti petunjuk', 'Periksa versi dengan node --version dan npm --version', 'Gunakan npm init untuk memulai proyek baru'] },
    { t: 'tip', x: 'Pilih versi LTS (Long Term Support) untuk stabilitas produksi.' },
  ], 3],
  ['node-apa-itu', 'Modul dan require', [
    { t: 'p', x: 'Node.js menggunakan sistem modul CommonJS dengan require untuk memasukkan modul dan module.exports untuk mengekspor fungsi atau objek.' },
    { t: 'code', lang: 'js', x: 'const http = require(\"http\");\\nconst fs = require(\"fs\");\\n\\nfunction sapa() {\\n  return \"Halo dari Node.js\";\\n}\\n\\nmodule.exports = { sapa };' },
    { t: 'list', items: ['require memasukkan modul eksternal atau bawaan', 'module.exports mengekspos apa yang bisa digunakan lain', 'Setiap file adalah modul tersendiri', 'Modul dapat digunakan ulang di berkas lain'] },
    { t: 'tip', x: 'ES Modules (import/export) juga didukung Node.js dengan menambahkan \"type\": \"module\" di package.json.' },
  ], 3],
  ['node-apa-itu', 'Kesalahan Umum: Callback Hell', [
    { t: 'p', x: 'Callback hell terjadi ketika banyak fungsi bersarang karena operasi asynchronous. Kode menjadi sulit dibaca dan dipelihara.' },
    { t: 'list', items: ['Terlalu banyak fungsi bersarang', 'Sulit menangani error di setiap lapisan', 'Alur logika menjadi membandel', 'Sulit melakukan debug'] },
    { t: 'tip', x: 'Gunakan Promise dan async/await untuk menghindari callback hell dan membuat kode asynchronous lebih linear.' },
  ], 3],
  // --- modul-dan-npm ---
  ['modul-dan-npm', 'Mengelola Paket dengan npm', [
    { t: 'p', x: 'npm adalah manajer paket bawaan Node.js. Kamu dapat menginstal, memperbarui, dan menghapus pustaka pihak ketiga dengan perintah npm install dan npm uninstall.' },
    { t: 'code', lang: 'bash', x: 'npm install express\\nnpm install lodash --save\\nnpm uninstall paket lama\\nnpm list' },
    { t: 'list', items: ['npm install menambahkan paket ke proyek', 'package.json mencatat semua dependensi', 'node_modules menyimpan file paket yang diinstal', 'npm outdated memeriksa paket yang perlu diperbarui'] },
    { t: 'tip', x: 'Jangan commit folder node_modules ke Git. Tambahkan ke .gitignore dan biarkan orang lain menjalankan npm install.' },
  ], 3],
  ['modul-dan-npm', 'package.json dan package-lock.json', [
    { t: 'p', x: 'package.json adalah manifest proyek yang mencatat nama, versi, skrip, dan dependensi. package.lock.json mengunci versi dependensi agar instalasi konsisten di semua mesin.' },
    { t: 'code', lang: 'json', x: '{\\n  \"name\": \"aplikasi-saya\",\\n  \"version\": \"1.0.0\",\\n  \"dependencies\": {\\n    \"express\": \"^4.18.2\"\\n  },\\n  \"scripts\": {\\n    \"start\": \"node index.js\"\\n  }\\n}' },
    { t: 'tip', x: 'Selalu commit package-lock.json ke Git untuk memastikan semua pengembang menggunakan versi paket yang sama.' },
  ], 3],
  ['modul-dan-npm', 'Skrip npm', [
    { t: 'p', x: 'Skrip di package.json memungkinkan kamu menjalankan perintah umum dengan satu perintah pendek, seperti npm start untuk menjalankan server atau npm dev untuk pengembangan.' },
    { t: 'code', lang: 'json', x: '"scripts": {\\n  \"start\": \"node index.js\",\\n  \"dev\": \"nodemon index.js\",\\n  \"test\": \"jest\"\\n}' },
    { t: 'tip', x: 'Gunakan nodemon selama pengembangan agar server restart otomatis saat file berubah.' },
  ], 3],
  ['modul-dan-npm', 'Kesalahan Umum: Modul Tidak Ditemukan', [
    { t: 'p', x: 'Error \"module not found\" biasanya terjadi karena paket belum diinstal atau path impor salah. Pastikan npm install telah dijalankan dan nama paket benar.' },
    { t: 'list', items: ['Paket belum diinstal (jalankan npm install)', 'Nama paket salah ditulis', 'Path impor tidak benar', 'Folder node_modules dihapus'] },
    { t: 'tip', x: 'Hapus node_modules dan package-lock.json, lalu jalankan npm install lagi jika masalah berlanjut.' },
  ], 3],
  // --- rest-api ---
  ['rest-api', 'Membangun REST API dengan Express', [
    { t: 'p', x: 'Express adalah framework web untuk Node.js yang memudahkan pembuatan REST API. Kamu dapat mendefinisikan route untuk menangani permintaan HTTP seperti GET, POST, PUT, dan DELETE.' },
    { t: 'code', lang: 'js', x: 'const express = require(\"express\");\\nconst app = express();\\napp.use(express.json());\\n\\napp.get(\"/sapa\", (req, res) => {\\n  res.json({ pesan: \"Halo!\" });\\n});\\n\\napp.listen(3000, () => console.log(\"Server di port 3000\"));' },
    { t: 'list', items: ['GET untuk mengambil data', 'POST untuk membuat data baru', 'PUT untuk memperbarui data', 'DELETE untuk menghapus data'] },
    { t: 'tip', x: 'Express memerlukan app.use(express.json()) untuk dapat membaca body permintaan dalam format JSON.' },
  ], 4],
  ['rest-api', 'Route dan Parameter', [
    { t: 'p', x: 'Route dapat menerima parameter dinamis dari URL, misalnya ID pengguna atau produk. Parameter diakses melalui req.params di Express.' },
    { t: 'code', lang: 'js', x: 'app.get(\"/pengguna/:id\", (req, res) => {\\n  const id = req.params.id;\\n  res.json({ id, nama: \"Pengguna \" + id });\\n});' },
    { t: 'list', items: ['Gunakan titik dua (:) untuk menandai parameter route', 'Akses parameter melalui req.params.namaParameter', 'Parameter bersifat string di URL', 'Gunakan query string untuk filter tambahan: ?halaman=1'] },
    { t: 'tip', x: 'Validasi parameter sebelum menggunakannya untuk mencegah error atau kerentanan keamanan.' },
  ], 3],
  ['rest-api', 'Mengirim dan Menerima JSON', [
    { t: 'p', x: 'REST API umumnya bertukar data dalam format JSON. Express menyediakan res.json() untuk mengirim JSON dan express.json() untuk membaca JSON dari permintaan.' },
    { t: 'code', lang: 'js', x: 'app.post(\"/pengguna\", (req, res) => {\\n  const data = req.body;\\n  res.status(201).json({ sukses: true, data });\\n});' },
    { t: 'tip', x: 'Selalu sertakan status code yang tepat: 200 untuk sukses, 201 untuk dibuat, 400 untuk kesalahan klien, 500 untuk kesalahan server.' },
  ], 3],
  ['rest-api', 'Kesalahan Umum: Lupa Middleware JSON', [
    { t: 'p', x: 'Tanpa app.use(express.json()), Express tidak bisa membaca body permintaan JSON dan req.body akan undefined. Ini menyebabkan error saat menangani POST atau PUT.' },
    { t: 'list', items: ['Lupa menambahkan express.json()', 'Mengirim data bukan JSON dari klien', 'Mengakses req.body sebelum middleware dijalankan', 'Tidak mengatur header Content-Type: application/json'] },
    { t: 'tip', x: 'Tempatkan app.use(express.json()) sebelum definisi route yang membutuhkan body JSON.' },
  ], 3],
  // --- database-koneksi ---
  ['database-koneksi', 'Koneksi ke Database', [
    { t: 'p', x: 'Node.js dapat terhubung ke berbagai database, termasuk PostgreSQL, MySQL, MongoDB, dan SQLite. Gunakan driver atau ORM yang sesuai dengan database yang kamu pilih.' },
    { t: 'code', lang: 'js', x: 'const { Pool } = require(\"pg\");\\nconst pool = new Pool({\\n  user: \"postgres\",\\n  host: \"localhost\",\\n  database: \"eduverse\",\\n  password: \"rahasia\",\\n  port: 5432,\\n});\\n\\npool.query(\"SELECT * FROM kursus\", (err, res) => {\\n  console.log(res.rows);\\n});' },
    { t: 'list', items: ['Pilih driver sesuai database (pg untuk PostgreSQL)', 'Konfigurasi host, port, nama database, pengguna, dan kata sandi', 'Gunakan connection pool untuk efisiensi', 'Tutup koneksi saat tidak diperlukan'] },
    { t: 'tip', x: 'Jangan simpan kata sandi database langsung dalam kode. Gunakan variabel lingkungan.' },
  ], 3],
  ['database-koneksi', 'Query Parameterized', [
    { t: 'p', x: 'Gunakan query parameterized untuk mencegah SQL Injection. Jangan gabungkan input pengguna langsung ke dalam string query SQL.' },
    { t: 'code', lang: 'js', x: `// Tidak aman
pool.query("SELECT * FROM pengguna WHERE nama = '" + input + "'");

// Aman (parameterized)
pool.query("SELECT * FROM pengguna WHERE nama = $1", [input]);` },
    { t: 'tip', x: 'Parameterized query memisahkan perintah SQL dari data input, sehingga input tidak dapat dijalankan sebagai perintah.' },
  ], 3],
  ['database-koneksi', 'Kesalahan Umum: SQL Injection', [
    { t: 'p', x: 'SQL Injection terjadi ketika input pengguna dimasukkan langsung ke query SQL, memungkinkan penyerang mengakses atau merusak database.' },
    { t: 'list', items: ['Menggabungkan input ke string query', 'Tidak memvalidasi input pengguna', 'Menggunakan query dinamis tanpa parameter', 'Memberikan akses penuh database ke aplikasi'] },
    { t: 'tip', x: 'Selalu gunakan parameterized query atau ORM yang menangani escaping otomatis.' },
  ], 3],
  // --- php-dasar ---
  ['php-apa-itu', 'Apa itu PHP', [
    { t: 'p', x: 'PHP adalah bahasa skrip sisi server yang populer untuk pengembangan web. PHP dijalankan di server dan mengirim hasil HTML ke browser.' },
    { t: 'list', items: ['Berjalan di server, bukan browser', 'Cocok untuk pembuatan halaman web dinamis', 'Bersembunyi di balik HTML yang dikirim ke browser', 'Banyak digunakan dalam WordPress dan Laravel'] },
    { t: 'tip', x: 'File PHP biasanya memiliki akhiran .php dan dieksekusi oleh server web yang mendukung PHP.' },
  ], 3],
  ['php-apa-itu', 'Menginstal PHP', [
    { t: 'p', x: 'Instal PHP bersama server web seperti Apache atau Nginx. Untuk pengembangan lokal, gunakan paket seperti XAMPP, WAMP, atau Laravel Sail yang sudah memuat PHP, database, dan server web.' },
    { t: 'code', lang: 'bash', x: '# Contoh di Linux\\nsudo apt install php apache2\\n\\n# Atau gunakan XAMPP untuk Windows/Mac/Linux' },
    { t: 'list', items: ['Unduh XAMPP dari situs resmi', 'Instal dan jalankan Apache serta MySQL', 'Simpan file PHP di folder htdocs', 'Akses melalui http://localhost/nama-file.php'] },
    { t: 'tip', x: 'Gunakan php -v di terminal untuk memeriksa versi PHP yang terinstal.' },
  ], 3],
  ['php-apa-itu', 'Sintaks Dasar PHP', [
    { t: 'p', x: 'Kode PHP ditulis di antara tag <?php dan ?>. Variabel dalam PHP dimulai dengan tanda dolar ($), dan setiap akhir pernyataan diakhiri dengan titik koma (;).' },
    { t: 'code', lang: 'php', x: '<?php\\n$nama = \"Rafi\";\\n$umur = 20;\\necho \"Halo, nama saya \" . $nama;\\n\\nif ($umur >= 17) {\\n  echo \" Sudah dewasa\";\\n} else {\\n  echo \" Belum dewasa\";\\n}\\n?>' },
    { t: 'list', items: ['Variabel dimulai dengan $', 'Setiap pernyataan diakhiri dengan ;', 'String dapat digabung dengan titik (.)', 'echo untuk mencetak output ke browser'] },
    { t: 'tip', x: 'Tag penutup ?> boleh diabaikan di file yang hanya berisi kode PHP untuk mencegah spasi di luar sengaja.' },
  ], 3],
  ['php-apa-itu', 'Kesalahan Umum: Lupa Titik Koma', [
    { t: 'p', x: 'PHP sangat sensitif terhadap titik koma di akhir setiap pernyataan. Melupakan titik koma akan menyebabkan error sintaks dan skrip tidak akan berjalan.' },
    { t: 'list', items: ['Lupa titik koma di akhir baris', 'Tanda kurung kurawal tidak seimbang', 'Variabel tanpa tanda dolar', 'Kutipan string tidak pasangan'] },
    { t: 'tip', x: 'Aktifkan error_reporting di development untuk melihat pesan error yang membantu debugging.' },
  ], 3],
  // --- variabel-dan-fungsi ---
  ['variabel-dan-fungsi', 'Variabel dan Tipe Data', [
    { t: 'p', x: 'PHP memiliki beberapa tipe data: string, int, float, boolean, array, object, null, dan resource. Tipe data biasanya ditentukan otomatis berdasarkan nilai yang diassign.' },
    { t: 'code', lang: 'php', x: '<?php\\n$nama = \"Rafi\";        // string\\n$umur = 20;            // int\\n$nilai = 85.5;         // float\\n$aktif = true;         // boolean\\n$hobi = array(\"coding\", \"membaca\"); // array\\n?>' },
    { t: 'list', items: ['string untuk teks', 'int untuk bilangan bulat', 'float untuk bilangan desimal', 'boolean untuk benar/salah', 'array untuk kumpulan nilai'] },
    { t: 'tip', x: 'Gunakan var_dump() untuk melihat tipe dan nilai variabel saat debugging.' },
  ], 3],
  ['variabel-dan-fungsi', 'Operator dan Percabangan', [
    { t: 'p', x: 'PHP mendukung operator aritmatika, perbandingan, logika, dan assignment. Percabangan menggunakan if, else if, else, dan switch.' },
    { t: 'code', lang: 'php', x: '<?php\\n$nilai = 75;\\nif ($nilai >= 85) {\\n  echo \"A\";\\n} elseif ($nilai >= 70) {\\n  echo \"B\";\\n} else {\\n  echo \"C\";\\n}\\n?>' },
    { t: 'list', items: ['if untuk kondisi tunggal', 'elseif untuk kondisi tambahan', 'else untuk kasus default', 'switch untuk banyak pilihan berdasarkan satu variabel'] },
    { t: 'tip', x: 'Gunakan === untuk perbandingan yang memeriksa tipe dan nilai, bukan == yang melakukan konversi tipe.' },
  ], 3],
  ['variabel-dan-fungsi', 'Fungsi', [
    { t: 'p', x: 'Fungsi dalam PHP adalah blok kode yang dapat dipanggil berulang kali. Fungsi dapat menerima parameter dan mengembalikan nilai.' },
    { t: 'code', lang: 'php', x: '<?php\\nfunction sapa($nama) {\\n  return \"Halo, \" . $nama;\\n}\\n\\necho sapa(\"Rafi\"); // Halo, Rafi\\n?>' },
    { t: 'list', items: ['function untuk mendefinisikan fungsi', 'Parameter di dalam tanda kurung', 'return untuk mengembalikan nilai', 'Panggil fungsi dengan nama dan argumen'] },
    { t: 'tip', x: 'Berikan nama fungsi yang menggambarkan apa yang dilakukan, misal hitungTotal atau cekLogin.' },
  ], 3],
  ['variabel-dan-fungsi', 'Kesalahan Umum: Variabel Tidak Didefinisikan', [
    { t: 'p', x: 'Mengakses variabel yang belum didefinisikan akan menghasilkan peringatan PHP. Pastikan variabel sudah diinisialisasi sebelum digunakan.' },
    { t: 'list', items: ['Mengakses variabel sebelum diassign', 'Typo dalam nama variabel', 'Variabel berada di luar cakupan (scope)', 'Mengakses indeks array yang tidak ada'] },
    { t: 'tip', x: 'Gunakan isset() untuk memeriksa apakah variabel sudah diinisialisasi sebelum diakses.' },
  ], 3],

// --- laravel-dasar ---
  ['laravel-apa-itu', 'Apa itu Laravel', [
    { t: 'p', x: 'Laravel adalah framework PHP modern untuk pengembangan web. Laravel menyediakan alat bawaan untuk routing, database (Eloquent), templating (Blade), dan autentikasi, sehingga pembuatan aplikasi menjadi lebih cepat dan terstruktur.' },
    { t: 'list', items: ['MVC (Model-View-Controller)', 'Eloquent ORM untuk database', 'Blade templating engine', 'Routing yang ekspresif', 'Autentikasi bawaan', 'Migrasi database'] },
    { t: 'tip', x: 'Laravel adalah salah satu framework PHP paling populer dan banyak digunakan dalam industri.' },
  ], 3],
  ['laravel-apa-itu', 'Menginstal Laravel', [
    { t: 'p', x: 'Laravel memerlukan PHP dan Composer. Composer adalah manajer dependensi untuk PHP, mirip seperti npm untuk Node.js.' },
    { t: 'code', lang: 'bash', x: 'composer create-project laravel/laravel belajar-laravel\\ncd belajar-laravel\\nphp artisan serve' },
    { t: 'list', items: ['Instal PHP dan Composer', 'Jalankan composer create-project laravel/laravel nama-proyek', 'Masuk ke folder proyek', 'Jalankan php artisan serve untuk server pengembangan'] },
    { t: 'tip', x: 'php artisan adalah command-line tool bawaan Laravel untuk berbagai tugas pengembangan.' },
  ], 3],
  ['laravel-apa-itu', 'Arsitektur MVC', [
    { t: 'p', x: 'MVC membagi aplikasi menjadi tiga bagian: Model (data dan logika bisnis), View (tampilan), dan Controller (penghubung antara Model dan View).' },
    { t: 'list', items: ['Model: mengelola data dan berinteraksi dengan database', 'View: menampilkan tampilan kepada pengguna', 'Controller: menerima request, memproses, dan mengirim response', 'Memisahkan tanggung jawab agar kode mudah dirawat'] },
    { t: 'tip', x: 'Jangan menaruh logika bisnis terlalu banyak di Controller. Pindahkan ke Model atau Service.' },
  ], 3],
  ['laravel-apa-itu', 'Kesalahan Umum: Lupa Menjalankan Migrasi', [
    { t: 'p', x: 'Migrasi adalah cara Laravel untuk membuat dan mengubah struktur database. Jika lupa menjalankan php artisan migrate, tabel tidak akan dibuat dan aplikasi akan error saat mengakses database.' },
    { t: 'list', items: ['Lupa jalankan php artisan migrate', 'Migrasi tidak cocok dengan struktur database', 'Mengubah tabel secara manual tanpa migrasi', 'Tidak mencatat migrasi dalam kontrol versi'] },
    { t: 'tip', x: 'Selalu jalankan migrasi setelah clone proyek atau menambahkan migrasi baru.' },
  ], 3],
  // --- eloquent-dan-blade ---
  ['eloquent-dan-blade', 'Eloquent ORM', [
    { t: 'p', x: 'Eloquent adalah ORM bawaan Laravel yang memungkinkan kamu berinteraksi dengan database menggunakan sintaks PHP, bukan query SQL mentah.' },
    { t: 'code', lang: 'php', x: 'use App\Models\\Siswa;\\n\\n$siswa = Siswa::all();\\n$siswaBaru = Siswa::create([\\n  \"nama\" => \"Rafi\",\\n  \"email\" => \"rafi@example.com\",\\n]);\\n\\n$siswaDitemukan = Siswa::find(1);' },
    { t: 'list', items: ['Setiap tabel database memiliki Model yang sesuai', 'Eloquent menangani query SQL secara otomatis', 'Relasi antar tabel didefinisikan di Model', 'Hasil query adalah objek, bukan array mentah'] },
    { t: 'tip', x: 'Eloquent membuat kode database lebih mudah dibaca dan dipelihara dibanding query SQL mentah.' },
  ], 4],
  ['eloquent-dan-blade', 'Relasi Antar Model', [
    { t: 'p', x: 'Eloquent mendukung berbagai relasi: one-to-one, one-to-many, dan many-to-many. Relasi memungkinkan pengambilan data terkait dengan mudah.' },
    { t: 'code', lang: 'php', x: '// Siswa punya banyak nilai\\nclass Siswa extends Model {\\n  public function nilai() {\\n    return $this->hasMany(Nilai::class);\\n  }\\n}\\n\\n// Mengakses nilai siswa\\n$siswa = Siswa::find(1);\\n$nilaiSiswa = $siswa->nilai;' },
    { t: 'tip', x: 'Gunakan eager loading (with) untuk mengambil data terkait sekaligus dan menghindari N+1 query problem.' },
  ], 3],
  ['eloquent-dan-blade', 'Blade Templating', [
    { t: 'p', x: 'Blade adalah mesin templating Laravel. Blade memungkinkan kamu menulis HTML dengan direktif PHP yang ringkas, seperti @if, @foreach, dan @extends.' },
    { t: 'code', lang: 'php', x: '{{-- layout.blade.php --}}\\n<html>\\n  <body>@yield(\"konten\")</body>\\n</html>\\n\\n{{-- halaman.blade.php --}}\\n@extends(\"layout\")\\n@section(\"konten\")\\n  <h1>Selamat Datang</h1>\\n@endsection' },
    { t: 'list', items: ['@extends untuk mewarisi tata letak', '@section untuk mendefinisikan bagian konten', '@yield untuk menampilkan bagian konten', '@if dan @foreach untuk logika di tampilan'] },
    { t: 'tip', x: 'Gunakan double kurung kurawal {{ }} untuk mencetak variabel dengan otomatis di-escape (amankan dari XSS).' },
  ], 3],
  ['eloquent-dan-blade', 'Kesalahan Umum: N+1 Query Problem', [
    { t: 'p', x: 'N+1 terjadi ketika aplikasi menjalankan satu query untuk mengambil data utama, lalu query tambahan untuk setiap item terkait. Ini membuat aplikasi lama saat data banyak.' },
    { t: 'list', items: ['Mengakses relasi dalam perulangan tanpa eager loading', 'Setiap item memicu query database terpisah', 'Jumlah query bertambah seiring jumlah data', 'Kinerja aplikasi menurun drastis'] },
    { t: 'tip', x: 'Gunakan Siswa::with(\"nilai\")->get() untuk memuat relasi sekaligus dalam satu query.' },
  ], 3],
  // --- routing-dan-migrasi ---
  ['routing-dan-migrasi', 'Routing Laravel', [
    { t: 'p', x: 'Routing menentukan bagaimana aplikasi merespons permintaan HTTP berdasarkan URL dan metode. Di Laravel, route didefinisikan di file routes/web.php atau routes/api.php.' },
    { t: 'code', lang: 'php', x: 'Route::get(\"/sapa\", function () {\\n  return \"Halo!\\";\\n});\\n\\nRoute::get(\"/pengguna/{id}\", [PenggunaController::class, \"tampilkan\"]);\\n\\nRoute::post(\"/pengguna\", [PenggunaController::class, \"simpan\"]);' },
    { t: 'list', items: ['Route::get untuk pengambilan data', 'Route::post untuk pembuatan data', 'Route::put untuk pembaruan', 'Route::delete untuk penghapusan'] },
    { t: 'tip', x: 'Gunakan controller untuk mengatur logika agar route file tidak menjadi terlalu panjang.' },
  ], 3],
  ['routing-dan-migrasi', 'Migrasi Database', [
    { t: 'p', x: 'Migrasi adalah versi kontrol untuk struktur database. Setiap migrasi berisi instruksi untuk membuat atau mengubah tabel, dan dapat dijalankan atau dibatalkan secara berurutan.' },
    { t: 'code', lang: 'php', x: 'php artisan make:migration buat_tabel_siswa\\n\\npublic function up() {\\n  Schema::create(\"siswa\", function (Blueprint $table) {\\n    $table->id();\\n    $table->string(\"nama\");\\n    $table->string(\"email\")->unique();\\n    $table->timestamps();\\n  });\\n}' },
    { t: 'list', items: ['php artisan make:migration untuk membuat migrasi baru', 'php artisan migrate untuk menjalankan migrasi', 'php artisan migrate:rollback untuk membatalkan migrasi terakhir', 'Migrasi disimpan dalam folder database/migrations'] },
    { t: 'tip', x: 'Selalu buat migrasi untuk setiap perubahan struktur database, jangan mengubah tabel secara manual.' },
  ], 3],
  ['routing-dan-migrasi', 'Kesalahan Umum: Nama Tabel Tidak Cocok', [
    { t: 'p', x: 'Eloquent secara otomatis mengasosiasikan model dengan tabel dalam bentuk jamak huruf kecil dari nama model. Jika nama tabel tidak sesuai, model akan mencari tabel yang salah.' },
    { t: 'list', items: ['Model Siswa mencari tabel siswas secara otomatis', 'Gunakan properti $table untuk menentukan nama tabel secara manual', 'Nama tabel dalam huruf kecil dan jamak', 'Pastikan migrasi membuat tabel dengan nama yang sama'] },
    { t: 'tip', x: 'Jika ingin nama tabel berbeda, tentukan secara eksplisit: protected $table = \"data_siswa\";' },
  ], 3],
  // --- proyek-mini (laravel) ---
  ['proyek-mini', 'Proyek Mini: Blog Sederhana', [
    { t: 'p', x: 'Buat blog sederhana menggunakan Laravel. Kamu akan menerapkan routing, controller, Eloquent, Blade, dan migrasi dalam satu proyek nyata.' },
    { t: 'list', items: ['Buat model dan migrasi untuk tabel postingan', 'Buat controller untuk mengelola postingan', 'Buat route untuk halaman daftar dan detail postingan', 'Buat tampilan Blade untuk menampilkan postingan', 'Tambahkan fitur membuat, mengedit, dan menghapus postingan'] },
    { t: 'code', lang: 'php', x: 'php artisan make:model Postingan -m\\nphp artisan make:controller PostinganController --resource' },
    { t: 'tip', x: 'Gunakan flag --resource pada controller untuk menghasilkan semua metode CRUD secara otomatis.' },
  ], 5],
  // --- codeigniter-dasar ---
  ['ci-apa-itu', 'Apa itu CodeIgniter', [
    { t: 'p', x: 'CodeIgniter adalah framework PHP yang ringan dan cepat, cocok untuk pemula. CodeIgniter tidak mewajibkan struktur yang ketat dan mudah dipelajari untuk yang baru pertama kali belajar framework PHP.' },
    { t: 'list', items: ['Ringan dan cepat', 'Tidak memerlukan konfigurasi berlebihan', 'Cocok untuk pemula', 'MVC yang sederhana', 'Dokumentasi yang baik'] },
    { t: 'tip', x: 'CodeIgniter cocok untuk proyek kecil hingga menengah yang membutuhkan kecepatan dan kesederhanaan.' },
  ], 3],
  ['ci-apa-itu', 'Menginstal CodeIgniter', [
    { t: 'p', x: 'CodeIgniter dapat diinstal melalui Composer atau dengan mengunduh langsung dari situs resmi. Pastikan PHP dan server web sudah terinstal.' },
    { t: 'code', lang: 'bash', x: 'composer create-project codeigniter4/appstarter belajar-ci\\ncd belajar-ci\\nphp spark serve' },
    { t: 'list', items: ['Instal PHP dan Composer', 'Jalankan composer create-project codeigniter4/appstarter nama-proyek', 'Masuk ke folder proyek', 'Jalankan php spark serve untuk server pengembangan'] },
    { t: 'tip', x: 'php spark adalah command-line tool bawaan CodeIgniter 4.' },
  ], 3],
  ['ci-apa-itu', 'MVC di CodeIgniter', [
    { t: 'p', x: 'CodeIgniter mengikuti pola MVC: Model mengelola data, View menampilkan tampilan, dan Controller mengatur alur aplikasi.' },
    { t: 'list', items: ['Controller menerima permintaan dari browser', 'Model berinteraksi dengan database', 'View menampilkan hasil kepada pengguna', 'Pemisahan antara logika dan tampilan'] },
    { t: 'tip', x: 'Rename file Controller dengan huruf besar awal, misal Selamat.php, bukan selamat.php.' },
  ], 3],
  ['ci-apa-itu', 'Kesalahan Umum: Case Sensitivity', [
    { t: 'p', x: 'Pada sistem operasi Linux, nama file bersifat case-sensitive. Nama file Controller dan Model harus sesuai dengan cara mereka dipanggil di route dan pemanggilan.' },
    { t: 'list', items: ['Nama file tidak sesuai dengan nama class', 'Controller dipanggil dengan huruf yang salah', 'File model tidak ada di folder yang benar', 'Namespace tidak cocok'] },
    { t: 'tip', x: 'Selalu pastikan nama file, nama class, dan namespace sesuai persis.' },
  ], 3],
  // --- mvc-dasar ---
  ['mvc-dasar', 'Controller dan Route', [
    { t: 'p', x: 'Controller di CodeIgniter menangani permintaan HTTP dan mengembalikan response. Route menghubungkan URL dengan metode di controller.' },
    { t: 'code', lang: 'php', x: '<?php\\nnamespace App\\Controllers;\\n\\nclass Selamat extends BaseController {\\n  public function index() {\\n    return view(\"selamat\");\\n  }\\n}\\n?>' },
    { t: 'list', items: ['Controller mewarisi BaseController', 'Setiap metode publik dapat diakses lewat URL', 'Gunakan return view() untuk menampilkan tampilan', 'Route didefinisikan di app/Config/Routes.php'] },
    { t: 'tip', x: 'Gunakan $this->request untuk mengakses data dari permintaan HTTP, seperti form data atau query parameter.' },
  ], 3],
  ['mvc-dasar', 'View dan Tampilan', [
    { t: 'p', x: 'View di CodeIgniter adalah file HTML yang dapat berisi kode PHP. View ditampilkan melalui controller dengan fungsi view().' },
    { t: 'code', lang: 'php', x: '<!-- app/Views/selamat.php -->\\n<!DOCTYPE html>\\n<html>\\n<head><title>Selamat Datang</title></head>\\n<body>\\n  <h1><?= esc($judul) ?></h1>\\n</body>\\n</html>' },
    { t: 'list', items: ['File View disimpan di folder app/Views', 'Gunakan view(\"nama_file\") untuk menampilkan', 'Variabel dapat dikirim dari controller ke view', 'Gunakan esc() untuk mencegah XSS'] },
    { t: 'tip', x: 'Selalu gunakan esc() saat mencetak variabel dari pengguna untuk mencegah serangan XSS.' },
  ], 3],
  ['mvc-dasar', 'Model dan Database', [
    { t: 'p', x: 'Model di CodeIgniter berinteraksi dengan database. CodeIgniter menyediakan Query Builder yang memudahkan operasi database tanpa menulis SQL mentah.' },
    { t: 'code', lang: 'php', x: '<?php\\nnamespace App\\Models;\\n\\nuse CodeIgniter\\Model;\\n\\nclass SiswaModel extends Model {\\n  protected $table = \"siswa\";\\n  protected $allowedFields = [\"nama\", \"email\"];\\n}\\n?>' },
    { t: 'list', items: ['Model mewarisi CodeIgniter\\Model', 'Tentukan $table untuk nama tabel', 'Tentukan $allowedFields untuk kolom yang boleh diisi', 'Gunakan Query Builder untuk query database'] },
    { t: 'tip', x: '$allowedFields mencegah mass assignment vulnerability dengan membatasi kolom yang bisa diisi.' },
  ], 3],
  ['mvc-dasar', 'Kesalahan Umum: Lupa esc() pada Output', [
    { t: 'p', x: 'Mencetak variabel pengguna tanpa esc() dapat menyebabkan serangan XSS, di mana penyerang menyisipkan skrip berbahaya ke halaman.' },
    { t: 'list', items: ['Mencetak variabel langsung tanpa esc()', 'Mengizinkan input HTML dari pengguna tanpa filter', 'Tidak membersihkan data sebelum disimpan', 'Mengizinkan skrip dalam komentar atau formulir'] },
    { t: 'tip', x: 'Selalu gunakan esc() untuk output dan validasi input untuk keamanan.' },
  ], 3],
  // --- query-builder ---
  ['query-builder', 'Query Builder CodeIgniter', [
    { t: 'p', x: 'Query Builder CodeIgniter menyediakan metode untuk melakukan operasi database (select, insert, update, delete) tanpa menulis SQL mentah, sehingga kode lebih portabel dan aman.' },
    { t: 'code', lang: 'php', x: '$builder = $this->db->table(\"siswa\");\\n$siswa = $builder->get()->getResult();\\n\\n$builder->where(\"id\", 1);\\n$siswa = $builder->get()->getRow();' },
    { t: 'list', items: ['get() untuk mengambil data', 'insert() untuk menambah data', 'update() untuk memperbarui data', 'delete() untuk menghapus data', 'where() untuk menyaring data'] },
    { t: 'tip', x: 'Query Builder otomatis menangani escaping, sehingga membantu mencegah SQL Injection.' },
  ], 3],
  ['query-builder', 'Mengambil Data dengan Query Builder', [
    { t: 'p', x: 'Gunakan getResult() untuk mengambil semua data sebagai array objek, getRow() untuk satu baris, dan getFirstRow() untuk baris pertama.' },
    { t: 'code', lang: 'php', x: '$builder = $this->db->table(\"siswa\");\\n$semua = $builder->get()->getResult();\\n$satu = $builder->where(\"id\", 5)->get()->getRow();\\n$pertama = $builder->orderBy(\"id\", \"ASC\")->get()->getFirstRow();' },
    { t: 'tip', x: 'Gunakan getRow() jika hanya butuh satu data, dan getResult() untuk banyak data.' },
  ], 3],
  ['query-builder', 'Menambah dan Memperbarui Data', [
    { t: 'p', x: 'insert() digunakan untuk menambah data baru ke tabel, sedangkan update() digunakan untuk memperbarui data yang sudah ada berdasarkan kondensi.' },
    { t: 'code', lang: 'php', x: '$this->db->table(\"siswa\")->insert([\\n  \"nama\" => \"Rafi\",\\n  \"email\" => \"rafi@example.com\"\\n]);\\n\\n$this->db->table(\"siswa\")\\n  ->where(\"id\", 1)\\n  ->update([\"nama\" => \"Rafi Updated\"]);' },
    { t: 'list', items: ['insert() untuk menambah data', 'update() untuk memperbarui data', 'where() untuk menentukan baris yang diperbarui', 'Gunakan $allowedFields di Model untuk keamanan'] },
    { t: 'tip', x: 'Selalu sertakan where() saat update agar tidak memperbarui seluruh tabel secara tidak sengaja.' },
  ], 3],
  ['query-builder', 'Kesalahan Umum: Lupa where pada Update', [
    { t: 'p', x: 'Memanggil update() tanpa where() akan memperbarui semua baris di tabel, bukan hanya satu baris yang diinginkan. Ini dapat menyebabkan kehilangan data secara massal.' },
    { t: 'list', items: ['Memanggil update tanpa where', 'Mengupdate semua baris tanpa sengaja', 'Tidak memeriksa apakah data ditemukan sebelum update', 'Menggunakan ID yang salah dalam where'] },
    { t: 'tip', x: 'Selalu sertakan where() dengan ID atau kondisi unik sebelum memanggil update().' },
  ], 3],
  // --- proyek-mini (ci) ---
  ['proyek-mini', 'Proyek Mini: Manajemen Kontak', [
    { t: 'p', x: 'Buat aplikasi manajemen kontak sederhana menggunakan CodeIgniter. Kamu akan menerapkan MVC, Query Builder, dan validasi input dalam satu proyek nyata.' },
    { t: 'list', items: ['Buat model dan migrasi untuk tabel kontak', 'Buat controller untuk mengelola kontak', 'Buat route untuk halaman daftar, tambah, edit, dan hapus', 'Buat tampilan untuk formulir dan daftar kontak', 'Tambahkan validasi input sebelum menyimpan kontak'] },
    { t: 'code', lang: 'bash', x: 'php spark make:model Kontak --database\\nphp spark make:controller Kontak' },
    { t: 'tip', x: 'Gunakan validasi bawaan CodeIgniter untuk memastikan data kontak lengkap dan benar sebelum disimpan.' },
  ], 5],

// --- android-dasar ---
  ['android-studio', 'Menginstal Android Studio', [
    { t: 'p', x: 'Android Studio adalah lingkungan pengembangan terintegrasi (IDE) resmi untuk membuat aplikasi Android. Unduh dari situs resmi Android Developer dan pilih versi yang cocok dengan sistem operasi komputermu.' },
    { t: 'code', lang: 'bash', x: '# Unduh Android Studio dari developer.android.com\\n# Jalankan installer dan ikuti petunjuk setup\\n# Pilih instalasi standar dan unduh komponen SDK yang diperlukan' },
    { t: 'list', items: ['Unduh Android Studio dari situs resmi', 'Jalankan installer dan pilih setup standar', 'Unduh Android SDK dan emulator yang disarankan', 'Buat proyek baru dengan template Empty Activity'] },
    { t: 'tip', x: 'Pilih versi stabil (stable) Android Studio agar fitur dan emulator berjalan lancar tanpa error berlebihan.' },
  ], 4],
  ['android-studio', 'Mengenal Antarmuka Android Studio', [
    { t: 'p', x: 'Android Studio terdiri dari jendela editor kode, jendela pratinjau tampilan (layout explorer), panel struktur proyek, dan toolbar untuk menjalankan aplikasi di emulator atau perangkat fisik.' },
    { t: 'list', items: ['Editor kode untuk menulis Kotlin atau Java', 'Layout editor untuk mengatur tampilan secara visual', 'Panel proyek untuk melihat semua file dan folder', 'Emulator untuk menguji aplikasi tanpa ponsel nyata'] },
    { t: 'tip', x: 'Gunakan split view untuk melihat kode XML dan pratinjau tampilan secara bersamaan saat mendesain layout.' },
  ], 3],
  ['android-studio', 'Kesalahan Umum: Emulator Lambat atau Tidak Bisa Dijalankan', [
    { t: 'p', x: 'Emulator Android memerlukan akselerasi perangkat keras (Intel HAXM atau Android Emulator Hypervisor Driver). Jika tidak diaktifkan, emulator akan sangat lambat atau tidak bisa dijalankan.' },
    { t: 'list', items: ['Akselerasi perangkat keras tidak diaktifkan di BIOS', 'Versi emulator yang tidak sesuai dengan Android Studio', 'Memori yang dialokasikan ke emulator terlalu kecil', 'Menggunakan perangkat fisik tanpa mengaktifkan USB debugging'] },
    { t: 'tip', x: 'Aktifkan virtualisasi di BIOS/UEFI komputer dan alokasikan minimal 2 GB RAM untuk emulator.' },
  ], 3],
  // --- kotlin-dasar ---
  ['kotlin-dasar', 'Apa itu Kotlin', [
    { t: 'p', x: 'Kotlin adalah bahasa pemrograman modern yang berjalan pada mesin Java (JVM) dan menjadi bahasa utama untuk pengembangan Android. Kotlin ringkas, aman null, dan kompatibel dengan Java.' },
    { t: 'list', items: ['Bahasa resmi untuk pengembangan Android', 'Aman null (null safety) mencegah error umum', 'Ringkas dibandingkan Java', 'Kompatibel dengan kode Java yang sudah ada'] },
    { t: 'tip', x: 'Kotlin dipilih Google sebagai bahasa prioritas Android sejak 2019.' },
  ], 3],
  ['kotlin-dasar', 'Variabel dan Tipe Data', [
    { t: 'p', x: 'Dalam Kotlin, gunakan val untuk nilai yang tidak dapat diubah (immutable) dan var untuk nilai yang dapat diubah (mutable). Tipe data biasanya dapat ditebak Kotlin secara otomatis.' },
    { t: 'code', lang: 'kotlin', x: 'val nama = \"Rafi\"         // tidak dapat diubah\\nvar umur = 20           // dapat diubah\\nval skor: Int = 100     // tipe ditulis secara eksplisit\\nval aktif: Boolean = true' },
    { t: 'tip', x: 'Selalu gunakan val secara default. Ubah ke var hanya jika nilai benar-benar perlu berubah.' },
  ], 3],
  ['kotlin-dasar', 'Fungsi', [
    { t: 'p', x: 'Fungsi dalam Kotlin didefinisikan dengan kata kunci fun. Fungsi dapat menerima parameter dan mengembalikan nilai dengan tipe yang jelas.' },
    { t: 'code', lang: 'kotlin', x: 'fun sapa(nama: String): String {\\n  return \"Halo, $nama\"\\n}\\n\\nfun tambah(a: Int, b: Int): Int {\\n  return a + b\\n}' },
    { t: 'tip', x: 'Gunakan template string (dengan $) untuk menyisipkan variabel ke dalam teks dengan mudah.' },
  ], 3],
  ['kotlin-dasar', 'Kesalahan Umum: NullPointerException', [
    { t: 'p', x: 'Kotlin mencegah NullPointerException dengan sistem null safety. Variabel yang bisa null harus ditandai dengan tanda tanya (?), dan kamu harus memeriksa nilainya sebelum digunakan.' },
    { t: 'list', items: ['Mengakses properti variabel yang mungkin null', 'Lupa menambahkan tanda ? pada tipe yang bisa null', 'Menggunakan operator !! secara sembarangan', 'Tidak memeriksa null sebelum memanggil fungsi'] },
    { t: 'tip', x: 'Gunakan operator aman (?.) untuk mengakses properti hanya jika variabel tidak null.' },
  ], 3],
  // --- layout-dan-activity ---
  ['layout-dan-activity', 'Activity dan Siklus Hidup', [
    { t: 'p', x: 'Activity adalah layar tunggal dalam aplikasi Android dengan antarmuka pengguna. Setiap activity memiliki siklus hidup: dibuat, dilanjutkan, dijeda, dihentikan, dan dihancurkan.' },
    { t: 'list', items: ['onCreate: activity pertama kali dibuat', 'onStart: activity terlihat oleh pengguna', 'onResume: activity berinteraksi dengan pengguna', 'onPause, onStop, onDestroy: activity ditutup atau dihapus'] },
    { t: 'tip', x: 'Simpan data sementara di onSaveInstanceState agar tidak hilang saat layar berputar.' },
  ], 4],
  ['layout-dan-activity', 'Layout XML Dasar', [
    { t: 'p', x: 'Layout Android ditulis dalam XML. View adalah elemen tampilan (tombol, teks, input), dan ViewGroup adalah wadah yang menyusun view lain (LinearLayout, ConstraintLayout).' },
    { t: 'code', lang: 'xml', x: '<LinearLayout\\n    android:layout_width=\"match_parent\"\\n    android:layout_height=\"match_parent\"\\n    android:orientation=\"vertical\">\\n    <TextView\\n        android:text=\"Halo, EduVerse\"\\n        android:layout_width=\"wrap_content\"\\n        android:layout_height=\"wrap_content\" />\\n</LinearLayout>' },
    { t: 'tip', x: 'ConstraintLayout lebih fleksibel dan efisien untuk tata letak kompleks dibanding LinearLayout bersarang.' },
  ], 3],
  ['layout-dan-activity', 'Menghubungkan Layout ke Activity', [
    { t: 'p', x: 'Di dalam onCreate activity, panggil setContentView() untuk menentukan layout XML yang akan ditampilkan. Gunakan findViewById() untuk mengakses elemen tampilan dari kode Kotlin.' },
    { t: 'code', lang: 'kotlin', x: 'override fun onCreate(savedInstanceState: Bundle?) {\\n    super.onCreate(savedInstanceState)\\n    setContentView(R.layout.activity_main)\\n    val teks = findViewById<TextView>(R.id.teks_sambutan)\\n    teks.text = \"Selamat belajar\"\\n}' },
    { t: 'tip', x: 'Pastikan id elemen di XML unik dalam satu layout agar findViewById tidak salah mencari.' },
  ], 3],
  ['layout-dan-activity', 'Kesalahan Umum: Lupa setContentView', [
    { t: 'p', x: 'Jika lupa memanggil setContentView() di onCreate, activity akan menampilkan layar kosong karena tidak ada layout yang dikaitkan.' },
    { t: 'list', items: ['Lupa memanggil setContentView di onCreate', 'Mengakses view sebelum layout diatur', 'ID view tidak cocok antara XML dan kode', 'Menghubungkan layout yang salah ke activity'] },
    { t: 'tip', x: 'setContentView harus dipanggil sebelum mengakses elemen tampilan dengan findViewById.' },
  ], 3],
  // --- publish-play-store ---
  ['publish-play-store', 'Mengonfigurasi Aplikasi untuk Rilis', [
    { t: 'p', x: 'Sebelum memublikasikan ke Play Store, konfigurasikan applicationId, versi aplikasi (versionCode dan versionName), dan tanda tangan (signing) dalam file build.gradle.' },
    { t: 'list', items: ['applicationId harus unik untuk setiap aplikasi', 'versionCode adalah angka versi internal yang naik setiap rilis', 'versionName adalah versi yang dilihat pengguna', 'Tanda tangan memastikan aplikasi aman dan milikmu'] },
    { t: 'tip', x: 'Naikkan versionCode setiap kali mengunggah versi baru ke Play Console.' },
  ], 3],
  ['publish-play-store', 'Membuat File AAB dan APK', [
    { t: 'p', x: 'Play Store menerima file Android App Bundle (.aab) yang dioptimalkan untuk setiap perangkat. APK (.apk) biasanya digunakan untuk pengujian atau distribusi langsung.' },
    { t: 'code', lang: 'bash', x: '# Membuat release bundle\\n./gradlew bundleRelease\\n\\n# File hasil ada di\\napp/build/outputs/bundle/release/app-release.aab' },
    { t: 'tip', x: 'Gunakan bundleRelease untuk rilis produksi karena ukuran unduhan lebih kecil per perangkat.' },
  ], 3],
  ['publish-play-store', 'Kesalahan Umum: Izin yang Tidak Digunakan', [
    { t: 'p', x: 'Menambahkan izin yang terlalu banyak di AndroidManifest.xml membuat pengguna ragu dan aplikasi lebih rentan. Hanya tambahkan izin yang benar-benar diperlukan.' },
    { t: 'list', items: ['Menambahkan izin kamera tanpa fitur kamera', 'Meminta izin lokasi selalu padahal tidak diperlukan', 'Tidak menjelaskan alasan izin kepada pengguna', 'Mengabaikan izin yang baru diperlukan Android versi terbaru'] },
    { t: 'tip', x: 'Minta izin saat runtime (saat fitur akan digunakan), bukan semua saat aplikasi pertama kali dibuka.' },
  ], 3],
  // --- ios-dasar ---
  ['xcode-dan-swift', 'Menginstal Xcode dan Swift', [
    { t: 'p', x: 'Xcode adalah IDE resmi Apple untuk pengembangan aplikasi iOS, iPadOS, macOS, watchOS, dan tvOS. Xcode hanya dapat dijalankan di macOS. Swift adalah bahasa pemrograman modern yang dipakai Apple.' },
    { t: 'list', items: ['Unduh Xcode dari Mac App Store', 'Instal command line tools jika diperlukan', 'Buat Apple ID untuk pengembang', 'Buat proyek baru dengan template iOS App'] },
    { t: 'tip', x: 'Xcode membutuhkan macOS. Tidak dapat diinstal di Windows atau Linux secara resmi.' },
  ], 3],
  ['xcode-dan-swift', 'Apa itu Swift', [
    { t: 'p', x: 'Swift adalah bahasa pemrograman yang aman, cepat, dan modern untuk ekosistem Apple. Swift menggantikan Objective-C sebagai bahasa utama pengembangan iOS dan macOS.' },
    { t: 'code', lang: 'swift', x: 'let nama = \"Rafi\"\\nvar umur = 20\\nfunc sapa(orang: String) -> String {\\n    return \"Halo, \\(orang)\"\\n}\\nprint(sapa(orang: nama))' },
    { t: 'tip', x: 'Swift menggunakan inferensi tipe, jadi kamu tidak selalu perlu menuliskan tipe data secara eksplisit.' },
  ], 3],
  ['xcode-dan-swift', 'Kesalahan Umum: Lupa Outlet dan Action', [
    { t: 'p', x: 'Interface Builder memungkinkan mengaitkan elemen tampilan ke kode melalui outlet dan action. Jika lupa membuat hubungan, elemen tidak dapat dikontrol dari kode Swift.' },
    { t: 'list', items: ['Lupa menghubungkan elemen tampilan ke outlet', 'Lupa menghubungkan tombol ke fungsi action', 'Nama outlet tidak cocok di kode dan storyboard', 'Menghubungkan ke view controller yang salah'] },
    { t: 'tip', x: 'Gunakan Ctrl+drag dari storyboard ke kode untuk membuat outlet dan action secara visual.' },
  ], 3],
  // --- swiftui-dasar ---
  ['swiftui-dasar', 'Mengenal SwiftUI', [
    { t: 'p', x: 'SwiftUI adalah framework modern Apple untuk membangun antarmuka pengguna di semua platform Apple dengan kode deklaratif. Kamu menggambarkan tampilan yang diinginkan, SwiftUI mengurus tampilannya.' },
    { t: 'code', lang: 'swift', x: 'struct ContentView: View {\\n    var body: some View {\\n        Text(\"Halo, EduVerse\")\\n    }\\n}' },
    { t: 'tip', x: 'SwiftUI tersedia pada iOS 13 dan versi lebih baru. Untuk versi lebih lama, gunakan UIKit.' },
  ], 3],
  ['swiftui-dasar', 'State dan Binding', [
    { t: 'p', x: '@State digunakan untuk menyimpan state sederhana di dalam tampilan. Saat state berubah, SwiftUI akan memperbarui tampilan secara otomatis. @Binding digunakan untuk berbagi state antar tampilan.' },
    { t: 'code', lang: 'swift', x: 'struct HitungView: View {\\n    @State private var jumlah = 0\\n    var body: some View {\\n        VStack {\\n            Text(\"Jumlah: \\\(jumlah)\")\\n            Button(\"Tambah\") { jumlah += 1 }\\n        }\\n    }\\n}' },
    { t: 'tip', x: 'Gunakan @State untuk state yang dimiliki tampilan, dan @Binding untuk state yang dibagikan dengan tampilan lain.' },
  ], 3],
  ['swiftui-dasar', 'Kesalahan Umum: Mengubah State Langsung', [
    { t: 'p', x: 'Di SwiftUI, state harus diubah melalui penugasan, bukan dengan memodifikasi objek secara langsung tanpa memberitahu SwiftUI. Ini bisa menyebabkan tampilan tidak memperbarui diri.' },
    { t: 'list', items: ['Mengubah properti struct tanpa @State', 'Memodifikasi array secara langsung tanpa memberitahu SwiftUI', 'Menggunakan variabel biasa untuk state tampilan', 'Mengabaikan peringatan pembaruan tampilan'] },
    { t: 'tip', x: 'Selalu gunakan @State, @Binding, atau @ObservedObject untuk data yang memengaruhi tampilan.' },
  ], 3],
  // --- navigasi-dan-layar ---
  ['navigasi-dan-layar', 'Navigasi Antar Layar', [
    { t: 'p', x: 'Navigasi memindahkan pengguna dari satu layar ke layar lain. Di SwiftUI, gunakan NavigationStack dan NavigationLink. Di UIKit, gunakan UINavigationController dan segue.' },
    { t: 'code', lang: 'swift', x: 'NavigationStack {\\n    NavigationLink(\"Buka Detail\") {\\n        DetailView()\\n    }\\n}' },
    { t: 'tip', x: 'NavigationStack tersedia pada iOS 16 dan versi lebih baru. Gunakan NavigationView untuk versi yang lebih lama.' },
  ], 3],
  ['navigasi-dan-layar', 'Mengirim Data Antar Layar', [
    { t: 'p', x: 'Saat berpindah layar, kamu sering perlu membawa data, misalnya ID produk yang dipilih. Kirim data melalui inisialisasi tampilan tujuan atau parameter navigasi.' },
    { t: 'code', lang: 'swift', x: 'NavigationLink(\"Lihat Produk\") {\\n    DetailView(produk: produkTerpilah)\\n}' },
    { t: 'tip', x: 'Hantar hanya data yang dibutuhkan tampilan tujuan, jangan seluruh objek yang besar dan tidak perlu.' },
  ], 3],
  ['navigasi-dan-layar', 'Kesalahan Umum: Navigasi Tanpa Kontainer', [
    { t: 'p', x: 'NavigationLink tidak akan berfungsi jika tidak berada di dalam NavigationStack atau NavigationView. Tanpa kontainer navigasi, klik tidak akan berpindah layar.' },
    { t: 'list', items: ['NavigationLink di luar NavigationStack', 'Lupa membungkus konten dengan navigasi', 'Menggunakan banyak NavigationStack di satu layar', 'Tidak menyediakan view tujuan yang valid'] },
    { t: 'tip', x: 'Letakkan NavigationStack di level paling atas aplikasi, biasanya di dalam App struct.' },
  ], 3],
  // --- app-store ---
  ['app-store', 'Mengunggah ke App Store', [
    { t: 'p', x: 'Untuk mempublikasikan aplikasi iOS, kamu membutuhkan Apple Developer Program. Unggah aplikasi melalui Xcode atau Transporter, lalu tinjau di App Store Connect sebelum dirilis.' },
    { t: 'list', items: ['Daftar Apple Developer Program (berbayar tahunan)', 'Buat App ID dan profil penyediaan di developer.apple.com', 'Unggah build melalui Xcode atau Transporter', 'Isi metadata aplikasi di App Store Connect'] },
    { t: 'tip', x: 'Pastikan aplikasi memenuhi pedoman Apple sebelum mengajukan tinjau agar tidak ditolak.' },
  ], 3],
  ['app-store', 'TestFlight untuk Pengujian Beta', [
    { t: 'p', x: 'TestFlight memungkinkan kamu membagikan aplikasi kepada penguji sebelum rilis resmi. Ini berguna untuk mendapatkan umpan balik dan mencari bug dari pengguna nyata.' },
    { t: 'list', items: ['Unggah build ke App Store Connect', 'Undang penguji melalui email atau link publik', 'Kumpulkan laporan crash dan umpan balik', 'Perbaiki bug sebelum rilis ke App Store'] },
    { t: 'tip', x: 'Gunakan Internal Testing untuk tim pengembang dan External Testing untuk pengguna di luar tim.' },
  ], 3],
  ['app-store', 'Kesalahan Umum: Metadata Tidak Lengkap', [
    { t: 'p', x: 'Apple akan menolak aplikasi jika deskripsi, tangkapan layar, atau kebijakan privasi tidak lengkap. Pastikan semua informasi diisi dengan benar sebelum mengajukan tinjau.' },
    { t: 'list', items: ['Deskripsi aplikasi kosong atau tidak informatif', 'Tangkapan layar tidak sesuai ukuran yang diperlukan', 'Kebijakan privasi tidak tersedia', 'Informasi kontak pengembang tidak lengkap'] },
    { t: 'tip', x: 'Siapkan semua aset dan metadata sebelum memulai proses tinjau aplikasi di App Store Connect.' },
  ], 3],
  // --- flutter-dasar ---
  ['install-flutter', 'Menginstal Flutter', [
    { t: 'p', x: 'Flutter adalah toolkit UI Google untuk membuat aplikasi natively compiled dari satu kodebase untuk Android, iOS, web, dan desktop. Flutter menggunakan bahasa Dart.' },
    { t: 'code', lang: 'bash', x: '# Unduh Flutter dari flutter.dev\\n# Ekstrak dan tambahkan ke PATH\\nflutter doctor\\nflutter create belajar_flutter\\ncd belajar_flutter\\nflutter run' },
    { t: 'list', items: ['Unduh Flutter SDK dari situs resmi', 'Ekstrak dan tambahkan direktori bin ke PATH', 'Jalankan flutter doctor untuk memeriksa dependensi', 'Instal Android Studio dan emulator untuk Android'] },
    { t: 'tip', x: 'flutter doctor akan menunjukkan apa saja yang belum terinstal atau perlu diperbaiki sebelum mengembangkan.' },
  ], 3],
  ['install-flutter', 'Apa itu Dart', [
    { t: 'p', x: 'Dart adalah bahasa pemrograman yang digunakan Flutter. Dart aman null, berorientasi objek, dan dapat di-compile menjadi kode mesin atau JavaScript.' },
    { t: 'code', lang: 'dart', x: 'void main() {\\n  var nama = \"Rafi\"\\n  var umur = 20\\n  print(\"Halo, $nama. Umur: $umur\")\\n}' },
    { t: 'tip', x: 'Dart memiliki sintaks yang mirip Java dan JavaScript, sehingga mudah dipelajari jika sudah familiar dengan keduanya.' },
  ], 3],
  ['install-flutter', 'Kesalahan Umum: PATH Tidak Dikonfigurasi', [
    { t: 'p', x: 'Jika perintah flutter tidak dikenali terminal, direktori bin Flutter belum ditambahkan ke PATH sistem. Ini mencegah kamu menjalankan perintah Flutter dari mana saja.' },
    { t: 'list', items: ['Direktori bin Flutter tidak ada di PATH', 'Terminal baru dibuka sebelum PATH diperbarui', 'PATH disimpan di file konfigurasi yang salah', 'Perintah diketik dengan huruf besar yang salah'] },
    { t: 'tip', x: 'Setelah menambah PATH, restart terminal atau jalankan perintah untuk memuat ulang konfigurasi shell.' },
  ], 3],
  // --- dart-dasar ---
  ['dart-dasar', 'Variabel dan Fungsi Dart', [
    { t: 'p', x: 'Dart menggunakan var untuk variabel dengan tipe yang dapat diubah, dan final atau const untuk nilai tetap. Fungsi didefinisikan dengan tipe pengembalian atau void.' },
    { t: 'code', lang: 'dart', x: 'var nama = \"Rafi\"\\nfinal tahun = 2024\\nvoid sapa(String orang) {\\n  print(\"Halo, $orang\")\\n}\\nint tambah(int a, int b) => a + b;' },
    { t: 'tip', x: 'Gunakan final untuk nilai yang diassign sekali, dan const untuk nilai kompilasi waktu yang pasti.' },
  ], 3],
  ['dart-dasar', 'Class dan Objek', [
    { t: 'p', x: 'Semua dalam Dart adalah objek. Class menjadi cetak biru untuk objek dengan properti dan metode. Dart mendukung konstruktor named untuk membuat objek dengan cara yang berbeda.' },
    { t: 'code', lang: 'dart', x: 'class Siswa {\\n  String nama;\\n  int umur;\\n  Siswa(this.nama, this.umur);\\n}\\nvar rafi = Siswa(\"Rafi\", 20);' },
    { t: 'tip', x: 'Gunakan this.parameter dalam konstruktor untuk langsung mengassign nilai ke properti.' },
  ], 3],
  ['dart-dasar', 'Kesalahan Umum: Menggunakan const dan final Secara Salah', [
    { t: 'p', x: 'const harus bernilai konstan pada waktu kompilasi, sementara final dapat diassign pada waktu runtime. Menggunakan const untuk nilai yang tidak diketahui sebelum kompilasi akan menyebabkan error.' },
    { t: 'list', items: ['Menggunakan const untuk nilai dari input pengguna', 'Mengubah nilai final setelah diassign', 'Menggabungkan const dan var secara acak', 'Tidak memahami perbedaan immutable dan compile-time constant'] },
    { t: 'tip', x: 'Jika tidak yakin, gunakan final. const hanya untuk nilai yang benar-benar diketahui saat menulis kode.' },
  ], 3],
  // --- widget-dasar ---
  ['widget-dasar', 'Widget dalam Flutter', [
    { t: 'p', x: 'Semua tampilan di Flutter adalah widget. Widget dapat berupa elemen visual (tombol, teks) atau tata letak (baris, kolom, kartu). Flutter menggunakan pendekatan komposisi: gabungkan widget kecil menjadi widget besar.' },
    { t: 'list', items: ['StatelessWidget untuk tampilan yang tidak berubah', 'StatefulWidget untuk tampilan yang dapat berubah', 'Widget dapat di-susun secara bertingkat', 'Setiap widget dapat menerima properti untuk penyesuaian'] },
    { t: 'tip', x: 'Pilih StatelessWidget jika tampilan tidak perlu berubah berdasarkan interaksi pengguna.' },
  ], 3],
  ['widget-dasar', 'Widget Umum: Text, Image, dan Container', [
    { t: 'p', x: 'Text menampilkan teks, Image menampilkan gambar, dan Container adalah wadah yang dapat diatur padding, margin, warna, dan batasnya.' },
    { t: 'code', lang: 'dart', x: 'Container(\\n  padding: EdgeInsets.all(16),\\n  color: Colors.blue,\\n  child: Text(\"Halo, EduVerse\"),\\n)' },
    { t: 'tip', x: 'Gunakan Container untuk memberi jarak dan latar belakang pada widget anaknya.' },
  ], 3],
  ['widget-dasar', 'Kesalahan Umum: Lupa StatefulWidget', [
    { t: 'p', x: 'Jika tampilan perlu berubah setelah interaksi pengguna (misal tombol diklik), gunakan StatefulWidget dengan setState. StatelessWidget tidak dapat memperbarui tampilannya sendiri.' },
    { t: 'list', items: ['Menggunakan StatelessWidget untuk data yang berubah', 'Lupa memanggil setState setelah mengubah data', 'Mengubah variabel langsung tanpa memberitahu Flutter', 'Menggunakan state yang terlalu luas untuk satu widget'] },
    { t: 'tip', x: 'Panggil setState() setiap kali data yang memengaruhi tampilan berubah.' },
  ], 3],
  // --- proyek-mini (flutter) ---
  ['proyek-mini', 'Proyek Mini: Aplikasi Catatan', [
    { t: 'p', x: 'Buat aplikasi catatan sederhana menggunakan Flutter. Kamu akan menerapkan widget, state manajemen, dan penyimpanan lokal dalam satu proyek nyata.' },
    { t: 'list', items: ['Tambah catatan baru dengan judul dan isi', 'Tampilkan daftar semua catatan', 'Hapus catatan yang tidak diperlukan', 'Simpan catatan secara lokal agar tidak hilang saat ditutup'] },
    { t: 'code', lang: 'bash', x: 'flutter create catatan_app\\ncd catatan_app\\nflutter run' },
    { t: 'tip', x: 'Mulai dengan daftar catatan sederhana, lalu tambahkan fitur penyimpanan lokal setelah tampilan berjalan.' },
  ], 5],
  // --- react-native-dasar ---
  ['expo-dasar', 'Expo dan React Native', [
    { t: 'p', x: 'React Native memungkinkan membuat aplikasi mobile native dengan React dan JavaScript. Expo adalah alat yang mempermudah pengembangan React Native tanpa perlu menginstal Android Studio atau Xcode secara langsung.' },
    { t: 'list', items: ['Satu kodebase untuk Android dan iOS', 'Komponen native yang dirender sebagai UI asli', 'Expo mempermudah setup dan pengujian', 'Hot reload untuk melihat perubahan segera'] },
    { t: 'tip', x: 'Gunakan Expo untuk memulai proyek React Native dengan cepat tanpa konfigurasi native yang rumit.' },
  ], 3],
  ['expo-dasar', 'Menginstal Expo', [
    { t: 'p', x: 'Unduh aplikasi Expo Go di ponselmu untuk menguji aplikasi. Buat proyek baru menggunakan npx create-expo-app dan jalankan dengan npx expo start.' },
    { t: 'code', lang: 'bash', x: 'npx create-expo-app belajar-expo\\ncd belajar-expo\\nnpx expo start' },
    { t: 'list', items: ['Instal Node.js dari nodejs.org', 'Unduh Expo Go di App Store atau Play Store', 'Jalankan npx create-expo-app nama-proyek', 'Scan QR code dengan Expo Go untuk melihat aplikasi'] },
    { t: 'tip', x: 'Ponsel dan komputer harus terhubung ke jaringan Wi-Fi yang sama untuk Expo Go bekerja.' },
  ], 3],
  ['expo-dasar', 'Kesalahan Umum: Jaringan Tidak Sama', [
    { t: 'p', x: 'Expo Go memerlukan ponsel dan komputer terhubung ke jaringan Wi-Fi yang sama. Jika berbeda, ponsel tidak dapat terhubung ke server pengembangan di komputer.' },
    { t: 'list', items: ['Ponsel dan komputer di jaringan yang berbeda', 'Firewall memblokir port pengembangan', 'Alamat IP server tidak dapat diakses ponsel', 'Versi Expo Go tidak sesuai dengan CLI'] },
    { t: 'tip', x: 'Periksa jaringan Wi-Fi dan pastikan tidak ada firewall yang memblokir koneksi antara ponsel dan komputer.' },
  ], 3],
  // --- javascript-dasar-react-native ---
  ['javascript-dasar-react-native', 'JavaScript Dasar untuk React Native', [
    { t: 'p', x: 'React Native menggunakan JavaScript untuk logika aplikasi. Kamu perlu memahami variabel, fungsi, array, objek, dan asynchronous (promise, async/await) sebelum membangun aplikasi.' },
    { t: 'code', lang: 'js', x: 'const nama = \"Rafi\"\\nconst hitung = (a, b) => a + b\\nconst data = await fetch(\"https://api.contoh.com\")\\nconst json = await data.json()' },
    { t: 'tip', x: 'Gunakan const secara default dan let hanya jika nilai perlu diubah. Hindari var di JavaScript modern.' },
  ], 3],
  ['javascript-dasar-react-native', 'JSX di React Native', [
    { t: 'p', x: 'React Native menggunakan JSX yang mirip React untuk web, tetapi dengan komponen native seperti <View>, <Text>, dan <TouchableOpacity> alih-alih <div> dan <span>.' },
    { t: 'code', lang: 'jsx', x: 'import { View, Text } from \"react-native\"\\n\\nfunction Sapaan() {\\n  return (\\n    <View>\\n      <Text>Halo, EduVerse</Text>\\n    </View>\\n  )\\n}' },
    { t: 'tip', x: 'Setiap elemen JSX di React Native harus ditutup, dan hanya boleh ada satu elemen induk di setiap komponen.' },
  ], 3],
  ['javascript-dasar-react-native', 'Kesalahan Umum: Menggunakan Elemen Web', [
    { t: 'p', x: 'React Native tidak mendukung elemen HTML seperti <div>, <span>, atau <img>. Gunakan komponen bawaan React Native seperti <View>, <Text>, dan <Image>.' },
    { t: 'list', items: ['Menggunakan <div> atau <span> di React Native', 'Menggunakan <img> untuk gambar', 'Mengimpor pustaka web yang tidak kompatibel', 'Mengasumsikan CSS berfungsi sama seperti di web'] },
    { t: 'tip', x: 'Pelajari komponen bawaan React Native sebelum mencoba meniru pola pengembangan web.' },
  ], 3],
  // --- navigasi (react native) ---
  ['navigasi', 'Navigasi Antar Layar di React Native', [
    { t: 'p', x: 'Navigasi di React Native biasanya menggunakan React Navigation. Pustaka ini menyediakan stack navigator, tab navigator, dan drawer navigator untuk berpindah layar.' },
    { t: 'code', lang: 'jsx', x: 'import { createStackNavigator } from \"@react-navigation/stack\"\\n\\nconst Stack = createStackNavigator()\\n\\nfunction App() {\\n  return (\\n    <Stack.Navigator>\\n      <Stack.Screen name=\"Beranda\" component={Beranda} />\\n      <Stack.Screen name=\"Detail\" component={Detail} />\\n    </Stack.Navigator>\\n  )\\n}' },
    { t: 'tip', x: 'Instal @react-navigation/native dan dependensi tambahan sesuai dokumentasi resmi.' },
  ], 3],
  ['navigasi', 'Mengirim Parameter Antar Layar', [
    { t: 'p', x: 'Saat berpindah layar, kamu dapat mengirim parameter, misalnya ID item yang dipilih. Parameter diakses melalui route.params di layar tujuan.' },
    { t: 'code', lang: 'jsx', x: 'navigation.navigate(\"Detail\", { itemId: 123 })\\n\\n// Di layar Detail\\nconst { itemId } = route.params' },
    { t: 'tip', x: 'Pastikan parameter yang dikirim sesuai dengan yang diharapkan layar tujuan agar tidak muncul error undefined.' },
  ], 3],
  ['navigasi', 'Kesalahan Umum: Lupa Menyiapkan Navigator', [
    { t: 'p', x: 'Jika lupa membungkus aplikasi dengan NavigationContainer, navigasi tidak akan berfungsi dan aplikasi akan menampilkan error saat mencoba berpindah layar.' },
    { t: 'list', items: ['Lupa membungkus dengan NavigationContainer', 'Menempatkan navigator di dalam layar yang salah', 'Tidak mendaftarkan semua layar dalam navigator', 'Menggunakan navigasi di luar konteks navigator'] },
    { t: 'tip', x: 'Tempatkan NavigationContainer di level paling atas aplikasi, biasanya di dalam komponen App.' },
  ], 3],
  // --- proyek-mini (react native) ---
  ['proyek-mini', 'Proyek Mini: Aplikasi Cuaca', [
    { t: 'p', x: 'Buat aplikasi cuaca sederhana menggunakan React Native dan Expo. Kamu akan mengambil data cuaca dari API, menampilkannya, dan memungkinkan pengguna mencari kota.' },
    { t: 'list', items: ['Tampilkan cuaca terkini berdasarkan lokasi', 'Cari cuaca untuk kota tertentu', 'Tampilkan suhu dan kondisi cuaca', 'Segarkan data cuaca dengan tombol atau tarik ke bawah'] },
    { t: 'code', lang: 'bash', x: 'npx create-expo-app cuaca_app\\ncd cuaca_app\\nnpx expo start' },
    { t: 'tip', x: 'Gunakan API cuaca gratis seperti OpenWeatherMap dan simpan kunci API dengan aman di variabel lingkungan.' },
  ], 5],

// --- pengembangan-perangkat-lunak ---
  ['analisis-kebutuhan', 'Apa itu Analisis Kebutuhan', [
    { t: 'p', x: 'Analisis kebutuhan adalah tahap pertama dalam pembuatan perangkat lunak di mana tim memahami apa yang dibutuhkan pengguna dan apa yang harus dilakukan sistem. Hasilnya adalah dokumen kebutuhan yang menjadi acuan tim pengembang.' },
    { t: 'list', items: ['Mengidentifikasi siapa pengguna sistem', 'Menentukan apa yang ingin dicapai pengguna', 'Mendokumentasikan kebutuhan fungsional dan non-fungsional', 'Menjadi dasar perancangan dan pengembangan'] },
    { t: 'tip', x: 'Libatkan pengguna akhir sejak awal agar sistem yang dibangun benar-benar menyelesaikan masalah mereka.' },
  ], 3],
  ['analisis-kebutuhan', 'Wawancara dan Pengumpulan Kebutuhan', [
    { t: 'p', x: 'Wawancara adalah cara langsung untuk mengetahui kebutuhan pengguna. Ajukan pertanyaan terbuka, dengarkan masalah mereka, dan catat setiap kebutuhan yang muncul dalam dokumen terstruktur.' },
    { t: 'code', lang: 'text', x: 'Contoh pertanyaan wawancara:\\n- Apa tugas utama yang ingin kamu selesaikan dengan sistem ini?\\n- Apa masalah yang sering kamu hadapi saat ini?\\n- Fitur apa yang paling kamu butuhkan?' },
    { t: 'tip', x: 'Jangan berasumsi kamu tahu kebutuhan pengguna. Selalu verifikasi melalui wawancara atau observasi langsung.' },
  ], 3],
  ['analisis-kebutuhan', 'Kebutuhan Fungsional dan Non-Fungsional', [
    { t: 'p', x: 'Kebutuhan fungsional adalah fitur-fitur yang harus ada dalam sistem, seperti login atau mencetak laporan. Kebutuhan non-fungsional adalah kualitas sistem, seperti kecepatan, keamanan, dan ketersediaan.' },
    { t: 'list', items: ['Fungsional: sistem harus dapat menyimpan data peserta', 'Non-fungsional: sistem harus dapat diakses 1000 pengguna bersamaan', 'Non-fungsional: data harus dienkripsi saat disimpan', 'Fungsional: pengguna dapat mengubah profil sendiri'] },
    { t: 'tip', x: 'Kebutuhan non-fungsional sering diabaikan padahal sangat mempengaruhi kepuasan pengguna.' },
  ], 3],
  ['analisis-kebutuhan', 'Kesalahan Umum: Kebutuhan Tidak Jelas', [
    { t: 'p', x: 'Kebutuhan yang kabur seperti \"sistem harus cepat\" atau \"tampilan menarik\" sulit diukur dan diimplementasikan. Ubah kebutuhan kabur menjadi spesifik dan dapat diuji.' },
    { t: 'list', items: ['Kebutuhan yang tidak dapat diukur', 'Terlalu banyak kebutuhan tanpa prioritas', 'Kebutuhan yang saling bertentangan', 'Tidak melibatkan pemangku kepentingan'] },
    { t: 'tip', x: 'Gunakan kriteria penerimaan yang spesifik agar kebutuhan dapat diuji secara objektif.' },
  ], 3],
  // --- desain-perangkat-lunak ---
  ['desain-perangkat-lunak', 'Apa itu Desain Perangkat Lunak', [
    { t: 'p', x: 'Desain perangkat lunak adalah proses menentukan struktur sistem, komponen-komponennya, dan bagaimana mereka saling berinteraksi. Desain yang baik membuat sistem mudah dipahami, dikembangkan, dan dirawat.' },
    { t: 'list', items: ['Menentukan struktur dan arsitektur sistem', 'Mendesain antarmuka antara komponen', 'Memilih teknologi dan alat yang sesuai', 'Membuat sistem yang scalable dan dapat dirawat'] },
    { t: 'tip', x: 'Desain dilakukan sebelum coding agar tim memiliki gambaran yang sama tentang sistem yang akan dibangun.' },
  ], 3],
  ['desain-perangkat-lunak', 'Diagram Kelas dan Alur', [
    { t: 'p', x: 'Diagram kelas menunjukkan struktur sistem: kelas, atribut, metode, dan hubungan antar kelas. Diagram alur menunjukkan langkah-langkah proses dalam sistem dari awal hingga akhir.' },
    { t: 'code', lang: 'text', x: 'Kelas: Pengguna\\n  - nama: String\\n  - email: String\\n  + login(): Boolean\\n  + logout(): void\\n\\nHubungan: Pengguna 1 --* Pesanan' },
    { t: 'tip', x: 'Diagram tidak perlu sempurna. Tujuannya membantu tim memahami sistem, bukan membuat dokumentasi yang berlebihan.' },
  ], 3],
  ['desain-perangkat-lunak', 'Arsitektur Lapisan', [
    { t: 'p', x: 'Arsitektur lapisan membagi sistem menjadi beberapa lapisan dengan tanggung jawab masing-masing, misal lapisan presentasi, bisnis, dan data. Setiap lapisan hanya berkomunikasi dengan lapisan yang berdekatan.' },
    { t: 'list', items: ['Lapisan presentasi: tampilan yang dilihat pengguna', 'Lapisan bisnis: logika aturan bisnis', 'Lapisan data: akses ke database dan penyimpanan', 'Lapisan hanya tahu lapisan di bawahnya, tidak terlampaui'] },
    { t: 'tip', x: 'Pemisahan lapisan membuat perubahan di satu lapisan tidak mempengaruhi lapisan lain secara langsung.' },
  ], 3],
  ['desain-perangkat-lunak', 'Kesalahan Umum: Terlalu Banyak Detail Dini', [
    { t: 'p', x: 'Beberapa tim mencoba merancang setiap detail sebelum coding dimulai. Ini malah memperlambat pengembangan karena kebutuhan sering berubah saat proses berlangsung.' },
    { t: 'list', items: ['Merancang setiap kelas sebelum coding', 'Tidak fleksibel terhadap perubahan kebutuhan', 'Menghabiskan waktu terlalu banyak di dokumen desain', 'Mengabaikan umpan balik dari coding awal'] },
    { t: 'tip', x: 'Rancang cukup untuk memulai, lalu perbaiki desain seiring berkembangnya sistem.' },
  ], 3],
  // --- implementasi-dan-uji ---
  ['implementasi-dan-uji', 'Coding dan Implementasi', [
    { t: 'p', x: 'Implementasi adalah tahap menulis kode berdasarkan desain yang telah dibuat. Pilih bahasa dan framework yang sesuai, ikuti standar coding tim, dan tulis kode yang mudah dibaca oleh orang lain.' },
    { t: 'list', items: ['Tulis kode sesuai standar tim', 'Berikan nama variabel dan fungsi yang jelas', 'Komentarkan bagian yang rumit, bukan yang jelas', 'Bagikan kode melalui version control'] },
    { t: 'tip', x: 'Kode mudah dibaca lebih penting dari kode yang cerdas tetapi sulit dipahami orang lain.' },
  ], 3],
  ['implementasi-dan-uji', 'Pengujian Unit', [
    { t: 'p', x: 'Pengujian unit memeriksa fungsi atau modul kecil secara terpisah dari sistem lain. Setiap fungsi harus memiliki pengujian yang memastikan hasilnya sesuai harapan untuk berbagai masukan.' },
    { t: 'code', lang: 'js', x: 'function tambah(a, b) { return a + b; }\\n\\ntest(\"tambah dua angka positif\", () => {\\n  expect(tambah(2, 3)).toBe(5);\\n});' },
    { t: 'tip', x: 'Tulis pengujian untuk fungsi yang kompleks atau kritis agar perubahan di kemudian hari tidak merusak fungsionalitas lama.' },
  ], 3],
  ['implementasi-dan-uji', 'Pengujian Integrasi', [
    { t: 'p', x: 'Pengujian integrasi memeriksa apakah beberapa modul bekerja bersama dengan benar. Misal memastikan data yang disimpan oleh modul satu dapat dibaca oleh modul lain.' },
    { t: 'list', items: ['Uji interaksi antara dua atau lebih modul', 'Periksa alur data antar modul', 'Uji koneksi ke database atau API eksternal', 'Pastikan error di satu modul tidak mengakibatkan crash sistem'] },
    { t: 'tip', x: 'Lakukan pengujian unit terlebih dahulu, baru kemudian pengujian integrasi antar modul.' },
  ], 3],
  ['implementasi-dan-uji', 'Kesalahan Umum: Mengabaikan Pengujian', [
    { t: 'p', x: 'Mengabaikan pengujian untuk menghemat waktu malah menyebabkan lebih banyak waktu dihabiskan untuk memperbaiki bug yang ditemukan setelah aplikasi diluncurkan.' },
    { t: 'list', items: ['Mengabaikan pengujian untuk menghemat waktu', 'Menguji hanya jalan sukses, tidak kasus gagal', 'Tidak menguji masukan yang salah atau aneh', 'Mengandalkan pengujian manual saja'] },
    { t: 'tip', x: 'Pengujian otomatis menghemat waktu pada jangka panjang dengan menangkap dini sebelum rilis.' },
  ], 3],
  // --- peluncuran-dan-pemeliharaan ---
  ['peluncuran-dan-pemeliharaan', 'Peluncuran Aplikasi', [
    { t: 'p', x: 'Peluncuran adalah proses menyebarkan aplikasi ke pengguna akhir. Siapkan server produksi, konfigurasi domain, dan lakukan pengujian akhir sebelum aplikasi diakses publik.' },
    { t: 'list', items: ['Siapkan server produksi dan database', 'Konfigurasi domain dan SSL', 'Lakukan pengujian akhir di lingkungan produksi', 'Siapkan rencana pengembalian jika terjadi masalah'] },
    { t: 'tip', x: 'Lakukan peluncuran secara bertahap (canary release) ke sebagian pengguna dulu sebelum rilis penuh.' },
  ], 3],
  ['peluncuran-dan-pemeliharaan', 'Pemantauan dan Log', [
    { t: 'p', x: 'Setelah diluncurkan, pantau aplikasi untuk mendeteksi error, kecepatan, dan gangguan. Catat log untuk membantu mengidentifikasi penyebab masalah saat terjadi gangguan.' },
    { t: 'list', items: ['Pantau waktu respons dan uptime aplikasi', 'Catat error dan pengecualian yang terjadi', 'Pantau penggunaan memori dan CPU', 'Terima notifikasi saat terjadi gangguan'] },
    { t: 'tip', x: 'Pantauan yang baik memungkinkan tim merespons masalah sebelum banyak pengguna terkena dampaknya.' },
  ], 3],
  ['peluncuran-dan-pemeliharaan', 'Perbaikan Bug dan Pembaruan', [
    { t: 'p', x: 'Setelah peluncuran, bugs akan ditemukan dan fitur baru akan diminta. Lakukan perbaikan secara terstruktur: identifikasi, perbaiki, uji, lalu distribusikan pembaruan kepada pengguna.' },
    { t: 'list', items: ['Terima laporan bug dari pengguna', 'Prioritaskan bug berdasarkan dampak', 'Perbaiki dan uji sebelum distribusi', 'Beritahu pengguna tentang pembaruan yang tersedia'] },
    { t: 'tip', x: 'Jangan memperbaiki bug secara langsung di produksi tanpa pengujian terlebih dahulu.' },
  ], 3],
  ['peluncuran-dan-pemeliharaan', 'Kesalahan Umum: Tanpa Rencana Pengembalian', [
    { t: 'p', x: 'Tanpa rencana pengembalian (rollback), jika rilis baru menyebabkan masalah serius, sulit untuk kembali ke versi sebelumnya dengan cepat dan dapat menyebabkan gangguan berkepanjangan.' },
    { t: 'list', items: ['Mengirim pembaruan tanpa cara membatalkannya', 'Tidak mencadangkan data sebelum migrasi', 'Meluncurkan ke semua pengguna sekaligus tanpa pengujian', 'Tidak mencatat versi yang sebelumnya stabil'] },
    { t: 'tip', x: 'Selalu siapkan versi cadangan dan rencana rollback sebelum mendistribusikan pembaruan.' },
  ], 3],
  // --- rekayasa-perangkat-lunak ---
  ['sdlc', 'Apa itu SDLC', [
    { t: 'p', x: 'SDLC (Software Development Life Cycle) adalah kerangka kerja yang menggambarkan tahapan pembuatan perangkat lunak dari perencanaan sampai pemeliharaan. Setiap tahapan memiliki tujuan dan hasil akhir yang jelas.' },
    { t: 'list', items: ['Perencanaan dan analisis kebutuhan', 'Desain sistem', 'Implementasi dan coding', 'Pengujian', 'Peluncuran dan pemeliharaan'] },
    { t: 'tip', x: 'SDLC membantu tim bekerja terstruktur sehingga tidak ada tahapan penting yang terlewatkan.' },
  ], 3],
  ['sdlc', 'Model Airfall dan Iteratif', [
    { t: 'p', x: 'Model Airfall menyelesaikan setiap tahapan secara berurutan dan tidak kembali ke tahapan sebelumnya. Model iteratif mengulangi siklus kecil sehingga sistem berkembang bertahap.' },
    { t: 'list', items: ['Airfall: cocok untuk kebutuhan yang sudah pasti dan tidak berubah', 'Iteratif: cocok untuk kebutuhan yang masih berkembang', 'Airfall: dokumentasi lengkap sebelum coding', 'Iteratif: umpan balik diterima tiap siklus'] },
    { t: 'tip', x: 'Pilih model yang cocok dengan karakteristik proyek dan tim, tidak selalu yang paling baru atau populer.' },
  ], 3],
  ['sdlc', 'Kesalahan Umum: Melewati Tahapan', [
    { t: 'p', x: 'Beberapa tim langsung mulai coding tanpa analisis kebutuhan atau desain yang cukup. Ini menyebabkan hasil akhir tidak sesuai harapan pengguna dan banyak perbaikan di akhir.' },
    { t: 'list', items: ['Langsung coding tanpa memahami kebutuhan', 'Lewati desain sistem', 'Tidak melakukan pengujian sebelum rilis', 'Mengabaikan dokumentasi'] },
    { t: 'tip', x: 'Setiap tahapan SDLC ada alasannya. Tidak ada tahapan yang boleh dilewati sepenuhnya.' },
  ], 3],
  // --- manajemen-proyek ---
  ['manajemen-proyek', 'Manajemen Proyek TI', [
    { t: 'p', x: 'Manajemen proyek TI adalah proses merencanakan, mengorganisir, dan mengawasi proyek pengembangan perangkat lunak agar selesai tepat waktu, anggaran, dan kualitas yang diinginkan.' },
    { t: 'list', items: ['Merencanakan jadwal dan sumber daya', 'Mengelola risiko proyek', 'Memantau kemajuan pekerjaan', 'Berkomunikasi dengan pemangku kepentingan'] },
    { t: 'tip', x: 'Manajer proyek bukan hanya mengatur jadwal, tetapi juga menghilangkan hambatan bagi tim pengembang.' },
  ], 3],
  ['manajemen-proyek', 'Perencanaan dan Estimasi', [
    { t: 'p', x: 'Estimasi adalah menebak waktu dan usaha yang dibutuhkan untuk menyelesaikan tugas. Gunakan data dari proyek serupa sebelumnya dan pecah pekerjaan besar menjadi tugas kecil agar estimasi lebih akurat.' },
    { t: 'code', lang: 'text', x: 'Pecahan pekerjaan:\\n- Analisis kebutuhan: 3 hari\\n- Desain antarmuka: 2 hari\\n- Implementasi fitur login: 5 hari\\n- Pengujian: 2 hari' },
    { t: 'tip', x: 'Selalu sisakan waktu tambahan (buffer) untuk hal yang tidak terduga dalam perencanaan proyek.' },
  ], 3],
  ['manajemen-proyek', 'Kesalahan Umum: Estimasi Terlalu Optimis', [
    { t: 'p', x: 'Estimasi terlalu cepat tanpa mempertimbangkan risiko dan hambatan akan menyebabkan jadwal terlambat dan tim bekerja di bawah tekanan berlebih.' },
    { t: 'list', items: ['Estimasi tanpa mengakibatkan risiko', 'Mengabaikan waktu untuk pengujian dan perbaikan bug', 'Menganggap semua anggota tim sama produktif', 'Tidak menyesuaikan estimasi seiring berjalannya waktu'] },
    { t: 'tip', x: 'Perbarui estimasi secara berkala berdasarkan kemajuan nyata, bukan rencana awal yang sudah kuno.' },
  ], 3],
  // --- agile-scrum ---
  ['agile-scrum', 'Agile dan Scrum', [
    { t: 'p', x: 'Agile adalah pendekatan pengembangan yang menekankan kolaborasi, fleksibilitas, dan pengiriman software yang bernilai secara bertahap. Scrum adalah salah satu kerangka kerja Agile yang paling banyak digunakan.' },
    { t: 'list', items: ['Pengiriman software secara berulang dan bertahap', 'Kolaborasi erat antara pengembang dan pengguna', 'Responsif terhadap perubahan kebutuhan', 'Peringkat pada individu dan interaksi atas proses dan alat'] },
    { t: 'tip', x: 'Agile tidak berarti tanpa rencana, melainkan rencana yang dapat berubah seiring informasi baru.' },
  ], 4],
  ['agile-scrum', 'Peran dalam Scrum', [
    { t: 'p', x: 'Scrum memiliki tiga peran utama: Product Owner (mewakili pengguna dan menentukan prioritas), Scrum Master (memastikan proses Scrum berjalan), dan Development Team (membangun produk).' },
    { t: 'list', items: ['Product Owner: mengelola backlog dan prioritas fitur', 'Scrum Master: memfasilitasi dan menghilangkan hambatan', 'Development Team: merancang, membangun, dan menguji fitur', 'Tiga peran bekerja sama dalam satu tim Scrum'] },
    { t: 'tip', x: 'Product Owner tidak boleh memberi tugas langsung ke anggota development team di luar sprint planning.' },
  ], 3],
  ['agile-scrum', 'Sprint dan Sprint Review', [
    { t: 'p', x: 'Sprint adalah periode waktu tetap (biasanya 1-4 minggu) di mana tim menyelesaikan sekumpulan fitur. Pada akhir sprint, tim menunjukkan hasil pekerjaan kepada pemangku kepentingan dalam sprint review.' },
    { t: 'list', items: ['Sprint berlangsung dalam waktu tetap', 'Saat akhir sprint harus ada hasil yang dapat digunakan', 'Sprint review untuk menunjukkan hasil kepada pemangku kepentingan', 'Sprint retrospective untuk memperbaiki proses tim'] },
    { t: 'tip', x: 'Jangan mengubah cakupan sprint setelah dimulai kecuali ada hal sangat mendesak yang menyangkut keselamatan atau bisnis.' },
  ], 3],
  ['agile-scrum', 'Kesalahan Umum: Scrum Tanpa Hasil', [
    { t: 'p', x: 'Beberapa tim mengikuti rituan Scrum (rapat, papan, peran) tetapi tidak menghasilkan software yang dapat digunakan pada akhir sprint. Ini membuat Scrum menjadi formalitas tanpa manfaat nyata.' },
    { t: 'list', items: ['Rapatan dilakukan tetapi tidak ada hasil akhir sprint', 'Backlog tidak diprioritaskan dengan jelas', 'Tim tidak memiliki kewenangan untuk mengambil keputusan', 'Sprint berlangsung tanpa target yang terukur'] },
    { t: 'tip', x: 'Setiap sprint harus menghasilkan increment software yang nyata dan dapat diuji.' },
  ], 3],
  // --- dokumentasi ---
  ['dokumentasi', 'Dokumentasi Perangkat Lunak', [
    { t: 'p', x: 'Dokumentasi membantu orang lain memahami sistem, cara menggunakannya, dan cara mengembangkannya. Dokumentasi yang baik mencakup panduan pengguna, dokumentasi teknis, dan catatan perubahan.' },
    { t: 'list', items: ['Panduan pengguna untuk orang yang menggunakan sistem', 'Dokumentasi teknis untuk pengembang yang memelihara sistem', 'Catatan API untuk integrasi dengan sistem lain', 'Catatan perubahan dan versi rilis'] },
    { t: 'tip', x: 'Tulis dokumentasi seiring dengan pengembangan, jangan ditunda sampai proyek selesai.' },
  ], 3],
  ['dokumentasi', 'Komentar Kode yang Baik', [
    { t: 'p', x: 'Komentar kode harus menjelaskan mengapa suatu keputusan diambil, bukan apa yang dilakukan kode tersebut. Kode yang jelas seharusnya bisa dimengerti tanpa banyak komentar.' },
    { t: 'code', lang: 'js', x: '// Baik: menjelaskan alasan\\n// Gunakan 30 detik timeout karena server lambat di area pedesaan\\nconst timeout = 30000;\\n\\n// Buruk: menjelaskan apa yang jelas\\n// Tambahkan 1 dan 2\\nlet hasil = 1 + 2;' },
    { t: 'tip', x: 'Perbaiki nama variabel dan struktur kode sebelum menambahkan komentar. Kode yang jelas tidak butuh komentar berlebihan.' },
  ], 3],
  ['dokumentasi', 'Kesalahan Umum: Dokumentasi Ketuwu', [
    { t: 'p', x: 'Dokumentasi yang tidak diperbarui setelah perubahan kode menjadi menyesatkan dan lebih buruk daripada tidak ada dokumentasi. Selalu sinkronkan dokumentasi dengan perubahan sistem.' },
    { t: 'list', items: ['Dokumentasi tidak cocok dengan kode terbaru', 'Informasi usang yang masih dipakai sebagai acuan', 'Tidak ada pemegang tanggung jawab dokumentasi', 'Dokumentasi tersimpan di tempat yang sulit ditemukan'] },
    { t: 'tip', x: 'Jadikan dokumentasi sebagai bagian dari definisi selesai (definition of done) setiap fitur.' },
  ], 3],
  // --- qa-testing ---
  ['jenis-pengujian', 'Jenis-Jenis Pengujian', [
    { t: 'p', x: 'Pengujian perangkat lunak terdiri dari berbagai jenis dengan tujuan berbeda. Pengujian fungsional memeriksa fitur, pengujian non-fungsional memeriksa kualitas seperti kecepatan dan keamanan.' },
    { t: 'list', items: ['Pengujian fungsional: fitur bekerja sesuai spesifikasi', 'Pengujian non-fungsional: kinerja, keamanan, kegunaan', 'Pengujian regresi: memastikan perubahan baru tidak merusak fitur lama', 'Pengujian user acceptance: memastikan sistem sesuai kebutuhan pengguna'] },
    { t: 'tip', x: 'Gabungkan berbagai jenis pengujian agar sistem diuji dari berbagai sudut pandang.' },
  ], 3],
  ['jenis-pengujian', 'Pengujian Fungsional dan Non-Fungsional', [
    { t: 'p', x: 'Pengujian fungsional menjawab \"apakah sistem melakukan apa yang harus dilakukan?\", sedangkan pengujian non-fungsional menjawab \"seberapa baik sistem melakukan hal tersebut?\"' },
    { t: 'code', lang: 'text', x: 'Fungsional: Pengguna dapat login dengan benar\\nNon-fungsional: Halaman login dimuat dalam kurang dari 2 detik\\nFungsional: Data tersimpan saat tombol simpan diklik\\nNon-fungsional: Data aman dan tidak dapat diakses orang lain' },
    { t: 'tip', x: 'Sistem yang bekerja tapi lambat atau tidak aman masih dianggap gagal dari sudut pengguna.' },
  ], 3],
  ['jenis-pengujian', 'Kesalahan Umum: Hanya Pengujian Fungsional', [
    { t: 'p', x: 'Fokus hanya pada fitur berjalan tanpa menguji kinerja, keamanan, dan kegunaan dapat menghasilkan sistem yang rentan gangguan dan tidak nyaman digunakan.' },
    { t: 'list', items: ['Mengabaikan pengujian kinerja dan beban', 'Tidak menguji keamanan sistem', 'Mengabaikan pengujian pada berbagai perangkat dan browser', 'Mengasumsikan sistem aman karena fitur berfungsi'] },
    { t: 'tip', x: 'Pengujian non-fungsional sama pentingnya dengan pengujian fungsional untuk keberhasilan sistem.' },
  ], 3],
  // --- unit-test ---
  ['unit-test', 'Unit Test', [
    { t: 'p', x: 'Unit test memeriksa satu fungsi atau modul kecil secara terpisah. Setiap unit test harus cepat, terisolasi, dan dapat diulang berkali-kali dengan hasil yang sama.' },
    { t: 'code', lang: 'js', x: 'function kali(a, b) { return a * b; }\\n\\ntest("kali dua angka", () => {\\n  expect(kali(3, 4)).toBe(12);\\n  expect(kali(-1, 5)).toBe(-5);\\n});' },
    { t: 'tip', x: 'Tulis unit test untuk setiap fungsi logika bisnis agar perubahan di kemudian hari tidak merusak perilaku yang sudah ada.' },
  ], 3],
  ['unit-test', 'Menguji Kasus Tepi (Edge Case)', [
    { t: 'p', x: 'Kasus tepi adalah situasi jarang terjadi tetapi penting, seperti masukan kosong, nilai sangat besar, atau jaringan terputus. Pengujian harus mencakup kasus tepi agar sistem tidak gagal dalam situasi nyata.' },
    { t: 'list', items: ['Masukan kosong atau null', 'Nilai paling besar dan paling kecil', 'Jaringan terputus selama permintaan', 'Pengguna dengan hak akses yang terbatas'] },
    { t: 'tip', x: 'Banyak bug ditemukan di kasus tepi, bukan dalam alur bahagia yang sederhana.' },
  ], 3],
  ['unit-test', 'Kesalahan Umum: Pengujian yang Bergantung pada Waktu', [
    { t: 'p', x: 'Pengujian yang bergantung pada waktu atau tanggal aktual dapat gagal pada waktu yang berbeda. Gunakan waktu yang dapat dikontrol atau mock untuk pengujian yang konsisten.' },
    { t: 'list', items: ['Pengujian yang gagal pada tanggal tertentu', 'Menggunakan waktu sistem secara langsung', 'Tidak dapat diulang dengan hasil yang sama', 'Bergantung pada kondisi eksternal yang berubah'] },
    { t: 'tip', x: 'Gunakan library mock untuk waktu agar pengujian tidak bergantung pada waktu aktual sistem.' },
  ], 3],
  // --- integrasi-dan-sistem ---
  ['integrasi-dan-sistem', 'Pengujian Integrasi dan Sistem', [
    { t: 'p', x: 'Pengujian integrasi memeriksa interaksi antar modul, sedangkan pengujian sistem memeriksa keseluruhan aplikasi sebagai satu kesatuan. Kedua-duanya memastikan semua bagian bekerja bersama dengan baik.' },
    { t: 'list', items: ['Integrasi: uji antar dua atau lebih modul', 'Sistem: uji seluruh aplikasi dari awal hingga akhir', 'Integrasi ditemukan masalah interaksi antar modul', 'Sistem menemukan masalah yang hanya muncul saat semua bagian gabungan'] },
    { t: 'tip', x: 'Lakukan pengujian integrasi setelah unit test, baru kemudian pengujian sistem sebelum rilis.' },
  ], 3],
  ['integrasi-dan-sistem', 'Pengujian Ujung ke Ujung', [
    { t: 'p', x: 'Pengujian ujung ke ujung mensimulasikan alur pengguna nyata dari awal hingga akhir, misal dari membuka halaman login sampai mencetak laporan. Ini memastikan seluruh alur bisnis berjalan.' },
    { t: 'code', lang: 'text', x: 'Alur ujung ke ujung:\\n1. Pengguna membuka halaman login\\n2. Pengguna memasukkan kredensial\\n3. Sistem memverifikasi dan membuka dasbor\\n4. Pengguna mencetak laporan harian' },
    { t: 'tip', x: 'Uji alur utama yang sering dilakukan pengguna, bukan setiap fitur kecil secara terpisah.' },
  ], 3],
  ['integrasi-dan-sistem', 'Kesalahan Umum: Mengabaikan Pengujian Sistem Keseluruhan', [
    { t: 'p', x: 'Setiap modul mungkin berfungsi dengan baik secara individu, tetapi gagal ketika digabungkan karena data atau asumsi yang tidak cocok. Pengujian sistem keseluruhan menangkap masalah ini.' },
    { t: 'list', items: ['Menguji setiap modul secara terpisah saja', 'Tidak menguji alur data antar modul', 'Mengabaikan uji lingkungan produksi', 'Mengasumsikan integrasi berhasil karena unit test lulus'] },
    { t: 'tip', x: 'Pengujian sistem keseluruhan adalah jaringan keselamatan terakhir sebelum aplikasi sampai ke pengguna.' },
  ], 3],
  // --- uat-dan-laporan ---
  ['uat-dan-laporan', 'UAT dan Laporan Bug', [
    { t: 'p', x: 'User Acceptance Testing (UAT) adalah pengujian terakhir dilakukan oleh pengguna atau perwakilan mereka untuk memastikan sistem sesuai kebutuhan bisnis sebelum disetujui untuk diluncurkan.' },
    { t: 'list', items: ['Pengujian dilakukan oleh pengguna akhir', 'Fitur diuji sesuai skenario bisnis nyata', 'Hasil UAT menjadi syetuji rilis', 'Masalah ditemukan dicatat dan diperbaiki sebelum rilis'] },
    { t: 'tip', x: 'Jangan biarkan hanya pengembang yang menujui sistem. Libatkan pengguna yang sebenarnya akan menggunakannya.' },
  ], 3],
  ['uat-dan-laporan', 'Menulis Laporan Bug yang Baik', [
    { t: 'p', x: 'Laporan bug yang baik memuat deskripsi yang jelas, langkah untuk mereproduksi, hasil yang diharapkan, dan hasil aktual. Sertakan tangkapan layar jika perlu agar tim pengembang dapat menanggulangi cepat.' },
    { t: 'code', lang: 'text', x: 'Judul: Tombol Simpan tidak merespons setelah mengisi formulir\\nLangkah:\\n1. Buka halaman pendaftaran\\n2. Isi semua kolom\\n3. Klik tombol Simpan\\nHasil yang diharapkan: Data tersimpan dan pindah ke halaman selanjutnya\\nHasil aktual: Tidak terjadi apa-apa saat tombol diklik' },
    { t: 'tip', x: 'Sertakan versi aplikasi, perangkat, dan langkah reproduksi yang detail agar bug dapat diperbaiki tanpa banyak pertanyaan balik.' },
  ], 3],
  ['uat-dan-laporan', 'Kesalahan Umum: Laporan Bug Tidak Lengkap', [
    { t: 'p', x: 'Laporan bug yang hanya mengatakan \"tidak berfungsi\" tanpa detail membuat tim pengembang kesulitan menemukan penyebab dan memperbaiki masalah tersebut.' },
    { t: 'list', items: ['Laporan bug tanpa langkah reproduksi', 'Tidak menyertakan hasil yang diharapkan dan aktual', 'Melaporkan banyak bug dalam satu laporan', 'Tidak menyertakan tangkapan layar atau pesan error'] },
    { t: 'tip', x: 'Satu laporan satu bug agar tim dapat menangani dan melacak kemajuan perbaikan masing-masing.' },
  ], 3],

// --- basis-data-sql ---
  ['relasional-dasar', 'Apa itu Basis Data Relasional', [
    { t: 'p', x: 'Basis data relasional menyimpan data dalam tabel yang saling terhubung melalui kunci. Setiap tabel terdiri dari baris dan kolom, dan relasi antar tabel memungkinkan data terkait dikumpulkan dengan mudah.' },
    { t: 'list', items: ['Data disimpan dalam tabel', 'Setiap tabel memiliki baris dan kolom', 'Kunci utama mengidentifikasi setiap baris secara unik', 'Kunci asing menghubungkan tabel satu sama lain'] },
    { t: 'tip', x: 'Contoh basis data relasional populer adalah MySQL dan PostgreSQL.' },
  ], 3],
  ['relasional-dasar', 'Tabel, Baris, dan Kolom', [
    { t: 'p', x: 'Tabel adalah wadah data, baris adalah satu catatan, dan kolom adalah satu atribut atau properti dari catatan tersebut. Setiap kolom memiliki tipe data yang menentukan jenis nilai yang boleh disimpan.' },
    { t: 'code', lang: 'sql', x: 'CREATE TABLE siswa (\\n  id INT PRIMARY KEY,\\n  nama VARCHAR(100),\\n  umur INT,\\n  email VARCHAR(100)\\n);\\n\\nINSERT INTO siswa (id, nama, umur, email) VALUES\\n  (1, \"Rafi\", 20, \"rafi@example.com\");' },
    { t: 'tip', x: 'Pilih tipe data yang sesuai untuk setiap kolom agar data disimpan secara efisien dan valid.' },
  ], 3],
  ['relasional-dasar', 'Kunci Utama dan Kunci Asing', [
    { t: 'p', x: 'Kunci utama (primary key) mengidentifikasi setiap baris dalam tabel secara unik. Kunci asing (foreign key) merujuk ke kunci utama di tabel lain, sehingga membentuk relasi antar tabel.' },
    { t: 'list', items: ['Setiap tabel harus memiliki satu kunci utama', 'Kunci utama tidak boleh bernilai kosong dan tidak boleh duplikat', 'Kunci asing mengacu pada kunci utama tabel lain', 'Relasi memastikan integritas data antar tabel'] },
    { t: 'tip', x: 'Gunakan kunci asing untuk menghubungkan data terkait, misal pesanan terkait pelanggan yang memesan.' },
  ], 3],
  ['relasional-dasar', 'Kesalahan Umum: Mengabaikan Integritas Relasi', [
    { t: 'p', x: 'Menghapus data yang masih dirujuk oleh tabel lain akan menyebabkan relasi rusak dan data menjadi tidak konsisten. Gunakan aturan integritas referensial untuk mencegah hal ini.' },
    { t: 'list', items: ['Menghapus pelanggan yang masih memiliki pesanan', 'Mengubah kunci utama yang dirujuk oleh tabel lain', 'Menyimpan kunci asing yang tidak ada di tabel acuan', 'Mengabaikan aturan ON DELETE dan ON UPDATE'] },
    { t: 'tip', x: 'Gunakan ON DELETE CASCADE atau ON DELETE SET NULL untuk mengatur apa yang terjadi saat data acuan dihapus.' },
  ], 3],
  // --- query-sql ---
  ['query-sql', 'Query SQL Dasar: SELECT', [
    { t: 'p', x: 'SELECT digunakan untuk mengambil data dari tabel. Kamu dapat menentukan kolom yang ingin diambil, membatasi jumlah baris, dan mengurutkan hasilnya.' },
    { t: 'code', lang: 'sql', x: 'SELECT nama, email FROM siswa\\nWHERE umur >= 17\\nORDER BY nama ASC\\nLIMIT 10;' },
    { t: 'list', items: ['SELECT menentukan kolom yang diambil', 'FROM menentukan tabel sumber', 'WHERE menyaring baris berdasarkan kondisi', 'ORDER BY mengurutkan hasil'] },
    { t: 'tip', x: 'Hindari SELECT * di produksi. Pilih hanya kolom yang dibutuhkan agar query lebih efisien.' },
  ], 4],
  ['query-sql', 'INSERT, UPDATE, dan DELETE', [
    { t: 'p', x: 'INSERT menambah data baru, UPDATE mengubah data yang sudah ada, dan DELETE menghapus data dari tabel. Selalu sertakan klausa WHERE pada UPDATE dan DELETE agar tidak mempengaruhi seluruh tabel.' },
    { t: 'code', lang: 'sql', x: 'INSERT INTO siswa (nama, umur, email) VALUES (\"Kanaya\", 19, \"kanaya@example.com\");\\n\\nUPDATE siswa SET umur = 21 WHERE id = 1;\\n\\nDELETE FROM siswa WHERE id = 1;' },
    { t: 'list', items: ['INSERT untuk menambah data baru', 'UPDATE untuk mengubah data yang ada', 'DELETE untuk menghapus data', 'Selalu sertakan WHERE pada UPDATE dan DELETE'] },
    { t: 'tip', x: 'Jalankan SELECT dengan WHERE yang sama sebelum UPDATE atau DELETE untuk memastikan data yang akan diubah benar.' },
  ], 3],
  ['query-sql', 'Kesalahan Umum: Tanpa Klausa WHERE', [
    { t: 'p', x: 'Menjalankan UPDATE atau DELETE tanpa klausa WHERE akan mempengaruhi semua baris dalam tabel, bukan hanya satu baris yang diinginkan. Ini dapat menyebabkan kehilangan data secara massal.' },
    { t: 'list', items: ['UPDATE tanpa WHERE mengubah seluruh tabel', 'DELETE tanpa WHERE menghapus semua data', 'Tidak memverifikasi data sebelum diubah', 'Tidak membuat cadangan sebelum operasi massal'] },
    { t: 'tip', x: 'Selalu periksa klausa WHERE sebelum menjalankan UPDATE atau DELETE di basis data produksi.' },
  ], 3],
  // --- join-dan-indeks ---
  ['join-dan-indeks', 'JOIN: Menggabungkan Tabel', [
    { t: 'p', x: 'JOIN digunakan untuk menggabungkan data dari dua atau lebih tabel berdasarkan kunci yang terkait. Tipe JOIN umum adalah INNER JOIN, LEFT JOIN, dan RIGHT JOIN.' },
    { t: 'code', lang: 'sql', x: 'SELECT siswa.nama, nilai.skor\\nFROM siswa\\nINNER JOIN nilai ON siswa.id = nilai.siswa_id\\nWHERE nilai.skor >= 80;' },
    { t: 'list', items: ['INNER JOIN hanya mencocokkan baris yang ada di kedua tabel', 'LEFT JOIN menyertakan semua baris dari tabel kiri', 'RIGHT JOIN menyertakan semua baris dari tabel kanan', 'JOIN bergantung pada kolom yang memiliki relasi'] },
    { t: 'tip', x: 'Gunakan INNER JOIN jika hanya butuh data yang tersedia di kedua tabel, dan LEFT JOIN jika ingin menyertakan semua data dari tabel utama.' },
  ], 3],
  ['join-dan-indeks', 'Indeks untuk Kecepatan Query', [
    { t: 'p', x: 'Indeks adalah struktur data yang mempercepat pencarian data dalam tabel. Tanpa indeks, basis data harus memeriksa setiap baris satu per satu saat mencari data.' },
    { t: 'list', items: ['Indeks mempercepat pencarian dan pengurutan', 'Buat indeks pada kolom yang sering digunakan dalam WHERE', 'Terlalu banyak indeks dapat memperlambat INSERT dan UPDATE', 'Indeks membutuhkan penyimpanan tambahan'] },
    { t: 'tip', x: 'Buat indeks pada kolom kunci utama dan kolom yang sering digunakan untuk mencari atau mengurutkan data.' },
  ], 3],
  ['join-dan-indeks', 'Kesalahan Umum: Query Tanpa Indeks pada Tabel Besar', [
    { t: 'p', x: 'Pada tabel dengan jutaan baris, query tanpa indeks akan sangat lambat karena basis data memindai setiap baris. Ini dikenal sebagai full table scan.' },
    { t: 'list', items: ['Query lambat pada tabel besar tanpa indeks', 'Full table scan memeriksa setiap baris', 'Tidak ada indeks pada kolom yang sering dicari', 'Basis data membutuhkan waktu lama untuk mengembalikan hasil'] },
    { t: 'tip', x: 'Gunakan EXPLAIN untuk menganalisis query dan memeriksa apakah indeks digunakan dengan benar.' },
  ], 3],
  // --- mysql-postgresql ---
  ['mysql-postgresql', 'MySQL dan PostgreSQL', [
    { t: 'p', x: 'MySQL dan PostgreSQL adalah dua basis data relasional populer. MySQL dikenal cepat dan mudah digunakan, sedangkan PostgreSQL dikenal fitur canggih dan standar SQL yang ketat.' },
    { t: 'list', items: ['MySQL: populer untuk aplikasi web, mudah diatur', 'PostgreSQL: mendukung tipe data kompleks dan query lanjutan', 'Keduanya gratis dan open source', 'Pilih berdasarkan kebutuhan aplikasi dan tim'] },
    { t: 'tip', x: 'Keduanya menggunakan SQL, jadi pemindahan dari satu ke yang lain relatif mudah meski ada perbedaan fitur lanjutan.' },
  ], 3],
  ['mysql-postgresql', 'Koneksi dari Aplikasi', [
    { t: 'p', x: 'Aplikasi terhubung ke basis data melalui driver yang sesuai, misal pg untuk PostgreSQL di Node.js atau PDO untuk MySQL di PHP. Konfigurasi meliputi host, port, nama basis data, pengguna, dan kata sandi.' },
    { t: 'code', lang: 'js', x: 'const { Pool } = require(\"pg\");\\nconst pool = new Pool({\\n  host: \"localhost\",\\n  port: 5432,\\n  database: \"eduverse\",\\n  user: \"postgres\",\\n  password: \"rahasia\",\\n});' },
    { t: 'tip', x: 'Jangan simpan kata sandi basis data langsung dalam kode. Gunakan variabel lingkungan.' },
  ], 3],
  ['mysql-postgresql', 'Kesalahan Umum: Koneksi Tidak Ditutup', [
    { t: 'p', x: 'Membuka banyak koneksi basis data tanpa menutupnya dapat menyebabkan basis data kehabisan koneksi yang tersedia dan aplikasi menjadi tidak dapat diakses.' },
    { t: 'list', items: ['Membuka koneksi baru untuk setiap query', 'Tidak menutup koneksi setelah selesai digunakan', 'Menggunakan terlalu banyak koneksi secara bersamaan', 'Tidak menggunakan connection pool'] },
    { t: 'tip', x: 'Gunakan connection pool agar koneksi dapat digunakan kembali dan tidak perlu dibuat baru setiap kali.' },
  ], 3],
  // --- nosql-mongodb ---
  ['nosql-apa-itu', 'Apa itu NoSQL', [
    { t: 'p', x: 'NoSQL adalah basis data non-relational yang menyimpan data dalam format yang fleksibel, bukan tabel baris dan kolom. NoSQL cocok untuk data yang struktur berubah-ubah dan perlu skalabilitas tinggi.' },
    { t: 'list', items: ['Tidak memerlukan skema tetap', 'Menyimpan data dalam dokumen, kunci-nilai, atau graf', 'Cocok untuk data besar dan berkembang cepat', 'Skalabilitas horizontal yang mudah'] },
    { t: 'tip', x: 'Pilih NoSQL jika data Anda tidak memiliki struktur tetap atau perlu berkembang dengan cepat.' },
  ], 3],
  ['nosql-apa-itu', 'MongoDB Dasar', [
    { t: 'p', x: 'MongoDB adalah basis data NoSQL yang menyimpan data dalam dokumen BSON (mirip JSON). Setiap dokumen dapat memiliki struktur yang berbeda, sehingga sangat fleksibel untuk pengembangan cepat.' },
    { t: 'code', lang: 'js', x: 'db.siswa.insertOne({\\n  nama: \"Rafi\",\\n  umur: 20,\\n  hobi: [\"coding\", \"membaca\"]\\n});\\n\\ndb.siswa.find({ umur: { $gte: 17 } });' },
    { t: 'tip', x: 'MongoDB menggunakan format serupa JSON, sehingga mudah dipahami oleh pengembang JavaScript.' },
  ], 3],
  ['nosql-apa-itu', 'Kesalahan Umum: Tanpa Perencanaan Skema', [
    { t: 'p', x: 'Meskipun NoSQL fleksibel, tanpa perencanaan skema data akan menjadi tidak konsisten dan sulit dielola saat aplikasi berkembang. Tentukan pola dokumen yang akan digunakan.' },
    { t: 'list', items: ['Setiap dokumen memiliki struktur yang sangat berbeda', 'Tidak ada aturan untuk kolom wajib', 'Sulit melakukan query data yang tidak konsisten', 'Aplikasi menjadi sulit dirawat'] },
    { t: 'tip', x: 'Meski fleksibel, tetap tetapkan standar struktur dokumen untuk setiap koleksi.' },
  ], 3],
  // --- mongodb-dasar ---
  ['mongodb-dasar', 'Koleksi dan Dokumen', [
    { t: 'p', x: 'Dalam MongoDB, data disimpan dalam dokumen yang dikelompokkan ke dalam koleksi. Koleksi mirip tabel dalam basis data relasional, sedangkan dokumen mirip baris.' },
    { t: 'list', items: ['Koleksi adalah kumpulan dokumen', 'Dokumen disimpan dalam format BSON (mirip JSON)', 'Setiap dokumen dapat memiliki bidang yang berbeda', 'Koleksi tidak memerlukan skema yang ditetapkan sebelumnya'] },
    { t: 'tip', x: 'Nama koleksi biasanya dalam bentuk jamak, misal siswa, produk, pesanan.' },
  ], 3],
  ['mongodb-dasar', 'Insert dan Find', [
    { t: 'p', x: 'insertOne digunakan untuk menambah satu dokumen, sedangkan find digunakan untuk mencari dokumen yang sesuai kriteria. Find dapat difilter dan dibatasi jumlah hasilnya.' },
    { t: 'code', lang: 'js', x: 'db.siswa.insertOne({ nama: \"Kanaya\", umur: 19 });\\n\\nconst hasil = db.siswa.find({ umur: { $gte: 17 } }).limit(5);' },
    { t: 'tip', x: 'Gunakan limit() untuk membatasi jumlah dokumen yang dikembalikan agar respons lebih cepat.' },
  ], 3],
  ['mongodb-dasar', 'Kesalahan Umum: Mengasumsikan Setiap Dokumen Sama', [
    { t: 'p', x: 'Karena dokumen dapat memiliki struktur berbeda, aplikasi harus siap menangani dokumen yang tidak memiliki bidang yang diharapkan. Periksa keberadaan bidang sebelum mengaksesnya.' },
    { t: 'list', items: ['Mengakses bidang yang tidak ada dalam dokumen', 'Mengasumsikan semua dokumen memiliki bidang yang sama', 'Tidak menangani data yang hilang atau null', 'Mengabaikan validasi data saat dimasukkan'] },
    { t: 'tip', x: 'Gunakan validasi skema atau periksa keberadaan bidang sebelum mengakses data dalam dokumen.' },
  ], 3],
  // --- query-dokumen ---
  ['query-dokumen', 'Query Dokumen MongoDB', [
    { t: 'p', x: 'MongoDB menyediakan operator query untuk mencari dokumen berdasarkan kondisi, misal $gt (lebih besar), $lt (lebih kecil), $in (bernilai salah satu), dan $and (kombinasi kondisi).' },
    { t: 'code', lang: 'js', x: 'db.siswa.find({ umur: { $gt: 18 }, nama: \"Rafi\" });\\n\\ndb.produk.find({ harga: { $gte: 100000, $lte: 500000 } });' },
    { t: 'tip', x: 'Gabungkan operator query untuk mencari dokumen yang memenuhi beberapa kriteria sekaligus.' },
  ], 3],
  ['query-dokumen', 'Update dan Delete Dokumen', [
    { t: 'p', x: 'updateOne dan updateMany digunakan untuk mengubah dokumen, sedangkan deleteOne dan deleteMany untuk menghapus dokumen. Gunakan filter yang tepat agar hanya dokumen yang diinginkan yang terpengaruh.' },
    { t: 'code', lang: 'js', x: 'db.siswa.updateOne({ nama: \"Rafi\" }, { $set: { umur: 21 } });\\n\\ndb.siswa.deleteOne({ nama: \"Rafi\" });' },
    { t: 'tip', x: 'Gunakan $set untuk mengubah hanya bidang yang ditentukan tanpa menghapus bidang lain dalam dokumen.' },
  ], 3],
  ['query-dokumen', 'Kesalahan Umum: Update Tanpa Filter yang Tepat', [
    { t: 'p', x: 'Menggunakan filter yang terlalu lebar dapat mengubah atau menghapus lebih banyak dokumen dari yang dimaksudkan. Selalu verifikasi filter sebelum menjalankan operasi massal.' },
    { t: 'list', items: ['Mengubah lebih banyak dokumen dari yang diinginkan', 'Menghapus dokumen yang masih diperlukan', 'Tidak memverifikasi hasil setelah operasi', 'Menggunakan filter yang terlalu umum'] },
    { t: 'tip', x: 'Gunakan updateOne untuk mengubah satu dokumen dan verifikasi jumlah dokumen yang terpengaruh.' },
  ], 3],
  // --- agregasi ---
  ['agregasi', 'Agregasi Data', [
    { t: 'p', x: 'Agregasi adalah proses memproses data dan mengembalikan hasil komputasi, misal jumlah total, rata-rata, atau pengelompokan data. MongoDB menggunakan pipeline agregasi dengan tahapan-tahapan seperti $match, $group, dan $sort.' },
    { t: 'code', lang: 'js', x: 'db.nilai.aggregate([\\n  { $group: { _id: \"$siswa_id\", total: { $sum: \"$skor\" } } },\\n  { $sort: { total: -1 } }\\n]);' },
    { t: 'tip', x: 'Pipeline agregasi memproses data secara bertahap, setiap tahapan menerima hasil dari tahapan sebelumnya.' },
  ], 3],
  ['agregasi', 'Pipeline Agregasi', [
    { t: 'p', x: 'Setiap tahapan dalam pipeline agregasi melakukan transformasi pada data. Tumpukan tahapan untuk menghasilkan laporan yang kompleks, seperti mengelompokkan data lalu mengurutkannya.' },
    { t: 'list', items: ['$match menyaring dokumen sebelum diproses', '$group mengelompokkan data dan menghitung agregat', '$sort mengurutkan hasil agregasi', '$limit membatasi jumlah dokumen hasil'] },
    { t: 'tip', x: 'Letakkan $match di awal pipeline untuk mengurangi jumlah data yang diproses tahapan berikutnya.' },
  ], 3],
  ['agregasi', 'Kesalahan Umum: Agregasi pada Data Tanpa Indeks', [
    { t: 'p', x: 'Pipeline agregasi yang memproses koleksi besar tanpa indeks akan sangat lambat. Pastikan bidang yang digunakan dalam $match memiliki indeks agar agregasi cepat.' },
    { t: 'list', items: ['Agregasi lambat pada koleksi besar tanpa indeks', '$match dilakukan di akhir alih-alih awal', 'Tidak ada indeks pada bidang yang digunakan filter', 'Memproses seluruh koleksi untuk hasil yang kecil'] },
    { t: 'tip', x: 'Buat indeks pada bidang yang sering digunakan dalam $match untuk mempercepat agregasi.' },
  ], 3],
  // --- data-science ---
  ['python-untuk-data', 'Python untuk Analisis Data', [
    { t: 'p', x: 'Python adalah bahasa pemrograman populer untuk analisis data karena sintaksnya sederhana dan memiliki pustaka kuat seperti Pandas, NumPy, dan Matplotlib.' },
    { t: 'list', items: ['Pandas untuk manipulasi data tabel', 'NumPy untuk komputasi numerik', 'Matplotlib dan Seaborn untuk visualisasi', 'Jupyter Notebook untuk eksplorasi data interaktif'] },
    { t: 'tip', x: 'Instal pustaka analisis data melalui pip: pip install pandas numpy matplotlib jupyter' },
  ], 4],
  ['python-untuk-data', 'Pandas Dasar', [
    { t: 'p', x: 'Pandas menyediakan struktur data DataFrame yang mirip tabel spreadsheet. DataFrame memudahkan manipulasi data, pemfilteran, dan pengelompokan.' },
    { t: 'code', lang: 'python', x: 'import pandas as pd\\n\\ndata = {\"nama\": [\"Rafi\", \"Kanaya\"], \"umur\": [20, 19]}\\ndf = pd.DataFrame(data)\\n\\nprint(df[df[\"umur\"] >= 20])' },
    { t: 'tip', x: 'Gunakan head() untuk melihat beberapa baris pertama data dan info() untuk ringkasan struktur DataFrame.' },
  ], 3],
  ['python-untuk-data', 'Kesalahan Umum: Mengabaikan Nilai Kosong', [
    { t: 'p', x: 'Nilai kosong (missing value) dapat menyebabkan error atau hasil analisis yang salah. Periksa dan tangani nilai kosong sebelum menganalisis data.' },
    { t: 'list', items: ['Tidak memeriksa nilai kosong sebelum analisis', 'Menghapus baris dengan nilai kosong tanpa Pertimbangan', 'Mengisi nilai kosong dengan nilai yang tidak sesuai', 'Mengabaikan tipe data yang campuran'] },
    { t: 'tip', x: 'Gunakan isnull().sum() untuk menghitung nilai kosong per kolom sebelum memutuskan tindakan.' },
  ], 3],
  // --- statistika-deskriptif ---
  ['statistika-deskriptif', 'Statistika Deskriptif', [
    { t: 'p', x: 'Statistika deskriptif meringkas data menjadi angka yang mudah dipahami, seperti rata-rata, median, nilai minimum dan maksimum, serta simpangan baku.' },
    { t: 'code', lang: 'python', x: 'import pandas as pd\\ndf = pd.DataFrame({\"skor\": [70, 80, 90, 60, 85]})\\n\\nprint(df[\"skor\"].mean())   // rata-rata\\nprint(df[\"skor\"].median()) // median\\nprint(df[\"skor\"].std())    // simpangan baku' },
    { t: 'list', items: ['Rata-rata: nilai tengah dari semua data', 'Median: nilai tengah saat data diurutkan', 'Simpangan baku: sebar data dari rata-rata', 'Minimum dan maksimum: nilai terendah dan tertinggi'] },
    { t: 'tip', x: 'Gunakan median alih-alih rata-rata jika data memiliki pencilan yang sangat mempengaruhi rata-rata.' },
  ], 3],
  ['statistika-deskriptif', 'Distribusi Data', [
    { t: 'p', x: 'Distribusi data menunjukkan sebaran nilai dalam dataset. Histogram dan plot kotak (box plot) membantu mengidentifikasi pola, pencilan, dan kecondongan data.' },
    { t: 'list', items: ['Histogram menunjukkan frekuensi setiap rentang nilai', 'Box plot menunjukkan median, kuartil, dan pencilan', 'Distribusi normal berbentuk lonceng simetris', 'Data condong ke kiri atau kanan disebut skewed'] },
    { t: 'tip', x: 'Visualisasi distribusi sebelum menganalisis lebih lanjut agar Anda memahami karakteristik data.' },
  ], 3],
  ['statistika-deskriptif', 'Kesalahan Umum: Mengabaikan Pencilan (Outlier)', [
    { t: 'p', x: 'Pencilan adalah nilai yang sangat berbeda dari nilai lain. Pencilan dapat memengaruhi rata-rata dan kesimpulan analisis, jadi perlu diidentifikasi dan diputuskan apakah akan dipertahankan atau dihapus.' },
    { t: 'list', items: ['Tidak mengidentifikasi pencilan dalam data', 'Menggunakan rata-rata tanpa mempertimbangkan pencilan', 'Menghapus pencilan tanpa alasan yang jelas', 'Mengabaikan dampak pencilan pada kesimpulan'] },
    { t: 'tip', x: 'Gunakan box plot untuk mengidentifikasi pencilan dan dokumentasikan keputusan tentang pencilan yang ditemukan.' },
  ], 3],
  // --- visualisasi-data ---
  ['visualisasi-data', 'Visualisasi Data', [
    { t: 'p', x: 'Visualisasi data mengubah data menjadi gambar seperti diagram batang, garis, pie, dan sebarkan. Visualisasi yang baik membantu menemukan pola dan menyampaikan insight dengan cepat.' },
    { t: 'code', lang: 'python', x: 'import matplotlib.pyplot as plt\\n\\nplt.bar([\"Matematika\", \"IPA\", \"Bahasa\"], [85, 78, 92])\\nplt.xlabel(\"Mata Pelajaran\")\\nplt.ylabel(\"Nilai Rata-rata\")\\nplt.show()' },
    { t: 'tip', x: 'Pilih jenis diagram yang sesuai dengan data yang ingin disampaikan, jangan hanya memilih yang terlihat menarik.' },
  ], 3],
  ['visualisasi-data', 'Memilih Jenis Diagram', [
    { t: 'p', x: 'Diagram batang untuk membandingkan kategori, diagram garis untuk menunjukkan tren waktu, diagram pie untukProporsi, dan scatter plot untuk hubungan dua variabel numerik.' },
    { t: 'list', items: ['Diagram batang: perbandingan kategori', 'Diagram garis: tren seiring waktu', 'Diagram pie: proporsi bagian dari keseluruhan', 'Scatter plot: hubungan antara dua variabel numerik'] },
    { t: 'tip', x: 'Hindari diagram pie dengan terlalu banyak kategori karena sulit dibaca.' },
  ], 3],
  ['visualisasi-data', 'Kesalahan Umum: Memaksakan Insight dari Visualisasi', [
    { t: 'p', x: 'Jangan menarik kesimpulan hanya berdasarkan visualisasi tanpa verifikasi statistik. Pola dalam diagram dapat disebabkan oleh kebetulan atau data yang tidak lengkap.' },
    { t: 'list', items: ['Menarik kesimpulan hanya dari tampilan diagram', 'Mengabaikan ukuran sampel yang kecil', 'Mengabaikan variabel lain yang mempengaruhi', 'Memaksakan pola yang sebenarnya tidak ada'] },
    { t: 'tip', x: 'Gunakan uji statistik untuk memverifikasi apakah pola dalam visualisasi bermakna atau hanya kebetulan.' },
  ], 3],
  // --- insight-bisnis ---
  ['insight-bisnis', 'Mengubah Data Menjadi Insight Bisnis', [
    { t: 'p', x: 'Insight bisnis adalah kesimpulan berguna dari data yang dapat digunakan untuk membuat keputusan bisnis yang lebih baik. Insight harus spesifik, dapat ditindaklanjuti, dan relevan dengan tujuan bisnis.' },
    { t: 'list', items: ['Identifikasi pola dan tren dalam data', 'Terjemahkan temukan data ke rekomendasi bisnis', 'Pastikan insight relevan dengan tujuan bisnis', 'Sampaikan insight dengan jelas kepada pemangku kepentingan'] },
    { t: 'tip', x: 'Insight yang baik tidak hanya mengatakan apa yang terjadi, tetapi juga mengapa hal itu terjadi dan apa yang harus dilakukan.' },
  ], 3],
  ['insight-bisnis', 'Menyajikan Hasil Analisis', [
    { t: 'p', x: 'Sajikan hasil analisis dalam bentuk yang mudah dipahami oleh audiens non-teknis. Gunakan visualisasi yang jelas, hindari jargon teknis, dan berikan rekomendasi konkret.' },
    { t: 'list', items: ['Gunakan visualisasi yang sederhana dan jelas', 'Hindari istilah teknis yang tidak diperlukan', 'Berikan rekomendasi tindakan yang spesifik', 'Siapkan jawaban atas pertanyaan yang mungkin diajukan'] },
    { t: 'tip', x: 'Fokus pada dampak bisnis dari insight, bukan detail teknis analisis.' },
  ], 3],
  ['insight-bisnis', 'Kesalahan Umum: Insight Tidak Dapat Ditindaklanjuti', [
    { t: 'p', x: 'Insight yang hanya menggambarkan keadaan tanpa rekomendasi tindakan tidak berguna bagi bisnis. Setiap insight harus diikuti oleh langkah apa yang harus dilakukan berdasarkan temuan.' },
    { t: 'list', items: ['Insight hanya menjelaskan apa yang terjadi', 'Tidak ada rekomendasi tindakan yang konkret', 'Insight tidak relevan dengan tujuan bisnis', 'Tidak ditentukan siapa yang bertanggung jawab untuk tindakan'] },
    { t: 'tip', x: 'Akhir setiap presentasi insight dengan rekomendasi tindakan yang jelas dan dapat diukur.' },
  ], 3],
  // --- ai-machine-learning ---
  ['ai-dasar', 'Apa itu Kecerdasan Buatan', [
    { t: 'p', x: 'Kecerdasan buatan (AI) adalah kemampuan mesin untuk melakukan tugas yang biasanya memerlukan kecerdasan manusia, seperti belajar, memecahkan masalah, dan membuat keputusan.' },
    { t: 'list', items: ['AI dapat belajar dari data', 'AI dapat memprediksi hasil berdasarkan pola', 'AI dapat mengotomatiskan tugas berulang', 'AI cocok untuk tugas yang membutuhkan pengolahan data besar'] },
    { t: 'tip', x: 'AI bukan tentang membuat mesin berpikir seperti manusia, melainkan membuat tugas tertentu dapat dilakukan secara otomatis.' },
  ], 3],
  ['ai-dasar', 'Machine Learning Dasar', [
    { t: 'p', x: 'Machine Learning (ML) adalah cabang AI yang memungkinkan komputer belajar dari data tanpa diprogram secara eksplisit untuk setiap tugas. Model ML mencari pola dalam data dan membuat prediksi.' },
    { t: 'code', lang: 'python', x: 'from sklearn.linear_model import LinearRegression\\n\\nmodel = LinearRegression()\\nmodel.fit(X_train, y_train)\\nprediksi = model.predict(X_test)' },
    { t: 'tip', x: 'Pilih algoritma ML berdasarkan jenis masalah: klasifikasi untuk kategori, regresi untuk angka, dan clustering untuk pengelompokan.' },
  ], 4],
  ['ai-dasar', 'Kesalahan Umum: Menggunakan Data Tidak Cukup', [
    { t: 'p', x: 'Model machine learning membutuhkan data yang cukup dan berkualitas untuk belajar pola dengan baik. Data yang terlalu sedikit atau tidak mewakili akan menghasilkan model yang tidak akurat.' },
    { t: 'list', items: ['Data terlalu sedikit untuk melatih model', 'Data tidak mewakili kasus dunia nyata', 'Data dengan banyak kesalahan atau nilai kosong', 'Data yang sudah tua dan tidak relevan lagi'] },
    { t: 'tip', x: 'Kumpulkan lebih banyak data yang berkualitas sebelum melatih model jika hasil awal tidak memuaskan.' },
  ], 3],
  // --- ml-dasar ---
  ['ml-dasar', 'Pelatihan dan Pengujian Model', [
    { t: 'p', x: 'Data dibagi menjadi data latih (training) dan data uji (testing). Model dilatih dengan data latih, kemudian diuji dengan data uji untuk mengukur seberapa baik model mengeneralisasi data baru.' },
    { t: 'list', items: ['Data latih digunakan untuk melatih model', 'Data uji digunakan untuk mengevaluasi model', 'Jangan gunakan data uji selama pelatihan', 'Pilah data secara acak sebelum membagi latih dan uji'] },
    { t: 'tip', x: 'Pembagian umum adalah 80% data latih dan 20% data uji, tergantung pada ukuran dataset.' },
  ], 3],
  ['ml-dasar', 'Overfitting dan Underfitting', [
    { t: 'p', x: 'Overfitting terjadi ketika model terlalu mengingat data latih termasuk kebisingannya, sehingga gagal pada data baru. Underfitting terjadi ketika model terlalu sederhana untuk menangkap pola dalam data.' },
    { t: 'list', items: ['Overfitting: akurasi tinggi pada latih, rendah pada uji', 'Underfitting: akurasi rendah baik pada latih maupun uji', 'Model yang tepat: akurasi baik pada kedua data', 'Gunakan validasi silang untuk mendeteksi overfitting'] },
    { t: 'tip', x: 'Sederhanakan model atau tambahkan data latih jika overfitting, dan gunakan model yang lebih kompleks atau lebih banyak fitur jika underfitting.' },
  ], 3],
  ['ml-dasar', 'Kesalahan Umum: Mengevaluasi pada Data Latih', [
    { t: 'p', x: 'Mengevaluasi model pada data yang sama digunakan untuk melatihnya akan memberikan hasil yang terlalu optimis dan tidak mewakili performa pada data baru.' },
    { t: 'list', items: ['Menguji model pada data latih', 'Tidak memisahkan data latih dan uji', 'Menganggap akurasi tinggi pada latih berarti model bagus', 'Tidak menggunakan data yang tidak pernah dilihat model'] },
    { t: 'tip', x: 'Selalu evaluasi model pada data uji yang belum pernah dilihat selama pelatihan.' },
  ], 3],
  // --- model-prediksi ---
  ['model-prediksi', 'Membuat Prediksi dengan Model', [
    { t: 'p', x: 'Setelah model dilatih dan dievaluasi, gunakan model untuk membuat prediksi pada data baru. Masukkan data baru ke model dan model akan mengembalikan prediksi berdasarkan pola yang telah dipelajari.' },
    { t: 'code', lang: 'python', x: 'data_baru = [[25, 5000000]]\\nprediksi = model.predict(data_baru)\\nprint(f\"Prediksi: {prediksi[0]}\")' },
    { t: 'list', items: ['Siapkan data baru dalam format yang sama dengan data latih', 'Gunakan metode prediksi model', 'Interpretasi hasil prediksi sesuai konteks bisnis', 'Perbarui model secara berkala dengan data baru'] },
    { t: 'tip', x: 'Pastikan data baru telah diproses dengan cara yang sama seperti data latih sebelum prediksi.' },
  ], 3],
  ['model-prediksi', 'Mengevaluasi Akurasi Prediksi', [
    { t: 'p', x: 'Gunakan metrik evaluasi yang sesuai dengan jenis masalah. Untuk klasifikasi gunakan akurasi, presisi, recall, dan F1-score. Untuk regresi gunakan MAE, MSE, dan R-squared.' },
    { t: 'list', items: ['Akurasi: proporsi prediksi yang benar', 'Presisi: seberapa banyak prediksi positif yang benar', 'Recall: seberapa banyak kasus positif yang terdeteksi', 'F1-score: gabungan presisi dan recall'] },
    { t: 'tip', x: 'Pilih metrik yang sesuai dengan tujuan bisnis, misal recall lebih penting untuk deteksi penyakit.' },
  ], 3],
  ['model-prediksi', 'Kesalahan Umum: Mengabaikan Ketidakseimbangan Kelas', [
    { t: 'p', x: 'Jika satu kelas jauh lebih banyak dari kelas lain, akurasi tinggi bisa menipu karena model hanya memprediksi kelas mayoritas. Gunakan teknik penyeimbangan atau metrik yang sesuai.' },
    { t: 'list', items: ['Kelas satu jauh lebih banyak dari yang lain', 'Akurasi tinggi tetapi model gagal mendeteksi kelas minoritas', 'Tidak menggunakan metrik untuk ketidakseimbangan kelas', 'Mengabaikan distribusi kelas dalam data'] },
    { t: 'tip', x: 'Gunakan oversampling, undersampling, atau bobot kelas untuk menangani ketidakseimbangan kelas.' },
  ], 3],
  // --- implementasi ---
  ['implementasi', 'Implementasi Praktis AI', [
    { t: 'p', x: 'Implementasi AI dalam aplikasi nyata melibatkan penyediaan model sebagai layanan (API), integrasi dengan aplikasi existente, dan pemantauan performa model seiring waktu.' },
    { t: 'list', items: ['Sediakan model sebagai API untuk aplikasi lain', 'Integrasikan prediksi ke dalam alur kerja aplikasi', 'Pantau performa model secara berkala', 'Perbarui model dengan data baru secara teratur'] },
    { t: 'tip', x: 'Mulai dengan proyek AI kecil yang menunjukkan nilai bisnis sebelum mengimplementasikan skala besar.' },
  ], 3],
  ['implementasi', 'Etika dan Keamanan AI', [
    { t: 'p', x: 'AI harus digunakan secara etis dan aman. Hindari bias dalam data latih, pastikan transparansi dalam keputusan model, dan lindungi privasi data pengguna.' },
    { t: 'list', items: ['Periksa bias dalam data latih dan model', 'Pastikan keputusan model dapat dijelaskan', 'Lindungi privasi data pengguna', 'Gunakan AI untuk tujuan yang bermanfaat dan tidak merugikan'] },
    { t: 'tip', x: 'Libatkan tim yang beragam dalam pengembangan AI untuk mengurangi risiko bias dan dampak negatif.' },
  ], 3],
  ['implementasi', 'Kesalahan Umum: Mengandalkan AI Tanpa Pengawasan Manusia', [
    { t: 'p', x: 'AI dapat membuat kesalahan, terutama dalam situasi yang tidak pernah dihadapi selama pelatihan. Selalu ada pengawasan manusia untuk keputusan penting yang dihasilkan AI.' },
    { t: 'list', items: ['Mengizinkan AI membuat keputusan kritis tanpa review', 'Mengabaikan kesalahan yang dibuat model', 'Tidak ada mekanisme untuk membatalkan keputusan AI', 'Menganggap AI selalu benar dan objektif'] },
    { t: 'tip', x: 'Gunakan AI sebagai alat bantu pengambilan keputusan, bukan pengganti penilaian manusia sepenuhnya.' },
  ], 3],

// --- jaringan-komputer ---
  ['ip-address-subnetting', 'IP Address dan Subnetting', [
    { t: 'p', x: 'IP address adalah alamat unik yang diberikan kepada setiap perangkat dalam jaringan untuk mengidentifikasinya. Subnetting adalah proses membagi satu jaringan besar menjadi beberapa jaringan yang lebih kecil untuk efisiensi dan keamanan.' },
    { t: 'list', items: ['IPv4 terdiri dari 4 oktet dengan range 0-255', 'IPv6 menggunakan format heksadesimal yang lebih panjang', 'Subnet mask menentukan bagian jaringan dan bagian host', 'Subnetting mengurangi lalu lintas siaran dan meningkatkan keamanan'] },
    { t: 'tip', x: 'Contoh IPv4: 192.168.1.10 dengan subnet mask 255.255.255.0 berarti 254 host dapat terhubung dalam satu subnet.' },
  ], 4],
  ['ip-address-subnetting', 'Kelas IP Address', [
    { t: 'p', x: 'IPv4 dibagi menjadi beberapa kelas (A, B, C, D, E) berdasarkan rentang alamat pertama. Setiap kelas memiliki tujuan yang berbeda, misal kelas C biasa digunakan untuk jaringan kecil.' },
    { t: 'code', lang: 'text', x: 'Kelas A: 1.0.0.0 - 126.0.0.0 (jaringan besar)\\nKelas B: 128.0.0.0 - 191.0.0.0 (jaringan menengah)\\nKelas C: 192.0.0.0 - 223.0.0.0 (jaringan kecil)' },
    { t: 'tip', x: 'Alamat 127.0.0.1 adalah localhost yang merujuk pada komputer sendiri.' },
  ], 3],
  ['ip-address-subnetting', 'IP Publik dan IP Privat', [
    { t: 'p', x: 'IP publik adalah alamat yang dapat diakses dari internet, sedangkan IP privat digunakan dalam jaringan lokal dan tidak dapat diakses langsung dari internet. NAT digunakan untuk menterjemahkan IP privat menjadi IP publik.' },
    { t: 'list', items: ['IP privat kelas A: 10.0.0.0 - 10.255.255.255', 'IP privat kelas B: 172.16.0.0 - 172.31.255.255', 'IP privat kelas C: 192.168.0.0 - 192.168.255.255', 'IP publik dikelola oleh penyedia layanan internet'] },
    { t: 'tip', x: 'Gunakan IP privat untuk perangkat dalam jaringan rumah atau kantor, dan IP publik untuk server yang perlu diakses dari internet.' },
  ], 3],
  ['ip-address-subnetting', 'Kesalahan Umum: IP Duplikat dalam Jaringan', [
    { t: 'p', x: 'Dua perangkat dengan IP yang sama dalam satu jaringan akan menyebabkan konflik IP, sehingga keduanya tidak dapat terhubung ke jaringan dengan benar.' },
    { t: 'list', items: ['IP statis yang bertabrakan dengan perangkat lain', 'DHCP memberikan IP yang sudah digunakan', 'Perangkat berpindah jaringan tanpa memperbarui IP', 'Konfigurasi IP manual yang salah'] },
    { t: 'tip', x: 'Gunakan DHCP untuk alokasi IP otomatis agar menghindari konflik IP secara manual.' },
  ], 3],
  // --- tcpip-dan-osi ---
  ['tcpip-dan-osi', 'Model TCP/IP dan OSI', [
    { t: 'p', x: 'Model TCP/IP dan OSI adalah kerangka konseptual yang menjelaskan bagaimana data dikirim melalui jaringan. OSI memiliki 7 lapisan, sementara TCP/IP memiliki 4 lapisan yang lebih sederhana.' },
    { t: 'list', items: ['Lapisan aplikasi: aplikasi pengguna seperti browser dan email', 'Lapisan transport: TCP dan UDP untuk pengiriman data', 'Lapisan internet: IP untuk pengalamatan dan routing', 'Lapisan jaringan fisik: transmisi bit melalui media'] },
    { t: 'tip', x: 'TCP/IP adalah model yang digunakan dalam internet nyata, sementara OSI lebih banyak digunakan sebagai referensi konsep.' },
  ], 3],
  ['tcpip-dan-osi', 'Protokol TCP dan UDP', [
    { t: 'p', x: 'TCP menyediakan koneksi handal dengan pengiriman data yang dijamin tiba dan dalam urutan yang benar, sedangkan UDP lebih cepat tetapi tidak menjamin pengiriman data.' },
    { t: 'code', lang: 'text', x: 'TCP: browsing web, email, transfer file (handal)\\nUDP: streaming video, VoIP, game online (cepat, tidak perlu handal)' },
    { t: 'tip', x: 'Pilih TCP jika integritas data penting, dan UDP jika kecepatan lebih penting dari pengiriman yang sempurna.' },
  ], 3],
  ['tcpip-dan-osi', 'Kesalahan Umum: Menggunakan UDP untuk Data Kritis', [
    { t: 'p', x: 'Menggunakan UDP untuk data yang memerlukan keandalan, seperti transfer file atau transaksi keuangan, dapat menyebabkan hilangnya data tanpa ada notifikasi.' },
    { t: 'list', items: ['UDP tidak menjamin data sampai ke tujuan', 'UDP tidak mengatur ulang data yang hilang', 'UDP tidak menjamin urutan data', 'TCP lebih lambat karena mekanisme handalnya'] },
    { t: 'tip', x: 'Untuk data yang tidak boleh hilang, selalu gunakan TCP atau lapisan handal di atas UDP.' },
  ], 3],
  // --- routing-switching ---
  ['routing-switching', 'Routing dan Switching', [
    { t: 'p', x: 'Switching adalah pengiriman data dalam satu jaringan lokal berdasarkan alamat MAC, sedangkan routing adalah pengiriman data antar jaringan berdasarkan alamat IP. Router menghubungkan berbagai jaringan, switch menghubungkan perangkat dalam satu jaringan.' },
    { t: 'list', items: ['Switch bekerja pada lapisan data link (Lapisan 2)', 'Router bekerja pada lapisan jaringan (Lapisan 3)', 'Switch menggunakan alamat MAC', 'Router menggunakan alamat IP dan tabel routing'] },
    { t: 'tip', x: 'Router diperlukan untuk menghubungkan jaringan lokal dengan internet, sementara switch digunakan untuk menghubungkan perangkat dalam jaringan lokal.' },
  ], 3],
  ['routing-switching', 'Tabel Routing', [
    { t: 'p', x: 'Tabel routing adalah daftar yang digunakan router untuk menentukan jalur terbaik untuk mengirim paket data ke tujuan. Setiap entri berisi tujuan, prosser selanjutnya (next hop), dan antarmuka yang digunakan.' },
    { t: 'code', lang: 'text', x: 'Tujuan      Next Hop      Antarmuka\\n192.168.1.0 192.168.0.1 eth0\\n0.0.0.0     10.0.0.1    eth1 (default gateway)' },
    { t: 'tip', x: 'Default gateway adalah router yang menangani paket yang tujuannya tidak dikenal dalam tabel routing.' },
  ], 3],
  ['routing-switching', 'Kesalahan Umum: Gateway Tidak Terkonfigurasi', [
    { t: 'p', x: 'Jika perangkat tidak memiliki gateway default yang benar, perangkat dapat berkomunikasi dalam jaringan lokal tetapi tidak dapat mengakses internet atau jaringan lain.' },
    { t: 'list', items: ['Perangkat dapat ping dalam jaringan lokal, tidak bisa ke internet', 'Alamat gateway tidak sesuai dengan router jaringan', 'Gateway tidak ditentukan dalam pengaturan jaringan', 'Router tidak memiliki route ke tujuan'] },
    { t: 'tip', x: 'Pastikan setiap perangkat dalam jaringan memiliki alamat IP, subnet mask, dan gateway default yang benar.' },
  ], 3],
  // --- jaringan-nirkabel ---
  ['jaringan-nirkabel', 'Jaringan Nirkabel (Wi-Fi)', [
    { t: 'p', x: 'Jaringan nirkabel memungkinkan perangkat terhubung tanpa kabel menggunakan gelombang radio. Wi-Fi adalah standar jaringan nirkabel yang paling umum digunakan di rumah dan kantor.' },
    { t: 'list', items: ['SSID adalah nama jaringan Wi-Fi yang ditampilkan', 'Frekuensi 2.4 GHz memiliki jangkauan lebih jauh', 'Frekuensi 5 GHz lebih cepat tetapi jangkauan lebih pendek', 'Enkripsi melindungi data yang ditransmisikan secara nirkabel'] },
    { t: 'tip', x: 'Gunakan frekuensi 5 GHz untuk perangkat yang membutuhkan kecepatan tinggi dan dekat dengan router.' },
  ], 3],
  ['jaringan-nirkabel', 'Keamanan Dasar Wi-Fi', [
    { t: 'p', x: 'Amankan jaringan Wi-Fi dengan kata sandi yang kuat dan enkripsi modern, seperti WPA2 atau WPA3. Hindari enkripsi lama seperti WEP yang mudah diretas.' },
    { t: 'list', items: ['WEP: enkripsi lama, mudah diretas, hindari', 'WPA2: enkripsi yang masih banyak digunakan dan aman', 'WPA3: enkripsi terbaru dengan keamanan lebih baik', 'Kata sandi Wi-Fi harus kuat dan tidak mudah ditebak'] },
    { t: 'tip', x: 'Perbarui firmware router secara teratur untuk memperbaiki kerentanan keamanan yang diketahui.' },
  ], 3],
  ['jaringan-nirkabel', 'Kesalahan Umum: Wi-Fi Tanpa Kata Sandi', [
    { t: 'p', x: 'Jaringan Wi-Fi tanpa kata sandi memungkinkan siapa saja terhubung dan dapat mengintersepsi data yang ditransmisikan, serta menyalahgunakan bandwidth jaringan.' },
    { t: 'list', items: ['Wi-Fi terbuka tanpa enkripsi', 'Kata sandi default yang tidak diubah', 'Enkripsi WEP yang lemah', 'Siapa saja dapat terhubung ke jaringan tanpa izin'] },
    { t: 'tip', x: 'Selalu aktifkan enkripsi WPA2 atau WPA3 dan ganti kata sandi default router segera setelah instalasi.' },
  ], 3],
  // --- sistem-operasi ---
  ['linux-dasar', 'Linux Dasar (Ubuntu/CentOS)', [
    { t: 'p', x: 'Linux adalah sistem operasi open source yang banyak digunakan untuk server, superkomputer, dan perangkat embedding. Ubuntu dan CentOS adalah distribusi populer untuk server.' },
    { t: 'code', lang: 'bash', x: '# Melihat isi folder\\nls -la\\n\\n# Melihat isi file\\ncat nama_file.txt\\n\\n# Membuat folder baru\\nmkdir nama_folder' },
    { t: 'tip', x: 'Perintah Linux bersifat case-sensitive: file.txt berbeda dengan File.txt.' },
  ], 4],
  ['linux-dasar', 'Manajemen File dan Izin', [
    { t: 'p', x: 'Setiap file dan folder di Linux memiliki izin akses untuk pemilik, grup, dan orang lain. Izin terdiri dari baca (read), tulis (write), dan eksekusi (execute).' },
    { t: 'code', lang: 'bash', x: '# Mengubah izin file\\nchmod 644 file.txt\\n\\n# Mengubah pemilik file\\nchown user:grup file.txt' },
    { t: 'tip', x: 'Jangan memberikan izin eksekusi pada file yang tidak perlu agar mengurangi risiko keamanan.' },
  ], 3],
  ['linux-dasar', 'Kesalahan Umum: Menjalankan Semua Perintah sebagai Root', [
    { t: 'p', x: 'Root memiliki akses penuh ke sistem dan dapat mengubah atau menghapus semua file. Menjalankan semua perintah sebagai root berisiko merusak sistem tanpa sengaja.' },
    { t: 'list', items: ['Menggunakan root untuk tugas harian', 'Menghapus file sistem penting tanpa sengaja', 'Mengubah konfigurasi sistem tanpa cadangan', 'Mengizinkan aplikasi berjalan dengan hak root yang berlebihan'] },
    { t: 'tip', x: 'Gunakan sudo hanya ketika diperlukan, dan gunakan akun pengguna biasa untuk tugas sehari-hari.' },
  ], 3],
  // --- windows-dasar ---
  ['windows-dasar', 'Windows Dasar', [
    { t: 'p', x: 'Windows adalah sistem operasi desktop yang paling banyak digunakan di seluruh dunia. Windows menyediakan antarmuka grafis yang mudah digunakan dan mendukung banyak perangkat lunak dan hardware.' },
    { t: 'list', items: ['Antarmuka grafis yang ramah pengguna', 'Mendukung banyak perangkat lunak komersial', 'Terintegrasi dengan layanan Microsoft', 'Digunakan luas di kantor dan rumah'] },
    { t: 'tip', x: 'Perbarui Windows secara teratur untuk memperoleh fitur baru dan perbaikan keamanan.' },
  ], 3],
  ['windows-dasar', 'Panel Kontrol dan Pengaturan Sistem', [
    { t: 'p', x: 'Panel Kontrol dan Pengaturan adalah tempat untuk mengatur sistem, menambahkan atau menghapus program, mengatur jaringan, dan mengelola akun pengguna.' },
    { t: 'list', items: ['Menginstal dan menghapus program', 'Mengatur jaringan dan internet', 'Mengelola akun pengguna dan izin', 'Mengatur tampilan dan personalisasi'] },
    { t: 'tip', x: 'Gunakan fitur pencarian di menu Start untuk cepat menemukan pengaturan yang Anda butuhkan.' },
  ], 3],
  ['windows-dasar', 'Kesalahan Umum: Mengabaikan Pembaruan Sistem', [
    { t: 'p', x: 'Mengabaikan pembaruan Windows membuat sistem rentan terhadap ancaman keamanan dan bug yang telah diperbaiki dalam pembaruan terbaru.' },
    { t: 'list', items: ['Menunda pembaruan secara berulang', 'Tidak menginstal patch keamanan', 'Menggunakan versi Windows yang sudah tidak didukung', 'Mematikan Windows Update secara permanen'] },
    { t: 'tip', x: 'Aktifkan pembaruan otomatis agar sistem selalu mendapatkan perbaikan terbaru.' },
  ], 3],
  // --- macos-dasar ---
  ['macos-dasar', 'macOS Dasar', [
    { t: 'p', x: 'macOS adalah sistem operasi buatan Apple untuk komputer Mac. macOS dikenal dengan antarmuka yang rapi, integrasi dengan perangkat Apple lainnya, dan stabilitas yang baik.' },
    { t: 'list', items: ['Antarmuka yang rapi dan intuitif', 'Integrasi dengan iPhone, iPad, dan Apple Watch', 'App Store untuk pengelolaan aplikasi', 'Terminal untuk perintah baris perintah'] },
    { t: 'tip', x: 'Gunakan Spotlight (Cmd+Spasi) untuk cepat mencari file, aplikasi, dan pengaturan di macOS.' },
  ], 3],
  ['macos-dasar', 'Finder dan Manajemen File', [
    { t: 'p', x: 'Finder adalah pengelola file default di macOS yang digunakan untuk menjelajahi, menyalin, memindahkan, dan menghapus file serta folder.' },
    { t: 'list', items: ['Jelajahi file dan folder dengan Finder', 'Gunakan AirDrop untuk berbagi file antar perangkat Apple', 'Tag file untuk pengorganisasian yang lebih baik', 'Gunakan iCloud untuk sinkronisasi file'] },
    { t: 'tip', x: 'Gunakan tab dalam Finder untuk membuka beberapa lokasi dalam satu jendela.' },
  ], 3],
  ['macos-dasar', 'Kesalahan Umum: Menginstal Aplikasi Dari Sumber Tidak Terpercaya', [
    { t: 'p', x: 'Menginstal aplikasi dari sumber yang tidak terpercaya dapat menimbulkan risiko malware dan ancaman keamanan pada komputer Mac.' },
    { t: 'list', items: ['Menginstal aplikasi dari situs tidak resmi', 'Mengabaikan peringatan keamanan macOS', 'Memberikan izin akses penuh ke aplikasi yang tidak dikenal', 'Mengabaikan pembaruan keamanan macOS'] },
    { t: 'tip', x: 'Instal aplikasi dari App Store atau situs resmi pengembang untuk memastikan keamanan.' },
  ], 3],
  // --- baris-perintah ---
  ['baris-perintah', 'Baris Perintah dan Manajemen File', [
    { t: 'p', x: 'Baris perintah (command line interface) memungkinkan mengoperasikan komputer melalui perintah teks. Baris perintah cepat dan efisien untuk tugas berulang dan otomatisasi.' },
    { t: 'code', lang: 'bash', x: '# Pindah folder\\ncd dokumen\\n\\n# Salin file\\ncp file.txt backup/\\n\\n# Pindah atau ganti nama file\\nmv file.txt nama_baru.txt\\n\\n# Hapus file\\nrm file_lama.txt' },
    { t: 'list', items: ['cd untuk pindah direktori', 'ls untuk melihat isi direktori', 'cp untuk menyalin file', 'mv untuk memindahkan atau mengganti nama file', 'rm untuk menghapus file'] },
    { t: 'tip', x: 'Gunakan tab completion (tekan Tab) untuk melengkapi nama file atau perintah secara otomatis.' },
  ], 3],
  ['baris-perintah', 'Skrip Otomatisasi', [
    { t: 'p', x: 'Skrip baris perintah adalah kumpulan perintah yang disimpan dalam file dan dapat dijalankan secara berurutan. Skrip berguna untuk mengotomatiskan tugas berulang, seperti pencadangan data harian.' },
    { t: 'code', lang: 'bash', x: '#!/bin/bash\\n# Skrip pencadangan sederhana\\ntar -czf backup_$(date +%F).tar.gz /home/user/dokumen' },
    { t: 'tip', x: 'Berikan izin eksekusi pada skrip dengan chmod +x sebelum menjalankannya.' },
  ], 3],
  ['baris-perintah', 'Kesalahan Umum: Menghapus File Tanpa Cadangan', [
    { t: 'p', x: 'Perintah rm di baris perintah menghapus file secara permanen tanpa tempat sampah. Menghapus file yang salah dapat menyebabkan kehilangan data yang tidak dapat dipulihkan.' },
    { t: 'list', items: ['Menghapus file dengan rm tanpa konfirmasi', 'Menggunakan rm -rf pada folder yang salah', 'Tidak membuat cadangan sebelum operasi massal', 'Menghapus file sistem penting'] },
    { t: 'tip', x: 'Gunakan alias rm -i untuk meminta konfirmasi sebelum menghapus setiap file.' },
  ], 3],
  // --- cloud-computing ---
  ['cloud-apa-itu', 'Apa itu Cloud Computing', [
    { t: 'p', x: 'Cloud computing adalah penyediaan layanan komputasi melalui internet, termasuk server, penyimpanan, database, jaringan, dan perangkat lunak, tanpa harus memiliki infrastruktur fisik sendiri.' },
    { t: 'list', items: ['IMS (Infrastructure as a Service): sewa server dan penyimpanan', 'PaaS (Platform as a Service): platform untuk mengembangkan aplikasi', 'SaaS (Software as a Service): perangkat lunak yang digunakan melalui browser', 'Bayar sesuai penggunaan, skalabilitas mudah'] },
    { t: 'tip', x: 'Cloud computing mengurangi kebutuhan membeli dan memelihara perangkat keras sendiri.' },
  ], 3],
  ['cloud-apa-itu', 'Model Layanan Cloud', [
    { t: 'p', x: 'IaaS memberikan kontrol penuh atas infrastruktur virtual, PaaS menyediakan platform pengembangan tanpa mengelola server bawahnya, dan SaaS menyediakan aplikasi siap pakai melalui internet.' },
    { t: 'code', lang: 'text', x: 'IaaS: AWS EC2, Google Compute Engine\\nPaaS: AWS Elastic Beanstalk, Google App Engine\\nSaaS: Gmail, Microsoft 365, Salesforce' },
    { t: 'tip', x: 'Pilih SaaS untuk aplikasi siap pakai, PaaS untuk pengembangan aplikasi, dan IaaS jika butuh kontrol infrastruktur penuh.' },
  ], 3],
  ['cloud-apa-itu', 'Kesalahan Umum: Biaya Cloud Tidak Terkontrol', [
    { t: 'p', x: 'Cloud computing memberikan fleksibilitas, tetapi tanpa pemantauan biaya, pengeluaran dapat melampaui anggaran karena sumber daya yang tidak dimatikan atau overprovisioning.' },
    { t: 'list', items: ['Membiarkan server berjalan terus menerus tanpa digunakan', 'Menyediakan sumber daya lebih besar dari yang dibutuhkan', 'Tidak memantau penggunaan cloud', 'Tidak mengatur peringatan biaya'] },
    { t: 'tip', x: 'Atur peringatan biaya (billing alert) dan matikan sumber daya yang tidak digunakan untuk mengontrol pengeluaran cloud.' },
  ], 3],
  // --- aws-dasar ---
  ['aws-dasar', 'AWS Dasar', [
    { t: 'p', x: 'Amazon Web Services (AWS) adalah platform cloud komprehensif yang menyediakan berbagai layanan, termasuk komputasi, penyimpanan, database, jaringan, dan AI. AWS memiliki pusat data di banyak wilayah di seluruh dunia.' },
    { t: 'list', items: ['EC2: server virtual di cloud', 'S3: penyimpanan objek yang scalable', 'RDS: basis data terkelola', 'Lambda: komputasi tanpa server'] },
    { t: 'tip', x: 'Mulai dengan layanan AWS dalam tingkat gratis (free tier) untuk belajar tanpa biaya awal.' },
  ], 3],
  ['aws-dasar', 'EC2 dan S3', [
    { t: 'p', x: 'EC2 menyediakan server virtual yang dapat dikonfigurasi sesuai kebutuhan, sementara S3 menyediakan penyimpanan untuk file dan objek yang dapat diakses dari mana saja.' },
    { t: 'code', lang: 'bash', x: '# Mengunggah file ke S3\\naws s3 cp file.txt s3://nama-bucket/\\n\\n# Melihat isi bucket\\naws s3 ls s3://nama-bucket/' },
    { t: 'tip', x: 'Gunakan S3 untuk menyimpan file statis seperti gambar, dokumen, dan cadangan data.' },
  ], 3],
  ['aws-dasar', 'Kesalahan Umum: Bucket S3 Publik Tanpa Sengaja', [
    { t: 'p', x: 'Mengatur bucket S3 sebagai publik tanpa sengaja dapat membuat file sensitif dapat diakses oleh siapa saja melalui internet. Periksa kebijakan akses bucket sebelum mengunggah file.' },
    { t: 'list', items: ['Bucket S3 diatur sebagai publik tanpa sengaja', 'File sensitif diunggah tanpa batasan akses', 'Kebijakan bucket terlalu permisif', 'Tidak memeriksa akses publik setelah konfigurasi'] },
    { t: 'tip', x: 'Gunakan AWS Access Analyzer untuk memeriksa sumber daya yang dapat diakses secara publik.' },
  ], 3],
  // --- gcp-dasar ---
  ['gcp-dasar', 'GCP Dasar', [
    { t: 'p', x: 'Google Cloud Platform (GCP) adalah layanan cloud buatan Google yang menyediakan komputasi, penyimpanan, data, AI, dan machine learning. GCP menggunakan infrastruktur yang sama dengan layanan Google seperti Search dan YouTube.' },
    { t: 'list', items: ['Compute Engine: mesin virtual', 'Cloud Storage: penyimpanan objek', 'BigQuery: analisis data besar', 'Vertex AI: platform machine learning'] },
    { t: 'tip', x: 'GCP menawarkan kredit gratis untuk pengguna baru untuk mencoba layanan cloud.' },
  ], 3],
  ['gcp-dasar', 'Compute Engine dan Cloud Storage', [
    { t: 'p', x: 'Compute Engine menyediakan mesin virtual yang dapat disesuaikan, sementara Cloud Storage menyediakan penyimpanan objek yang scalable dan tersedia tinggi.' },
    { t: 'code', lang: 'bash', x: '# Membuat instance Compute Engine\\ngcloud compute instances create nama-instance --zone=us-central1-a\\n\\n# Mengunggah file ke Cloud Storage\\ngsutil cp file.txt gs://nama-bucket/' },
    { t: 'tip', x: 'Pilih zona yang terdekat dengan pengguna untuk mengurangi latensi.' },
  ], 3],
  ['gcp-dasar', 'Kesalahan Umum: IAM Izin Terlalu Luas', [
    { t: 'p', x: 'Memberikan izin Owner ke semua pengguna dalam proyek GCP berisiko keamanan karena siapa saja dapat mengubah atau menghapus sumber daya. Gunakan prinsip izin terkecil (least privilege).' },
    { t: 'list', items: ['Memberikan izin Owner ke semua anggota tim', 'Tidak membatasi akses akun layanan', 'Menggunakan kunci API tanpa batasan', 'Tidak meninjau izin IAM secara berkala'] },
    { t: 'tip', x: 'Berikan izin sesuai tugas yang diperlukan, bukan izin penuh untuk semua orang.' },
  ], 3],
  // --- azure-dasar ---
  ['azure-dasar', 'Azure Dasar', [
    { t: 'p', x: 'Microsoft Azure adalah platform cloud yang menyediakan layanan komputasi, penyimpanan, jaringan, database, dan AI. Azure terintegrasi dengan baik dengan produk Microsoft seperti Windows Server dan Office 365.' },
    { t: 'list', items: ['Azure Virtual Machines: server virtual', 'Azure Blob Storage: penyimpanan objek', 'Azure SQL Database: basis data terkelola', 'Azure Functions: komputasi tanpa server'] },
    { t: 'tip', x: 'Azure cocok untuk organisasi yang sudah menggunakan produk Microsoft di lingkungan mereka.' },
  ], 3],
  ['azure-dasar', 'Virtual Machines dan Blob Storage', [
    { t: 'p', x: 'Azure Virtual Machines memungkinkan menjalankan server virtual dengan Windows atau Linux, sementara Azure Blob Storage menyimpan data tidak terstruktur dalam jumlah besar.' },
    { t: 'code', lang: 'bash', x: '# Membuat grup sumber daya\\naz group create --nama-sumber-daya grupSaya --lokasi asia Tenggara\\n\\n# Membuat virtual machine\\naz vm create --nama-sumber-daya grupSaya --nama vmSaya --image UbuntuLTS' },
    { t: 'tip', x: 'Gunakan Azure Blob Storage untuk menyimpan cadangan, file media, dan data arsip.' },
  ], 3],
  ['azure-dasar', 'Kesalahan Umum: Mengabaikan Cadangan Cloud', [
    { t: 'p', x: 'Data yang disimpan di cloud masih dapat hilang karena kesalahan konfigurasi, penyalahgunaan, atau gangguan penyedia cloud. Lakukan cadangan secara teratur ke lokasi terpisah.' },
    { t: 'list', items: ['Tidak melakukan cadangan data cloud', 'Cadangan disimpan di wilayah yang sama saja', 'Tidak menguji pemulihan cadangan', 'Cadangan tidak dijadwalkan secara teratur'] },
    { t: 'tip', x: 'Gunakan fitur cadangan bawaan penyedia cloud dan simpan cadangan di wilayah geografis yang berbeda.' },
  ], 3],
  // --- cyber-security ---
  ['kriptografi', 'Kriptografi Dasar', [
    { t: 'p', x: 'Kriptografi adalah ilmu mengamankan informasi dengan mengubah data yang dapat dibaca menjadi kode yang tidak dapat dipahami oleh orang yang tidak berwenang. Enkripsi melindungi data saat disimpan dan saat dikirim.' },
    { t: 'list', items: ['Enkripsi simetris: satu kunci untuk enkripsi dan dekripsi', 'Enkripsi asimetris: kunci publik dan kunci pribadi', 'Fungsi hash: mengubah data menjadi nilai tetap yang tidak dapat diubah kembali', 'Sertifikat SSL/TLS: mengamankan koneksi situs web'] },
    { t: 'tip', x: 'Gunakan enkripsi yang sudah teruji dan standar industri, jangan buat algoritma enkripsi sendiri.' },
  ], 3],
  ['kriptografi', 'Enkripsi dan Hashing', [
    { t: 'p', x: 'Enkripsi dapat diubah kembali ke data asli dengan kunci yang benar, sedangkan hashing adalah proses satu arah yang tidak dapat diubah kembali. Hashing sering digunakan untuk menyimpan kata sandi secara aman.' },
    { t: 'code', lang: 'text', x: 'Enkripsi: data asli -> kunci -> data terenkripsi -> kunci -> data asli\\nHashing: data asli -> fungsi hash -> nilai hash (tidak dapat dikembalikan)' },
    { t: 'tip', x: 'Gunakan bcrypt atau Argon2 untuk menyimpan kata sandi, bukan MD5 atau SHA1 yang sudah lama dan tidak aman.' },
  ], 3],
  ['kriptografi', 'Kesalahan Umum: Menyimpan Kata Sandi Dalam Bentuk Teks Biasa', [
    { t: 'p', x: 'Menyimpan kata sandi dalam bentuk teks biasa (plain text) sangat berbahaya karena jika database bocor, semua kata sandi pengguna akan terungkap dengan segera.' },
    { t: 'list', items: ['Menyimpan kata sandi tanpa enkripsi', 'Menggunakan enkripsi yang dapat diubah kembali untuk kata sandi', 'Tidak menambahkan salt saat hashing kata sandi', 'Menggunakan algoritma hashing yang sudah lama dan rentan'] },
    { t: 'tip', x: 'Selalu hash kata sandi dengan algoritma modern dan tambahkan salt unik untuk setiap pengguna.' },
  ], 3],
  // --- ethical-hacking ---
  ['ethical-hacking', 'Ethical Hacking Dasar', [
    { t: 'p', x: 'Ethical hacking adalah praktik menguji keamanan sistem dengan izin untuk menemukan dan memperbaiki kerentanan sebelum diserang oleh penjahat siber. Ethical hacker bekerja untuk meningkatkan keamanan, bukan merusak.' },
    { t: 'list', items: ['Uji keamanan dengan izin tertulis dari pemilik sistem', 'Temukan kerentanan dan laporkan ke tim pengembang', 'Perbaiki kerentanan yang ditemukan', 'Ikuti etika dan hukum dalam setiap pengujian'] },
    { t: 'tip', x: 'Jangan pernah melakukan pengujian keamanan pada sistem yang Anda tidak punya izin untuk mengujinya.' },
  ], 3],
  ['ethical-hacking', 'Pengujian Kecepatan dan Kerentanan', [
    { t: 'p', x: 'Pengujian kecepatan (penetration testing) mensimulasikan serangan nyata untuk menguji seberapa kuat pertahanan sistem. Hasil pengujian digunakan untuk memperbaiki kelemahan yang ditemukan.' },
    { t: 'list', items: ['Reconnaissance: mengumpulkan informasi tentang target', 'Scanning: mencari port dan layanan yang terbuka', 'Exploiting: mencoba mengeksploitasi kerentanan', 'Reporting: melaporkan temuan dan rekomendasi perbaikan'] },
    { t: 'tip', x: 'Lakukan pengujian kecepatan secara berkala, bukan hanya sekali saat sistem pertama kali dibangun.' },
  ], 3],
  ['ethical-hacking', 'Kesalahan Umum: Mengabaikan Izin Tertulis', [
    { t: 'p', x: 'Menguji keamanan sistem tanpa izin tertulis dari pemilik sistem adalah ilegal dan dapat dikenakan sanksi hukum, bahkan jika niatnya baik untuk meningkatkan keamanan.' },
    { t: 'list', items: ['Menguji sistem tanpa izin pemilik', 'Mengakses data tanpa kewenangan', 'Membagikan temuan kerentanan kepada pihak ketiga', 'Menggunakan alat pengujian keamanan untuk tujuan jahat'] },
    { t: 'tip', x: 'Selalu dapatkan izin tertulis dan kerjasama kelegalan sebelum melakukan pengujian keamanan pada sistem mana pun.' },
  ], 3],
  // --- pertahanan-jaringan ---
  ['pertahanan-jaringan', 'Pertahanan Jaringan', [
    { t: 'p', x: 'Pertahanan jaringan melindungi jaringan dari akses tidak sah dan serangan siber. Firewall, sistem deteksi intrusi, dan VPN adalah alat utama dalam pertahanan jaringan.' },
    { t: 'list', items: ['Firewall memfilter lalu lintas jaringan berdasarkan aturan', 'Sistem deteksi intrusi mencari aktivitas mencurigakan', 'VPN menyandikan koneksi melalui jaringan publik', 'Segmentasi jaringan membatasi dampak serangan'] },
    { t: 'tip', x: 'Konfigurasikan firewall untuk hanya mengizinkan lalu lintas yang diperlukan dan blokir yang lainnya.' },
  ], 3],
  ['pertahanan-jaringan', 'Firewall dan DDoS', [
    { t: 'p', x: 'Firewall melindungi jaringan dari akses tidak sah, sedangkan perlindungan DDoS (Distributed Denial of Service) mencegah jaringan dipenuhi lalu lintas palsu yang membuat layanan tidak tersedia.' },
    { t: 'code', lang: 'text', x: 'Aturan firewall: Izinkan port 80 dan 443 (web)\\nAturan firewall: Blokir semua port lain secara default\\nPerlindungan DDoS: Deteksi lalu lintas tidak normal dan blokir sumbernya' },
    { t: 'tip', x: 'Gunakan layanan perlindungan DDoS dari penyedia cloud untuk mengatasi serangan skala besar.' },
  ], 3],
  ['pertahanan-jaringan', 'Kesalahan Umum: Firewall Tidak Dikonfigurasi', [
    { t: 'p', x: 'Firewall yang tidak dikonfigurasi atau diatur untuk mengizinkan semua lalu lintas tidak memberikan perlindungan yang berarti terhadap ancaman siber.' },
    { t: 'list', items: ['Firewall diatur untuk mengizinkan semua lalu lintas', 'Tidak ada aturan firewall yang ditetapkan', 'Port yang tidak perlu dibuka untuk publik', 'Aturan firewall tidak ditinjau secara berkala'] },
    { t: 'tip', x: 'Terapkan prinsip default-deny: blokir semua lalu lintas, lalu izinkan hanya yang diperlukan.' },
  ], 3],
  // --- pencegahan-malware ---
  ['pencegahan-malware', 'Pencegahan Malware', [
    { t: 'p', x: 'Malware adalah perangkat lunak berbahaya yang dirancang untuk merusak, mencuri data, atau mengakses sistem tanpa izin. Jenis malware termasuk virus, worm, trojan, ransomware, dan spyware.' },
    { t: 'list', items: ['Virus: menyebar dengan melampirkan diri pada file', 'Worm: menyebar secara otomatis melalui jaringan', 'Trojan: menyamar sebagai perangkat lunak yang sah', 'Ransomware: mengunci data dan menebus tebusan'] },
    { t: 'tip', x: 'Instal perangkat lunak antivirus yang terpercaya dan perbarui definisi virus secara teratur.' },
  ], 3],
  ['pencegahan-malware', 'Cara Melindungi dari Malware', [
    { t: 'p', x: 'Jangan mengklik link atau lampiran email yang mencurigakan, perbarui perangkat lunak secara teratur, dan unduh aplikasi hanya dari sumber resmi untuk mencegah infeksi malware.' },
    { t: 'list', items: ['Perbarui sistem operasi dan aplikasi secara teratur', 'Jangan membuka lampiran email dari pengirim yang tidak dikenal', 'Unduh aplikasi dari sumber resmi saja', 'Aktifkan firewall dan antivirus'] },
    { t: 'tip', x: 'Gunakan autentikasi dua faktor (2FA) untuk melindungi akun Anda dari akses tidak sah.' },
  ], 3],
  ['pencegahan-malware', 'Kesalahan Umum: Mengklik Link Mencurigakan', [
    { t: 'p', x: 'Phishing adalah serangan yang menipu pengguna untuk mengklik link atau memberikan informasi sensitif melalui pesan yang tampak sah. Selalu verifikasi pengirim sebelum mengklik link.' },
    { t: 'list', items: ['Mengklik link dalam email dari sumber yang tidak dikenal', 'Masukkan kata sandi pada situs yang tidak terpercaya', 'Mengabaikan peringatan browser tentang situs tidak aman', 'Memberikan informasi pribadi melalui telepon atau pesan'] },
    { t: 'tip', x: 'Periksa alamat email pengirim dan tautan sebelum mengklik. Jika tidak yakin, kunjungi situs resmi secara langsung melalui browser.' },
  ], 3],




];

const BANKS = [
{
    module: 'pemikiran-komputasi',
    title: 'Kuis Pemikiran Komputasi',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa yang dimaksud dengan pemikiran komputasi?', ['Cara berfikir seperti komputer', 'Cara memecah masalah besar menjadi langkah-langkah kecil', 'Cara memprogram komputer', 'Cara mengoperasikan komputer'], 1, 'Pemikiran komputasi adalah memecah masalah besar menjadi langkah-langkah kecil yang terstruktur.'],
      ['Indeks array dimulai dari berapa?', ['0', '1', '2', '10'], 0, 'Dalam kebanyakan bahasa pemrograman, indeks array dimulai dari 0.'],
      ['Apa itu pseudocode?', ['Kode yang sudah berjalan', 'Alur logika dalam bahasa sehari-hari', 'Kode yang tidak bisa dijalankan', 'Kode dalam bahasa asing'], 1, 'Pseudocode adalah representasi alur logika dalam bahasa yang mudah dimengerti manusia.'],
      ['Fungsi rekursi adalah fungsi yang...', ['Memanggil fungsi lain', 'Memanggil dirinya sendiri', 'Tidak pernah berhenti', 'Hanya dipakai sekali'], 1, 'Rekursi adalah fungsi yang memanggil dirinya sendiri dengan kasus yang lebih kecil.'],
      ['O(1) berarti...', ['Waktu selalu sama', 'Waktu bergantung pada data', 'Waktu bertambah dua kali lipat', 'Waktu tidak diketahui'], 0, 'O(1) berarti kompleksitas konstan, waktu eksekusi tidak bergantung pada ukuran input.'],
    ],
  },
  {
    module: 'array-dan-list',
    title: 'Kuis Array dan List',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Indeks pertama dalam array adalah...', ['0', '1', '-1', '10'], 0, 'Indeks array dimulai dari 0.'],
      ['Manakah operasi yang menambah elemen di akhir array?', ['pop', 'push', 'shift', 'unshift'], 1, 'Push menambahkan elemen di akhir array.'],
      ['Apa yang terjadi jika mengakses indeks di luar jangkauan array?', ['Mengembalikan nol', 'Mengembalikan undefined atau error', 'Membuat array baru', 'Menghapus array'], 1, 'Akses indeks di luar jangkauan biasanya mengembalikan undefined atau menyebabkan error.'],
      ['Manakah yang bukan operasi array umum?', ['push', 'pop', 'slice', 'multiply'], 3, 'Multiply bukan operasi standar array.'],
    ],
  },
  {
    module: 'kelas-dan-objek',
    title: 'Kuis Kelas dan Objek',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa perbedaan kelas dan objek?', ['Kelas adalah objek, objek adalah kelas', 'Kelas adalah cetak biru, objek adalah hasil cetaknya', 'Tidak ada perbedaan', 'Objek hanya ada di database'], 1, 'Kelas adalah definisi atau cetak biru, objek adalah instance nyata dari kelas.'],
      ['Kata kunci apa yang biasanya digunakan untuk membuat objek dari kelas?', ['create', 'new', 'make', 'build'], 1, 'Kata kunci new biasanya digunakan untuk membuat instance objek dari kelas.'],
      ['Satu kelas dapat menghasilkan berapa banyak objek?', ['Hanya satu', 'Dua saja', 'Banyak', 'Tidak bisa menghasilkan objek'], 2, 'Satu kelas dapat diinstancekan menjadi banyak objek dengan data yang berbeda.'],
    ],
  },
  {
    module: 'apa-itu-vcs',
    title: 'Kuis Version Control',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa fungsi utama Version Control System?', ['Menulis kode lebih cepat', 'Melacak perubahan file seiring waktu', 'Mengatur tampilan website', 'Menginstal perangkat lunak'], 1, 'VCS melacak setiap perubahan file sehingga kamu dapat kembali ke versi lama kapan saja.'],
      ['Apa itu commit dalam VCS?', ['Menghapus file', 'Menyimpan snapshot perubahan', 'Mengunduh kode', 'Menghapus riwayat'], 1, 'Commit adalah penyimpanan snapshot perubahan pada titik tertentu.'],
    ],
  },

{
    module: 'html-pertama',
    title: 'Kuis Struktur HTML',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tag mana yang menandai isi utama halaman?', ['<section>', '<main>', '<article>', '<div>'], 1, '<main> hanya satu per halaman dan menjadi jangkar utama bagi teknologi bantu.'],
      ['Fungsi atribut alt pada gambar adalah...', ['menentukan tinggi gambar', 'teks pengganti saat gambar tidak terlihat', 'memberi judul tooltip', 'menyimpan hak cipta'], 1, 'alt dibaca pembaca layar dan tampil saat gambar gagal dimuat.'],
      ['Baris <!doctype html> berguna untuk...', ['memuat stylesheet', 'meminta browser memakai mode standar', 'menutup dokumen', 'mendeklarasikan bahasa'], 1, 'Tanpanya browser masuk quirks mode dan kotak model bisa berbeda.'],
      ['Elemen mana paling tepat untuk satu postingan di feed?', ['<div class=\"post\">', '<article>', '<section>', '<aside>'], 1, 'Artikel adalah konten mandiri yang masih masuk akal jika dipindah.'],
      ['Tag <footer> boleh dipakai...', ['hanya sekali di akhir halaman', 'di dalam <article> juga', 'hanya jika ada <nav>', 'tidak boleh sama sekali'], 1, '<footer> bisa menutup halaman, artikel, atau section.'],
    ],
  },
  {
    module: 'css-dasar',
    title: 'Kuis CSS Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Singkatan CSS adalah...', ['Creative Style Sheet', 'Cascading Style Sheet', 'Color Style Sheet', 'Computer Style Sheet'], 1, 'CSS singkatan dari Cascading Style Sheet.'],
      ['Properti mana yang mengatur warna teks?', ['bgcolor', 'color', 'text-color', 'font-color'], 1, 'Properti color mengatur warna teks.'],
      ['Manakah selector untuk elemen dengan class \"kartu\"?', ['#kartu', '.kartu', 'kartu', '*kartu'], 1, 'Selector class menggunakan titik di depan nama class.'],
      ['Apa fungsi border-radius?', ['mengatur warna border', 'membuat sudut melengkung', 'mengatur lebar border', 'menghapus border'], 1, 'border-radius membuat sudut elemen melengkung.'],
    ],
  },
  {
    module: 'responsif',
    title: 'Kuis Layout Responsif',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa arti mobile first?', ['Desain untuk ponsel dulu, lalu layar lebar', 'Desain hanya untuk ponsel', 'Desain untuk desktop dulu', 'Desain tanpa CSS'], 0, 'Mobile first berarti mulai merancang dari tampilan ponsel, lalu menambahkan aturan untuk layar lebih lebar.'],
      ['Aturan CSS mana yang hanya berlaku pada layar lebar dari 720px?', ['@media (min-width: 720px)', '@media (max-width: 720px)', '@media (width: 720px)', '@media (all: 720px)'], 0, '@media (min-width: 720px) berlaku untuk layar lebar minimal 720px.'],
      ['Properti CSS mana untuk menambah jarak antar elemen dalam flex container?', ['margin', 'padding', 'gap', 'space'], 2, 'gap menambah jarak antar item di dalam flex atau grid container.'],
    ],
  },
  {
    module: 'javascript-dasar',
    title: 'Kuis JavaScript Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Deklarasi mana untuk nilai yang tidak akan diganti?', ['var', 'let', 'const', 'static'], 2, 'const mencegah penugasan ulang dan membuat maksud kode jelas.'],
      ['Hasil dari 0 === \"\" adalah...', ['true', 'false', 'TypeError', 'undefined'], 1, '=== membandingkan tipe dan nilai, jadi berbeda.'],
      ['Tipe mana yang BUKAN tipe dasar JavaScript?', ['symbol', 'bigint', 'float', 'boolean'], 2, 'JavaScript hanya punya number (floating point), tidak ada float.'],
      ['Loop mana yang memberi nilai elemen array?', ['for...in', 'for...of', 'while (arr)', 'forEach.index'], 1, 'for...of mengiterasi nilai; for...in mengiterasi kunci.'],
    ],
  },
  {
    module: 'backend-database',
    title: 'Kuis Back-end dan Database',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa yang dilakukan server saat menerima request?', ['Hanya menampilkan halaman', 'Memproses request dan mengirim response', 'Menghapus database', 'Menginstal browser'], 1, 'Server memproses request dari klien dan mengirim response kembali.'],
      ['Status code mana yang berarti \"tidak ditemukan\"?', ['200', '404', '500', '301'], 1, '404 berarti resource yang diminta tidak ditemukan.'],
      ['Mengapa jangan menyimpan password database dalam kode?', ['Kode akan berat', 'Risiko kebocoran kredensial', 'Database tidak akan terbaca', 'Browser tidak mendukung'], 1, 'Kredensial dalam kode bisa terlihat siapa saja yang akses kode. Gunakan environment variables.'],
    ],
  },

{
    module: 'ts-apa-itu',
    title: 'Kuis TypeScript Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa itu TypeScript?', ['JavaScript dengan tipe data statis', 'Bahasa pemrograman baru', 'Database JavaScript', 'Framework CSS'], 0, 'TypeScript adalah JavaScript dengan tambahan tipe data statis.'],
      ['Perintah apa untuk mengompilasi TypeScript?', ['npm run', 'tsc', 'node', 'compile'], 1, 'tsc adalah TypeScript Compiler yang mengubah .ts menjadi .js.'],
      ['Manakah yang bukan tipe dasar TypeScript?', ['string', 'number', 'float', 'boolean'], 2, 'TypeScript hanya punya number, tidak ada tipe float terpisah.'],
      ['File konfigurasi TypeScript disebut...', ['package.json', 'tsconfig.json', 'config.ts', 'settings.json'], 1, 'tsconfig.json menyimpan opsi kompilasi TypeScript.'],
      ['Mengapa hindari menggunakan any?', ['Membuat kode lambat', 'Menghilangkan manfaat pemeriksaan tipe', 'Tidak didukung browser', 'Membuat file besar'], 1, 'any mematikan pemeriksaan tipe TypeScript untuk variabel tersebut.'],
    ],
  },
  {
    module: 'tipe-data',
    title: 'Kuis Tipe Data TypeScript',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tipe mana untuk teks di TypeScript?', ['text', 'string', 'str', 'char'], 1, 'string adalah tipe untuk teks di TypeScript.'],
      ['Array angka ditulis sebagai...', ['number[]', 'Array<number>', 'Kedua di atas', 'number list'], 2, 'Kedua sintaks (number[] dan Array<number>) sama artinya.'],
      ['Enum digunakan untuk...', ['Kumpulan konstanta terkait', 'Fungsi yang berulang', 'Array asosiatif', 'Komponen React'], 0, 'Enum menampung konstanta bernilai yang terkait.'],
    ],
  },
  {
    module: 'interface-dan-type',
    title: 'Kuis Interface dan Type',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Interface digunakan untuk...', ['Mendefinisikan bentuk objek', 'Membuat variabel', 'Mengambil data API', 'Mengganti fungsi'], 0, 'Interface mendefinisikan struktur objek dengan properti dan tipe.'],
      ['Tanda ? pada properti interface berarti...', ['Wajib diisi', 'Opsional boleh diabaikan', 'Hanya boleh dibaca', 'Tidak boleh digunakan'], 1, '? menandakan properti optional yang tidak harus ada.'],
      ['readonly berarti nilai...', ['Boleh diubah kapan saja', 'Tidak boleh diubah setelah dibuat', 'Hanya boleh dibaca sekali', 'Selalu kosong'], 1, 'readonly mencegah perubahan nilai setelah pengisian awal.'],
    ],
  },
  {
    module: 'fungsi-dan-generic',
    title: 'Kuis Fungsi dan Generic',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Generic <T> dalam fungsi berfungsi untuk...', ['Membuat fungsi berjalan lebih cepat', 'Menjaga keamanan tipe untuk berbagai tipe data', 'Mengganti fungsi biasa', 'Menghapus tipe data'], 1, 'Generic memungkinkan fungsi bekerja dengan berbagai tipe sambil aman.'],
      ['number[] sama dengan...', ['Array<number>', 'Array<string>', 'number', 'Array<all>'], 0, 'number[] adalah sintaks pendek untuk Array<number>.'],
    ],
  },
  {
    module: 'react-apa-itu',
    title: 'Kuis React Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['React adalah...', ['Bahasa pemrograman', 'Pustaka JavaScript untuk UI', 'Database', 'Sistem operasi'], 1, 'React adalah pustaka JavaScript untuk membangun antarmuka pengguna.'],
      ['Apa itu JSX?', ['JavaScript XML', 'Sintaks mirip HTML dalam JavaScript', 'Database query', 'Styling CSS'], 1, 'JSX memungkinkan penulisan HTML-like di dalam JavaScript.'],
      ['Apa perintah untuk memulai proyek React dengan Vite?', ['npm create vite@latest', 'npm install react', 'npm start react', 'npm new react'], 0, 'npm create vite@latest adalah cara cepat membuat proyek React dengan Vite.'],
    ],
  },
  {
    module: 'komponen-dan-props',
    title: 'Kuis Komponen dan Props',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Props adalah...', ['Data yang diterima komponen dari induk', 'Fungsi di dalam komponen', 'Style CSS komponen', 'Database komponen'], 0, 'Props adalah data yang diteruskan dari komponen induk ke anak.'],
      ['Props bersifat...', ['Boleh diubah', 'Read-only (hanya dibaca)', 'Selalu kosong', 'Hanya untuk angka'], 1, 'Props tidak boleh diubah oleh komponen yang menerimanya.'],
      ['Apa beda props dan state?', ['Props dari luar, state di dalam komponen', 'Sama saja', 'Props untuk CSS, state untuk HTML', 'Props untuk angka, state untuk teks'], 0, 'Props diterima dari komponen induk; state dielola di dalam komponen sendiri.'],
    ],
  },

{
    module: 'state-dan-event',
    title: 'Kuis State dan Event',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa itu state di React?', ['Data yang dielola di dalam komponen', 'File CSS', 'Database', 'Server API'], 0, 'State adalah data yang dielola di dalam komponen dan dapat berubah seiring waktu.'],
      ['Hook mana untuk membuat state?', ['useState', 'useEffect', 'useRef', 'useContext'], 0, 'useState adalah hook untuk membuat state di React.'],
      ['Apa yang terjadi saat state berubah?', ['Komponen di-render ulang', 'Halaman direfresh', 'Komponen dihapus', 'Tidak terjadi apa-apa'], 0, 'Perubahan state memicu React untuk merender ulang komponen.'],
      ['Cara yang benar untuk mengubah state?', ['setState(nilaiBaru)', 'state = nilaiBaru', 'setState(() => nilaiBaru)', 'state.push(nilaiBaru)'], 0, 'Gunakan fungsi setter dari useState untuk mengubah state.'],
    ],
  },
  {
    module: 'hook-dasar',
    title: 'Kuis Hook Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa itu useEffect?', ['Hook untuk sampingan setelah render', 'Hook untuk state', 'Hook untuk style', 'Hook untuk routing'], 0, 'useEffect digunakan untuk side effect seperti fetch data setelah render.'],
      ['Array kosong [] di useEffect berarti...', ['Jalankan setiap render', 'Jalankan sekali saat mounting', 'Jalankan hanya saat unmount', 'Tidak pernah dijalankan'], 1, 'Array kosong berarti effect berjalan hanya sekali saat komponen dipasang.'],
      ['Custom hook harus diawali dengan kata...', ['use', 'create', 'make', 'hook'], 0, 'Custom hook harus diawali dengan kata use agar React mengenainya sebagai hook.'],
    ],
  },
  {
    module: 'proyek-mini',
    title: 'Kuis Proyek Mini Daftar Tugas',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Mengapa perlu key pada daftar yang di-render?', ['Agar React mengidentifikasi setiap item', 'Untuk styling', 'Untuk mengurangi ukuran file', 'Untuk mengubah warna'], 0, 'Key membantu React mengidentifikasi item yang berubah, ditambah, atau dihapus.'],
      ['Apa itu input terkontrol?', ['Input yang nilainya diatur oleh state', 'Input tanpa state', 'Input yang hanya bisa dibaca', 'Input untuk password'], 0, 'Input terkontrol memiliki value yang diatur oleh state React.'],
    ],
  },
  {
    module: 'next-apa-itu',
    title: 'Kuis Next.js Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Next.js adalah...', ['Framework React untuk produksi', 'Bahasa pemrograman', 'Database', 'Styling CSS'], 0, 'Next.js adalah framework React yang menyediakan fitur produksi seperti SSR dan routing.'],
      ['Perintah untuk membuat proyek Next.js?', ['npx create-next-app@latest', 'npm install next', 'npm new next', 'yarn create react'], 0, 'npx create-next-app@latest adalah cara standar membuat proyek Next.js.'],
      ['App Router menggunakan folder...', ['pages', 'app', 'src', 'components'], 1, 'App Router menggunakan folder app untuk mengatur halaman.'],
    ],
  },
  {
    module: 'routing-dan-ssr',
    title: 'Kuis Routing dan SSR',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['SSR artinya...', ['Server-Side Rendering', 'Static Site Generation', 'Single Page Application', 'Server Side Style'], 0, 'SSR adalah rendering halaman di server sebelum dikirim ke browser.'],
      ['SSG cocok untuk konten yang...', ['Sering berubah', 'Tidak sering berubah', 'Hanya untuk admin', 'Tidak perlu ditampilkan'], 1, 'SSG cocok untuk konten statis yang jarang berubah.'],
      ['Route dinamis menggunakan folder bernama...', ['[id]', '(id)', '{id}', 'id'], 0, 'Folder [id] digunakan untuk route dinamis di Next.js App Router.'],
    ],
  },
  {
    module: 'api-route',
    title: 'Kuis API Route',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['API route di Next.js digunakan untuk...', ['Membuat endpoint API', 'Styling halaman', 'Mengelola database', 'Routing halaman'], 0, 'API route membuat endpoint API di dalam aplikasi Next.js.'],
      ['File API route di App Router bernama...', ['route.js', 'api.js', 'endpoint.js', 'server.js'], 0, 'File route.js di dalam folder app/api menjadi endpoint API.'],
      ['Setiap handler API route harus mengembalikan...', ['Response', 'String', 'Angka', 'Boolean'], 0, 'Handler API route harus mengembalikan objek Response.'],
    ],
  },
  {
    module: 'deploy',
    title: 'Kuis Deployment Next.js',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah untuk build produksi Next.js?', ['npm run build', 'npm start', 'npm run dev', 'npm install'], 0, 'npm run build menghasilkan versi produksi aplikasi Next.js.'],
      ['File untuk variabel lingkungan lokal di Next.js?', ['.env.local', '.env', 'config.env', 'settings.env'], 0, '.env.local adalah file variabel lingkungan untuk pengembangan lokal Next.js.'],
      ['Platform yang paling sesuai untuk deploy Next.js?', ['Vercel', 'MySQL', 'Photoshop', 'Word'], 0, 'Vercel adalah platform yang dibuat oleh tim Next.js untuk deployment.'],
    ],
  },

{
    module: 'node-apa-itu',
    title: 'Kuis Node.js Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Node.js adalah...', ['JavaScript di sisi server', 'Database', 'Framework CSS', 'Bahasa pemrograman baru'], 0, 'Node.js memungkinkan JavaScript berjalan di luar browser.'],
      ['npm singkatan dari...', ['Node Package Manager', 'Node Project Manager', 'Node Process Manager', 'Node Programming Manager'], 0, 'npm adalah manajer paket bawaan Node.js.'],
      ['Perintah untuk memulai proyek Node.js?', ['npm init -y', 'npm start', 'npm install', 'npm run'], 0, 'npm init -y membuat file package.json dengan default.'],
    ],
  },
  {
    module: 'modul-dan-npm',
    title: 'Kuis npm dan Paket',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['File mana yang mencatat dependensi proyek?', ['package.json', 'index.js', 'README.md', 'server.js'], 0, 'package.json adalah manifest proyek Node.js.'],
      ['Folder mana yang tidak boleh di-commit ke Git?', ['node_modules', 'package.json', 'package-lock.json', 'index.js'], 0, 'node_modules sangat besar dan dapat dihasilkan ulang dengan npm install.'],
      ['Perintah untuk menginstal paket?', ['npm install nama-paket', 'npm add nama-paket', 'npm get nama-paket', 'npm new nama-paket'], 0, 'npm install adalah perintah standar untuk menambahkan paket.'],
    ],
  },
  {
    module: 'rest-api',
    title: 'Kuis REST API dengan Express',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Metode HTTP untuk mengambil data?', ['GET', 'POST', 'PUT', 'DELETE'], 0, 'GET digunakan untuk mengambil data dari server.'],
      ['Middleware mana yang diperlukan Express untuk membaca JSON?', ['express.json()', 'express.text()', 'express.html()', 'express.xml()'], 0, 'express.json() memungkinkan Express membaca body JSON.'],
      ['Status code untuk data berhasil dibuat?', ['201', '200', '400', '500'], 0, '201 Created menandakan data berhasil dibuat.'],
    ],
  },
  {
    module: 'database-koneksi',
    title: 'Kuis Database Node.js',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Apa yang dicegah oleh parameterized query?', ['SQL Injection', 'CSS rusak', 'Halaman lambat', 'Error JavaScript'], 0, 'Parameterized query memisahkan perintah SQL dari data input.'],
      ['Driver mana untuk PostgreSQL di Node.js?', ['pg', 'mysql', 'mongoose', 'sqlite3'], 0, 'pg adalah driver PostgreSQL untuk Node.js.'],
      ['Mengapa jangan simpan kata sandi database dalam kode?', ['Mencegah kebocoran kredensial', 'Membuat kode lambat', 'Database tidak terbaca', 'Node.js tidak mendukung'], 0, 'Kredensial dalam kode rentan terlihat oleh orang lain.'],
    ],
  },
  {
    module: 'php-apa-itu',
    title: 'Kuis PHP Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['PHP berjalan di...', ['Server', 'Browser', 'Database', 'Sistem operasi'], 0, 'PHP dieksekusi di sisi server sebelum dikirim ke browser.'],
      ['Variabel PHP dimulai dengan tanda...', ['$', '#', '@', '&'], 0, 'Setiap variabel PHP diawali dengan tanda dolar.'],
      ['Tag pembuka PHP adalah...', ['<?php', '<php>', '<script>', '<?'], 0, '<?php adalah tag pembuka standar PHP.'],
    ],
  },
  {
    module: 'variabel-dan-fungsi',
    title: 'Kuis Variabel dan Fungsi PHP',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tipe data untuk teks di PHP?', ['string', 'text', 'str', 'char'], 0, 'string adalah tipe data untuk teks di PHP.'],
      ['Fungsi untuk mencetak output di PHP?', ['echo', 'print', 'Keduanya', 'write'], 2, 'echo dan print keduanya dapat digunakan untuk mencetak output.'],
      ['Cara menggabungkan string di PHP?', ['Titik (.)', 'Plus (+)', 'Koma (,)', 'Spasi'], 0, 'Titik (.) digunakan untuk konkatenasi string di PHP.'],
    ],
  },

{
    module: 'laravel-apa-itu',
    title: 'Kuis Laravel Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Laravel adalah framework untuk bahasa...', ['PHP', 'JavaScript', 'Python', 'Ruby'], 0, 'Laravel adalah framework PHP modern.'],
      ['Manajer dependensi untuk PHP?', ['Composer', 'npm', 'pip', 'Maven'], 0, 'Composer adalah manajer dependensi PHP.'],
      ['Arsitektur yang digunakan Laravel?', ['MVC', 'MVP', 'MVVM', 'Singleton'], 0, 'Laravel menggunakan arsitektur MVC.'],
      ['Command-line tool bawaan Laravel?', ['php artisan', 'npm run', 'composer install', 'php server'], 0, 'php artisan adalah tool command-line Laravel.'],
    ],
  },
  {
    module: 'eloquent-dan-blade',
    title: 'Kuis Eloquent dan Blade',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Eloquent adalah...', ['ORM bawaan Laravel', 'Database', 'Template engine', 'Web server'], 0, 'Eloquent adalah ORM bawaan Laravel.'],
      ['Direktif Blade untuk mewarisi tata letak?', ['@extends', '@include', '@section', '@yield'], 0, '@extends digunakan untuk mewarisi layout Blade.'],
      ['Mengamankan output dari XSS di Blade?', ['{{ }}', '{!! !!}', '@php', '@echo'], 0, 'Double kurung kurawal {{ }} otomatis meng-escape output.'],
    ],
  },
  {
    module: 'routing-dan-migrasi',
    title: 'Kuis Routing dan Migrasi',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Route untuk mengambil data di Laravel?', ['Route::get', 'Route::post', 'Route::put', 'Route::delete'], 0, 'Route::get digunakan untuk mengambil data.'],
      ['Perintah untuk menjalankan migrasi?', ['php artisan migrate', 'composer install', 'npm run dev', 'php artisan serve'], 0, 'php artisan migrate menjalankan migrasi database.'],
      ['Perintah untuk membuat migrasi baru?', ['php artisan make:migration', 'php artisan migrate', 'php artisan migrate:rollback', 'composer dump-autoload'], 0, 'php artisan make:migration membuat file migrasi baru.'],
    ],
  },
  {
    module: 'proyek-mini',
    title: 'Kuis Proyek Mini Blog Laravel',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Flag untuk generate controller lengkap di Laravel?', ['--resource', '--all', '--full', '--crud'], 0, '--resource menghasilkan semua metode CRUD.'],
      ['Migrasi berguna untuk...', ['Mengontrol versi struktur database', 'Menginstal paket', 'Mengatur route', 'Mengatur view'], 0, 'Migrasi mengontrol versi struktur database.'],
    ],
  },
  {
    module: 'ci-apa-itu',
    title: 'Kuis CodeIgniter Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['CodeIgniter adalah framework...', ['PHP ringan dan cepat', 'JavaScript', 'Database', 'CSS framework'], 0, 'CodeIgniter adalah framework PHP ringan.'],
      ['Command-line tool CodeIgniter 4?', ['php spark', 'npm run', 'php artisan', 'composer'], 0, 'php spark adalah CLI bawaan CodeIgniter 4.'],
      ['Pola arsitektur CodeIgniter?', ['MVC', 'MVP', 'MVP', 'Singleton'], 0, 'CodeIgniter mengikuti pola MVC.'],
    ],
  },
  {
    module: 'mvc-dasar',
    title: 'Kuis MVC CodeIgniter',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['View di CodeIgniter disimpan di folder...', ['app/Views', 'app/Controllers', 'app/Models', 'app/Config'], 0, 'View disimpan di app/Views.'],
      ['Fungsi untuk menampilkan view?', ['view()', 'render()', 'display()', 'show()'], 0, 'view() digunakan untuk menampilkan view di CodeIgniter.'],
      ['Fungsi untuk mencegah XSS pada output?', ['esc()', 'echo()', 'print()', 'html()'], 0, 'esc() mengamankan output dari serangan XSS.'],
    ],
  },
  {
    module: 'query-builder',
    title: 'Kuis Query Builder CodeIgniter',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Metode untuk mengambil semua data?', ['get()', 'insert()', 'update()', 'delete()'], 0, 'get() digunakan untuk mengambil data.'],
      ['Metode untuk menyaring data?', ['where()', 'like()', 'orderBy()', 'limit()'], 0, 'where() digunakan untuk menyaring data.'],
      ['Mengapa jangan lupa where() saat update?', ['Mencegah update seluruh tabel', 'Mempercepat query', 'Menghemat memori', 'Meningkatkan keamanan'], 0, 'Tanpa where(), update akan memperbarui semua baris.'],
    ],
  },
  {
    module: 'proyek-mini',
    title: 'Kuis Proyek Mini Manajemen Kontak',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah untuk membuat model CodeIgniter?', ['php spark make:model', 'php artisan make:model', 'npm create model', 'composer make model'], 0, 'php spark make:model membuat model CodeIgniter.'],
      ['$allowedFields berguna untuk...', ['Mencegah mass assignment', 'Mengatur route', 'Menampilkan view', 'Mengatur database'], 0, '$allowedFields membatasi kolom yang boleh diisi.'],
    ],
  },

{
    module: 'android-studio',
    title: 'Kuis Android Studio',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['IDE resmi untuk pengembangan Android adalah...', ['Android Studio', 'Visual Studio Code', 'Xcode', 'IntelliJ IDEA'], 0, 'Android Studio adalah IDE resmi untuk Android.'],
      ['Fungsi emulator Android adalah...', ['Menulis kode lebih cepat', 'Menguji aplikasi tanpa ponsel nyata', 'Mengunduh aplikasi dari Play Store', 'Mengelola database'], 1, 'Emulator mensimulasikan ponsel Android di komputer.'],
      ['Apa yang harus diaktifkan di BIOS agar emulator cepat?', ['Virtualisasi', 'Bluetooth', 'Wi-Fi', 'Mode penerbangan'], 0, 'Akselerasi perangkat keras (virtualisasi) diperlukan emulator agar cepat.'],
    ],
  },
  {
    module: 'kotlin-dasar',
    title: 'Kuis Kotlin Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Kata kunci Kotlin untuk nilai yang tidak dapat diubah?', ['var', 'val', 'let', 'const'], 1, 'val digunakan untuk nilai immutable di Kotlin.'],
      ['Bahasa resmi Android yang dipilih Google?', ['Kotlin', 'Java', 'Swift', 'Dart'], 0, 'Kotlin adalah bahasa prioritas Android sejak 2019.'],
      ['Operator aman untuk mengakses variabel yang mungkin null?', ['!!.', '?.', '!!', '=='], 1, 'Operator ?. aman karena hanya mengakses jika tidak null.'],
    ],
  },
  {
    module: 'layout-dan-activity',
    title: 'Kuis Activity dan Layout',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Method yang pertama kali dipanggil saat Activity dibuat?', ['onStart', 'onCreate', 'onResume', 'onDestroy'], 1, 'onCreate dipanggil saat activity pertama kali dibuat.'],
      ['Fungsi untuk menentukan layout yang ditampilkan Activity?', ['findViewById', 'setContentView', 'setLayout', 'showLayout'], 1, 'setContentView mengaitkan layout XML ke activity.'],
      ['Tata letak Android yang fleksibel untuk desain kompleks?', ['LinearLayout', 'ConstraintLayout', 'FrameLayout', 'TableLayout'], 1, 'ConstraintLayout lebih fleksibel dan efisien untuk tata letak kompleks.'],
    ],
  },
  {
    module: 'publish-play-store',
    title: 'Kuis Publish Play Store',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Format file yang diterima Play Store untuk rilis produksi?', ['APK', 'AAB', 'JAR', 'ZIP'], 1, 'Android App Bundle (.aab) adalah format yang direkomendasikan Play Store.'],
      ['Angka versi internal yang harus naik setiap rilis?', ['versionName', 'versionCode', 'applicationId', 'minSdk'], 1, 'versionCode adalah angka versi internal yang naik setiap rilis.'],
      ['Izinkan hanya izin yang benar-benar diperlukan agar...', ['Aplikasi lebih cepat', 'Pengguna lebih yakin dan aman', 'Ukuran file lebih kecil', 'Kode lebih ringkas'], 1, 'Izin berlebihan membuat pengguna ragu dan aplikasi rentan.'],
    ],
  },
  {
    module: 'xcode-dan-swift',
    title: 'Kuis Xcode dan Swift',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Sistem operasi yang diperlukan untuk menjalankan Xcode?', ['macOS', 'Windows', 'Linux', 'iOS'], 0, 'Xcode hanya dapat berjalan di macOS.'],
      ['Bahasa pemrograman utama untuk pengembangan iOS?', ['Swift', 'Kotlin', 'Java', 'Dart'], 0, 'Swift adalah bahasa utama untuk ekosistem Apple.'],
      ['IDE resmi Apple untuk pengembangan iOS?', ['Xcode', 'Android Studio', 'Visual Studio', 'IntelliJ'], 0, 'Xcode adalah IDE resmi Apple.'],
    ],
  },
  {
    module: 'swiftui-dasar',
    title: 'Kuis SwiftUI Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Framework Apple untuk tampilan deklaratif di semua platform?', ['UIKit', 'SwiftUI', 'AppKit', 'React Native'], 1, 'SwiftUI adalah framework deklaratif Apple.'],
      ['Property wrapper untuk state sederhana di dalam tampilan?', ['@Binding', '@State', '@ObservedObject', '@EnvironmentObject'], 1, '@State digunakan untuk state sederhana milik tampilan.'],
      ['Minimal versi iOS yang mendukung SwiftUI?', ['iOS 10', 'iOS 11', 'iOS 12', 'iOS 13'], 3, 'SwiftUI tersedia mulai iOS 13.'],
    ],
  },
  {
    module: 'navigasi-dan-layar',
    title: 'Kuis Navigasi iOS',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Komponen SwiftUI untuk navigasi antar layar di iOS 16+?', ['NavigationView', 'NavigationStack', 'UINavigationController', 'TabView'], 1, 'NavigationStack digunakan iOS 16 dan lebih baru.'],
      ['Cara SwiftUI berpindah layar dengan membawa data?', ['NavigationLink dengan inisialisasi view', 'Menggunakan variabel global', 'Menyimpan ke file', 'Mengirim email'], 0, 'NavigationLink dapat menerima view tujuan dengan data.'],
      ['Kontainer yang harus membungkus NavigationLink agar berfungsi?', ['NavigationStack', 'VStack', 'HStack', 'ZStack'], 0, 'NavigationLink membutuhkan NavigationStack atau NavigationView.'],
    ],
  },
  {
    module: 'app-store',
    title: 'Kuis App Store',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Program Apple yang diperlukan untuk mempublikasikan aplikasi iOS?', ['Apple Developer Program', 'Apple Store Program', 'iCloud Developer', 'Swift Program'], 0, 'Apple Developer Program diperlukan untuk rilis aplikasi iOS.'],
      ['Alat untuk pengujian beta aplikasi iOS sebelum rilis resmi?', ['TestFlight', 'Play Console', 'Firebase', 'Expo Go'], 0, 'TestFlight adalah platform pengujian beta Apple.'],
      ['Alasan umum aplikasi ditolak Apple?', ['Metadata lengkap', 'Deskripsi dan tangkapan layar tidak lengkap', 'Aplikasi terlalu cepat', 'Terlalu banyak fitur'], 1, 'Metadata tidak lengkap adalah alasan penolakan umum.'],
    ],
  },
  {
    module: 'install-flutter',
    title: 'Kuis Flutter Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Bahasa pemrograman yang digunakan Flutter?', ['Dart', 'Kotlin', 'Swift', 'JavaScript'], 0, 'Flutter menggunakan bahasa Dart.'],
      ['Perintah untuk memeriksa dependensi Flutter?', ['flutter run', 'flutter doctor', 'flutter create', 'flutter build'], 1, 'flutter doctor memeriksa instalasi dan dependensi.'],
      ['Satu kodebase Flutter dapat dijalankan di...', ['Hanya Android', 'Hanya iOS', 'Android, iOS, web, dan desktop', 'Hanya web'], 2, 'Flutter mendukung banyak platform dari satu kodebase.'],
    ],
  },
  {
    module: 'dart-dasar',
    title: 'Kuis Dart Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Kata kunci Dart untuk nilai yang diassign sekali pada runtime?', ['const', 'final', 'var', 'dynamic'], 1, 'final digunakan untuk nilai yang diassign sekali pada runtime.'],
      ['Semua dalam Dart adalah...', ['Fungsi', 'Objek', 'Variabel', 'Kelas'], 1, 'Semua hal dalam Dart adalah objek.'],
      ['Perbedaan const dan final?', ['Tidak ada perbedaan', 'const untuk waktu kompilasi, final untuk waktu runtime', 'final lebih cepat', 'const hanya untuk angka'], 1, 'const adalah konstan waktu kompilasi, final adalah konstan waktu runtime.'],
    ],
  },
  {
    module: 'widget-dasar',
    title: 'Kuis Widget Flutter',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Widget untuk tampilan yang tidak berubah setelah dibuat?', ['StatefulWidget', 'StatelessWidget', 'InheritedWidget', 'StreamBuilder'], 1, 'StatelessWidget untuk tampilan statis.'],
      ['Widget wadah yang dapat diatur padding, margin, dan warna?', ['Text', 'Image', 'Container', 'Column'], 2, 'Container adalah wadah fleksibel dalam Flutter.'],
      ['Method untuk memperbarui tampilan StatefulWidget?', ['update()', 'setState()', 'refresh()', 'reload()'], 1, 'setState() memberitahu Flutter untuk merender ulang tampilan.'],
    ],
  },
  {
    module: 'proyek-mini',
    title: 'Kuis Proyek Mini Aplikasi Catatan Flutter',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah untuk membuat proyek Flutter baru?', ['flutter run', 'flutter create nama_proyek', 'flutter build', 'flutter doctor'], 1, 'flutter create membuat proyek Flutter baru.'],
      ['Penyimpanan lokal berguna agar catatan...', ['Tidak hilang saat aplikasi ditutup', 'Tampilkan lebih cepat', 'Ukuran aplikasi lebih kecil', 'Dapat diakses internet'], 0, 'Penyimpanan lokal menjaga data tetap tersimpan.'],
    ],
  },
  {
    module: 'expo-dasar',
    title: 'Kuis Expo dan React Native',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Alat yang mempermudah pengembangan React Native tanpa Android Studio atau Xcode langsung?', ['Expo', 'Create React App', 'Next.js', 'Flutter'], 0, 'Expo mempermudah setup React Native.'],
      ['Aplikasi ponsel untuk menguji aplikasi Expo?', ['Expo Go', 'React Native Go', 'Metro', 'Xcode'], 0, 'Expo Go digunakan untuk menguji aplikasi Expo di ponsel.'],
      ['Keuntungan React Native?', ['Satu kodebase untuk Android dan iOS', 'Hanya Android', 'Hanya iOS', 'Hanya web'], 0, 'React Native memungkinkan satu kodebase untuk kedua platform.'],
    ],
  },
  {
    module: 'javascript-dasar-react-native',
    title: 'Kuis JavaScript React Native',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Komponen React Native untuk teks?', ['<div>', '<span>', '<Text>', '<p>'], 2, '<Text> adalah komponen teks bawaan React Native.'],
      ['Komponen React Native untuk wadah?', ['<View>', '<div>', '<span>', '<section>'], 0, '<View> adalah komponen wadah bawaan React Native.'],
      ['Deklarasi variabel yang disarankan di JavaScript modern?', ['var', 'let dan const', 'const saja', 'dynamic'], 1, 'Gunakan const secara default, let jika nilai berubah.'],
    ],
  },
  {
    module: 'navigasi',
    title: 'Kuis Navigasi React Native',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Pustaka navigasi populer untuk React Native?', ['React Router', 'React Navigation', 'Next.js Router', 'Vue Router'], 1, 'React Navigation adalah pustaka navigasi standar React Native.'],
      ['Komponen utama yang harus membungkus aplikasi agar navigasi berfungsi?', ['NavigationContainer', 'StackNavigator', 'AppRegistry', 'SafeAreaView'], 0, 'NavigationContainer adalah kontainer utama navigasi.'],
      ['Cara mengirim parameter saat berpindah layar?', ['navigation.navigate(\"Nama\", { data: nilai })', 'Menggunakan variabel global', 'Menyimpan ke database', 'Mengirim email'], 0, 'navigation.navigate dapat membawa parameter ke layar tujuan.'],
    ],
  },
  {
    module: 'proyek-mini',
    title: 'Kuis Proyek Mini Aplikasi Cuaca React Native',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah untuk membuat proyek Expo baru?', ['npx create-expo-app nama_proyek', 'npx create-react-app nama_proyek', 'flutter create nama_proyek', 'npx create-next-app nama_proyek'], 0, 'npx create-expo-app membuat proyek Expo.'],
      ['Kunci API harus disimpan...', ['Dalam kode sumber', 'Di variabel lingkungan', 'Dalam komentar', 'Diposkan di forum publik'], 1, 'Kunci API harus disimpan di variabel lingkungan agar tidak bocor.'],
    ],
  },

{
    module: 'analisis-kebutuhan',
    title: 'Kuis Analisis Kebutuhan',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tahap pertama dalam pembuatan perangkat lunak adalah...', ['Implementasi', 'Analisis kebutuhan', 'Peluncuran', 'Pengujian'], 1, 'Analisis kebutuhan adalah tahap pertama dalam pembuatan perangkat lunak.'],
      ['Kebutuhan yang menjelaskan fitur sistem disebut...', ['Fungsional', 'Non-fungsional', 'Teknis', 'Operasional'], 0, 'Kebutuhan fungsional menjelaskan fitur yang harus ada dalam sistem.'],
      ['Kebutuhan non-fungsional contohnya...', ['Sistem dapat login', 'Sistem dapat diakses 1000 pengguna bersamaan', 'Pengguna dapat mencetak laporan', 'Data dapat disimpan'], 1, 'Kecepatan dan kapasitas adalah contoh kebutuhan non-fungsional.'],
    ],
  },
  {
    module: 'desain-perangkat-lunak',
    title: 'Kuis Desain Perangkat Lunak',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Desain perangkat lunak dilakukan sebelum...', ['Pengujian', 'Implementasi', 'Analisis', 'Peluncuran'], 1, 'Desain dilakukan sebelum coding/implementasi.'],
      ['Arsitektur lapisan membagi sistem menjadi...', ['Satu lapisan besar', 'Beberapa lapisan dengan tanggung jawab masing-masing', 'Hanya dua lapisan', 'Lapisan yang saling bergantung sepenuhnya'], 1, 'Arsitektur lapisan memisahkan tanggung jawab ke dalam lapisan yang terpisah.'],
      ['Tujuan diagram kelas adalah...', ['Menampilkan alur data', 'Menunjukkan struktur sistem dan hubungan antar kelas', 'Mengganti kode', 'Hanya untuk dokumentasi pengguna'], 1, 'Diagram kelas menunjukkan struktur sistem dan hubungan antar kelas.'],
    ],
  },
  {
    module: 'implementasi-dan-uji',
    title: 'Kuis Implementasi dan Pengujian',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Pengujian unit memeriksa...', ['Seluruh aplikasi', 'Satu fungsi atau modul kecil secara terpisah', 'Hanya antarmuka pengguna', 'Koneksi database saja'], 1, 'Unit test memeriksa satu unit kecil secara terpisah.'],
      ['Pengujian integrasi memeriksa...', ['Satu fungsi saja', 'Interaksi antar modul', 'Hanya tampilan', 'Dokumentasi saja'], 1, 'Pengujian integrasi memeriksa interaksi antar modul.'],
      ['Mengapa pengujian penting sebelum rilis?', ['Untuk menghemat waktu', 'Untuk menangkap bug sebelum pengguna menemukannya', 'Untuk membuat kode lebih lama', 'Untuk menghindari dokumentasi'], 1, 'Pengujian menangkap bug sebelum aplikasi sampai ke pengguna.'],
    ],
  },
  {
    module: 'peluncuran-dan-pemeliharaan',
    title: 'Kuis Peluncuran dan Pemeliharaan',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Rencana pengembalian (rollback) berguna untuk...', ['Membuat aplikasi lebih cepat', 'Kembali ke versi sebelumnya jika rilis baru bermasalah', 'Menghapus semua data pengguna', 'Mengganti server'], 1, 'Rollback memungkinkan kembali ke versi stabil jika rilis baru bermasalah.'],
      ['Pemantauan aplikasi setelah peluncuran berguna untuk...', ['Mendeteksi error dan gangguan', 'Menghapus fitur lama', 'Mengganti bahasa pemrograman', 'Menghapus database'], 0, 'Pemantauan mendeteksi error dan gangguan setelah peluncuran.'],
    ],
  },
  {
    module: 'sdlc',
    title: 'Kuis SDLC',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['SDLC singkatan dari...', ['Software Development Life Cycle', 'System Design Life Cycle', 'Software Development Local Cycle', 'System Development Life Cycle'], 0, 'SDLC adalah Software Development Life Cycle.'],
      ['Model yang menyelesaikan tahapan secara berurutan adalah...', ['Iteratif', 'Airfall', 'Agile', 'Scrum'], 1, 'Model Airfall menyelesaikan tahapan secara berurutan.'],
    ],
  },
  {
    module: 'manajemen-proyek',
    title: 'Kuis Manajemen Proyek TI',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Tujuan manajemen proyek TI adalah...', ['Selesai tepat waktu, anggaran, dan kualitas', 'Selesai secepat mungkin tanpa perhatian kualitas', 'Hanya mengatur jadwal', 'Hanya mengelola anggaran'], 0, 'Manajemen proyek TI mengatur waktu, anggaran, dan kualitas.'],
      ['Buffer dalam perencanaan proyek digunakan untuk...', ['Hal yang tidak terduga', 'Menambah fitur tanpa batas', 'Mengurangi anggaran', 'Mengganti tim'], 0, 'Buffer adalah waktu tambahan untuk hal yang tidak terduga.'],
    ],
  },
  {
    module: 'agile-scrum',
    title: 'Kuis Agile dan Scrum',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Peran Product Owner di Scrum adalah...', ['Membangun fitur', 'Menentukan prioritas fitur dan mewakili pengguna', 'Menghapus bug saja', 'Mengatur server'], 1, 'Product Owner menentukan prioritas fitur dan mewakili kepentingan pengguna.'],
      ['Sprint adalah...', ['Rapat harian', 'Periode waktu tetap untuk menyelesaikan fitur', 'Jenis bug', 'Alat pengembangan'], 1, 'Sprint adalah periode waktu tetap dalam Scrum.'],
    ],
  },
  {
    module: 'dokumentasi',
    title: 'Kuis Dokumentasi Perangkat Lunak',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Dokumentasi harus ditulis...', ['Hanya setelah proyek selesai', 'Seiring dengan pengembangan', 'Hanya oleh manajer proyek', 'Tidak perlu ditulis'], 1, 'Dokumentasi ditulis seiring dengan pengembangan agar selalu akurat.'],
      ['Komentar kode yang baik menjelaskan...', ['Apa yang dilakukan kode', 'Mengapa keputusan diambil', 'Setiap baris kode tanpa exception', 'Hanya fungsi kompleks'], 1, 'Komentar baik menjelaskan alasan di balik keputusan, bukan apa yang jelas dari kode.'],
    ],
  },
  {
    module: 'jenis-pengujian',
    title: 'Kuis Jenis Pengujian',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Pengujian fungsional memeriksa...', ['Kecepatan sistem', 'Fitur bekerja sesuai spesifikasi', 'Keamanan jaringan', 'Desain tampilan'], 1, 'Pengujian fungsional memeriksa fitur sesuai spesifikasi.'],
      ['Pengujian non-fungsional contohnya...', ['Pengguna dapat login', 'Halaman dimuat dalam 2 detik', 'Data tersimpan ke database', 'Tombol simpan berfungsi'], 1, 'Kecepatan muat halaman adalah contoh pengujian non-fungsional.'],
    ],
  },
  {
    module: 'unit-test',
    title: 'Kuis Unit Test',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Unit test memeriksa...', ['Seluruh aplikasi', 'Satu fungsi atau modul kecil', 'Hanya antarmuka pengguna', 'Database saja'], 1, 'Unit test memeriksa satu unit kecil secara terpisah.'],
      ['Kasus tepi adalah...', ['Situasi umum yang sering terjadi', 'Situasi jarang terjadi tetapi penting', 'Fitur yang dihapus', 'Bug yang sudah diperbaiki'], 1, 'Kasus tepi adalah situasi jarang terjadi tetapi penting untuk diuji.'],
    ],
  },
  {
    module: 'integrasi-dan-sistem',
    title: 'Kuis Pengujian Integrasi dan Sistem',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Pengujian sistem memeriksa...', ['Satu fungsi saja', 'Seluruh aplikasi sebagai satu kesatuan', 'Hanya database', 'Hanya antarmuka'], 1, 'Pengujian sistem memeriksa keseluruhan aplikasi.'],
      ['Pengujian ujung ke ujung mensimulasikan...', ['Alur pengembang menulis kode', 'Alur pengguna nyata dari awal hingga akhir', 'Alur server berkomunikasi database', 'Alur dokumentasi dibuat'], 1, 'Pengujian ujung ke ujung mensimulasikan alur pengguna nyata.'],
    ],
  },
  {
    module: 'uat-dan-laporan',
    title: 'Kuis UAT dan Laporan Bug',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['UAT dilakukan oleh...', ['Hanya pengembang', 'Pengguna akhir atau perwakilan mereka', 'Hanya manajer proyek', 'Hanya tester otomatis'], 1, 'UAT dilakukan oleh pengguna akhir atau perwakilan mereka.'],
      ['Laporan bug yang baik harus menyertakan...', ['Hanya judul bug', 'Langkah reproduksi dan hasil yang diharapkan', 'Hanya tangkapan layar', 'Hanya nama pelapor'], 1, 'Laporan bug baik mencakup langkah reproduksi dan hasil yang diharapkan.'],
    ],
  },

{
    module: 'relasional-dasar',
    title: 'Kuis Basis Data Relasional',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Basis data relasional menyimpan data dalam bentuk...', ['Tabel', 'File teks', 'Gambar', 'Video'], 0, 'Basis data relasional menyimpan data dalam tabel yang saling terhubung.'],
      ['Kunci utama bertujuan untuk...', ['Mengidentifikasi setiap baris secara unik', 'Menyembunyikan data', 'Mengubah tipe data', 'Menghapus tabel'], 0, 'Kunci utama mengidentifikasi setiap baris dengan unik.'],
      ['Kunci asing digunakan untuk...', ['Menghubungkan tabel satu sama lain', 'Mengenkripsi data', 'Menghapus tabel', 'Mengubah nama kolom'], 0, 'Kunci asing merujuk ke kunci utama di tabel lain.'],
    ],
  },
  {
    module: 'query-sql',
    title: 'Kuis Query SQL',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah SQL untuk mengambil data adalah...', ['INSERT', 'SELECT', 'UPDATE', 'DELETE'], 1, 'SELECT digunakan untuk mengambil data dari tabel.'],
      ['Klausa WHERE digunakan untuk...', ['Mengurutkan data', 'Menyaring baris berdasarkan kondisi', 'Menambah data baru', 'Menghapus tabel'], 1, 'WHERE menyaring baris yang memenuhi kondisi tertentu.'],
      ['Mengapa selalu sertakan WHERE pada UPDATE dan DELETE?', ['Agar query lebih cepat', 'Agar tidak mempengaruhi seluruh tabel', 'Agar data terenkripsi', 'Agar tabel tidak hilang'], 1, 'Tanpa WHERE, UPDATE atau DELETE akan mempengaruhi semua baris.'],
    ],
  },
  {
    module: 'join-dan-indeks',
    title: 'Kuis JOIN dan Indeks',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['JOIN digunakan untuk...', ['Menghapus tabel', 'Menggabungkan data dari dua atau lebih tabel', 'Mengubah nama kolom', 'Mengenkripsi data'], 1, 'JOIN menggabungkan data dari beberapa tabel berdasarkan kunci terkait.'],
      ['Indeks berguna untuk...', ['Mempercepat pencarian data', 'Menghapus data', 'Mengubah struktur tabel', 'Mengenkripsi password'], 0, 'Indeks mempercepat pencarian dan pengurutan data.'],
    ],
  },
  {
    module: 'mysql-postgresql',
    title: 'Kuis MySQL dan PostgreSQL',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Contoh basis data relasional populer adalah...', ['MySQL dan PostgreSQL', 'HTML dan CSS', 'React dan Vue', 'Git dan GitHub'], 0, 'MySQL dan PostgreSQL adalah basis data relasional.'],
      ['Kata sandi basis data jangan disimpan dalam kode karena...', ['Membuat kode berat', 'Risiko kebocoran kredensial', 'Database tidak akan terbaca', 'Browser tidak mendukung'], 1, 'Kredensial dalam kode bisa terlihat siapa saja. Gunakan variabel lingkungan.'],
    ],
  },
  {
    module: 'nosql-apa-itu',
    title: 'Kuis NoSQL dan MongoDB',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['NoSQL singkatan dari...', ['Not Only SQL', 'No SQL at all', 'New SQL', 'Network SQL'], 0, 'NoSQL artinya Not Only SQL, basis data non-relasional.'],
      ['MongoDB menyimpan data dalam format...', ['Tabel baris dan kolom', 'Dokumen mirip JSON', 'File teks', 'Gambar'], 1, 'MongoDB menyimpan data dalam dokumen BSON mirip JSON.'],
    ],
  },
  {
    module: 'mongodb-dasar',
    title: 'Kuis MongoDB Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Koleksi di MongoDB mirip dengan...', ['Tabel di basis data relasional', 'Kolom di basis data relasional', 'Baris di basis data relasional', 'Indeks di basis data relasional'], 0, 'Koleksi adalah kumpulan dokumen, mirip tabel.'],
      ['Perintah untuk mencari dokumen di MongoDB adalah...', ['insert', 'find', 'delete', 'update'], 1, 'find digunakan untuk mencari dokumen.'],
    ],
  },
  {
    module: 'query-dokumen',
    title: 'Kuis Query Dokumen MongoDB',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Operator MongoDB untuk lebih besar dari adalah...', ['$gte', '$gt', '$lt', '$lte'], 1, '$gt berarti greater than (lebih besar dari).'],
      ['Operator $set digunakan untuk...', ['Menghapus dokumen', 'Mengubah hanya bidang yang ditentukan', 'Mencari dokumen', 'Mengurutkan dokumen'], 1, '$set mengubah bidang yang ditentukan tanpa menghapus bidang lain.'],
    ],
  },
  {
    module: 'agregasi',
    title: 'Kuis Agregasi Data',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Agregasi digunakan untuk...', ['Menghapus data', 'Memproses data dan mengembalikan hasil komputasi', 'Mengubah nama koleksi', 'Mengenkripsi data'], 1, 'Agregasi memproses data untuk hasil seperti jumlah atau rata-rata.'],
      ['Tahapan $group dalam pipeline agregasi digunakan untuk...', ['Mengurutkan data', 'Mengelompokkan data dan menghitung agregat', 'Menyaring dokumen', 'Membatasi jumlah hasil'], 1, '$group mengelompokkan data berdasarkan kriteria tertentu.'],
    ],
  },
  {
    module: 'python-untuk-data',
    title: 'Kuis Python untuk Analisis Data',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Pustaka Python untuk manipulasi data tabel adalah...', ['Pandas', 'Django', 'Flask', 'Pygame'], 0, 'Pandas digunakan untuk manipulasi data tabel.'],
      ['Struktur data utama Pandas adalah...', ['DataFrame', 'List', 'Tuple', 'Dictionary'], 0, 'DataFrame adalah struktur data tabel dalam Pandas.'],
    ],
  },
  {
    module: 'statistika-deskriptif',
    title: 'Kuis Statistika Deskriptif',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Rata-rata adalah...', ['Nilai tengah data diurutkan', 'Jumlah semua data dibagi jumlah data', 'Nilai yang paling sering muncul', 'Selisih nilai tertinggi dan terendah'], 1, 'Rata-rata adalah jumlah semua data dibagi banyaknya data.'],
      ['Median berguna ketika data memiliki...', ['Pencilan yang mempengaruhi rata-rata', 'Hanya satu nilai', 'Semua nilai sama', 'Tidak ada nilai'], 0, 'Median tidak terpengaruh oleh pencilan sebanding rata-rata.'],
    ],
  },
  {
    module: 'visualisasi-data',
    title: 'Kuis Visualisasi Data',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Diagram batang cocok untuk...', ['Membandingkan kategori', 'Menampilkan tren waktu', 'Menunjukkan proporsi', 'Menghubungkan dua variabel'], 0, 'Diagram batang digunakan untuk membandingkan kategori.'],
      ['Diagram garis cocok untuk...', ['Menampilkan tren seiring waktu', 'Membandingkan kategori', 'Menunjukkan proporsi', 'Menghubungkan dua variabel'], 0, 'Diagram garis menunjukkan perubahan nilai seiring waktu.'],
    ],
  },
  {
    module: 'insight-bisnis',
    title: 'Kuis Insight Bisnis',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Insight bisnis adalah...', ['Data mentah tanpa pengolahan', 'Kesimpulan berguna dari data untuk keputusan bisnis', 'Grafik tanpa keterangan', 'Kode program analisis'], 1, 'Insight bisnis adalah kesimpulan yang dapat ditindaklanjuti dari data.'],
      ['Setiap insight harus diikuti oleh...', ['Rekomendasi tindakan konkret', 'Lebih banyak grafik', 'Kode program', 'Data mentah'], 0, 'Insight berguna jika diikuti oleh langkah tindakan yang jelas.'],
    ],
  },
  {
    module: 'ai-dasar',
    title: 'Kuis AI dan Machine Learning Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Machine Learning adalah...', ['Cabang AI yang belajar dari data', 'Jenis database', 'Bahasa pemrograman', 'Jaringan komputer'], 0, 'ML adalah cabang AI yang memungkinkan komputer belajar dari data.'],
      ['Data latih digunakan untuk...', ['Mengevaluasi model akhir', 'Melatih model', 'Menghapus model', 'Mengenkripsi model'], 1, 'Data latih digunakan untuk melatih model machine learning.'],
    ],
  },
  {
    module: 'ml-dasar',
    title: 'Kuis Machine Learning Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Overfitting adalah...', ['Model terlalu sederhana', 'Model mengingat data latih termasuk kebisingan', 'Model tidak pernah dilatih', 'Model hanya menggunakan data uji'], 1, 'Overfitting terjadi ketika model terlalu cocok dengan data latih termasuk noise.'],
      ['Data uji digunakan untuk...', ['Melatih model', 'Mengevaluasi performa model pada data baru', 'Menghapus model', 'Mengubah struktur model'], 1, 'Data uji mengukur seberapa baik model mengeneralisasi data baru.'],
    ],
  },
  {
    module: 'model-prediksi',
    title: 'Kuis Model Prediksi',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Metrik evaluasi untuk klasifikasi termasuk...', ['MAE dan MSE', 'Akurasi, presisi, recall, dan F1-score', 'R-squared dan RMSE', 'Hanya akurasi saja'], 1, 'Klasifikasi menggunakan akurasi, presisi, recall, dan F1-score.'],
      ['Ketidakseimbangan kelas adalah...', ['Semua kelas sama banyak', 'Satu kelas jauh lebih banyak dari kelas lain', 'Tidak ada kelas dalam data', 'Hanya ada satu kelas'], 1, 'Ketidakseimbangan kelas terjadi ketika distribusi kelas tidak seimbang.'],
    ],
  },
  {
    module: 'implementasi',
    title: 'Kuis Implementasi Praktis AI',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['AI harus selalu diawasi oleh manusia untuk...', ['Keputusan penting', 'Menulis kode', 'Mengunduh data', 'Menghapus model'], 0, 'Pengawasan manusia diperlukan untuk keputusan kritis yang dihasilkan AI.'],
      ['Etika AI termasuk...', ['Mengabaikan bias dalam data', 'Memastikan transparansi dan melindungi privasi', 'Menggunakan data sembarangan', 'Tidak mempertimbangkan dampak'], 1, 'Etika AI mencakup transparansi, keadilan, dan perlindungan privasi.'],
    ],
  },

{
    module: 'ip-address-subnetting',
    title: 'Kuis Jaringan Komputer: IP dan Subnetting',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['IP address digunakan untuk...', ['Mengidentifikasi perangkat dalam jaringan', 'Menyimpan file', 'Mengenkripsi data', 'Menghapus jaringan'], 0, 'IP address mengidentifikasi setiap perangkat dalam jaringan secara unik.'],
      ['Subnetting berguna untuk...', ['Membagi jaringan besar menjadi lebih kecil', 'Menghapus jaringan', 'Mengganti IP address', 'Mengenkripsi data'], 0, 'Subnetting membagi jaringan besar menjadi subnet yang lebih kecil.'],
      ['Contoh IP privat kelas C adalah...', ['192.168.1.10', '8.8.8.8', '1.1.1.1', '203.0.113.5'], 0, '192.168.x.x adalah rentang IP privat kelas C.'],
    ],
  },
  {
    module: 'tcpip-dan-osi',
    title: 'Kuis Model TCP/IP dan OSI',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Model OSI memiliki berapa lapisan?', ['4', '7', '5', '3'], 1, 'Model OSI memiliki 7 lapisan.'],
      ['Protokol yang menjamin pengiriman data handal adalah...', ['UDP', 'TCP', 'IP', 'HTTP'], 1, 'TCP menyediakan pengiriman data yang handal dan berurutan.'],
    ],
  },
  {
    module: 'routing-switching',
    title: 'Kuis Routing dan Switching',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Switch bekerja pada lapisan...', ['Lapisan 1', 'Lapisan 2', 'Lapisan 3', 'Lapisan 7'], 1, 'Switch bekerja pada lapisan data link (Lapisan 2).'],
      ['Router digunakan untuk...', ['Menghubungkan perangkat dalam satu jaringan', 'Mengirim data antar jaringan berbeda', 'Menyimpan file', 'Mengenkripsi data'], 1, 'Router mengirim data antar jaringan berdasarkan alamat IP.'],
    ],
  },
  {
    module: 'jaringan-nirkabel',
    title: 'Kuis Jaringan Nirkabel',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Enkripsi Wi-Fi yang harus dihindari karena lemah adalah...', ['WPA3', 'WPA2', 'WEP', 'WPA'], 2, 'WEP adalah enkripsi lama yang mudah diretas.'],
      ['SSID adalah...', ['Kata sandi Wi-Fi', 'Nama jaringan Wi-Fi', 'Alamat IP router', 'Kecepatan internet'], 1, 'SSID adalah nama jaringan Wi-Fi yang ditampilkan kepada pengguna.'],
    ],
  },
  {
    module: 'linux-dasar',
    title: 'Kuis Linux Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah Linux untuk melihat isi folder adalah...', ['open', 'ls', 'cd', 'del'], 1, 'ls digunakan untuk melihat isi direktori di Linux.'],
      ['Perintah untuk mengubah izin file di Linux adalah...', ['chmod', 'chown', 'ls', 'mkdir'], 0, 'chmod mengubah izin akses file.'],
    ],
  },
  {
    module: 'windows-dasar',
    title: 'Kuis Windows Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Panel Kontrol digunakan untuk...', ['Mengatur sistem dan mengelola program', 'Menulis kode program', 'Mengenkripsi file', 'Menghapus virus otomatis'], 0, 'Panel Kontrol digunakan untuk mengatur sistem Windows.'],
      ['Pembaruan Windows penting untuk...', ['Mempercepat internet', 'Memperbaiki keamanan dan bug', 'Menghapus semua file', 'Mengganti antarmuka'], 1, 'Pembaruan Windows memperbaiki keamanan dan bug sistem.'],
    ],
  },
  {
    module: 'macos-dasar',
    title: 'Kuis macOS Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Finder di macOS digunakan untuk...', ['Mengelola file dan folder', 'Menulis kode', 'Mengenkripsi data', 'Menghapus virus'], 0, 'Finder adalah pengelola file default macOS.'],
      ['Shortcut Spotlight di macOS adalah...', ['Cmd + Spasi', 'Ctrl + Alt + Del', 'Alt + Tab', 'Windows + Spasi'], 0, 'Cmd + Spasi membuka pencarian Spotlight di macOS.'],
    ],
  },
  {
    module: 'baris-perintah',
    title: 'Kuis Baris Perintah',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Perintah untuk pindah direktori di baris perintah adalah...', ['ls', 'cd', 'cp', 'rm'], 1, 'cd digunakan untuk change directory (pindah direktori).'],
      ['Perintah rm digunakan untuk...', ['Menyalin file', 'Menghapus file', 'Memindahkan file', 'Membuat folder'], 1, 'rm digunakan untuk remove (menghapus) file.'],
    ],
  },
  {
    module: 'cloud-apa-itu',
    title: 'Kuis Cloud Computing',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Cloud computing menyediakan layanan melalui...', ['Jaringan lokal saja', 'Internet', 'Kabel USB', 'Bluetooth'], 1, 'Cloud computing menyediakan layanan melalui internet.'],
      ['Contoh SaaS adalah...', ['AWS EC2', 'Gmail', 'Google Compute Engine', 'AWS S3'], 1, 'Gmail adalah contoh perangkat lunak sebagai layanan (SaaS).'],
    ],
  },
  {
    module: 'aws-dasar',
    title: 'Kuis AWS Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Layanan AWS untuk server virtual adalah...', ['S3', 'EC2', 'RDS', 'Lambda'], 1, 'EC2 menyediakan server virtual di AWS.'],
      ['S3 digunakan untuk...', ['Menjalankan server virtual', 'Penyimpanan objek', 'Basis data relasional', 'Komputasi tanpa server'], 1, 'S3 adalah penyimpanan objek yang scalable.'],
    ],
  },
  {
    module: 'gcp-dasar',
    title: 'Kuis GCP Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Layanan GCP untuk mesin virtual adalah...', ['Cloud Storage', 'Compute Engine', 'BigQuery', 'Vertex AI'], 1, 'Compute Engine menyediakan mesin virtual di GCP.'],
      ['BigQuery digunakan untuk...', ['Penyimpanan file', 'Analisis data besar', 'Server virtual', 'Machine learning'], 1, 'BigQuery digunakan untuk analisis data skala besar.'],
    ],
  },
  {
    module: 'azure-dasar',
    title: 'Kuis Azure Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Layanan Azure untuk server virtual adalah...', ['Blob Storage', 'Virtual Machines', 'Azure SQL Database', 'Azure Functions'], 1, 'Azure Virtual Machines menyediakan server virtual.'],
      ['Blob Storage digunakan untuk...', ['Menjalankan server virtual', 'Penyimpanan data tidak terstruktur', 'Basis data relasional', 'Fungsi tanpa server'], 1, 'Blob Storage adalah penyimpanan objek di Azure.'],
    ],
  },
  {
    module: 'kriptografi',
    title: 'Kuis Kriptografi Dasar',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Enkripsi dapat diubah kembali ke data asli dengan...', ['Kunci yang benar', 'Tanpa kunci', 'Hanya melalui hash', 'Tidak dapat dikembalikan'], 0, 'Enkripsi membutuhkan kunci untuk mengembalikan data asli.'],
      ['Hashing adalah proses...', ['Dua arah yang dapat dikembalikan', 'Satu arah yang tidak dapat dikembalikan', 'Hanya untuk enkripsi', 'Hanya untuk dekripsi'], 1, 'Hashing adalah proses satu arah yang tidak dapat diubah kembali.'],
    ],
  },
  {
    module: 'ethical-hacking',
    title: 'Kuis Ethical Hacking',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Ethical hacking dilakukan dengan...', ['Tanpa izin', 'Izin tertulis dari pemilik sistem', 'Izin dari orang acak', 'Tanpa memberitahu siapa pun'], 1, 'Ethical hacking membutuhkan izin tertulis dari pemilik sistem.'],
      ['Penetration testing bertujuan untuk...', ['Merusak sistem', 'Menguji keamanan sistem dan menemukan kerentanan', 'Mengenkripsi data', 'Menghapus jaringan'], 1, 'Pengujian kecepatan menemukan kerentanan keamanan sebelum penyerang nyata.'],
    ],
  },
  {
    module: 'pertahanan-jaringan',
    title: 'Kuis Pertahanan Jaringan',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Firewall berguna untuk...', ['Menyimpan file', 'Memfilter lalu lintas jaringan', 'Mengenkripsi email', 'Menghapus virus'], 1, 'Firewall memfilter lalu lintas jaringan berdasarkan aturan keamanan.'],
      ['Perlindungan DDoS mencegah...', ['Akses tidak sah ke file', 'Jaringan dipenuhi lalu lintas palsu', 'Kecelakaan hardware', 'Kehilangan kata sandi'], 1, 'Perlindungan DDoS mencegah layanan tidak tersedia karena lalu lintas palsu.'],
    ],
  },
  {
    module: 'pencegahan-malware',
    title: 'Kuis Pencegahan Malware',
    time_limit_seconds: 600,
    pass_score: 70,
    questions: [
      ['Malware adalah...', ['Perangkat lunak yang bermanfaat', 'Perangkat lunak berbahaya yang merusak atau mencuri data', 'Jenis jaringan', 'Perangkat keras komputer'], 1, 'Malware adalah perangkat lunak berbahaya.'],
      ['Cara mencegah infeksi malware adalah...', ['Mengklik semua link email', 'Memperbarui perangkat lunak secara teratur', 'Menginstal aplikasi dari sumber sembarangan', 'Mematikan antivirus'], 1, 'Pembaruan perangkat lunak secara teratur membantu mencegah infeksi malware.'],
    ],
  },




];

const AD_SLOTS = [
  { slot_key: 'top-banner', kind: 'banner', title: 'Ruang sponsor Anda', sponsor: 'Iklan', target_url: '', priority: 1 },
  { slot_key: 'sidebar', kind: 'card', title: 'Tawaran untuk pembelajar', sponsor: 'Iklan', target_url: '', priority: 2 },
  { slot_key: 'in-feed', kind: 'native', title: 'Dukungan EduVerse', sponsor: 'Disponsori', target_url: '', priority: 3 },
  { slot_key: 'module-footer', kind: 'banner', title: 'Modul berikutnya', sponsor: 'Iklan', target_url: '', priority: 4 },
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

// Baris TERAKHIR yang pernah ditulis ensureCatalog: soal keenam dari bank ketiga (peta id
// dikunci dev/function.test.mjs). Karena setiap panggilan di bawah di-await berurutan, adanya
// baris ini membuktikan seluruh jalur semaian sudah pernah lewat, jadi satu probe PRIMARY KEY
// cukup untuk kondisi mapan. Penjaga lama menyimpulkan "sudah ada" dari jendela hasil
// pemanggilan `all` ber-limit 20/40/80/200: begitu tabel tumbuh melewatinya (17 topik berarti
// >40 modul), moduleIds.get(slug) mengembalikan undefined, pg-store.mjs:38 membuang nilai
// undefined dari INSERT, Postgres menjawab 23502, rows() di core.mjs melempar, dan bootstrap
// yang duduk di depan setiap baca katalog mematikan SELURUH API. Terukur 2026-11-18 sebelum
// perbaikan: 45 modul + 90 pelajaran asing -> not_null_violation di bootstrap ronde kedua.
const PENANDA_SEMAI = uuid(1046);

async function ensureCatalog(store) {
  const createdAt = new Date().toISOString();
  // Penjaga per baris, bukan per katalog. Dulu "if (courses.length) return" membuat
  // database yang terisi sebagian (banks ada, questions nol) tidak pernah sembuh, dan
  // kegagalan bootstrap menular ke seluruh rute lewat ensureSeeded. Semaian separuh jalan
  // tetap terdeteksi di sini karena PENANDA_SEMAI adalah baris terakhir: kalau ia belum ada,
  // jalur lambat di bawah menyisipkan ulang satu per satu lewat insertAbsent yang idempoten.
  // Nama tabel ditulis apa adanya di setiap panggilan, bukan lewat variabel, supaya
  // penjaga drift kolom (dev/schema.test.mjs) masih bisa memeriksa kolomnya.
  if (await store.one('questions', 'id', [['id', PENANDA_SEMAI]])) return;

  // Slug adalah kunci alamiah modul dan satu-satunya yang dipakai pemanggil materi; id bisa
  // berbeda antara database lama dan turunan historis di bawah, jadi selalu dibaca balik.
  const idModul = async (moduleSlug, sisip) => {
    const ada = await store.one('modules', 'id', [['slug', moduleSlug]]);
    if (ada) return ada.id;
    await sisip();
    const baru = await store.one('modules', 'id', [['slug', moduleSlug]]);
    if (!baru) throw new Error(`modul hasil semaian tidak terbaca: ${moduleSlug}`);
    return baru.id;
  };

  for (const course of COURSES) {
    await store.insertAbsent('courses', { ...course, id: course.id, published: true, created_at: createdAt }, 'slug');
  }
  const moduleIds = new Map();
  for (const [courseSlug, moduleSlug, title, minutes, offline, idKhusus] of MODULES) {
    const course = COURSES.find((c) => c.slug === courseSlug);
    const siblings = MODULES.filter((m) => m[0] === courseSlug);
    moduleIds.set(moduleSlug, await idModul(moduleSlug, () => store.insertAbsent(
      'modules',
      {
        id: idKhusus ?? uuid(1000 + MODULES.findIndex((m) => m[1] === moduleSlug) + 1),
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
    )));
  }

  // id baris ditentukan oleh urutan tabel sumber, bukan oleh counter yang berjalan,
  // supaya baris yang sudah ada di produksi dikenali dan tidak pernah dibuat ganda.
  // BASIS dibekukan pada nilai historis (1000 + 6 modul saat materi pertama dibuat).
  // Kalau basisnya ikut bertambah saat modul baru ditambahkan, seluruh id pelajaran,
  // bank, dan soal bergeser; penjaga per baris lalu mengira belum ada apa-apa dan
  // menyisipkan materi kembar di database produksi.
  const BASIS_ID_PELAJARAN = 1006;
  let counter = BASIS_ID_PELAJARAN;
  for (const [moduleSlug, lessonTitle, blocks, minutes, idKhusus] of LESSONS) {
    // Entri ber-id eksplisit tidak memakan counter: nomor 1027 dan seterusnya masih
    // menjadi milik bank soal dan pertanyaan yang sudah tayang.
    if (idKhusus === undefined) counter += 1;
    const lessonId = idKhusus ?? uuid(counter);
    const moduleId = moduleIds.get(moduleSlug);
    if (!moduleId) throw new Error(`pelajaran tanpa modul induk: ${moduleSlug}`);
    const order = LESSONS.filter((l) => l[0] === moduleSlug).findIndex((l) => l[1] === lessonTitle) + 1;
    await store.insertAbsent(
      'lessons',
      {
        id: lessonId,
        module_id: moduleId,
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
    const moduleId = moduleIds.get(bank.module);
    if (!moduleId) throw new Error(`bank tanpa modul induk: ${bank.module}`);
    await store.insertAbsent(
      'banks',
      {
        id: bankId,
        module_id: moduleId,
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
        title: `Uji Kompetensi #${key}`,
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
