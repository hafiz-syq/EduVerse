// Bootstrap konten pertama EduVerse. Idempoten lewat insertIfAbsent dengan UUID tetap,
// dijalankan malas (saat katalog pertama dibaca), bukan sebagai DML migrasi.

import { hashPassword } from './core.mjs';

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
  ['pemikiran-komputasi', 'Apa itu Pemikiran Komputasi', [
    { t: 'p', x: 'Pemikiran komputasi adalah cara berpikir untuk memecah masalah besar menjadi langkah-langkah kecil, rapi, dan mudah dipahami — baik oleh manusia maupun komputer. Bayangkan kamu memasak mie instan: ada urutan yang harus diikuti (rebus air, masukkan mie, aduk, tambahkan bumbu), ada pilihan (jika tidak ada panci, gunakan wajan), dan ada hal yang diulang (aduk sampai mie empuk). Semua ini adalah pemikiran komputasi.' },
    { t: 'list', items: ['Dekomposisi: pecah masalah besar menjadi bagian-bagian kecil yang bisa diselesaikan satu per satu.', 'Pengenalan pola: lihat kesamaan antar masalah agar tidak perlu mulai dari nol.', 'Abstraksi: ambil bagian yang penting saja, buang detail yang tidak relevan.', 'Algoritma: susunan langkah-langkah yang jelas, terurut, dan dapat diukur.'] },
    { t: 'p', x: 'Tujuannya adalah agar kamu bisa merencanakan solusi sebelum mengetik kode. Kalau pemikiran sudah matang, menulis kode menjadi mudah karena kamu sudah tahu langkahnya.' },
    { t: 'tip', x: 'Komputer tidak berpikir sendiri. Komputer hanya mengikuti instruksi yang kamu tulis, langkah demi langkah, secara tepat.' },
  ], 4],
  ['pemikiran-komputasi', 'Alur dan Pseudocode', [
    { t: 'p', x: 'Sebelum mengetik kode di komputer, tulis dulu alur solusi dalam bahasa sehari-hari. Tulisan itu disebut pseudocode — campuran bahasa manusia dan logika komputer. Pseudocode tidak dijalankan oleh komputer, jadi kamu bebas fokus pada pemikiran, bukan aturan penulisan bahasa pemrograman.' },
    { t: 'code', lang: 'text', x: 'MULAI\\n  Masukkan angka pertama\\n  Masukkan angka kedua\\n  Jumlahkan keduanya\\n  Tampilkan hasil\\nSELESAI' },
    { t: 'p', x: 'Contoh di atas adalah algoritma penjumlahan dua angka. Setiap baris adalah satu instruksi yang jelas. Pseudocode seperti ini mudah dibaca orang yang belum pernah coding, sehingga tim bisa berdiskusi sebelum coding nyata.' },
    { t: 'list', items: ['Pseudocode ditulis dalam bahasa yang kamu pahami (misalnya bahasa Indonesia).', 'Setiap langkah harus jelas dan tidak berbelit-belit.', 'Pseudocode tidak perlu mengikuti aturan bahasa pemrograman tertentu.'] },
    { t: 'tip', x: 'Pseudocode berfungsi seperti peta sebelum bepergian: kamu tahu tujuan dan rutenya, jadi tidak tersesat saat mulai mengetik kode.' },
  ], 4],
  ['pemikiran-komputasi', 'Percabangan dan Perulangan', [
    { t: 'p', x: 'Percabangan adalah mengambil keputusan "jika... maka...": jika cuaca hujan, bawa payung; jika tidak, tidak perlu. Dalam komputer, percabangan memungkinkan program memilih jalur berbeda tergantung kondisi. Perulangan adalah melakukan hal yang sama berulang kali, misalnya mencetak daftar nama satu per satu atau mengulang permainan sampai pemain menang.' },
    { t: 'list', items: ['Jika (if): jalankan kode hanya ketika kondisi terpenuhi.', 'Jika tidak (else): jalankan kode alternatif ketika kondisi tidak terpenuhi.', 'Sambil (while): ulangi selama kondisi masih benar.', 'Untuk setiap (for): ulangi untuk setiap item dalam kumpulan.'] },
    { t: 'code', lang: 'text', x: 'UNTUK setiap mahasiswa dalam daftar\\n  Jika nilai >= 70\\n    Tampilkan "Lulus"\\n  Jika tidak\\n    Tampilkan "Remedial"\\nSELESAI UNTUK' },
    { t: 'tip', x: 'Gunakan percabangan ketika ada pilihan, dan gunakan perulangan ketika ada hal yang diulang. Jangan campur keduanya pada satu langkah yang sama agar tidak bingung.' },
  ], 4],
  ['pemikiran-komputasi', 'Fungsi dan Rekursi', [
    { t: 'p', x: 'Fungsi adalah kotak alat yang berisi langkah-langkah tertentu dan bisa digunakan berkali-kali. Misalnya, fungsi "cuci piring" bisa dipakai setiap kali ada piring kotor, tanpa perlu menulis ulang caranya. Rekursi adalah fungsi yang memanggil dirinya sendiri, seperti cermin yang mencerminkan cermin lain. Setiap pemanggilan rekursi harus mendekati kondisi berhenti, agar tidak berjalan selamanya.' },
    { t: 'code', lang: 'text', x: 'FUNGSI hitungFaktorial(n):\\n  Jika n <= 1: kembalikan 1\\n  Kembalikan n * hitungFaktorial(n - 1)\\nSELESAI FUNGSI' },
    { t: 'p', x: 'Contoh di atas menghitung faktorial. Jika kamu memanggil hitungFaktorial(3), komputer akan memanggil dirinya sendiri berulang kali sampai mencapai n = 1, lalu mengembalikan hasilnya.' },
    { t: 'list', items: ['Fungsi menghemat penulisan karena kode ditulis sekali, dipakai banyak kali.', 'Rekursi cocok untuk masalah yang bentuknya sama secara berulang (misalnya faktorial, deret Fibonacci).', 'Selalu berikan kondisi henti (base case) pada fungsi rekursi.'] },
    { t: 'tip', x: 'Rekursi elegan dan ringkas, tetapi bisa kehabisan memori jika tidak ada batas henti. Jika tidak yakin, gunakan perulangan biasa.' },
  ], 4],
  ['pemikiran-komputasi', 'Kompleksitas Waktu dan Ruang', [
            {t:'p',x:'Kompleksitas Waktu dan Ruang adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kompleksitas Waktu dan Ruang akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kompleksitas Waktu dan Ruang','Manfaat memahami Kompleksitas Waktu dan Ruang untuk pemula','Langkah pertama untuk mulai belajar Kompleksitas Waktu dan Ruang','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kompleksitas Waktu dan Ruang\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kompleksitas Waktu dan Ruang. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kompleksitas Waktu dan Ruang adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['alur-dan-pseudocode', 'Apa itu Alur dan Pseudocode', [
    { t: 'p', x: 'Alur adalah urutan langkah-langkah untuk menyelesaikan masalah. Pseudocode adalah cara menuliskan alur tersebut dalam bahasa sehari-hari yang dicampur dengan logika komputer. Dengan pseudocode, kamu merencanakan solusi sebelum menulis kode yang sebenarnya.' },
    { t: 'code', lang: 'text', x: 'MULAI\\n  Buka rak buku\\n  Ambil buku\\n  Buka halaman pertama\\n  UNTUK setiap halaman\\n    Baca isi halaman\\n  SELESAI UNTUK\\n  Tutup buku\\nSELESAI' },
    { t: 'list', items: ['Pseudocode tidak perlu berjalan di komputer.', 'Pseudocode ditulis dalam bahasa yang mudah dipahami.', 'Setiap langkah dalam pseudocode harus jelas dan spesifik.'] },
    { t: 'tip', x: 'Jika kamu sudah bisa menulis pseudocode dengan baik, belajar bahasa pemrograman apa pun akan jauh lebih mudah.' },
], 4],
['alur-dan-pseudocode', 'Menulis Pseudocode Pertama', [
    { t: 'p', x: 'Cara menulis pseudocode pertama: tentukan tujuan, pecah masalah menjadi langkah kecil, lalu tulis setiap langkah secara berurutan. Gunakan kata-kata sederhana seperti "mulai", "jika", "sambil", dan "selesai". Jangan terlalu peduli dengan aturan penulisan bahasa pemrograman pada tahap ini.' },
    { t: 'code', lang: 'text', x: 'MULAI\\n  Masukkan nama\\n  Jika nama kosong\\n    Tampilkan "Nama belum diisi"\\n  Jika tidak\\n    Tampilkan "Halo, [nama]"\\nSELESAI' },
    { t: 'list', items: ['Tentukan tujuan dari program yang ingin dibuat.', 'Pecah masalah menjadi langkah-langkah kecil.', 'Tulis setiap langkah dengan bahasa sederhana.', 'Periksa apakah semua langkah sudah lengkap.'] },
    { t: 'tip', x: 'Pseudocode pertama kamu tidak perlu sempurna. Yang penting, alurnya sudah jelas dan bisa diikuti oleh orang lain.' },
], 4],
['alur-dan-pseudocode', 'Struktur Dasar Pseudocode', [
    { t: 'p', x: 'Pseudocode biasanya memiliki struktur awal (MULAI), isi (langkah-langkah), dan akhir (SELESAI). Di dalamnya ada percabangan (jika/jika tidak), perulangan (sambil/untuk setiap), dan pemanggilan fungsi. Struktur ini membuat pseudocode mudah dibaca dan diubah menjadi kode sebenarnya.' },
    { t: 'code', lang: 'text', x: 'MULAI\\n  [langkah 1]\\n  [langkah 2]\\n  Jika [kondisi]\\n    [langkah jika benar]\\n  Jika tidak\\n    [langkah jika salah]\\n  SELESAI' },
    { t: 'list', items: ['MULAI: tanda awal algoritma.', 'Langkah-langkah: instruksi yang dijalankan berurutan.', 'Percabangan: pilihan tergantung kondisi.', 'Perulangan: instruksi yang diulang.', 'SELESAI: tanda akhir algoritma.'] },
    { t: 'tip', x: 'Struktur dasar pseudocode mirip dengan resep masakan: bahan, langkah pemasakan, dan hasil akhir.' },
], 4],
['alur-dan-pseudocode', 'Kesalahan Umum dalam Pseudocode', [
            {t:'p',x:'Kesalahan Umum dalam Pseudocode adalah kesalahan yang sering dilakukan pemula saat belajar logika-algoritma. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Kesalahan Umum dalam Pseudocode karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Kesalahan Umum dalam Pseudocode sering terjadi pada pemula','Cara mudah menghindari Kesalahan Umum dalam Pseudocode','Tanda bahwa kamu mengalami Kesalahan Umum dalam Pseudocode','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Kesalahan Umum dalam Pseudocode\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Kesalahan Umum dalam Pseudocode. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Kesalahan Umum dalam Pseudocode sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
 ['percabangan-dan-perulangan', 'Percabangan: Jika dan Jika Tidak', [
    { t: 'p', x: 'Percabangan memungkinkan program mengambil keputusan. "Jika" (if) menjalankan kode hanya ketika kondisi benar. "Jika tidak" (else) menjalankan kode alternatif ketika kondisi salah. Misalnya, jika nilai ujian lebih dari atau sama dengan 70, siswa lulus; jika tidak, siswa remedial.' },
    { t: 'code', lang: 'text', x: 'Jika nilai >= 70\\n  Tampilkan "Lulus"\\nJika tidak\\n  Tampilkan "Remedial"\\nSELESAI' },
    { t: 'list', items: ['Jika (if): kondisi yang diuji.', 'Jika tidak (else): kode yang dijalankan ketika kondisi salah.', 'Kondisi harus menghasilkan jawaban benar atau salah.'] },
    { t: 'tip', x: 'Gunakan percabangan ketika program perlu memilih antara dua atau lebih jalur berdasarkan kondisi.' },
 ], 4],
 ['percabangan-dan-perulangan', 'Perulangan: Sambil dan Untuk Setiap', [
    { t: 'p', x: 'Perulangan digunakan untuk melakukan hal yang sama berulang kali. "Sambil" (while) mengulang selama kondisi masih benar. "Untuk setiap" (for) mengulang untuk setiap item dalam kumpulan data, misalnya mencetak semua nama dalam daftar mahasiswa.' },
    { t: 'code', lang: 'text', x: 'UNTUK setiap mahasiswa dalam daftar\\n  Tampilkan nama mahasiswa\\nSELESAI UNTUK' },
    { t: 'list', items: ['Sambil (while): ulangi selama kondisi benar.', 'Untuk setiap (for): ulangi untuk setiap item dalam kumpulan.', 'Setiap perulangan harus memiliki cara untuk berhenti.'] },
    { t: 'tip', x: 'Selalu pastikan perulangan memiliki cara berhenti, agar program tidak terjebak dalam perulangan tak terbatas.' },
 ], 4],
 ['percabangan-dan-perulangan', 'Gabungan Percabangan dan Perulangan', [
    { t: 'p', x: 'Percabangan dan perulangan bisa digunakan bersama. Contohnya, perulangan untuk setiap mahasiswa dalam daftar, lalu di dalamnya percabangan untuk menentukan apakah mahasiswa lulus atau remedial berdasarkan nilainya. Ini sangat umum dalam program nyata.' },
    { t: 'code', lang: 'text', x: 'UNTUK setiap mahasiswa dalam daftar\\n  Jika nilai >= 70\\n    Tampilkan "Lulus"\\n  Jika tidak\\n    Tampilkan "Remedial"\\nSELESAI UNTUK' },
    { t: 'list', items: ['Perulangan mengulang setiap item dalam kumpulan.', 'Percabangan di dalam perulangan menentukan keputusan per item.', 'Gabungan keduanya sangat berguna untuk memproses banyak data.'] },
    { t: 'tip', x: 'Jika kode terlihat rumit, pecah menjadi percabangan dan perulangan yang lebih kecil satu per satu.' },
 ], 4],
 ['percabangan-dan-perulangan', 'Kesalahan Umum: Perulangan Tak Terbatas', [
    { t: 'p', x: 'Perulangan tak terbatas terjadi ketika kondisi perulangan selalu benar dan tidak pernah berubah menjadi salah. Program akan terus mengulang tanpa henti, sehingga komputer menjadi lambat atau tidak merespons. Misalnya, perulangan "sambil" yang tidak pernah mengubah nilai variabel pengecek kondisi.' },
    { t: 'code', lang: 'text', x: 'Sambil benar\\n  Tampilkan "Hello"\\nSELESAI Sambil' },
    { t: 'list', items: ['Kondisi perulangan selalu benar.', 'Variabel pengecek kondisi tidak diubah.', 'Lupa cara berhenti pada perulangan.'] },
    { t: 'tip', x: 'Selalu periksa apakah perulangan kamu memiliki cara untuk berhenti sebelum menjalankan program.' },
 ], 4],
 ['fungsi-dan-rekursi', 'Apa itu Fungsi', [
    { t: 'p', x: 'Fungsi adalah kotak alat yang berisi langkah-langkah tertentu dan bisa digunakan berkali-kali. Kamu menulis kode di dalam fungsi sekali, lalu memanggil fungsi tersebut kapan saja dibutuhkan. Ini menghemat penulisan dan membuat kode lebih rapi.' },
    { t: 'code', lang: 'text', x: 'FUNGSI sapa(nama):\\n  Tampilkan "Halo, [nama]"\\nSELESAI FUNGSI' },
    { t: 'list', items: ['Fungsi ditulis sekali, dipakai banyak kali.', 'Fungsi diberi nama agar mudah dipanggil.', 'Fungsi membuat kode lebih terorganisir.'] },
    { t: 'tip', x: 'Jika ada kode yang ditulis berulang-ulang, pertimbangkan untuk memindahkannya ke dalam fungsi.' },
 ], 4],
 ['fungsi-dan-rekursi', 'Fungsi dengan Input dan Output', [
    { t: 'p', x: 'Fungsi bisa menerima input (data yang diberikan saat memanggil fungsi) dan menghasilkan output (hasil yang dikembalikan fungsi). Input disebut parameter, dan output disebut nilai kembali. Misalnya, fungsi hitung luas persegi panjang menerima panjang dan lebar sebagai input, lalu mengembalikan luas sebagai output.' },
    { t: 'code', lang: 'text', x: 'FUNGSI hitungLuas(panjang, lebar):\\n  luas = panjang * lebar\\n  kembalikan luas\\nSELESAI FUNGSI' },
    { t: 'list', items: ['Input adalah data yang diberikan ke fungsi.', 'Output adalah hasil yang dikembalikan fungsi.', 'Fungsi bisa menerima lebih dari satu input.'] },
    { t: 'tip', x: 'Berikan nama parameter yang jelas agar orang lain tahu apa yang harus diisi pada fungsi.' },
 ], 4],
 ['fungsi-dan-rekursi', 'Rekursi: Fungsi yang Memanggil Diri Sendiri', [
    { t: 'p', x: 'Rekursi adalah fungsi yang memanggil dirinya sendiri. Ini seperti cermin yang mencerminkan cermin lain. Setiap pemanggilan rekursi harus mendekati kondisi berhenti, agar fungsi tidak memanggil dirinya sendiri selamanya. Rekursi cocok untuk masalah yang bentuknya sama secara berulang, seperti menghitung faktorial atau deret Fibonacci.' },
    { t: 'code', lang: 'text', x: 'FUNGSI hitungFaktorial(n):\\n  Jika n <= 1: kembalikan 1\\n  Kembalikan n * hitungFaktorial(n - 1)\\nSELESAI FUNGSI' },
    { t: 'list', items: ['Fungsi rekursi memanggil dirinya sendiri.', 'Selalu ada kondisi henti (base case) pada fungsi rekursi.', 'Setiap pemanggilan rekursi mendekati kondisi henti.'] },
    { t: 'tip', x: 'Rekursi elegan dan ringkas, tetapi bisa kehabisan memori jika tidak ada batas henti yang jelas.' },
 ], 4],
 ['fungsi-dan-rekursi', 'Kapan Menggunakan Fungsi dan Rekursi', [
            {t:'p',x:'Kapan Menggunakan Fungsi dan Rekursi adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kapan Menggunakan Fungsi dan Rekursi akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kapan Menggunakan Fungsi dan Rekursi','Manfaat memahami Kapan Menggunakan Fungsi dan Rekursi untuk pemula','Langkah pertama untuk mulai belajar Kapan Menggunakan Fungsi dan Rekursi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kapan Menggunakan Fungsi dan Rekursi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kapan Menggunakan Fungsi dan Rekursi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kapan Menggunakan Fungsi dan Rekursi adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['kompleksitas-waktu', 'Apa itu Kompleksitas Waktu', [
            {t:'p',x:'Apa itu Kompleksitas Waktu adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Kompleksitas Waktu akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Kompleksitas Waktu','Manfaat memahami Apa itu Kompleksitas Waktu untuk pemula','Langkah pertama untuk mulai belajar Apa itu Kompleksitas Waktu','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Kompleksitas Waktu\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Kompleksitas Waktu. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Kompleksitas Waktu adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['kompleksitas-waktu', 'Notasi Big O Dasar', [
            {t:'p',x:'Notasi Big O Dasar adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Notasi Big O Dasar akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Notasi Big O Dasar','Manfaat memahami Notasi Big O Dasar untuk pemula','Langkah pertama untuk mulai belajar Notasi Big O Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Notasi Big O Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Notasi Big O Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Notasi Big O Dasar adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['kompleksitas-waktu', 'Kompleksitas Ruang', [
            {t:'p',x:'Kompleksitas Ruang adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kompleksitas Ruang akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kompleksitas Ruang','Manfaat memahami Kompleksitas Ruang untuk pemula','Langkah pertama untuk mulai belajar Kompleksitas Ruang','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kompleksitas Ruang\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kompleksitas Ruang. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kompleksitas Ruang adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['kompleksitas-waktu', 'Memilih Algoritma yang Tepat', [
            {t:'p',x:'Memilih Algoritma yang Tepat adalah konsep dasar dalam logika-algoritma. Bayangkan seperti seperti memasak resep masakan: langkah-langkah yang jelas dan berurutan sehingga hasilnya sama setiap kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Memilih Algoritma yang Tepat akan membantu kamu membangun dasar yang kuat dalam logika-algoritma. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Memilih Algoritma yang Tepat','Manfaat memahami Memilih Algoritma yang Tepat untuk pemula','Langkah pertama untuk mulai belajar Memilih Algoritma yang Tepat','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Memilih Algoritma yang Tepat\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Memilih Algoritma yang Tepat. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Memilih Algoritma yang Tepat adalah titik awal dalam perjalanan belajarmu di logika-algoritma. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['array-dan-list', 'Array dan List', [
    { t: 'p', x: 'Array adalah kotak-kotak berurutan yang masing-masing menampung satu nilai. Kamu dapat mengakses isinya dengan nomor urut (indeks), dimulai dari 0.' },
    { t: 'code', lang: 'text', x: 'daftarBelanja = [\"beras\", \"minyak\", \"gula\", \"garam\"]\\n// indeks 0 = \"beras\", indeks 1 = \"minyak\", dst.' },
    { t: 'list', items: ['Indeks selalu dimulai dari 0, bukan 1', 'Array dapat menampung tipe data yang berbeda-beda', 'Panjang array dapat bertambah atau berkurang'] },
    { t: 'tip', x: 'Jangan mengakses indeks yang tidak ada, misal daftarBelanja[10] saat hanya ada 4 item. Itu akan menyebabkan error.' },
  ], 3],
  ['array-dan-list', 'Operasi Array Dasar', [
            {t:'p',x:'Operasi Array Dasar adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Operasi Array Dasar akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Operasi Array Dasar','Manfaat memahami Operasi Array Dasar untuk pemula','Langkah pertama untuk mulai belajar Operasi Array Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Operasi Array Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Operasi Array Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Operasi Array Dasar adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['array-dan-list', 'Kesalahan Umum dengan Array', [
            {t:'p',x:'Kesalahan Umum dengan Array adalah kesalahan yang sering dilakukan pemula saat belajar struktur-data. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Kesalahan Umum dengan Array karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Kesalahan Umum dengan Array sering terjadi pada pemula','Cara mudah menghindari Kesalahan Umum dengan Array','Tanda bahwa kamu mengalami Kesalahan Umum dengan Array','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Kesalahan Umum dengan Array\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Kesalahan Umum dengan Array. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Kesalahan Umum dengan Array sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
['stack-dan-queue', 'Apa itu Stack', [
            {t:'p',x:'Apa itu Stack adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Stack akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Stack','Manfaat memahami Apa itu Stack untuk pemula','Langkah pertama untuk mulai belajar Apa itu Stack','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Stack\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Stack. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Stack adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['stack-dan-queue', 'Operasi Stack: Push dan Pop', [
            {t:'p',x:'Operasi Stack: Push dan Pop adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Operasi Stack: Push dan Pop akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Operasi Stack: Push dan Pop','Manfaat memahami Operasi Stack: Push dan Pop untuk pemula','Langkah pertama untuk mulai belajar Operasi Stack: Push dan Pop','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Operasi Stack: Push dan Pop\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Operasi Stack: Push dan Pop. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Operasi Stack: Push dan Pop adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['stack-dan-queue', 'Apa itu Queue', [
            {t:'p',x:'Apa itu Queue adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Queue akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Queue','Manfaat memahami Apa itu Queue untuk pemula','Langkah pertama untuk mulai belajar Apa itu Queue','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Queue\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Queue. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Queue adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['stack-dan-queue', 'Operasi Queue: Enqueue dan Dequeue', [
            {t:'p',x:'Operasi Queue: Enqueue dan Dequeue adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Operasi Queue: Enqueue dan Dequeue akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Operasi Queue: Enqueue dan Dequeue','Manfaat memahami Operasi Queue: Enqueue dan Dequeue untuk pemula','Langkah pertama untuk mulai belajar Operasi Queue: Enqueue dan Dequeue','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Operasi Queue: Enqueue dan Dequeue\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Operasi Queue: Enqueue dan Dequeue. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Operasi Queue: Enqueue dan Dequeue adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['linked-list', 'Apa itu Linked List', [
            {t:'p',x:'Apa itu Linked List adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Linked List akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Linked List','Manfaat memahami Apa itu Linked List untuk pemula','Langkah pertama untuk mulai belajar Apa itu Linked List','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Linked List\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Linked List. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Linked List adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['linked-list', 'Node dan Pointer', [
            {t:'p',x:'Node dan Pointer adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Node dan Pointer akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Node dan Pointer','Manfaat memahami Node dan Pointer untuk pemula','Langkah pertama untuk mulai belajar Node dan Pointer','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Node dan Pointer\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Node dan Pointer. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Node dan Pointer adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['linked-list', 'Menambah dan Menghapus Node', [
            {t:'p',x:'Menambah dan Menghapus Node adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menambah dan Menghapus Node akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menambah dan Menghapus Node','Manfaat memahami Menambah dan Menghapus Node untuk pemula','Langkah pertama untuk mulai belajar Menambah dan Menghapus Node','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menambah dan Menghapus Node\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menambah dan Menghapus Node. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menambah dan Menghapus Node adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['linked-list', 'Linked List vs Array', [
            {t:'p',x:'Linked List vs Array adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Linked List vs Array akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Linked List vs Array','Manfaat memahami Linked List vs Array untuk pemula','Langkah pertama untuk mulai belajar Linked List vs Array','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Linked List vs Array\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Linked List vs Array. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Linked List vs Array adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['hash-map', 'Apa itu Hash Map', [
            {t:'p',x:'Apa itu Hash Map adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Hash Map akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Hash Map','Manfaat memahami Apa itu Hash Map untuk pemula','Langkah pertama untuk mulai belajar Apa itu Hash Map','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Hash Map\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Hash Map. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Hash Map adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['hash-map', 'Cara Kerja Hash Map', [
            {t:'p',x:'Cara Kerja Hash Map adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Cara Kerja Hash Map akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Cara Kerja Hash Map','Manfaat memahami Cara Kerja Hash Map untuk pemula','Langkah pertama untuk mulai belajar Cara Kerja Hash Map','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Cara Kerja Hash Map\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Cara Kerja Hash Map. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Cara Kerja Hash Map adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['hash-map', 'Apa itu Set', [
            {t:'p',x:'Apa itu Set adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Set akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Set','Manfaat memahami Apa itu Set untuk pemula','Langkah pertama untuk mulai belajar Apa itu Set','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Set\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Set. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Set adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['hash-map', 'Kapan Menggunakan Hash Map dan Set', [
            {t:'p',x:'Kapan Menggunakan Hash Map dan Set adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kapan Menggunakan Hash Map dan Set akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kapan Menggunakan Hash Map dan Set','Manfaat memahami Kapan Menggunakan Hash Map dan Set untuk pemula','Langkah pertama untuk mulai belajar Kapan Menggunakan Hash Map dan Set','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kapan Menggunakan Hash Map dan Set\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kapan Menggunakan Hash Map dan Set. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kapan Menggunakan Hash Map dan Set adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pemilihan-struktur', 'Mengenali Kebutuhan Aplikasi', [
            {t:'p',x:'Mengenali Kebutuhan Aplikasi adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengenali Kebutuhan Aplikasi akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengenali Kebutuhan Aplikasi','Manfaat memahami Mengenali Kebutuhan Aplikasi untuk pemula','Langkah pertama untuk mulai belajar Mengenali Kebutuhan Aplikasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengenali Kebutuhan Aplikasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengenali Kebutuhan Aplikasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengenali Kebutuhan Aplikasi adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pemilihan-struktur', 'Bandingkan Array, Stack, Queue', [
            {t:'p',x:'Bandingkan Array, Stack, Queue adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Bandingkan Array, Stack, Queue akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Bandingkan Array, Stack, Queue','Manfaat memahami Bandingkan Array, Stack, Queue untuk pemula','Langkah pertama untuk mulai belajar Bandingkan Array, Stack, Queue','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Bandingkan Array, Stack, Queue\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Bandingkan Array, Stack, Queue. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Bandingkan Array, Stack, Queue adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pemilihan-struktur', 'Bandingkan Linked List dan Hash Map', [
            {t:'p',x:'Bandingkan Linked List dan Hash Map adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Bandingkan Linked List dan Hash Map akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Bandingkan Linked List dan Hash Map','Manfaat memahami Bandingkan Linked List dan Hash Map untuk pemula','Langkah pertama untuk mulai belajar Bandingkan Linked List dan Hash Map','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Bandingkan Linked List dan Hash Map\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Bandingkan Linked List dan Hash Map. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Bandingkan Linked List dan Hash Map adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pemilihan-struktur', 'Studi Kasus: Memilih Struktur Data', [
            {t:'p',x:'Studi Kasus: Memilih Struktur Data adalah konsep dasar dalam struktur-data. Bayangkan seperti seperti menyimpan buku di rak: setiap jenis rak memiliki cara menyimpan dan mengambil yang berbeda. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Studi Kasus: Memilih Struktur Data akan membantu kamu membangun dasar yang kuat dalam struktur-data. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Studi Kasus: Memilih Struktur Data','Manfaat memahami Studi Kasus: Memilih Struktur Data untuk pemula','Langkah pertama untuk mulai belajar Studi Kasus: Memilih Struktur Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Studi Kasus: Memilih Struktur Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Studi Kasus: Memilih Struktur Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Studi Kasus: Memilih Struktur Data adalah titik awal dalam perjalanan belajarmu di struktur-data. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kelas-dan-objek', 'Kelas dan Objek', [
    { t: 'p', x: 'Kelas adalah cetak biru, objek adalah hasil cetaknya. Bayangkan kelas adalah cetak biru rumah, dan objek adalah rumah yang sudah dibangun dari cetak biru itu.' },
    { t: 'code', lang: 'text', x: 'KELAS Hewan:\\n  properti nama\\n  properti jenis\\n  fungsi bersuara():\\n    tampilkan nama + \" berbicara\"\\nSELESAI KELAS\\n\\nkucing = Hewan()\\nkucing.nama = \"Milo\"\\nkucing.bersuara()  // Milo berbicara' },
    { t: 'list', items: ['Kelas mendefinisikan properti dan perilaku', 'Objek adalah instance dari kelas', 'Satu kelas dapat menghasilkan banyak objek'] },
    { t: 'tip', x: 'Berikan nama kelas dalam kata benda tunggal, misal Hewan, Mobil, Pengguna.' },
  ], 4],
  ['kelas-dan-objek', 'Membuat Objek dari Kelas', [
            {t:'p',x:'Membuat Objek dari Kelas adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat Objek dari Kelas akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat Objek dari Kelas','Manfaat memahami Membuat Objek dari Kelas untuk pemula','Langkah pertama untuk mulai belajar Membuat Objek dari Kelas','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat Objek dari Kelas\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat Objek dari Kelas. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat Objek dari Kelas adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kelas-dan-objek', 'Kesalahan Umum: Lupa new', [
            {t:'p',x:'Kesalahan Umum: Lupa new adalah kesalahan yang sering dilakukan pemula saat belajar oop-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa new karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa new sering terjadi pada pemula','Cara mudah menghindari Lupa new','Tanda bahwa kamu mengalami Lupa new','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa new\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa new. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa new sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
['enkapsulasi', 'Apa itu Enkapsulasi', [
            {t:'p',x:'Apa itu Enkapsulasi adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Enkapsulasi akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Enkapsulasi','Manfaat memahami Apa itu Enkapsulasi untuk pemula','Langkah pertama untuk mulai belajar Apa itu Enkapsulasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Enkapsulasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Enkapsulasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Enkapsulasi adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['enkapsulasi', 'Mengakses Data dengan Getter dan Setter', [
            {t:'p',x:'Mengakses Data dengan Getter dan Setter adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengakses Data dengan Getter dan Setter akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengakses Data dengan Getter dan Setter','Manfaat memahami Mengakses Data dengan Getter dan Setter untuk pemula','Langkah pertama untuk mulai belajar Mengakses Data dengan Getter dan Setter','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengakses Data dengan Getter dan Setter\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengakses Data dengan Getter dan Setter. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengakses Data dengan Getter dan Setter adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['enkapsulasi', 'Melindungi Data Dalam Kelas', [
            {t:'p',x:'Melindungi Data Dalam Kelas adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Melindungi Data Dalam Kelas akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Melindungi Data Dalam Kelas','Manfaat memahami Melindungi Data Dalam Kelas untuk pemula','Langkah pertama untuk mulai belajar Melindungi Data Dalam Kelas','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Melindungi Data Dalam Kelas\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Melindungi Data Dalam Kelas. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Melindungi Data Dalam Kelas adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['enkapsulasi', 'Manfaat Enkapsulasi', [
            {t:'p',x:'Manfaat Enkapsulasi adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Manfaat Enkapsulasi akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Manfaat Enkapsulasi','Manfaat memahami Manfaat Enkapsulasi untuk pemula','Langkah pertama untuk mulai belajar Manfaat Enkapsulasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Manfaat Enkapsulasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Manfaat Enkapsulasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Manfaat Enkapsulasi adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pewarisan', 'Apa itu Pewarisan', [
            {t:'p',x:'Apa itu Pewarisan adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Pewarisan akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Pewarisan','Manfaat memahami Apa itu Pewarisan untuk pemula','Langkah pertama untuk mulai belajar Apa itu Pewarisan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Pewarisan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Pewarisan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Pewarisan adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pewarisan', 'Kelas Induk dan Kelas Anak', [
            {t:'p',x:'Kelas Induk dan Kelas Anak adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kelas Induk dan Kelas Anak akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kelas Induk dan Kelas Anak','Manfaat memahami Kelas Induk dan Kelas Anak untuk pemula','Langkah pertama untuk mulai belajar Kelas Induk dan Kelas Anak','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kelas Induk dan Kelas Anak\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kelas Induk dan Kelas Anak. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kelas Induk dan Kelas Anak adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pewarisan', 'Menggunakan Method dari Kelas Induk', [
            {t:'p',x:'Menggunakan Method dari Kelas Induk adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menggunakan Method dari Kelas Induk akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menggunakan Method dari Kelas Induk','Manfaat memahami Menggunakan Method dari Kelas Induk untuk pemula','Langkah pertama untuk mulai belajar Menggunakan Method dari Kelas Induk','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menggunakan Method dari Kelas Induk\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menggunakan Method dari Kelas Induk. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menggunakan Method dari Kelas Induk adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['pewarisan', 'Kapan Menggunakan Pewarisan', [
            {t:'p',x:'Kapan Menggunakan Pewarisan adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kapan Menggunakan Pewarisan akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kapan Menggunakan Pewarisan','Manfaat memahami Kapan Menggunakan Pewarisan untuk pemula','Langkah pertama untuk mulai belajar Kapan Menggunakan Pewarisan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kapan Menggunakan Pewarisan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kapan Menggunakan Pewarisan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kapan Menggunakan Pewarisan adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['polimorfisme', 'Apa itu Polimorfisme', [
            {t:'p',x:'Apa itu Polimorfisme adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Polimorfisme akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Polimorfisme','Manfaat memahami Apa itu Polimorfisme untuk pemula','Langkah pertama untuk mulai belajar Apa itu Polimorfisme','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Polimorfisme\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Polimorfisme. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Polimorfisme adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['polimorfisme', 'Overloading dan Overriding', [
            {t:'p',x:'Overloading dan Overriding adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Overloading dan Overriding akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Overloading dan Overriding','Manfaat memahami Overloading dan Overriding untuk pemula','Langkah pertama untuk mulai belajar Overloading dan Overriding','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Overloading dan Overriding\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Overloading dan Overriding. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Overloading dan Overriding adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['polimorfisme', 'Polimorfisme dalam Praktik', [
            {t:'p',x:'Polimorfisme dalam Praktik adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Polimorfisme dalam Praktik akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Polimorfisme dalam Praktik','Manfaat memahami Polimorfisme dalam Praktik untuk pemula','Langkah pertama untuk mulai belajar Polimorfisme dalam Praktik','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Polimorfisme dalam Praktik\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Polimorfisme dalam Praktik. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Polimorfisme dalam Praktik adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['polimorfisme', 'Manfaat Polimorfisme', [
            {t:'p',x:'Manfaat Polimorfisme adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Manfaat Polimorfisme akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Manfaat Polimorfisme','Manfaat memahami Manfaat Polimorfisme untuk pemula','Langkah pertama untuk mulai belajar Manfaat Polimorfisme','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Manfaat Polimorfisme\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Manfaat Polimorfisme. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Manfaat Polimorfisme adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['abstraksi-dan-interface', 'Apa itu Abstraksi', [
            {t:'p',x:'Apa itu Abstraksi adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Abstraksi akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Abstraksi','Manfaat memahami Apa itu Abstraksi untuk pemula','Langkah pertama untuk mulai belajar Apa itu Abstraksi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Abstraksi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Abstraksi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Abstraksi adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['abstraksi-dan-interface', 'Kelas Abstrak', [
            {t:'p',x:'Kelas Abstrak adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kelas Abstrak akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kelas Abstrak','Manfaat memahami Kelas Abstrak untuk pemula','Langkah pertama untuk mulai belajar Kelas Abstrak','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kelas Abstrak\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kelas Abstrak. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kelas Abstrak adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['abstraksi-dan-interface', 'Apa itu Interface', [
            {t:'p',x:'Apa itu Interface adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Interface akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Interface','Manfaat memahami Apa itu Interface untuk pemula','Langkah pertama untuk mulai belajar Apa itu Interface','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Interface\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Interface. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Interface adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['abstraksi-dan-interface', 'Perbedaan Kelas Abstrak dan Interface', [
            {t:'p',x:'Perbedaan Kelas Abstrak dan Interface adalah konsep dasar dalam oop-dasar. Bayangkan seperti seperti alat bantu yang memudahkan pekerjaan sehari-hari. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Perbedaan Kelas Abstrak dan Interface akan membantu kamu membangun dasar yang kuat dalam oop-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Perbedaan Kelas Abstrak dan Interface','Manfaat memahami Perbedaan Kelas Abstrak dan Interface untuk pemula','Langkah pertama untuk mulai belajar Perbedaan Kelas Abstrak dan Interface','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Perbedaan Kelas Abstrak dan Interface\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Perbedaan Kelas Abstrak dan Interface. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Perbedaan Kelas Abstrak dan Interface adalah titik awal dalam perjalanan belajarmu di oop-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['apa-itu-vcs', 'Apa itu Version Control', [
            {t:'p',x:'Apa itu Version Control adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Version Control akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Version Control','Manfaat memahami Apa itu Version Control untuk pemula','Langkah pertama untuk mulai belajar Apa itu Version Control','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Version Control\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Version Control. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Version Control adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['apa-itu-vcs', 'Mengapa Perlu VCS', [
            {t:'p',x:'Mengapa Perlu VCS adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengapa Perlu VCS akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengapa Perlu VCS','Manfaat memahami Mengapa Perlu VCS untuk pemula','Langkah pertama untuk mulai belajar Mengapa Perlu VCS','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengapa Perlu VCS\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengapa Perlu VCS. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengapa Perlu VCS adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['repository-dan-commit', 'Apa itu Repository', [
            {t:'p',x:'Apa itu Repository adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Repository akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Repository','Manfaat memahami Apa itu Repository untuk pemula','Langkah pertama untuk mulai belajar Apa itu Repository','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Repository\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Repository. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Repository adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['repository-dan-commit', 'Membuat Commit Pertama', [
            {t:'p',x:'Membuat Commit Pertama adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat Commit Pertama akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat Commit Pertama','Manfaat memahami Membuat Commit Pertama untuk pemula','Langkah pertama untuk mulai belajar Membuat Commit Pertama','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat Commit Pertama\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat Commit Pertama. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat Commit Pertama adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['repository-dan-commit', 'Melihat Riwayat Commit', [
            {t:'p',x:'Melihat Riwayat Commit adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Melihat Riwayat Commit akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Melihat Riwayat Commit','Manfaat memahami Melihat Riwayat Commit untuk pemula','Langkah pertama untuk mulai belajar Melihat Riwayat Commit','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Melihat Riwayat Commit\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Melihat Riwayat Commit. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Melihat Riwayat Commit adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['repository-dan-commit', 'Commit yang Baik dan Terstruktur', [
            {t:'p',x:'Commit yang Baik dan Terstruktur adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Commit yang Baik dan Terstruktur akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Commit yang Baik dan Terstruktur','Manfaat memahami Commit yang Baik dan Terstruktur untuk pemula','Langkah pertama untuk mulai belajar Commit yang Baik dan Terstruktur','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Commit yang Baik dan Terstruktur\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Commit yang Baik dan Terstruktur. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Commit yang Baik dan Terstruktur adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['branch-dan-merge', 'Apa itu Branch', [
            {t:'p',x:'Apa itu Branch adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Branch akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Branch','Manfaat memahami Apa itu Branch untuk pemula','Langkah pertama untuk mulai belajar Apa itu Branch','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Branch\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Branch. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Branch adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['branch-dan-merge', 'Membuat dan Pindah Branch', [
    { t: 'p', x: 'Membuat branch baru untuk fitur, lalu pindah ke branch tersebut untuk mulai bekerja. Branch utama tidak terpengaruh.' },
    { t: 'code', lang: 'bash', x: 'git branch fitur-baru\\\\ngit checkout fitur-baru\\\\n// atau\\\\ngit checkout -b fitur-baru' },
    { t: 'list', items: ['Buat branch baru', 'Pindah ke branch baru', 'Kerja di branch tersebut'] },
    { t: 'tip', x: 'Gunakan nama branch yang deskriptif, misal fitur-login.' },
 ], 3],
 ['branch-dan-merge', 'Menggabungkan Branch dengan Merge', [
            {t:'p',x:'Menggabungkan Branch dengan Merge adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menggabungkan Branch dengan Merge akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menggabungkan Branch dengan Merge','Manfaat memahami Menggabungkan Branch dengan Merge untuk pemula','Langkah pertama untuk mulai belajar Menggabungkan Branch dengan Merge','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menggabungkan Branch dengan Merge\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menggabungkan Branch dengan Merge. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menggabungkan Branch dengan Merge adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['branch-dan-merge', 'Kesalahan Umum dalam Branch dan Merge', [
            {t:'p',x:'Kesalahan Umum dalam Branch dan Merge adalah kesalahan yang sering dilakukan pemula saat belajar vcs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Kesalahan Umum dalam Branch dan Merge karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Kesalahan Umum dalam Branch dan Merge sering terjadi pada pemula','Cara mudah menghindari Kesalahan Umum dalam Branch dan Merge','Tanda bahwa kamu mengalami Kesalahan Umum dalam Branch dan Merge','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Kesalahan Umum dalam Branch dan Merge\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Kesalahan Umum dalam Branch dan Merge. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Kesalahan Umum dalam Branch dan Merge sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
 ['resolve-konflik', 'Apa itu Konflik Merge', [
            {t:'p',x:'Apa itu Konflik Merge adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Konflik Merge akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Konflik Merge','Manfaat memahami Apa itu Konflik Merge untuk pemula','Langkah pertama untuk mulai belajar Apa itu Konflik Merge','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Konflik Merge\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Konflik Merge. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Konflik Merge adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['resolve-konflik', 'Mengapa Konflik Terjadi', [
            {t:'p',x:'Mengapa Konflik Terjadi adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengapa Konflik Terjadi akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengapa Konflik Terjadi','Manfaat memahami Mengapa Konflik Terjadi untuk pemula','Langkah pertama untuk mulai belajar Mengapa Konflik Terjadi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengapa Konflik Terjadi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengapa Konflik Terjadi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengapa Konflik Terjadi adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['resolve-konflik', 'Menyelesaikan Konflik Secara Manual', [
            {t:'p',x:'Menyelesaikan Konflik Secara Manual adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menyelesaikan Konflik Secara Manual akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menyelesaikan Konflik Secara Manual','Manfaat memahami Menyelesaikan Konflik Secara Manual untuk pemula','Langkah pertama untuk mulai belajar Menyelesaikan Konflik Secara Manual','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menyelesaikan Konflik Secara Manual\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menyelesaikan Konflik Secara Manual. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menyelesaikan Konflik Secara Manual adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
 ['resolve-konflik', 'Menghindari Konflik di Masa Depan', [
            {t:'p',x:'Menghindari Konflik di Masa Depan adalah konsep dasar dalam vcs-dasar. Bayangkan seperti seperti save game di videogame yang bisa kembali ke titik sebelumnya kapan saja. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menghindari Konflik di Masa Depan akan membantu kamu membangun dasar yang kuat dalam vcs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menghindari Konflik di Masa Depan','Manfaat memahami Menghindari Konflik di Masa Depan untuk pemula','Langkah pertama untuk mulai belajar Menghindari Konflik di Masa Depan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menghindari Konflik di Masa Depan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menghindari Konflik di Masa Depan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menghindari Konflik di Masa Depan adalah titik awal dalam perjalanan belajarmu di vcs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['install-git', 'Menginstal Git', [
            {t:'p',x:'Menginstal Git adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menginstal Git akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menginstal Git','Manfaat memahami Menginstal Git untuk pemula','Langkah pertama untuk mulai belajar Menginstal Git','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menginstal Git\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menginstal Git. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menginstal Git adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['install-git', 'Konfigurasi Pertama Git', [
      { t: 'p', x: 'Setelah instalasi, konfigurasi nama dan email Git agar setiap commit teridentifikasi dengan benar.' },
      { t: 'code', lang: 'bash', x: 'git config --global user.name \"Nama Anda\"\\ngit config --global user.email \"email@anda.com\"' },
      { t: 'list', items: ['Setel nama pengguna', 'Setel email pengguna', 'Verifikasi konfigurasi dengan git config --list'] },
      { t: 'tip', x: 'Gunakan nama dan email yang profesional untuk commit.' },
   ], 3],
   ['install-git', 'Perintah Dasar Git', [
      { t: 'p', x: 'Perintah-perintah Git dasar: init, add, commit, status. Ini adalah fondasi sebelum bekerja bersama tim.' },
      { t: 'code', lang: 'bash', x: 'git init\\ngit add .\\ngit commit -m \"Menyimpan versi pertama\"\\ngit status' },
      { t: 'list', items: ['Inisialisasi repository baru', 'Menambah file ke staging area', 'Menyimpan perubahan dengan pesan', 'Melihat status repository'] },
      { t: 'tip', x: 'Jalankan git status setiap kali bingung status repository Anda.' },
   ], 3],
   ['install-git', 'Membuat Repository Pertama', [
            {t:'p',x:'Membuat Repository Pertama adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat Repository Pertama akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat Repository Pertama','Manfaat memahami Membuat Repository Pertama untuk pemula','Langkah pertama untuk mulai belajar Membuat Repository Pertama','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat Repository Pertama\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat Repository Pertama. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat Repository Pertama adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['konfigurasi-dan-perintah-dasar', 'Konfigurasi Nama dan Email', [
      { t: 'p', x: 'Setiap commit di Git harus teridentifikasi dengan nama dan email. Konfigurasi global akan berlakukan untuk semua repository di komputer Anda.' },
      { t: 'code', lang: 'bash', x: 'git config --global user.name \"Fikri Amalia\"\\ngit config --global user.email \"fikri@ediverse.id\"' },
      { t: 'list', items: ['Gunakan --global untuk semua repo', 'Periksa dengan: git config --list', 'Bisa di-set per-repository dengan hapus --global'] },
      { t: 'tip', x: 'Gunakan email yang sama dengan akun GitHub Anda.' },
   ], 3],
   ['konfigurasi-dan-perintah-dasar', 'Inisialisasi Repository', [
      { t: 'p', x: 'Membuat repository Git baru dari nol. Perintah ini membuat folder menjadi repository Git.' },
      { t: 'code', lang: 'bash', x: 'mkdir belajar-git\\ncd belajar-git\\ngit init' },
      { t: 'list', items: ['Buat folder proyek', 'Pindah ke folder tersebut', 'Inisialisasi Git'] },
      { t: 'tip', x: 'Git init hanya perlu sekali per repository.' },
   ], 3],
   ['konfigurasi-dan-perintah-dasar', 'Menambah dan Commit File', [
      { t: 'p', x: 'Menambah file ke repository dan menyimpan perubahan dengan pesan yang deskriptif.' },
      { t: 'code', lang: 'bash', x: 'git add nama-file\\ngit commit -m \"Menambahkan file inisial\"' },
      { t: 'list', items: ['git add: menambah file ke staging area', 'git commit: menyimpan perubahan'] },
      { t: 'tip', x: 'Gunakan pesan commit yang jelas dan singkat.' },
   ], 3],
   ['konfigurasi-dan-perintah-dasar', 'Melihat Status Repository', [
      { t: 'p', x: 'Melihat status berapa perubahan yang sudah tersimpan, sedang di-staging, atau belum di-track.' },
      { t: 'code', lang: 'bash', x: 'git status' },
      { t: 'list', items: ['File baru yang belum ter-track', 'Perubahan yang sudah di-staging', 'Riwayat commit terakhir'] },
      { t: 'tip', x: 'Jalankan git status sebelum commit untuk menghindari kesalahan.' },
   ], 3],
   ['konfigurasi-dan-perintah-dasar', 'Melihat Riwayat Commit', [
      { t: 'p', x: 'Melihat daftar semua commit yang pernah dilakukan beserta pesan dan authornya.' },
      { t: 'code', lang: 'bash', x: 'git log' },
      { t: 'list', items: ['Melihat semua commit', 'Melihat detail commit tertentu', 'Mencari commit berdasarkan kata kunci'] },
      { t: 'tip', x: 'Gunakan git log --oneline untuk tampilan ringkas.' },
   ], 3],
   ['branch-dan-pull-request', 'Membuat Branch di GitHub', [
            {t:'p',x:'Membuat Branch di GitHub adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat Branch di GitHub akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat Branch di GitHub','Manfaat memahami Membuat Branch di GitHub untuk pemula','Langkah pertama untuk mulai belajar Membuat Branch di GitHub','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat Branch di GitHub\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat Branch di GitHub. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat Branch di GitHub adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['branch-dan-pull-request', 'Mengunggah Branch ke GitHub', [
            {t:'p',x:'Mengunggah Branch ke GitHub adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengunggah Branch ke GitHub akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengunggah Branch ke GitHub','Manfaat memahami Mengunggah Branch ke GitHub untuk pemula','Langkah pertama untuk mulai belajar Mengunggah Branch ke GitHub','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengunggah Branch ke GitHub\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengunggah Branch ke GitHub. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengunggah Branch ke GitHub adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['branch-dan-pull-request', 'Apa itu Pull Request', [
            {t:'p',x:'Apa itu Pull Request adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Pull Request akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Pull Request','Manfaat memahami Apa itu Pull Request untuk pemula','Langkah pertama untuk mulai belajar Apa itu Pull Request','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Pull Request\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Pull Request. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Pull Request adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['branch-dan-pull-request', 'Menyelesaikan Pull Request', [
            {t:'p',x:'Menyelesaikan Pull Request adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menyelesaikan Pull Request akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menyelesaikan Pull Request','Manfaat memahami Menyelesaikan Pull Request untuk pemula','Langkah pertama untuk mulai belajar Menyelesaikan Pull Request','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menyelesaikan Pull Request\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menyelesaikan Pull Request. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menyelesaikan Pull Request adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['kolaborasi-tim', 'Cloning Repository', [
      { t: 'p', x: 'Cloning membuat salinan lengkap repository lokal dari remote. Ini memungkinkan bekerja secara offline dan sinkronisasi dengan remote.' },
      { t: 'code', lang: 'bash', x: 'git clone https://github.com/username/repo-name.git' },
      { t: 'list', items: ['Membuat salinan lengkap repository', 'Mengizinkan bekerja secara offline', 'Sinkronisasi dengan remote melalui push/pull'] },
      { t: 'tip', x: 'Gunakan https atau SSH sesuai keamanan akun Anda.' },
   ], 3],
   ['kolaborasi-tim', 'Mendapatkan Perubahan Terbaru', [
      { t: 'p', x: 'Mengunduh perubahan terbaru dari remote repository ke lokal. Perintah ini sinkronisasi proyek dengan teman tim.' },
      { t: 'code', lang: 'bash', x: 'git pull origin branch-name' },
      { t: 'list', items: ['Mendownload commit terbaru', 'Mengupdate file lokal', 'Sinkronisasi dengan remote'] },
      { t: 'tip', x: 'Jalankan git pull sebelum mulai kerja sehari-hari.' },
   ], 3],
   ['kolaborasi-tim', 'Mengunggah Perubahan', [
      { t: 'p', x: 'Mengirim perubahan dari repository lokal ke remote repository agar terlihat oleh tim.' },
      { t: 'code', lang: 'bash', x: 'git push origin branch-name' },
      { t: 'list', items: ['Mengirim commit terbaru', 'Update di remote repository', 'Tersedia untuk dibaca tim'] },
      { t: 'tip', x: 'Jika push gagal, mungkin ada yang mengunggah sebelum Anda.' },
   ], 3],
   ['kolaborasi-tim', 'Konflik Merge', [
            {t:'p',x:'Konflik Merge adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Konflik Merge akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Konflik Merge','Manfaat memahami Konflik Merge untuk pemula','Langkah pertama untuk mulai belajar Konflik Merge','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Konflik Merge\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Konflik Merge. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Konflik Merge adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['issues-dan-project', 'Apa itu Issue di GitHub', [
            {t:'p',x:'Apa itu Issue di GitHub adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Issue di GitHub akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Issue di GitHub','Manfaat memahami Apa itu Issue di GitHub untuk pemula','Langkah pertama untuk mulai belajar Apa itu Issue di GitHub','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Issue di GitHub\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Issue di GitHub. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Issue di GitHub adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
   ['issues-dan-project', 'Project Board dan Pengorganisasian', [
            {t:'p',x:'Project Board dan Pengorganisasian adalah konsep dasar dalam git-github. Bayangkan seperti seperti catatan waktu berjejer yang mencatat setiap perubahan yang kamu buat. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Project Board dan Pengorganisasian akan membantu kamu membangun dasar yang kuat dalam git-github. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Project Board dan Pengorganisasian','Manfaat memahami Project Board dan Pengorganisasian untuk pemula','Langkah pertama untuk mulai belajar Project Board dan Pengorganisasian','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Project Board dan Pengorganisasian\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Project Board dan Pengorganisasian. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Project Board dan Pengorganisasian adalah titik awal dalam perjalanan belajarmu di git-github. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['html-pertama', 'Struktur Halaman HTML', [
            {t:'p',x:'Struktur Halaman HTML adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Struktur Halaman HTML akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Struktur Halaman HTML','Manfaat memahami Struktur Halaman HTML untuk pemula','Langkah pertama untuk mulai belajar Struktur Halaman HTML','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Struktur Halaman HTML\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Struktur Halaman HTML. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Struktur Halaman HTML adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['html-pertama', 'Tag Semantik', [
            {t:'p',x:'Tag Semantik adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Tag Semantik akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Tag Semantik','Manfaat memahami Tag Semantik untuk pemula','Langkah pertama untuk mulai belajar Tag Semantik','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Tag Semantik\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Tag Semantik. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Tag Semantik adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['html-pertama', 'Tautan, Gambar, dan Formulir', [
            {t:'p',x:'Tautan, Gambar, dan Formulir adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Tautan, Gambar, dan Formulir akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Tautan, Gambar, dan Formulir','Manfaat memahami Tautan, Gambar, dan Formulir untuk pemula','Langkah pertama untuk mulai belajar Tautan, Gambar, dan Formulir','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Tautan, Gambar, dan Formulir\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Tautan, Gambar, dan Formulir. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Tautan, Gambar, dan Formulir adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['css-dasar', 'Selector dan Kotak Model', [
            {t:'p',x:'Selector dan Kotak Model adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Selector dan Kotak Model akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Selector dan Kotak Model','Manfaat memahami Selector dan Kotak Model untuk pemula','Langkah pertama untuk mulai belajar Selector dan Kotak Model','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Selector dan Kotak Model\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Selector dan Kotak Model. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Selector dan Kotak Model adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['css-dasar', 'Variabel Warna dan Tema', [
            {t:'p',x:'Variabel Warna dan Tema adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Variabel Warna dan Tema akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Variabel Warna dan Tema','Manfaat memahami Variabel Warna dan Tema untuk pemula','Langkah pertama untuk mulai belajar Variabel Warna dan Tema','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Variabel Warna dan Tema\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Variabel Warna dan Tema. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Variabel Warna dan Tema adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['css-dasar', 'Unit: px, rem, dan %', [
            {t:'p',x:'Unit: px, rem, dan % adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Unit: px, rem, dan % akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Unit: px, rem, dan %','Manfaat memahami Unit: px, rem, dan % untuk pemula','Langkah pertama untuk mulai belajar Unit: px, rem, dan %','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Unit: px, rem, dan %\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Unit: px, rem, dan %. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Unit: px, rem, dan % adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['responsif', 'Mobile First dan Media Query', [
            {t:'p',x:'Mobile First dan Media Query adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mobile First dan Media Query akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mobile First dan Media Query','Manfaat memahami Mobile First dan Media Query untuk pemula','Langkah pertama untuk mulai belajar Mobile First dan Media Query','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mobile First dan Media Query\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mobile First dan Media Query. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mobile First dan Media Query adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['responsif', 'Flexbox untuk Deretan', [
            {t:'p',x:'Flexbox untuk Deretan adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Flexbox untuk Deretan akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Flexbox untuk Deretan','Manfaat memahami Flexbox untuk Deretan untuk pemula','Langkah pertama untuk mulai belajar Flexbox untuk Deretan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Flexbox untuk Deretan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Flexbox untuk Deretan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Flexbox untuk Deretan adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['responsif', 'Grid Dua Kolom', [
            {t:'p',x:'Grid Dua Kolom adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Grid Dua Kolom akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Grid Dua Kolom','Manfaat memahami Grid Dua Kolom untuk pemula','Langkah pertama untuk mulai belajar Grid Dua Kolom','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Grid Dua Kolom\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Grid Dua Kolom. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Grid Dua Kolom adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar', 'Variabel dan Tipe Data', [
            {t:'p',x:'Variabel dan Tipe Data adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Variabel dan Tipe Data akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Variabel dan Tipe Data','Manfaat memahami Variabel dan Tipe Data untuk pemula','Langkah pertama untuk mulai belajar Variabel dan Tipe Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Variabel dan Tipe Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Variabel dan Tipe Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Variabel dan Tipe Data adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar', 'Operator dan Coercion', [
            {t:'p',x:'Operator dan Coercion adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Operator dan Coercion akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Operator dan Coercion','Manfaat memahami Operator dan Coercion untuk pemula','Langkah pertama untuk mulai belajar Operator dan Coercion','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Operator dan Coercion\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Operator dan Coercion. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Operator dan Coercion adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar', 'Array dan Objek', [
            {t:'p',x:'Array dan Objek adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Array dan Objek akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Array dan Objek','Manfaat memahami Array dan Objek untuk pemula','Langkah pertama untuk mulai belajar Array dan Objek','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Array dan Objek\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Array dan Objek. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Array dan Objek adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar', 'Percabangan dan Perulangan', [
            {t:'p',x:'Percabangan dan Perulangan adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Percabangan dan Perulangan akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Percabangan dan Perulangan','Manfaat memahami Percabangan dan Perulangan untuk pemula','Langkah pertama untuk mulai belajar Percabangan dan Perulangan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Percabangan dan Perulangan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Percabangan dan Perulangan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Percabangan dan Perulangan adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['backend-database', 'Alur Request-Response', [
            {t:'p',x:'Alur Request-Response adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Alur Request-Response akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Alur Request-Response','Manfaat memahami Alur Request-Response untuk pemula','Langkah pertama untuk mulai belajar Alur Request-Response','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Alur Request-Response\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Alur Request-Response. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Alur Request-Response adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['backend-database', 'Koneksi ke Database', [
            {t:'p',x:'Koneksi ke Database adalah konsep dasar dalam web-dasar. Bayangkan seperti seperti membangun rumah: HTML adalah dinding dan atap, CSS adalah cat dan hiasan, JavaScript adalah listrik dan pintu otomatis. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Koneksi ke Database akan membantu kamu membangun dasar yang kuat dalam web-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Koneksi ke Database','Manfaat memahami Koneksi ke Database untuk pemula','Langkah pertama untuk mulai belajar Koneksi ke Database','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Koneksi ke Database\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Koneksi ke Database. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Koneksi ke Database adalah titik awal dalam perjalanan belajarmu di web-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ts-apa-itu', 'Apa itu TypeScript', [
            {t:'p',x:'Apa itu TypeScript adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu TypeScript akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu TypeScript','Manfaat memahami Apa itu TypeScript untuk pemula','Langkah pertama untuk mulai belajar Apa itu TypeScript','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu TypeScript\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu TypeScript. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu TypeScript adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ts-apa-itu', 'Menginstal TypeScript', [
    { t: 'p', x: 'Pasang TypeScript melalui npm, manajer paket Node.js. Setelah itu, gunakan tsc untuk mengompilasi file .ts menjadi .js.' },
    { t: 'code', lang: 'bash', x: 'npm install -g typescript\\ntsc --version\\ntsc file.ts' },
    { t: 'list', items: ['Instal Node.js dari nodejs.org', 'Jalankan npm install -g typescript di terminal', 'Buat file dengan akhiran .ts', 'Kompilasi dengan tsc namafile.ts'] },
    { t: 'tip', x: 'Gunakan npx tsc jika tidak ingin menginstal secara global.' },
  ], 3],
  ['ts-apa-itu', 'Konfigurasi tsconfig.json', [
            {t:'p',x:'Konfigurasi tsconfig.json adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Konfigurasi tsconfig.json akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Konfigurasi tsconfig.json','Manfaat memahami Konfigurasi tsconfig.json untuk pemula','Langkah pertama untuk mulai belajar Konfigurasi tsconfig.json','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Konfigurasi tsconfig.json\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Konfigurasi tsconfig.json. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Konfigurasi tsconfig.json adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ts-apa-itu', 'Kesalahan Umum: Tipe Tidak Cocok', [
            {t:'p',x:'Kesalahan Umum: Tipe Tidak Cocok adalah kesalahan yang sering dilakukan pemula saat belajar typescript-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Tipe Tidak Cocok karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Tipe Tidak Cocok sering terjadi pada pemula','Cara mudah menghindari Tipe Tidak Cocok','Tanda bahwa kamu mengalami Tipe Tidak Cocok','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Tipe Tidak Cocok\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Tipe Tidak Cocok. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Tipe Tidak Cocok sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['tipe-data', 'Tipe Dasar TypeScript', [
    { t: 'p', x: 'TypeScript punya tipe data dasar: string, number, boolean, null, undefined, dan symbol. Setiap variabel dapat diberi tipe yang jelas.' },
    { t: 'code', lang: 'ts', x: 'let judul: string = \"Belajar TypeScript\";\\nlet halaman: number = 150;\\nlet selesai: boolean = false;\\nlet kosong: null = null;\\nlet belumDiisi: undefined = undefined;' },
    { t: 'list', items: ['string: teks', 'number: angka (bulat atau desimal)', 'boolean: benar atau salah', 'null: sengaja dikosongkan', 'undefined: belum diberi nilai'] },
    { t: 'tip', x: 'TypeScript biasanya bisa menebak tipe (type inference), jadi kamu tidak selalu perlu menuliskan tipe secara eksplisit.' },
  ], 3],
  ['tipe-data', 'Array dan Tuple', [
            {t:'p',x:'Array dan Tuple adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Array dan Tuple akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Array dan Tuple','Manfaat memahami Array dan Tuple untuk pemula','Langkah pertama untuk mulai belajar Array dan Tuple','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Array dan Tuple\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Array dan Tuple. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Array dan Tuple adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['tipe-data', 'Enum dan Any', [
            {t:'p',x:'Enum dan Any adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Enum dan Any akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Enum dan Any','Manfaat memahami Enum dan Any untuk pemula','Langkah pertama untuk mulai belajar Enum dan Any','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Enum dan Any\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Enum dan Any. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Enum dan Any adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['tipe-data', 'Kesalahan Umum: Mengabaikan Error Tipe', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Error Tipe adalah kesalahan yang sering dilakukan pemula saat belajar typescript-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Error Tipe karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Error Tipe sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Error Tipe','Tanda bahwa kamu mengalami Mengabaikan Error Tipe','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Error Tipe\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Error Tipe. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Error Tipe sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['interface-dan-type', 'Interface untuk Objek', [
            {t:'p',x:'Interface untuk Objek adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Interface untuk Objek akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Interface untuk Objek','Manfaat memahami Interface untuk Objek untuk pemula','Langkah pertama untuk mulai belajar Interface untuk Objek','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Interface untuk Objek\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Interface untuk Objek. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Interface untuk Objek adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['interface-dan-type', 'Type Alias', [
            {t:'p',x:'Type Alias adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Type Alias akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Type Alias','Manfaat memahami Type Alias untuk pemula','Langkah pertama untuk mulai belajar Type Alias','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Type Alias\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Type Alias. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Type Alias adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['interface-dan-type', 'Optional dan Readonly', [
            {t:'p',x:'Optional dan Readonly adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Optional dan Readonly akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Optional dan Readonly','Manfaat memahami Optional dan Readonly untuk pemula','Langkah pertama untuk mulai belajar Optional dan Readonly','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Optional dan Readonly\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Optional dan Readonly. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Optional dan Readonly adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['interface-dan-type', 'Kesalahan Umum: Properti Hilang', [
            {t:'p',x:'Kesalahan Umum: Properti Hilang adalah kesalahan yang sering dilakukan pemula saat belajar typescript-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Properti Hilang karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Properti Hilang sering terjadi pada pemula','Cara mudah menghindari Properti Hilang','Tanda bahwa kamu mengalami Properti Hilang','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Properti Hilang\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Properti Hilang. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Properti Hilang sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['fungsi-dan-generic', 'Fungsi dengan Tipe', [
            {t:'p',x:'Fungsi dengan Tipe adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Fungsi dengan Tipe akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Fungsi dengan Tipe','Manfaat memahami Fungsi dengan Tipe untuk pemula','Langkah pertama untuk mulai belajar Fungsi dengan Tipe','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Fungsi dengan Tipe\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Fungsi dengan Tipe. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Fungsi dengan Tipe adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['fungsi-dan-generic', 'Generic Fungsi', [
            {t:'p',x:'Generic Fungsi adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Generic Fungsi akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Generic Fungsi','Manfaat memahami Generic Fungsi untuk pemula','Langkah pertama untuk mulai belajar Generic Fungsi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Generic Fungsi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Generic Fungsi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Generic Fungsi adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['fungsi-dan-generic', 'Generic dengan Array', [
            {t:'p',x:'Generic dengan Array adalah konsep dasar dalam typescript-dasar. Bayangkan seperti seperti JavaScript dengan petunjuk jenis data sehingga kurang salah ketik. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Generic dengan Array akan membantu kamu membangun dasar yang kuat dalam typescript-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Generic dengan Array','Manfaat memahami Generic dengan Array untuk pemula','Langkah pertama untuk mulai belajar Generic dengan Array','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Generic dengan Array\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Generic dengan Array. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Generic dengan Array adalah titik awal dalam perjalanan belajarmu di typescript-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['fungsi-dan-generic', 'Kesalahan Umum: Tipe Tidak Konsisten', [
            {t:'p',x:'Kesalahan Umum: Tipe Tidak Konsisten adalah kesalahan yang sering dilakukan pemula saat belajar typescript-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Tipe Tidak Konsisten karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Tipe Tidak Konsisten sering terjadi pada pemula','Cara mudah menghindari Tipe Tidak Konsisten','Tanda bahwa kamu mengalami Tipe Tidak Konsisten','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Tipe Tidak Konsisten\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Tipe Tidak Konsisten. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Tipe Tidak Konsisten sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Kesalahan Umum: Lupa Return adalah kesalahan yang sering dilakukan pemula saat belajar reactjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Return karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Return sering terjadi pada pemula','Cara mudah menghindari Lupa Return','Tanda bahwa kamu mengalami Lupa Return','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Return\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Return. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Return sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['komponen-dan-props', 'Komponen dan Props', [
    { t: 'p', x: 'Props adalah data yang diterima komponen dari komponen induk. Props bersifat read-only (hanya boleh dibaca, tidak diubah).' },
    { t: 'code', lang: 'jsx', x: 'function Sapaan({ nama }: { nama: string }) {\\n  return <h1>Halo, {nama}</h1>;\\n}\\n\\n// Penggunaan:\\n<Sapaan nama=\"Rafi\" />\\n<Sapaan nama=\"Kanaya\" />' },
    { t: 'list', items: ['Props diterima sebagai parameter fungsi', 'Props tidak boleh diubah oleh komponen penerima', 'Props dapat berupa string, angka, objek, atau fungsi', 'Berikan nama props yang jelas dan deskriptif'] },
    { t: 'tip', x: 'Props mirip atribut HTML, tapi bisa berupa tipe data apa saja dalam JavaScript.' },
  ], 3],
  ['komponen-dan-props', 'Mengirim Props ke Komponen', [
            {t:'p',x:'Mengirim Props ke Komponen adalah konsep dasar dalam reactjs-dasar. Bayangkan seperti seperti bermain lego yang setiap potongan bisa dipasang dan dibuka kembali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengirim Props ke Komponen akan membantu kamu membangun dasar yang kuat dalam reactjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengirim Props ke Komponen','Manfaat memahami Mengirim Props ke Komponen untuk pemula','Langkah pertama untuk mulai belajar Mengirim Props ke Komponen','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengirim Props ke Komponen\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengirim Props ke Komponen. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengirim Props ke Komponen adalah titik awal dalam perjalanan belajarmu di reactjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['komponen-dan-props', 'Props dengan TipeScript', [
            {t:'p',x:'Props dengan TipeScript adalah konsep dasar dalam reactjs-dasar. Bayangkan seperti seperti bermain lego yang setiap potongan bisa dipasang dan dibuka kembali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Props dengan TipeScript akan membantu kamu membangun dasar yang kuat dalam reactjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Props dengan TipeScript','Manfaat memahami Props dengan TipeScript untuk pemula','Langkah pertama untuk mulai belajar Props dengan TipeScript','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Props dengan TipeScript\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Props dengan TipeScript. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Props dengan TipeScript adalah titik awal dalam perjalanan belajarmu di reactjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['komponen-dan-props', 'Kesalahan Umum: Mengubah Props', [
            {t:'p',x:'Kesalahan Umum: Mengubah Props adalah kesalahan yang sering dilakukan pemula saat belajar reactjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengubah Props karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengubah Props sering terjadi pada pemula','Cara mudah menghindari Mengubah Props','Tanda bahwa kamu mengalami Mengubah Props','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengubah Props\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengubah Props. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengubah Props sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Form dan Input Terkontrol adalah konsep dasar dalam reactjs-dasar. Bayangkan seperti seperti bermain lego yang setiap potongan bisa dipasang dan dibuka kembali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Form dan Input Terkontrol akan membantu kamu membangun dasar yang kuat dalam reactjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Form dan Input Terkontrol','Manfaat memahami Form dan Input Terkontrol untuk pemula','Langkah pertama untuk mulai belajar Form dan Input Terkontrol','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Form dan Input Terkontrol\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Form dan Input Terkontrol. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Form dan Input Terkontrol adalah titik awal dalam perjalanan belajarmu di reactjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['state-dan-event', 'Kesalahan Umum: State Tidak Berubah', [
            {t:'p',x:'Kesalahan Umum: State Tidak Berubah adalah kesalahan yang sering dilakukan pemula saat belajar reactjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di State Tidak Berubah karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa State Tidak Berubah sering terjadi pada pemula','Cara mudah menghindari State Tidak Berubah','Tanda bahwa kamu mengalami State Tidak Berubah','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: State Tidak Berubah\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami State Tidak Berubah. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari State Tidak Berubah sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Custom Hook adalah konsep dasar dalam reactjs-dasar. Bayangkan seperti seperti bermain lego yang setiap potongan bisa dipasang dan dibuka kembali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Custom Hook akan membantu kamu membangun dasar yang kuat dalam reactjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Custom Hook','Manfaat memahami Custom Hook untuk pemula','Langkah pertama untuk mulai belajar Custom Hook','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Custom Hook\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Custom Hook. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Custom Hook adalah titik awal dalam perjalanan belajarmu di reactjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['hook-dasar', 'Aturan Hook', [
            {t:'p',x:'Aturan Hook adalah konsep dasar dalam reactjs-dasar. Bayangkan seperti seperti bermain lego yang setiap potongan bisa dipasang dan dibuka kembali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Aturan Hook akan membantu kamu membangun dasar yang kuat dalam reactjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Aturan Hook','Manfaat memahami Aturan Hook untuk pemula','Langkah pertama untuk mulai belajar Aturan Hook','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Aturan Hook\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Aturan Hook. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Aturan Hook adalah titik awal dalam perjalanan belajarmu di reactjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['hook-dasar', 'Kesalahan Umum: Lupa Array Dependensi', [
            {t:'p',x:'Kesalahan Umum: Lupa Array Dependensi adalah kesalahan yang sering dilakukan pemula saat belajar reactjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Array Dependensi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Array Dependensi sering terjadi pada pemula','Cara mudah menghindari Lupa Array Dependensi','Tanda bahwa kamu mengalami Lupa Array Dependensi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Array Dependensi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Array Dependensi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Array Dependensi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['proyek-mini', 'Proyek Mini: Daftar Tugas', [
    { t: 'p', x: 'Buat aplikasi daftar tugas sederhana menggunakan React. Kamu akan menerapkan useState, event handling, dan input terkontrol dalam satu proyek nyata.' },
    { t: 'list', items: ['Tambah tugas baru', 'Tandai tugas selesai', 'Hapus tugas', 'Tampilkan jumlah tugas aktif dan selesai'] },
    { t: 'code', lang: 'jsx', x: 'import { useState } from \"react\";\\n\\nfunction DaftarTugas() {\\n  const [tugas, setTugas] = useState([]);\\n  const [input, setInput] = useState(\"\");\\n\\n  function tambah() {\\n    if (!input.trim()) return;\\n    setTugas([...tugas, { teks: input, selesai: false }]);\\n    setInput(\"\");\\n  }\\n\\n  return (\\n    <div>\\n      <input value={input} onChange={e => setInput(e.target.value)} />\\n      <button onClick={tambah}>Tambah</button>\\n      <ul>\\n        {tugas.map((t, i) => (\\n          <li key={i}>{t.teks}</li>\\n        ))}\\n      </ul>\\n    </div>\\n  );\\n}' },
    { t: 'tip', x: 'Selalu berikan key pada elemen dalam daftar yang di-render dengan map agar React dapat mengidentifikasi setiap item.' },
  ], 5],
  ['next-apa-itu', 'Apa itu Next.js', [
            {t:'p',x:'Apa itu Next.js adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Next.js akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Next.js','Manfaat memahami Apa itu Next.js untuk pemula','Langkah pertama untuk mulai belajar Apa itu Next.js','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Next.js\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Next.js. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Next.js adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['next-apa-itu', 'Menginstal Next.js', [
    { t: 'p', x: 'Gunakan npx create-next-app untuk membuat proyek Next.js baru. Pilih opsi TypeScript, Tailwind CSS, dan App Router sesuai kebutuhan.' },
    { t: 'code', lang: 'bash', x: 'npx create-next-app@latest belajar-next\\ncd belajar-next\\nnpm run dev' },
    { t: 'list', items: ['Pastikan Node.js terinstal', 'Jalankan npx create-next-app@latest nama-proyek', 'Pilih konfigurasi yang diinginkan', 'Jalankan npm run dev untuk mengembangkan'] },
    { t: 'tip', x: 'App Router (folder app) adalah pendekatan terbaru dan direkomendasikan untuk proyek baru.' },
  ], 3],
  ['next-apa-itu', 'Routing Berbasis File', [
            {t:'p',x:'Routing Berbasis File adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Routing Berbasis File akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Routing Berbasis File','Manfaat memahami Routing Berbasis File untuk pemula','Langkah pertama untuk mulai belajar Routing Berbasis File','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Routing Berbasis File\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Routing Berbasis File. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Routing Berbasis File adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['next-apa-itu', 'Kesalahan Umum: Lupa Export Default', [
            {t:'p',x:'Kesalahan Umum: Lupa Export Default adalah kesalahan yang sering dilakukan pemula saat belajar nextjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Export Default karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Export Default sering terjadi pada pemula','Cara mudah menghindari Lupa Export Default','Tanda bahwa kamu mengalami Lupa Export Default','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Export Default\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Export Default. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Export Default sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['routing-dan-ssr', 'Server-Side Rendering (SSR)', [
            {t:'p',x:'Server-Side Rendering (SSR) adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Server-Side Rendering (SSR) akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Server-Side Rendering (SSR)','Manfaat memahami Server-Side Rendering (SSR) untuk pemula','Langkah pertama untuk mulai belajar Server-Side Rendering (SSR)','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Server-Side Rendering (SSR)\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Server-Side Rendering (SSR). Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Server-Side Rendering (SSR) adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['routing-dan-ssr', 'Static Site Generation (SSG)', [
            {t:'p',x:'Static Site Generation (SSG) adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Static Site Generation (SSG) akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Static Site Generation (SSG)','Manfaat memahami Static Site Generation (SSG) untuk pemula','Langkah pertama untuk mulai belajar Static Site Generation (SSG)','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Static Site Generation (SSG)\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Static Site Generation (SSG). Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Static Site Generation (SSG) adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['routing-dan-ssr', 'Route Dinamis', [
            {t:'p',x:'Route Dinamis adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Route Dinamis akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Route Dinamis','Manfaat memahami Route Dinamis untuk pemula','Langkah pertama untuk mulai belajar Route Dinamis','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Route Dinamis\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Route Dinamis. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Route Dinamis adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['routing-dan-ssr', 'Kesalahan Umum: Mengakses Window di SSR', [
            {t:'p',x:'Kesalahan Umum: Mengakses Window di SSR adalah kesalahan yang sering dilakukan pemula saat belajar nextjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengakses Window di SSR karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengakses Window di SSR sering terjadi pada pemula','Cara mudah menghindari Mengakses Window di SSR','Tanda bahwa kamu mengalami Mengakses Window di SSR','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengakses Window di SSR\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengakses Window di SSR. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengakses Window di SSR sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['api-route', 'API Route', [
            {t:'p',x:'API Route adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai API Route akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari API Route','Manfaat memahami API Route untuk pemula','Langkah pertama untuk mulai belajar API Route','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: API Route\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar API Route. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: API Route adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['api-route', 'Mengambil Data dari API Route', [
            {t:'p',x:'Mengambil Data dari API Route adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengambil Data dari API Route akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengambil Data dari API Route','Manfaat memahami Mengambil Data dari API Route untuk pemula','Langkah pertama untuk mulai belajar Mengambil Data dari API Route','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengambil Data dari API Route\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengambil Data dari API Route. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengambil Data dari API Route adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['api-route', 'Kesalahan Umum: Lupa Return Response', [
            {t:'p',x:'Kesalahan Umum: Lupa Return Response adalah kesalahan yang sering dilakukan pemula saat belajar nextjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Return Response karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Return Response sering terjadi pada pemula','Cara mudah menghindari Lupa Return Response','Tanda bahwa kamu mengalami Lupa Return Response','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Return Response\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Return Response. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Return Response sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['deploy', 'Deployment Next.js', [
            {t:'p',x:'Deployment Next.js adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Deployment Next.js akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Deployment Next.js','Manfaat memahami Deployment Next.js untuk pemula','Langkah pertama untuk mulai belajar Deployment Next.js','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Deployment Next.js\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Deployment Next.js. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Deployment Next.js adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['deploy', 'Variabel Lingkungan', [
    { t: 'p', x: 'Variabel lingkungan digunakan untuk menyimpan konfigurasi sensitif seperti kunci API dan URL database. Di Next.js, gunakan file .env.local.' },
    { t: 'code', lang: 'text', x: '# .env.local\\nDATABASE_URL=\"postgresql://user:pass@localhost:5432/db\"\\nAPI_KUNCI=\"rahasia-123\"' },
    { t: 'list', items: ['Buat file .env.local di root proyek', 'Tambahkan variabel dengan format NAMA=nilai', 'Variabel diakses melalui process.env.NAMA', 'Jangan commit .env.local ke GitHub'] },
    { t: 'tip', x: 'Tambahkan .env.local ke file .gitignore agar tidak terunggah ke repositori publik.' },
  ], 3],
  ['deploy', 'Build Produksi', [
            {t:'p',x:'Build Produksi adalah konsep dasar dalam nextjs-dasar. Bayangkan seperti seperti restoran yang dapat memesan makanan untuk diambil segera atau diantar ke rumah. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Build Produksi akan membantu kamu membangun dasar yang kuat dalam nextjs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Build Produksi','Manfaat memahami Build Produksi untuk pemula','Langkah pertama untuk mulai belajar Build Produksi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Build Produksi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Build Produksi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Build Produksi adalah titik awal dalam perjalanan belajarmu di nextjs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['deploy', 'Kesalahan Umum: Build Gagal di Produksi', [
            {t:'p',x:'Kesalahan Umum: Build Gagal di Produksi adalah kesalahan yang sering dilakukan pemula saat belajar nextjs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Build Gagal di Produksi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Build Gagal di Produksi sering terjadi pada pemula','Cara mudah menghindari Build Gagal di Produksi','Tanda bahwa kamu mengalami Build Gagal di Produksi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Build Gagal di Produksi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Build Gagal di Produksi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Build Gagal di Produksi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['node-apa-itu', 'Apa itu Node.js', [
            {t:'p',x:'Apa itu Node.js adalah konsep dasar dalam nodejs-dasar. Bayangkan seperti seperti dapur restoran yang memproses pesanan pelanggan satu per satu. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Node.js akan membantu kamu membangun dasar yang kuat dalam nodejs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Node.js','Manfaat memahami Apa itu Node.js untuk pemula','Langkah pertama untuk mulai belajar Apa itu Node.js','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Node.js\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Node.js. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Node.js adalah titik awal dalam perjalanan belajarmu di nodejs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
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
            {t:'p',x:'Kesalahan Umum: Callback Hell adalah kesalahan yang sering dilakukan pemula saat belajar nodejs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Callback Hell karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Callback Hell sering terjadi pada pemula','Cara mudah menghindari Callback Hell','Tanda bahwa kamu mengalami Callback Hell','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Callback Hell\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Callback Hell. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Callback Hell sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['modul-dan-npm', 'Mengelola Paket dengan npm', [
    { t: 'p', x: 'npm adalah manajer paket bawaan Node.js. Kamu dapat menginstal, memperbarui, dan menghapus pustaka pihak ketiga dengan perintah npm install dan npm uninstall.' },
    { t: 'code', lang: 'bash', x: 'npm install express\\nnpm install lodash --save\\nnpm uninstall paket lama\\nnpm list' },
    { t: 'list', items: ['npm install menambahkan paket ke proyek', 'package.json mencatat semua dependensi', 'node_modules menyimpan file paket yang diinstal', 'npm outdated memeriksa paket yang perlu diperbarui'] },
    { t: 'tip', x: 'Jangan commit folder node_modules ke Git. Tambahkan ke .gitignore dan biarkan orang lain menjalankan npm install.' },
  ], 3],
  ['modul-dan-npm', 'package.json dan package-lock.json', [
            {t:'p',x:'package.json dan package-lock.json adalah konsep dasar dalam nodejs-dasar. Bayangkan seperti seperti dapur restoran yang memproses pesanan pelanggan satu per satu. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai package.json dan package-lock.json akan membantu kamu membangun dasar yang kuat dalam nodejs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari package.json dan package-lock.json','Manfaat memahami package.json dan package-lock.json untuk pemula','Langkah pertama untuk mulai belajar package.json dan package-lock.json','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: package.json dan package-lock.json\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar package.json dan package-lock.json. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: package.json dan package-lock.json adalah titik awal dalam perjalanan belajarmu di nodejs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['modul-dan-npm', 'Skrip npm', [
            {t:'p',x:'Skrip npm adalah konsep dasar dalam nodejs-dasar. Bayangkan seperti seperti dapur restoran yang memproses pesanan pelanggan satu per satu. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Skrip npm akan membantu kamu membangun dasar yang kuat dalam nodejs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Skrip npm','Manfaat memahami Skrip npm untuk pemula','Langkah pertama untuk mulai belajar Skrip npm','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Skrip npm\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Skrip npm. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Skrip npm adalah titik awal dalam perjalanan belajarmu di nodejs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['modul-dan-npm', 'Kesalahan Umum: Modul Tidak Ditemukan', [
            {t:'p',x:'Kesalahan Umum: Modul Tidak Ditemukan adalah kesalahan yang sering dilakukan pemula saat belajar nodejs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Modul Tidak Ditemukan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Modul Tidak Ditemukan sering terjadi pada pemula','Cara mudah menghindari Modul Tidak Ditemukan','Tanda bahwa kamu mengalami Modul Tidak Ditemukan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Modul Tidak Ditemukan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Modul Tidak Ditemukan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Modul Tidak Ditemukan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Mengirim dan Menerima JSON adalah konsep dasar dalam nodejs-dasar. Bayangkan seperti seperti dapur restoran yang memproses pesanan pelanggan satu per satu. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengirim dan Menerima JSON akan membantu kamu membangun dasar yang kuat dalam nodejs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengirim dan Menerima JSON','Manfaat memahami Mengirim dan Menerima JSON untuk pemula','Langkah pertama untuk mulai belajar Mengirim dan Menerima JSON','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengirim dan Menerima JSON\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengirim dan Menerima JSON. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengirim dan Menerima JSON adalah titik awal dalam perjalanan belajarmu di nodejs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['rest-api', 'Kesalahan Umum: Lupa Middleware JSON', [
            {t:'p',x:'Kesalahan Umum: Lupa Middleware JSON adalah kesalahan yang sering dilakukan pemula saat belajar nodejs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Middleware JSON karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Middleware JSON sering terjadi pada pemula','Cara mudah menghindari Lupa Middleware JSON','Tanda bahwa kamu mengalami Lupa Middleware JSON','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Middleware JSON\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Middleware JSON. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Middleware JSON sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['database-koneksi', 'Koneksi ke Database', [
    { t: 'p', x: 'Node.js dapat terhubung ke berbagai database, termasuk PostgreSQL, MySQL, MongoDB, dan SQLite. Gunakan driver atau ORM yang sesuai dengan database yang kamu pilih.' },
    { t: 'code', lang: 'js', x: 'const { Pool } = require(\"pg\");\\nconst pool = new Pool({\\n  user: \"postgres\",\\n  host: \"localhost\",\\n  database: \"eduverse\",\\n  password: \"rahasia\",\\n  port: 5432,\\n});\\n\\npool.query(\"SELECT * FROM kursus\", (err, res) => {\\n  console.log(res.rows);\\n});' },
    { t: 'list', items: ['Pilih driver sesuai database (pg untuk PostgreSQL)', 'Konfigurasi host, port, nama database, pengguna, dan kata sandi', 'Gunakan connection pool untuk efisiensi', 'Tutup koneksi saat tidak diperlukan'] },
    { t: 'tip', x: 'Jangan simpan kata sandi database langsung dalam kode. Gunakan variabel lingkungan.' },
  ], 3],
  ['database-koneksi', 'Query Parameterized', [
            {t:'p',x:'Query Parameterized adalah konsep dasar dalam nodejs-dasar. Bayangkan seperti seperti dapur restoran yang memproses pesanan pelanggan satu per satu. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Query Parameterized akan membantu kamu membangun dasar yang kuat dalam nodejs-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Query Parameterized','Manfaat memahami Query Parameterized untuk pemula','Langkah pertama untuk mulai belajar Query Parameterized','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Query Parameterized\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Query Parameterized. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Query Parameterized adalah titik awal dalam perjalanan belajarmu di nodejs-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['database-koneksi', 'Kesalahan Umum: SQL Injection', [
            {t:'p',x:'Kesalahan Umum: SQL Injection adalah kesalahan yang sering dilakukan pemula saat belajar nodejs-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di SQL Injection karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa SQL Injection sering terjadi pada pemula','Cara mudah menghindari SQL Injection','Tanda bahwa kamu mengalami SQL Injection','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: SQL Injection\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami SQL Injection. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari SQL Injection sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['php-apa-itu', 'Apa itu PHP', [
            {t:'p',x:'Apa itu PHP adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu PHP akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu PHP','Manfaat memahami Apa itu PHP untuk pemula','Langkah pertama untuk mulai belajar Apa itu PHP','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu PHP\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu PHP. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu PHP adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
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
            {t:'p',x:'Kesalahan Umum: Lupa Titik Koma adalah kesalahan yang sering dilakukan pemula saat belajar php-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Titik Koma karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Titik Koma sering terjadi pada pemula','Cara mudah menghindari Lupa Titik Koma','Tanda bahwa kamu mengalami Lupa Titik Koma','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Titik Koma\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Titik Koma. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Titik Koma sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
['form-dan-database', 'Membuat Form HTML dengan PHP', [
            {t:'p',x:'Membuat Form HTML dengan PHP adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat Form HTML dengan PHP akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat Form HTML dengan PHP','Manfaat memahami Membuat Form HTML dengan PHP untuk pemula','Langkah pertama untuk mulai belajar Membuat Form HTML dengan PHP','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat Form HTML dengan PHP\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat Form HTML dengan PHP. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat Form HTML dengan PHP adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['form-dan-database', 'Mengirim Data Form ke Server', [
    { t: 'p', x: 'Data form diterima PHP melalui superglobal $_POST atau $_GET tergantung method form. Nilai diakses dengan nama input.' },
    { t: 'code', lang: 'php', x: '<?php\\n\\n$nama = $_POST[\\"nama\\"];\\n\\n$email = $_POST[\\"email\\"];\\n\\n\\necho \\"Halo, $nama\\";\\n\\n?>' },
    { t: 'list', items: ['$_POST untuk method POST', '$_GET untuk method GET', 'Akses dengan nama input'] },
    { t: 'tip', x: 'Cek apakah data dikirim dengan isset() sebelum mengakses.' },
], 4],
['form-dan-database', 'Koneksi PHP ke Database', [
            {t:'p',x:'Koneksi PHP ke Database adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Koneksi PHP ke Database akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Koneksi PHP ke Database','Manfaat memahami Koneksi PHP ke Database untuk pemula','Langkah pertama untuk mulai belajar Koneksi PHP ke Database','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Koneksi PHP ke Database\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Koneksi PHP ke Database. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Koneksi PHP ke Database adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['form-dan-database', 'Menyimpan Data Form ke Database', [
            {t:'p',x:'Menyimpan Data Form ke Database adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menyimpan Data Form ke Database akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menyimpan Data Form ke Database','Manfaat memahami Menyimpan Data Form ke Database untuk pemula','Langkah pertama untuk mulai belajar Menyimpan Data Form ke Database','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menyimpan Data Form ke Database\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menyimpan Data Form ke Database. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menyimpan Data Form ke Database adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['session-dan-keamanan', 'Apa itu Session PHP', [
            {t:'p',x:'Apa itu Session PHP adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Session PHP akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Session PHP','Manfaat memahami Apa itu Session PHP untuk pemula','Langkah pertama untuk mulai belajar Apa itu Session PHP','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Session PHP\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Session PHP. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Session PHP adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['session-dan-keamanan', 'Membuat dan Menggunakan Session', [
    { t: 'p', x: 'Mulai session, simpan data di $_SESSION, baca di halaman lain, dan hancurkan dengan session_destroy() saat logout.' },
    { t: 'code', lang: 'php', x: '<?php\\n\\nsession_start();\\n\\n$_SESSION[\\"user\\"] = \\"Rafi\\";\\n\\n\\n// halaman lain\\n\\necho $_SESSION[\\"user\\"];\\n\\n?>' },
    { t: 'list', items: ['session_start() memulai session', 'Simpan data di $_SESSION', 'Hancurkan dengan session_destroy()'] },
    { t: 'tip', x: 'Panggil session_start() di awal setiap halaman yang butuh session.' },
], 3],
['session-dan-keamanan', 'Keamanan Dasar PHP', [
            {t:'p',x:'Keamanan Dasar PHP adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Keamanan Dasar PHP akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Keamanan Dasar PHP','Manfaat memahami Keamanan Dasar PHP untuk pemula','Langkah pertama untuk mulai belajar Keamanan Dasar PHP','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Keamanan Dasar PHP\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Keamanan Dasar PHP. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Keamanan Dasar PHP adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
['session-dan-keamanan', 'Melindungi dari Serangan Umum', [
            {t:'p',x:'Melindungi dari Serangan Umum adalah konsep dasar dalam php-dasar. Bayangkan seperti seperti pengatur di balik layar website yang memproses formulir dan database. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Melindungi dari Serangan Umum akan membantu kamu membangun dasar yang kuat dalam php-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Melindungi dari Serangan Umum','Manfaat memahami Melindungi dari Serangan Umum untuk pemula','Langkah pertama untuk mulai belajar Melindungi dari Serangan Umum','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Melindungi dari Serangan Umum\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Melindungi dari Serangan Umum. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Melindungi dari Serangan Umum adalah titik awal dalam perjalanan belajarmu di php-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
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
            {t:'p',x:'Kesalahan Umum: Variabel Tidak Didefinisikan adalah kesalahan yang sering dilakukan pemula saat belajar php-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Variabel Tidak Didefinisikan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Variabel Tidak Didefinisikan sering terjadi pada pemula','Cara mudah menghindari Variabel Tidak Didefinisikan','Tanda bahwa kamu mengalami Variabel Tidak Didefinisikan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Variabel Tidak Didefinisikan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Variabel Tidak Didefinisikan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Variabel Tidak Didefinisikan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['laravel-apa-itu', 'Apa itu Laravel', [
            {t:'p',x:'Apa itu Laravel adalah konsep dasar dalam laravel-dasar. Bayangkan seperti seperti bingkai rumah jadi yang sudah lengkap dengan instalasi listrik dan air. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Laravel akan membantu kamu membangun dasar yang kuat dalam laravel-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Laravel','Manfaat memahami Apa itu Laravel untuk pemula','Langkah pertama untuk mulai belajar Apa itu Laravel','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Laravel\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Laravel. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Laravel adalah titik awal dalam perjalanan belajarmu di laravel-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['laravel-apa-itu', 'Menginstal Laravel', [
    { t: 'p', x: 'Laravel memerlukan PHP dan Composer. Composer adalah manajer dependensi untuk PHP, mirip seperti npm untuk Node.js.' },
    { t: 'code', lang: 'bash', x: 'composer create-project laravel/laravel belajar-laravel\\ncd belajar-laravel\\nphp artisan serve' },
    { t: 'list', items: ['Instal PHP dan Composer', 'Jalankan composer create-project laravel/laravel nama-proyek', 'Masuk ke folder proyek', 'Jalankan php artisan serve untuk server pengembangan'] },
    { t: 'tip', x: 'php artisan adalah command-line tool bawaan Laravel untuk berbagai tugas pengembangan.' },
  ], 3],
  ['laravel-apa-itu', 'Arsitektur MVC', [
            {t:'p',x:'Arsitektur MVC adalah konsep dasar dalam laravel-dasar. Bayangkan seperti seperti bingkai rumah jadi yang sudah lengkap dengan instalasi listrik dan air. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Arsitektur MVC akan membantu kamu membangun dasar yang kuat dalam laravel-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Arsitektur MVC','Manfaat memahami Arsitektur MVC untuk pemula','Langkah pertama untuk mulai belajar Arsitektur MVC','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Arsitektur MVC\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Arsitektur MVC. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Arsitektur MVC adalah titik awal dalam perjalanan belajarmu di laravel-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['laravel-apa-itu', 'Kesalahan Umum: Lupa Menjalankan Migrasi', [
            {t:'p',x:'Kesalahan Umum: Lupa Menjalankan Migrasi adalah kesalahan yang sering dilakukan pemula saat belajar laravel-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Menjalankan Migrasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Menjalankan Migrasi sering terjadi pada pemula','Cara mudah menghindari Lupa Menjalankan Migrasi','Tanda bahwa kamu mengalami Lupa Menjalankan Migrasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Menjalankan Migrasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Menjalankan Migrasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Menjalankan Migrasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['eloquent-dan-blade', 'Eloquent ORM', [
    { t: 'p', x: 'Eloquent adalah ORM bawaan Laravel yang memungkinkan kamu berinteraksi dengan database menggunakan sintaks PHP, bukan query SQL mentah.' },
    { t: 'code', lang: 'php', x: 'use App\Models\\Siswa;\\n\\n$siswa = Siswa::all();\\n$siswaBaru = Siswa::create([\\n  \"nama\" => \"Rafi\",\\n  \"email\" => \"rafi@example.com\",\\n]);\\n\\n$siswaDitemukan = Siswa::find(1);' },
    { t: 'list', items: ['Setiap tabel database memiliki Model yang sesuai', 'Eloquent menangani query SQL secara otomatis', 'Relasi antar tabel didefinisikan di Model', 'Hasil query adalah objek, bukan array mentah'] },
    { t: 'tip', x: 'Eloquent membuat kode database lebih mudah dibaca dan dipelihara dibanding query SQL mentah.' },
  ], 4],
  ['eloquent-dan-blade', 'Relasi Antar Model', [
            {t:'p',x:'Relasi Antar Model adalah konsep dasar dalam laravel-dasar. Bayangkan seperti seperti bingkai rumah jadi yang sudah lengkap dengan instalasi listrik dan air. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Relasi Antar Model akan membantu kamu membangun dasar yang kuat dalam laravel-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Relasi Antar Model','Manfaat memahami Relasi Antar Model untuk pemula','Langkah pertama untuk mulai belajar Relasi Antar Model','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Relasi Antar Model\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Relasi Antar Model. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Relasi Antar Model adalah titik awal dalam perjalanan belajarmu di laravel-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['eloquent-dan-blade', 'Blade Templating', [
    { t: 'p', x: 'Blade adalah mesin templating Laravel. Blade memungkinkan kamu menulis HTML dengan direktif PHP yang ringkas, seperti @if, @foreach, dan @extends.' },
    { t: 'code', lang: 'php', x: '{{-- layout.blade.php --}}\\n<html>\\n  <body>@yield(\"konten\")</body>\\n</html>\\n\\n{{-- halaman.blade.php --}}\\n@extends(\"layout\")\\n@section(\"konten\")\\n  <h1>Selamat Datang</h1>\\n@endsection' },
    { t: 'list', items: ['@extends untuk mewarisi tata letak', '@section untuk mendefinisikan bagian konten', '@yield untuk menampilkan bagian konten', '@if dan @foreach untuk logika di tampilan'] },
    { t: 'tip', x: 'Gunakan double kurung kurawal {{ }} untuk mencetak variabel dengan otomatis di-escape (amankan dari XSS).' },
  ], 3],
  ['eloquent-dan-blade', 'Kesalahan Umum: N+1 Query Problem', [
            {t:'p',x:'Kesalahan Umum: N+1 Query Problem adalah kesalahan yang sering dilakukan pemula saat belajar laravel-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di N+1 Query Problem karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa N+1 Query Problem sering terjadi pada pemula','Cara mudah menghindari N+1 Query Problem','Tanda bahwa kamu mengalami N+1 Query Problem','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: N+1 Query Problem\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami N+1 Query Problem. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari N+1 Query Problem sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Kesalahan Umum: Nama Tabel Tidak Cocok adalah kesalahan yang sering dilakukan pemula saat belajar laravel-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Nama Tabel Tidak Cocok karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Nama Tabel Tidak Cocok sering terjadi pada pemula','Cara mudah menghindari Nama Tabel Tidak Cocok','Tanda bahwa kamu mengalami Nama Tabel Tidak Cocok','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Nama Tabel Tidak Cocok\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Nama Tabel Tidak Cocok. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Nama Tabel Tidak Cocok sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['proyek-mini', 'Proyek Mini: Blog Sederhana', [
    { t: 'p', x: 'Buat blog sederhana menggunakan Laravel. Kamu akan menerapkan routing, controller, Eloquent, Blade, dan migrasi dalam satu proyek nyata.' },
    { t: 'list', items: ['Buat model dan migrasi untuk tabel postingan', 'Buat controller untuk mengelola postingan', 'Buat route untuk halaman daftar dan detail postingan', 'Buat tampilan Blade untuk menampilkan postingan', 'Tambahkan fitur membuat, mengedit, dan menghapus postingan'] },
    { t: 'code', lang: 'php', x: 'php artisan make:model Postingan -m\\nphp artisan make:controller PostinganController --resource' },
    { t: 'tip', x: 'Gunakan flag --resource pada controller untuk menghasilkan semua metode CRUD secara otomatis.' },
  ], 5],
  ['ci-apa-itu', 'Apa itu CodeIgniter', [
            {t:'p',x:'Apa itu CodeIgniter adalah konsep dasar dalam codeigniter-dasar. Bayangkan seperti seperti bingkai pembuatan website yang ringan dan cepat dipelajari pemula. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu CodeIgniter akan membantu kamu membangun dasar yang kuat dalam codeigniter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu CodeIgniter','Manfaat memahami Apa itu CodeIgniter untuk pemula','Langkah pertama untuk mulai belajar Apa itu CodeIgniter','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu CodeIgniter\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu CodeIgniter. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu CodeIgniter adalah titik awal dalam perjalanan belajarmu di codeigniter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ci-apa-itu', 'Menginstal CodeIgniter', [
    { t: 'p', x: 'CodeIgniter dapat diinstal melalui Composer atau dengan mengunduh langsung dari situs resmi. Pastikan PHP dan server web sudah terinstal.' },
    { t: 'code', lang: 'bash', x: 'composer create-project codeigniter4/appstarter belajar-ci\\ncd belajar-ci\\nphp spark serve' },
    { t: 'list', items: ['Instal PHP dan Composer', 'Jalankan composer create-project codeigniter4/appstarter nama-proyek', 'Masuk ke folder proyek', 'Jalankan php spark serve untuk server pengembangan'] },
    { t: 'tip', x: 'php spark adalah command-line tool bawaan CodeIgniter 4.' },
  ], 3],
  ['ci-apa-itu', 'MVC di CodeIgniter', [
            {t:'p',x:'MVC di CodeIgniter adalah konsep dasar dalam codeigniter-dasar. Bayangkan seperti seperti bingkai pembuatan website yang ringan dan cepat dipelajari pemula. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai MVC di CodeIgniter akan membantu kamu membangun dasar yang kuat dalam codeigniter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari MVC di CodeIgniter','Manfaat memahami MVC di CodeIgniter untuk pemula','Langkah pertama untuk mulai belajar MVC di CodeIgniter','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: MVC di CodeIgniter\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar MVC di CodeIgniter. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: MVC di CodeIgniter adalah titik awal dalam perjalanan belajarmu di codeigniter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ci-apa-itu', 'Kesalahan Umum: Case Sensitivity', [
            {t:'p',x:'Kesalahan Umum: Case Sensitivity adalah kesalahan yang sering dilakukan pemula saat belajar codeigniter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Case Sensitivity karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Case Sensitivity sering terjadi pada pemula','Cara mudah menghindari Case Sensitivity','Tanda bahwa kamu mengalami Case Sensitivity','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Case Sensitivity\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Case Sensitivity. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Case Sensitivity sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Kesalahan Umum: Lupa esc() pada Output adalah kesalahan yang sering dilakukan pemula saat belajar codeigniter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa esc() pada Output karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa esc() pada Output sering terjadi pada pemula','Cara mudah menghindari Lupa esc() pada Output','Tanda bahwa kamu mengalami Lupa esc() pada Output','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa esc() pada Output\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa esc() pada Output. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa esc() pada Output sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['query-builder', 'Query Builder CodeIgniter', [
    { t: 'p', x: 'Query Builder CodeIgniter menyediakan metode untuk melakukan operasi database (select, insert, update, delete) tanpa menulis SQL mentah, sehingga kode lebih portabel dan aman.' },
    { t: 'code', lang: 'php', x: '$builder = $this->db->table(\"siswa\");\\n$siswa = $builder->get()->getResult();\\n\\n$builder->where(\"id\", 1);\\n$siswa = $builder->get()->getRow();' },
    { t: 'list', items: ['get() untuk mengambil data', 'insert() untuk menambah data', 'update() untuk memperbarui data', 'delete() untuk menghapus data', 'where() untuk menyaring data'] },
    { t: 'tip', x: 'Query Builder otomatis menangani escaping, sehingga membantu mencegah SQL Injection.' },
  ], 3],
  ['query-builder', 'Mengambil Data dengan Query Builder', [
            {t:'p',x:'Mengambil Data dengan Query Builder adalah konsep dasar dalam codeigniter-dasar. Bayangkan seperti seperti bingkai pembuatan website yang ringan dan cepat dipelajari pemula. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengambil Data dengan Query Builder akan membantu kamu membangun dasar yang kuat dalam codeigniter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengambil Data dengan Query Builder','Manfaat memahami Mengambil Data dengan Query Builder untuk pemula','Langkah pertama untuk mulai belajar Mengambil Data dengan Query Builder','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengambil Data dengan Query Builder\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengambil Data dengan Query Builder. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengambil Data dengan Query Builder adalah titik awal dalam perjalanan belajarmu di codeigniter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['query-builder', 'Menambah dan Memperbarui Data', [
    { t: 'p', x: 'insert() digunakan untuk menambah data baru ke tabel, sedangkan update() digunakan untuk memperbarui data yang sudah ada berdasarkan kondensi.' },
    { t: 'code', lang: 'php', x: '$this->db->table(\"siswa\")->insert([\\n  \"nama\" => \"Rafi\",\\n  \"email\" => \"rafi@example.com\"\\n]);\\n\\n$this->db->table(\"siswa\")\\n  ->where(\"id\", 1)\\n  ->update([\"nama\" => \"Rafi Updated\"]);' },
    { t: 'list', items: ['insert() untuk menambah data', 'update() untuk memperbarui data', 'where() untuk menentukan baris yang diperbarui', 'Gunakan $allowedFields di Model untuk keamanan'] },
    { t: 'tip', x: 'Selalu sertakan where() saat update agar tidak memperbarui seluruh tabel secara tidak sengaja.' },
  ], 3],
  ['query-builder', 'Kesalahan Umum: Lupa where pada Update', [
            {t:'p',x:'Kesalahan Umum: Lupa where pada Update adalah kesalahan yang sering dilakukan pemula saat belajar codeigniter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa where pada Update karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa where pada Update sering terjadi pada pemula','Cara mudah menghindari Lupa where pada Update','Tanda bahwa kamu mengalami Lupa where pada Update','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa where pada Update\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa where pada Update. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa where pada Update sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['proyek-mini', 'Proyek Mini: Manajemen Kontak', [
    { t: 'p', x: 'Buat aplikasi manajemen kontak sederhana menggunakan CodeIgniter. Kamu akan menerapkan MVC, Query Builder, dan validasi input dalam satu proyek nyata.' },
    { t: 'list', items: ['Buat model dan migrasi untuk tabel kontak', 'Buat controller untuk mengelola kontak', 'Buat route untuk halaman daftar, tambah, edit, dan hapus', 'Buat tampilan untuk formulir dan daftar kontak', 'Tambahkan validasi input sebelum menyimpan kontak'] },
    { t: 'code', lang: 'bash', x: 'php spark make:model Kontak --database\\nphp spark make:controller Kontak' },
    { t: 'tip', x: 'Gunakan validasi bawaan CodeIgniter untuk memastikan data kontak lengkap dan benar sebelum disimpan.' },
  ], 5],
  ['android-studio', 'Menginstal Android Studio', [
    { t: 'p', x: 'Android Studio adalah lingkungan pengembangan terintegrasi (IDE) resmi untuk membuat aplikasi Android. Unduh dari situs resmi Android Developer dan pilih versi yang cocok dengan sistem operasi komputermu.' },
    { t: 'code', lang: 'bash', x: '# Unduh Android Studio dari developer.android.com\\n# Jalankan installer dan ikuti petunjuk setup\\n# Pilih instalasi standar dan unduh komponen SDK yang diperlukan' },
    { t: 'list', items: ['Unduh Android Studio dari situs resmi', 'Jalankan installer dan pilih setup standar', 'Unduh Android SDK dan emulator yang disarankan', 'Buat proyek baru dengan template Empty Activity'] },
    { t: 'tip', x: 'Pilih versi stabil (stable) Android Studio agar fitur dan emulator berjalan lancar tanpa error berlebihan.' },
  ], 4],
  ['android-studio', 'Mengenal Antarmuka Android Studio', [
            {t:'p',x:'Mengenal Antarmuka Android Studio adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengenal Antarmuka Android Studio akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengenal Antarmuka Android Studio','Manfaat memahami Mengenal Antarmuka Android Studio untuk pemula','Langkah pertama untuk mulai belajar Mengenal Antarmuka Android Studio','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengenal Antarmuka Android Studio\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengenal Antarmuka Android Studio. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengenal Antarmuka Android Studio adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['android-studio', 'Kesalahan Umum: Emulator Lambat atau Tidak Bisa Dijalankan', [
            {t:'p',x:'Kesalahan Umum: Emulator Lambat atau Tidak Bisa Dijalankan adalah kesalahan yang sering dilakukan pemula saat belajar android-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Emulator Lambat atau Tidak Bisa Dijalankan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Emulator Lambat atau Tidak Bisa Dijalankan sering terjadi pada pemula','Cara mudah menghindari Emulator Lambat atau Tidak Bisa Dijalankan','Tanda bahwa kamu mengalami Emulator Lambat atau Tidak Bisa Dijalankan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Emulator Lambat atau Tidak Bisa Dijalankan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Emulator Lambat atau Tidak Bisa Dijalankan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Emulator Lambat atau Tidak Bisa Dijalankan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['kotlin-dasar', 'Apa itu Kotlin', [
            {t:'p',x:'Apa itu Kotlin adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Kotlin akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Kotlin','Manfaat memahami Apa itu Kotlin untuk pemula','Langkah pertama untuk mulai belajar Apa itu Kotlin','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Kotlin\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Kotlin. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Kotlin adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kotlin-dasar', 'Variabel dan Tipe Data', [
            {t:'p',x:'Variabel dan Tipe Data adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Variabel dan Tipe Data akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Variabel dan Tipe Data','Manfaat memahami Variabel dan Tipe Data untuk pemula','Langkah pertama untuk mulai belajar Variabel dan Tipe Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Variabel dan Tipe Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Variabel dan Tipe Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Variabel dan Tipe Data adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kotlin-dasar', 'Fungsi', [
            {t:'p',x:'Fungsi adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Fungsi akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Fungsi','Manfaat memahami Fungsi untuk pemula','Langkah pertama untuk mulai belajar Fungsi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Fungsi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Fungsi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Fungsi adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kotlin-dasar', 'Kesalahan Umum: NullPointerException', [
            {t:'p',x:'Kesalahan Umum: NullPointerException adalah kesalahan yang sering dilakukan pemula saat belajar android-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di NullPointerException karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa NullPointerException sering terjadi pada pemula','Cara mudah menghindari NullPointerException','Tanda bahwa kamu mengalami NullPointerException','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: NullPointerException\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami NullPointerException. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari NullPointerException sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['layout-dan-activity', 'Activity dan Siklus Hidup', [
            {t:'p',x:'Activity dan Siklus Hidup adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Activity dan Siklus Hidup akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Activity dan Siklus Hidup','Manfaat memahami Activity dan Siklus Hidup untuk pemula','Langkah pertama untuk mulai belajar Activity dan Siklus Hidup','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Activity dan Siklus Hidup\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Activity dan Siklus Hidup. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Activity dan Siklus Hidup adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['layout-dan-activity', 'Layout XML Dasar', [
            {t:'p',x:'Layout XML Dasar adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Layout XML Dasar akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Layout XML Dasar','Manfaat memahami Layout XML Dasar untuk pemula','Langkah pertama untuk mulai belajar Layout XML Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Layout XML Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Layout XML Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Layout XML Dasar adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['layout-dan-activity', 'Menghubungkan Layout ke Activity', [
            {t:'p',x:'Menghubungkan Layout ke Activity adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menghubungkan Layout ke Activity akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menghubungkan Layout ke Activity','Manfaat memahami Menghubungkan Layout ke Activity untuk pemula','Langkah pertama untuk mulai belajar Menghubungkan Layout ke Activity','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menghubungkan Layout ke Activity\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menghubungkan Layout ke Activity. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menghubungkan Layout ke Activity adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['layout-dan-activity', 'Kesalahan Umum: Lupa setContentView', [
            {t:'p',x:'Kesalahan Umum: Lupa setContentView adalah kesalahan yang sering dilakukan pemula saat belajar android-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa setContentView karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa setContentView sering terjadi pada pemula','Cara mudah menghindari Lupa setContentView','Tanda bahwa kamu mengalami Lupa setContentView','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa setContentView\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa setContentView. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa setContentView sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['publish-play-store', 'Mengonfigurasi Aplikasi untuk Rilis', [
            {t:'p',x:'Mengonfigurasi Aplikasi untuk Rilis adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengonfigurasi Aplikasi untuk Rilis akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengonfigurasi Aplikasi untuk Rilis','Manfaat memahami Mengonfigurasi Aplikasi untuk Rilis untuk pemula','Langkah pertama untuk mulai belajar Mengonfigurasi Aplikasi untuk Rilis','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengonfigurasi Aplikasi untuk Rilis\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengonfigurasi Aplikasi untuk Rilis. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengonfigurasi Aplikasi untuk Rilis adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['publish-play-store', 'Membuat File AAB dan APK', [
            {t:'p',x:'Membuat File AAB dan APK adalah konsep dasar dalam android-dasar. Bayangkan seperti seperti merancang aplikasi untuk telepon genggam yang bisa diunduh dari toko aplikasi. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Membuat File AAB dan APK akan membantu kamu membangun dasar yang kuat dalam android-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Membuat File AAB dan APK','Manfaat memahami Membuat File AAB dan APK untuk pemula','Langkah pertama untuk mulai belajar Membuat File AAB dan APK','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Membuat File AAB dan APK\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Membuat File AAB dan APK. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Membuat File AAB dan APK adalah titik awal dalam perjalanan belajarmu di android-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['publish-play-store', 'Kesalahan Umum: Izin yang Tidak Digunakan', [
            {t:'p',x:'Kesalahan Umum: Izin yang Tidak Digunakan adalah kesalahan yang sering dilakukan pemula saat belajar android-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Izin yang Tidak Digunakan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Izin yang Tidak Digunakan sering terjadi pada pemula','Cara mudah menghindari Izin yang Tidak Digunakan','Tanda bahwa kamu mengalami Izin yang Tidak Digunakan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Izin yang Tidak Digunakan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Izin yang Tidak Digunakan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Izin yang Tidak Digunakan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['xcode-dan-swift', 'Menginstal Xcode dan Swift', [
            {t:'p',x:'Menginstal Xcode dan Swift adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menginstal Xcode dan Swift akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menginstal Xcode dan Swift','Manfaat memahami Menginstal Xcode dan Swift untuk pemula','Langkah pertama untuk mulai belajar Menginstal Xcode dan Swift','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menginstal Xcode dan Swift\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menginstal Xcode dan Swift. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menginstal Xcode dan Swift adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['xcode-dan-swift', 'Apa itu Swift', [
            {t:'p',x:'Apa itu Swift adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Swift akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Swift','Manfaat memahami Apa itu Swift untuk pemula','Langkah pertama untuk mulai belajar Apa itu Swift','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Swift\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Swift. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Swift adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['xcode-dan-swift', 'Kesalahan Umum: Lupa Outlet dan Action', [
            {t:'p',x:'Kesalahan Umum: Lupa Outlet dan Action adalah kesalahan yang sering dilakukan pemula saat belajar ios-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Outlet dan Action karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Outlet dan Action sering terjadi pada pemula','Cara mudah menghindari Lupa Outlet dan Action','Tanda bahwa kamu mengalami Lupa Outlet dan Action','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Outlet dan Action\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Outlet dan Action. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Outlet dan Action sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['swiftui-dasar', 'Mengenal SwiftUI', [
            {t:'p',x:'Mengenal SwiftUI adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengenal SwiftUI akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengenal SwiftUI','Manfaat memahami Mengenal SwiftUI untuk pemula','Langkah pertama untuk mulai belajar Mengenal SwiftUI','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengenal SwiftUI\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengenal SwiftUI. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengenal SwiftUI adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['swiftui-dasar', 'State dan Binding', [
            {t:'p',x:'State dan Binding adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai State dan Binding akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari State dan Binding','Manfaat memahami State dan Binding untuk pemula','Langkah pertama untuk mulai belajar State dan Binding','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: State dan Binding\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar State dan Binding. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: State dan Binding adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['swiftui-dasar', 'Kesalahan Umum: Mengubah State Langsung', [
            {t:'p',x:'Kesalahan Umum: Mengubah State Langsung adalah kesalahan yang sering dilakukan pemula saat belajar ios-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengubah State Langsung karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengubah State Langsung sering terjadi pada pemula','Cara mudah menghindari Mengubah State Langsung','Tanda bahwa kamu mengalami Mengubah State Langsung','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengubah State Langsung\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengubah State Langsung. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengubah State Langsung sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['navigasi-dan-layar', 'Navigasi Antar Layar', [
            {t:'p',x:'Navigasi Antar Layar adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Navigasi Antar Layar akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Navigasi Antar Layar','Manfaat memahami Navigasi Antar Layar untuk pemula','Langkah pertama untuk mulai belajar Navigasi Antar Layar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Navigasi Antar Layar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Navigasi Antar Layar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Navigasi Antar Layar adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['navigasi-dan-layar', 'Mengirim Data Antar Layar', [
            {t:'p',x:'Mengirim Data Antar Layar adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengirim Data Antar Layar akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengirim Data Antar Layar','Manfaat memahami Mengirim Data Antar Layar untuk pemula','Langkah pertama untuk mulai belajar Mengirim Data Antar Layar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengirim Data Antar Layar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengirim Data Antar Layar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengirim Data Antar Layar adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['navigasi-dan-layar', 'Kesalahan Umum: Navigasi Tanpa Kontainer', [
            {t:'p',x:'Kesalahan Umum: Navigasi Tanpa Kontainer adalah kesalahan yang sering dilakukan pemula saat belajar ios-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Navigasi Tanpa Kontainer karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Navigasi Tanpa Kontainer sering terjadi pada pemula','Cara mudah menghindari Navigasi Tanpa Kontainer','Tanda bahwa kamu mengalami Navigasi Tanpa Kontainer','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Navigasi Tanpa Kontainer\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Navigasi Tanpa Kontainer. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Navigasi Tanpa Kontainer sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['app-store', 'Mengunggah ke App Store', [
            {t:'p',x:'Mengunggah ke App Store adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengunggah ke App Store akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengunggah ke App Store','Manfaat memahami Mengunggah ke App Store untuk pemula','Langkah pertama untuk mulai belajar Mengunggah ke App Store','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengunggah ke App Store\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengunggah ke App Store. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengunggah ke App Store adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['app-store', 'TestFlight untuk Pengujian Beta', [
            {t:'p',x:'TestFlight untuk Pengujian Beta adalah konsep dasar dalam ios-dasar. Bayangkan seperti seperti membuat aplikasi untuk iPhone dengan alat bantu dari Apple. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai TestFlight untuk Pengujian Beta akan membantu kamu membangun dasar yang kuat dalam ios-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari TestFlight untuk Pengujian Beta','Manfaat memahami TestFlight untuk Pengujian Beta untuk pemula','Langkah pertama untuk mulai belajar TestFlight untuk Pengujian Beta','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: TestFlight untuk Pengujian Beta\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar TestFlight untuk Pengujian Beta. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: TestFlight untuk Pengujian Beta adalah titik awal dalam perjalanan belajarmu di ios-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['app-store', 'Kesalahan Umum: Metadata Tidak Lengkap', [
            {t:'p',x:'Kesalahan Umum: Metadata Tidak Lengkap adalah kesalahan yang sering dilakukan pemula saat belajar ios-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Metadata Tidak Lengkap karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Metadata Tidak Lengkap sering terjadi pada pemula','Cara mudah menghindari Metadata Tidak Lengkap','Tanda bahwa kamu mengalami Metadata Tidak Lengkap','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Metadata Tidak Lengkap\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Metadata Tidak Lengkap. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Metadata Tidak Lengkap sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['install-flutter', 'Menginstal Flutter', [
    { t: 'p', x: 'Flutter adalah toolkit UI Google untuk membuat aplikasi natively compiled dari satu kodebase untuk Android, iOS, web, dan desktop. Flutter menggunakan bahasa Dart.' },
    { t: 'code', lang: 'bash', x: '# Unduh Flutter dari flutter.dev\\n# Ekstrak dan tambahkan ke PATH\\nflutter doctor\\nflutter create belajar_flutter\\ncd belajar_flutter\\nflutter run' },
    { t: 'list', items: ['Unduh Flutter SDK dari situs resmi', 'Ekstrak dan tambahkan direktori bin ke PATH', 'Jalankan flutter doctor untuk memeriksa dependensi', 'Instal Android Studio dan emulator untuk Android'] },
    { t: 'tip', x: 'flutter doctor akan menunjukkan apa saja yang belum terinstal atau perlu diperbaiki sebelum mengembangkan.' },
  ], 3],
  ['install-flutter', 'Apa itu Dart', [
            {t:'p',x:'Apa itu Dart adalah konsep dasar dalam flutter-dasar. Bayangkan seperti seperti membuat satu aplikasi yang bisa berjalan di banyak macam telepon sekaligus. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Dart akan membantu kamu membangun dasar yang kuat dalam flutter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Dart','Manfaat memahami Apa itu Dart untuk pemula','Langkah pertama untuk mulai belajar Apa itu Dart','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Dart\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Dart. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Dart adalah titik awal dalam perjalanan belajarmu di flutter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['install-flutter', 'Kesalahan Umum: PATH Tidak Dikonfigurasi', [
            {t:'p',x:'Kesalahan Umum: PATH Tidak Dikonfigurasi adalah kesalahan yang sering dilakukan pemula saat belajar flutter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di PATH Tidak Dikonfigurasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa PATH Tidak Dikonfigurasi sering terjadi pada pemula','Cara mudah menghindari PATH Tidak Dikonfigurasi','Tanda bahwa kamu mengalami PATH Tidak Dikonfigurasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: PATH Tidak Dikonfigurasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami PATH Tidak Dikonfigurasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari PATH Tidak Dikonfigurasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['dart-dasar', 'Variabel dan Fungsi Dart', [
            {t:'p',x:'Variabel dan Fungsi Dart adalah konsep dasar dalam flutter-dasar. Bayangkan seperti seperti membuat satu aplikasi yang bisa berjalan di banyak macam telepon sekaligus. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Variabel dan Fungsi Dart akan membantu kamu membangun dasar yang kuat dalam flutter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Variabel dan Fungsi Dart','Manfaat memahami Variabel dan Fungsi Dart untuk pemula','Langkah pertama untuk mulai belajar Variabel dan Fungsi Dart','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Variabel dan Fungsi Dart\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Variabel dan Fungsi Dart. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Variabel dan Fungsi Dart adalah titik awal dalam perjalanan belajarmu di flutter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['dart-dasar', 'Class dan Objek', [
            {t:'p',x:'Class dan Objek adalah konsep dasar dalam flutter-dasar. Bayangkan seperti seperti membuat satu aplikasi yang bisa berjalan di banyak macam telepon sekaligus. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Class dan Objek akan membantu kamu membangun dasar yang kuat dalam flutter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Class dan Objek','Manfaat memahami Class dan Objek untuk pemula','Langkah pertama untuk mulai belajar Class dan Objek','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Class dan Objek\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Class dan Objek. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Class dan Objek adalah titik awal dalam perjalanan belajarmu di flutter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['dart-dasar', 'Kesalahan Umum: Menggunakan const dan final Secara Salah', [
            {t:'p',x:'Kesalahan Umum: Menggunakan const dan final Secara Salah adalah kesalahan yang sering dilakukan pemula saat belajar flutter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menggunakan const dan final Secara Salah karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menggunakan const dan final Secara Salah sering terjadi pada pemula','Cara mudah menghindari Menggunakan const dan final Secara Salah','Tanda bahwa kamu mengalami Menggunakan const dan final Secara Salah','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menggunakan const dan final Secara Salah\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menggunakan const dan final Secara Salah. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menggunakan const dan final Secara Salah sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['widget-dasar', 'Widget dalam Flutter', [
            {t:'p',x:'Widget dalam Flutter adalah konsep dasar dalam flutter-dasar. Bayangkan seperti seperti membuat satu aplikasi yang bisa berjalan di banyak macam telepon sekaligus. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Widget dalam Flutter akan membantu kamu membangun dasar yang kuat dalam flutter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Widget dalam Flutter','Manfaat memahami Widget dalam Flutter untuk pemula','Langkah pertama untuk mulai belajar Widget dalam Flutter','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Widget dalam Flutter\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Widget dalam Flutter. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Widget dalam Flutter adalah titik awal dalam perjalanan belajarmu di flutter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['widget-dasar', 'Widget Umum: Text, Image, dan Container', [
            {t:'p',x:'Widget Umum: Text, Image, dan Container adalah konsep dasar dalam flutter-dasar. Bayangkan seperti seperti membuat satu aplikasi yang bisa berjalan di banyak macam telepon sekaligus. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Widget Umum: Text, Image, dan Container akan membantu kamu membangun dasar yang kuat dalam flutter-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Widget Umum: Text, Image, dan Container','Manfaat memahami Widget Umum: Text, Image, dan Container untuk pemula','Langkah pertama untuk mulai belajar Widget Umum: Text, Image, dan Container','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Widget Umum: Text, Image, dan Container\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Widget Umum: Text, Image, dan Container. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Widget Umum: Text, Image, dan Container adalah titik awal dalam perjalanan belajarmu di flutter-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['widget-dasar', 'Kesalahan Umum: Lupa StatefulWidget', [
            {t:'p',x:'Kesalahan Umum: Lupa StatefulWidget adalah kesalahan yang sering dilakukan pemula saat belajar flutter-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa StatefulWidget karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa StatefulWidget sering terjadi pada pemula','Cara mudah menghindari Lupa StatefulWidget','Tanda bahwa kamu mengalami Lupa StatefulWidget','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa StatefulWidget\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa StatefulWidget. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa StatefulWidget sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['proyek-mini', 'Proyek Mini: Aplikasi Catatan', [
    { t: 'p', x: 'Buat aplikasi catatan sederhana menggunakan Flutter. Kamu akan menerapkan widget, state manajemen, dan penyimpanan lokal dalam satu proyek nyata.' },
    { t: 'list', items: ['Tambah catatan baru dengan judul dan isi', 'Tampilkan daftar semua catatan', 'Hapus catatan yang tidak diperlukan', 'Simpan catatan secara lokal agar tidak hilang saat ditutup'] },
    { t: 'code', lang: 'bash', x: 'flutter create catatan_app\\ncd catatan_app\\nflutter run' },
    { t: 'tip', x: 'Mulai dengan daftar catatan sederhana, lalu tambahkan fitur penyimpanan lokal setelah tampilan berjalan.' },
  ], 5],
  ['expo-dasar', 'Expo dan React Native', [
            {t:'p',x:'Expo dan React Native adalah konsep dasar dalam react-native-dasar. Bayangkan seperti seperti membuat aplikasi seluler menggunakan bahasa yang sama dengan website. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Expo dan React Native akan membantu kamu membangun dasar yang kuat dalam react-native-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Expo dan React Native','Manfaat memahami Expo dan React Native untuk pemula','Langkah pertama untuk mulai belajar Expo dan React Native','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Expo dan React Native\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Expo dan React Native. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Expo dan React Native adalah titik awal dalam perjalanan belajarmu di react-native-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['expo-dasar', 'Menginstal Expo', [
    { t: 'p', x: 'Unduh aplikasi Expo Go di ponselmu untuk menguji aplikasi. Buat proyek baru menggunakan npx create-expo-app dan jalankan dengan npx expo start.' },
    { t: 'code', lang: 'bash', x: 'npx create-expo-app belajar-expo\\ncd belajar-expo\\nnpx expo start' },
    { t: 'list', items: ['Instal Node.js dari nodejs.org', 'Unduh Expo Go di App Store atau Play Store', 'Jalankan npx create-expo-app nama-proyek', 'Scan QR code dengan Expo Go untuk melihat aplikasi'] },
    { t: 'tip', x: 'Ponsel dan komputer harus terhubung ke jaringan Wi-Fi yang sama untuk Expo Go bekerja.' },
  ], 3],
  ['expo-dasar', 'Kesalahan Umum: Jaringan Tidak Sama', [
            {t:'p',x:'Kesalahan Umum: Jaringan Tidak Sama adalah kesalahan yang sering dilakukan pemula saat belajar react-native-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Jaringan Tidak Sama karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Jaringan Tidak Sama sering terjadi pada pemula','Cara mudah menghindari Jaringan Tidak Sama','Tanda bahwa kamu mengalami Jaringan Tidak Sama','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Jaringan Tidak Sama\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Jaringan Tidak Sama. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Jaringan Tidak Sama sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['javascript-dasar-react-native', 'JavaScript Dasar untuk React Native', [
            {t:'p',x:'JavaScript Dasar untuk React Native adalah konsep dasar dalam react-native-dasar. Bayangkan seperti seperti membuat aplikasi seluler menggunakan bahasa yang sama dengan website. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai JavaScript Dasar untuk React Native akan membantu kamu membangun dasar yang kuat dalam react-native-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari JavaScript Dasar untuk React Native','Manfaat memahami JavaScript Dasar untuk React Native untuk pemula','Langkah pertama untuk mulai belajar JavaScript Dasar untuk React Native','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: JavaScript Dasar untuk React Native\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar JavaScript Dasar untuk React Native. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: JavaScript Dasar untuk React Native adalah titik awal dalam perjalanan belajarmu di react-native-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar-react-native', 'JSX di React Native', [
            {t:'p',x:'JSX di React Native adalah konsep dasar dalam react-native-dasar. Bayangkan seperti seperti membuat aplikasi seluler menggunakan bahasa yang sama dengan website. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai JSX di React Native akan membantu kamu membangun dasar yang kuat dalam react-native-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari JSX di React Native','Manfaat memahami JSX di React Native untuk pemula','Langkah pertama untuk mulai belajar JSX di React Native','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: JSX di React Native\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar JSX di React Native. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: JSX di React Native adalah titik awal dalam perjalanan belajarmu di react-native-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['javascript-dasar-react-native', 'Kesalahan Umum: Menggunakan Elemen Web', [
            {t:'p',x:'Kesalahan Umum: Menggunakan Elemen Web adalah kesalahan yang sering dilakukan pemula saat belajar react-native-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menggunakan Elemen Web karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menggunakan Elemen Web sering terjadi pada pemula','Cara mudah menghindari Menggunakan Elemen Web','Tanda bahwa kamu mengalami Menggunakan Elemen Web','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menggunakan Elemen Web\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menggunakan Elemen Web. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menggunakan Elemen Web sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['navigasi', 'Navigasi Antar Layar di React Native', [
            {t:'p',x:'Navigasi Antar Layar di React Native adalah konsep dasar dalam react-native-dasar. Bayangkan seperti seperti membuat aplikasi seluler menggunakan bahasa yang sama dengan website. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Navigasi Antar Layar di React Native akan membantu kamu membangun dasar yang kuat dalam react-native-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Navigasi Antar Layar di React Native','Manfaat memahami Navigasi Antar Layar di React Native untuk pemula','Langkah pertama untuk mulai belajar Navigasi Antar Layar di React Native','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Navigasi Antar Layar di React Native\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Navigasi Antar Layar di React Native. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Navigasi Antar Layar di React Native adalah titik awal dalam perjalanan belajarmu di react-native-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['navigasi', 'Mengirim Parameter Antar Layar', [
            {t:'p',x:'Mengirim Parameter Antar Layar adalah konsep dasar dalam react-native-dasar. Bayangkan seperti seperti membuat aplikasi seluler menggunakan bahasa yang sama dengan website. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengirim Parameter Antar Layar akan membantu kamu membangun dasar yang kuat dalam react-native-dasar. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengirim Parameter Antar Layar','Manfaat memahami Mengirim Parameter Antar Layar untuk pemula','Langkah pertama untuk mulai belajar Mengirim Parameter Antar Layar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengirim Parameter Antar Layar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengirim Parameter Antar Layar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengirim Parameter Antar Layar adalah titik awal dalam perjalanan belajarmu di react-native-dasar. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['navigasi', 'Kesalahan Umum: Lupa Menyiapkan Navigator', [
            {t:'p',x:'Kesalahan Umum: Lupa Menyiapkan Navigator adalah kesalahan yang sering dilakukan pemula saat belajar react-native-dasar. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Lupa Menyiapkan Navigator karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Lupa Menyiapkan Navigator sering terjadi pada pemula','Cara mudah menghindari Lupa Menyiapkan Navigator','Tanda bahwa kamu mengalami Lupa Menyiapkan Navigator','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Lupa Menyiapkan Navigator\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Lupa Menyiapkan Navigator. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Lupa Menyiapkan Navigator sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['proyek-mini', 'Proyek Mini: Aplikasi Cuaca', [
    { t: 'p', x: 'Buat aplikasi cuaca sederhana menggunakan React Native dan Expo. Kamu akan mengambil data cuaca dari API, menampilkannya, dan memungkinkan pengguna mencari kota.' },
    { t: 'list', items: ['Tampilkan cuaca terkini berdasarkan lokasi', 'Cari cuaca untuk kota tertentu', 'Tampilkan suhu dan kondisi cuaca', 'Segarkan data cuaca dengan tombol atau tarik ke bawah'] },
    { t: 'code', lang: 'bash', x: 'npx create-expo-app cuaca_app\\ncd cuaca_app\\nnpx expo start' },
    { t: 'tip', x: 'Gunakan API cuaca gratis seperti OpenWeatherMap dan simpan kunci API dengan aman di variabel lingkungan.' },
  ], 5],
  ['analisis-kebutuhan', 'Apa itu Analisis Kebutuhan', [
            {t:'p',x:'Apa itu Analisis Kebutuhan adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Analisis Kebutuhan akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Analisis Kebutuhan','Manfaat memahami Apa itu Analisis Kebutuhan untuk pemula','Langkah pertama untuk mulai belajar Apa itu Analisis Kebutuhan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Analisis Kebutuhan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Analisis Kebutuhan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Analisis Kebutuhan adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['analisis-kebutuhan', 'Wawancara dan Pengumpulan Kebutuhan', [
            {t:'p',x:'Wawancara dan Pengumpulan Kebutuhan adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Wawancara dan Pengumpulan Kebutuhan akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Wawancara dan Pengumpulan Kebutuhan','Manfaat memahami Wawancara dan Pengumpulan Kebutuhan untuk pemula','Langkah pertama untuk mulai belajar Wawancara dan Pengumpulan Kebutuhan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Wawancara dan Pengumpulan Kebutuhan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Wawancara dan Pengumpulan Kebutuhan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Wawancara dan Pengumpulan Kebutuhan adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['analisis-kebutuhan', 'Kebutuhan Fungsional dan Non-Fungsional', [
            {t:'p',x:'Kebutuhan Fungsional dan Non-Fungsional adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kebutuhan Fungsional dan Non-Fungsional akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kebutuhan Fungsional dan Non-Fungsional','Manfaat memahami Kebutuhan Fungsional dan Non-Fungsional untuk pemula','Langkah pertama untuk mulai belajar Kebutuhan Fungsional dan Non-Fungsional','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kebutuhan Fungsional dan Non-Fungsional\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kebutuhan Fungsional dan Non-Fungsional. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kebutuhan Fungsional dan Non-Fungsional adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['analisis-kebutuhan', 'Kesalahan Umum: Kebutuhan Tidak Jelas', [
            {t:'p',x:'Kesalahan Umum: Kebutuhan Tidak Jelas adalah kesalahan yang sering dilakukan pemula saat belajar pengembangan-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Kebutuhan Tidak Jelas karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Kebutuhan Tidak Jelas sering terjadi pada pemula','Cara mudah menghindari Kebutuhan Tidak Jelas','Tanda bahwa kamu mengalami Kebutuhan Tidak Jelas','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Kebutuhan Tidak Jelas\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Kebutuhan Tidak Jelas. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Kebutuhan Tidak Jelas sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['desain-perangkat-lunak', 'Apa itu Desain Perangkat Lunak', [
            {t:'p',x:'Apa itu Desain Perangkat Lunak adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Desain Perangkat Lunak akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Desain Perangkat Lunak','Manfaat memahami Apa itu Desain Perangkat Lunak untuk pemula','Langkah pertama untuk mulai belajar Apa itu Desain Perangkat Lunak','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Desain Perangkat Lunak\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Desain Perangkat Lunak. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Desain Perangkat Lunak adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['desain-perangkat-lunak', 'Diagram Kelas dan Alur', [
            {t:'p',x:'Diagram Kelas dan Alur adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Diagram Kelas dan Alur akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Diagram Kelas dan Alur','Manfaat memahami Diagram Kelas dan Alur untuk pemula','Langkah pertama untuk mulai belajar Diagram Kelas dan Alur','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Diagram Kelas dan Alur\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Diagram Kelas dan Alur. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Diagram Kelas dan Alur adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['desain-perangkat-lunak', 'Arsitektur Lapisan', [
            {t:'p',x:'Arsitektur Lapisan adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Arsitektur Lapisan akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Arsitektur Lapisan','Manfaat memahami Arsitektur Lapisan untuk pemula','Langkah pertama untuk mulai belajar Arsitektur Lapisan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Arsitektur Lapisan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Arsitektur Lapisan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Arsitektur Lapisan adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['desain-perangkat-lunak', 'Kesalahan Umum: Terlalu Banyak Detail Dini', [
            {t:'p',x:'Kesalahan Umum: Terlalu Banyak Detail Dini adalah kesalahan yang sering dilakukan pemula saat belajar pengembangan-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Terlalu Banyak Detail Dini karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Terlalu Banyak Detail Dini sering terjadi pada pemula','Cara mudah menghindari Terlalu Banyak Detail Dini','Tanda bahwa kamu mengalami Terlalu Banyak Detail Dini','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Terlalu Banyak Detail Dini\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Terlalu Banyak Detail Dini. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Terlalu Banyak Detail Dini sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['implementasi-dan-uji', 'Coding dan Implementasi', [
            {t:'p',x:'Coding dan Implementasi adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Coding dan Implementasi akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Coding dan Implementasi','Manfaat memahami Coding dan Implementasi untuk pemula','Langkah pertama untuk mulai belajar Coding dan Implementasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Coding dan Implementasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Coding dan Implementasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Coding dan Implementasi adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['implementasi-dan-uji', 'Pengujian Unit', [
            {t:'p',x:'Pengujian Unit adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Unit akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Unit','Manfaat memahami Pengujian Unit untuk pemula','Langkah pertama untuk mulai belajar Pengujian Unit','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Unit\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Unit. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Unit adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['implementasi-dan-uji', 'Pengujian Integrasi', [
            {t:'p',x:'Pengujian Integrasi adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Integrasi akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Integrasi','Manfaat memahami Pengujian Integrasi untuk pemula','Langkah pertama untuk mulai belajar Pengujian Integrasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Integrasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Integrasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Integrasi adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['implementasi-dan-uji', 'Kesalahan Umum: Mengabaikan Pengujian', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Pengujian adalah kesalahan yang sering dilakukan pemula saat belajar pengembangan-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Pengujian karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Pengujian sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Pengujian','Tanda bahwa kamu mengalami Mengabaikan Pengujian','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Pengujian\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Pengujian. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Pengujian sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['peluncuran-dan-pemeliharaan', 'Peluncuran Aplikasi', [
            {t:'p',x:'Peluncuran Aplikasi adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Peluncuran Aplikasi akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Peluncuran Aplikasi','Manfaat memahami Peluncuran Aplikasi untuk pemula','Langkah pertama untuk mulai belajar Peluncuran Aplikasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Peluncuran Aplikasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Peluncuran Aplikasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Peluncuran Aplikasi adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['peluncuran-dan-pemeliharaan', 'Pemantauan dan Log', [
            {t:'p',x:'Pemantauan dan Log adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pemantauan dan Log akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pemantauan dan Log','Manfaat memahami Pemantauan dan Log untuk pemula','Langkah pertama untuk mulai belajar Pemantauan dan Log','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pemantauan dan Log\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pemantauan dan Log. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pemantauan dan Log adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['peluncuran-dan-pemeliharaan', 'Perbaikan Bug dan Pembaruan', [
            {t:'p',x:'Perbaikan Bug dan Pembaruan adalah konsep dasar dalam pengembangan-perangkat-lunak. Bayangkan seperti seperti membangun gedung: mulai dari rencana, fondasi, dinding, hingga finishing. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Perbaikan Bug dan Pembaruan akan membantu kamu membangun dasar yang kuat dalam pengembangan-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Perbaikan Bug dan Pembaruan','Manfaat memahami Perbaikan Bug dan Pembaruan untuk pemula','Langkah pertama untuk mulai belajar Perbaikan Bug dan Pembaruan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Perbaikan Bug dan Pembaruan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Perbaikan Bug dan Pembaruan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Perbaikan Bug dan Pembaruan adalah titik awal dalam perjalanan belajarmu di pengembangan-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['peluncuran-dan-pemeliharaan', 'Kesalahan Umum: Tanpa Rencana Pengembalian', [
            {t:'p',x:'Kesalahan Umum: Tanpa Rencana Pengembalian adalah kesalahan yang sering dilakukan pemula saat belajar pengembangan-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Tanpa Rencana Pengembalian karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Tanpa Rencana Pengembalian sering terjadi pada pemula','Cara mudah menghindari Tanpa Rencana Pengembalian','Tanda bahwa kamu mengalami Tanpa Rencana Pengembalian','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Tanpa Rencana Pengembalian\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Tanpa Rencana Pengembalian. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Tanpa Rencana Pengembalian sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['sdlc', 'Apa itu SDLC', [
            {t:'p',x:'Apa itu SDLC adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu SDLC akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu SDLC','Manfaat memahami Apa itu SDLC untuk pemula','Langkah pertama untuk mulai belajar Apa itu SDLC','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu SDLC\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu SDLC. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu SDLC adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['sdlc', 'Model Airfall dan Iteratif', [
            {t:'p',x:'Model Airfall dan Iteratif adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Model Airfall dan Iteratif akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Model Airfall dan Iteratif','Manfaat memahami Model Airfall dan Iteratif untuk pemula','Langkah pertama untuk mulai belajar Model Airfall dan Iteratif','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Model Airfall dan Iteratif\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Model Airfall dan Iteratif. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Model Airfall dan Iteratif adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['sdlc', 'Kesalahan Umum: Melewati Tahapan', [
            {t:'p',x:'Kesalahan Umum: Melewati Tahapan adalah kesalahan yang sering dilakukan pemula saat belajar rekayasa-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Melewati Tahapan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Melewati Tahapan sering terjadi pada pemula','Cara mudah menghindari Melewati Tahapan','Tanda bahwa kamu mengalami Melewati Tahapan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Melewati Tahapan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Melewati Tahapan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Melewati Tahapan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['manajemen-proyek', 'Manajemen Proyek TI', [
            {t:'p',x:'Manajemen Proyek TI adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Manajemen Proyek TI akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Manajemen Proyek TI','Manfaat memahami Manajemen Proyek TI untuk pemula','Langkah pertama untuk mulai belajar Manajemen Proyek TI','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Manajemen Proyek TI\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Manajemen Proyek TI. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Manajemen Proyek TI adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['manajemen-proyek', 'Perencanaan dan Estimasi', [
            {t:'p',x:'Perencanaan dan Estimasi adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Perencanaan dan Estimasi akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Perencanaan dan Estimasi','Manfaat memahami Perencanaan dan Estimasi untuk pemula','Langkah pertama untuk mulai belajar Perencanaan dan Estimasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Perencanaan dan Estimasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Perencanaan dan Estimasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Perencanaan dan Estimasi adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['manajemen-proyek', 'Kesalahan Umum: Estimasi Terlalu Optimis', [
            {t:'p',x:'Kesalahan Umum: Estimasi Terlalu Optimis adalah kesalahan yang sering dilakukan pemula saat belajar rekayasa-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Estimasi Terlalu Optimis karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Estimasi Terlalu Optimis sering terjadi pada pemula','Cara mudah menghindari Estimasi Terlalu Optimis','Tanda bahwa kamu mengalami Estimasi Terlalu Optimis','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Estimasi Terlalu Optimis\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Estimasi Terlalu Optimis. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Estimasi Terlalu Optimis sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['agile-scrum', 'Agile dan Scrum', [
            {t:'p',x:'Agile dan Scrum adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Agile dan Scrum akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Agile dan Scrum','Manfaat memahami Agile dan Scrum untuk pemula','Langkah pertama untuk mulai belajar Agile dan Scrum','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Agile dan Scrum\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Agile dan Scrum. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Agile dan Scrum adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['agile-scrum', 'Peran dalam Scrum', [
            {t:'p',x:'Peran dalam Scrum adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Peran dalam Scrum akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Peran dalam Scrum','Manfaat memahami Peran dalam Scrum untuk pemula','Langkah pertama untuk mulai belajar Peran dalam Scrum','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Peran dalam Scrum\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Peran dalam Scrum. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Peran dalam Scrum adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['agile-scrum', 'Sprint dan Sprint Review', [
            {t:'p',x:'Sprint dan Sprint Review adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Sprint dan Sprint Review akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Sprint dan Sprint Review','Manfaat memahami Sprint dan Sprint Review untuk pemula','Langkah pertama untuk mulai belajar Sprint dan Sprint Review','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Sprint dan Sprint Review\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Sprint dan Sprint Review. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Sprint dan Sprint Review adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['agile-scrum', 'Kesalahan Umum: Scrum Tanpa Hasil', [
            {t:'p',x:'Kesalahan Umum: Scrum Tanpa Hasil adalah kesalahan yang sering dilakukan pemula saat belajar rekayasa-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Scrum Tanpa Hasil karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Scrum Tanpa Hasil sering terjadi pada pemula','Cara mudah menghindari Scrum Tanpa Hasil','Tanda bahwa kamu mengalami Scrum Tanpa Hasil','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Scrum Tanpa Hasil\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Scrum Tanpa Hasil. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Scrum Tanpa Hasil sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['dokumentasi', 'Dokumentasi Perangkat Lunak', [
            {t:'p',x:'Dokumentasi Perangkat Lunak adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Dokumentasi Perangkat Lunak akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Dokumentasi Perangkat Lunak','Manfaat memahami Dokumentasi Perangkat Lunak untuk pemula','Langkah pertama untuk mulai belajar Dokumentasi Perangkat Lunak','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Dokumentasi Perangkat Lunak\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Dokumentasi Perangkat Lunak. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Dokumentasi Perangkat Lunak adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['dokumentasi', 'Komentar Kode yang Baik', [
            {t:'p',x:'Komentar Kode yang Baik adalah konsep dasar dalam rekayasa-perangkat-lunak. Bayangkan seperti seperti mengelola proyek konstruksi besar dengan jadwal, tim, dan standar kualitas. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Komentar Kode yang Baik akan membantu kamu membangun dasar yang kuat dalam rekayasa-perangkat-lunak. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Komentar Kode yang Baik','Manfaat memahami Komentar Kode yang Baik untuk pemula','Langkah pertama untuk mulai belajar Komentar Kode yang Baik','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Komentar Kode yang Baik\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Komentar Kode yang Baik. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Komentar Kode yang Baik adalah titik awal dalam perjalanan belajarmu di rekayasa-perangkat-lunak. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['dokumentasi', 'Kesalahan Umum: Dokumentasi Ketuwu', [
            {t:'p',x:'Kesalahan Umum: Dokumentasi Ketuwu adalah kesalahan yang sering dilakukan pemula saat belajar rekayasa-perangkat-lunak. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Dokumentasi Ketuwu karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Dokumentasi Ketuwu sering terjadi pada pemula','Cara mudah menghindari Dokumentasi Ketuwu','Tanda bahwa kamu mengalami Dokumentasi Ketuwu','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Dokumentasi Ketuwu\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Dokumentasi Ketuwu. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Dokumentasi Ketuwu sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['jenis-pengujian', 'Jenis-Jenis Pengujian', [
            {t:'p',x:'Jenis-Jenis Pengujian adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Jenis-Jenis Pengujian akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Jenis-Jenis Pengujian','Manfaat memahami Jenis-Jenis Pengujian untuk pemula','Langkah pertama untuk mulai belajar Jenis-Jenis Pengujian','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Jenis-Jenis Pengujian\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Jenis-Jenis Pengujian. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Jenis-Jenis Pengujian adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['jenis-pengujian', 'Pengujian Fungsional dan Non-Fungsional', [
            {t:'p',x:'Pengujian Fungsional dan Non-Fungsional adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Fungsional dan Non-Fungsional akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Fungsional dan Non-Fungsional','Manfaat memahami Pengujian Fungsional dan Non-Fungsional untuk pemula','Langkah pertama untuk mulai belajar Pengujian Fungsional dan Non-Fungsional','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Fungsional dan Non-Fungsional\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Fungsional dan Non-Fungsional. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Fungsional dan Non-Fungsional adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['jenis-pengujian', 'Kesalahan Umum: Hanya Pengujian Fungsional', [
            {t:'p',x:'Kesalahan Umum: Hanya Pengujian Fungsional adalah kesalahan yang sering dilakukan pemula saat belajar qa-testing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Hanya Pengujian Fungsional karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Hanya Pengujian Fungsional sering terjadi pada pemula','Cara mudah menghindari Hanya Pengujian Fungsional','Tanda bahwa kamu mengalami Hanya Pengujian Fungsional','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Hanya Pengujian Fungsional\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Hanya Pengujian Fungsional. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Hanya Pengujian Fungsional sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['unit-test', 'Unit Test', [
            {t:'p',x:'Unit Test adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Unit Test akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Unit Test','Manfaat memahami Unit Test untuk pemula','Langkah pertama untuk mulai belajar Unit Test','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Unit Test\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Unit Test. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Unit Test adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['unit-test', 'Menguji Kasus Tepi (Edge Case)', [
            {t:'p',x:'Menguji Kasus Tepi (Edge Case) adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menguji Kasus Tepi (Edge Case) akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menguji Kasus Tepi (Edge Case)','Manfaat memahami Menguji Kasus Tepi (Edge Case) untuk pemula','Langkah pertama untuk mulai belajar Menguji Kasus Tepi (Edge Case)','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menguji Kasus Tepi (Edge Case)\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menguji Kasus Tepi (Edge Case). Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menguji Kasus Tepi (Edge Case) adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['unit-test', 'Kesalahan Umum: Pengujian yang Bergantung pada Waktu', [
            {t:'p',x:'Kesalahan Umum: Pengujian yang Bergantung pada Waktu adalah kesalahan yang sering dilakukan pemula saat belajar qa-testing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Pengujian yang Bergantung pada Waktu karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Pengujian yang Bergantung pada Waktu sering terjadi pada pemula','Cara mudah menghindari Pengujian yang Bergantung pada Waktu','Tanda bahwa kamu mengalami Pengujian yang Bergantung pada Waktu','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Pengujian yang Bergantung pada Waktu\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Pengujian yang Bergantung pada Waktu. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Pengujian yang Bergantung pada Waktu sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['integrasi-dan-sistem', 'Pengujian Integrasi dan Sistem', [
            {t:'p',x:'Pengujian Integrasi dan Sistem adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Integrasi dan Sistem akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Integrasi dan Sistem','Manfaat memahami Pengujian Integrasi dan Sistem untuk pemula','Langkah pertama untuk mulai belajar Pengujian Integrasi dan Sistem','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Integrasi dan Sistem\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Integrasi dan Sistem. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Integrasi dan Sistem adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['integrasi-dan-sistem', 'Pengujian Ujung ke Ujung', [
            {t:'p',x:'Pengujian Ujung ke Ujung adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Ujung ke Ujung akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Ujung ke Ujung','Manfaat memahami Pengujian Ujung ke Ujung untuk pemula','Langkah pertama untuk mulai belajar Pengujian Ujung ke Ujung','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Ujung ke Ujung\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Ujung ke Ujung. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Ujung ke Ujung adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['integrasi-dan-sistem', 'Kesalahan Umum: Mengabaikan Pengujian Sistem Keseluruhan', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Pengujian Sistem Keseluruhan adalah kesalahan yang sering dilakukan pemula saat belajar qa-testing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Pengujian Sistem Keseluruhan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Pengujian Sistem Keseluruhan sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Pengujian Sistem Keseluruhan','Tanda bahwa kamu mengalami Mengabaikan Pengujian Sistem Keseluruhan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Pengujian Sistem Keseluruhan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Pengujian Sistem Keseluruhan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Pengujian Sistem Keseluruhan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['uat-dan-laporan', 'UAT dan Laporan Bug', [
            {t:'p',x:'UAT dan Laporan Bug adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai UAT dan Laporan Bug akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari UAT dan Laporan Bug','Manfaat memahami UAT dan Laporan Bug untuk pemula','Langkah pertama untuk mulai belajar UAT dan Laporan Bug','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: UAT dan Laporan Bug\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar UAT dan Laporan Bug. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: UAT dan Laporan Bug adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['uat-dan-laporan', 'Menulis Laporan Bug yang Baik', [
            {t:'p',x:'Menulis Laporan Bug yang Baik adalah konsep dasar dalam qa-testing. Bayangkan seperti seperti memeriksa makanan sebelum disajikan agar tidak ada yang rusak. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menulis Laporan Bug yang Baik akan membantu kamu membangun dasar yang kuat dalam qa-testing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menulis Laporan Bug yang Baik','Manfaat memahami Menulis Laporan Bug yang Baik untuk pemula','Langkah pertama untuk mulai belajar Menulis Laporan Bug yang Baik','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menulis Laporan Bug yang Baik\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menulis Laporan Bug yang Baik. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menulis Laporan Bug yang Baik adalah titik awal dalam perjalanan belajarmu di qa-testing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['uat-dan-laporan', 'Kesalahan Umum: Laporan Bug Tidak Lengkap', [
            {t:'p',x:'Kesalahan Umum: Laporan Bug Tidak Lengkap adalah kesalahan yang sering dilakukan pemula saat belajar qa-testing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Laporan Bug Tidak Lengkap karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Laporan Bug Tidak Lengkap sering terjadi pada pemula','Cara mudah menghindari Laporan Bug Tidak Lengkap','Tanda bahwa kamu mengalami Laporan Bug Tidak Lengkap','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Laporan Bug Tidak Lengkap\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Laporan Bug Tidak Lengkap. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Laporan Bug Tidak Lengkap sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['relasional-dasar', 'Apa itu Basis Data Relasional', [
            {t:'p',x:'Apa itu Basis Data Relasional adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Basis Data Relasional akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Basis Data Relasional','Manfaat memahami Apa itu Basis Data Relasional untuk pemula','Langkah pertama untuk mulai belajar Apa itu Basis Data Relasional','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Basis Data Relasional\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Basis Data Relasional. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Basis Data Relasional adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['relasional-dasar', 'Tabel, Baris, dan Kolom', [
            {t:'p',x:'Tabel, Baris, dan Kolom adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Tabel, Baris, dan Kolom akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Tabel, Baris, dan Kolom','Manfaat memahami Tabel, Baris, dan Kolom untuk pemula','Langkah pertama untuk mulai belajar Tabel, Baris, dan Kolom','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Tabel, Baris, dan Kolom\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Tabel, Baris, dan Kolom. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Tabel, Baris, dan Kolom adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['relasional-dasar', 'Kunci Utama dan Kunci Asing', [
            {t:'p',x:'Kunci Utama dan Kunci Asing adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kunci Utama dan Kunci Asing akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kunci Utama dan Kunci Asing','Manfaat memahami Kunci Utama dan Kunci Asing untuk pemula','Langkah pertama untuk mulai belajar Kunci Utama dan Kunci Asing','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kunci Utama dan Kunci Asing\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kunci Utama dan Kunci Asing. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kunci Utama dan Kunci Asing adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['relasional-dasar', 'Kesalahan Umum: Mengabaikan Integritas Relasi', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Integritas Relasi adalah kesalahan yang sering dilakukan pemula saat belajar basis-data-sql. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Integritas Relasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Integritas Relasi sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Integritas Relasi','Tanda bahwa kamu mengalami Mengabaikan Integritas Relasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Integritas Relasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Integritas Relasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Integritas Relasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
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
            {t:'p',x:'Kesalahan Umum: Tanpa Klausa WHERE adalah kesalahan yang sering dilakukan pemula saat belajar basis-data-sql. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Tanpa Klausa WHERE karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Tanpa Klausa WHERE sering terjadi pada pemula','Cara mudah menghindari Tanpa Klausa WHERE','Tanda bahwa kamu mengalami Tanpa Klausa WHERE','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Tanpa Klausa WHERE\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Tanpa Klausa WHERE. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Tanpa Klausa WHERE sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['join-dan-indeks', 'JOIN: Menggabungkan Tabel', [
    { t: 'p', x: 'JOIN digunakan untuk menggabungkan data dari dua atau lebih tabel berdasarkan kunci yang terkait. Tipe JOIN umum adalah INNER JOIN, LEFT JOIN, dan RIGHT JOIN.' },
    { t: 'code', lang: 'sql', x: 'SELECT siswa.nama, nilai.skor\\nFROM siswa\\nINNER JOIN nilai ON siswa.id = nilai.siswa_id\\nWHERE nilai.skor >= 80;' },
    { t: 'list', items: ['INNER JOIN hanya mencocokkan baris yang ada di kedua tabel', 'LEFT JOIN menyertakan semua baris dari tabel kiri', 'RIGHT JOIN menyertakan semua baris dari tabel kanan', 'JOIN bergantung pada kolom yang memiliki relasi'] },
    { t: 'tip', x: 'Gunakan INNER JOIN jika hanya butuh data yang tersedia di kedua tabel, dan LEFT JOIN jika ingin menyertakan semua data dari tabel utama.' },
  ], 3],
  ['join-dan-indeks', 'Indeks untuk Kecepatan Query', [
            {t:'p',x:'Indeks untuk Kecepatan Query adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Indeks untuk Kecepatan Query akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Indeks untuk Kecepatan Query','Manfaat memahami Indeks untuk Kecepatan Query untuk pemula','Langkah pertama untuk mulai belajar Indeks untuk Kecepatan Query','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Indeks untuk Kecepatan Query\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Indeks untuk Kecepatan Query. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Indeks untuk Kecepatan Query adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['join-dan-indeks', 'Kesalahan Umum: Query Tanpa Indeks pada Tabel Besar', [
            {t:'p',x:'Kesalahan Umum: Query Tanpa Indeks pada Tabel Besar adalah kesalahan yang sering dilakukan pemula saat belajar basis-data-sql. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Query Tanpa Indeks pada Tabel Besar karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Query Tanpa Indeks pada Tabel Besar sering terjadi pada pemula','Cara mudah menghindari Query Tanpa Indeks pada Tabel Besar','Tanda bahwa kamu mengalami Query Tanpa Indeks pada Tabel Besar','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Query Tanpa Indeks pada Tabel Besar\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Query Tanpa Indeks pada Tabel Besar. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Query Tanpa Indeks pada Tabel Besar sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['mysql-postgresql', 'MySQL dan PostgreSQL', [
            {t:'p',x:'MySQL dan PostgreSQL adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai MySQL dan PostgreSQL akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari MySQL dan PostgreSQL','Manfaat memahami MySQL dan PostgreSQL untuk pemula','Langkah pertama untuk mulai belajar MySQL dan PostgreSQL','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: MySQL dan PostgreSQL\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar MySQL dan PostgreSQL. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: MySQL dan PostgreSQL adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['mysql-postgresql', 'Koneksi dari Aplikasi', [
            {t:'p',x:'Koneksi dari Aplikasi adalah konsep dasar dalam basis-data-sql. Bayangkan seperti seperti lembar pengolahan data besar yang terorganisir dalam tabel, baris, dan kolom. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Koneksi dari Aplikasi akan membantu kamu membangun dasar yang kuat dalam basis-data-sql. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Koneksi dari Aplikasi','Manfaat memahami Koneksi dari Aplikasi untuk pemula','Langkah pertama untuk mulai belajar Koneksi dari Aplikasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Koneksi dari Aplikasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Koneksi dari Aplikasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Koneksi dari Aplikasi adalah titik awal dalam perjalanan belajarmu di basis-data-sql. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['mysql-postgresql', 'Kesalahan Umum: Koneksi Tidak Ditutup', [
            {t:'p',x:'Kesalahan Umum: Koneksi Tidak Ditutup adalah kesalahan yang sering dilakukan pemula saat belajar basis-data-sql. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Koneksi Tidak Ditutup karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Koneksi Tidak Ditutup sering terjadi pada pemula','Cara mudah menghindari Koneksi Tidak Ditutup','Tanda bahwa kamu mengalami Koneksi Tidak Ditutup','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Koneksi Tidak Ditutup\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Koneksi Tidak Ditutup. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Koneksi Tidak Ditutup sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['nosql-apa-itu', 'Apa itu NoSQL', [
            {t:'p',x:'Apa itu NoSQL adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu NoSQL akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu NoSQL','Manfaat memahami Apa itu NoSQL untuk pemula','Langkah pertama untuk mulai belajar Apa itu NoSQL','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu NoSQL\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu NoSQL. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu NoSQL adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['nosql-apa-itu', 'MongoDB Dasar', [
            {t:'p',x:'MongoDB Dasar adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai MongoDB Dasar akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari MongoDB Dasar','Manfaat memahami MongoDB Dasar untuk pemula','Langkah pertama untuk mulai belajar MongoDB Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: MongoDB Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar MongoDB Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: MongoDB Dasar adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['nosql-apa-itu', 'Kesalahan Umum: Tanpa Perencanaan Skema', [
            {t:'p',x:'Kesalahan Umum: Tanpa Perencanaan Skema adalah kesalahan yang sering dilakukan pemula saat belajar nosql-mongodb. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Tanpa Perencanaan Skema karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Tanpa Perencanaan Skema sering terjadi pada pemula','Cara mudah menghindari Tanpa Perencanaan Skema','Tanda bahwa kamu mengalami Tanpa Perencanaan Skema','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Tanpa Perencanaan Skema\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Tanpa Perencanaan Skema. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Tanpa Perencanaan Skema sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['mongodb-dasar', 'Koleksi dan Dokumen', [
            {t:'p',x:'Koleksi dan Dokumen adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Koleksi dan Dokumen akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Koleksi dan Dokumen','Manfaat memahami Koleksi dan Dokumen untuk pemula','Langkah pertama untuk mulai belajar Koleksi dan Dokumen','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Koleksi dan Dokumen\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Koleksi dan Dokumen. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Koleksi dan Dokumen adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['mongodb-dasar', 'Insert dan Find', [
            {t:'p',x:'Insert dan Find adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Insert dan Find akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Insert dan Find','Manfaat memahami Insert dan Find untuk pemula','Langkah pertama untuk mulai belajar Insert dan Find','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Insert dan Find\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Insert dan Find. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Insert dan Find adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['mongodb-dasar', 'Kesalahan Umum: Mengasumsikan Setiap Dokumen Sama', [
            {t:'p',x:'Kesalahan Umum: Mengasumsikan Setiap Dokumen Sama adalah kesalahan yang sering dilakukan pemula saat belajar nosql-mongodb. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengasumsikan Setiap Dokumen Sama karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengasumsikan Setiap Dokumen Sama sering terjadi pada pemula','Cara mudah menghindari Mengasumsikan Setiap Dokumen Sama','Tanda bahwa kamu mengalami Mengasumsikan Setiap Dokumen Sama','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengasumsikan Setiap Dokumen Sama\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengasumsikan Setiap Dokumen Sama. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengasumsikan Setiap Dokumen Sama sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['query-dokumen', 'Query Dokumen MongoDB', [
            {t:'p',x:'Query Dokumen MongoDB adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Query Dokumen MongoDB akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Query Dokumen MongoDB','Manfaat memahami Query Dokumen MongoDB untuk pemula','Langkah pertama untuk mulai belajar Query Dokumen MongoDB','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Query Dokumen MongoDB\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Query Dokumen MongoDB. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Query Dokumen MongoDB adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['query-dokumen', 'Update dan Delete Dokumen', [
            {t:'p',x:'Update dan Delete Dokumen adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Update dan Delete Dokumen akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Update dan Delete Dokumen','Manfaat memahami Update dan Delete Dokumen untuk pemula','Langkah pertama untuk mulai belajar Update dan Delete Dokumen','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Update dan Delete Dokumen\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Update dan Delete Dokumen. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Update dan Delete Dokumen adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['query-dokumen', 'Kesalahan Umum: Update Tanpa Filter yang Tepat', [
            {t:'p',x:'Kesalahan Umum: Update Tanpa Filter yang Tepat adalah kesalahan yang sering dilakukan pemula saat belajar nosql-mongodb. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Update Tanpa Filter yang Tepat karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Update Tanpa Filter yang Tepat sering terjadi pada pemula','Cara mudah menghindari Update Tanpa Filter yang Tepat','Tanda bahwa kamu mengalami Update Tanpa Filter yang Tepat','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Update Tanpa Filter yang Tepat\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Update Tanpa Filter yang Tepat. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Update Tanpa Filter yang Tepat sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['agregasi', 'Agregasi Data', [
            {t:'p',x:'Agregasi Data adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Agregasi Data akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Agregasi Data','Manfaat memahami Agregasi Data untuk pemula','Langkah pertama untuk mulai belajar Agregasi Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Agregasi Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Agregasi Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Agregasi Data adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['agregasi', 'Pipeline Agregasi', [
            {t:'p',x:'Pipeline Agregasi adalah konsep dasar dalam nosql-mongodb. Bayangkan seperti seperti arsip dokumen yang tidak harus mengikuti bentuk tabel yang sama. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pipeline Agregasi akan membantu kamu membangun dasar yang kuat dalam nosql-mongodb. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pipeline Agregasi','Manfaat memahami Pipeline Agregasi untuk pemula','Langkah pertama untuk mulai belajar Pipeline Agregasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pipeline Agregasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pipeline Agregasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pipeline Agregasi adalah titik awal dalam perjalanan belajarmu di nosql-mongodb. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['agregasi', 'Kesalahan Umum: Agregasi pada Data Tanpa Indeks', [
            {t:'p',x:'Kesalahan Umum: Agregasi pada Data Tanpa Indeks adalah kesalahan yang sering dilakukan pemula saat belajar nosql-mongodb. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Agregasi pada Data Tanpa Indeks karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Agregasi pada Data Tanpa Indeks sering terjadi pada pemula','Cara mudah menghindari Agregasi pada Data Tanpa Indeks','Tanda bahwa kamu mengalami Agregasi pada Data Tanpa Indeks','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Agregasi pada Data Tanpa Indeks\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Agregasi pada Data Tanpa Indeks. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Agregasi pada Data Tanpa Indeks sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['python-untuk-data', 'Python untuk Analisis Data', [
            {t:'p',x:'Python untuk Analisis Data adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Python untuk Analisis Data akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Python untuk Analisis Data','Manfaat memahami Python untuk Analisis Data untuk pemula','Langkah pertama untuk mulai belajar Python untuk Analisis Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Python untuk Analisis Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Python untuk Analisis Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Python untuk Analisis Data adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['python-untuk-data', 'Pandas Dasar', [
            {t:'p',x:'Pandas Dasar adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pandas Dasar akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pandas Dasar','Manfaat memahami Pandas Dasar untuk pemula','Langkah pertama untuk mulai belajar Pandas Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pandas Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pandas Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pandas Dasar adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['python-untuk-data', 'Kesalahan Umum: Mengabaikan Nilai Kosong', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Nilai Kosong adalah kesalahan yang sering dilakukan pemula saat belajar data-science. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Nilai Kosong karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Nilai Kosong sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Nilai Kosong','Tanda bahwa kamu mengalami Mengabaikan Nilai Kosong','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Nilai Kosong\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Nilai Kosong. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Nilai Kosong sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['statistika-deskriptif', 'Statistika Deskriptif', [
    { t: 'p', x: 'Statistika deskriptif meringkas data menjadi angka yang mudah dipahami, seperti rata-rata, median, nilai minimum dan maksimum, serta simpangan baku.' },
    { t: 'code', lang: 'python', x: 'import pandas as pd\\ndf = pd.DataFrame({\"skor\": [70, 80, 90, 60, 85]})\\n\\nprint(df[\"skor\"].mean())   // rata-rata\\nprint(df[\"skor\"].median()) // median\\nprint(df[\"skor\"].std())    // simpangan baku' },
    { t: 'list', items: ['Rata-rata: nilai tengah dari semua data', 'Median: nilai tengah saat data diurutkan', 'Simpangan baku: sebar data dari rata-rata', 'Minimum dan maksimum: nilai terendah dan tertinggi'] },
    { t: 'tip', x: 'Gunakan median alih-alih rata-rata jika data memiliki pencilan yang sangat mempengaruhi rata-rata.' },
  ], 3],
  ['statistika-deskriptif', 'Distribusi Data', [
            {t:'p',x:'Distribusi Data adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Distribusi Data akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Distribusi Data','Manfaat memahami Distribusi Data untuk pemula','Langkah pertama untuk mulai belajar Distribusi Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Distribusi Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Distribusi Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Distribusi Data adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['statistika-deskriptif', 'Kesalahan Umum: Mengabaikan Pencilan (Outlier)', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Pencilan (Outlier) adalah kesalahan yang sering dilakukan pemula saat belajar data-science. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Pencilan (Outlier) karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Pencilan (Outlier) sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Pencilan (Outlier)','Tanda bahwa kamu mengalami Mengabaikan Pencilan (Outlier)','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Pencilan (Outlier)\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Pencilan (Outlier). Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Pencilan (Outlier) sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['visualisasi-data', 'Visualisasi Data', [
            {t:'p',x:'Visualisasi Data adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Visualisasi Data akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Visualisasi Data','Manfaat memahami Visualisasi Data untuk pemula','Langkah pertama untuk mulai belajar Visualisasi Data','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Visualisasi Data\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Visualisasi Data. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Visualisasi Data adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['visualisasi-data', 'Memilih Jenis Diagram', [
            {t:'p',x:'Memilih Jenis Diagram adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Memilih Jenis Diagram akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Memilih Jenis Diagram','Manfaat memahami Memilih Jenis Diagram untuk pemula','Langkah pertama untuk mulai belajar Memilih Jenis Diagram','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Memilih Jenis Diagram\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Memilih Jenis Diagram. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Memilih Jenis Diagram adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['visualisasi-data', 'Kesalahan Umum: Memaksakan Insight dari Visualisasi', [
            {t:'p',x:'Kesalahan Umum: Memaksakan Insight dari Visualisasi adalah kesalahan yang sering dilakukan pemula saat belajar data-science. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Memaksakan Insight dari Visualisasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Memaksakan Insight dari Visualisasi sering terjadi pada pemula','Cara mudah menghindari Memaksakan Insight dari Visualisasi','Tanda bahwa kamu mengalami Memaksakan Insight dari Visualisasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Memaksakan Insight dari Visualisasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Memaksakan Insight dari Visualisasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Memaksakan Insight dari Visualisasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['insight-bisnis', 'Mengubah Data Menjadi Insight Bisnis', [
            {t:'p',x:'Mengubah Data Menjadi Insight Bisnis adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengubah Data Menjadi Insight Bisnis akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengubah Data Menjadi Insight Bisnis','Manfaat memahami Mengubah Data Menjadi Insight Bisnis untuk pemula','Langkah pertama untuk mulai belajar Mengubah Data Menjadi Insight Bisnis','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengubah Data Menjadi Insight Bisnis\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengubah Data Menjadi Insight Bisnis. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengubah Data Menjadi Insight Bisnis adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['insight-bisnis', 'Menyajikan Hasil Analisis', [
            {t:'p',x:'Menyajikan Hasil Analisis adalah konsep dasar dalam data-science. Bayangkan seperti seperti detektif yang mengumpulkan bukti dan mencari pola dari data. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Menyajikan Hasil Analisis akan membantu kamu membangun dasar yang kuat dalam data-science. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Menyajikan Hasil Analisis','Manfaat memahami Menyajikan Hasil Analisis untuk pemula','Langkah pertama untuk mulai belajar Menyajikan Hasil Analisis','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Menyajikan Hasil Analisis\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Menyajikan Hasil Analisis. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Menyajikan Hasil Analisis adalah titik awal dalam perjalanan belajarmu di data-science. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['insight-bisnis', 'Kesalahan Umum: Insight Tidak Dapat Ditindaklanjuti', [
            {t:'p',x:'Kesalahan Umum: Insight Tidak Dapat Ditindaklanjuti adalah kesalahan yang sering dilakukan pemula saat belajar data-science. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Insight Tidak Dapat Ditindaklanjuti karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Insight Tidak Dapat Ditindaklanjuti sering terjadi pada pemula','Cara mudah menghindari Insight Tidak Dapat Ditindaklanjuti','Tanda bahwa kamu mengalami Insight Tidak Dapat Ditindaklanjuti','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Insight Tidak Dapat Ditindaklanjuti\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Insight Tidak Dapat Ditindaklanjuti. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Insight Tidak Dapat Ditindaklanjuti sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['ai-dasar', 'Apa itu Kecerdasan Buatan', [
            {t:'p',x:'Apa itu Kecerdasan Buatan adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Kecerdasan Buatan akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Kecerdasan Buatan','Manfaat memahami Apa itu Kecerdasan Buatan untuk pemula','Langkah pertama untuk mulai belajar Apa itu Kecerdasan Buatan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Kecerdasan Buatan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Kecerdasan Buatan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Kecerdasan Buatan adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ai-dasar', 'Machine Learning Dasar', [
            {t:'p',x:'Machine Learning Dasar adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Machine Learning Dasar akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Machine Learning Dasar','Manfaat memahami Machine Learning Dasar untuk pemula','Langkah pertama untuk mulai belajar Machine Learning Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Machine Learning Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Machine Learning Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Machine Learning Dasar adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ai-dasar', 'Kesalahan Umum: Menggunakan Data Tidak Cukup', [
            {t:'p',x:'Kesalahan Umum: Menggunakan Data Tidak Cukup adalah kesalahan yang sering dilakukan pemula saat belajar ai-machine-learning. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menggunakan Data Tidak Cukup karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menggunakan Data Tidak Cukup sering terjadi pada pemula','Cara mudah menghindari Menggunakan Data Tidak Cukup','Tanda bahwa kamu mengalami Menggunakan Data Tidak Cukup','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menggunakan Data Tidak Cukup\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menggunakan Data Tidak Cukup. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menggunakan Data Tidak Cukup sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['ml-dasar', 'Pelatihan dan Pengujian Model', [
            {t:'p',x:'Pelatihan dan Pengujian Model adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pelatihan dan Pengujian Model akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pelatihan dan Pengujian Model','Manfaat memahami Pelatihan dan Pengujian Model untuk pemula','Langkah pertama untuk mulai belajar Pelatihan dan Pengujian Model','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pelatihan dan Pengujian Model\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pelatihan dan Pengujian Model. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pelatihan dan Pengujian Model adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ml-dasar', 'Overfitting dan Underfitting', [
            {t:'p',x:'Overfitting dan Underfitting adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Overfitting dan Underfitting akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Overfitting dan Underfitting','Manfaat memahami Overfitting dan Underfitting untuk pemula','Langkah pertama untuk mulai belajar Overfitting dan Underfitting','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Overfitting dan Underfitting\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Overfitting dan Underfitting. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Overfitting dan Underfitting adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ml-dasar', 'Kesalahan Umum: Mengevaluasi pada Data Latih', [
            {t:'p',x:'Kesalahan Umum: Mengevaluasi pada Data Latih adalah kesalahan yang sering dilakukan pemula saat belajar ai-machine-learning. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengevaluasi pada Data Latih karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengevaluasi pada Data Latih sering terjadi pada pemula','Cara mudah menghindari Mengevaluasi pada Data Latih','Tanda bahwa kamu mengalami Mengevaluasi pada Data Latih','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengevaluasi pada Data Latih\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengevaluasi pada Data Latih. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengevaluasi pada Data Latih sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['model-prediksi', 'Membuat Prediksi dengan Model', [
    { t: 'p', x: 'Setelah model dilatih dan dievaluasi, gunakan model untuk membuat prediksi pada data baru. Masukkan data baru ke model dan model akan mengembalikan prediksi berdasarkan pola yang telah dipelajari.' },
    { t: 'code', lang: 'python', x: 'data_baru = [[25, 5000000]]\\nprediksi = model.predict(data_baru)\\nprint(f\"Prediksi: {prediksi[0]}\")' },
    { t: 'list', items: ['Siapkan data baru dalam format yang sama dengan data latih', 'Gunakan metode prediksi model', 'Interpretasi hasil prediksi sesuai konteks bisnis', 'Perbarui model secara berkala dengan data baru'] },
    { t: 'tip', x: 'Pastikan data baru telah diproses dengan cara yang sama seperti data latih sebelum prediksi.' },
  ], 3],
  ['model-prediksi', 'Mengevaluasi Akurasi Prediksi', [
            {t:'p',x:'Mengevaluasi Akurasi Prediksi adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Mengevaluasi Akurasi Prediksi akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Mengevaluasi Akurasi Prediksi','Manfaat memahami Mengevaluasi Akurasi Prediksi untuk pemula','Langkah pertama untuk mulai belajar Mengevaluasi Akurasi Prediksi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Mengevaluasi Akurasi Prediksi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Mengevaluasi Akurasi Prediksi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Mengevaluasi Akurasi Prediksi adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['model-prediksi', 'Kesalahan Umum: Mengabaikan Ketidakseimbangan Kelas', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Ketidakseimbangan Kelas adalah kesalahan yang sering dilakukan pemula saat belajar ai-machine-learning. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Ketidakseimbangan Kelas karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Ketidakseimbangan Kelas sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Ketidakseimbangan Kelas','Tanda bahwa kamu mengalami Mengabaikan Ketidakseimbangan Kelas','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Ketidakseimbangan Kelas\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Ketidakseimbangan Kelas. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Ketidakseimbangan Kelas sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['implementasi', 'Implementasi Praktis AI', [
            {t:'p',x:'Implementasi Praktis AI adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Implementasi Praktis AI akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Implementasi Praktis AI','Manfaat memahami Implementasi Praktis AI untuk pemula','Langkah pertama untuk mulai belajar Implementasi Praktis AI','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Implementasi Praktis AI\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Implementasi Praktis AI. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Implementasi Praktis AI adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['implementasi', 'Etika dan Keamanan AI', [
            {t:'p',x:'Etika dan Keamanan AI adalah konsep dasar dalam ai-machine-learning. Bayangkan seperti seperti mengajar anak kecil mengenali hewan melalui contoh berulang kali. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Etika dan Keamanan AI akan membantu kamu membangun dasar yang kuat dalam ai-machine-learning. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Etika dan Keamanan AI','Manfaat memahami Etika dan Keamanan AI untuk pemula','Langkah pertama untuk mulai belajar Etika dan Keamanan AI','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Etika dan Keamanan AI\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Etika dan Keamanan AI. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Etika dan Keamanan AI adalah titik awal dalam perjalanan belajarmu di ai-machine-learning. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['implementasi', 'Kesalahan Umum: Mengandalkan AI Tanpa Pengawasan Manusia', [
            {t:'p',x:'Kesalahan Umum: Mengandalkan AI Tanpa Pengawasan Manusia adalah kesalahan yang sering dilakukan pemula saat belajar ai-machine-learning. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengandalkan AI Tanpa Pengawasan Manusia karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengandalkan AI Tanpa Pengawasan Manusia sering terjadi pada pemula','Cara mudah menghindari Mengandalkan AI Tanpa Pengawasan Manusia','Tanda bahwa kamu mengalami Mengandalkan AI Tanpa Pengawasan Manusia','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengandalkan AI Tanpa Pengawasan Manusia\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengandalkan AI Tanpa Pengawasan Manusia. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengandalkan AI Tanpa Pengawasan Manusia sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['ip-address-subnetting', 'IP Address dan Subnetting', [
            {t:'p',x:'IP Address dan Subnetting adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai IP Address dan Subnetting akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari IP Address dan Subnetting','Manfaat memahami IP Address dan Subnetting untuk pemula','Langkah pertama untuk mulai belajar IP Address dan Subnetting','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: IP Address dan Subnetting\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar IP Address dan Subnetting. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: IP Address dan Subnetting adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ip-address-subnetting', 'Kelas IP Address', [
            {t:'p',x:'Kelas IP Address adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kelas IP Address akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kelas IP Address','Manfaat memahami Kelas IP Address untuk pemula','Langkah pertama untuk mulai belajar Kelas IP Address','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kelas IP Address\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kelas IP Address. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kelas IP Address adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ip-address-subnetting', 'IP Publik dan IP Privat', [
            {t:'p',x:'IP Publik dan IP Privat adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai IP Publik dan IP Privat akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari IP Publik dan IP Privat','Manfaat memahami IP Publik dan IP Privat untuk pemula','Langkah pertama untuk mulai belajar IP Publik dan IP Privat','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: IP Publik dan IP Privat\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar IP Publik dan IP Privat. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: IP Publik dan IP Privat adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ip-address-subnetting', 'Kesalahan Umum: IP Duplikat dalam Jaringan', [
            {t:'p',x:'Kesalahan Umum: IP Duplikat dalam Jaringan adalah kesalahan yang sering dilakukan pemula saat belajar jaringan-komputer. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di IP Duplikat dalam Jaringan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa IP Duplikat dalam Jaringan sering terjadi pada pemula','Cara mudah menghindari IP Duplikat dalam Jaringan','Tanda bahwa kamu mengalami IP Duplikat dalam Jaringan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: IP Duplikat dalam Jaringan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami IP Duplikat dalam Jaringan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari IP Duplikat dalam Jaringan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['tcpip-dan-osi', 'Model TCP/IP dan OSI', [
            {t:'p',x:'Model TCP/IP dan OSI adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Model TCP/IP dan OSI akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Model TCP/IP dan OSI','Manfaat memahami Model TCP/IP dan OSI untuk pemula','Langkah pertama untuk mulai belajar Model TCP/IP dan OSI','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Model TCP/IP dan OSI\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Model TCP/IP dan OSI. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Model TCP/IP dan OSI adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['tcpip-dan-osi', 'Protokol TCP dan UDP', [
            {t:'p',x:'Protokol TCP dan UDP adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Protokol TCP dan UDP akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Protokol TCP dan UDP','Manfaat memahami Protokol TCP dan UDP untuk pemula','Langkah pertama untuk mulai belajar Protokol TCP dan UDP','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Protokol TCP dan UDP\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Protokol TCP dan UDP. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Protokol TCP dan UDP adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['tcpip-dan-osi', 'Kesalahan Umum: Menggunakan UDP untuk Data Kritis', [
            {t:'p',x:'Kesalahan Umum: Menggunakan UDP untuk Data Kritis adalah kesalahan yang sering dilakukan pemula saat belajar jaringan-komputer. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menggunakan UDP untuk Data Kritis karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menggunakan UDP untuk Data Kritis sering terjadi pada pemula','Cara mudah menghindari Menggunakan UDP untuk Data Kritis','Tanda bahwa kamu mengalami Menggunakan UDP untuk Data Kritis','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menggunakan UDP untuk Data Kritis\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menggunakan UDP untuk Data Kritis. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menggunakan UDP untuk Data Kritis sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['routing-switching', 'Routing dan Switching', [
            {t:'p',x:'Routing dan Switching adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Routing dan Switching akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Routing dan Switching','Manfaat memahami Routing dan Switching untuk pemula','Langkah pertama untuk mulai belajar Routing dan Switching','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Routing dan Switching\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Routing dan Switching. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Routing dan Switching adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['routing-switching', 'Tabel Routing', [
            {t:'p',x:'Tabel Routing adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Tabel Routing akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Tabel Routing','Manfaat memahami Tabel Routing untuk pemula','Langkah pertama untuk mulai belajar Tabel Routing','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Tabel Routing\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Tabel Routing. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Tabel Routing adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['routing-switching', 'Kesalahan Umum: Gateway Tidak Terkonfigurasi', [
            {t:'p',x:'Kesalahan Umum: Gateway Tidak Terkonfigurasi adalah kesalahan yang sering dilakukan pemula saat belajar jaringan-komputer. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Gateway Tidak Terkonfigurasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Gateway Tidak Terkonfigurasi sering terjadi pada pemula','Cara mudah menghindari Gateway Tidak Terkonfigurasi','Tanda bahwa kamu mengalami Gateway Tidak Terkonfigurasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Gateway Tidak Terkonfigurasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Gateway Tidak Terkonfigurasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Gateway Tidak Terkonfigurasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['jaringan-nirkabel', 'Jaringan Nirkabel (Wi-Fi)', [
            {t:'p',x:'Jaringan Nirkabel (Wi-Fi) adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Jaringan Nirkabel (Wi-Fi) akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Jaringan Nirkabel (Wi-Fi)','Manfaat memahami Jaringan Nirkabel (Wi-Fi) untuk pemula','Langkah pertama untuk mulai belajar Jaringan Nirkabel (Wi-Fi)','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Jaringan Nirkabel (Wi-Fi)\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Jaringan Nirkabel (Wi-Fi). Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Jaringan Nirkabel (Wi-Fi) adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['jaringan-nirkabel', 'Keamanan Dasar Wi-Fi', [
            {t:'p',x:'Keamanan Dasar Wi-Fi adalah konsep dasar dalam jaringan-komputer. Bayangkan seperti seperti sistem pos yang mengirimi surat dari satu alamat ke alamat lain. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Keamanan Dasar Wi-Fi akan membantu kamu membangun dasar yang kuat dalam jaringan-komputer. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Keamanan Dasar Wi-Fi','Manfaat memahami Keamanan Dasar Wi-Fi untuk pemula','Langkah pertama untuk mulai belajar Keamanan Dasar Wi-Fi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Keamanan Dasar Wi-Fi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Keamanan Dasar Wi-Fi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Keamanan Dasar Wi-Fi adalah titik awal dalam perjalanan belajarmu di jaringan-komputer. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['jaringan-nirkabel', 'Kesalahan Umum: Wi-Fi Tanpa Kata Sandi', [
            {t:'p',x:'Kesalahan Umum: Wi-Fi Tanpa Kata Sandi adalah kesalahan yang sering dilakukan pemula saat belajar jaringan-komputer. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Wi-Fi Tanpa Kata Sandi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Wi-Fi Tanpa Kata Sandi sering terjadi pada pemula','Cara mudah menghindari Wi-Fi Tanpa Kata Sandi','Tanda bahwa kamu mengalami Wi-Fi Tanpa Kata Sandi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Wi-Fi Tanpa Kata Sandi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Wi-Fi Tanpa Kata Sandi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Wi-Fi Tanpa Kata Sandi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['linux-dasar', 'Linux Dasar (Ubuntu/CentOS)', [
            {t:'p',x:'Linux Dasar (Ubuntu/CentOS) adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Linux Dasar (Ubuntu/CentOS) akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Linux Dasar (Ubuntu/CentOS)','Manfaat memahami Linux Dasar (Ubuntu/CentOS) untuk pemula','Langkah pertama untuk mulai belajar Linux Dasar (Ubuntu/CentOS)','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Linux Dasar (Ubuntu/CentOS)\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Linux Dasar (Ubuntu/CentOS). Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Linux Dasar (Ubuntu/CentOS) adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['linux-dasar', 'Manajemen File dan Izin', [
            {t:'p',x:'Manajemen File dan Izin adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Manajemen File dan Izin akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Manajemen File dan Izin','Manfaat memahami Manajemen File dan Izin untuk pemula','Langkah pertama untuk mulai belajar Manajemen File dan Izin','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Manajemen File dan Izin\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Manajemen File dan Izin. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Manajemen File dan Izin adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['linux-dasar', 'Kesalahan Umum: Menjalankan Semua Perintah sebagai Root', [
            {t:'p',x:'Kesalahan Umum: Menjalankan Semua Perintah sebagai Root adalah kesalahan yang sering dilakukan pemula saat belajar sistem-operasi. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menjalankan Semua Perintah sebagai Root karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menjalankan Semua Perintah sebagai Root sering terjadi pada pemula','Cara mudah menghindari Menjalankan Semua Perintah sebagai Root','Tanda bahwa kamu mengalami Menjalankan Semua Perintah sebagai Root','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menjalankan Semua Perintah sebagai Root\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menjalankan Semua Perintah sebagai Root. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menjalankan Semua Perintah sebagai Root sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['windows-dasar', 'Windows Dasar', [
            {t:'p',x:'Windows Dasar adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Windows Dasar akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Windows Dasar','Manfaat memahami Windows Dasar untuk pemula','Langkah pertama untuk mulai belajar Windows Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Windows Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Windows Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Windows Dasar adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['windows-dasar', 'Panel Kontrol dan Pengaturan Sistem', [
            {t:'p',x:'Panel Kontrol dan Pengaturan Sistem adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Panel Kontrol dan Pengaturan Sistem akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Panel Kontrol dan Pengaturan Sistem','Manfaat memahami Panel Kontrol dan Pengaturan Sistem untuk pemula','Langkah pertama untuk mulai belajar Panel Kontrol dan Pengaturan Sistem','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Panel Kontrol dan Pengaturan Sistem\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Panel Kontrol dan Pengaturan Sistem. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Panel Kontrol dan Pengaturan Sistem adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['windows-dasar', 'Kesalahan Umum: Mengabaikan Pembaruan Sistem', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Pembaruan Sistem adalah kesalahan yang sering dilakukan pemula saat belajar sistem-operasi. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Pembaruan Sistem karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Pembaruan Sistem sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Pembaruan Sistem','Tanda bahwa kamu mengalami Mengabaikan Pembaruan Sistem','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Pembaruan Sistem\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Pembaruan Sistem. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Pembaruan Sistem sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['macos-dasar', 'macOS Dasar', [
            {t:'p',x:'macOS Dasar adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai macOS Dasar akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari macOS Dasar','Manfaat memahami macOS Dasar untuk pemula','Langkah pertama untuk mulai belajar macOS Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: macOS Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar macOS Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: macOS Dasar adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['macos-dasar', 'Finder dan Manajemen File', [
            {t:'p',x:'Finder dan Manajemen File adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Finder dan Manajemen File akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Finder dan Manajemen File','Manfaat memahami Finder dan Manajemen File untuk pemula','Langkah pertama untuk mulai belajar Finder dan Manajemen File','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Finder dan Manajemen File\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Finder dan Manajemen File. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Finder dan Manajemen File adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['macos-dasar', 'Kesalahan Umum: Menginstal Aplikasi Dari Sumber Tidak Terpercaya', [
            {t:'p',x:'Kesalahan Umum: Menginstal Aplikasi Dari Sumber Tidak Terpercaya adalah kesalahan yang sering dilakukan pemula saat belajar sistem-operasi. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menginstal Aplikasi Dari Sumber Tidak Terpercaya karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menginstal Aplikasi Dari Sumber Tidak Terpercaya sering terjadi pada pemula','Cara mudah menghindari Menginstal Aplikasi Dari Sumber Tidak Terpercaya','Tanda bahwa kamu mengalami Menginstal Aplikasi Dari Sumber Tidak Terpercaya','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menginstal Aplikasi Dari Sumber Tidak Terpercaya\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menginstal Aplikasi Dari Sumber Tidak Terpercaya. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menginstal Aplikasi Dari Sumber Tidak Terpercaya sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['baris-perintah', 'Baris Perintah dan Manajemen File', [
    { t: 'p', x: 'Baris perintah (command line interface) memungkinkan mengoperasikan komputer melalui perintah teks. Baris perintah cepat dan efisien untuk tugas berulang dan otomatisasi.' },
    { t: 'code', lang: 'bash', x: '# Pindah folder\\ncd dokumen\\n\\n# Salin file\\ncp file.txt backup/\\n\\n# Pindah atau ganti nama file\\nmv file.txt nama_baru.txt\\n\\n# Hapus file\\nrm file_lama.txt' },
    { t: 'list', items: ['cd untuk pindah direktori', 'ls untuk melihat isi direktori', 'cp untuk menyalin file', 'mv untuk memindahkan atau mengganti nama file', 'rm untuk menghapus file'] },
    { t: 'tip', x: 'Gunakan tab completion (tekan Tab) untuk melengkapi nama file atau perintah secara otomatis.' },
  ], 3],
  ['baris-perintah', 'Skrip Otomatisasi', [
            {t:'p',x:'Skrip Otomatisasi adalah konsep dasar dalam sistem-operasi. Bayangkan seperti seperti pengatur lalu lintas di sebuah kota yang besar. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Skrip Otomatisasi akan membantu kamu membangun dasar yang kuat dalam sistem-operasi. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Skrip Otomatisasi','Manfaat memahami Skrip Otomatisasi untuk pemula','Langkah pertama untuk mulai belajar Skrip Otomatisasi','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Skrip Otomatisasi\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Skrip Otomatisasi. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Skrip Otomatisasi adalah titik awal dalam perjalanan belajarmu di sistem-operasi. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['baris-perintah', 'Kesalahan Umum: Menghapus File Tanpa Cadangan', [
            {t:'p',x:'Kesalahan Umum: Menghapus File Tanpa Cadangan adalah kesalahan yang sering dilakukan pemula saat belajar sistem-operasi. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menghapus File Tanpa Cadangan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menghapus File Tanpa Cadangan sering terjadi pada pemula','Cara mudah menghindari Menghapus File Tanpa Cadangan','Tanda bahwa kamu mengalami Menghapus File Tanpa Cadangan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menghapus File Tanpa Cadangan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menghapus File Tanpa Cadangan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menghapus File Tanpa Cadangan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['cloud-apa-itu', 'Apa itu Cloud Computing', [
            {t:'p',x:'Apa itu Cloud Computing adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Apa itu Cloud Computing akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Apa itu Cloud Computing','Manfaat memahami Apa itu Cloud Computing untuk pemula','Langkah pertama untuk mulai belajar Apa itu Cloud Computing','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Apa itu Cloud Computing\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Apa itu Cloud Computing. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Apa itu Cloud Computing adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['cloud-apa-itu', 'Model Layanan Cloud', [
            {t:'p',x:'Model Layanan Cloud adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Model Layanan Cloud akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Model Layanan Cloud','Manfaat memahami Model Layanan Cloud untuk pemula','Langkah pertama untuk mulai belajar Model Layanan Cloud','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Model Layanan Cloud\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Model Layanan Cloud. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Model Layanan Cloud adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['cloud-apa-itu', 'Kesalahan Umum: Biaya Cloud Tidak Terkontrol', [
            {t:'p',x:'Kesalahan Umum: Biaya Cloud Tidak Terkontrol adalah kesalahan yang sering dilakukan pemula saat belajar cloud-computing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Biaya Cloud Tidak Terkontrol karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Biaya Cloud Tidak Terkontrol sering terjadi pada pemula','Cara mudah menghindari Biaya Cloud Tidak Terkontrol','Tanda bahwa kamu mengalami Biaya Cloud Tidak Terkontrol','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Biaya Cloud Tidak Terkontrol\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Biaya Cloud Tidak Terkontrol. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Biaya Cloud Tidak Terkontrol sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['aws-dasar', 'AWS Dasar', [
            {t:'p',x:'AWS Dasar adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai AWS Dasar akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari AWS Dasar','Manfaat memahami AWS Dasar untuk pemula','Langkah pertama untuk mulai belajar AWS Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: AWS Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar AWS Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: AWS Dasar adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['aws-dasar', 'EC2 dan S3', [
            {t:'p',x:'EC2 dan S3 adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai EC2 dan S3 akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari EC2 dan S3','Manfaat memahami EC2 dan S3 untuk pemula','Langkah pertama untuk mulai belajar EC2 dan S3','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: EC2 dan S3\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar EC2 dan S3. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: EC2 dan S3 adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['aws-dasar', 'Kesalahan Umum: Bucket S3 Publik Tanpa Sengaja', [
            {t:'p',x:'Kesalahan Umum: Bucket S3 Publik Tanpa Sengaja adalah kesalahan yang sering dilakukan pemula saat belajar cloud-computing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Bucket S3 Publik Tanpa Sengaja karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Bucket S3 Publik Tanpa Sengaja sering terjadi pada pemula','Cara mudah menghindari Bucket S3 Publik Tanpa Sengaja','Tanda bahwa kamu mengalami Bucket S3 Publik Tanpa Sengaja','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Bucket S3 Publik Tanpa Sengaja\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Bucket S3 Publik Tanpa Sengaja. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Bucket S3 Publik Tanpa Sengaja sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['gcp-dasar', 'GCP Dasar', [
            {t:'p',x:'GCP Dasar adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai GCP Dasar akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari GCP Dasar','Manfaat memahami GCP Dasar untuk pemula','Langkah pertama untuk mulai belajar GCP Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: GCP Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar GCP Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: GCP Dasar adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['gcp-dasar', 'Compute Engine dan Cloud Storage', [
            {t:'p',x:'Compute Engine dan Cloud Storage adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Compute Engine dan Cloud Storage akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Compute Engine dan Cloud Storage','Manfaat memahami Compute Engine dan Cloud Storage untuk pemula','Langkah pertama untuk mulai belajar Compute Engine dan Cloud Storage','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Compute Engine dan Cloud Storage\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Compute Engine dan Cloud Storage. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Compute Engine dan Cloud Storage adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['gcp-dasar', 'Kesalahan Umum: IAM Izin Terlalu Luas', [
            {t:'p',x:'Kesalahan Umum: IAM Izin Terlalu Luas adalah kesalahan yang sering dilakukan pemula saat belajar cloud-computing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di IAM Izin Terlalu Luas karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa IAM Izin Terlalu Luas sering terjadi pada pemula','Cara mudah menghindari IAM Izin Terlalu Luas','Tanda bahwa kamu mengalami IAM Izin Terlalu Luas','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: IAM Izin Terlalu Luas\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami IAM Izin Terlalu Luas. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari IAM Izin Terlalu Luas sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['azure-dasar', 'Azure Dasar', [
            {t:'p',x:'Azure Dasar adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Azure Dasar akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Azure Dasar','Manfaat memahami Azure Dasar untuk pemula','Langkah pertama untuk mulai belajar Azure Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Azure Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Azure Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Azure Dasar adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['azure-dasar', 'Virtual Machines dan Blob Storage', [
            {t:'p',x:'Virtual Machines dan Blob Storage adalah konsep dasar dalam cloud-computing. Bayangkan seperti seperti sewa listrik: kamu hanya bayar untuk yang dipakai, tanpa perlu membeli generator sendiri. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Virtual Machines dan Blob Storage akan membantu kamu membangun dasar yang kuat dalam cloud-computing. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Virtual Machines dan Blob Storage','Manfaat memahami Virtual Machines dan Blob Storage untuk pemula','Langkah pertama untuk mulai belajar Virtual Machines dan Blob Storage','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Virtual Machines dan Blob Storage\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Virtual Machines dan Blob Storage. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Virtual Machines dan Blob Storage adalah titik awal dalam perjalanan belajarmu di cloud-computing. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['azure-dasar', 'Kesalahan Umum: Mengabaikan Cadangan Cloud', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Cadangan Cloud adalah kesalahan yang sering dilakukan pemula saat belajar cloud-computing. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Cadangan Cloud karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Cadangan Cloud sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Cadangan Cloud','Tanda bahwa kamu mengalami Mengabaikan Cadangan Cloud','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Cadangan Cloud\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Cadangan Cloud. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Cadangan Cloud sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['kriptografi', 'Kriptografi Dasar', [
            {t:'p',x:'Kriptografi Dasar adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Kriptografi Dasar akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Kriptografi Dasar','Manfaat memahami Kriptografi Dasar untuk pemula','Langkah pertama untuk mulai belajar Kriptografi Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Kriptografi Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Kriptografi Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Kriptografi Dasar adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kriptografi', 'Enkripsi dan Hashing', [
            {t:'p',x:'Enkripsi dan Hashing adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Enkripsi dan Hashing akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Enkripsi dan Hashing','Manfaat memahami Enkripsi dan Hashing untuk pemula','Langkah pertama untuk mulai belajar Enkripsi dan Hashing','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Enkripsi dan Hashing\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Enkripsi dan Hashing. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Enkripsi dan Hashing adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['kriptografi', 'Kesalahan Umum: Menyimpan Kata Sandi Dalam Bentuk Teks Biasa', [
            {t:'p',x:'Kesalahan Umum: Menyimpan Kata Sandi Dalam Bentuk Teks Biasa adalah kesalahan yang sering dilakukan pemula saat belajar cyber-security. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Menyimpan Kata Sandi Dalam Bentuk Teks Biasa karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Menyimpan Kata Sandi Dalam Bentuk Teks Biasa sering terjadi pada pemula','Cara mudah menghindari Menyimpan Kata Sandi Dalam Bentuk Teks Biasa','Tanda bahwa kamu mengalami Menyimpan Kata Sandi Dalam Bentuk Teks Biasa','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Menyimpan Kata Sandi Dalam Bentuk Teks Biasa\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Menyimpan Kata Sandi Dalam Bentuk Teks Biasa. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Menyimpan Kata Sandi Dalam Bentuk Teks Biasa sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['ethical-hacking', 'Ethical Hacking Dasar', [
            {t:'p',x:'Ethical Hacking Dasar adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Ethical Hacking Dasar akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Ethical Hacking Dasar','Manfaat memahami Ethical Hacking Dasar untuk pemula','Langkah pertama untuk mulai belajar Ethical Hacking Dasar','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Ethical Hacking Dasar\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Ethical Hacking Dasar. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Ethical Hacking Dasar adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ethical-hacking', 'Pengujian Kecepatan dan Kerentanan', [
            {t:'p',x:'Pengujian Kecepatan dan Kerentanan adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pengujian Kecepatan dan Kerentanan akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pengujian Kecepatan dan Kerentanan','Manfaat memahami Pengujian Kecepatan dan Kerentanan untuk pemula','Langkah pertama untuk mulai belajar Pengujian Kecepatan dan Kerentanan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pengujian Kecepatan dan Kerentanan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pengujian Kecepatan dan Kerentanan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pengujian Kecepatan dan Kerentanan adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['ethical-hacking', 'Kesalahan Umum: Mengabaikan Izin Tertulis', [
            {t:'p',x:'Kesalahan Umum: Mengabaikan Izin Tertulis adalah kesalahan yang sering dilakukan pemula saat belajar cyber-security. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengabaikan Izin Tertulis karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengabaikan Izin Tertulis sering terjadi pada pemula','Cara mudah menghindari Mengabaikan Izin Tertulis','Tanda bahwa kamu mengalami Mengabaikan Izin Tertulis','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengabaikan Izin Tertulis\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengabaikan Izin Tertulis. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengabaikan Izin Tertulis sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['pertahanan-jaringan', 'Pertahanan Jaringan', [
            {t:'p',x:'Pertahanan Jaringan adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pertahanan Jaringan akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pertahanan Jaringan','Manfaat memahami Pertahanan Jaringan untuk pemula','Langkah pertama untuk mulai belajar Pertahanan Jaringan','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pertahanan Jaringan\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pertahanan Jaringan. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pertahanan Jaringan adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['pertahanan-jaringan', 'Firewall dan DDoS', [
            {t:'p',x:'Firewall dan DDoS adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Firewall dan DDoS akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Firewall dan DDoS','Manfaat memahami Firewall dan DDoS untuk pemula','Langkah pertama untuk mulai belajar Firewall dan DDoS','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Firewall dan DDoS\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Firewall dan DDoS. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Firewall dan DDoS adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['pertahanan-jaringan', 'Kesalahan Umum: Firewall Tidak Dikonfigurasi', [
            {t:'p',x:'Kesalahan Umum: Firewall Tidak Dikonfigurasi adalah kesalahan yang sering dilakukan pemula saat belajar cyber-security. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Firewall Tidak Dikonfigurasi karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Firewall Tidak Dikonfigurasi sering terjadi pada pemula','Cara mudah menghindari Firewall Tidak Dikonfigurasi','Tanda bahwa kamu mengalami Firewall Tidak Dikonfigurasi','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Firewall Tidak Dikonfigurasi\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Firewall Tidak Dikonfigurasi. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Firewall Tidak Dikonfigurasi sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
  ['pencegahan-malware', 'Pencegahan Malware', [
            {t:'p',x:'Pencegahan Malware adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Pencegahan Malware akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Pencegahan Malware','Manfaat memahami Pencegahan Malware untuk pemula','Langkah pertama untuk mulai belajar Pencegahan Malware','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Pencegahan Malware\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Pencegahan Malware. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Pencegahan Malware adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['pencegahan-malware', 'Cara Melindungi dari Malware', [
            {t:'p',x:'Cara Melindungi dari Malware adalah konsep dasar dalam cyber-security. Bayangkan seperti seperti mengunci rumah dan memasang pagar agar pencuri tidak bisa masuk. Untuk pemula, yang penting memahami ide besarnya dulu sebelum memasuki detail teknis.'},
            {t:'p',x:'Menguasai Cara Melindungi dari Malware akan membantu kamu membangun dasar yang kuat dalam cyber-security. Kamu tidak perlu menguasai semuanya sekaligus — pelajari satu hal pada satu waktu dan langsung praktek.'},
            {t:'list',items:['Tujuan utama dari Cara Melindungi dari Malware','Manfaat memahami Cara Melindungi dari Malware untuk pemula','Langkah pertama untuk mulai belajar Cara Melindungi dari Malware','Sumber belajar yang cocok untuk pemula']},
            {t:'code',lang:'text',x:'# Memulai belajar: Cara Melindungi dari Malware\\n# Baca penjelasan secara perlahan\\n# Coba contoh sederhana secara langsung\\n# Lakukan latihan kecil setiap hari\\n# Tanya jika ada yang tidak jelas'},
            {t:'tip',x:'Mulai dari hal yang paling dasar. Jangan lonjati materi sebelum menguasai dasar-dasar Cara Melindungi dari Malware. Kesalahan umum pemula adalah ingin langsung membuat proyek besar tanpa memahami fondasi.'},
            {t:'p',x:'Kesimpulan: Cara Melindungi dari Malware adalah titik awal dalam perjalanan belajarmu di cyber-security. Teruslah belajar dan praktikkan secara konsisten.'}
            ], 20],
  ['pencegahan-malware', 'Kesalahan Umum: Mengklik Link Mencurigakan', [
            {t:'p',x:'Kesalahan Umum: Mengklik Link Mencurigakan adalah kesalahan yang sering dilakukan pemula saat belajar cyber-security. Mengetahui kesalahan ini sejak awal akan mempercepat belajar dan mencegah frustrasi.'},
            {t:'p',x:'Banyak pemula tersandung di Mengklik Link Mencurigakan karena belum memahami dasarnya. Ketika kamu tahu apa yang harus dihindari, kamu akan lebih tenang dalam mencoba dan bereksperimen.'},
            {t:'list',items:['Mengapa Mengklik Link Mencurigakan sering terjadi pada pemula','Cara mudah menghindari Mengklik Link Mencurigakan','Tanda bahwa kamu mengalami Mengklik Link Mencurigakan','Langkah perbaikan jika sudah terjadi']},
            {t:'code',lang:'text',x:'# Contoh kesalahan: Mengklik Link Mencurigakan\\n# Salah: mencoba semua sekaligus tanpa memahami dasar\\n# Benar: belajar bertahap dan uji satu per satu\\n# Jika error, baca pesan error dengan cermat sebelum mencoba perbaikan'},
            {t:'tip',x:'Jangan merasa malasalah jika mengalami Mengklik Link Mencurigakan. Setiap programmer pemula mengalami hal yang sama. Yang penting adalah kamu belajar dari kesalahan dan tidak mengulanginya.'},
            {t:'p',x:'Ringkasan: Menghindari Mengklik Link Mencurigakan sejak awal akan menghemat waktu dan tenaga kamu. Teruslah belajar dari setiap kesalahan.'}
            ], 15],
// ============ TRACK 1: FONDASI ============
  // --- logika-algoritma ---

// --- alur-dan-pseudocode ---
 // --- percabangan-dan-perulangan ---
 // --- fungsi-dan-rekursi ---
 // --- kompleksitas-waktu ---
 // --- struktur-data ---

// --- stack-dan-queue ---

// --- linked-list ---

// --- hash-map ---

// --- pemilihan-struktur ---
 // --- oop-dasar ---

// --- enkapsulasi ---

// --- pewarisan ---

// --- polimorfisme ---

// --- abstraksi-dan-interface ---
 // --- vcs-dasar ---

 // --- repository-dan-commit ---
 // --- branch-dan-merge ---
 // --- resolve-konflik ---
  // --- git-github ---
   // --- web-dasar ---

// --- typescript-dasar ---
  // --- tiype-data ---
  // --- interface-dan-type ---
  // --- fungsi-dan-generic ---
  // --- reactjs-dasar ---
  // --- komponen-dan-props ---

// --- state-dan-event ---
  // --- hook-dasar ---
  // --- proyek-mini ---
  // --- nextjs-dasar ---
  // --- routing-dan-ssr ---
  // --- api-route ---
  // --- deploy ---

// --- nodejs-dasar ---
  // --- modul-dan-npm ---
  // --- rest-api ---
  // --- database-koneksi ---
  // --- php-dasar ---
 // --- form-dan-database ---
 // --- session-dan-keamanan ---

  // --- variabel-dan-fungsi ---

// --- laravel-dasar ---
  // --- eloquent-dan-blade ---
  // --- routing-dan-migrasi ---
  // --- proyek-mini (laravel) ---
  // --- codeigniter-dasar ---
  // --- mvc-dasar ---
  // --- query-builder ---
  // --- proyek-mini (ci) ---

// --- android-dasar ---
  // --- kotlin-dasar ---
  // --- layout-dan-activity ---
  // --- publish-play-store ---
  // --- ios-dasar ---
  // --- swiftui-dasar ---
  // --- navigasi-dan-layar ---
  // --- app-store ---
  // --- flutter-dasar ---
  // --- dart-dasar ---
  // --- widget-dasar ---
  // --- proyek-mini (flutter) ---
  // --- react-native-dasar ---
  // --- javascript-dasar-react-native ---
  // --- navigasi (react native) ---
  // --- proyek-mini (react native) ---

// --- pengembangan-perangkat-lunak ---
  // --- desain-perangkat-lunak ---
  // --- implementasi-dan-uji ---
  // --- peluncuran-dan-pemeliharaan ---
  // --- rekayasa-perangkat-lunak ---
  // --- manajemen-proyek ---
  // --- agile-scrum ---
  // --- dokumentasi ---
  // --- qa-testing ---
  // --- unit-test ---
  // --- integrasi-dan-sistem ---
  // --- uat-dan-laporan ---

// --- basis-data-sql ---
  // --- query-sql ---
  // --- join-dan-indeks ---
  // --- mysql-postgresql ---
  // --- nosql-mongodb ---
  // --- mongodb-dasar ---
  // --- query-dokumen ---
  // --- agregasi ---
  // --- data-science ---
  // --- statistika-deskriptif ---
  // --- visualisasi-data ---
  // --- insight-bisnis ---
  // --- ai-machine-learning ---
  // --- ml-dasar ---
  // --- model-prediksi ---
  // --- implementasi ---

// --- jaringan-komputer ---
  // --- tcpip-dan-osi ---
  // --- routing-switching ---
  // --- jaringan-nirkabel ---
  // --- sistem-operasi ---
  // --- windows-dasar ---
  // --- macos-dasar ---
  // --- baris-perintah ---
  // --- cloud-computing ---
  // --- aws-dasar ---
  // --- gcp-dasar ---
  // --- azure-dasar ---
  // --- cyber-security ---
  // --- ethical-hacking ---
  // --- pertahanan-jaringan ---
  // --- pencegahan-malware ---




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

  const courseIdBySlug = new Map();
  for (const course of COURSES) {
    const ada = await store.one('courses', 'id', [['slug', course.slug]]);
    if (ada) {
      courseIdBySlug.set(course.slug, ada.id);
      continue;
    }
    // Id historis bergeser antar versi katalog (uuid(1) milik web-dasar jadi milik logika-algoritma),
    // jadi baris baru wajib pakai id yang belum terpakai; id kolom tetap course.id untuk baris lama.
    const courseId = uuid(900000000000 + COURSES.indexOf(course));
    await store.insertAbsent('courses', { ...course, id: courseId, published: true, created_at: createdAt }, 'slug');
    courseIdBySlug.set(course.slug, courseId);
  }
  const moduleIds = new Map();
  for (const [courseSlug, moduleSlug, title, minutes, offline, idKhusus] of MODULES) {
    const courseId = courseIdBySlug.get(courseSlug);
    const siblings = MODULES.filter((m) => m[0] === courseSlug);
    moduleIds.set(moduleSlug, await idModul(moduleSlug, () => store.insertAbsent(
      'modules',
      {
        id: idKhusus ?? uuid(1000 + MODULES.findIndex((m) => m[1] === moduleSlug) + 1),
        course_id: courseId,
        slug: moduleSlug,
        title,
        summary: `${title} — bagian dari ${COURSES.find((c) => c.slug === courseSlug).title}.`,
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

async function ensureAdmin(store) {
  const hash = await hashPassword('12345678');
  await store.insertAbsent(
    'users',
    {
      id: '0f5e0000-0000-4000-8000-000000000001',
      identity: 'qoder:dev-admin',
      username: 'AdminHafiz',
      password_hash: hash,
      email: 'admin@eduverse.dev',
      name: 'Hafiz',
      picture: '',
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    'identity'
  );
}

/** Dipanggil sebelum permintaan baca katalog; setiap ensure memeriksa kehadiran baris lebih dulu. */
export async function bootstrap(store) {
  await ensureRanks(store);
  await ensureCatalog(store);
  await ensureTournaments(store);
  await ensureAdSlots(store);
  await ensureAdmin(store);
}

