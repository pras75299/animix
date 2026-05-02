import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./react/__tests__/setup.ts'],
    include: ['react/__tests__/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    css: false,
  },
});
