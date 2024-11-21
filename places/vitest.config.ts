import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    dir: './',
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    globalSetup: './src/__tests__/global-setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
})