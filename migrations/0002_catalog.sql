CREATE TABLE app.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  level text NOT NULL,
  order_no integer NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES app.courses (id),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  minutes integer NOT NULL,
  offline_ok boolean NOT NULL,
  order_no integer NOT NULL,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX modules_course_id_idx ON app.modules (course_id);
CREATE TABLE app.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES app.modules (id),
  title text NOT NULL,
  body jsonb NOT NULL,
  minutes integer NOT NULL,
  order_no integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lessons_module_order_idx ON app.lessons (module_id, order_no);
