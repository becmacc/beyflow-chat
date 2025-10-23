/**
 * 🎨 STANDARDIZED COMPONENT PATTERNS
 * Consistent patterns for modules, hooks, utilities, and component structure
 */
import { memo, forwardRef, lazy, Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBeyFlowStore, useLoading, useNotifications } from '../core/UnifiedStore.js'

// 🎯 Standard Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  },
  
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    exit: { opacity: 0, scale: 0.3 }
  }
}

// 🎨 Standard Theme System
export const getThemeStyles = (themePersona = 'dopaminergic') => {
  const themes = {
    dopaminergic: {
      bg: 'bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-teal-900/40',
      card: 'bg-black/30 border-cyan-400/20',
      text: 'text-white',
      textMuted: 'text-gray-400',
      accent: 'text-cyan-400',
      border: 'border-cyan-400/20',
      button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500',
      focus: 'focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
    },
    
    terminal: {
      bg: 'bg-black/50',
      card: 'bg-green-900/10 border-green-400/20',
      text: 'text-green-400',
      textMuted: 'text-green-400/60',
      accent: 'text-green-300',
      border: 'border-green-400/20',
      button: 'bg-green-600 hover:bg-green-500',
      focus: 'focus:ring-2 focus:ring-green-400 focus:border-transparent'
    },
    
    glassmorphic: {
      bg: 'bg-white/5 backdrop-blur-xl',
      card: 'bg-white/10 border-white/20',
      text: 'text-white',
      textMuted: 'text-white/70',
      accent: 'text-blue-300',
      border: 'border-white/20',
      button: 'bg-white/20 hover:bg-white/30',
      focus: 'focus:ring-2 focus:ring-white/50 focus:border-transparent'
    }
  }
  
  return themes[themePersona] || themes.dopaminergic
}

// 🧩 Base Component HOC
export const withStandardProps = (Component) => {
  return memo(forwardRef(({ 
    className = '',
    variant = 'default',
    size = 'md',
    loading = false,
    disabled = false,
    animated = true,
    animationVariant = 'fadeIn',
    ...props 
  }, ref) => {
    const theme = useBeyFlowStore(state => state.ui.themePersona)
    const spectrum = useBeyFlowStore(state => state.ui.spectrum)
    const themeStyles = getThemeStyles(theme)
    
    const baseClassName = `
      ${themeStyles.text}
      ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim()
    
    const Wrapper = animated ? motion.div : 'div'
    const wrapperProps = animated ? {
      variants: ANIMATION_VARIANTS[animationVariant],
      initial: "initial",
      animate: "animate",
      exit: "exit",
      transition: { duration: 0.3 }
    } : {}
    
    return (
      <Wrapper {...wrapperProps}>
        <Component
          ref={ref}
          className={baseClassName}
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          theme={themeStyles}
          spectrum={spectrum}
          {...props}
        />
      </Wrapper>
    )
  }))
}

// 🔄 Loading States HOC
export const withLoadingState = (Component, loadingKey) => {
  return memo((props) => {
    const { isLoading } = useLoading()
    const loading = loadingKey ? isLoading(loadingKey) : false
    
    return <Component {...props} loading={loading} />
  })
}

// 🚨 Error Boundary HOC
export const withErrorBoundary = (Component, fallback) => {
  return memo((props) => {
    const { addNotification } = useNotifications()
    
    try {
      return <Component {...props} />
    } catch (error) {
      console.error('Component error:', error)
      addNotification({
        type: 'error',
        title: 'Component Error',
        message: error.message,
        duration: 5000
      })
      
      return fallback || (
        <div className="p-4 text-red-400 bg-red-900/20 rounded border border-red-400/20">
          <p className="font-semibold">Something went wrong</p>
          <p className="text-sm opacity-70">{error.message}</p>
        </div>
      )
    }
  })
}

// 🎨 Standard Button Component
export const Button = withStandardProps(memo(forwardRef(({ 
  children, 
  onClick, 
  variant, 
  size, 
  loading, 
  disabled, 
  theme,
  className = '',
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const variantClasses = {
    primary: theme.button,
    secondary: `${theme.card} ${theme.border}`,
    ghost: 'bg-transparent hover:bg-white/10',
    danger: 'bg-red-600 hover:bg-red-500'
  }
  
  return (
    <motion.button
      ref={ref}
      onClick={disabled || loading ? undefined : onClick}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${theme.focus}
        rounded-lg font-medium transition-all duration-200
        ${disabled || loading ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'}
        ${className}
      `.trim()}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : children}
    </motion.button>
  )
})))

// 📝 Standard Input Component
export const Input = withStandardProps(memo(forwardRef(({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  theme,
  className = '',
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-4 py-2 rounded-lg
        ${theme.card} ${theme.border} ${theme.text}
        placeholder-gray-400
        ${theme.focus}
        transition-all duration-200
        ${className}
      `.trim()}
      {...props}
    />
  )
})))

// 🃏 Standard Card Component
export const Card = withStandardProps(memo(forwardRef(({ 
  children, 
  title, 
  subtitle,
  actions,
  padding = true,
  theme,
  spectrum,
  className = '',
  ...props 
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`
        ${theme.card} ${theme.border}
        rounded-xl backdrop-blur-lg
        ${padding ? 'p-6' : ''}
        ${className}
      `.trim()}
      style={{
        backdropFilter: `blur(${8 + spectrum.blur * 16}px) saturate(${0.8 + spectrum.saturation * 1.2})`,
        boxShadow: spectrum.glow > 0.5 ? `0 0 ${spectrum.glow * 40}px rgba(0, 255, 255, ${spectrum.glow * 0.3})` : 'none'
      }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className={`font-bold text-lg ${theme.text}`}>{title}</h3>}
            {subtitle && <p className={`text-sm ${theme.textMuted} mt-1`}>{subtitle}</p>}
          </div>
          {actions && <div className="flex space-x-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  )
}), 'Card'))

// 📊 Standard Modal Component  
export const Modal = memo(({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  className = ''
}) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        className={`
          relative w-full ${sizeClasses[size]}
          ${themeStyles.card} ${themeStyles.border}
          rounded-xl backdrop-blur-xl p-6
          ${className}
        `.trim()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${themeStyles.text}`}>{title}</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded ${themeStyles.textMuted} hover:${themeStyles.text}`}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  )
})

// 🔔 Standard Notification Component
export const Notification = memo(({ 
  notification, 
  onDismiss
}) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  const typeColors = {
    info: 'border-blue-400/50 bg-blue-900/20',
    success: 'border-green-400/50 bg-green-900/20',
    warning: 'border-yellow-400/50 bg-yellow-900/20',
    error: 'border-red-400/50 bg-red-900/20'
  }
  
  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  }
  
  return (
    <motion.div
      className={`
        p-4 rounded-lg border backdrop-blur-lg
        ${typeColors[notification.type] || typeColors.info}
        ${themeStyles.text}
      `.trim()}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      layout
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg">
          {typeIcons[notification.type] || typeIcons.info}
        </span>
        <div className="flex-1">
          {notification.title && (
            <h4 className="font-semibold mb-1">{notification.title}</h4>
          )}
          <p className={`text-sm ${themeStyles.textMuted}`}>{notification.message}</p>
        </div>
        <button
          onClick={() => onDismiss(notification.id)}
          className={`text-xs ${themeStyles.textMuted} hover:${themeStyles.text}`}
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
})

// 🎛️ Standard Module Layout
export const ModuleLayout = memo(({ 
  title, 
  subtitle, 
  actions, 
  children, 
  loading = false,
  error = null,
  className = ''
}) => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const themeStyles = getThemeStyles(theme)
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card title="Error" className="text-center">
          <p className={themeStyles.textMuted}>{error}</p>
        </Card>
      </div>
    )
  }
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      {(title || subtitle || actions) && (
        <div className={`p-6 border-b ${themeStyles.border}`}>
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className={`text-2xl font-bold ${themeStyles.text}`}>{title}</h1>}
              {subtitle && <p className={`text-sm ${themeStyles.textMuted} mt-1`}>{subtitle}</p>}
            </div>
            {actions && <div className="flex space-x-2">{actions}</div>}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className={themeStyles.textMuted}>Loading...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
})

// 🚀 Lazy Loading Utilities
export const createLazyComponent = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc)
  
  return memo((props) => (
    <Suspense fallback={fallback || <div className="animate-pulse bg-gray-700 rounded h-32" />}>
      <LazyComponent {...props} />
    </Suspense>
  ))
}

// 🎣 Standard Custom Hooks Pattern
export const createAsyncHook = (asyncFunction, dependencies = []) => {
  return () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const execute = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await asyncFunction()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    
    useEffect(() => {
      let mounted = true
      
      const executeAsync = async () => {
        try {
          setLoading(true)
          setError(null)
          const result = await asyncFunction()
          if (mounted) {
            setData(result)
          }
        } catch (err) {
          if (mounted) {
            setError(err)
          }
        } finally {
          if (mounted) {
            setLoading(false)
          }
        }
      }
      
      executeAsync()
      
      return () => {
        mounted = false
      }
    }, dependencies)
    
    return { data, loading, error, refetch: execute }
  }
}

export default {
  ANIMATION_VARIANTS,
  getThemeStyles,
  withStandardProps,
  withLoadingState,
  withErrorBoundary,
  Button,
  Input,
  Card,
  Modal,
  Notification,
  ModuleLayout,
  createLazyComponent,
  createAsyncHook
}