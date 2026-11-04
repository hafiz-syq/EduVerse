CREATE TABLE app.progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app.users (id),
  lesson_id uuid NOT NULL REFERENCES app.lessons (id),
  done boolean NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (user_id, lesson_id)
);
CREATE TABLE app.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app.users (id),
  module_id uuid NOT NULL REFERENCES app.modules (id),
  pack_hash text NOT NULL,
  bytes bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX downloads_user_created_idx ON app.downloads (user_id, created_at);
