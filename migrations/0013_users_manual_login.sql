ALTER TABLE app.users ADD COLUMN username text NOT NULL DEFAULT '';
ALTER TABLE app.users ADD COLUMN password_hash text NOT NULL DEFAULT '';
