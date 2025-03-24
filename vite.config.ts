import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { resolve } from 'path';
import fs from 'fs/promises';
import tsconfigPaths from 'vite-tsconfig-paths';
import { readFileSync, writeFileSync } from 'fs';
import type { ProxyOptions } from 'vite';

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

// Security configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Define proxy configuration type
const proxyConfig: Record<string, ProxyOptions> = IS_PRODUCTION ? {} : {
  '/api': {
    target: process.env.API_URL || 'http://localhost:3000',
    changeOrigin: true,
    secure: IS_PRODUCTION,
    ws: true,
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
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
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      clientPort: 5173,
    },
    proxy: proxyConfig,
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
    sourcemap: IS_PRODUCTION ? false : 'inline',
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
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    minify: IS_PRODUCTION ? 'terser' : false,
    terserOptions: IS_PRODUCTION ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } : undefined,
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

