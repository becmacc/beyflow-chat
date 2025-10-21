import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, ExternalLink, MessageCircle, Instagram } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

const PinterestIcon = ({ size = 16, className = '' }) => (
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

const platforms = [
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: PinterestIcon,
    url: 'https://www.pinterest.com/',
    color: 'rgb(230, 0, 35)',
    gradient: 'from-red-600 to-red-500',
    description: 'Discover and save ideas'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/',
    color: 'rgb(225, 48, 108)',
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
    description: 'Photos and stories'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://web.whatsapp.com',
    color: 'rgb(37, 211, 102)',
    gradient: 'from-green-600 to-green-500',
    description: 'Web messaging'
  }
]

export default function SocialMediaBrowser() {
  const { themePersona, setFloatingBrowser } = useStore()
  const theme = getTheme(themePersona)
  
  const [isMinimized, setIsMinimized] = useState(true)
  const [activePlatform, setActivePlatform] = useState('instagram')
  
  const currentPlatform = platforms.find(p => p.id === activePlatform)
  
  const openSocial = (platform) => {
    setActivePlatform(platform.id)
    setFloatingBrowser({ 
      isOpen: true, 
      url: platform.url,
      x: 100, 
      y: 100, 
      width: 900, 
      height: 700 
    })
  }

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'width=1000,height=800')
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
              onClick={() => setIsMinimized(false)}
              className={`flex items-center space-x-2 px-4 py-3 bg-gradient-to-r ${currentPlatform.gradient} text-white ${theme.rounded} shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="flex items-center space-x-1">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  return (
                    <Icon 
                      key={platform.id} 
                      size={14} 
                      className={activePlatform === platform.id ? 'opacity-100' : 'opacity-40'}
                    />
                  )
                })}
              </div>
              <span className={`${theme.font} text-xs font-bold`}>
                {theme.id === 'glassmorphic' ? 'Social' : '[SOCIAL]'}
              </span>
              <Maximize2 size={12} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`w-[400px] ${theme.colors.bg} border-2 ${theme.colors.border} ${theme.rounded} shadow-2xl overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
            style={{ 
              boxShadow: theme.id === 'terminal' 
                ? '0 20px 60px rgba(0,255,255,0.3)' 
                : '0 20px 60px rgba(139,92,246,0.3)'
            }}
          >
            <div className={`p-4 border-b-2 ${theme.colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold ${theme.font} ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? 'Social Media Hub' : 'SOCIAL_MEDIA_HUB'}
                </h3>
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`p-2 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10 text-white'}`}
                >
                  <Minimize2 size={14} />
                </button>
              </div>
              
              <p className={`${theme.font} text-xs ${theme.colors.textMuted} mb-4`}>
                {theme.id === 'glassmorphic' 
                  ? 'Click any platform to open in floating browser' 
                  : 'CLICK_TO_LAUNCH_FLOATING_BROWSER'}
              </p>
            </div>
            
            <div className="p-4 space-y-3">
              {platforms.map((platform) => {
                const Icon = platform.icon
                const isActive = activePlatform === platform.id
                return (
                  <motion.div
                    key={platform.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      p-4 ${theme.rounded} border-2 cursor-pointer
                      transition-all duration-200
                      ${isActive
                        ? `bg-gradient-to-r ${platform.gradient} text-white border-transparent shadow-lg`
                        : theme.id === 'terminal'
                          ? 'bg-black/40 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-10 h-10 ${theme.rounded} flex items-center justify-center ${isActive ? 'bg-white/20' : ''}`}
                          style={{ 
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${platform.color}20`,
                            border: isActive ? 'none' : `1px solid ${platform.color}40`
                          }}
                        >
                          <Icon size={20} style={{ color: isActive ? 'white' : platform.color }} />
                        </div>
                        
                        <div>
                          <div className={`${theme.font} font-bold text-sm ${isActive ? 'text-white' : theme.colors.text}`}>
                            {platform.name}
                          </div>
                          <div className={`${theme.font} text-[10px] ${isActive ? 'text-white/80' : theme.colors.textMuted}`}>
                            {platform.description}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => openSocial(platform)}
                          className={`
                            px-3 py-2 ${theme.rounded} text-xs font-bold ${theme.font}
                            transition-all
                            ${isActive 
                              ? 'bg-white/30 hover:bg-white/40 text-white' 
                              : `bg-gradient-to-r ${platform.gradient} text-white hover:shadow-md`
                            }
                          `}
                        >
                          {theme.id === 'glassmorphic' ? 'Open' : '[OPEN]'}
                        </button>
                        <button
                          onClick={() => openInNewTab(platform.url)}
                          className={`
                            p-2 ${theme.rounded}
                            transition-all
                            ${isActive 
                              ? 'bg-white/20 hover:bg-white/30 text-white' 
                              : theme.id === 'terminal'
                                ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }
                          `}
                          title="Open in new tab"
                        >
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <div className={`p-3 border-t-2 ${theme.colors.border}`}>
              <div className={`${theme.font} text-[10px] ${theme.colors.textMuted} text-center`}>
                {theme.id === 'glassmorphic' 
                  ? '💡 Floating browser avoids iframe blocking issues' 
                  : 'ℹ️ FLOATING_BROWSER_AVOIDS_IFRAME_BLOCKS'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
