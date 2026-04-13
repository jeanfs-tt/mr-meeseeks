import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/*.test.ts', 'sandbox/**/__tests__/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'sandbox/**/*.ts'],
      exclude: ['**/*.test.ts', '**/index.ts'],
    },
  },
});
