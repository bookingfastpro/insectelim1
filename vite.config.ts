import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
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
