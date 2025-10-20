import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import { omnigenAgents } from '../config/omnigenAgents'

function AgentPiece({ position, agent, agentId, onClick, isActive }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
      
      if (isActive) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
      } else if (hovered) {
        meshRef.current.scale.setScalar(1.15)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const color = useMemo(() => {
    const colors = {
      omnigen: '#a855f7',
      gptMarketer: '#3b82f6',
      gptEngineer: '#10b981',
      dalle: '#f97316'
    }
    return colors[agentId] || '#6366f1'
  }, [agentId])

  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 1)
    shape.lineTo(-0.866, -0.5)
    shape.lineTo(0.866, -0.5)
    shape.lineTo(0, 1)
    
    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 3
    }
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings)
  }, [])

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={() => onClick(agentId)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 0.8 : hovered ? 0.4 : 0.2}
          metalness={0.8}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
      
      {hovered && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {agent.icon} {agent.name}
        </Text>
      )}
    </group>
  )
}

function CentralCube({ isExploded }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current && !isExploded) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.4) * 0.1
    }
  })

  if (isExploded) return null

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
        wireframe={true}
      />
    </mesh>
  )
}

function HierarchyLines({ isExploded, activeAgent }) {
  if (!isExploded) return null

  const lines = useMemo(() => {
    const positions = {
      omnigen: [0, 2, 0],
      gptMarketer: [-2.5, -1, 0],
      gptEngineer: [2.5, -1, 0],
      dalle: [0, -3, 0]
    }

    return [
      { from: positions.omnigen, to: positions.gptMarketer },
      { from: positions.omnigen, to: positions.gptEngineer },
      { from: positions.omnigen, to: positions.dalle }
    ]
  }, [])

  return (
    <group>
      {lines.map((line, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...line.from, ...line.to])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" opacity={0.3} transparent />
        </line>
      ))}
    </group>
  )
}

export default function OmnigenCube({ onAgentSelect, activeAgent }) {
  const [isExploded, setIsExploded] = useState(false)

  const handleAgentClick = (agentId) => {
    if (!isExploded) {
      setIsExploded(true)
    }
    onAgentSelect(agentId)
  }

  const agentPositions = {
    omnigen: [0, 2, 0],
    gptMarketer: [-2.5, -1, 0],
    gptEngineer: [2.5, -1, 0],
    dalle: [0, -3, 0]
  }

  return (
    <div style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        
        <CentralCube isExploded={isExploded} />
        
        {isExploded && (
          <>
            <HierarchyLines isExploded={isExploded} activeAgent={activeAgent} />
            {Object.entries(omnigenAgents).map(([agentId, agent]) => (
              <AgentPiece
                key={agentId}
                position={agentPositions[agentId]}
                agent={agent}
                agentId={agentId}
                onClick={handleAgentClick}
                isActive={activeAgent === agentId}
              />
            ))}
          </>
        )}

        {!isExploded && (
          <Text
            position={[0, -3.5, 0]}
            fontSize={0.4}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
          >
            Click to explore team →
          </Text>
        )}
        
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}
