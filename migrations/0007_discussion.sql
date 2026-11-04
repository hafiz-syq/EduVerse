CREATE TABLE app.threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES app.modules (id),
  user_id uuid NOT NULL REFERENCES app.users (id),
  title text NOT NULL,
  body text NOT NULL,
  answer_count integer NOT NULL DEFAULT 0,
  accepted_post_id uuid,
  pinned boolean NOT NULL DEFAULT false,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_activity_at timestamptz NOT NULL
);
CREATE INDEX threads_module_activity_idx ON app.threads (module_id, last_activity_at);
CREATE TABLE app.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES app.threads (id),
  user_id uuid NOT NULL REFERENCES app.users (id),
  body text NOT NULL,
  accepted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX posts_thread_created_idx ON app.posts (thread_id, created_at);
CREATE TABLE app.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES app.threads (id),
  post_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES app.users (id),
  value integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, post_id, user_id)
);
CREATE TABLE app.flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_kind text NOT NULL,
  target_id text NOT NULL,
  reporter_id uuid NOT NULL REFERENCES app.users (id),
  reason text NOT NULL,
  status text NOT NULL,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX flags_status_created_idx ON app.flags (status, created_at);
