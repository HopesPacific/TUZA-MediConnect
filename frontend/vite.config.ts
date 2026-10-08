import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows imports like: import Button from '@/components/common/Button'
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Proxy API requests to Laravel during development.
    // This means /api/... in the frontend hits http://localhost:8000/api/...
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/sanctum': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
