import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.js',
    globals: true,
    css: false,
    pool: 'threads',
    include: ['test/**/*.test.{js,jsx}'],
  },
})
