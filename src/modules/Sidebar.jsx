import { motion } from "framer-motion"
import useStore from "../store"
import { brandAssets } from "../config/brandConfig"
import GlassmorphicCard from "../components/GlassmorphicCard"
import { getTheme } from "../config/themes"

const modules = [
  { id: 'chat', name: 'Chat', icon: '💬', description: 'Real-time messaging' },
  { id: 'contacts', name: 'Contacts', icon: '👥', description: 'Network hub' },
  { id: 'workspace', name: 'Workspace', icon: '📝', description: 'Notes & tasks' },
  { id: 'workflows', name: 'Workflows', icon: '🔗', description: 'Connect APIs & LLMs' },
  { id: 'sessions', name: 'Sessions', icon: '💾', description: 'Saved conversations' },
  { id: 'ai', name: 'AI Studio', icon: '🤖', description: 'AI playground' },
  { id: 'ui', name: 'UI Components', icon: '✨', description: 'Sliders & carousels' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Configuration' }
]

export default function Sidebar() {
  const { currentModule, setModule, messages, themePersona } = useStore()
  const theme = getTheme(themePersona)

  return (
    <motion.div
      className={`w-56 ${theme.id === 'glassmorphic' ? 'bg-gradient-to-br from-purple-900/80 via-blue-900/80 to-teal-900/80 backdrop-blur-xl' : theme.colors.bg} border-r ${theme.colors.border} flex flex-col relative overflow-hidden`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo/Brand */}
      <div className={`p-4 border-b ${theme.colors.border} relative overflow-hidden`}>
        <motion.div
          className="flex flex-col items-center space-y-2 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <img 
              src={brandAssets.beyMediaLogo} 
              alt="BeyMedia" 
              className="w-14 h-14 object-contain opacity-80"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.3))'
              }}
            />
          </div>
          <div className="text-center">
            <h3 className={`text-lg ${theme.font} font-bold ${theme.colors.text} tracking-wide`}>
              BeyFlow
            </h3>
            <p className={`${theme.colors.textMuted} text-xs ${theme.font} mt-0.5 tracking-widest opacity-70`}>STUDIO</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-1.5">
          {modules.map((module) => (
            <motion.button
              key={module.id}
              onClick={() => setModule(module.id)}
              title={`${module.name} - ${module.description}`}
              className={`w-full text-left p-2.5 transition-all relative overflow-hidden border ${theme.font} ${theme.rounded} min-h-[44px]
                ${currentModule === module.id
                  ? theme.id === 'terminal'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.3)]'
                    : 'bg-indigo-500/20 border-indigo-400 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                  : theme.id === 'terminal'
                    ? 'bg-transparent border-cyan-500/10 text-cyan-400/70 hover:bg-cyan-500/10 hover:border-cyan-400/50 hover:text-cyan-400'
                    : 'bg-transparent border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30 hover:text-white'
                }
                focus:outline-none focus:ring-2 focus:ring-cyan-400
              `}
              whileHover={{ scale: 1.02, x: 3 }}
              whileTap={{ scale: 0.98 }}
              aria-current={currentModule === module.id ? 'page' : undefined}
              aria-label={`Navigate to ${module.name}`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-xl flex-shrink-0" aria-hidden="true">{module.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{module.name}</p>
                  <p className="text-xs opacity-75 mt-0.5 truncate">{module.description}</p>
                </div>
              </div>
              
              {/* Active indicator */}
              {currentModule === module.id && (
                <motion.div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    theme.id === 'terminal' ? 'bg-cyan-400' : 'bg-indigo-400'
                  }`}
                  layoutId="activeModule"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Badge for messages count on chat module */}
              {module.id === 'chat' && messages.length > 0 && (
                <motion.div
                  className="absolute right-3 top-3 bg-cyan-400 text-black text-xs px-2 py-1 rounded-full font-bold min-h-[20px]"
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
      <div className="p-3 border-t border-cyan-500/10">
        <div className="flex items-center space-x-2 text-cyan-500/60 text-xs font-mono">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
          <span>ONLINE</span>
        </div>
        
        <div className="mt-2 text-xs text-cyan-700/40 font-mono">
          <p>🍌 {messages.length} flows</p>
        </div>
      </div>
    </motion.div>
  )
}