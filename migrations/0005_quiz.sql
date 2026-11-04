CREATE TABLE app.banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES app.modules (id),
  title text NOT NULL,
  time_limit_seconds integer NOT NULL,
  pass_score integer NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX banks_module_id_idx ON app.banks (module_id);
CREATE TABLE app.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_id uuid NOT NULL REFERENCES app.banks (id),
  prompt text NOT NULL,
  options jsonb NOT NULL,
  answer integer NOT NULL,
  explanation text NOT NULL,
  order_no integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX questions_bank_order_idx ON app.questions (bank_id, order_no);
CREATE TABLE app.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app.users (id),
  bank_id uuid NOT NULL REFERENCES app.banks (id),
  tournament_id uuid REFERENCES app.tournaments (id),
  attempt_no integer NOT NULL,
  status text NOT NULL,
  score integer NOT NULL,
  correct integer NOT NULL,
  total integer NOT NULL,
  offline boolean NOT NULL,
  snapshot jsonb NOT NULL,
  started_at timestamptz NOT NULL,
  deadline_at timestamptz NOT NULL,
  finished_at timestamptz,
  duration_ms bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, bank_id, attempt_no)
);
CREATE INDEX attempts_user_started_idx ON app.attempts (user_id, started_at);
CREATE INDEX attempts_tournament_id_idx ON app.attempts (tournament_id);
CREATE TABLE app.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES app.attempts (id),
  question_id uuid NOT NULL REFERENCES app.questions (id),
  chosen integer NOT NULL,
  answered_at timestamptz NOT NULL,
  UNIQUE (attempt_id, question_id)
);
