import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Box, Torus, Environment, Float, Text } from "@react-three/drei"
import { motion } from "framer-motion"
import { useState, Suspense } from "react"
import { useBeyFlowStore } from "../core/UnifiedStore"

function ParticleSystem({ count = 50 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    position: [
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ],
    scale: Math.random() * 0.5 + 0.1
  }))

  return (
    <>
      {particles.map((particle) => (
        <Float
          key={particle.id}
          speed={1 + Math.random()}
          rotationIntensity={Math.random() * 2}
          floatIntensity={Math.random() * 3}
        >
          <Sphere args={[particle.scale]} position={particle.position}>
            <meshStandardMaterial
              color={`hsl(${Math.random() * 360}, 70%, 60%)`}
              transparent
              opacity={0.6}
            />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

function GeometricShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Box args={[2, 2, 2]} position={[-4, 2, 0]}>
          <meshStandardMaterial color="#4CC3D9" wireframe />
        </Box>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
        <Torus args={[1.5, 0.5, 16, 32]} position={[4, -1, 2]}>
          <meshStandardMaterial color="#3b82f6" />
        </Torus>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={3}>
        <Sphere args={[1.2]} position={[0, 3, -2]}>
          <meshStandardMaterial color="#10b981" transparent opacity={0.8} />
        </Sphere>
      </Float>
      
      <Text
        position={[0, 0, 0]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        BeyFlow
      </Text>
    </>
  )
}

function Scene3D() {
  const { sceneConfig } = useStore()
  
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4CC3D9" />
      
      <Environment preset="night" />
      
      <ParticleSystem count={sceneConfig.particleCount} />
      <GeometricShapes />
      
      <OrbitControls 
        enableZoom={true} 
        autoRotate={sceneConfig.rotation} 
        autoRotateSpeed={0.3}
      />
    </>
  )
}

export default function Visualizer3D() {
  const { sceneConfig, updateSceneConfig } = useStore()
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="h-full flex">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
        
        {/* Overlay Controls */}
        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.button
            onClick={() => setShowControls(!showControls)}
            className="bg-black/30 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-xl"
            whileHover={{ scale: 1.05 }}
          >
            🎛️ Controls
          </motion.button>
        </motion.div>
      </div>

      {/* Side Panel */}
      {showControls && (
        <motion.div
          className="w-80 bg-black/30 backdrop-blur-xl border-l border-white/10 p-6"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
        >
          <h3 className="text-white text-xl font-bold mb-6">3D Controls</h3>
          
          <div className="space-y-6">
            {/* Particle Count */}
            <div>
              <label className="text-white/80 text-sm block mb-2">
                Particle Count: {sceneConfig.particleCount}
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={sceneConfig.particleCount}
                onChange={(e) => updateSceneConfig({ particleCount: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Auto Rotation */}
            <div>
              <label className="flex items-center space-x-2 text-white/80">
                <input
                  type="checkbox"
                  checked={sceneConfig.rotation}
                  onChange={(e) => updateSceneConfig({ rotation: e.target.checked })}
                  className="rounded"
                />
                <span>Auto Rotation</span>
              </label>
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-white/80 text-sm block mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={sceneConfig.color}
                onChange={(e) => updateSceneConfig({ color: e.target.value })}
                className="w-full h-10 rounded-lg border border-white/20"
              />
            </div>

            {/* Presets */}
            <div>
              <label className="text-white/80 text-sm block mb-2">
                Scene Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => updateSceneConfig({ 
                    particleCount: 50, 
                    rotation: true, 
                    color: '#4CC3D9' 
                  })}
                  className="bg-blue-500/20 border border-blue-400/30 text-white p-2 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Ocean
                </motion.button>
                <motion.button
                  onClick={() => updateSceneConfig({ 
                    particleCount: 100, 
                    rotation: false, 
                    color: '#10b981' 
                  })}
                  className="bg-green-500/20 border border-green-400/30 text-white p-2 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Forest
                </motion.button>
                <motion.button
                  onClick={() => updateSceneConfig({ 
                    particleCount: 150, 
                    rotation: true, 
                    color: '#f59e0b' 
                  })}
                  className="bg-yellow-500/20 border border-yellow-400/30 text-white p-2 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Galaxy
                </motion.button>
                <motion.button
                  onClick={() => updateSceneConfig({ 
                    particleCount: 25, 
                    rotation: false, 
                    color: '#8b5cf6' 
                  })}
                  className="bg-purple-500/20 border border-purple-400/30 text-white p-2 rounded-lg text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Minimal
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}