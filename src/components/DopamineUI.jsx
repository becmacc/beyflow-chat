import { motion } from "framer-motion"
import { createBeyFlowTheme } from "../utils"
import { useBeyFlowStore } from "../core/UnifiedStore"

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
    primary: "bg-cyan-500 text-white border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]",
    secondary: "bg-purple-600 text-white border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]",
    accent: "bg-orange-500 text-white border-2 border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.4)]",
    ghost: "bg-white/10 border-2 border-white/30 text-white hover:bg-white/20"
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-bold transition-all min-w-[44px] min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black ${variants[variant]} ${className}`}
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        filter: disabled ? undefined : "brightness(120%)",
        boxShadow: disabled ? undefined : "0 10px 30px rgba(0, 240, 255, 0.5)"
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
        className={`max-w-xs lg:max-w-md px-5 py-4 rounded-2xl relative ${
          isUser
            ? 'bg-cyan-500 text-white ml-4 border-2 border-cyan-400'
            : 'bg-black/60 backdrop-blur-sm text-white mr-4 border-2 border-white/30'
        }`}
        whileHover={{ 
          scale: 1.02,
          boxShadow: isUser 
            ? "0 8px 25px rgba(0, 240, 255, 0.5)"
            : "0 8px 25px rgba(255, 255, 255, 0.2)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <p className="text-sm font-bold mb-2 opacity-90">
          {isUser ? 'You' : 'BeyFlow'}
        </p>
        <p className="text-base leading-relaxed">{message.msg || message.text}</p>
        <p className="text-xs opacity-70 mt-2">
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