import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Quote } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'
import { getRandomQuote } from '../config/quotes'

export default function MotivationalQuote() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [quote, setQuote] = useState(getRandomQuote())
  const [key, setKey] = useState(0)

  const refreshQuote = () => {
    setQuote(getRandomQuote())
    setKey(prev => prev + 1)
  }

  return (
    <div className={`relative overflow-hidden ${theme.rounded === '' ? '' : 'rounded-2xl'} p-6 ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
      style={{
        background: theme.id === 'terminal' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,20,20,0.6) 100%)'
          : 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 50%, rgba(76,195,217,0.15) 100%)',
        border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.2)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: theme.id === 'terminal' 
          ? '0 8px 32px rgba(0,255,255,0.1)' 
          : '0 8px 32px rgba(139,92,246,0.2)'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <Quote className={`${theme.colors.accent} ${theme.id === 'terminal' ? 'opacity-40' : 'opacity-60'}`} size={32} />
            <button
              onClick={refreshQuote}
              className={`p-2 ${theme.rounded === '' ? '' : 'rounded-full'} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
            >
              <RefreshCw className={theme.colors.textMuted} size={16} />
            </button>
          </div>

          <blockquote className={`${theme.font} ${theme.colors.text} ${theme.id === 'terminal' ? 'text-sm' : 'text-base'} leading-relaxed italic`}>
            "{quote.text}"
          </blockquote>

          <div className="flex items-center justify-between">
            <cite className={`${theme.font} ${theme.colors.textMuted} text-xs not-italic`}>
              — {quote.author}
            </cite>
            <span className={`px-3 py-1 ${theme.rounded === '' ? '' : 'rounded-full'} text-xs ${theme.font} ${theme.id === 'terminal' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/10 text-white'}`}>
              {quote.category.toUpperCase()}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
