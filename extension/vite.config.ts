import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import path, { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'),
        content: resolve(__dirname, 'src/content.ts'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep content and background scripts at root level for extension
          if (chunkInfo.name === 'content' || chunkInfo.name === 'background') {
            return '[name].js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name].[ext]';
        }
      }
    },
    // Ensure content and background scripts are treated as separate entries
    lib: false,
    // Don't minify for easier debugging during development
    minify: process.env.NODE_ENV === 'production',
  },
  // Define global variables for Chrome extension APIs
  define: {
    global: 'globalThis',
  }
})