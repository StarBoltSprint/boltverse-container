import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base "./" so the app works on any host path (localhost, *.grok.me, subpaths).
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
