import React, { useState, useEffect } from 'react'

export default function SystemDiagnostic() {
  const [status, setStatus] = useState({})
  const [errors, setErrors] = useState([])
  const [isVisible, setIsVisible] = useState(true)
  
  useEffect(() => {
    const checkComponents = async () => {
      const checks = {
        // Core modules
        ChatPanel: () => import('../modules/ChatPanel'),
        Sidebar: () => import('../modules/Sidebar'),
        
        // Store
        UnifiedStore: () => import('../core/UnifiedStore'),
        
        // UI System
        ErrorBoundary: () => import('./ErrorBoundary'),
        
        // External deps
        framerMotion: () => import('framer-motion'),
      }
      
      const results = {}
      
      for (const [name, importFn] of Object.entries(checks)) {
        try {
          await importFn()
          results[name] = { status: 'OK', error: null }
        } catch (error) {
          results[name] = { status: 'FAILED', error: error.message }
          setErrors(prev => [...prev, { component: name, error: error.message }])
        }
      }
      
      setStatus(results)
    }
    
    checkComponents()
    
    // Listen for runtime errors
    const errorHandler = (event) => {
      setErrors(prev => [...prev, {
        component: 'Runtime',
        error: event.error?.message || event.message || 'Unknown error',
        timestamp: new Date().toISOString()
      }])
    }
    
    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', (event) => {
      setErrors(prev => [...prev, {
        component: 'Promise',
        error: event.reason?.message || event.reason || 'Promise rejection',
        timestamp: new Date().toISOString()
      }])
    })
    
    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', errorHandler)
    }
  }, [])
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-lg border border-cyan-500/30 z-50"
        title="Show System Diagnostic"
      >
        🔍
      </button>
    )
  }
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg border border-cyan-500 max-w-md max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-cyan-400 font-bold">🔍 System Diagnostic</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs mb-4">
        <h4 className="text-cyan-300 font-semibold">Component Status:</h4>
        {Object.entries(status).map(([name, result]) => (
          <div key={name} className="flex items-center justify-between">
            <span className="truncate">{name}</span>
            <span className={result.status === 'OK' ? 'text-green-400' : 'text-red-400'}>
              {result.status === 'OK' ? '✅' : '❌'}
            </span>
          </div>
        ))}
      </div>
      
      {errors.length > 0 && (
        <div className="pt-3 border-t border-gray-700">
          <h4 className="text-red-400 font-semibold mb-2">Errors ({errors.length}):</h4>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {errors.slice(-5).map((error, i) => (
              <div key={i} className="text-xs text-red-300 p-2 bg-red-900/20 rounded">
                <div className="font-semibold">{error.component}:</div>
                <div className="truncate">{error.error}</div>
                {error.timestamp && (
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setErrors([])}
            className="mt-2 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded border border-red-500/30"
          >
            Clear Errors
          </button>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">
        <div>Node Env: {import.meta.env.MODE}</div>
        <div>Timestamp: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}