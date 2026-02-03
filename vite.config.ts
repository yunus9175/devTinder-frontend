import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Dev-only: proxy /api to backend to avoid CORS. In production, no proxy;
  // set VITE_API_URL to your API origin (e.g. https://api.yourdomain.com).
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  // Production: use env in build. Example for a separate API host:
  // VITE_API_URL=https://api.yourdomain.com npm run build
  // Then the built app will call that origin; ensure the API allows that origin in CORS.
})
