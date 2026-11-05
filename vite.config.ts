import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxy = { "/functions/v1/app": "http://127.0.0.1:8000" };

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
            // Editor dan animasi hanya dipakai rute /koding (lib/motion.ts +
            // components/code-editor.tsx). Ditaruh di chunk sendiri supaya tidak ada
            // satu berkas >500 kB: browser menarik ketiganya paralel, dan revisi kode
            // aplikasi tidak membatalkan cache pustaka yang jarang berubah.
            { name: "codemirror", test: /node_modules[\\/](@codemirror|@lezer|@marijn)[\\/]/ },
            { name: "anime", test: /node_modules[\\/]animejs/ },
          ],
        },
      },
    },
  },
});
