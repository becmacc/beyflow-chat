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
  
  const colorModeStyles = {
    neutral: { bg: 'rgba(76, 195, 217, 0.15)', border: 'rgba(76, 195, 217, 0.5)' },
    positive: { bg: 'rgba(46, 204, 113, 0.15)', border: 'rgba(46, 204, 113, 0.5)' },
    warning: { bg: 'rgba(243, 156, 18, 0.15)', border: 'rgba(243, 156, 18, 0.5)' },
    danger: { bg: 'rgba(231, 76, 60, 0.15)', border: 'rgba(231, 76, 60, 0.5)' }
  }
  
  const currentStyle = colorModeStyles[colorMode] || colorModeStyles.neutral
  
  const handleColorChange = (modeId) => {
    console.log('🎨 Color Mode Changed:', modeId)
    setColorMode(modeId)
  }
  
  return (
    <motion.div 
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      animate={{
        boxShadow: `0 0 30px ${currentStyle.border}`
      }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex gap-2 p-2 ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''} shadow-2xl`}
        style={{
          background: currentStyle.bg,
          border: `2px solid ${currentStyle.border}`
        }}
      >
        {colorModes.map(mode => (
          <motion.button
            key={mode.id}
            onClick={() => handleColorChange(mode.id)}
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
    </motion.div>
  )
}
