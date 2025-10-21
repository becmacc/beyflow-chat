import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Grid3x3, X, Maximize2, Minimize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'
import BusinessCalendar from './BusinessCalendar'
import SocialHubPanel from './SocialHubPanel'

export default function UtilityPanel() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('calendar')
  
  const tabs = [
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'social', name: 'Social', icon: Grid3x3 }
  ]
  
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              boxShadow: theme.id === 'terminal' 
                ? '0 0 15px rgba(0, 255, 255, 0.3)' 
                : '0 0 15px rgba(139, 92, 246, 0.3)'
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(true)}
            className={`
              min-w-[40px] min-h-[40px] px-3 py-2 ${theme.rounded} flex items-center gap-1.5
              ${theme.id === 'terminal' 
                ? 'bg-black/80 border-2 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400' 
                : 'bg-white/10 border-2 border-white/50 text-white hover:bg-white/20 hover:border-white/70'
              }
              backdrop-blur-md transition-all duration-200
              shadow-lg hover:shadow-xl hover:scale-105
              focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
            `}
            style={{
              boxShadow: theme.id === 'terminal' 
                ? '0 0 15px rgba(0, 255, 255, 0.3)' 
                : '0 0 15px rgba(139, 92, 246, 0.3)'
            }}
            aria-label="Open utility panel"
          >
            <Calendar size={16} />
            <Grid3x3 size={16} />
            <span className={`text-xs font-medium ${theme.font}`}>
              {theme.id === 'glassmorphic' ? 'Utilities' : '[UTIL]'}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`
              ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}
              shadow-2xl border-2
              ${theme.id === 'terminal' 
                ? 'bg-black/90 border-cyan-500/50' 
                : 'bg-black/80 border-white/30'
              }
            `}
            style={{
              width: '240px',
              maxHeight: '500px',
              boxShadow: theme.id === 'terminal' 
                ? '0 15px 45px rgba(0,255,255,0.25)' 
                : '0 15px 45px rgba(139,92,246,0.25)'
            }}
          >
            {/* Header with Tabs */}
            <div className={`p-2.5 border-b-2 ${theme.id === 'terminal' ? 'border-cyan-500/30' : 'border-white/20'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-bold ${theme.font} ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? 'Utility Panel' : 'UTILITY_PANEL'}
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`
                    p-1.5 ${theme.rounded} transition-all min-w-[36px] min-h-[36px] flex items-center justify-center
                    ${theme.id === 'terminal' 
                      ? 'hover:bg-cyan-500/20 text-cyan-400' 
                      : 'hover:bg-white/10 text-white'
                    }
                    focus:outline-none focus:ring-2 focus:ring-cyan-400
                  `}
                  aria-label="Close panel"
                >
                  <Minimize2 size={14} />
                </button>
              </div>
              
              {/* Tab Buttons */}
              <div className="flex gap-1.5">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 px-3 py-2 ${theme.rounded} flex items-center justify-center gap-1.5
                        transition-all duration-200 min-h-[36px] border-2
                        ${isActive
                          ? theme.id === 'terminal'
                            ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                            : 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                          : theme.id === 'terminal'
                            ? 'bg-black/50 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400/50'
                            : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40'
                        }
                        focus:outline-none focus:ring-2 focus:ring-cyan-400
                      `}
                      aria-label={`Switch to ${tab.name}`}
                    >
                      <Icon size={16} />
                      <span className={`text-xs font-medium ${theme.font}`}>{tab.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            
            {/* Content Area with dark backdrop for text */}
            <div className="relative">
              <div className="absolute inset-0 bg-black/30 pointer-events-none z-10" />
              <div className="relative z-20 p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'calendar' && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BusinessCalendar />
                    </motion.div>
                  )}
                  {activeTab === 'social' && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SocialHubPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
