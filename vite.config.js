import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
      '/user': 'http://localhost:3001',
      '/achievement': 'http://localhost:3002',
      '/api/v1/missions': 'http://localhost:3003',
      '/api/v1/admin': 'http://localhost:3003',
      '/api/v1/inventory': 'http://localhost:3004',
      '/api/v1/market': 'http://localhost:3004',
      '/api/v1/growth-diary': 'http://localhost:3005',
      '/api/v1/community': 'http://localhost:3006',
    }
  }
})
