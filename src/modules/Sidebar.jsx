import { motion } from "framer-motion"
import useStore from "../store"
import { brandAssets } from "../config/brandConfig"

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
      className="w-64 cyber-card border-r border-neon-cyan/30 flex flex-col"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/10">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <img 
            src={brandAssets.beyMediaLogo} 
            alt="BeyMedia" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h3 className="text-white font-bold neon-text">BeyFlow</h3>
            <p className="text-neon-cyan/60 text-sm font-mono">Workflow Studio</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {modules.map((module) => (
            <motion.button
              key={module.id}
              onClick={() => setModule(module.id)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                currentModule === module.id
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 border border-neon-cyan shadow-neon-cyan'
                  : 'text-white/70 hover:text-white hover:bg-neon-cyan/5 hover:border hover:border-neon-cyan/20'
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
      <div className="p-4 border-t border-white/10">
        <motion.div
          className="flex items-center space-x-2 text-white/60 text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>System Online</span>
        </motion.div>
        
        <div className="mt-2 text-xs text-white/40">
          <p>Messages: {messages.length}</p>
          <p>Active: {currentModule}</p>
        </div>
      </div>
    </motion.div>
  )
}