
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures process.env.API_KEY is available for the @google/genai SDK
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
