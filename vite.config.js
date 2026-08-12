import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  // Allow AI_API_URL (public Worker URL) without the VITE_ prefix.
  // Do not put real secrets under AI_ — they would ship to the browser.
  envPrefix: ["VITE_", "AI_", "MAPBOX_"],
  server: {
    proxy: {
      "/api/ai": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
});
