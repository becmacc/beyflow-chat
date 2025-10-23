/**
 * 🚀 PERFORMANCE OPTIMIZATION SYSTEM
 * Code splitting, lazy loading, memoization, and performance monitoring
 */
import { memo, lazy, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { useBeyFlowStore } from './UnifiedStore.js'

// 🎯 Performance Monitoring Hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    fps: 60,
    componentCount: 0,
    updateCount: 0
  })
  
  const renderStartTime = useRef(performance.now())
  const frameCount = useRef(0)
  const lastFrameTime = useRef(performance.now())
  
  useEffect(() => {
    // FPS monitoring
    const measureFPS = () => {
      const now = performance.now()
      frameCount.current++
      
      if (now - lastFrameTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastFrameTime.current))
        setMetrics(prev => ({ ...prev, fps }))
        frameCount.current = 0
        lastFrameTime.current = now
      }
      
      requestAnimationFrame(measureFPS)
    }
    
    measureFPS()
    
    // Memory monitoring (if available)
    const measureMemory = () => {
      if (performance.memory) {
        const memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
        setMetrics(prev => ({ ...prev, memoryUsage }))
      }
    }
    
    const memoryInterval = setInterval(measureMemory, 5000)
    
    return () => {
      clearInterval(memoryInterval)
    }
  }, [])
  
  // Render time tracking
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    setMetrics(prev => ({ 
      ...prev, 
      renderTime: Math.round(renderTime),
      updateCount: prev.updateCount + 1
    }))
  })
  
  // Update store with performance metrics
  useEffect(() => {
    const store = useBeyFlowStore.getState()
    store.actions.updatePerformance(metrics)
  }, [metrics])
  
  return metrics
}

// 🧠 Smart Memoization Hook
export const useSmartMemo = (factory, deps, options = {}) => {
  const { 
    maxAge = 5000, // 5 seconds default cache
    compareFunction = (a, b) => JSON.stringify(a) === JSON.stringify(b)
  } = options
  
  const cache = useRef(new Map())
  const lastCleanup = useRef(Date.now())
  
  // Cleanup old entries periodically
  const cleanup = useCallback(() => {
    const now = Date.now()
    if (now - lastCleanup.current > maxAge) {
      for (const [key, { timestamp }] of cache.current.entries()) {
        if (now - timestamp > maxAge) {
          cache.current.delete(key)
        }
      }
      lastCleanup.current = now
    }
  }, [maxAge])
  
  return useMemo(() => {
    cleanup()
    
    const key = JSON.stringify(deps)
    const cached = cache.current.get(key)
    
    if (cached) {
      // Check if cached value is still valid
      if (Date.now() - cached.timestamp < maxAge) {
        return cached.value
      }
    }
    
    // Compute new value
    const value = factory()
    cache.current.set(key, {
      value,
      timestamp: Date.now()
    })
    
    return value
  }, deps)
}

// 📦 Lazy Component Loader with Error Boundaries
export const createLazyComponent = (importFunc, options = {}) => {
  const {
    fallback = <div className="animate-pulse bg-gray-700 rounded h-32" />,
    retries = 3,
    delay = 200
  } = options
  
  let retryCount = 0
  
  const LazyComponent = lazy(() =>
    importFunc().catch((error) => {
      if (retryCount < retries) {
        retryCount++
        return new Promise((resolve) => {
          setTimeout(() => resolve(importFunc()), delay * retryCount)
        })
      }
      throw error
    })
  )
  
  return memo((props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  ))
}

// 🔄 Virtual Scrolling Hook
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length)
    
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, items.length])
  
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      ...item,
      virtualIndex: visibleRange.startIndex + index
    }))
  }, [items, visibleRange])
  
  const totalHeight = items.length * itemHeight
  const offsetY = visibleRange.startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  }
}

// 🎭 Component Bundle Splitter
export const BundleSplitter = {
  // Core components (always loaded)
  Core: {
    Button: () => import('../core/StandardComponents.js').then(m => ({ default: m.Button })),
    Input: () => import('../core/StandardComponents.js').then(m => ({ default: m.Input })),
    Card: () => import('../core/StandardComponents.js').then(m => ({ default: m.Card }))
  },
  
  // Feature modules (lazy loaded)
  Modules: {
    ChatPanel: () => import('../modules/ChatPanel.jsx'),
    BeyTVModule: () => import('../modules/BeyTVModule.jsx'),
    StackBlogModule: () => import('../modules/StackBlogModule.jsx'),
    OmnisphereModule: () => import('../modules/OmnisphereModule.jsx'),
    Visualizer3D: () => import('../modules/Visualizer3D.jsx'),
    SessionManager: () => import('../modules/SessionManager.jsx'),
    AIStudio: () => import('../modules/AIStudio.jsx'),
    WorkflowBuilder: () => import('../modules/WorkflowBuilder.jsx')
  },
  
  // UI components (lazy loaded)
  UI: {
    IntegrationDashboard: () => import('../components/IntegrationDashboard.jsx'),
    PerformanceMonitor: () => import('../components/PerformanceMonitor.jsx'),
    BrandAssets: () => import('../components/BrandAssets.jsx')
  }
}

// 🚀 Preload Manager
export const PreloadManager = {
  // Preload critical components
  preloadCritical: async () => {
    const criticalComponents = [
      BundleSplitter.Core.Button,
      BundleSplitter.Core.Input,
      BundleSplitter.Core.Card,
      BundleSplitter.Modules.ChatPanel
    ]
    
    await Promise.all(criticalComponents.map(loader => loader()))
  },
  
  // Preload on user interaction
  preloadOnInteraction: (moduleId) => {
    if (BundleSplitter.Modules[moduleId]) {
      BundleSplitter.Modules[moduleId]()
    }
  },
  
  // Preload on idle
  preloadOnIdle: () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload non-critical components during idle time
        Object.values(BundleSplitter.UI).forEach(loader => loader())
      })
    }
  }
}

// 📊 Performance Optimized Component HOC
export const withPerformanceOptimization = (Component, options = {}) => {
  const {
    enableVirtualization = false,
    memoizeProps = true,
    trackPerformance = false
  } = options
  
  return memo((props) => {
    const startTime = useRef(performance.now())
    const renderCount = useRef(0)
    
    // Memoize expensive props
    const memoizedProps = useMemo(() => {
      if (!memoizeProps) return props
      
      const expensive = {}
      for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'object' && value !== null) {
          expensive[key] = value
        }
      }
      return expensive
    }, memoizeProps ? [JSON.stringify(props)] : [props])
    
    // Track render performance
    useEffect(() => {
      if (trackPerformance) {
        const renderTime = performance.now() - startTime.current
        renderCount.current++
        
        console.log(`${Component.name || 'Component'} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`)
      }
    })
    
    return <Component {...props} {...memoizedProps} />
  }, (prevProps, nextProps) => {
    // Custom comparison for better memoization
    if (Object.keys(prevProps).length !== Object.keys(nextProps).length) {
      return false
    }
    
    for (const key of Object.keys(prevProps)) {
      if (prevProps[key] !== nextProps[key]) {
        return false
      }
    }
    
    return true
  })
}

// 🔄 Resource Optimizer
export const ResourceOptimizer = {
  // Image lazy loading with intersection observer
  createLazyImage: (src, options = {}) => {
    const { threshold = 0.1, rootMargin = '10px' } = options
    
    return memo(({ alt, className, ...props }) => {
      const [isLoaded, setIsLoaded] = useState(false)
      const [isVisible, setIsVisible] = useState(false)
      const imgRef = useRef()
      
      useEffect(() => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              observer.disconnect()
            }
          },
          { threshold, rootMargin }
        )
        
        if (imgRef.current) {
          observer.observe(imgRef.current)
        }
        
        return () => observer.disconnect()
      }, [])
      
      return (
        <div ref={imgRef} className={className}>
          {isVisible && (
            <img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              {...props}
            />
          )}
          {!isLoaded && isVisible && (
            <div className="animate-pulse bg-gray-700 rounded h-full w-full" />
          )}
        </div>
      )
    })
  },
  
  // Service worker for caching
  registerServiceWorker: () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration)
        })
        .catch(error => {
          console.log('SW registration failed:', error)
        })
    }
  }
}

// 📱 Mobile Performance Optimizations
export const MobileOptimizer = {
  // Reduce animations on low-end devices
  shouldReduceAnimations: () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (connection) {
      return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
    }
    return false
  },
  
  // Optimize for battery
  shouldOptimizeForBattery: () => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        return battery.level < 0.2 && !battery.charging
      })
    }
    return false
  },
  
  // Reduce quality on mobile
  getMobileQualitySettings: () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      return {
        particleCount: 25, // Reduced from 100
        animationDuration: 0.2, // Faster animations
        backdropFilter: 'blur(4px)', // Less blur
        shadows: false // Disable shadows
      }
    }
    
    return {
      particleCount: 100,
      animationDuration: 0.3,
      backdropFilter: 'blur(16px)',
      shadows: true
    }
  }
}

// 🎯 Performance Utilities
export const PerformanceUtils = {
  // Debounce hook
  useDebounce: (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      
      return () => clearTimeout(handler)
    }, [value, delay])
    
    return debouncedValue
  },
  
  // Throttle hook
  useThrottle: (value, limit) => {
    const [throttledValue, setThrottledValue] = useState(value)
    const lastRan = useRef(Date.now())
    
    useEffect(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      } else {
        const handler = setTimeout(() => {
          setThrottledValue(value)
          lastRan.current = Date.now()
        }, limit - (Date.now() - lastRan.current))
        
        return () => clearTimeout(handler)
      }
    }, [value, limit])
    
    return throttledValue
  },
  
  // Memory cleanup
  useMemoryCleanup: () => {
    useEffect(() => {
      const cleanup = () => {
        // Force garbage collection if available
        if (window.gc) {
          window.gc()
        }
      }
      
      const interval = setInterval(cleanup, 30000) // Every 30 seconds
      
      return () => {
        clearInterval(interval)
        cleanup()
      }
    }, [])
  }
}

export default {
  usePerformanceMonitor,
  useSmartMemo,
  createLazyComponent,
  useVirtualScrolling,
  BundleSplitter,
  PreloadManager,
  withPerformanceOptimization,
  ResourceOptimizer,
  MobileOptimizer,
  PerformanceUtils
}