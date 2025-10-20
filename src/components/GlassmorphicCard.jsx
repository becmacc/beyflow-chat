import { motion } from 'framer-motion'

export default function GlassmorphicCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-white/10 via-white/5 to-transparent
        backdrop-blur-xl
        border border-white/20
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        scale: 1.02,
        borderColor: 'rgba(0, 240, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(0, 240, 255, 0.3)'
      } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(0,240,255,0.2), transparent)',
          backgroundSize: '200% 200%'
        }}
        whileHover={hover ? {
          opacity: 1,
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />
    </motion.div>
  )
}
