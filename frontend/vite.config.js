import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The Express backend runs on port 3000, so the browser talks to
    // Vite and Vite forwards /api/* to the backend.
    // e.g. /api/students -> http://localhost:3000/api/students
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
