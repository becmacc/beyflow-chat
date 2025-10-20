import { motion } from 'framer-motion'

export default function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      {/* Animated mesh gradient blobs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 70%)',
          top: '-20%',
          left: '-10%'
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(255,0,255,0.4) 0%, transparent 70%)',
          top: '30%',
          right: '-5%'
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />
      
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,65,0.3) 0%, transparent 70%)',
          bottom: '-15%',
          left: '20%'
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -80, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />
    </div>
  )
}
