import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginFile: false
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    visualizer({
      open: false,
      filename: './dist/stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['framer-motion', 'zustand', 'lucide-react'],
          'animation': ['./src/components/DopamineUI.jsx', './src/components/BrandAssets.jsx']
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const extType = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2/.test(extType)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.debug']
      }
    },
    sourcemap: false,
    reportCompressedSize: true
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true
  },
  preview: {
    host: '0.0.0.0',
    port: 5000
  },
  define: {
    'import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL': JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_BASE_URL),
    'import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY': JSON.stringify(process.env.AI_INTEGRATIONS_OPENAI_API_KEY)
  }
})
