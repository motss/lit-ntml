/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/{benchmarks,tests}/**',
      ],
      reporter: ['lcov', 'text'],
    },
  },
})
