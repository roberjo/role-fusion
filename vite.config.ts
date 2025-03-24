import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { resolve } from 'path';
import fs from 'fs/promises';
import tsconfigPaths from 'vite-tsconfig-paths';
import { readFileSync, writeFileSync } from 'fs';

// Function to update README with coverage stats
function processCoverageResults() {
  try {
    const coverageData = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf-8'));
    const stats = {
      statements: coverageData.total.statements.pct,
      branches: coverageData.total.branches.pct,
      functions: coverageData.total.functions.pct,
      lines: coverageData.total.lines.pct,
    };

    const readmeContent = readFileSync('README.md', 'utf-8');
    const coverageSection = `## Coverage

| Category    | Coverage |
|------------|----------|
| Statements | ${stats.statements}%     |
| Branches   | ${stats.branches}%     |
| Functions  | ${stats.functions}%     |
| Lines      | ${stats.lines}%     |`;

    const newContent = readmeContent.replace(
      /## Coverage[\s\S]*?(?=##|$)/,
      `${coverageSection}\n\n`
    );

    writeFileSync('README.md', newContent, 'utf-8');
  } catch (error) {
    console.error('Failed to update README with coverage stats:', error);
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self' data:;
        connect-src 'self' ${process.env.VITE_API_URL || ''};
      `.replace(/\s+/g, ' ').trim(),
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    tsconfigPaths(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
      ],
    },
    alias: {
      '@': resolve(__dirname, './src'),
    },
    onFinished: processCoverageResults,
  },
}));
