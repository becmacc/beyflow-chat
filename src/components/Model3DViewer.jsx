import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Center, Sphere, Box, Torus, Cone } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'

function Scene3D({ shape, color }) {
  const shapes = {
    sphere: <Sphere args={[1, 32, 32]}><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} /></Sphere>,
    box: <Box args={[1.5, 1.5, 1.5]}><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} /></Box>,
    torus: <Torus args={[1, 0.4, 16, 100]}><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} /></Torus>,
    cone: <Cone args={[1, 2, 32]}><meshStandardMaterial color={color} metalness={0.8} roughness={0.2} /></Cone>
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={true} enablePan={true} autoRotate autoRotateSpeed={2} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Center>
        <Suspense fallback={null}>
          {shapes[shape] || shapes.sphere}
        </Suspense>
      </Center>
      
      <Environment preset="city" />
    </>
  )
}

export default function Model3DViewer({ className = '' }) {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const theme = getTheme(themePersona)
  
  const [shape, setShape] = useState('sphere')
  const [color, setColor] = useState('#4cc3d9')

  const shapes = [
    { id: 'sphere', name: 'Sphere', icon: '⚪' },
    { id: 'box', name: 'Cube', icon: '⬛' },
    { id: 'torus', name: 'Torus', icon: '⭕' },
    { id: 'cone', name: 'Cone', icon: '🔺' }
  ]

  const colors = [
    { id: '#4cc3d9', name: 'Cyan' },
    { id: '#7bc4ff', name: 'Blue' },
    { id: '#a78bfa', name: 'Purple' },
    { id: '#f472b6', name: 'Pink' },
    { id: '#fb923c', name: 'Orange' },
    { id: '#4ade80', name: 'Green' }
  ]

  return (
    <div className={`${className}`}>
      {/* 3D Canvas */}
      <div className={`w-full h-96 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} overflow-hidden`}>
        <Canvas>
          <Scene3D shape={shape} color={color} />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-4">
        {/* Shape Selector */}
        <div>
          <label className={`block text-xs ${theme.font} ${theme.colors.textMuted} mb-2`}>
            {theme.id === 'terminal' ? '[SHAPE]' : 'Shape'}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {shapes.map((s) => (
              <button
                key={s.id}
                onClick={() => setShape(s.id)}
                className={`px-3 py-2 ${theme.rounded} ${theme.font} text-xs transition-all ${
                  shape === s.id
                    ? `${theme.colors.buttonActive} ${theme.colors.borderActive}`
                    : `${theme.colors.input} hover:${theme.colors.border}`
                }`}
              >
                <div className="text-lg mb-1">{s.icon}</div>
                <div className={theme.colors.text}>{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selector */}
        <div>
          <label className={`block text-xs ${theme.font} ${theme.colors.textMuted} mb-2`}>
            {theme.id === 'terminal' ? '[COLOR]' : 'Color'}
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`w-12 h-12 ${theme.rounded} border-2 transition-all ${
                  color === c.id ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c.id }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <div className={`p-3 ${theme.colors.input} ${theme.rounded}`}>
          <p className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
            {theme.id === 'terminal'
              ? '> DRAG_TO_ROTATE | SCROLL_TO_ZOOM | AUTO_ROTATE_ENABLED'
              : '🖱️ Drag to rotate • Scroll to zoom • Auto-rotation enabled'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
