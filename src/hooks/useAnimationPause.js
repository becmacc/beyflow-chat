/**
 * 🎬 ANIMATION PAUSE HOOK
 * Automatically pauses animations when components are off-screen
 */
import { useState, useEffect, useRef } from 'react'
import { perfMonitor } from '../utils/AdvancedPerformanceMonitor'

export function useAnimationPause(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    pauseDelay = 100 // Delay before pausing (debounce)
  } = options
  
  const [isVisible, setIsVisible] = useState(true)
  const [shouldAnimate, setShouldAnimate] = useState(true)
  const ref = useRef(null)
  const timeoutRef = useRef(null)
  const wasPausedRef = useRef(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    // Create Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsVisible(visible)
        
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        if (visible) {
          // Resume animation immediately when visible
          setShouldAnimate(true)
          if (wasPausedRef.current) {
            console.log('▶️  Animation resumed:', element.className)
            wasPausedRef.current = false
          }
        } else {
          // Pause animation after delay when not visible
          timeoutRef.current = setTimeout(() => {
            setShouldAnimate(false)
            wasPausedRef.current = true
            perfMonitor.trackAnimationPause()
            console.log('⏸️  Animation paused:', element.className)
          }, pauseDelay)
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => {
      observer.disconnect()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [threshold, rootMargin, pauseDelay])
  
  return { ref, isVisible, shouldAnimate }
}

// HOC version for wrapping components
export function withAnimationPause(Component, options = {}) {
  return function AnimationPausedComponent(props) {
    const { ref, isVisible, shouldAnimate } = useAnimationPause(options)
    
    return (
      <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <Component {...props} isVisible={isVisible} shouldAnimate={shouldAnimate} />
      </div>
    )
  }
}
