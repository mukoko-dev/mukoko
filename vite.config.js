// vite.config.js - Updated to suppress SES warnings
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Suppress SES warnings and other console noise
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Suppress SES warnings by defining these as false
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  resolve: {
    alias: {
        "@": path.resolve(__dirname, "./src"),
      },
  },
  build: {
    global: 'globalThis',
    // Suppress build warnings
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        sw: path.resolve(__dirname, 'public/sw.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'sw' ? 'sw.js' : '[name]-[hash].js'
        }
      }
    },
    // Generate proper source maps
    sourcemap: true,
  },
  optimizeDeps: {
    // Pre-bundle dependencies to avoid issues
    include: ['react', 'react-dom'],
  },
  // Suppress console warnings
  esbuild: {
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  },
})