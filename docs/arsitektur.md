# EduVerse — Diagram arsitektur & alur

Dipetakan dari tree saat ini (commit `e2675df` + pekerjaan belum ter-commit di `/koding`).

## 1. Komponen

```mermaid
flowchart LR
  subgraph Browser [Pelajar — satu origin]
    SPA["SPA React 19 + Vite<br/>src/App.tsx (router manual)"]
    Chunk["chunk lazy /koding<br/>CodeMirror 6 + animejs v4.5"]
    SW["public/sw.js<br/>cache luring + antrean tulis"]
    IDB[("IndexedDB<br/>store 'paket' (keyPath slug)")]
    LS[("localStorage<br/>ev_playground_draf / _semai")]
    WORKER["Web Worker<br/>mode Algoritma (JS)"]
    IFRAME["iframe sandbox=allow-scripts<br/>mode Halaman web, TANPA allow-same-origin"]
  end

  subgraph Edge [Hosting statis + Function]
    ENTRY_N["netlify/functions/api.mjs<br/>(entry Netlify, esbuild, pg eksternal)"]
    ENTRY_Q["functions/index.ts<br/>(entry Qoder Sites, Dicek `deno check`)"]
    CORE["functions/src/*.mjs<br/>application · identity · oauth · content<br/>quiz · arena · social · xp · ads · seed · core"]
    STORE_N["netlify/pg-store.mjs<br/>pg.Pool → Postgres"]
    STORE_Q["AppHub store<br/>DDL subset"]
  end

  DB[("Postgres eksternal (Neon)<br/>schema app.* — 23 tabel")]
  OAuth["Google / GitHub OAuth"]

  SPA -->|lazy route| Chunk
  SPA <--> SW
  SW --> IDB
  Chunk --> WORKER
  Chunk --> IFRAME
  SPA -->|"fetch /functions/v1/app/api/*<br/>(lib/api.ts:1)"| ENTRY_N
  SPA -.->|"jalur sama saat Qoder Sites"| ENTRY_Q
  ENTRY_N --> CORE --> STORE_N --> DB
  ENTRY_Q --> CORE --> STORE_Q --> DB
  CORE <--> OAuth
```

Kedua entry berbagi satu `functions/src/*` — jalur URL `/functions/v1/app/*` dijaga identik
supaya frontend, service worker, dan aturan asal permintaan tidak perlu cabang per host.

## 2. Sandbox playground (dua mode)

```mermaid
sequenceDiagram
  actor P as Pelajar
  participant PG as components/playground.tsx
  participant R as lib/playground/runner.ts
  participant X as Realm sandbox (Worker / iframe)
  participant T as lib/playground/tasks.ts

  P->>PG: pilih latihan + tekan Jalankan
  PG->>T: cariTugas(id) → cek[], klik
  PG->>R: buildPayload(project, cek, klik)
  Note over R: amanJSON() = JSON.stringify, "<" di-escape jadi \u003c<br/>(payload tak bisa lolos dari tag script)
  alt mode "js" (Algoritma)
    R->>X: Blob worker = SHIM + __ev_jalankan(payload)
    Note over X: tanpa DOM · fetch/XHR/WebSocket ditolak · watchdog 5 dtk → terminate
  else mode "web" (Halaman web)
    R->>X: iframe.srcdoc = bangunDokumenWeb(project, payload)
    Note over X: asal opaque → tak bisa baca DOM induk / cookie EduVerse
  end
  X-->>PG: postMessage {source:"eduverse-sandbox", run, kind: out|check|fail|done}
  PG->>PG: tafsirkanBerita → konsol · tafsirkanCek → hasil penilaian
  PG->>T: nilaiOutput() / nilaiCekWeb()
  PG->>P: lulus/gagal + animasi animejs (denyut, getar, percik, hitungNaik)
  PG->>PG: simpanDraf() debounce 500 ms → localStorage
```

## 3. Alur tulis luring (tetap konsisten saat offline)

```mermaid
flowchart LR
  A["Aksi tulis (progress, jawaban kuis)"] --> B{"online?"}
  B -->|ya| C["POST /api/* → Function → Postgres"]
  B -->|tidak| D["antre di progress-queue.ts + IndexedDB"]
  C -->|gagal 5xx / koneksi| D
  D --> E["backonline / swipe → kirim ulang (retry)"]
  E --> C
  C --> F["xp.award(user, kind, ref_id) idempoten<br/>UNIQUE(user_id,kind,ref_id) di app.xp_events"]
  F --> G["bump() CAS via user_state.version<br/>retry ≤ 4×, tanpa transaksi"]
```

## 4. Gerbang verifikasi yang ada di repo

| Perintah | Isi | Status terverifikasi (2026-11-05) |
|---|---|---|
| `npm run test:function` | `dev/*.test.mjs` — 74 tes: Function, pg-store, entry Netlify + Vercel, playground, draf, skema, penjaga rute | lulus 74 / gagal 0 (terukur 2026-11-09) |
| `npm run build` | `tsc --noEmit` + `scripts/build.mjs` | hijau, `dist/assets/koding-DhGcim_f.js` 27,31 kB · CSS 164,26 kB (terukur 2026-11-09) |
| `npm run check:function` | `deno check functions/index.ts` | butuh Deno |
| penjaga skema | `dev/schema.test.mjs` — migrasi masuk subset DDL AppHub, tak ada tabel yatim, kolom Function ada di skema | lulus |

## 5. Keputusan per lingkungan host (bukan bug — jangan "diperbaiki" dengan menambah variabel)

| Host | Variabel Function | Konsekuensi yang SAH | Penjaga |
|---|---|---|---|
| Vercel Production | `DATABASE_URL` + `APP_SESSION_SECRET` + `APP_ALLOWED_ORIGINS` terisi | `/api/health` 200, `/api/catalog` 401 `login_required` untuk anonim, rute tak dikenal 404 `not_found` | `dev/vercel-entry.test.mjs` |
| Vercel Preview | **sengaja tanpa `DATABASE_URL`** (keputusan pemilik 2026-11-09) | `api/index.mjs:22` melempar saat impor → `FUNCTION_INVOCATION_FAILED` (500) untuk SEMUA `/api/*`, termasuk `/api/health`. Artinya: **login OAuth di Preview tidak akan pernah selesai** dan halaman yang butuh katalog akan gagal. 500 di Preview BUKAN regresi. | test `Preview tanpa DATABASE_URL gagal cepat di impor, dan itu keputusan — bukan regresi` (menjalakan `import('./api/index.mjs')` dengan env tanpa `DATABASE_URL` dan menuntut galat) |
| Netlify (Production + Preview) | tidak terverifikasi dari agen — situs memakai Team protection: `/`, `/api/health`, `/functions/v1/app/api/health` semuanya 401 · `server=Netlify` (terukur 2026-11-09) | Di SUMBER, prefiks `/functions/v1/app/*` hanya dipasang di `netlify/functions/api.mjs` (`config.path`). Apakah host-nya masih melayani kedua prefiks BELUM terbukti: butuh akun anggota tim yang masuk ke dashboard. | `dev/route-sync.test.mjs` (sumber saja) |

Tiga batas yang sering salah dibaca:

1. **Prefiks warisan hanya terpasang di Netlify.** Vercel mengambil rute dari nama berkas
   (`api/index.mjs` → `/api`) dan `vercel.json` tidak punya rewrite untuk `/functions/v1/*`,
   jadi di `eduverselearn.vercel.app` path itu 404 halaman `NOT_FOUND` platform (terukur
   404 · 79 B · 2026-11-09). Router inti tetap mengenal prefiksnya, jadi test titik masuk
   yang memakai prefiks itu membuktikan `applicationPath`, bukan dua host.
2. **Vercel terhubung ke Git dan `git push` yang menaikkan produksi.** Terukur 2026-11-09:
   push `bd7b67c..0e46589` membuat deployment production 18 detik lalu tanpa `vercel deploy`
   (alias `eduverse-git-main-…` ada, sha push membawa status GitHub `context=Vercel
   state=success`), dan `eduverselearn.vercel.app` kini menyajikan `index-CdlodoQH.css`
   = sama byte-nya dengan build lokal. Jangan simpulkan "tidak terhubung ke Git" dari
   `vercel inspect`: CLI 65.12.1 tidak mencetak baris repository di blok General.
3. **Build yang pernah diunggah lewat CLI meninggalkan artefak CSS.** Deployment lama
   (`index-3-DTADYc.css`, 173,269 B) adalah superset ketat dari build git (`164,265 B`):
   90 aturan ekstra, 0 aturan hanya-lokal, dan 70 di antaranya nama kelas yang ditulis apa
   adanya di `node_modules/tailwind-merge/dist/bundle-mjs.mjs` — Tailwind v4 ikut menscan
   node_modules di lingkungan build itu. Build dari Git sudah tidak mengulanginya.
