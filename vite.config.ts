import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
      },
      devOptions: {
        enabled: true,
        navigateFallback: "index.html",
      },
      manifest: {
        name: "IELTSify",
        short_name: "IELTSify",
        description: "IELTS tayyorlanish platformasi",
        theme_color: "#10b981",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/media": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
