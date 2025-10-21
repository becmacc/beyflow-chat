import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Minimize2, BarChart2, Music, Users, Calendar as CalendarIcon, 
  Globe, MessageCircle, Instagram, ExternalLink, Maximize2
} from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'
import { useAnalytics } from '../hooks/useAnalytics'
import BusinessCalendar from './BusinessCalendar'
import SocialHubPanel from './SocialHubPanel'
import BrowserPanel from './BrowserPanel'

const PinterestIcon = ({ size = 20, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
)

export default function WidgetHub() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  const { insights, realTimeData } = useAnalytics()
  
  const [isMinimized, setIsMinimized] = useState(true)
  const [activeTab, setActiveTab] = useState('analytics')
  const [browserSplitMode, setBrowserSplitMode] = useState(false)
  
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [currentVideoId, setCurrentVideoId] = useState('dQw4w9WgXcQ')
  const [isYoutubePlaying, setIsYoutubePlaying] = useState(false)
  const [activeTime, setActiveTime] = useState(0)
  const [messagesSent, setMessagesSent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (insights?.overview?.totalEvents) {
      setMessagesSent(insights.overview.totalEvents)
    }
  }, [insights])

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
      const videos = ['dQw4w9WgXcQ', '9bZkp7q19f0', 'kJQP7kiw5Fk', 'OPf0YbXqDm0', 'CevxZvSJLk8']
      const randomVideo = videos[Math.floor(Math.random() * videos.length)]
      setCurrentVideoId(randomVideo)
      setIsYoutubePlaying(true)
    }
  }

  const handleToggleSplitScreen = () => {
    setBrowserSplitMode(!browserSplitMode)
    if (!browserSplitMode) {
      setIsMinimized(true)
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: BarChart2, emoji: '📊' },
    { id: 'youtube', name: 'YouTube', icon: Music, emoji: '🎵' },
    { id: 'social', name: 'Social', icon: Users, emoji: '📱' },
    { id: 'utilities', name: 'Utilities', icon: CalendarIcon, emoji: '📅' },
    { id: 'browser', name: 'Browser', icon: Globe, emoji: '🌐' }
  ]

  const socialPlatforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      url: 'https://www.instagram.com/',
      gradient: 'from-purple-500 via-pink-500 to-orange-500',
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: PinterestIcon,
      url: 'https://www.pinterest.com/',
      gradient: 'from-red-600 to-red-500',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      url: 'https://web.whatsapp.com',
      gradient: 'from-green-600 to-green-500',
    }
  ]

  return (
    <>
      {isYoutubePlaying && isMinimized && (
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

      {browserSplitMode && (
        <div className="fixed top-0 right-0 h-full w-[40%] z-50 bg-gray-900 border-l border-cyan-500/50 shadow-2xl">
          <BrowserPanel onClose={() => setBrowserSplitMode(false)} />
        </div>
      )}

      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className={`
              fixed bottom-4 right-4 z-40
              px-4 py-2 ${theme.rounded} 
              ${theme.id === 'terminal' 
                ? 'bg-black/80 border-2 border-cyan-500/70 text-cyan-400 hover:bg-cyan-500/20' 
                : 'bg-white/10 border-2 border-white/50 text-white hover:bg-white/20'
              }
              backdrop-blur-md transition-all duration-200
              shadow-lg hover:shadow-xl hover:scale-105
              flex items-center gap-2
            `}
          >
            <span className="text-lg">🎛️</span>
            <span className={`text-sm font-medium ${theme.font}`}>
              {theme.id === 'glassmorphic' ? 'Widgets' : '[WIDGETS]'}
            </span>
            {isYoutubePlaying && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`
              fixed bottom-4 right-4 z-40
              ${theme.rounded} overflow-hidden
              ${theme.id === 'terminal'
                ? 'bg-black/90 border-2 border-cyan-500/50'
                : 'bg-black/80 border-2 border-white/30'
              }
              backdrop-blur-xl shadow-2xl
            `}
            style={{
              width: '380px',
              height: '550px',
              boxShadow: theme.id === 'terminal' 
                ? '0 15px 45px rgba(0,255,255,0.25)' 
                : '0 15px 45px rgba(139,92,246,0.25)'
            }}
          >
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-3 border-b-2 ${theme.id === 'terminal' ? 'border-cyan-500/30' : 'border-white/20'}`}>
                <h3 className={`text-sm font-bold ${theme.font} ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? '🎛️ Widget Hub' : '[WIDGET_HUB]'}
                </h3>
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`
                    p-1.5 ${theme.rounded} transition-all
                    ${theme.id === 'terminal' 
                      ? 'hover:bg-cyan-500/20 text-cyan-400' 
                      : 'hover:bg-white/10 text-white'
                    }
                  `}
                >
                  <Minimize2 size={14} />
                </button>
              </div>

              <div className={`flex border-b ${theme.id === 'terminal' ? 'border-cyan-500/30' : 'border-white/20'} overflow-x-auto`}>
                {tabs.map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 min-w-fit px-3 py-2 flex items-center justify-center gap-1.5
                        transition-all duration-200 border-b-2
                        ${isActive
                          ? theme.id === 'terminal'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                            : 'bg-indigo-500/20 border-indigo-400 text-indigo-300'
                          : theme.id === 'terminal'
                            ? 'border-transparent text-cyan-400/50 hover:bg-cyan-500/10'
                            : 'border-transparent text-white/50 hover:bg-white/5'
                        }
                      `}
                    >
                      <span className="text-sm">{tab.emoji}</span>
                      <span className={`text-xs ${theme.font}`}>
                        {theme.id === 'glassmorphic' ? tab.name : tab.name.toUpperCase()}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'analytics' && (
                  <div className="space-y-4">
                    <div className={`p-4 ${theme.rounded} border ${theme.colors.border} ${theme.effects.blur ? 'bg-white/5' : 'bg-black/20'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${theme.colors.textMuted}`}>Messages Sent</span>
                        <span className={`text-lg font-bold ${theme.colors.text}`}>{messagesSent}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((messagesSent / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-4 ${theme.rounded} border ${theme.colors.border} ${theme.effects.blur ? 'bg-white/5' : 'bg-black/20'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${theme.colors.textMuted}`}>Active Time</span>
                        <span className={`text-lg font-bold ${theme.colors.text}`}>{formatTime(activeTime)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((activeTime / 3600) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className={`p-4 ${theme.rounded} border ${theme.colors.border} ${theme.effects.blur ? 'bg-white/5' : 'bg-black/20'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${theme.colors.textMuted}`}>System Status</span>
                        <span className={`text-sm font-bold text-green-400`}>● ONLINE</span>
                      </div>
                      {realTimeData && (
                        <div className="space-y-1 mt-3">
                          <div className="flex justify-between text-xs">
                            <span className={theme.colors.textMuted}>Active Users</span>
                            <span className={theme.colors.text}>{realTimeData.activeUsers || 0}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className={theme.colors.textMuted}>Msg/Min</span>
                            <span className={theme.colors.text}>{realTimeData.messagesPerMinute || 0}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className={theme.colors.textMuted}>Error Rate</span>
                            <span className={theme.colors.text}>{(realTimeData.errorRate || 0).toFixed(1)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'youtube' && (
                  <div className="space-y-3">
                    <div className={`p-3 ${theme.rounded} border ${theme.colors.border} ${theme.effects.blur ? 'bg-white/5' : 'bg-black/20'}`}>
                      <label className={`text-xs ${theme.colors.textMuted} mb-2 block`}>
                        YouTube URL (optional)
                      </label>
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className={`w-full px-3 py-2 ${theme.rounded} bg-black/40 border ${theme.colors.border} ${theme.colors.text} text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                      />
                    </div>

                    <button
                      onClick={handleYoutubePlay}
                      className={`w-full px-4 py-2.5 ${theme.rounded} transition-all border-2 ${
                        isYoutubePlaying 
                          ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                          : 'bg-black/60 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                      }`}
                    >
                      {isYoutubePlaying ? '▶ Playing...' : '▶ Play Video'}
                    </button>

                    {isYoutubePlaying && (
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1`}
                          title="YouTube Player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <p className={`text-xs ${theme.colors.textMuted} text-center`}>
                      {isYoutubePlaying 
                        ? '🎵 Music will continue playing when minimized'
                        : 'Enter a URL or click Play for random music'}
                    </p>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-3">
                    <p className={`text-xs ${theme.colors.textMuted} mb-4`}>
                      Quick access to social platforms
                    </p>
                    {socialPlatforms.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <button
                          key={platform.id}
                          onClick={() => window.open(platform.url, '_blank')}
                          className={`w-full p-4 ${theme.rounded} bg-gradient-to-r ${platform.gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-between`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon size={24} />
                            <span className="font-bold">{platform.name}</span>
                          </div>
                          <ExternalLink size={16} />
                        </button>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'utilities' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className={`text-xs font-bold ${theme.colors.text} mb-2`}>Calendar</h4>
                      <BusinessCalendar />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${theme.colors.text} mb-2`}>Social Hub</h4>
                      <SocialHubPanel />
                    </div>
                  </div>
                )}

                {activeTab === 'browser' && (
                  <div className="space-y-3">
                    <button
                      onClick={handleToggleSplitScreen}
                      className={`w-full px-4 py-3 ${theme.rounded} transition-all border-2 flex items-center justify-between ${
                        browserSplitMode 
                          ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                          : 'bg-black/60 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {browserSplitMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        <span className={`font-bold ${theme.font}`}>
                          {browserSplitMode ? 'Exit Split Screen' : 'Open Split Screen'}
                        </span>
                      </span>
                      <Globe size={20} />
                    </button>

                    {!browserSplitMode && (
                      <div className="border-2 border-cyan-500/30 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                        <BrowserPanel />
                      </div>
                    )}

                    <p className={`text-xs ${theme.colors.textMuted} text-center`}>
                      {browserSplitMode 
                        ? '🌐 Browser is now in split-screen mode'
                        : 'Toggle split-screen for a better browsing experience'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
