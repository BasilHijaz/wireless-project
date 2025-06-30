import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: "7110",
    proxy: {
      '/api': {
        target: 'http://176.119.254.185:7111',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})