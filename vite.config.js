import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps for both JavaScript and CSS
    // You can also customize source map options:
    // sourcemap: { // Alternatively, you can use an object for more control
    //   includeSources: true,
    //   // Other source map options...
    // },
  },
});
