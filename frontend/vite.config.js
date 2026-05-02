import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase warning limit temporarily
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const normalizedId = id.replace(/\\\\/g, "/");

            // Group node_modules by package families
            if (normalizedId.includes('/node_modules/')) {
              if (
                normalizedId.includes('/node_modules/react') ||
                normalizedId.includes('/node_modules/react-dom') ||
                normalizedId.includes('/node_modules/react-router-dom')
              ) {
                return 'react-vendor';
              }

              if (
                normalizedId.includes('/node_modules/three') ||
                normalizedId.includes('/node_modules/@react-three')
              ) {
                return 'three-vendor';
              }

              if (normalizedId.includes('/node_modules/lucide-react')) return 'icons';

              // UI related libraries
              if (
                normalizedId.includes('/node_modules/@base-ui') ||
                normalizedId.includes('/node_modules/class-variance-authority') ||
                normalizedId.includes('/node_modules/clsx') ||
                normalizedId.includes('/node_modules/tailwind-merge') ||
                normalizedId.includes('/node_modules/motion')
              ) {
                return 'ui-vendor';
              }

              // don't force a generic vendor fallback - let Rollup decide
              return undefined;
            }

            // Keep admin pages in a distinct chunk for the dashboard
            if (normalizedId.includes('/src/pages/admin/')) return 'admin';

            // Let Rollup decide
            return undefined;
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
