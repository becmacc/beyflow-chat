import React from 'react'
import { motion } from 'framer-motion'

const panelVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 120 }
  }
}

export default function AgentPanel({ selectedAgent }) {
  if (!selectedAgent) return null

  return (
    <motion.div
      className="agent-panel"
      initial="hidden"
      animate="visible"
      variants={panelVariants}
      style={{
        position: 'absolute',
        top: '100px',
        left: '40px',
        width: '350px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'white',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 0 20px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        zIndex: 20
      }}
    >
      <h2 className="text-xl font-bold mb-2">{selectedAgent.name}</h2>
      <p><strong>Role:</strong> {selectedAgent.role}</p>
      <p className="mt-2">{selectedAgent.description}</p>
    </motion.div>
  )
}
