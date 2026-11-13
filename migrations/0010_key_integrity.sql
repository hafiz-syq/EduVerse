-- 0010 — Sembilan referensi yang selama ini hanya relasi logika, diputuskan satu per satu:
-- 5 menjadi FK (jumlah baris `^ALTER TABLE` di bawah) dan 4 sengaja tetap tanpa FK (butir butir
-- di bagian "Sengaja TIDAK diberi FK"). KOREKSI 2026-11-14: judul lama menulis "Delapan",
-- yang sembilan itu tidak pernah menghasilkan delapan.
--
-- Tidak ada ON DELETE di 0001..0009, jadi default Postgres — NO ACTION, `confdeltype 'a'` di
-- pg_constraint, dan BUKAN RESTRICT — akan berlaku diam-diam kalau FK ditulis tanpa aksi.
-- Bedanya nyata: NO ACTION diperiksa pada akhir pernyataan dan bisa dibuat DEFERRABLE supaya
-- ditunda sampai akhir transaksi, sedangkan RESTRICT diperiksa seketika dan tidak bisa
-- ditunda. Untuk constraint yang TIDAK DEFERRABLE — semua 31 FK di skema ini, terukur
-- `condeferrable = true` = 0 — perilakunya identik, jadi yang salah di sini namanya, bukan
-- akibatnya. 26 dari 31 FK memakai default itu (lihat catatan relasi di docs/erd.md).
-- Penjaga subset DDL (dev/schema.mjs) menolak FK tanpa ON DELETE eksplisit, sehingga setiap baris di bawah membawa keputusannya sendiri:
--   RESTRICT  = sasaran tidak bisa dihapus selama masih dirujuk; pemegang akun harus
--               memindahkan rujukannya lebih dulu. Dipilih untuk data yang jadi hak pengguna.
--   SET NULL  = rujukan dilepas, baris penunjuk tetap utuh; kolom wajib nullable.
--   CASCADE   = baris anak ikut terhapus bersama induknya; hanya untuk data yang tidak
--               punya makna tanpa induknya.
--
-- Sengaja TIDAK diberi FK (keempatnya tidak bisa diekspresikan sebagai FK tunggal):
--   flags.target_kind + target_id -> polimorfik (thread|post) dalam satu kolom text;
--     Postgres tidak bisa menunjuk dua tabel. Penjagaan ada di Function diskusi.
--   votes.post_id -> diisi id thread UNTUK Pertanyaan (functions/src/social.mjs:91,102
--     memperlakukan thread.id sebagai post_id yang sah) atau id post untuk jawaban.
--     FK ke app.posts akan menolak 23503 setiap suara pada pertanyaan, jadi kolom ini
--     tetap relasi logika dan dijaga lookup 'posts ... WHERE id = post_id AND thread_id'.
--   ad_events.user_id -> text (bukan uuid) dan kejadian iklan harus tetap terhitung
--     setelah akun dihapus; ini catatan penagihan ke sponsor, bukan data pengguna.
--   tournaments.bank_ids -> array jsonb; FK tidak bisa menjangkau elemen array.
--     Validasi id bank ada di Function arena.

ALTER TABLE app.user_state ADD CONSTRAINT user_state_rank_key_fkey FOREIGN KEY (rank_key) REFERENCES app.ranks (rank_key) ON DELETE RESTRICT;

ALTER TABLE app.entries ADD CONSTRAINT entries_rank_key_fkey FOREIGN KEY (rank_key) REFERENCES app.ranks (rank_key) ON DELETE RESTRICT;

ALTER TABLE app.threads ADD CONSTRAINT threads_accepted_post_id_fkey FOREIGN KEY (accepted_post_id) REFERENCES app.posts (id) ON DELETE SET NULL;

ALTER TABLE app.flags ADD CONSTRAINT flags_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES app.users (id) ON DELETE SET NULL;

ALTER TABLE app.ad_events ADD CONSTRAINT ad_events_slot_key_fkey FOREIGN KEY (slot_key) REFERENCES app.ad_slots (slot_key) ON DELETE RESTRICT;
