import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'sandbox/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'sandbox/**/*.ts'],
      exclude: ['**/*.test.ts', '**/index.ts'],
    },
  },
});
