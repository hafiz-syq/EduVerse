import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxy = { "/api": "http://127.0.0.1:8000" };

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  server: { host: "127.0.0.1", proxy },
  preview: { host: "127.0.0.1", proxy },
  build: {
    outDir: "dist",
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // Editor hanya dipakai rute /koding (node_modules-nya sendiri). Chunk `anime`
            // berisi lib/motion.ts + animejs: ditarik statis oleh /koding, oleh halaman lain
            // hanya lewat import() di lib/motion-lazy.ts. Dijaga tetap terpisah supaya
            // tidak ada satu berkas >500 kB dan revisi kode aplikasi tidak membatalkan
            // cache pustaka yang jarang berubah.
            { name: "codemirror", test: /node_modules[\\/](@codemirror|@lezer|@marijn)[\\/]/ },
            { name: "anime", test: /node_modules[\\/]animejs/ },
          ],
        },
      },
    },
  },
});
