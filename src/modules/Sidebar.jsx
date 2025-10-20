import { motion } from "framer-motion"
import useStore from "../store"
import { brandAssets } from "../config/brandConfig"
import GlassmorphicCard from "../components/GlassmorphicCard"

const modules = [
  { id: 'chat', name: 'Chat', icon: '💬', description: 'Real-time messaging' },
  { id: 'workflows', name: 'Workflows', icon: '🔗', description: 'Connect APIs & LLMs' },
  { id: 'sessions', name: 'Sessions', icon: '💾', description: 'Saved conversations' },
  { id: 'ai', name: 'AI Studio', icon: '🤖', description: 'AI playground' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Configuration' }
]

export default function Sidebar() {
  const { currentModule, setModule, messages } = useStore()

  return (
    <motion.div
      className="w-64 bg-black/40 backdrop-blur-2xl border-r border-white/10 flex flex-col relative overflow-hidden"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glassmorphic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      {/* Logo/Brand */}
      <div className="p-6 border-b border-neon-cyan/30 relative overflow-hidden">
        <motion.div
          className="flex flex-col items-center space-y-3 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="relative"
            animate={{ 
              rotate: [0, 2, -2, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(0,240,255,0.6), rgba(255,0,255,0.4), transparent)'
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <img 
              src={brandAssets.beyMediaLogo} 
              alt="BeyMedia" 
              className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.9)) drop-shadow(0 0 20px rgba(255,0,255,0.5))'
              }}
            />
          </motion.div>
          <div className="text-center">
            <motion.h3 
              className="text-2xl font-bold neon-text font-tech tracking-wider"
              animate={{
                textShadow: [
                  '0 0 10px rgba(0,240,255,0.8), 0 0 20px rgba(0,240,255,0.5)',
                  '0 0 15px rgba(0,240,255,1), 0 0 30px rgba(255,0,255,0.6)',
                  '0 0 10px rgba(0,240,255,0.8), 0 0 20px rgba(0,240,255,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              BeyFlow
            </motion.h3>
            <p className="text-neon-cyan/70 text-xs font-mono mt-1 tracking-widest">WORKFLOW_STUDIO</p>
          </div>
        </motion.div>
        
        <motion.div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)'
          }}
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {modules.map((module) => (
            <motion.button
              key={module.id}
              onClick={() => setModule(module.id)}
              className={`w-full text-left p-3 rounded-xl transition-all relative overflow-hidden ${
                currentModule === module.id
                  ? 'bg-gradient-to-r from-neon-cyan/20 via-neon-magenta/10 to-neon-cyan/20 border border-neon-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-transparent hover:border-neon-cyan/30 backdrop-blur-sm'
              }`}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{module.icon}</span>
                <div>
                  <p className="font-medium">{module.name}</p>
                  <p className="text-xs opacity-70">{module.description}</p>
                </div>
              </div>
              
              {/* Badge for messages count on chat module */}
              {module.id === 'chat' && messages.length > 0 && (
                <motion.div
                  className="absolute right-3 top-3 bg-cyan-400 text-black text-xs px-2 py-1 rounded-full font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {messages.length}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-neon-cyan/20">
        <motion.div
          className="flex items-center space-x-2 text-neon-green/80 text-xs font-mono"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div 
            className="w-2 h-2 bg-neon-green rounded-full shadow-neon-green"
            animate={{ 
              boxShadow: [
                '0 0 5px rgba(0,255,65,0.8)',
                '0 0 15px rgba(0,255,65,1)',
                '0 0 5px rgba(0,255,65,0.8)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>ONLINE</span>
        </motion.div>
        
        <div className="mt-2 text-xs text-neon-cyan/40 font-mono space-y-0.5">
          <p>MSG: {messages.length}</p>
          <p>MOD: {currentModule.toUpperCase()}</p>
        </div>
      </div>
    </motion.div>
  )
}