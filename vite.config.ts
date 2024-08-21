import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ VitePWA({
    registerType: 'prompt',
    includeAssets: ["Logo144.png", "Logo512.png", "Logo192.png"],
    workbox: {
      clientsClaim: false,
      skipWaiting: false,
    },
    manifest: {
      icons: [
        {
          src: "/frontend-MishaZhem/Logo192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "https://central-university-it-prod.github.io/frontend-MishaZhem/Logo144.png",
          sizes: "144x144",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "https://central-university-it-prod.github.io/frontend-MishaZhem/Logo512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ],
      theme_color: "#9E89F3",
      name: "HabitHub",
      short_name: "HB",
      description: "Your Personal Habit Tracker",
      display: "fullscreen",
      scope: "/frontend-MishaZhem/",
      start_url: "/frontend-MishaZhem/",
      orientation: "portrait",
    }
  })],
  base: "/frontend-MishaZhem/",
})
