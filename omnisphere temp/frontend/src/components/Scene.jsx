// Scene.jsx with phased transitions, explosion, and music switching

import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import * as THREE from 'three';
import musicIntro from '../assets/music.mp3';
import musicAgents from '../assets/music2.mp3';
import musicRecursion from '../assets/music3.mp3'; 
import explosionSound from '../assets/explosion.mp3';


const faceConfig = [
  { label: 'Copy', color: '#FFD700', position: [2, 0, 0] },
  { label: 'Design', color: '#00BFFF', position: [-2, 0, 0] },
  { label: 'Strategy', color: '#32CD32', position: [0, 2, 0] },
  { label: 'Research', color: '#FF69B4', position: [0, -2, 0] },
  { label: 'Integrate', color: '#BA55D3', position: [0, 0, 2] },
  { label: 'Render', color: '#FF8C00', position: [0, 0, -2] }
]

function Omnigen({ phase }) {
  const ref = useRef()
  const [hover, setHover] = useState(null)

  useEffect(() => {
    const audio = new Audio(
      phase === 'intro' ? musicIntro :
      phase === 'explode' ? musicAgents :
      musicRecursion
    )
    audio.loop = true
    audio.volume = 0.4
    audio.play()
    return () => audio.pause()
  }, [phase])

  useFrame(({ clock }) => {
    if (ref.current) {
      if (phase === 'intro') {
        ref.current.rotation.y += 0.003
        ref.current.rotation.x += 0.0015
      }
    }
  })

  if (phase === 'intro') {
    return (
      <mesh ref={ref} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color={'#00bcd4'} emissive={'#007ba7'} emissiveIntensity={0.5} />
        <Html center position={[0, 0, 1.2]}>
          <div style={{ color: 'white', background: '#007ba7', padding: '4px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Omnigen</div>
        </Html>
      </mesh>
    )
  }

  if (phase === 'explode' || phase === 'recursion') {
    return (
      <group ref={ref}>
        {faceConfig.map((face, i) => (
          <mesh
            key={i}
            position={face.position.map(p => phase === 'recursion' ? p * 3 : p * 2)}
            onPointerOver={() => setHover(face.label)}
            onPointerOut={() => setHover(null)}
          >
            <coneGeometry args={[0.8, 1.5, 3]} />
            <meshStandardMaterial
              color={face.color}
              emissive={hover === face.label ? 'white' : face.color}
              emissiveIntensity={0.6}
            />
            <Html center position={[0, 1, 0]}>
              <div style={{ background: face.color, color: 'white', padding: '4px 10px', borderRadius: '6px', boxShadow: '0 0 10px rgba(255,255,255,0.4)', fontSize: '1rem' }}>{face.label}</div>
            </Html>
          </mesh>
        ))}
      </group>
    )
  }

  return null
}

export default function Scene({ phase }) {
  return (
    <Canvas camera={{ position: [4, 4, 6], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <Stars />
      <OrbitControls enableZoom={false} />
      <Omnigen phase={phase} />
    </Canvas>
  )
}
