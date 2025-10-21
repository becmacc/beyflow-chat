import { motion } from 'framer-motion'
import useStore from '../store'
import { getTheme } from '../config/themes'

const colorModes = [
  { id: 'neutral', name: 'Neutral', emoji: '⚪', color: 'from-cyan-400 to-blue-500' },
  { id: 'positive', name: 'Positive', emoji: '✅', color: 'from-green-400 to-emerald-500' },
  { id: 'warning', name: 'Warning', emoji: '⚠️', color: 'from-yellow-400 to-orange-500' },
  { id: 'danger', name: 'Danger', emoji: '🔴', color: 'from-red-400 to-rose-500' }
]

export default function ColorModeControl() {
  const { themePersona, colorMode, setColorMode } = useStore()
  const theme = getTheme(themePersona)
  
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
      <div className={`flex gap-2 p-2 ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}
        style={{
          background: theme.id === 'terminal' 
            ? 'rgba(0,0,0,0.4)' 
            : 'rgba(139,92,246,0.1)',
          border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.15)' : '1px solid rgba(255,255,255,0.15)'
        }}
      >
        {colorModes.map(mode => (
          <motion.button
            key={mode.id}
            onClick={() => setColorMode(mode.id)}
            className={`px-3 py-1.5 ${theme.rounded} flex items-center gap-2 transition-all ${
              colorMode === mode.id 
                ? `bg-gradient-to-r ${mode.color} text-white shadow-lg` 
                : theme.id === 'terminal' 
                  ? 'bg-black/50 text-cyan-400 hover:bg-cyan-500/10' 
                  : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm">{mode.emoji}</span>
            <span className={`${theme.font} text-xs font-medium`}>{mode.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
