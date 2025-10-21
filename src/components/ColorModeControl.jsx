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
    neutral: { bg: 'rgba(76, 195, 217, 0.3)', border: 'rgba(76, 195, 217, 0.8)', overlay: 'rgba(76, 195, 217, 0.15)' },
    positive: { bg: 'rgba(46, 204, 113, 0.3)', border: 'rgba(46, 204, 113, 0.8)', overlay: 'rgba(46, 204, 113, 0.15)' },
    warning: { bg: 'rgba(243, 156, 18, 0.3)', border: 'rgba(243, 156, 18, 0.8)', overlay: 'rgba(243, 156, 18, 0.15)' },
    danger: { bg: 'rgba(231, 76, 60, 0.3)', border: 'rgba(231, 76, 60, 0.8)', overlay: 'rgba(231, 76, 60, 0.15)' }
  }
  
  const currentStyle = colorModeStyles[colorMode] || colorModeStyles.neutral
  
  const handleColorChange = (modeId) => {
    console.log('🎨 Color Mode Changed:', modeId)
    setColorMode(modeId)
  }
  
  return (
    <>
      {/* FULL SCREEN COLOR FLASH - Makes changes OBVIOUS */}
      <motion.div
        key={`overlay-${colorMode}`}
        className="fixed inset-0 pointer-events-none z-40"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ background: currentStyle.overlay }}
      />
      
      <motion.div 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        animate={{
          boxShadow: `0 0 40px ${currentStyle.border}, 0 0 80px ${currentStyle.border}`
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex gap-2 p-2 ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''} shadow-2xl`}
          style={{
            background: currentStyle.bg,
            border: `3px solid ${currentStyle.border}`
          }}
        >
        {colorModes.map(mode => (
          <motion.button
            key={mode.id}
            onClick={() => handleColorChange(mode.id)}
            title={`Switch to ${mode.name} mode`}
            className={`px-4 py-2.5 ${theme.rounded} flex items-center gap-2 transition-all min-w-[44px] min-h-[44px] border-2 font-bold ${
              colorMode === mode.id 
                ? `bg-gradient-to-r ${mode.color} text-white shadow-[0_0_20px_rgba(0,255,255,0.5)] border-white` 
                : theme.id === 'terminal' 
                  ? 'bg-black/70 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400' 
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/40'
            }
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
            `}
            whileHover={{ scale: 1.05, filter: "brightness(120%)" }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={colorMode === mode.id}
            aria-label={`${mode.name} mode`}
          >
            <span className="text-base">{mode.emoji}</span>
            <span className={`${theme.font} text-sm`}>{mode.name}</span>
          </motion.button>
        ))}
        </div>
      </motion.div>
    </>
  )
}
