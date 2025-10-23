import React, { useRef, useMemo, useLayoutEffect, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { perfMonitor } from '../utils/AdvancedPerformanceMonitor'

export const OptimizedInstancedBoxes = ({ count = 100, audioData = null }) => {
  const meshRef = useRef()
  const { invalidate } = useThree()
  const needsRender = useRef(true)
  const lastCameraPosition = useRef(new THREE.Vector3())
  const frameSkipCounter = useRef(0)
  
  const dummyObject = useMemo(() => new THREE.Object3D(), [])
  const colorArray = useMemo(() => new Float32Array(count * 3), [count])
  const positionArray = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 20,
      rotationSpeed: Math.random() * 0.02 + 0.01,
      scale: Math.random() * 0.5 + 0.5
    }))
  }, [count])
  
  // ⚡ OPTIMIZATION: Trigger render on audio data change
  useEffect(() => {
    if (audioData) {
      needsRender.current = true
      invalidate()
    }
  }, [audioData, invalidate])

  // Advanced geometry optimization
  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2) // Reduced segments
    geo.computeBoundingBox()
    geo.computeBoundingSphere()
    
    const mat = new THREE.MeshStandardMaterial({
      color: '#4CC3D9',
      roughness: 0.7,
      metalness: 0.3,
      // Use vertex colors for per-instance coloring
      vertexColors: true
    })
    
    return { geometry: geo, material: mat }
  }, [])

  useLayoutEffect(() => {
    if (!meshRef.current) return

    // Initialize instance matrix and colors
    for (let i = 0; i < count; i++) {
      const { x, y, z, scale } = positionArray[i]
      
      dummyObject.position.set(x, y, z)
      dummyObject.scale.setScalar(scale)
      dummyObject.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummyObject.matrix)
      
      // Set initial colors
      const color = new THREE.Color().setHSL(i / count, 0.7, 0.5)
      colorArray[i * 3] = color.r
      colorArray[i * 3 + 1] = color.g
      colorArray[i * 3 + 2] = color.b
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3))
  }, [count, positionArray, dummyObject, colorArray])

  // ⚡ OPTIMIZATION: Demand-based rendering with aggressive frame skipping
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Check if camera moved
    const cameraMoved = !state.camera.position.equals(lastCameraPosition.current)
    if (cameraMoved) {
      lastCameraPosition.current.copy(state.camera.position)
      needsRender.current = true
    }
    
    // Skip frames when idle (render at 10fps instead of 60fps)
    if (!needsRender.current && !audioData) {
      frameSkipCounter.current++
      if (frameSkipCounter.current < 6) return // Skip 5 frames, render on 6th
      frameSkipCounter.current = 0
    }
    
    // Track render calls for monitoring
    perfMonitor.trackRenderCall()

    for (let i = 0; i < count; i++) {
      const { x, y, z, rotationSpeed, scale } = positionArray[i]
      
      // Audio reactivity
      let audioScale = 1
      let audioRotation = 0
      if (audioData && audioData.length > 0) {
        const frequencyIndex = Math.floor((i / count) * audioData.length)
        const frequency = audioData[frequencyIndex] / 255
        audioScale = 1 + frequency * 0.5
        audioRotation = frequency * 0.1
      }

      dummyObject.position.set(
        x + Math.sin(state.clock.elapsedTime + i) * 0.1,
        y + Math.cos(state.clock.elapsedTime + i) * 0.1,
        z
      )
      dummyObject.rotation.set(
        state.clock.elapsedTime * rotationSpeed + audioRotation,
        state.clock.elapsedTime * rotationSpeed * 0.5,
        0
      )
      dummyObject.scale.setScalar(scale * audioScale)
      dummyObject.updateMatrix()
      
      meshRef.current.setMatrixAt(i, dummyObject.matrix)

      // Update colors based on audio
      if (audioData) {
        const hue = (i / count + state.clock.elapsedTime * 0.1) % 1
        const saturation = 0.7 + (audioData[i % audioData.length] / 255) * 0.3
        const color = new THREE.Color().setHSL(hue, saturation, 0.5)
        
        colorArray[i * 3] = color.r
        colorArray[i * 3 + 1] = color.g
        colorArray[i * 3 + 2] = color.b
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.geometry.attributes.color.needsUpdate = true
    
    // Mark render as completed
    needsRender.current = false
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} />
  )
}

// Advanced LOD (Level of Detail) system
export const AdaptiveLODScene = () => {
  const { camera } = useThree()
  const [lodLevel, setLodLevel] = useState(2)
  
  useFrame(() => {
    // Adjust quality based on camera distance and performance
    const distance = camera.position.length()
    const fps = 1000 / performance.now()
    
    let newLodLevel = 2
    if (distance > 10 || fps < 30) newLodLevel = 1
    if (distance > 20 || fps < 20) newLodLevel = 0
    
    if (newLodLevel !== lodLevel) {
      setLodLevel(newLodLevel)
    }
  })

  const instanceCount = useMemo(() => {
    return [25, 50, 100][lodLevel] // Adaptive instance count
  }, [lodLevel])

  return <OptimizedInstancedBoxes count={instanceCount} />
}

// Default export for easy importing
export default OptimizedInstancedBoxes