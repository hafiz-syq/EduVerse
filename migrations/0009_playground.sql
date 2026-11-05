-- Lab koding: satu baris per (pengguna, latihan). Tabel ini adalah catatan hasil,
-- bukan draf kode — draf tetap di localStorage perangkat (lib/playground/draft.ts).
-- attempts dihitung ulang setiap kali latihan dikirim selesai, jadi pengulangan
-- solusi yang sah tetap terlihat tanpa menambah XP (xp_events idempoten per user+kind+ref).
CREATE TABLE app.playground_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app.users (id),
  task_key text NOT NULL,
  mode text NOT NULL,
  passed boolean NOT NULL,
  duration_ms bigint,
  attempts integer NOT NULL DEFAULT 1,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_key)
);
CREATE INDEX playground_runs_user_occurred_idx ON app.playground_runs (user_id, occurred_at);
