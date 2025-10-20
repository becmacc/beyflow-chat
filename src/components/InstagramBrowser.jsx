import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minimize2, Maximize2, Instagram } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function InstagramBrowser() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [isMinimized, setIsMinimized] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.open(`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(searchQuery)}`, '_blank')
    }
  }

  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="fixed bottom-20 right-4 z-50"
        >
          <button
            onClick={() => setIsMinimized(false)}
            className={`flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white ${theme.rounded} shadow-lg`}
          >
            <Instagram size={20} />
            <span className={`${theme.font} text-sm`}>
              {theme.id === 'glassmorphic' ? 'Instagram' : '[INSTAGRAM]'}
            </span>
            <Maximize2 size={16} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className={`fixed right-4 top-20 bottom-4 w-96 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} shadow-2xl z-50 overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-3 border-b ${theme.colors.border}`}>
            <div className="flex items-center space-x-2">
              <Instagram size={18} className="text-pink-500" />
              <span className={`${theme.font} text-sm ${theme.colors.text}`}>
                {theme.id === 'glassmorphic' ? 'Instagram Browser' : 'INSTAGRAM_BROWSER'}
              </span>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Search Bar */}
          <div className={`p-3 border-b ${theme.colors.border}`}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Instagram..."
                className={`flex-1 px-3 py-2 ${theme.colors.input} ${theme.font} ${theme.rounded} text-sm focus:outline-none`}
              />
              <button
                type="submit"
                className={`px-4 py-2 ${theme.font} ${theme.rounded} text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white`}
              >
                {theme.id === 'glassmorphic' ? 'Search' : '[GO]'}
              </button>
            </form>
          </div>

          {/* Instagram Embed */}
          <div className="flex-1 bg-black overflow-hidden">
            <iframe
              src="https://www.instagram.com"
              title="Instagram Browser"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Instructions */}
          <div className={`p-3 border-t ${theme.colors.border}`}>
            <p className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
              {theme.id === 'glassmorphic'
                ? '📸 Login to browse your feed. Use search to explore.'
                : '> LOGIN_TO_BROWSE\n> SEARCH_TO_EXPLORE'
              }
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
