import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MinimizablePanel({ 
  title, 
  children, 
  position = 'top-right',
  defaultMinimized = false 
}) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)

  const positions = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-20 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  }

  return (
    <motion.div
      className={`fixed ${positions[position]} z-40`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {isMinimized ? (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className="cyber-card px-3 py-2 neon-text hover:shadow-neon-cyan transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📊 {title}
        </motion.button>
      ) : (
        <div className="cyber-card p-4 text-white text-xs max-w-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm neon-text">{title}</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-neon-cyan transition-colors"
            >
              ━
            </button>
          </div>
          {children}
        </div>
      )}
    </motion.div>
  )
}
