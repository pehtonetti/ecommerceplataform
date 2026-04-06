import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react() as any],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'vitest.setup.ts',
        'next.config.ts',
        'tailwind.config.js',
        'postcss.config.js',
        'src/components/ui/**', 
      ],
    },
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
