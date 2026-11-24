CREATE INDEX threads_user_created_idx ON app.threads (user_id, created_at);
CREATE INDEX posts_user_created_idx ON app.posts (user_id, created_at);
CREATE INDEX attempts_user_tournament_started_idx ON app.attempts (user_id, tournament_id, started_at);
