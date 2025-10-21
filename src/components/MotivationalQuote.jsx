import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Quote, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'
import { getRandomQuote } from '../config/quotes'

export default function MotivationalQuote() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [quote, setQuote] = useState(getRandomQuote())
  const [key, setKey] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)

  const refreshQuote = () => {
    setQuote(getRandomQuote())
    setKey(prev => prev + 1)
  }

  return (
    <motion.div 
      className={`relative overflow-hidden ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}
      style={{
        background: theme.id === 'terminal' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,20,20,0.3) 100%)'
          : 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(59,130,246,0.08) 50%, rgba(76,195,217,0.08) 100%)',
        border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.15)' : '1px solid rgba(255,255,255,0.15)',
        boxShadow: theme.id === 'terminal' 
          ? '0 4px 16px rgba(0,255,255,0.05)' 
          : '0 4px 16px rgba(139,92,246,0.1)'
      }}
      animate={{ 
        width: isMinimized ? '48px' : 'auto',
        height: isMinimized ? '48px' : 'auto'
      }}
      transition={{ duration: 0.3 }}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={`w-full h-full flex items-center justify-center transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
        >
          <Quote className={theme.colors.accent} size={20} />
        </button>
      ) : (
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <Quote className={`${theme.colors.accent} ${theme.id === 'terminal' ? 'opacity-40' : 'opacity-60'} flex-shrink-0`} size={20} />
                <div className="flex gap-1">
                  <button
                    onClick={refreshQuote}
                    className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
                  >
                    <RefreshCw className={theme.colors.textMuted} size={14} />
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
                  >
                    <Minimize2 className={theme.colors.textMuted} size={14} />
                  </button>
                </div>
              </div>

              <blockquote className={`${theme.font} ${theme.colors.text} text-xs leading-relaxed italic`}>
                "{quote.text}"
              </blockquote>

              <div className="flex items-center justify-between gap-2">
                <cite className={`${theme.font} ${theme.colors.textMuted} text-[10px] not-italic truncate`}>
                  — {quote.author}
                </cite>
                <span className={`px-2 py-0.5 ${theme.rounded} text-[9px] ${theme.font} flex-shrink-0 ${theme.id === 'terminal' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/10 text-white'}`}>
                  {quote.category.toUpperCase()}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
