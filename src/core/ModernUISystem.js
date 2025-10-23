import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, useEffect, useRef } from "react"

// 🎨 Modern UI Enhancement System
// Provides Notion-like organization, advanced parallax, and smooth interactions

// Enhanced Parallax Hook with multiple layers
export const useAdvancedParallax = (intensity = 0.5) => {
  const { scrollY } = useScroll()
  const ref = useRef()
  
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * intensity])
  const opacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0.3])
  const scale = useTransform(scrollY, [0, 500], [1, 1.2])
  
  return { ref, y, opacity, scale }
}

// Notion-like Container System
export const NotionContainer = ({ 
  children, 
  title, 
  level = 1, 
  collapsible = false,
  defaultCollapsed = false,
  className = ""
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  
  const containerVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
    },
    closed: { 
      height: 40, 
      opacity: 0.7,
      transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }
    }
  }

  const levelStyles = {
    1: "text-2xl font-bold mb-6 pl-0",
    2: "text-xl font-semibold mb-4 pl-4", 
    3: "text-lg font-medium mb-3 pl-8",
    4: "text-md font-normal mb-2 pl-12"
  }

  return (
    <motion.div
      className={`notion-container mb-4 ${className}`}
      variants={containerVariants}
      animate={isCollapsed ? "closed" : "open"}
      whileHover={{ scale: 1.002 }}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <motion.div 
          className={`notion-header flex items-center cursor-pointer ${levelStyles[level]}`}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          {collapsible && (
            <motion.span
              className="mr-2 text-gray-400"
              animate={{ rotate: isCollapsed ? -90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          )}
          <span className="select-none">{title}</span>
        </motion.div>
      )}
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="notion-content overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Enhanced Glass Card with micro-interactions
export const GlassCard = ({ 
  children, 
  className = "", 
  hover = true,
  glow = false,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl
        transition-all duration-300 ease-out
        ${hover ? 'hover:bg-white/10 hover:border-white/20' : ''}
        ${glow ? 'shadow-2xl shadow-cyan-500/20' : ''}
        ${className}
      `}
      whileHover={hover ? { 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(0, 255, 255, 0.1)"
      } : {}}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
      {...props}
    >
      {/* Animated border glow */}
      {isHovered && glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: '1px' }}
        />
      )}
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  )
}

// Enhanced Parallax Background System
export const ParallaxBackground = ({ children, layers = [] }) => {
  const { scrollY } = useScroll()
  
  return (
    <div className="relative min-h-screen">
      {/* Multiple parallax layers */}
      {layers.map((layer, index) => {
        const y = useTransform(scrollY, [0, 1000], [0, -1000 * layer.speed])
        const opacity = useTransform(scrollY, [0, 500], [layer.opacity || 1, 0.3])
        
        return (
          <motion.div
            key={index}
            className={`absolute inset-0 ${layer.className || ''}`}
            style={{ y, opacity, zIndex: layer.zIndex || index }}
          >
            {layer.content}
          </motion.div>
        )
      })}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Smooth scroll sections for better organization
export const SmoothSection = ({ 
  id, 
  children, 
  className = "",
  background = "transparent" 
}) => {
  const ref = useRef()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  return (
    <motion.section
      ref={ref}
      id={id}
      className={`relative py-20 ${className}`}
      style={{ y, opacity, background }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </motion.section>
  )
}

// Modern floating action button with context menu
export const FloatingActionButton = ({ 
  actions = [], 
  icon = "⚡", 
  position = "bottom-right" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={index}
                className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={action.onClick}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg shadow-cyan-500/25 flex items-center justify-center text-white text-xl font-bold"
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.button>
    </div>
  )
}

// Modern command palette (Notion-style)
export const CommandPalette = ({ isOpen, onClose, commands = [] }) => {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase())
  )
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(i => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action()
            onClose()
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])
  
  if (!isOpen) return null
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 rounded-2xl w-[600px] max-h-[400px] overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Type a command or search..."
            className="w-full bg-transparent text-white placeholder-gray-400 text-lg outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCommands.map((command, index) => (
            <motion.div
              key={index}
              className={`p-4 cursor-pointer transition-colors ${
                index === selectedIndex ? 'bg-cyan-500/20' : 'hover:bg-gray-800/50'
              }`}
              onClick={() => {
                command.action()
                onClose()
              }}
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{command.icon}</span>
                <div>
                  <div className="text-white font-medium">{command.title}</div>
                  {command.description && (
                    <div className="text-gray-400 text-sm">{command.description}</div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default {
  NotionContainer,
  GlassCard,
  ParallaxBackground,
  SmoothSection,
  FloatingActionButton,
  CommandPalette,
  useAdvancedParallax
}