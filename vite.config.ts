/// <reference types="vitest" />

import {defineConfig} from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({mode}) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [analog({
    vite: {
      experimental: {supportAnalogFormat: true}
    },
    nitro: {
      experimental: {database: true, websocket: true}
    }
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  server: {
    port: 9000,
    hmr: {
      //protocol: 'ws',
      //clientPort: 5555,
      port: 5555,
      path: 'vite-hmr'
      //host: 'localhost',
    }
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
