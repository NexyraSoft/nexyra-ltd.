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
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
            'ui-vendor': ['@base-ui/react', 'motion', 'clsx', 'tailwind-merge'],
            'icons': ['lucide-react'],
            
            // Feature chunks
            'admin': [
              './src/pages/admin/AdminDashboard.tsx',
              './src/pages/admin/AdminLogin.tsx',
              './src/lib/admin.ts',
            ],
            'components-sections': [
              './src/components/sections/About.tsx',
              './src/components/sections/Services.tsx',
              './src/components/sections/Contact.tsx',
              './src/components/sections/Careers.tsx',
              './src/components/sections/Tools.tsx',
              './src/components/sections/Privacy.tsx',
              './src/components/sections/Terms.tsx',
              './src/components/sections/Process.tsx',
              './src/components/sections/ServiceDetail.tsx',
            ],
            'ui-components': [
              './src/components/ui/Background3D.tsx',
              './src/components/ui/Chatbot.tsx',
              './src/components/ui/GetStartedModal.tsx',
              './src/components/ui/Preloader.tsx',
            ],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
