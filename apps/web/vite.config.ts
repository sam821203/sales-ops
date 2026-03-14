import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'stats.html',
          open: false,
          gzipSize: true,
        }),
      ],
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Process Redux before react-vendor to prevent react-redux from being grouped into react-vendor
          if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
            return 'redux';
          }
          if (id.includes('@clerk/clerk-react')) {
            return 'clerk';
          }
          if (id.includes('@tanstack/')) {
            return 'tanstack';
          }
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/')
          ) {
            return 'react-vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/.git/**', 'public/**'],
  },
});
