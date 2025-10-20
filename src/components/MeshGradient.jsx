import { motion } from 'framer-motion'

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-black">
      {/* Single ultra-subtle cyan glow in corner */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)',
          top: '-20%',
          right: '-15%'
        }}
        animate={{
          opacity: [0.02, 0.04, 0.02]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}
