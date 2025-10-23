/**
 * 📱 ORIENTATION CHANGE HOOK
 * Handles portrait/landscape transitions and triggers layout recalculation
 */
import { useState, useEffect, useCallback } from 'react'

export function useOrientationChange(onOrientationChange) {
  const [orientation, setOrientation] = useState(() => {
    if (typeof window === 'undefined') return 'landscape'
    
    // Check both screen.orientation API and window dimensions
    if (window.screen?.orientation?.type) {
      return window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
    }
    
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  })
  
  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }))
  
  const recalculateLayout = useCallback(() => {
    // Force layout recalculation
    if (typeof window !== 'undefined') {
      // Trigger reflow
      void document.body.offsetHeight
      
      // Dispatch custom event for components to listen
      window.dispatchEvent(new CustomEvent('layout-recalculate', {
        detail: {
          orientation,
          dimensions: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }))
      
      console.log(`📐 Layout recalculated for ${orientation} mode: ${window.innerWidth}x${window.innerHeight}`)
    }
  }, [orientation])
  
  useEffect(() => {
    const handleOrientationChange = () => {
      // Determine new orientation
      let newOrientation
      
      if (window.screen?.orientation?.type) {
        newOrientation = window.screen.orientation.type.includes('portrait') ? 'portrait' : 'landscape'
      } else {
        newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      }
      
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      
      console.log(`🔄 Orientation changed: ${orientation} → ${newOrientation}`)
      
      setOrientation(newOrientation)
      setDimensions(newDimensions)
      
      // Call callback if provided
      if (onOrientationChange) {
        onOrientationChange(newOrientation, newDimensions)
      }
      
      // Recalculate layout after a short delay (allow browser to settle)
      setTimeout(recalculateLayout, 100)
    }
    
    const handleResize = () => {
      const newDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      
      const newOrientation = newDimensions.height > newDimensions.width ? 'portrait' : 'landscape'
      
      if (newOrientation !== orientation) {
        handleOrientationChange()
      } else {
        setDimensions(newDimensions)
      }
    }
    
    // Listen to orientation change events
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleResize)
    
    // Also listen to screen.orientation API if available
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange)
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleResize)
      
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange)
      }
    }
  }, [orientation, onOrientationChange, recalculateLayout])
  
  return {
    orientation,
    dimensions,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    recalculateLayout
  }
}
