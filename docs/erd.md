# EduVerse — ERD skema `app` (Postgres)

Sumber kebenaran: `migrations/0001_identity.sql` … `0010_key_integrity.sql` (24 tabel).
Garis solid `--` = FK nyata di DDL. Garis putus `..` = relasi logika tanpa FK (debt yang harus disadari).
`0010_key_integrity.sql` menutup lima di antaranya dengan FK + ON DELETE yang dipilih sadar; sisanya
tinggal relasi logika karena tidak bisa diekspresikan sebagai FK tunggal — alasannya di catatan bawah.

```mermaid
erDiagram
  USERS ||--o{ SESSIONS : "1:N session login"
  USERS ||--|| USER_STATE : "1:1 XP/streak/prefs"
  USERS ||--o{ PROGRESS : "menyelesaikan"
  USERS ||--o{ DOWNLOADS : "paket luring"
  USERS ||--o{ ENTRIES : "ikut turnamen"
  USERS ||--o{ ATTEMPTS : "mengerjakan kuis"
  USERS ||--o{ XP_EVENTS : "pencatatan XP"
  USERS ||--o{ THREADS : "membuka"
  USERS ||--o{ POSTS : "menjawab"
  USERS ||--o{ VOTES : "memilih"
  USERS ||--o{ FLAGS : "melaporkan"

  COURSES ||--o{ MODULES : "1:N"
  MODULES ||--o{ LESSONS : "1:N (body jsonb)"
  MODULES ||--o{ BANKS : "bank soal"
  MODULES ||--o{ DOWNLOADS : "per modul"
  MODULES ||--o{ THREADS : "ruang diskusi"
  LESSONS ||--o{ PROGRESS : "UNIQUE(user,lesson)"

  BANKS ||--o{ QUESTIONS : "1:N (options jsonb)"
  BANKS ||--o{ ATTEMPTS : "UNIQUE(user,bank,attempt_no)"
  QUESTIONS ||--o{ ANSWERS : "1 jawaban per soal"
  ATTEMPTS ||--o{ ANSWERS : "snapshot jsonb dibekukan"

  TOURNAMENTS ||--o{ ENTRIES : "UNIQUE(tournament,user)"
  TOURNAMENTS ||--o{ ATTEMPTS : "0..1 — nullable FK"

  THREADS ||--o{ POSTS : "1:N"
  THREADS ||--o{ VOTES : "UNIQUE(thread,post,user)"
  POSTS ||..o{ VOTES : "post_id TANPA FK — isinya id post ATAU id thread"
  THREADS ||--o| POSTS : "accepted_post_id FK, ON DELETE SET NULL"

  RANKS ||--o{ USER_STATE : "rank_key FK, ON DELETE RESTRICT"
  RANKS ||--o{ ENTRIES : "rank_key FK, ON DELETE RESTRICT"
  ADS_SLOTS ||--o{ AD_EVENTS : "slot_key FK, ON DELETE RESTRICT"
  USERS ||..o{ AD_EVENTS : "user_id bertipe text, TANPA FK"
  FLAGS }..|| FLAGS : "target_kind+target_id polimorfik, TANPA FK"
  USERS ||--o{ FLAGS : "resolved_by FK, ON DELETE SET NULL"
  USERS ||--o{ PLAYGROUND_RUNS : "UNIQUE(user_id,task_key)"

  USERS {
    uuid id PK
    text identity UK "google:sub / github:login"
    text email
    text name
    text picture
    text role "learner|admin"
    timestamptz created_at
  }
  SESSIONS {
    text id PK "token sesi"
    uuid user_id FK
    timestamptz expires_at
  }
  USER_STATE {
    uuid user_id PK_FK
    integer xp
    text rank_key "FK RESTRICT -> ranks.rank_key"
    integer streak
    integer longest_streak
    text last_active_date "YYYY-MM-DD"
    jsonb prefs
    integer version "CAS optimistis"
  }
  RANKS {
    uuid id PK
    text rank_key UK
    text title
    integer threshold
    text color
    integer order_no
  }
  COURSES {
    uuid id PK
    text slug UK
    text title
    text level
    integer order_no
    boolean published
  }
  MODULES {
    uuid id PK
    uuid course_id FK
    text slug UK
    integer minutes
    boolean offline_ok
    integer order_no
    boolean published
  }
  LESSONS {
    uuid id PK
    uuid module_id FK
    jsonb body "blok p|h2|code|list|tip"
    integer minutes
    integer order_no
  }
  PROGRESS {
    uuid id PK
    uuid user_id FK
    uuid lesson_id FK
    boolean done
  }
  DOWNLOADS {
    uuid id PK
    uuid user_id FK
    uuid module_id FK
    text pack_hash
    bigint bytes
  }
  TOURNAMENTS {
    uuid id PK
    text key UK
    timestamptz starts_at
    timestamptz ends_at
    integer duration_seconds
    integer question_count
    jsonb bank_ids "array id bank, tanpa FK"
    text seed
    text status
  }
  ENTRIES {
    uuid id PK
    uuid tournament_id FK
    uuid user_id FK
    integer best_score
    bigint best_duration_ms
    integer attempts
    text rank_key "FK RESTRICT -> ranks.rank_key"
  }
  BANKS {
    uuid id PK
    uuid module_id FK
    integer time_limit_seconds
    integer pass_score
    boolean published
  }
  QUESTIONS {
    uuid id PK
    uuid bank_id FK
    text prompt
    jsonb options
    integer answer "kunci, hanya keluar setelah finish"
    text explanation
    integer order_no
  }
  ATTEMPTS {
    uuid id PK
    uuid user_id FK
    uuid bank_id FK
    uuid tournament_id FK "nullable"
    integer attempt_no
    text status "running|finished|expired"
    integer score
    integer correct
    integer total
    boolean offline
    jsonb snapshot "soal beku + kunci"
    timestamptz deadline_at "jam server"
  }
  ANSWERS {
    uuid id PK
    uuid attempt_id FK
    uuid question_id FK
    integer chosen
  }
  XP_EVENTS {
    uuid id PK
    uuid user_id FK
    text kind "lesson_done|module_done|quiz_pass|..."
    integer amount
    text ref_id "UNIQUE(user,kind,ref_id)"
    jsonb meta
  }
  THREADS {
    uuid id PK
    uuid module_id FK
    uuid user_id FK
    text title
    integer answer_count
    uuid accepted_post_id "FK SET NULL -> posts.id"
    boolean pinned
    boolean locked
    timestamptz last_activity_at
  }
  POSTS {
    uuid id PK
    uuid thread_id FK
    uuid user_id FK
    text body
    boolean accepted
  }
  VOTES {
    uuid id PK
    uuid thread_id FK
    uuid post_id "TANPA FK — id post ATAU id thread (pertanyaan)"
    uuid user_id FK
    integer value
  }
  FLAGS {
    uuid id PK
    text target_kind "thread|post"
    text target_id "polimorfik, TANPA FK"
    uuid reporter_id FK
    text reason
    text status
    uuid resolved_by "FK SET NULL -> users.id"
  }
  ADS_SLOTS {
    uuid id PK
    text slot_key UK
    text kind
    text image_path
    text target_url
    boolean enabled
    integer priority
  }
  AD_EVENTS {
    uuid id PK
    text slot_key "FK RESTRICT -> ad_slots.slot_key"
    text kind "impression|click"
    text day "YYYY-MM-DD agregasi"
    text user_id "TANPA FK, tipe text"
  }
  PLAYGROUND_RUNS {
    uuid id PK
    uuid user_id FK
    text task_key "latihan keras-koding di lib/playground/tasks.ts"
    text mode "js|web"
    boolean passed
    bigint duration_ms
    integer attempts "DEFAULT 1, dinaikkan tiap kali lulus lagi"
    timestamptz occurred_at
    created_at timestamptz
    updated_at timestamptz
  }
  LIMITER {
    text key PK "rate limit per user/ip"
    integer count
    timestamptz window_start
  }
```

## Catatan relasi

Sebelum `0010_key_integrity.sql`, tidak ada satu pun `ON DELETE` di `0001`–`0009` (`grep -rln "ON DELETE"
migrations/000[1-9]*.sql | wc -l` = 0 berkas), jadi 26 FK inline berjalan dengan **default NO ACTION** —
KOREKSI: dokumen ini sebelumnya menulis "RESTRICT diam-diam", dan itu salah nama. Diukur langsung dari
katalog `pg_constraint` di Neon produksi 2026-11-14: `total_fk = 31`, `dengan_aksi = 5`,
`default_no_action = 26`, dan `condeferrable = true` = 0 dari 31. Bedanya nyata (NO ACTION bisa ditunda
sampai akhir transaksi kalau constraint DEFERRABLE; RESTRICT tidak), tapi di skema ini tidak bisa
teramati karena tidak ada satu pun constraint yang DEFERRABLE — jadi koreksi ini soal kejujuran tulisan,
bukan soal perilaku. Keputusan di bawah ini ditulis sadar, satu per satu untuk 5 FK bentuk `ALTER`; kolom
"Aksi" adalah yang sekarang ditegakkan Postgres (`confdeltype`: `a` = NO ACTION, `r` = RESTRICT,
`n` = SET NULL).

| Relasi | Aksi | Alasan pilihan |
|---|---|---|
| `user_state.rank_key` → `ranks.rank_key` | FK `ON DELETE RESTRICT` (0010) | pangkat pengguna adalah haknya; menghapus anak tangga tidak boleh diam-diam menulis ulang peringkat orang. Admin harus memindahkan pengguna lebih dulu. Kolomnya `NOT NULL`, jadi `SET NULL` tidak tersedia. |
| `entries.rank_key` → `ranks.rank_key` | FK `ON DELETE RESTRICT` (0010) | papan peringkat adalah riwayat: baris hasil tidak boleh berubah atau hilang karena struktur tangga. `NOT NULL` juga menutup `SET NULL`. |
| `threads.accepted_post_id` → `posts.id` | FK `ON DELETE SET NULL` (0010) | hapus jawaban terpilih → topik kembali "belum terjawab", bukan hapus topiknya. Kolom memang nullable (`0007_discussion.sql:8`). Siklus threads↔posts aman karena constraint ditambahkan setelah kedua tabel ada. |
| `flags.resolved_by` → `users.id` | FK `ON DELETE SET NULL` (0010) | laporan tetap tercatat walau akun adminnya dihapus; hanya "siapa yang menutup" yang dilepas. |
| `ad_events.slot_key` → `ad_slots.slot_key` | FK `ON DELETE RESTRICT` (0010) | `ad_events` adalah catatan penagihan ke sponsor — tidak boleh ikut terhapus. Slot lama dipensiunkan lewat `enabled = false`, bukan `DELETE`. |
| `votes.post_id` → `posts.id` ATAU `threads.id` | tetap tanpa FK | diisi `thread.id` untuk suara pada Pertanyaan (`functions/src/social.mjs:91`), jadi satu kolom tidak bisa menunjuk satu tabel. FK ke `posts` akan menolak setiap suara pertanyaan dengan 23503. Penjaga: lookup `posts WHERE id = post_id AND thread_id = ...`. |
| `flags.target_kind` + `target_id` | tetap tanpa FK | polimorfik (`thread|post`) dalam kolom `text`; Postgres tidak punya FK ke dua tabel. |
| `ad_events.user_id` | tetap tanpa FK | `text` (bukan `uuid`) dan kejadian iklan harus tetap terhitung setelah akun dihapus. |
| `tournaments.bank_ids` | tetap tanpa FK | `jsonb` array; FK tidak menjangkau elemen array. Validasi id bank di Function arena. |
| `app.limiter` | berdiri sendiri | tidak terhubung siapa pun — disengaja. |
| `sessions.user_id` → `users.id` | FK inline di CREATE TABLE, TANPA `ON DELETE` = default NO ACTION (`confdeltype 'a'`, `0001_identity.sql:12`) | Keputusan ini TIDAK tercatat di tabel atas dan penjaga tidak bisa melihatnya. `dev/schema.mjs` hanya memetakan `foreignKeys` dari bentuk `ALTER TABLE … ADD CONSTRAINT … FOREIGN KEY` (regex di `:110`, pushed di `:131`); `REFERENCES` inline disimpan sebagai `column.references` (`:64`, `:74`) dan tidak pernah diuji aturan ON DELETE. Bukti: `parseMigrations('migrations')` → `sessions.foreignKeys = []`, `sessions.user_id.references = {users,id}`, `problems = 0`, dan daftar yang dijaga tepat 5 FK. Hitungan mentah `grep -rn "REFERENCES app\." migrations/` = 31 baris: 5 ALTER + 26 inline. RESTRICT di kolom ini tidak menghalangi pembersihan sesi karena yang dihapus baris `sessions` (anak), bukan baris `users` (induk). Perlu diputuskan pemilik: perluas penjaga ke bentuk inline, atau tulis alasannya di sini. |

`dev/schema.test.mjs` mengunci isi tabel ini: setiap FK harus membawa `ON DELETE` eksplisit, sasarannya
harus `UNIQUE`, `SET NULL` ditolak pada kolom `NOT NULL`, dan `votes.post_id` diawasi agar tidak diam-diam
diberi FK. Nama tes itu sudah diperbaiki (`dev/schema.test.mjs:191`) supaya tidak lagi menjanjikan cakupan
yang tidak diberikan: penjaganya hanya selebar tabel `harapan` di `:195` — 5 FK bentukan `ALTER` — dan
`assert.equal(bentukAlter, 5)` + `assert.equal(inline, 26)` di `:230-231` mengunci angka itu, sehingga
menambah menambah `REFERENCES` inline tanpa keputusan tercatat membuat tes gagal, bukan lolos diam-diam.

Catatan penerapan: sampai `5d82001` `grep -rn "DELETE FROM" functions netlify` = 0 dan API store hanya punya
`list/one/all/insert/insertAbsent/patch` — tidak ada jalur aplikasi yang menghapus baris sama sekali. Sejak
`d77a555` ada metode ketujuh, `remove`, dan pembangun SQL-nya menolak `delete` tanpa filter
(`functions/pg-store.mjs:85-91`); karena itu tidak ada baris yatim yang bisa membuat `ADD CONSTRAINT` gagal
di database yang isinya hanya ditulis aplikasi. Kalau database Anda pernah diisi manual, jalankan dulu
pemeriksaan yatim per kolom sebelum menerapkan 0010.

## Konsekuensi gabungan yang belum diputuskan pemilik: "Hapus akun"

Dua fakta yang berdiri sendiri tampak biasa; digabung, mereka menutup satu jalur produk.

1. Store punya jalur hapus sejak `d77a555`, tapi hanya satu call site di seluruh backend:
   `store.remove('sessions', …)` di `functions/src/identity.mjs:111` (logout) —
   `grep -rn "store.remove(" functions/src` = 1. Tidak ada satu pun kode yang menghapus baris `users`.
2. 13 FK menunjuk `app.users`; 12 di antaranya ber-aksi NO ACTION dan hanya `flags.resolved_by` yang
   SET NULL — terukur dari `pg_constraint` di Neon produksi 2026-11-14.

Akibatnya **baris pengguna tidak bisa dihapus selama ia punya anak** (sesi, attempts, downloads, entries,
`flags.reporter_id`, playground_runs, posts, progress, threads, user_state, votes, xp_events), dan tidak ada
rute yang mencoba: `grep -cniE "hapus.?akun|delete.?account|account.*delet" functions/src/application.mjs` = 0.
Yang berjanji justru halaman kebijakan privasi — `src/pages/privacy.tsx:82` dan `:222` menulis permintaan
penghapusan akun disampaikan kepada pengelola, dengan pengakuan sendiri di `:82` bahwa "portal ini belum
menyediakan tombol hapus diri" (`grep -c "hapus diri" src/pages/privacy.tsx` = 1). Jadi janji itu hari ini
hanya bisa ditepati lewat DELETE manual ber-urutan di database. Retensi + urutan penghapusan mana yang
ikut hilang adalah keputusan produk/privasi pemilik, dan itu DDL tidak saya sentuh.

## Lab koding di skema

Latihan di `/koding` sekarang punya jejak server: `app.playground_runs` (`0009_playground.sql`) menyimpan
satu baris per pengguna per latihan (`UNIQUE (user_id, task_key)`) dengan `attempts` yang naik setiap kali
latihan yang sama diselesaikan lagi, dan `XP` kinds `code_pass` (`functions/src/xp.mjs`) memberi 40 XP
sekali per latihan lewat `insertAbsent('xp_events', ..., 'user_id,kind,ref_id')`. Tulisnya dari
`components/playground.tsx` hanya saat lulus, dan lewat `lib/progress-queue.ts` saat perangkat luring.
Yang tetap di perangkat: draf editor di `localStorage` (`lib/playground/draft.ts:18-19`, kunci
`ev_playground_draf`) dan daftar 8 latihan keras-koding di `lib/playground/tasks.ts` — kecocokan daftar
itu dengan `TASK_KEYS` di server dijaga `dev/function.test.mjs`.
