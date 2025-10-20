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
          className="bg-black/60 backdrop-blur-sm border border-neon-cyan/30 px-2 py-1 rounded text-neon-cyan text-xs hover:border-neon-cyan hover:shadow-neon-cyan transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📊
        </motion.button>
      ) : (
        <motion.div 
          className="bg-black/70 backdrop-blur-md border border-neon-cyan/40 rounded px-2 py-2 text-white"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '10px', maxWidth: '180px' }}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-mono text-neon-cyan" style={{ fontSize: '10px' }}>{title}</h3>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-neon-cyan transition-colors text-xs leading-none"
            >
              ━
            </button>
          </div>
          <div style={{ fontSize: '9px' }}>
            {children}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
