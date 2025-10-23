import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { getTheme } from '../store/themes'

export default function BeyTVModule() {
  const { themePersona, spectrum } = useStore()
  const [mediaContent, setMediaContent] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = getTheme(themePersona)

  // Get spectrum values
  const blur = spectrum?.blur ?? 0.3
  const glow = spectrum?.glow ?? 0.3

  useEffect(() => {
    // Check BeyTV connection
    checkConnection()
    
    // Register with BeyFlow integration
    if (window.BeyFlowIntegration) {
      window.BeyFlowIntegration.registerModule('beytv', {
        searchMedia: handleSearchMedia,
        getStatus: () => ({ connected: isConnected }),
        refresh: loadMediaContent
      })
    }
  }, [isConnected])

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:8000/health')
      if (response.ok) {
        setIsConnected(true)
        loadMediaContent()
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      setIsConnected(false)
    }
  }

  const loadMediaContent = async () => {
    if (!isConnected) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/media/recent')
      if (response.ok) {
        const data = await response.json()
        setMediaContent(data.media || [])
      }
    } catch (error) {
      console.error('Failed to load media content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchMedia = async (query) => {
    if (!isConnected) return
    
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/media/search?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setMediaContent(data.results || [])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (mediaId, title) => {
    if (!isConnected) return
    
    try {
      const response = await fetch('http://localhost:8000/api/media/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mediaId, title })
      })
      
      if (response.ok) {
        // Emit event for workflow automation
        if (window.BeyFlow) {
          window.BeyFlow.emit('beytv:download_started', { mediaId, title })
        }
        alert(`Download started: ${title}`)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <motion.div
          className="text-red-400 text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          📺
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">BeyTV Offline</h3>
        <p className="text-gray-400 mb-4">Server not running on localhost:8000</p>
        <motion.button
          onClick={checkConnection}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Connection
        </motion.button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📺</span>
            <div>
              <h2 className="text-xl font-bold text-white">BeyTV</h2>
              <p className="text-green-400 text-sm font-mono">CONNECTED</p>
            </div>
          </div>
          <motion.button
            onClick={loadMediaContent}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? '⟳' : '↻'}
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchMedia(searchQuery)}
            placeholder="Search media content..."
            className={`w-full px-4 py-2 bg-black/50 border ${theme.colors.border} rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
            style={{
              backdropFilter: `blur(${8 + blur * 16}px)`
            }}
          />
          <button
            onClick={() => handleSearchMedia(searchQuery)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <motion.div
              className="text-blue-400 text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⟳
            </motion.div>
          </div>
        ) : mediaContent.length > 0 ? (
          <div className="space-y-3">
            {mediaContent.map((item, index) => (
              <motion.div
                key={index}
                className={`p-4 bg-black/30 border ${theme.colors.border} rounded-lg`}
                style={{
                  backdropFilter: `blur(${8 + blur * 16}px)`,
                  boxShadow: glow > 0.5 ? `0 0 ${glow * 20}px rgba(0, 255, 255, ${glow * 0.2})` : 'none'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {item.date}</span>
                      <span>📂 {item.category}</span>
                      <span>💾 {item.size}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => handleDownload(item.id, item.title)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            <span className="text-4xl mb-4 block">📁</span>
            <p>No media content found</p>
            <p className="text-sm mt-2">Try searching for something or refresh the connection</p>
          </div>
        )}
      </div>
    </div>
  )
}