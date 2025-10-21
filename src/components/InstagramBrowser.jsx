import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, Instagram, ExternalLink, Search, Home, Compass } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function InstagramBrowser() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [isMinimized, setIsMinimized] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const openInstagram = (path = '') => {
    window.open(`https://www.instagram.com${path}`, '_blank', 'width=800,height=900')
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      openInstagram(`/explore/search/keyword/?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <button
            onClick={() => setIsMinimized(false)}
            className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white ${theme.rounded} shadow-lg`}
          >
            <Instagram size={16} />
            <span className={`${theme.font} text-xs`}>
              {theme.id === 'glassmorphic' ? 'IG' : '[IG]'}
            </span>
            <Maximize2 size={12} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`w-64 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} shadow-2xl overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-3 py-2 border-b ${theme.colors.border}`}>
            <div className="flex items-center space-x-2">
              <Instagram size={14} className="text-pink-500" />
              <span className={`${theme.font} text-xs ${theme.colors.text}`}>
                {theme.id === 'glassmorphic' ? 'Instagram' : 'IG'}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
            >
              <Minimize2 size={12} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 space-y-2">
            <button
              onClick={() => openInstagram('/')}
              className={`w-full flex items-center justify-between px-3 py-2 ${theme.colors.input} ${theme.rounded} hover:${theme.colors.border} transition-all group`}
            >
              <div className="flex items-center space-x-2">
                <Home size={14} className="text-pink-500" />
                <span className={`${theme.font} text-xs ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? 'Feed' : 'FEED'}
                </span>
              </div>
              <ExternalLink size={10} className={`${theme.colors.textMuted} group-hover:${theme.colors.text}`} />
            </button>

            <button
              onClick={() => openInstagram('/explore/')}
              className={`w-full flex items-center justify-between px-3 py-2 ${theme.colors.input} ${theme.rounded} hover:${theme.colors.border} transition-all group`}
            >
              <div className="flex items-center space-x-2">
                <Compass size={14} className="text-purple-500" />
                <span className={`${theme.font} text-xs ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? 'Explore' : 'EXPLORE'}
                </span>
              </div>
              <ExternalLink size={10} className={`${theme.colors.textMuted} group-hover:${theme.colors.text}`} />
            </button>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-2">
              <div className={`flex items-center space-x-2 px-2 py-1.5 ${theme.colors.input} ${theme.rounded}`}>
                <Search size={12} className={theme.colors.textMuted} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={theme.id === 'glassmorphic' ? 'Search...' : 'SEARCH'}
                  className={`flex-1 bg-transparent ${theme.font} text-xs ${theme.colors.text} focus:outline-none placeholder:${theme.colors.textMuted}`}
                />
              </div>
              <button
                type="submit"
                className={`w-full px-3 py-1.5 ${theme.font} ${theme.rounded} text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all`}
              >
                {theme.id === 'glassmorphic' ? 'Search' : '[GO]'}
              </button>
            </form>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
