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
        name: "IELTSify — AI IELTS Preparation",
        short_name: "IELTSify",
        description:
          "AI-powered IELTS preparation: practice Reading, Listening, Writing and Speaking with instant band scoring and a personalized study plan.",
        lang: "en",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0b1d3a",
        theme_color: "#0b1d3a",
        categories: ["education", "productivity"],
        icons: [
          {
            src: "logohead.png",
            sizes: "501x498",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "logohead.png",
            sizes: "501x498",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        // Kam o'zgaradigan vendor kutubxonalarni alohida chunklarga
        // ajratamiz — brauzer keshi yaxshiroq ishlaydi.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-antd": ["antd", "@ant-design/icons"],
          "vendor-motion": ["framer-motion"],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/media": {
        target: "https://api.ieltsfy.uz",
        changeOrigin: true,
      },
    },
  },
});
