import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  // appType "spa" (the default) serves index.html for unknown paths, which is
  // what BrowserRouter needs in dev and preview. Production hosts need the
  // equivalent rewrite — see docs/deployment.md.
  server: {
    host: "0.0.0.0",
    port: 5174
  },
  preview: {
    host: "0.0.0.0",
    port: 4174
  },
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
