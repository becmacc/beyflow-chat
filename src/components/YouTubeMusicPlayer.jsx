import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function YouTubeMusicPlayer() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  
  // You can replace this with your own YouTube playlist ID
  // To get a playlist ID: Open your YouTube playlist → Copy the ID from URL after "list="
  const playlistId = 'PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj' // Example: LoFi music playlist
  
  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className={`fixed bottom-4 right-4 z-50`}
        >
          <button
            onClick={() => setIsMinimized(false)}
            className={`flex items-center space-x-2 px-4 py-3 ${theme.colors.buttonActive} ${theme.rounded} shadow-lg`}
          >
            <Volume2 size={20} />
            <span className={`${theme.font} text-sm`}>
              {theme.id === 'glassmorphic' ? 'Music Player' : '[MUSIC_PLAYER]'}
            </span>
            <Maximize2 size={16} />
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 400, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 400, opacity: 0 }}
          className={`fixed bottom-4 right-4 w-96 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} shadow-2xl z-50 overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-3 border-b ${theme.colors.border}`}>
            <div className="flex items-center space-x-2">
              <Volume2 size={18} className={theme.colors.accent} />
              <span className={`${theme.font} text-sm ${theme.colors.text}`}>
                {theme.id === 'glassmorphic' ? 'YouTube Music' : 'YOUTUBE_MUSIC'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="aspect-video bg-black">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1${isMuted ? '&mute=1' : ''}`}
              title="YouTube Music Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Instructions */}
          <div className={`p-3 border-t ${theme.colors.border}`}>
            <p className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
              {theme.id === 'glassmorphic'
                ? '🎵 Playing from your YouTube playlist. Change playlist ID in YouTubeMusicPlayer.jsx'
                : '> PLAYLIST_ACTIVE\n> Edit playlistId in code to change music'
              }
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
