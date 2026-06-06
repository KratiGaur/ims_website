import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        quality: 80
      },
      jpeg: {
        quality: 80
      },
      jpg: {
        quality: 80
      },
      webp: {
        quality: 80
      }
    })
  ],
  server: {
    allowedHosts: true,
    host: true,
    proxy: {
      '/api/admin': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: (path) => `/yroc13-website${path}`
      },
      '/dify-api': {
        target: 'https://api.dify.ai',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/dify-api/, '')
      }
    }
  }
});
