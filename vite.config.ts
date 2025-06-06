import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    base:process.env.VITE_BASE_PATH || '/umank-printing-system', // Set the base path for the application
  },
});
