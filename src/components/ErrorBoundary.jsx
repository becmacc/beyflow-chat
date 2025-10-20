import React from 'react'
import { motion } from 'framer-motion'

class ErrorBoundary extends React.Component {
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
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error('🚨 BeyFlow Error Boundary Caught:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })

    // Store error info for display
    this.setState({
      error,
      errorInfo
    })

    // Send to analytics/monitoring service
    this.reportError(error, errorInfo)
  }

  reportError = (error, errorInfo) => {
    try {
      // Send to analytics if available
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.track('Application Error', {
          errorMessage: error.message,
          errorStack: error.stack,
          componentStack: errorInfo.componentStack,
          errorId: this.state.errorId,
          timestamp: Date.now(),
          buildVersion: import.meta.env.VITE_APP_VERSION || 'unknown'
        })
      }

      // Send to external monitoring service (example)
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          buildVersion: import.meta.env.VITE_APP_VERSION
        })
      }).catch(err => {
        console.warn('Failed to report error to monitoring service:', err)
      })
    } catch (reportingError) {
      console.warn('Error reporting failed:', reportingError)
    }
  }

  handleRetry = () => {
    // Clear error state and try to recover
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReportIssue = () => {
    const issueBody = encodeURIComponent(`
🚨 BeyFlow Error Report

**Error ID:** ${this.state.errorId}
**Timestamp:** ${new Date().toISOString()}
**Error Message:** ${this.state.error?.message || 'Unknown error'}

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[Describe what should happen]

**Actual Behavior:**
[Describe what actually happened]

**Additional Context:**
- Browser: ${navigator.userAgent}
- URL: ${window.location.href}
- Build Version: ${import.meta.env.VITE_APP_VERSION || 'unknown'}

**Technical Details:**
\`\`\`
${this.state.error?.stack || 'No stack trace available'}
\`\`\`
    `)

    window.open(`https://github.com/your-repo/beyflow-chat/issues/new?title=Application Error: ${this.state.errorId}&body=${issueBody}`, '_blank')
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
          <motion.div 
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Animated Error Icon */}
            <motion.div
              className="text-8xl mb-6"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              🚀💥
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold text-white mb-4 gradient-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Houston, we have a problem!
            </motion.h1>

            <motion.p 
              className="text-xl text-white/80 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The BeyFlow experience encountered an unexpected error
            </motion.p>

            {/* Error Details (Developer Mode) */}
            {import.meta.env.DEV && (
              <motion.details 
                className="text-left bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <summary className="text-white font-semibold cursor-pointer hover:text-cyan-400 transition-colors">
                  🔍 Error Details (Dev Mode)
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-cyan-400 font-semibold">Error ID:</h4>
                    <code className="text-sm text-white/80 bg-black/50 px-3 py-1 rounded">
                      {this.state.errorId}
                    </code>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold">Message:</h4>
                    <code className="text-sm text-red-300 bg-black/50 px-3 py-1 rounded block">
                      {this.state.error?.message}
                    </code>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold">Stack Trace:</h4>
                    <pre className="text-xs text-white/60 bg-black/50 p-3 rounded overflow-x-auto max-h-32">
                      {this.state.error?.stack}
                    </pre>
                  </div>
                </div>
              </motion.details>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={this.handleRetry}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔄 Try Again
              </motion.button>

              <motion.button
                onClick={this.handleReload}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Restart Mission
              </motion.button>

              <motion.button
                onClick={this.handleReportIssue}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📧 Report Issue
              </motion.button>
            </motion.div>

            {/* Helpful Tips */}
            <motion.div 
              className="mt-8 text-sm text-white/60"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p>💡 Try refreshing the page or check your internet connection</p>
              <p className="mt-2">Error ID: <code className="text-cyan-400">{this.state.errorId}</code></p>
            </motion.div>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Error Recovery Hook for functional components
export const useErrorRecovery = () => {
  const [error, setError] = React.useState(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error, errorInfo = {}) => {
    console.error('Component Error:', error)
    setError({ error, errorInfo, timestamp: Date.now() })
  }, [])

  // Global error handler
  React.useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled Promise Rejection:', event.reason)
      captureError(event.reason, { type: 'unhandledRejection' })
    }

    const handleError = (event) => {
      console.error('Global Error:', event.error)
      captureError(event.error, { type: 'globalError' })
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [captureError])

  return { error, resetError, captureError }
}