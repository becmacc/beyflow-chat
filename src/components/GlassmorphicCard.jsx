import React from 'react'
import { motion } from 'framer-motion'

export default function GlassmorphicCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-black
        border border-cyan-500/10
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        borderColor: 'rgba(0, 255, 255, 0.25)'
      } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {/* Sharp terminal corners */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-cyan-500/30" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-cyan-500/30" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-cyan-500/30" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-cyan-500/30" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
