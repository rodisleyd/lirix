import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'logo-app.png'],
        manifest: {
          name: 'Lirix AI - Digital Lyricist',
          short_name: 'Lirix',
          description: 'Componha letras de música profissionais com IA',
          theme_color: '#ff4e00',
          background_color: '#0a0502',
          display: 'standalone',
          icons: [
            {
              src: 'logo-app.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'logo-app.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'process.env.APP_URL': JSON.stringify(env.APP_URL || 'http://localhost:3000'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
