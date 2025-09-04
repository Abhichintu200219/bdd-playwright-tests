import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import istanbul from 'vite-plugin-istanbul'

export default defineConfig({
  plugins: [react(), tailwindcss(), istanbul({
    include: 'src/**/*',
    extension: ['.js', '.ts', '.tsx'],
    requireEnv: false,
  })],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage/unit',
      all: true,
      include: ['src/**/*.{ts,tsx}']
    }
  },
}as any)