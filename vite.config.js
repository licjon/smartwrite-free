import { defineConfig } from 'vite'

export default defineConfig({
  base: '/smartwrite-free/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  }
}) 