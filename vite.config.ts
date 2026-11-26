import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Sépare les dépendances (rarement modifiées) du code applicatif pour un meilleur cache navigateur
        manualChunks: {
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
  preview: {
    port: 5173,
    strictPort: false,
    host: true,
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
});
