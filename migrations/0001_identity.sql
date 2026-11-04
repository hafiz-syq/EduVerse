CREATE TABLE app.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identity text NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL,
  picture text NOT NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.sessions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES app.users (id),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_user_id_idx ON app.sessions (user_id);
CREATE TABLE app.user_state (
  user_id uuid PRIMARY KEY REFERENCES app.users (id),
  xp integer NOT NULL DEFAULT 0,
  rank_key text NOT NULL,
  streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date text NOT NULL,
  prefs jsonb NOT NULL,
  version integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL
);
CREATE INDEX user_state_xp_idx ON app.user_state (xp);
CREATE TABLE app.ranks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rank_key text NOT NULL UNIQUE,
  title text NOT NULL,
  threshold integer NOT NULL,
  color text NOT NULL,
  order_no integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
