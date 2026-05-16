import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [ react(), tailwindcss() ],
  server: {
    port: 5173, // Порт самого фронтенда
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены на .NET бэкенд
      '/api': {
        target: 'http://localhost:5287',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
