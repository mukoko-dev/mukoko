// vite.config.js - Updated to suppress SES warnings
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API calls to worker
      '/api': {
        target: 'https://app.mukoko.com',
        changeOrigin: true,
        secure: true,
      },
      // Proxy worker assets
      '/worker': {
        target: 'https://app.mukoko.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    // Ensure environment variables are available
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // Define Supabase variables for production builds
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.VITE_SUPABASE_URL || 'https://huilmzajhiqcuzonbaps.supabase.co'
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aWxtemFqaGlxY3V6b25iYXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzAyMjIsImV4cCI6MjA3MDc0NjIyMn0.G5C9Swbb1tXEjyhkI98PlQxZ_2OUXI1vD0Eh8Q81KZU'
    ),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@heroicons/react', 'lucide-react'],
        },
      },
    },
  },
})