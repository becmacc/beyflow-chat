import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Youtube, Instagram, MessageCircle, ExternalLink, Grid3x3 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function SocialHubPanel() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  const [isExpanded, setIsExpanded] = useState(false)

  const apps = [
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'rgb(255, 0, 0)',
      description: 'Watch videos',
      action: () => {
        const videos = [
          'dQw4w9WgXcQ',
          '9bZkp7q19f0',
          'kJQP7kiw5Fk',
          'OPf0YbXqDm0',
          'CevxZvSJLk8'
        ]
        const randomVideo = videos[Math.floor(Math.random() * videos.length)]
        window.open(`https://www.youtube.com/watch?v=${randomVideo}`, '_blank', 'width=1000,height=600')
      }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'rgb(225, 48, 108)',
      description: 'Browse feed',
      action: () => window.open('https://www.instagram.com/', '_blank', 'width=800,height=900')
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'rgb(37, 211, 102)',
      description: 'Send messages',
      action: () => window.open('https://web.whatsapp.com', '_blank', 'width=1200,height=800')
    }
  ]

  return (
    <div className="fixed bottom-20 left-6 z-30">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            onClick={() => setIsExpanded(true)}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center
              ${theme.id === 'terminal' 
                ? 'bg-black/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' 
                : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
              }
              backdrop-blur-md transition-all duration-150
              shadow-lg hover:shadow-xl hover:scale-105
            `}
          >
            <Grid3x3 size={18} />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className={`
              ${theme.rounded} overflow-hidden
              ${theme.id === 'terminal'
                ? 'bg-black/80 border border-cyan-500/20'
                : 'bg-white/10 border border-white/20'
              }
              backdrop-blur-xl shadow-2xl
            `}
          >
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${theme.id === 'terminal' ? 'border-cyan-500/10' : 'border-white/10'}`}>
              <span className={`text-xs ${theme.font} ${theme.id === 'terminal' ? 'text-cyan-400' : 'text-white'} font-medium`}>
                Social Hub
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className={`text-xs ${theme.id === 'terminal' ? 'text-cyan-400/60 hover:text-cyan-400' : 'text-white/60 hover:text-white'} transition-colors`}
              >
                ✕
              </button>
            </div>

            <div className="p-2 space-y-1">
              {apps.map((app) => {
                const Icon = app.icon
                return (
                  <motion.button
                    key={app.id}
                    onClick={app.action}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full px-3 py-2.5 rounded-lg
                      flex items-center gap-3
                      ${theme.id === 'terminal'
                        ? 'hover:bg-cyan-500/5 text-cyan-100'
                        : 'hover:bg-white/10 text-white/90'
                      }
                      transition-all duration-150 group
                    `}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${app.color}15`,
                        border: `1px solid ${app.color}30`
                      }}
                    >
                      <Icon size={16} style={{ color: app.color }} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className={`text-xs ${theme.font} font-medium`}>
                        {app.name}
                      </div>
                      <div className={`text-[10px] ${theme.id === 'terminal' ? 'text-cyan-400/50' : 'text-white/50'}`}>
                        {app.description}
                      </div>
                    </div>

                    <ExternalLink 
                      size={12} 
                      className={`${theme.id === 'terminal' ? 'text-cyan-400/40' : 'text-white/40'} group-hover:opacity-100 opacity-0 transition-opacity`}
                    />
                  </motion.button>
                )
              })}
            </div>

            <div className={`px-3 py-2 border-t ${theme.id === 'terminal' ? 'border-cyan-500/10' : 'border-white/10'}`}>
              <p className={`text-[9px] ${theme.id === 'terminal' ? 'text-cyan-400/40' : 'text-white/40'} text-center`}>
                Quick access to social platforms
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
