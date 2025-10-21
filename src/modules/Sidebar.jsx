import { motion } from "framer-motion"
import useStore from "../store"
import { brandAssets } from "../config/brandConfig"
import GlassmorphicCard from "../components/GlassmorphicCard"
import { getTheme } from "../config/themes"

const modules = [
  { id: 'chat', name: 'Chat', icon: '💬', description: 'Real-time messaging' },
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
      className={`w-64 ${theme.colors.bg} border-r ${theme.colors.border} flex flex-col relative overflow-hidden`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo/Brand */}
      <div className={`p-6 border-b ${theme.colors.border} relative overflow-hidden`}>
        <motion.div
          className="flex flex-col items-center space-y-3 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="relative">
            <img 
              src={brandAssets.beyMediaLogo} 
              alt="BeyMedia" 
              className="w-24 h-24 object-contain opacity-80"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.3))'
              }}
            />
          </div>
          <div className="text-center">
            <h3 className={`text-2xl ${theme.font} font-bold ${theme.colors.text} tracking-wide`}>
              BeyFlow
            </h3>
            <p className={`${theme.colors.textMuted} text-xs ${theme.font} mt-1 tracking-widest`}>WORKFLOW_STUDIO</p>
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
              className={`w-full text-left p-3 transition-all relative overflow-hidden border ${theme.font} text-sm ${theme.rounded} ${
                currentModule === module.id
                  ? `${theme.colors.bg} ${theme.colors.borderActive} ${theme.colors.text}`
                  : `${theme.colors.textMuted} hover:${theme.colors.accent} bg-transparent border-transparent hover:${theme.colors.border}`
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
      <div className="p-4 border-t border-cyan-500/10">
        <div className="flex items-center space-x-2 text-cyan-500/60 text-xs font-mono">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
          <span>ONLINE</span>
        </div>
        
        <div className="mt-2 text-xs text-cyan-700/40 font-mono space-y-0.5">
          <p>MSG: {messages.length}</p>
          <p>MOD: {currentModule.toUpperCase()}</p>
        </div>
      </div>
    </motion.div>
  )
}