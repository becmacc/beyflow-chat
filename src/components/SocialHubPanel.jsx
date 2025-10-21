import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Youtube, Instagram, MessageCircle, ExternalLink, Grid3x3, Play, Pause, Link as LinkIcon } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function SocialHubPanel() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [currentVideoId, setCurrentVideoId] = useState('')

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const handleYoutubePlay = () => {
    if (youtubeUrl) {
      const videoId = extractVideoId(youtubeUrl)
      if (videoId) {
        setCurrentVideoId(videoId)
        setIsYoutubePlaying(true)
      }
    } else {
      // Random popular video if no URL provided
      const videos = ['dQw4w9WgXcQ', '9bZkp7q19f0', 'kJQP7kiw5Fk', 'OPf0YbXqDm0', 'CevxZvSJLk8']
      const randomVideo = videos[Math.floor(Math.random() * videos.length)]
      setCurrentVideoId(randomVideo)
      setIsYoutubePlaying(true)
    }
  }

  const apps = [
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
    <>
      {/* Hidden YouTube iframe for background playback */}
      {isYoutubePlaying && !isExpanded && (
        <div className="hidden">
          <iframe
            width="1"
            height="1"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
            title="Background YouTube Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

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
                w-11 h-11 rounded-xl flex items-center justify-center relative
                ${theme.id === 'terminal' 
                  ? 'bg-black/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10' 
                  : 'bg-white/10 border border-white/20 text-white/80 hover:bg-white/20'
                }
                backdrop-blur-md transition-all duration-150
                shadow-lg hover:shadow-xl hover:scale-105
              `}
            >
              <Grid3x3 size={18} />
              {isYoutubePlaying && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
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
                backdrop-blur-xl shadow-2xl w-72
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

              <div className="p-3 space-y-3">
                {/* YouTube Player Section */}
                <div className={`p-3 rounded-lg ${theme.id === 'terminal' ? 'bg-cyan-500/5 border border-cyan-500/10' : 'bg-white/5 border border-white/10'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ 
                        backgroundColor: 'rgb(255, 0, 0)15',
                        border: '1px solid rgb(255, 0, 0)30'
                      }}
                    >
                      <Youtube size={14} style={{ color: 'rgb(255, 0, 0)' }} />
                    </div>
                    <span className={`text-xs ${theme.font} font-medium ${theme.id === 'terminal' ? 'text-cyan-100' : 'text-white'}`}>
                      YouTube Player
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md ${theme.id === 'terminal' ? 'bg-black/40' : 'bg-white/5'}`}>
                      <LinkIcon size={10} className={theme.id === 'terminal' ? 'text-cyan-400/60' : 'text-white/60'} />
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Paste YouTube URL..."
                        className={`flex-1 bg-transparent text-[10px] ${theme.font} ${theme.id === 'terminal' ? 'text-cyan-100 placeholder:text-cyan-400/30' : 'text-white placeholder:text-white/30'} focus:outline-none`}
                      />
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={handleYoutubePlay}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] ${theme.font} font-medium transition-all
                          ${isYoutubePlaying 
                            ? 'bg-red-500/80 text-white hover:bg-red-500' 
                            : theme.id === 'terminal' 
                              ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                      >
                        {isYoutubePlaying ? <Pause size={10} /> : <Play size={10} />}
                        {isYoutubePlaying ? 'Playing' : 'Play'}
                      </button>
                      {isYoutubePlaying && (
                        <button
                          onClick={() => setIsYoutubePlaying(false)}
                          className={`px-2 py-1.5 rounded-md text-[10px] ${theme.font} transition-all
                            ${theme.id === 'terminal' 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            }`}
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Other Apps */}
                <div className="space-y-1">
                  {apps.map((app) => {
                    const Icon = app.icon
                    return (
                      <motion.button
                        key={app.id}
                        onClick={app.action}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full px-3 py-2 rounded-lg
                          flex items-center gap-3
                          ${theme.id === 'terminal'
                            ? 'hover:bg-cyan-500/5 text-cyan-100'
                            : 'hover:bg-white/10 text-white/90'
                          }
                          transition-all duration-150 group
                        `}
                      >
                        <div 
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${app.color}15`,
                            border: `1px solid ${app.color}30`
                          }}
                        >
                          <Icon size={14} style={{ color: app.color }} />
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
                          size={11} 
                          className={`${theme.id === 'terminal' ? 'text-cyan-400/40' : 'text-white/40'} group-hover:opacity-100 opacity-0 transition-opacity`}
                        />
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className={`px-3 py-2 border-t ${theme.id === 'terminal' ? 'border-cyan-500/10' : 'border-white/10'}`}>
                <p className={`text-[9px] ${theme.id === 'terminal' ? 'text-cyan-400/40' : 'text-white/40'} text-center`}>
                  {isYoutubePlaying ? '🎵 Playing in background' : 'Quick access to social platforms'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
