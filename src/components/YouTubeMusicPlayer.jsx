import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function YouTubeMusicPlayer() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [isMinimized, setIsMinimized] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  
  // User's YouTube Music Playlist (use PLVtr4-t9dz1tEch_iofCLzmchxBHiP8cn from user's link)
  const playlistId = 'PLVtr4-t9dz1tEch_iofCLzmchxBHiP8cn' // User's custom playlist
  
  return (
    <>
      {/* Hidden iframe that keeps playing when minimized */}
      <div className={isMinimized ? 'block' : 'hidden'}>
        <iframe
          width="1"
          height="1"
          src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1${isMuted ? '&mute=1' : ''}`}
          title="YouTube Music Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="opacity-0 pointer-events-none absolute"
        />
      </div>

      <AnimatePresence>
        {isMinimized ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`fixed bottom-20 left-4 z-30`}
          >
            <button
              onClick={() => setIsMinimized(false)}
              className={`flex items-center space-x-2 px-3 py-2 ${theme.colors.buttonActive} ${theme.rounded} shadow-lg`}
            >
              <Volume2 size={16} className="animate-pulse" />
              <span className={`${theme.font} text-xs`}>
                {theme.id === 'glassmorphic' ? 'Music' : '[MUSIC]'}
              </span>
              <Maximize2 size={12} />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            className={`fixed bottom-20 left-4 w-80 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} shadow-2xl z-30 overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-3 py-2 border-b ${theme.colors.border}`}>
              <div className="flex items-center space-x-2">
                <Volume2 size={14} className={theme.colors.accent} />
                <span className={`${theme.font} text-xs ${theme.colors.text}`}>
                  {theme.id === 'glassmorphic' ? 'Music' : 'MUSIC'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className={`p-1 ${theme.colors.textMuted} hover:${theme.colors.text} transition-colors`}
                >
                  <Minimize2 size={12} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
