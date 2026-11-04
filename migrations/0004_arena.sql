CREATE TABLE app.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  duration_seconds integer NOT NULL,
  question_count integer NOT NULL,
  bank_ids jsonb NOT NULL,
  seed text NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tournaments_starts_at_idx ON app.tournaments (starts_at);
CREATE TABLE app.entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES app.tournaments (id),
  user_id uuid NOT NULL REFERENCES app.users (id),
  best_score integer NOT NULL,
  best_duration_ms bigint NOT NULL,
  attempts integer NOT NULL,
  submitted_at timestamptz NOT NULL,
  rank_key text NOT NULL,
  display_name text NOT NULL,
  UNIQUE (tournament_id, user_id)
);
