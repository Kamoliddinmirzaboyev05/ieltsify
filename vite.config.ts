import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/media': {
        target: 'https://ieltsify.pythonanywhere.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
