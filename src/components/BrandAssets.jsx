import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button, Card, Input, Modal } from "../core/StandardComponents"
import { useBeyFlowStore } from "../core/UnifiedStore"
import { useAnimationPause } from "../hooks/useAnimationPause"

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
  const { ref, shouldAnimate } = useAnimationPause({ threshold: 0.05 })
  
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
      ref={ref}
      className="fixed pointer-events-none z-10 transition-all duration-500"
      style={{
        ...positionStyles[position],
        opacity,
        transform: `${positionStyles[position].transform || ''} scale(${scale * pulse}) rotate(${rotation}deg)`
      }}
    >
      <motion.img
        src={logoSrc}
        alt="Brand watermark"
        className="w-24 h-24 object-contain select-none"
        style={{
          filter: 'grayscale(60%) opacity(30%)',
          mixBlendMode: 'overlay'
        }}
        animate={shouldAnimate ? {
          scale: [scale, scale * 1.02, scale],
          opacity: [opacity, opacity * 1.2, opacity]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Enhanced Floating Brand Elements
export const FloatingBrandElements = ({ 
  logos = [],
  maxElements = 6,
  audioReactive = true 
}) => {
  const audio = useBeyFlowStore(state => state.audio)
  const ui = useBeyFlowStore(state => state.ui)
  
  const [positions, setPositions] = useState([])
  
  useEffect(() => {
    // Initialize random positions for floating elements
    const initPositions = Array.from({ length: Math.min(logos.length, maxElements) }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.4,
      speed: 0.2 + Math.random() * 0.8
    }))
    
    setPositions(initPositions)
  }, [logos, maxElements])
  
  useEffect(() => {
    if (!audioReactive || !audio.playing) return
    
    const animateElements = () => {
      setPositions(prev => prev.map(pos => ({
        ...pos,
        x: (pos.x + pos.speed) % window.innerWidth,
        y: pos.y + Math.sin(Date.now() * 0.001 + pos.id) * 0.5,
        rotation: pos.rotation + 0.1
      })))
    }
    
    const interval = setInterval(animateElements, 50)
    return () => clearInterval(interval)
  }, [audioReactive, audio.playing])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      {positions.map((pos, index) => (
        <motion.div
          key={pos.id}
          className="absolute"
          style={{
            left: pos.x,
            top: pos.y,
            transform: `rotate(${pos.rotation}deg) scale(${pos.scale})`
          }}
          animate={{
            scale: [pos.scale, pos.scale * 1.1, pos.scale],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        >
          <img
            src={logos[index % logos.length]}
            alt={`Floating brand ${index}`}
            className="w-8 h-8 object-contain opacity-10"
            style={{
              filter: `hue-rotate(${ui.gradientShift}deg) saturate(0.3)`,
              mixBlendMode: 'screen'
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Background Brand Layer
export const BackgroundBrandLayer = ({ 
  patternSrc,
  intensity = 0.03,
  scrollParallax = true 
}) => {
  const ui = useBeyFlowStore(state => state.ui)
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    if (!scrollParallax) return
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollParallax])
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-1"
      style={{
        backgroundImage: `url(${patternSrc})`,
        backgroundSize: '120px 120px',
        backgroundRepeat: 'repeat',
        opacity: intensity,
        transform: scrollParallax ? `translateY(${scrollY * 0.1}px)` : 'none',
        filter: `hue-rotate(${ui.gradientShift}deg) saturate(0.6)`,
        mixBlendMode: 'overlay'
      }}
    />
  )
}

// Animated Brand Particles  
export const BrandParticles = ({ 
  logoSrc,
  count = 12,
  audioReactive = true 
}) => {
  const audio = useBeyFlowStore(state => state.audio)
  const ui = useBeyFlowStore(state => state.ui)
  
  return (
    <div className="fixed inset-0 pointer-events-none z-3">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4"
          style={{
            left: `${(i * 7) % 100}%`,
            top: `${(i * 11) % 100}%`,
          }}
          animate={{
            x: [0, 20, -20, 0],
            y: [0, -30, 30, 0],
            rotate: [0, 180, 360],
            scale: audioReactive && audio.playing 
              ? [0.5, 1.2, 0.8, 1] 
              : [0.8, 1, 0.8],
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
      ))}
    </div>
  )
}