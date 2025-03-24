import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { processCoverageResults } from './scripts/update-readme-stats';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/vite-env.d.ts',
      ],
    },
    reporters: [
      'default',
      {
        name: 'custom',
        onFinished: async (files, errors) => {
          try {
            const coverageJson = require('./coverage/coverage-summary.json');
            await processCoverageResults(coverageJson);
          } catch (error) {
            console.error('Failed to update README with coverage stats:', error);
          }
        },
      },
    ],
  },
}); 