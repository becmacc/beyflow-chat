import { motion } from "framer-motion"
import { createBeyFlowTheme } from "../utils"
import useStore from "../store"

export function DopamineSlider({ value, onChange, label, min = 0, max = 100 }) {
  const { ui } = useStore()
  const theme = createBeyFlowTheme(ui.gradientShift)
  
  return (
    <motion.div 
      className="w-full space-y-2"
      whileHover={{ scale: 1.02 }}
    >
      {label && (
        <label className="text-white/80 text-sm font-medium block">
          {label}: {value}
        </label>
      )}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-3 bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 rounded-lg appearance-none cursor-pointer slider-dopamine"
          style={{
            background: theme.gradients.accent
          }}
        />
        <motion.div 
          className="absolute -top-8 bg-black/80 text-white px-2 py-1 rounded text-xs pointer-events-none"
          style={{ left: `${(value / max) * 100}%`, transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {value}
        </motion.div>
      </div>
    </motion.div>
  )
}

export function GradientBackground({ children, intensity = 1 }) {
  const { ui } = useStore()
  const theme = createBeyFlowTheme(ui.gradientShift)
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden"
      animate={{
        background: [
          theme.gradients.background,
          theme.gradients.primary,
          theme.gradients.accent,
          theme.gradients.background
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ opacity: intensity * 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export function PulseCard({ children, className = "", glow = false }) {
  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
      whileHover={{ 
        scale: 1.02,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        boxShadow: glow ? "0 0 30px rgba(76, 195, 217, 0.5)" : undefined
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      {children}
    </motion.div>
  )
}

export function FluidButton({ children, onClick, variant = "primary", disabled = false, className = "" }) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white",
    secondary: "bg-gradient-to-r from-pink-500 to-purple-600 text-white",
    accent: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black",
    ghost: "bg-white/10 border border-white/20 text-white hover:bg-white/20"
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: disabled ? undefined : "0 10px 25px rgba(0, 0, 0, 0.3)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {children}
    </motion.button>
  )
}

export function RecursivePattern({ depth = 3, size = 20 }) {
  const { ui } = useStore()
  
  if (depth <= 0) return null
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        border: '1px solid rgba(76, 195, 217, 0.3)',
        borderRadius: '50%'
      }}
      animate={{
        rotate: 360,
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration: 4 + depth,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <RecursivePattern depth={depth - 1} size={size * 0.7} />
    </motion.div>
  )
}

export function ChatBubble({ message, isUser, className = "" }) {
  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${className}`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.5
      }}
    >
      <motion.div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative ${
          isUser
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white ml-4'
            : 'bg-white/10 backdrop-blur-sm text-white mr-4 border border-white/20'
        }`}
        whileHover={{ 
          scale: 1.02,
          boxShadow: isUser 
            ? "0 8px 25px rgba(59, 130, 246, 0.4)"
            : "0 8px 25px rgba(255, 255, 255, 0.1)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <p className="text-sm font-medium mb-1 opacity-80">
          {isUser ? 'You' : 'BeyFlow'}
        </p>
        <p className="text-sm leading-relaxed">{message.msg || message.text}</p>
        <p className="text-xs opacity-60 mt-2">
          {new Date(message.time || message.timestamp).toLocaleTimeString()}
        </p>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 0px rgba(76, 195, 217, 0)",
              "0 0 15px rgba(76, 195, 217, 0.3)",
              "0 0 0px rgba(76, 195, 217, 0)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-cyan-400 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}