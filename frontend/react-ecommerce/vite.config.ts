import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base configuration
    base: '/',
    
    // Resolve aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@config': path.resolve(__dirname, './src/config')
      }
    },
    
    // Plugins
    plugins: [
      // React plugin with SWC for fast compilation
      react(),
      
      // Bundle visualizer
      visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true
      }),
      
      // Progressive Web App support
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'E-Commerce App',
          short_name: 'ECommerceApp',
          description: 'Modern E-Commerce Application',
          theme_color: '#1976d2',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: mode === 'production',
      
      // Chunk and asset size warnings
      chunkSizeWarningLimit: 500,
      
      // Rollup options
      rollupOptions: {
        output: {
          // Separate vendor and app code
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          
          // Naming for chunks
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    
    // Development server
    server: {
      port: 3000,
      open: true,
      proxy: {
        // API proxy configuration
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // Preview configuration
    preview: {
      port: 4000
    },
    
    // CSS configuration
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "./src/styles/variables.scss";
            @import "./src/styles/mixins.scss";
          `
        }
      }
    }
  };
});
