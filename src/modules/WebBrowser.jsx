import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Bookmark, Trash2, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Home } from 'lucide-react'
import useStore from '../store'

export default function WebBrowser() {
  const [url, setUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const iframeRef = useRef(null)

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('beyflow_bookmarks')
    if (saved) {
      setBookmarks(JSON.parse(saved))
    }
  }, [])

  // Save bookmarks to localStorage
  const saveBookmarks = (newBookmarks) => {
    setBookmarks(newBookmarks)
    localStorage.setItem('beyflow_bookmarks', JSON.stringify(newBookmarks))
  }

  const isValidUrl = (string) => {
    try {
      const urlObj = new URL(string.startsWith('http') ? string : `https://${string}`)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const normalizeUrl = (input) => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`
    }
    return input
  }

  const loadUrl = () => {
    if (!url.trim()) return

    const normalized = normalizeUrl(url.trim())
    if (!isValidUrl(normalized)) {
      setError('Invalid URL format')
      return
    }

    setError(null)
    setLoading(true)
    setCurrentUrl(normalized)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(normalized)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    // Reset loading after a delay
    setTimeout(() => setLoading(false), 2000)
  }

  const addBookmark = () => {
    if (!currentUrl) return

    const title = prompt('Bookmark name:', currentUrl)
    if (!title) return

    const newBookmark = {
      id: Date.now(),
      title,
      url: currentUrl,
      timestamp: new Date().toISOString()
    }

    saveBookmarks([...bookmarks, newBookmark])
  }

  const removeBookmark = (id) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const loadBookmark = (bookmark) => {
    setUrl(bookmark.url)
    setCurrentUrl(bookmark.url)
    setLoading(true)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(bookmark.url)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    setTimeout(() => setLoading(false), 2000)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrl(history[newIndex])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrl(history[newIndex])
    }
  }

  const reload = () => {
    if (currentUrl) {
      setLoading(true)
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl
      }
      setTimeout(() => setLoading(false), 2000)
    }
  }

  const goHome = () => {
    setCurrentUrl('')
    setUrl('')
  }

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Browser Controls */}
      <div className="flex-none p-4 bg-black/40 backdrop-blur-lg border-b border-cyan-500/30">
        {/* Navigation Bar */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={reload}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-all"
            title="Reload"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={goHome}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-all"
            title="Home"
          >
            <Home className="w-4 h-4 text-cyan-400" />
          </button>

          {/* URL Input */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadUrl()}
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1 px-4 py-2 bg-black/60 border border-cyan-500/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={loadUrl}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-all"
            >
              Go
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={addBookmark}
            disabled={!currentUrl}
            className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4 text-yellow-400" />
          </button>

          {/* Open in New Tab */}
          <button
            onClick={openInNewTab}
            disabled={!currentUrl}
            className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Bookmarks Sidebar */}
        <div className="w-64 flex-none border-r border-cyan-500/30 bg-black/20 overflow-y-auto">
          <div className="p-3 border-b border-cyan-500/30">
            <h3 className="text-cyan-400 font-semibold text-sm">📚 Bookmarks</h3>
            <p className="text-white/50 text-xs mt-1">{bookmarks.length} saved</p>
          </div>
          
          <div className="p-2 space-y-2">
            {bookmarks.length === 0 ? (
              <div className="text-white/50 text-xs text-center py-8">
                No bookmarks yet.<br />Browse a site and click ⭐
              </div>
            ) : (
              bookmarks.map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="group flex items-start gap-2 p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                  onClick={() => loadBookmark(bookmark)}
                >
                  <Bookmark className="w-3 h-3 text-yellow-400 flex-none mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">
                      {bookmark.title}
                    </div>
                    <div className="text-white/40 text-xs truncate">
                      {bookmark.url}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeBookmark(bookmark.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 flex flex-col bg-white">
          {currentUrl ? (
            <>
              {/* iframe Warning */}
              <div className="flex-none p-2 bg-yellow-500/10 border-b border-yellow-500/30 text-xs text-yellow-300">
                <AlertCircle className="inline w-3 h-3 mr-1" />
                Some sites block embedding. If blank, click "Open in new tab" (↗️) button.
              </div>

              {/* iframe */}
              <iframe
                ref={iframeRef}
                src={currentUrl}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                className="flex-1 w-full border-0"
                title="Web Browser"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError('Failed to load website. This site may block embedding.')
                  setLoading(false)
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <div className="text-6xl mb-4">🌐</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  BeyFlow Mini Browser
                </h2>
                <p className="text-white/70 mb-6 max-w-md">
                  Enter a URL to browse websites within BeyFlow.<br />
                  Bookmark your favorites for quick access.
                </p>
                <div className="text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 max-w-md mx-auto">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Note: Many sites (Google, Facebook, etc.) block iframe embedding for security.
                  Use the "Open in new tab" button if a site doesn't load.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
