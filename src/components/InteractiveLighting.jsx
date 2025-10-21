import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function InteractiveLighting() {
  const { themePersona, colorMode } = useStore()
  const theme = getTheme(themePersona)
  
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 18, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 120, damping: 18, mass: 0.4 })

  useEffect(() => {
    const onMove = (e) => { 
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mx, my])

  const colorModeHues = {
    neutral: theme.id === 'terminal' ? 180 : 270,
    positive: 150,
    warning: 45,
    danger: 350
  }
  
  const hue = colorModeHues[colorMode] || colorModeHues.neutral
  const spotlight = useTransform([sx, sy], ([x, y]) => 
    `radial-gradient(300px 220px at ${x}px ${y}px, hsla(${hue},80%,50%,0.15) 0%, transparent 70%)`
  )

  const bg = theme.id === 'terminal'
    ? 'linear-gradient(135deg, hsl(180, 30%, 5%), hsl(200, 35%, 3%))'
    : 'linear-gradient(135deg, hsl(270, 50%, 12%), hsl(240, 55%, 10%))'

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <motion.div
        className="absolute inset-0"
        style={{ background: bg, opacity: 0.6 }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ 
          backgroundImage: spotlight, 
          mixBlendMode: 'screen', 
          opacity: 0.7 
        }}
      />
      {/* Additional accent light in corners */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 opacity-20"
        style={{
          background: `radial-gradient(circle, ${theme.id === 'terminal' ? 'rgba(0,255,255,0.3)' : 'rgba(139,92,246,0.4)'} 0%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 opacity-20"
        style={{
          background: `radial-gradient(circle, ${theme.id === 'terminal' ? 'rgba(0,255,255,0.2)' : 'rgba(236,72,153,0.3)'} 0%, transparent 70%)`,
          filter: 'blur(60px)'
        }}
      />
    </div>
  )
}
