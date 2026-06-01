import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 브라우저에서 /api로 시작하는 요청을 감지하면
      '/api': {
        target: 'http://localhost:3001', // 실제 로컬 백엔드 주소와 포트로 설정
        changeOrigin: true,
        secure: false,
	cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/'
      }
    }
  }
})
