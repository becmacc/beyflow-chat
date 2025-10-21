
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        text: 'var(--text)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
      },
      borderRadius: { '3xl': '1.75rem' },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.35)' }
    },
  },
  plugins: [],
} satisfies Config
