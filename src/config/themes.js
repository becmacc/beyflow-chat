export const themes = {
  terminal: {
    id: 'terminal',
    name: 'Terminal Hacker',
    icon: '▪️',
    colors: {
      bg: 'bg-black',
      bgGradient: 'bg-black',
      text: 'text-cyan-400',
      textMuted: 'text-cyan-700/40',
      border: 'border-cyan-500/10',
      borderActive: 'border-cyan-500/40',
      accent: 'text-cyan-500',
      button: 'bg-black border border-cyan-500/30 text-cyan-500 hover:border-cyan-500',
      buttonActive: 'bg-black border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
      card: 'bg-black border border-cyan-500/10',
      input: 'bg-black/50 border-cyan-500/20 text-cyan-400',
      glow: 'shadow-[0_0_10px_rgba(0,255,255,0.2)]',
      glowActive: 'shadow-[0_0_20px_rgba(0,255,255,0.4)]'
    },
    font: 'font-tech',
    rounded: 'rounded-lg',
    effects: {
      scanlines: true,
      grid: true,
      blur: false
    }
  },
  
  glassmorphic: {
    id: 'glassmorphic',
    name: 'Glassmorphic Modern',
    icon: '◆',
    colors: {
      bg: 'bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900',
      bgGradient: 'bg-gradient-to-br from-zinc-900 via-purple-900/50 to-blue-900/50',
      text: 'text-white',
      textMuted: 'text-gray-300',
      border: 'border-white/20',
      borderActive: 'border-white/40',
      accent: 'text-indigo-400',
      button: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20',
      buttonActive: 'bg-indigo-500 backdrop-blur-xl text-white hover:bg-indigo-400',
      card: 'bg-white/10 backdrop-blur-xl border border-white/20',
      input: 'bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-gray-200',
      glow: 'shadow-2xl',
      glowActive: 'shadow-[0_0_30px_rgba(139,92,246,0.5)]'
    },
    font: 'font-sans',
    rounded: 'rounded-2xl',
    effects: {
      scanlines: false,
      grid: false,
      blur: true
    }
  }
}

export const getTheme = (themeId) => themes[themeId] || themes.terminal
