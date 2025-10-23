import React from 'react'

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500 max-w-md">
            <div className="text-6xl mb-4">�</div>
            <h2 className="text-red-400 text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-red-300 mb-4">The application encountered an error</p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-black/50 p-3 rounded mb-4 text-xs">
                <summary className="cursor-pointer text-yellow-400">Error Details</summary>
                <div className="mt-2 text-red-300">
                  <div><strong>Error:</strong> {this.state.error.message}</div>
                  <div className="mt-2 max-h-32 overflow-auto">
                    <strong>Stack:</strong>
                    <pre className="text-xs text-gray-400">{this.state.error.stack}</pre>
                  </div>
                </div>
              </details>
            )}
            
            <div className="space-y-2">
              <button 
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Reload App
              </button>
            </div>
          </div>
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