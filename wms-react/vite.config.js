import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function copyRuntimeAssets() {
  return {
    name: 'copy-runtime-assets',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'react.ico',
        source: readFileSync(new URL('./public/react.ico', import.meta.url)),
      });
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), copyRuntimeAssets()],
  build: {
    emptyOutDir: false,
  },
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 9997,
  },
});
