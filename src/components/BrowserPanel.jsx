import { useState, useRef } from 'react'
import { X, ExternalLink, Bookmark, Trash2, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Home } from 'lucide-react'

export default function BrowserPanel({ onClose }) {
  const [url, setUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const iframeRef = useRef(null)

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

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(normalized)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    setTimeout(() => setLoading(false), 2000)
  }

  const addBookmark = () => {
    if (!currentUrl) return
    const title = prompt('Bookmark name:', currentUrl)
    if (!title) return

    const newBookmark = { id: Date.now(), title, url: currentUrl, timestamp: new Date().toISOString() }
    setBookmarks([...bookmarks, newBookmark])
  }

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(b => b.id !== id))
  }

  const loadBookmark = (bookmark) => {
    setUrl(bookmark.url)
    setCurrentUrl(bookmark.url)
    setLoading(true)
    
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
    <div className="h-full flex flex-col bg-gray-900 border-l-2 border-cyan-500/50">
      {/* Header */}
      <div className="h-10 bg-black/80 backdrop-blur-lg border-b border-cyan-500/30 flex items-center justify-between px-3">
        <span className="text-cyan-400 font-semibold text-sm">🌐 Browser</span>
        <div className="flex gap-1">
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className="p-1.5 hover:bg-cyan-500/20 rounded transition-all"
            title="Bookmarks"
          >
            <Bookmark className="w-4 h-4 text-yellow-400" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-500/20 rounded transition-all"
              title="Close"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* Browser Controls */}
      <div className="p-2 bg-black/60 backdrop-blur-lg border-b border-cyan-500/30">
        <div className="flex gap-1 mb-2">
          <button
            onClick={goBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Back"
          >
            <ArrowLeft className="w-3 h-3 text-cyan-400" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Forward"
          >
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </button>
          <button
            onClick={reload}
            className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 transition-all"
            title="Reload"
          >
            <RefreshCw className={`w-3 h-3 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={goHome}
            className="p-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 transition-all"
            title="Home"
          >
            <Home className="w-3 h-3 text-cyan-400" />
          </button>

          <div className="flex-1 flex gap-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadUrl()}
              placeholder="Enter URL..."
              className="flex-1 px-2 py-1 bg-black/60 border border-cyan-500/30 rounded text-white text-xs placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
            <button
              onClick={loadUrl}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded text-xs transition-all"
            >
              Go
            </button>
          </div>

          <button
            onClick={addBookmark}
            disabled={!currentUrl}
            className="p-1.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Bookmark"
          >
            <Bookmark className="w-3 h-3 text-yellow-400" />
          </button>
          <button
            onClick={openInNewTab}
            disabled={!currentUrl}
            className="p-1.5 rounded bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3 text-purple-400" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1 p-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            {error}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Bookmarks Sidebar */}
        {showBookmarks && (
          <div className="w-48 bg-black/40 border-r border-cyan-500/30 overflow-y-auto">
            <div className="p-2 border-b border-cyan-500/30">
              <h4 className="text-cyan-400 font-semibold text-xs">Bookmarks</h4>
            </div>
            <div className="p-1 space-y-1">
              {bookmarks.length === 0 ? (
                <div className="text-white/50 text-xs text-center py-4">No bookmarks</div>
              ) : (
                bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="group flex items-start gap-1 p-1.5 rounded bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                    onClick={() => loadBookmark(bookmark)}
                  >
                    <Bookmark className="w-2.5 h-2.5 text-yellow-400 flex-none mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-medium truncate">{bookmark.title}</div>
                      <div className="text-white/40 text-xs truncate">{bookmark.url}</div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 rounded transition-all"
                    >
                      <Trash2 className="w-2.5 h-2.5 text-red-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Browser Content */}
        <div className="flex-1 flex flex-col bg-white">
          {currentUrl ? (
            <>
              <div className="flex-none p-1 bg-yellow-500/10 border-b border-yellow-500/30 text-xs text-yellow-300">
                <AlertCircle className="inline w-3 h-3 mr-1" />
                Some sites block embedding. Use ↗️ if blank.
              </div>
              <iframe
                ref={iframeRef}
                src={currentUrl}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                className="flex-1 w-full border-0"
                title="Browser Panel"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setError('Failed to load. Site may block embedding.')
                  setLoading(false)
                }}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center">
                <div className="text-4xl mb-2">🌐</div>
                <h3 className="text-lg font-bold text-white mb-1">Browser Panel</h3>
                <p className="text-white/70 text-sm">Enter a URL to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
