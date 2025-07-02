import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    historyApiFallback: {
      // This ensures all routes fallback to index.html for SPA routing
      index: '/index.html',
    },
  },
  preview: {
    port: 3000,
    historyApiFallback: {
      index: '/index.html',
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    include: ["monaco-editor"],
  },
});
