/**
 * 🎮 DEMAND-BASED RENDERING HOOK FOR THREE.JS
 * Only renders when camera moves or state changes
 */
import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { perfMonitor } from '../utils/AdvancedPerformanceMonitor'

export function useDemandRendering(dependencies = []) {
  const { gl, scene, camera, invalidate } = useThree()
  const renderNeededRef = useRef(true)
  const lastCameraPositionRef = useRef(null)
  const frameSkipCounter = useRef(0)
  const renderCallsRef = useRef(0)
  
  // Track camera changes
  useEffect(() => {
    const checkCameraChange = () => {
      if (!lastCameraPositionRef.current) {
        lastCameraPositionRef.current = camera.position.clone()
        return false
      }
      
      const hasChanged = !camera.position.equals(lastCameraPositionRef.current)
      if (hasChanged) {
        lastCameraPositionRef.current = camera.position.clone()
      }
      return hasChanged
    }
    
    // Set up render loop
    const interval = setInterval(() => {
      const cameraChanged = checkCameraChange()
      if (cameraChanged) {
        renderNeededRef.current = true
        invalidate()
      }
    }, 16) // Check ~60fps
    
    return () => clearInterval(interval)
  }, [camera, invalidate])
  
  // Trigger render when dependencies change
  useEffect(() => {
    renderNeededRef.current = true
    invalidate()
  }, dependencies)
  
  // Custom useFrame that only renders when needed
  const demandFrame = (callback, renderPriority = 0) => {
    useFrame((state, delta, xrFrame) => {
      // Skip frames when render not needed (render at 10fps when idle)
      if (!renderNeededRef.current) {
        frameSkipCounter.current++
        if (frameSkipCounter.current < 6) { // Skip 5 frames, render on 6th
          return
        }
        frameSkipCounter.current = 0
      }
      
      // Track render call
      renderCallsRef.current++
      if (renderCallsRef.current % 60 === 0) {
        perfMonitor.trackRenderCall()
      }
      
      // Execute callback
      callback(state, delta, xrFrame)
      
      // Mark render as completed
      renderNeededRef.current = false
    }, renderPriority)
  }
  
  // Force a render
  const forceRender = () => {
    renderNeededRef.current = true
    invalidate()
  }
  
  return {
    demandFrame,
    forceRender,
    renderCalls: renderCallsRef.current
  }
}
