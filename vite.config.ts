/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [
    react()
  ],
  test: {
    setupFiles: ['./vitest.setup.ts'],
    environment: 'jsdom'
  }
})
