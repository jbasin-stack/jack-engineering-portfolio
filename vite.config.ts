import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { adminApiPlugin } from './vite-plugin-admin-api';

export default defineConfig({
  plugins: [react(), tailwindcss(), adminApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
