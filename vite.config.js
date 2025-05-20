import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        
        // Test server
        // target: 'https://maxfort-apps-backend.onrender.com',

        target: process.env.VITE_API_URL,

        // Local Server
        // target: 'http://127.0.0.1:8000',
        
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
  }
});

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
