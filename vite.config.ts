import { sentryVitePlugin } from "@sentry/vite-plugin";
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "axonmassgmailcom",
    project: "javascript"
  })],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },

  build: {
    sourcemap: true
  }
});