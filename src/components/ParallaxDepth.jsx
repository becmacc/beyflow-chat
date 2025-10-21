import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect } from 'react'
import useStore from '../store'

export default function ParallaxDepth() {
  const { colorMode } = useStore()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const colorModeStyles = {
    neutral: { primary: 'rgba(76, 195, 217, 0.15)', secondary: 'rgba(76, 195, 217, 0.08)', accent: 'rgba(0, 255, 255, 0.1)' },
    positive: { primary: 'rgba(46, 204, 113, 0.15)', secondary: 'rgba(46, 204, 113, 0.08)', accent: 'rgba(0, 255, 128, 0.1)' },
    warning: { primary: 'rgba(243, 156, 18, 0.15)', secondary: 'rgba(243, 156, 18, 0.08)', accent: 'rgba(255, 165, 0, 0.1)' },
    danger: { primary: 'rgba(231, 76, 60, 0.15)', secondary: 'rgba(231, 76, 60, 0.08)', accent: 'rgba(255, 0, 0, 0.1)' }
  }

  const currentColors = colorModeStyles[colorMode] || colorModeStyles.neutral

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const layer1X = useTransform(mouseX, [0, window.innerWidth], [-20, 20])
  const layer1Y = useTransform(mouseY, [0, window.innerHeight], [-20, 20])
  
  const layer2X = useTransform(mouseX, [0, window.innerWidth], [-40, 40])
  const layer2Y = useTransform(mouseY, [0, window.innerHeight], [-40, 40])
  
  const layer3X = useTransform(mouseX, [0, window.innerWidth], [-60, 60])
  const layer3Y = useTransform(mouseY, [0, window.innerHeight], [-60, 60])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* LAYER 3 - Deepest, slowest */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer3X, y: layer3Y }}
      >
        {/* Large floating orbs */}
        <motion.div
          className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${currentColors.primary}, transparent)` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[20%] w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${currentColors.secondary}, transparent)` }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* LAYER 2 - Middle depth */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer2X, y: layer2Y }}
      >
        {/* Medium floating shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${150 + i * 30}px`,
              height: `${150 + i * 30}px`,
              left: `${(i * 15) % 90}%`,
              top: `${(i * 20) % 80}%`,
              background: `radial-gradient(circle, ${currentColors.accent}, transparent)`,
              opacity: 0.15
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </motion.div>

      {/* LAYER 1 - Closest, fastest */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer1X, y: layer1Y }}
      >
        {/* Small floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full blur-sm"
            style={{
              width: `${20 + i * 5}px`,
              height: `${20 + i * 5}px`,
              left: `${(i * 8) % 95}%`,
              top: `${(i * 12) % 90}%`,
              background: currentColors.primary,
              opacity: 0.2
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}

        {/* Grid overlay for depth */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(${currentColors.accent} 1px, transparent 1px),
              linear-gradient(90deg, ${currentColors.accent} 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            maskImage: 'radial-gradient(circle, transparent 30%, black 100%)'
          }}
        />
      </motion.div>

      {/* Vignette for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  )
}
