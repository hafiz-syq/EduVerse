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

Sebelum `0010_key_integrity.sql`, tidak ada satu pun `ON DELETE` di `0001`–`0009` (dibuktikan dengan
`grep -rn "ON DELETE" migrations/ | wc -l` = 0 saat hanya ada 9 berkas), jadi setiap FK baru berjalan
dengan RESTRICT diam-diam. Keputusan di bawah ini ditulis sadar, satu per satu; kolom "Aksi" adalah yang
sekarang ditegakkan Postgres.

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

`dev/schema.test.mjs` mengunci isi tabel ini: setiap FK harus membawa `ON DELETE` eksplisit, sasarannya
harus `UNIQUE`, `SET NULL` ditolak pada kolom `NOT NULL`, dan `votes.post_id` diawasi agar tidak diam-diam
diberi FK.

Catatan penerapan: `grep -rn "DELETE FROM" functions netlify` = 0 dan API store hanya punya
`list/one/all/insert/insertAbsent/patch` — tidak ada jalur aplikasi yang menghapus baris. Karena itu tidak
ada baris yatim yang bisa membuat `ADD CONSTRAINT` gagal di database yang isinya hanya ditulis aplikasi.
Kalau database Anda pernah diisi manual, jalankan dulu pemeriksaan yatim per kolom sebelum menerapkan 0010.

## Lab koding di skema

Latihan di `/koding` sekarang punya jejak server: `app.playground_runs` (`0009_playground.sql`) menyimpan
satu baris per pengguna per latihan (`UNIQUE (user_id, task_key)`) dengan `attempts` yang naik setiap kali
latihan yang sama diselesaikan lagi, dan `XP` kinds `code_pass` (`functions/src/xp.mjs`) memberi 40 XP
sekali per latihan lewat `insertAbsent('xp_events', ..., 'user_id,kind,ref_id')`. Tulisnya dari
`components/playground.tsx` hanya saat lulus, dan lewat `lib/progress-queue.ts` saat perangkat luring.
Yang tetap di perangkat: draf editor di `localStorage` (`lib/playground/draft.ts:18-19`, kunci
`ev_playground_draf`) dan daftar 8 latihan keras-koding di `lib/playground/tasks.ts` — kecocokan daftar
itu dengan `TASK_KEYS` di server dijaga `dev/function.test.mjs`.
