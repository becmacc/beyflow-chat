import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
