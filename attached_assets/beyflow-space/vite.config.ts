
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true,
    allowedHosts: [
      '017bf155-5bfa-498d-98d0-7bcf51469cb5-00-gww9m14gnkqc.worf.replit.dev'
    ]
  }
})
