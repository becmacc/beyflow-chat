/**
 * 🛡️ COMPREHENSIVE ERROR BOUNDARY SYSTEM
 * Advanced error handling, loading states, and fallback components
 */
import React, { Component, memo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBeyFlowStore } from '../core/UnifiedStore.js'
import { getThemeStyles } from '../core/StandardComponents.js'

// 🚨 Main Error Boundary Class
class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString()
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
      errorId: Date.now().toString()
    })

    // Log to store
    if (window.beyFlowStore) {
      window.beyFlowStore.getState().actions.addError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.name || 'Unknown',
        timestamp: new Date().toISOString()
      })
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary Caught Error')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.groupEnd()
    }

    // Optional error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          retry={this.retry}
          level={this.props.level || 'component'}
          context={this.props.context}
        />
      )
    }

    return this.props.children
  }
}

// 🎨 Default Error Fallback Component
const DefaultErrorFallback = memo(({ 
  error, 
  errorInfo, 
  retry, 
  level = 'component',
  context 
}) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  const errorLevels = {
    app: {
      icon: '💥',
      title: 'Application Error',
      description: 'The entire application encountered an error'
    },
    module: {
      icon: '🔧',
      title: 'Module Error',
      description: 'This module failed to load properly'
    },
    component: {
      icon: '⚠️',
      title: 'Component Error',
      description: 'A component encountered an error'
    },
    integration: {
      icon: '🔗',
      title: 'Integration Error',
      description: 'An integration service failed'
    }
  }
  
  const errorLevel = errorLevels[level] || errorLevels.component
  
  return (
    <motion.div
      className={`
        p-6 rounded-xl border-2 border-red-400/50 
        bg-red-900/20 backdrop-blur-lg
        ${themeStyles.text}
        max-w-2xl mx-auto
      `.trim()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-3xl">{errorLevel.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-red-400">{errorLevel.title}</h3>
          <p className="text-sm text-gray-400">{errorLevel.description}</p>
        </div>
      </div>
      
      {/* Error Details */}
      <div className="space-y-4">
        <div className="p-4 bg-black/50 rounded-lg">
          <h4 className="font-semibold text-red-300 mb-2">Error Message</h4>
          <p className="text-sm font-mono text-gray-300">
            {error?.message || 'Unknown error occurred'}
          </p>
        </div>
        
        {context && (
          <div className="p-4 bg-black/50 rounded-lg">
            <h4 className="font-semibold text-blue-300 mb-2">Context</h4>
            <p className="text-sm text-gray-300">{context}</p>
          </div>
        )}
        
        {process.env.NODE_ENV === 'development' && error?.stack && (
          <details className="p-4 bg-black/50 rounded-lg">
            <summary className="font-semibold text-yellow-300 cursor-pointer mb-2">
              Stack Trace (Development)
            </summary>
            <pre className="text-xs text-gray-400 overflow-auto whitespace-pre-wrap">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex space-x-3 mt-6">
        <motion.button
          onClick={retry}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔄 Try Again
        </motion.button>
        
        <motion.button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔃 Reload App
        </motion.button>
        
        <motion.button
          onClick={() => {
            const errorData = {
              error: error?.message,
              stack: error?.stack,
              context,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href
            }
            
            const dataStr = JSON.stringify(errorData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            
            const link = document.createElement('a')
            link.href = url
            link.download = `beyflow-error-${Date.now()}.json`
            link.click()
            
            URL.revokeObjectURL(url)
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📥 Export Error
        </motion.button>
      </div>
    </motion.div>
  )
})

// 🔄 Loading States System
export const LoadingFallback = memo(({ 
  type = 'spinner',
  message = 'Loading...',
  size = 'md'
}) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const LoadingTypes = {
    spinner: (
      <div className={`${sizes[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
    ),
    
    dots: (
      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className={`w-3 h-3 bg-current rounded-full`}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    ),
    
    pulse: (
      <motion.div
        className={`${sizes[size]} bg-current rounded-full`}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    ),
    
    skeleton: (
      <div className="space-y-3 w-full">
        <motion.div
          className="h-4 bg-gray-700 rounded w-3/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-4 bg-gray-700 rounded w-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="h-4 bg-gray-700 rounded w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    )
  }
  
  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 ${themeStyles.text}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mb-4 text-cyan-400">
        {LoadingTypes[type]}
      </div>
      <p className={`text-sm ${themeStyles.textMuted}`}>{message}</p>
    </motion.div>
  )
})

// 🎯 Smart Suspense Wrapper
export const SmartSuspense = memo(({ 
  children, 
  fallback, 
  timeout = 5000,
  onTimeout
}) => {
  const [isTimeout, setIsTimeout] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true)
      if (onTimeout) onTimeout()
    }, timeout)
    
    return () => clearTimeout(timer)
  }, [timeout, onTimeout])
  
  if (isTimeout) {
    return (
      <DefaultErrorFallback
        error={{ message: 'Component took too long to load' }}
        level="component"
        context="Loading timeout exceeded"
        retry={() => {
          setIsTimeout(false)
          window.location.reload()
        }}
      />
    )
  }
  
  return (
    <Suspense fallback={fallback || <LoadingFallback />}>
      {children}
    </Suspense>
  )
})

// 🔌 Network Error Fallback
export const NetworkErrorFallback = memo(({ retry, context }) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  return (
    <motion.div
      className={`text-center p-8 ${themeStyles.text}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-6xl mb-4">📡</div>
      <h3 className="text-xl font-bold mb-2">Connection Lost</h3>
      <p className={`${themeStyles.textMuted} mb-4`}>
        {context || 'Unable to connect to the service'}
      </p>
      <motion.button
        onClick={retry}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        🔄 Reconnect
      </motion.button>
    </motion.div>
  )
})

// 🎭 Higher-Order Components for Error Handling
export const withErrorBoundary = (Component, options = {}) => {
  return memo((props) => (
    <EnhancedErrorBoundary
      name={Component.displayName || Component.name}
      level={options.level || 'component'}
      context={options.context}
      fallback={options.fallback}
      onError={options.onError}
    >
      <Component {...props} />
    </EnhancedErrorBoundary>
  ))
}

export const withLoadingState = (Component, options = {}) => {
  return memo((props) => (
    <SmartSuspense
      fallback={<LoadingFallback {...options} />}
      timeout={options.timeout}
      onTimeout={options.onTimeout}
    >
      <Component {...props} />
    </SmartSuspense>
  ))
}

export const withNetworkFallback = (Component, options = {}) => {
  return memo((props) => {
    const [hasNetworkError, setHasNetworkError] = React.useState(false)
    
    React.useEffect(() => {
      const handleOnline = () => setHasNetworkError(false)
      const handleOffline = () => setHasNetworkError(true)
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }, [])
    
    if (hasNetworkError) {
      return (
        <NetworkErrorFallback
          retry={() => setHasNetworkError(false)}
          context={options.context}
        />
      )
    }
    
    return <Component {...props} />
  })
}

// 🔄 Global Error Handler Setup
export const setupGlobalErrorHandling = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    if (window.beyFlowStore) {
      window.beyFlowStore.getState().actions.addError({
        message: `Unhandled Promise: ${event.reason}`,
        type: 'unhandled_promise',
        timestamp: new Date().toISOString()
      })
    }
  })
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    if (window.beyFlowStore) {
      window.beyFlowStore.getState().actions.addError({
        message: event.error?.message || 'Global error',
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'global_error',
        timestamp: new Date().toISOString()
      })
    }
  })
}

// 🚀 Main exports
export {
  EnhancedErrorBoundary as ErrorBoundary,
  DefaultErrorFallback,
  LoadingFallback,
  SmartSuspense,
  NetworkErrorFallback
}

export default {
  ErrorBoundary: EnhancedErrorBoundary,
  LoadingFallback,
  SmartSuspense,
  NetworkErrorFallback,
  withErrorBoundary,
  withLoadingState,
  withNetworkFallback,
  setupGlobalErrorHandling
}