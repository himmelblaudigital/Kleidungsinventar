import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Leitet API-Aufrufe im Dev-Server an das lokal laufende PHP weiter.
      // Im Projekt-Root ausführen (Dokument-Root = Projekt-Root, damit /api/... passt):
      //   php -S localhost:8000
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
