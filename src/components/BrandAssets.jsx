import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import useStore from "../store"

// Brand Watermark - Subtle logo in background (optimized for BeyMedia)
export const BrandWatermark = ({ 
  logoSrc, 
  position = 'center', 
  opacity = 0.04,
  rotateWithAudio = false,
  scale = 1.1,
  pulseWithReward = true
}) => {
  const [rotation, setRotation] = useState(0)
  const [pulse, setPulse] = useState(1)
  
  useEffect(() => {
    if (!rotateWithAudio) return
    
    // Listen for audio events (gentle rotation)
    const rotateInterval = setInterval(() => {
      setRotation(prev => prev + 0.3) // Slower, more elegant rotation
    }, 150)
    
    return () => clearInterval(rotateInterval)
  }, [rotateWithAudio])
  
  useEffect(() => {
    if (!pulseWithReward) return
    
    // Subtle pulse effect for dopamine rewards
    const pulseInterval = setInterval(() => {
      setPulse(prev => prev === 1 ? 1.05 : 1)
    }, 3000) // Gentle pulse every 3 seconds
    
    return () => clearInterval(pulseInterval)
  }, [pulseWithReward])

  const positionStyles = {
    center: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    topLeft: { top: '2rem', left: '2rem' },  
    topRight: { top: '2rem', right: '2rem' },
    bottomLeft: { bottom: '2rem', left: '2rem' },
    bottomRight: { bottom: '2rem', right: '2rem' }
  }

  return (
    <div 
      className="fixed pointer-events-none z-10 transition-all duration-500"
      style={{
        ...positionStyles[position],
        transform: `${positionStyles[position].transform || ''} scale(${scale * pulse}) rotate(${rotation}deg)`,
        opacity: opacity
      }}
    >
      <img
        src={logoSrc}
        alt="BeyMedia Brand"
        className="w-32 h-32 lg:w-48 lg:h-48 object-contain"
        style={{
          filter: 'blur(0.5px) saturate(0.8)',
          mixBlendMode: 'overlay'
        }}
      />
    </div>
  )
}

export function FloatingBrandElements({ images = [] }) {
  const { ui } = useStore()

  if (!images.length) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {images.map((imageSrc, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${10 + (index * 20) % 80}%`,
            top: `${15 + (index * 25) % 70}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            rotate: [0, 5, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            delay: index * 1.5,
            ease: "easeInOut"
          }}
        >
          <img
            src={imageSrc}
            alt={`Brand element ${index}`}
            className="w-16 h-16 lg:w-24 lg:h-24 object-contain opacity-10"
            style={{
              filter: `blur(1px) saturate(0.6) hue-rotate(${ui.gradientShift + index * 60}deg)`,
              mixBlendMode: 'overlay'
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Background Brand Layer - Ultra-subtle background texture
export const BackgroundBrandLayer = ({ patternSrc, patternAltSrc, opacity = 0.02 }) => {
  const [currentPattern, setCurrentPattern] = useState(0)
  
  useEffect(() => {
    if (!patternAltSrc) return
    
    const interval = setInterval(() => {
      setCurrentPattern(prev => prev === 0 ? 1 : 0)
    }, 30000) // Switch patterns every 30 seconds
    
    return () => clearInterval(interval)
  }, [patternAltSrc])
  
  const activePattern = currentPattern === 0 ? patternSrc : (patternAltSrc || patternSrc)
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{
        backgroundImage: `url(${activePattern})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
        opacity: opacity,
        filter: 'blur(1px)',
        mixBlendMode: 'overlay'
      }}
    />
  )
}

export function BrandParticles({ logoSrc, count = 8 }) {
  const { ui, audio } = useStore()

  if (!logoSrc) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.08, 0],
            scale: [0.5, 0.8, 0.5],
            rotate: [0, 360, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          <img
            src={logoSrc}
            alt="Brand particle"
            className="w-8 h-8 object-contain"
            style={{
              filter: `blur(0.5px) saturate(0.5) hue-rotate(${ui.gradientShift + i * 45}deg)`,
              mixBlendMode: 'screen'
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export function ChatBubbleBrandAccent({ imageSrc, children, isUser }) {
  if (!imageSrc) return children

  return (
    <div className="relative">
      {children}
      <motion.div
        className="absolute -top-1 -right-1 w-6 h-6 pointer-events-none"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <img
          src={imageSrc}
          alt="Brand accent"
          className="w-full h-full object-contain"
          style={{
            filter: `saturate(0.6) ${isUser ? 'hue-rotate(180deg)' : ''}`,
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>
    </div>
  )
}

export function SidebarBrandAccent({ logoSrc }) {
  const { ui } = useStore()

  if (!logoSrc) return null

  return (
    <motion.div
      className="absolute bottom-4 left-4 right-4 pointer-events-none"
      animate={{
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <img
        src={logoSrc}
        alt="Brand accent"
        className="w-full h-8 object-contain opacity-20"
        style={{
          filter: `saturate(0.4) hue-rotate(${ui.gradientShift}deg)`,
          mixBlendMode: 'overlay'
        }}
      />
    </motion.div>
  )
}