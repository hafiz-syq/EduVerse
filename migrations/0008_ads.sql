CREATE TABLE app.ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL UNIQUE,
  kind text NOT NULL,
  title text NOT NULL,
  sponsor text NOT NULL,
  image_path text NOT NULL,
  target_url text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  priority integer NOT NULL DEFAULT 1,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_key text NOT NULL,
  kind text NOT NULL,
  day text NOT NULL,
  user_id text NOT NULL,
  occurred_at timestamptz NOT NULL
);
CREATE INDEX ad_events_day_idx ON app.ad_events (day);
CREATE TABLE app.limiter (
  key text PRIMARY KEY,
  count integer NOT NULL,
  window_start timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);
