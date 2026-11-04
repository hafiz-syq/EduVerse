CREATE TABLE app.xp_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app.users (id),
  kind text NOT NULL,
  amount integer NOT NULL,
  ref_id text NOT NULL,
  meta jsonb NOT NULL,
  occurred_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, ref_id)
);
CREATE INDEX xp_events_user_occurred_idx ON app.xp_events (user_id, occurred_at);
