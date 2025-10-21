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

  const layer1X = useTransform(mouseX, [0, window.innerWidth], [-50, 50])
  const layer1Y = useTransform(mouseY, [0, window.innerHeight], [-50, 50])
  
  const layer2X = useTransform(mouseX, [0, window.innerWidth], [-100, 100])
  const layer2Y = useTransform(mouseY, [0, window.innerHeight], [-100, 100])
  
  const layer3X = useTransform(mouseX, [0, window.innerWidth], [-150, 150])
  const layer3Y = useTransform(mouseY, [0, window.innerHeight], [-150, 150])
  
  const layer4X = useTransform(mouseX, [0, window.innerWidth], [-200, 200])
  const layer4Y = useTransform(mouseY, [0, window.innerHeight], [-200, 200])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* LAYER 4 - DEEPEST, slowest, HUGE */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer4X, y: layer4Y }}
      >
        {/* Massive background orbs */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`mega-${i}`}
            className="absolute rounded-full blur-[100px]"
            style={{
              width: `${600 + i * 100}px`,
              height: `${600 + i * 100}px`,
              left: `${(i * 25) % 100}%`,
              top: `${(i * 30) % 100}%`,
              background: `radial-gradient(circle, ${currentColors.primary}, ${currentColors.secondary}, transparent)`,
              opacity: 0.15
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i
            }}
          />
        ))}
      </motion.div>

      {/* LAYER 3 - Deep, slow */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer3X, y: layer3Y }}
      >
        {/* Large floating orbs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${300 + i * 50}px`,
              height: `${300 + i * 50}px`,
              left: `${(i * 12) % 95}%`,
              top: `${(i * 15) % 90}%`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? currentColors.primary : currentColors.accent}, transparent)`,
              opacity: 0.2
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, i % 2 === 0 ? 50 : -50, 0],
              y: [0, i % 2 === 0 ? -30 : 30, 0]
            }}
            transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </motion.div>

      {/* LAYER 2 - Middle depth - MORE particles */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer2X, y: layer2Y }}
      >
        {/* Medium floating shapes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${100 + i * 20}px`,
              height: `${100 + i * 20}px`,
              left: `${(i * 8) % 95}%`,
              top: `${(i * 11) % 90}%`,
              background: `radial-gradient(circle, ${currentColors.accent}, transparent)`,
              opacity: 0.2
            }}
            animate={{
              y: [0, i % 3 === 0 ? -40 : -60, 0],
              x: [0, i % 2 === 0 ? 30 : -30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, i % 2 === 0 ? 180 : -180, 0]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </motion.div>

      {/* LAYER 1 - Closest, fastest - TONS of particles */}
      <motion.div
        className="absolute inset-0"
        style={{ x: layer1X, y: layer1Y }}
      >
        {/* Small floating particles */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full blur-sm"
            style={{
              width: `${15 + i * 3}px`,
              height: `${15 + i * 3}px`,
              left: `${(i * 6) % 98}%`,
              top: `${(i * 7) % 95}%`,
              background: i % 3 === 0 ? currentColors.primary : currentColors.accent,
              opacity: 0.25
            }}
            animate={{
              y: [0, i % 2 === 0 ? -70 : -100, 0],
              x: [0, i % 2 === 0 ? 40 : -40, 0],
              scale: [1, 1.5, 1],
              opacity: [0.25, 0.5, 0.25],
              rotate: [0, i % 2 === 0 ? 360 : -360, 0]
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1
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
