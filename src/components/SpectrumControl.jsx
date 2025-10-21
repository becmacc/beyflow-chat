import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sliders, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function SpectrumControl() {
  const { themePersona, spectrum, setSpectrum } = useStore()
  const theme = getTheme(themePersona)
  const [isMinimized, setIsMinimized] = useState(true)

  const sliders = [
    { id: 'blur', label: 'Blur', icon: '🌫️', color: 'cyan' },
    { id: 'glow', label: 'Glow', icon: '✨', color: 'purple' },
    { id: 'saturation', label: 'Color', icon: '🎨', color: 'pink' },
    { id: 'speed', label: 'Speed', icon: '⚡', color: 'yellow' }
  ]

  const handleChange = (id, value) => {
    setSpectrum({ ...spectrum, [id]: value })
  }

  return (
    <motion.div 
      className="fixed top-4 right-4 z-30"
      animate={{
        width: isMinimized ? '48px' : '280px',
        height: isMinimized ? '48px' : 'auto'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className={`${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''} border-2 ${theme.colors.border} shadow-2xl overflow-hidden`}
        style={{
          background: theme.id === 'glassmorphic' 
            ? 'rgba(139, 92, 246, 0.2)' 
            : 'rgba(0, 0, 0, 0.8)'
        }}
      >
        {!isMinimized ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders size={18} className={theme.colors.text} />
                <h3 className={`${theme.font} font-bold ${theme.colors.text} text-sm`}>
                  Visual Intensity
                </h3>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className={`p-1 ${theme.colors.text} hover:${theme.colors.accent} transition-colors`}
              >
                <Minimize2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {sliders.map(slider => (
                <div key={slider.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${theme.font} ${theme.colors.text} flex items-center gap-1.5`}>
                      <span>{slider.icon}</span>
                      {slider.label}
                    </span>
                    <span className={`text-xs ${theme.font} font-mono ${theme.colors.accent}`}>
                      {Math.round((spectrum[slider.id] || 0) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={spectrum[slider.id] || 0}
                    onChange={(e) => handleChange(slider.id, parseFloat(e.target.value))}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer spectrum-slider-${slider.color}`}
                    style={{
                      background: `linear-gradient(to right, 
                        ${theme.id === 'glassmorphic' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(0, 255, 255, 0.3)'} 0%, 
                        ${theme.id === 'glassmorphic' ? 'rgba(139, 92, 246, 1)' : 'rgba(0, 255, 255, 1)'} ${(spectrum[slider.id] || 0) * 100}%, 
                        ${theme.id === 'glassmorphic' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'} ${(spectrum[slider.id] || 0) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className={`text-[10px] ${theme.colors.textMuted}`}>Notion</span>
                    <span className={`text-[10px] ${theme.colors.textMuted}`}>Rave</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <button
                onClick={() => setSpectrum({ blur: 0, glow: 0, saturation: 0, speed: 0 })}
                className={`w-full py-2 px-3 ${theme.rounded} text-xs ${theme.font} ${theme.colors.button} transition-all hover:scale-105`}
              >
                Reset to Minimal
              </button>
              <button
                onClick={() => setSpectrum({ blur: 1, glow: 1, saturation: 1, speed: 1 })}
                className={`w-full mt-2 py-2 px-3 ${theme.rounded} text-xs ${theme.font} ${theme.colors.buttonActive} transition-all hover:scale-105`}
              >
                🔥 FULL RAVE MODE
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsMinimized(false)}
            className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Sliders size={20} className={theme.colors.text} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
