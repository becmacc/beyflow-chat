import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Performance monitoring system
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      loadTime: 0,
      renderTime: 0,
      componentCounts: {},
      eventCounts: {},
      errorCounts: 0,
      networkRequests: 0
    }
    
    this.history = {
      fps: [],
      memory: [],
      frameTime: [],
      renderTime: []
    }
    
    this.listeners = new Set()
    this.lastFrameTime = performance.now()
    this.frameCount = 0
    this.isMonitoring = false
    this.observedComponents = new Map()
    
    // Bind methods
    this.measureFrame = this.measureFrame.bind(this)
    this.startMonitoring = this.startMonitoring.bind(this)
    this.stopMonitoring = this.stopMonitoring.bind(this)
  }
  
  startMonitoring() {
    if (this.isMonitoring) return
    
    this.isMonitoring = true
    this.measureFrame()
    
    // Memory monitoring
    if (performance.memory) {
      this.memoryInterval = setInterval(() => {
        this.updateMemoryUsage()
      }, 1000)
    }
    
    // Network monitoring
    this.observeNetworkRequests()
    
    // Error monitoring
    this.observeErrors()
    
    // Component monitoring
    this.observeComponentUpdates()
  }
  
  stopMonitoring() {
    this.isMonitoring = false
    
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval)
    }
    
    if (this.networkObserver) {
      this.networkObserver.disconnect()
    }
    
    // Remove error listeners
    window.removeEventListener('error', this.errorHandler)
    window.removeEventListener('unhandledrejection', this.errorHandler)
  }
  
  measureFrame() {
    if (!this.isMonitoring) return
    
    const now = performance.now()
    const frameTime = now - this.lastFrameTime
    this.lastFrameTime = now
    
    // Calculate FPS
    this.frameCount++
    if (this.frameCount % 60 === 0) {
      this.metrics.fps = Math.round(1000 / frameTime)
      this.history.fps.push(this.metrics.fps)
      
      // Keep only last 100 samples
      if (this.history.fps.length > 100) {
        this.history.fps = this.history.fps.slice(-100)
      }
    }
    
    // Track frame time
    this.metrics.frameTime = frameTime
    this.history.frameTime.push(frameTime)
    if (this.history.frameTime.length > 1000) {
      this.history.frameTime = this.history.frameTime.slice(-1000)
    }
    
    // Measure render time
    this.measureRenderTime()
    
    // Notify listeners
    this.notifyListeners()
    
    requestAnimationFrame(this.measureFrame)
  }
  
  measureRenderTime() {
    const renderStart = performance.now()
    
    // Measure actual render work (simplified)
    setTimeout(() => {
      const renderEnd = performance.now()
      this.metrics.renderTime = renderEnd - renderStart
      this.history.renderTime.push(this.metrics.renderTime)
      
      if (this.history.renderTime.length > 100) {
        this.history.renderTime = this.history.renderTime.slice(-100)
      }
    }, 0)
  }
  
  updateMemoryUsage() {
    if (performance.memory) {
      const usage = performance.memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
      this.metrics.memoryUsage = Math.round(usage * 100) / 100
      this.history.memory.push(usage)
      
      if (this.history.memory.length > 300) { // 5 minutes at 1s intervals
        this.history.memory = this.history.memory.slice(-300)
      }
    }
  }
  
  observeNetworkRequests() {
    // Monitor fetch requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      this.metrics.networkRequests++
      const start = performance.now()
      
      try {
        const response = await originalFetch(...args)
        const duration = performance.now() - start
        
        this.trackNetworkRequest({
          method: args[1]?.method || 'GET',
          url: args[0],
          status: response.status,
          duration
        })
        
        return response
      } catch (error) {
        this.trackNetworkRequest({
          method: args[1]?.method || 'GET',
          url: args[0],
          error: error.message,
          duration: performance.now() - start
        })
        throw error
      }
    }
  }
  
  trackNetworkRequest(details) {
    // Could emit to analytics or store for debugging
    if (this.listeners.size > 0) {
      this.notifyListeners('networkRequest', details)
    }
  }
  
  observeErrors() {
    this.errorHandler = (event) => {
      this.metrics.errorCounts++
      
      const errorDetails = {
        message: event.error?.message || event.reason?.message || 'Unknown error',
        stack: event.error?.stack || event.reason?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
      }
      
      this.notifyListeners('error', errorDetails)
    }
    
    window.addEventListener('error', this.errorHandler)
    window.addEventListener('unhandledrejection', this.errorHandler)
  }
  
  observeComponentUpdates() {
    // This would integrate with React DevTools or custom instrumentation
    // For now, we'll track via manual registration
  }
  
  registerComponent(name, instance) {
    this.observedComponents.set(name, {
      instance,
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0
    })
  }
  
  trackComponentRender(name, renderTime) {
    const component = this.observedComponents.get(name)
    if (component) {
      component.renderCount++
      component.lastRenderTime = renderTime
      component.averageRenderTime = (component.averageRenderTime + renderTime) / 2
      
      this.metrics.componentCounts[name] = component.renderCount
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      history: { ...this.history },
      components: Array.from(this.observedComponents.entries()).map(([name, data]) => ({
        name,
        ...data
      }))
    }
  }
  
  getInsights() {
    const insights = []
    
    // FPS insights
    const avgFPS = this.history.fps.reduce((sum, fps) => sum + fps, 0) / this.history.fps.length
    if (avgFPS < 30) {
      insights.push({
        type: 'performance',
        severity: 'warning',
        message: `Low FPS detected: ${avgFPS.toFixed(1)} FPS (target: 60 FPS)`,
        suggestion: 'Consider reducing visual complexity or enabling performance optimizations'
      })
    }
    
    // Memory insights
    const memoryTrend = this.getMemoryTrend()
    if (memoryTrend > 5) { // More than 5MB increase
      insights.push({
        type: 'memory',
        severity: 'warning',
        message: `Memory usage increasing: +${memoryTrend.toFixed(1)}MB`,
        suggestion: 'Check for memory leaks in components or audio processing'
      })
    }
    
    // Frame time insights
    const avgFrameTime = this.history.frameTime.reduce((sum, time) => sum + time, 0) / this.history.frameTime.length
    if (avgFrameTime > 16.67) { // Longer than 60fps target
      insights.push({
        type: 'performance',
        severity: 'info',
        message: `Frame time above 60 FPS target: ${avgFrameTime.toFixed(2)}ms`,
        suggestion: 'Consider optimizing render-heavy components'
      })
    }
    
    // Error insights
    if (this.metrics.errorCounts > 0) {
      insights.push({
        type: 'errors',
        severity: 'error',
        message: `${this.metrics.errorCounts} errors detected`,
        suggestion: 'Check browser console for error details'
      })
    }
    
    return insights
  }
  
  getMemoryTrend() {
    if (this.history.memory.length < 10) return 0
    
    const recent = this.history.memory.slice(-10)
    const older = this.history.memory.slice(-20, -10)
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length
    const olderAvg = older.reduce((sum, val) => sum + val, 0) / older.length
    
    return recentAvg - olderAvg
  }
  
  addListener(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }
  
  notifyListeners(event = 'update', data = null) {
    for (const callback of this.listeners) {
      try {
        callback(event, data || this.getMetrics())
      } catch (error) {
        console.error('Performance monitor listener error:', error)
      }
    }
  }
  
  reset() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      loadTime: 0,
      renderTime: 0,
      componentCounts: {},
      eventCounts: {},
      errorCounts: 0,
      networkRequests: 0
    }
    
    this.history = {
      fps: [],
      memory: [],
      frameTime: [],
      renderTime: []
    }
    
    this.frameCount = 0
  }
}

// React component for displaying performance metrics
export function PerformancePanel({ isVisible = false, position = 'top-right' }) {
  const [monitor] = useState(() => new PerformanceMonitor())
  const [metrics, setMetrics] = useState(monitor.getMetrics())
  const [insights, setInsights] = useState([])
  const [selectedTab, setSelectedTab] = useState('overview')
  
  useEffect(() => {
    monitor.startMonitoring()
    
    const unsubscribe = monitor.addListener((event, data) => {
      if (event === 'update') {
        setMetrics(data)
        setInsights(monitor.getInsights())
      }
    })
    
    // Update insights periodically
    const insightInterval = setInterval(() => {
      setInsights(monitor.getInsights())
    }, 5000)
    
    return () => {
      monitor.stopMonitoring()
      unsubscribe()
      clearInterval(insightInterval)
    }
  }, [monitor])
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-red-400 bg-red-900/20'
      case 'warning': return 'text-yellow-400 bg-yellow-900/20'
      case 'info': return 'text-blue-400 bg-blue-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }
  
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`fixed ${positionClasses[position]} z-50 w-96 max-h-96 overflow-hidden`}
        >
          <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 text-white text-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm">Performance Monitor</h3>
              <div className="flex space-x-1">
                {['overview', 'metrics', 'insights'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      selectedTab === tab 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {selectedTab === 'overview' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded p-2">
                    <div className="text-gray-400">FPS</div>
                    <div className={`text-lg font-bold ${
                      metrics.fps >= 45 ? 'text-green-400' : 
                      metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {metrics.fps}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded p-2">
                    <div className="text-gray-400">Memory</div>
                    <div className="text-lg font-bold text-blue-400">
                      {metrics.memoryUsage} MB
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded p-2">
                    <div className="text-gray-400">Frame Time</div>
                    <div className="text-lg font-bold text-purple-400">
                      {metrics.frameTime.toFixed(1)} ms
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded p-2">
                    <div className="text-gray-400">Errors</div>
                    <div className={`text-lg font-bold ${
                      metrics.errorCounts === 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metrics.errorCounts}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTab === 'metrics' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Render Time:</span>
                    <span>{metrics.renderTime.toFixed(2)} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network Requests:</span>
                    <span>{metrics.networkRequests}</span>
                  </div>
                  
                  {/* FPS History Mini Chart */}
                  <div className="mt-3">
                    <div className="text-gray-400 mb-1">FPS History</div>
                    <div className="flex items-end space-x-1 h-8">
                      {metrics.history.fps.slice(-20).map((fps, i) => (
                        <div
                          key={i}
                          className={`w-1 ${
                            fps >= 45 ? 'bg-green-400' : 
                            fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{ height: `${(fps / 60) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Memory History Mini Chart */}
                  <div className="mt-3">
                    <div className="text-gray-400 mb-1">Memory History</div>
                    <div className="flex items-end space-x-1 h-8">
                      {metrics.history.memory.slice(-20).map((mem, i) => (
                        <div
                          key={i}
                          className="w-1 bg-blue-400"
                          style={{ 
                            height: `${Math.min((mem / Math.max(...metrics.history.memory)) * 100, 100)}%` 
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedTab === 'insights' && (
                <div className="space-y-2">
                  {insights.length === 0 ? (
                    <div className="text-gray-400 text-center py-4">
                      All systems running smoothly! ✨
                    </div>
                  ) : (
                    insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-2 rounded border-l-2 ${getSeverityColor(insight.severity)}`}
                        style={{
                          borderLeftColor: insight.severity === 'error' ? '#f87171' :
                                          insight.severity === 'warning' ? '#fbbf24' : '#60a5fa'
                        }}
                      >
                        <div className="font-medium">{insight.message}</div>
                        {insight.suggestion && (
                          <div className="text-xs text-gray-400 mt-1">
                            💡 {insight.suggestion}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for using performance monitoring
export function usePerformanceMonitor() {
  const [monitor] = useState(() => new PerformanceMonitor())
  const [metrics, setMetrics] = useState(monitor.getMetrics())
  const [isMonitoring, setIsMonitoring] = useState(false)
  
  useEffect(() => {
    const unsubscribe = monitor.addListener((event, data) => {
      if (event === 'update') {
        setMetrics(data)
      }
    })
    
    return unsubscribe
  }, [monitor])
  
  const startMonitoring = () => {
    monitor.startMonitoring()
    setIsMonitoring(true)
  }
  
  const stopMonitoring = () => {
    monitor.stopMonitoring()
    setIsMonitoring(false)
  }
  
  const trackComponent = (name, renderTime) => {
    monitor.trackComponentRender(name, renderTime)
  }
  
  const getInsights = () => monitor.getInsights()
  
  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    trackComponent,
    getInsights,
    reset: monitor.reset.bind(monitor)
  }
}

export default PerformanceMonitor