import { useState } from 'react'
import { motion } from 'framer-motion'
import { Minimize2, Maximize2 } from 'lucide-react'
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
  const [isMinimized, setIsMinimized] = useState(false)
  
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
      {/* Subtle color flash - Less aggressive */}
      <motion.div
        key={`overlay-${colorMode}`}
        className="fixed inset-0 pointer-events-none z-[20]"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ background: currentStyle.overlay }}
      />
      
      <motion.div 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
        animate={{
          width: isMinimized ? '40px' : 'auto',
          boxShadow: isMinimized ? `0 0 10px ${currentStyle.border}` : `0 0 18px ${currentStyle.border}`
        }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex gap-0.5 p-1 ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''} shadow-2xl`}
          style={{
            background: currentStyle.bg,
            border: `2px solid ${currentStyle.border}`
          }}
        >
        {!isMinimized ? (
          <>
            {colorModes.map(mode => (
              <motion.button
                key={mode.id}
                onClick={() => handleColorChange(mode.id)}
                title={`Switch to ${mode.name} mode`}
                className={`px-1.5 py-1 ${theme.rounded} flex items-center gap-1 transition-all min-w-[36px] min-h-[36px] border-2 text-xs ${
                  colorMode === mode.id 
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-[0_0_12px_rgba(0,255,255,0.4)] border-white font-bold` 
                    : theme.id === 'terminal' 
                      ? 'bg-black/70 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30 hover:border-cyan-400' 
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/40'
                }
                focus:outline-none focus:ring-2 focus:ring-cyan-400
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={colorMode === mode.id}
                aria-label={`${mode.name} mode`}
              >
                <span className="text-xs">{mode.emoji}</span>
                {colorMode === mode.id && <span className={`${theme.font} text-[10px] hidden sm:inline`}>{mode.name}</span>}
              </motion.button>
            ))}
            <motion.button
              onClick={() => setIsMinimized(true)}
              className={`px-1.5 py-1 ${theme.rounded} border-2 min-w-[36px] min-h-[36px] ${
                theme.id === 'terminal'
                  ? 'bg-black/70 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Minimize"
            >
              <Minimize2 size={12} />
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={() => setIsMinimized(false)}
            className={`w-full px-1.5 py-1.5 ${theme.rounded} border-2 flex items-center justify-center ${
              theme.id === 'terminal'
                ? 'bg-black/70 text-cyan-400 hover:bg-cyan-500/20 border-cyan-500/30'
                : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Expand Color Modes"
          >
            <span className="text-sm">{colorModes.find(m => m.id === colorMode)?.emoji}</span>
          </motion.button>
        )}
        </div>
      </motion.div>
    </>
  )
}
