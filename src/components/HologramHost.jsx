import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, MeshDistortMaterial, Sphere, RoundedBox } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'
import * as THREE from 'three'

function HologramFigure({ colorMode }) {
  const meshRef = useRef()
  const headRef = useRef()
  const bodyRef = useRef()
  
  const colors = {
    neutral: new THREE.Color('#4CC3D9'),
    positive: new THREE.Color('#2ecc71'),
    warning: new THREE.Color('#f39c12'),
    danger: new THREE.Color('#e74c3c')
  }
  
  const currentColor = colors[colorMode] || colors.neutral
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.3) * 0.2
      headRef.current.position.y = Math.sin(t * 0.5) * 0.05
    }
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(t * 0.2) * 0.05
    }
  })
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={meshRef}>
        {/* Head */}
        <mesh ref={headRef} position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <MeshDistortMaterial
            color={currentColor}
            transparent
            opacity={0.7}
            distort={0.3}
            speed={2}
            emissive={currentColor}
            emissiveIntensity={0.5}
            wireframe={false}
          />
        </mesh>
        
        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0, 0]}>
          <capsuleGeometry args={[0.25, 0.8, 32, 32]} />
          <MeshDistortMaterial
            color={currentColor}
            transparent
            opacity={0.6}
            distort={0.2}
            speed={1.5}
            emissive={currentColor}
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
          <capsuleGeometry args={[0.08, 0.5, 16, 16]} />
          <MeshDistortMaterial
            color={currentColor}
            transparent
            opacity={0.5}
            distort={0.15}
            speed={1.2}
            emissive={currentColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        
        <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <capsuleGeometry args={[0.08, 0.5, 16, 16]} />
          <MeshDistortMaterial
            color={currentColor}
            transparent
            opacity={0.5}
            distort={0.15}
            speed={1.2}
            emissive={currentColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Hologram ring effects */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.6, 0.02, 16, 100]} />
          <meshBasicMaterial color={currentColor} transparent opacity={0.3} />
        </mesh>
        
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.015, 16, 100]} />
          <meshBasicMaterial color={currentColor} transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function ParticleField({ colorMode }) {
  const particles = useRef()
  const count = 200
  
  const colors = {
    neutral: new THREE.Color('#4CC3D9'),
    positive: new THREE.Color('#2ecc71'),
    warning: new THREE.Color('#f39c12'),
    danger: new THREE.Color('#e74c3c')
  }
  
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2
  }
  
  useFrame((state) => {
    if (particles.current) {
      particles.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })
  
  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={colors[colorMode] || colors.neutral}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

export default function HologramHost() {
  const { themePersona, colorMode } = useStore()
  const theme = getTheme(themePersona)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [webglError, setWebglError] = useState(true)
  
  const colorModeColors = {
    neutral: '#4CC3D9',
    positive: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c'
  }
  
  return (
    <motion.div
      className={`fixed bottom-4 right-1/4 -translate-x-1/2 ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}
      style={{
        background: theme.id === 'terminal' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,40,40,0.4) 100%)'
          : 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.1) 100%)',
        border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.2)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: theme.id === 'terminal' 
          ? '0 8px 32px rgba(0,255,255,0.15)' 
          : '0 8px 32px rgba(139,92,246,0.2)'
      }}
      animate={{
        width: isMinimized ? '64px' : '280px',
        height: isMinimized ? '64px' : '320px'
      }}
      transition={{ duration: 0.3 }}
    >
      {isMinimized ? (
        <motion.button
          onClick={() => setIsMinimized(false)}
          className={`w-full h-full flex items-center justify-center text-3xl transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ 
            filter: `drop-shadow(0 0 10px ${colorModeColors[colorMode] || colorModeColors.neutral})`
          }}
        >
          👩‍💻
        </motion.button>
      ) : (
        <div className="relative w-full h-full">
          {/* 3D Hologram Canvas with fallback */}
          {!webglError ? (
            <Canvas
              camera={{ position: [0, 0, 3], fov: 50 }}
              className="absolute inset-0"
              style={{ background: 'transparent' }}
              onCreated={(state) => {
                if (!state.gl) {
                  setWebglError(true)
                }
              }}
              onError={() => setWebglError(true)}
            >
              <ambientLight intensity={0.2} />
              <pointLight position={[2, 2, 2]} intensity={1} color="#4CC3D9" />
              <pointLight position={[-2, -2, -2]} intensity={0.5} color="#ec4899" />
              <HologramFigure colorMode={colorMode} />
              <ParticleField colorMode={colorMode} />
            </Canvas>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ 
                  filter: `drop-shadow(0 0 20px ${colorModeColors[colorMode] || colorModeColors.neutral})`
                }}
              >
                👩‍💻
              </motion.div>
            </div>
          )}
          
          {/* Controls Overlay */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={() => setIsSpeaking(!isSpeaking)}
              className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
              title={isSpeaking ? 'Mute' : 'Unmute'}
            >
              {isSpeaking ? (
                <Volume2 className={theme.colors.accent} size={14} />
              ) : (
                <VolumeX className={theme.colors.textMuted} size={14} />
              )}
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
            >
              <Minimize2 className={theme.colors.textMuted} size={14} />
            </button>
          </div>
          
          {/* Name Tag */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className={`${theme.rounded} px-3 py-1.5 text-center ${theme.effects.blur ? 'backdrop-blur-sm' : ''}`}
              style={{
                background: theme.id === 'terminal' 
                  ? 'rgba(0,0,0,0.5)' 
                  : 'rgba(139,92,246,0.15)',
                border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.2)' : '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div className={`${theme.font} ${theme.colors.text} text-xs font-bold`}>
                ARIA
              </div>
              <div className={`${theme.font} ${theme.colors.textMuted} text-[9px]`}>
                AI HOLOGRAM HOST
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
