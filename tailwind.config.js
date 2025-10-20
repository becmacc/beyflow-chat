/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          pink: '#FF006E',
          purple: '#8338EC',
          blue: '#3A86FF',
          green: '#06FFA5',
          yellow: '#FFBE0B',
        },
        neon: {
          cyan: '#00F0FF',
          magenta: '#FF00FF',
          green: '#39FF14',
          purple: '#BC13FE',
          blue: '#4D4DFF',
        },
        matrix: {
          green: '#00FF41',
          dark: '#0D0208',
          darker: '#000000',
        },
        primary: {
          400: '#00F0FF',
          500: '#3A86FF',
          600: '#2563eb',
        },
        accent: {
          400: '#06FFA5',
          500: '#39FF14',
          600: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Space Grotesk', 'monospace'],
        tech: ['Orbitron', 'Rajdhani', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glitch': 'glitch 1s linear infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(0,240,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00F0FF, 0 0 20px #00F0FF',
        'neon-magenta': '0 0 5px #FF00FF, 0 0 20px #FF00FF',
        'neon-green': '0 0 5px #39FF14, 0 0 20px #39FF14',
        'cyber': '0 0 30px rgba(0,240,255,0.5), inset 0 0 30px rgba(0,240,255,0.1)',
      }
    },
  },
  plugins: [],
}