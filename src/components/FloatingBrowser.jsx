import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minimize2, Maximize2, ExternalLink, Bookmark, Trash2, AlertCircle, ArrowLeft, ArrowRight, RefreshCw, Home, GripHorizontal } from 'lucide-react'
import useStore from '../store'

export default function FloatingBrowser() {
  const { floatingBrowser, setFloatingBrowser, closeFloatingBrowser } = useStore()
  const [url, setUrl] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [bookmarks, setBookmarks] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isMaximized, setIsMaximized] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const iframeRef = useRef(null)
  
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 0, height: 0 })
  const [startBrowserPos, setStartBrowserPos] = useState({ x: 0, y: 0 })

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
    setIframeError(false)
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
    setIframeError(false)
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
      setIframeError(false)
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentUrl(history[newIndex])
      setUrl(history[newIndex])
      setIframeError(false)
    }
  }

  const reload = () => {
    if (currentUrl) {
      setLoading(true)
      setIframeError(false)
      if (iframeRef.current) {
        iframeRef.current.src = currentUrl
      }
      setTimeout(() => setLoading(false), 2000)
    }
  }

  const goHome = () => {
    setCurrentUrl('')
    setUrl('')
    setIframeError(false)
  }

  const openInNewTab = () => {
    if (currentUrl) {
      window.open(currentUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  const handleResizeStart = (e, direction) => {
    if (isMaximized) return
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(true)
    setResizeDirection(direction)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize({ 
      width: floatingBrowser.width || 800, 
      height: floatingBrowser.height || 600 
    })
    setStartBrowserPos({ 
      x: floatingBrowser.x || 100, 
      y: floatingBrowser.y || 100 
    })
  }

  const handleResizeMove = (e) => {
    if (!isResizing || !resizeDirection) return
    
    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y
    
    let newWidth = startSize.width
    let newHeight = startSize.height
    let newX = startBrowserPos.x
    let newY = startBrowserPos.y
    
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(400, startSize.width + deltaX)
    }
    if (resizeDirection.includes('w')) {
      const potentialWidth = startSize.width - deltaX
      if (potentialWidth >= 400) {
        newWidth = potentialWidth
        newX = startBrowserPos.x + deltaX
      }
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(300, startSize.height + deltaY)
    }
    if (resizeDirection.includes('n')) {
      const potentialHeight = startSize.height - deltaY
      if (potentialHeight >= 300) {
        newHeight = potentialHeight
        newY = startBrowserPos.y + deltaY
      }
    }
    
    setFloatingBrowser({
      ...floatingBrowser,
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY
    })
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    setResizeDirection(null)
  }

  const handleIframeLoad = () => {
    setLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setLoading(false)
    setIframeError(true)
    setError('Site blocked embedding. Try opening in a new tab.')
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
      }
    }
  }, [isResizing, resizeDirection, startPos, startSize, startBrowserPos])

  useEffect(() => {
    if (floatingBrowser?.isOpen && floatingBrowser?.url) {
      const initialUrl = floatingBrowser.url
      const normalized = normalizeUrl(initialUrl)
      if (isValidUrl(normalized)) {
        setUrl(normalized)
        setCurrentUrl(normalized)
        setIframeError(false)
        setLoading(true)
        
        const newHistory = [...history]
        newHistory.push(normalized)
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
        
        setFloatingBrowser({
          ...floatingBrowser,
          url: undefined
        })
      }
    }
  }, [floatingBrowser?.isOpen, floatingBrowser?.url])

  if (!floatingBrowser?.isOpen) return null

  const browserSize = isMaximized 
    ? { width: '100vw', height: '100vh', x: 0, y: 0 }
    : { width: floatingBrowser.width || 800, height: floatingBrowser.height || 600, x: floatingBrowser.x || 100, y: floatingBrowser.y || 100 }

  return (
    <AnimatePresence>
      <motion.div
        key="browser-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={closeFloatingBrowser}
      />
      
      <motion.div
        key="browser-window"
        drag={!isMaximized}
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{ left: 0, top: 0, right: window.innerWidth - browserSize.width, bottom: window.innerHeight - browserSize.height }}
        initial={{ opacity: 0, scale: 0.9, x: browserSize.x, y: browserSize.y }}
        animate={{ opacity: 1, scale: 1, x: browserSize.x, y: browserSize.y }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] bg-gray-900 border-2 border-cyan-500/50 rounded-lg shadow-2xl overflow-hidden"
        style={{ 
          width: browserSize.width, 
          height: browserSize.height,
          boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)'
        }}
        onDragEnd={(e, info) => {
          if (!isMaximized) {
            setFloatingBrowser({ 
              ...floatingBrowser, 
              x: info.point.x, 
              y: info.point.y 
            })
          }
        }}
      >
        <div className="h-10 bg-black/80 backdrop-blur-lg border-b border-cyan-500/30 flex items-center justify-between px-3 cursor-move">
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">🌐 Floating Browser</span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="p-1.5 hover:bg-cyan-500/20 rounded transition-all"
              title="Bookmarks"
            >
              <Bookmark className="w-4 h-4 text-yellow-400" />
            </button>
            <button
              onClick={toggleMaximize}
              className="p-1.5 hover:bg-cyan-500/20 rounded transition-all"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4 text-cyan-400" /> : <Maximize2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={closeFloatingBrowser}
              className="p-1.5 hover:bg-red-500/20 rounded transition-all"
              title="Close"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>

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

        <div className="flex-1 flex h-[calc(100%-7rem)]">
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

          <div className="flex-1 flex flex-col bg-white">
            {currentUrl ? (
              <>
                {!iframeError && (
                  <div className="flex-none p-1 bg-yellow-500/10 border-b border-yellow-500/30 text-xs text-yellow-300">
                    <AlertCircle className="inline w-3 h-3 mr-1" />
                    Some sites block embedding. Use ↗️ if blank.
                  </div>
                )}
                {iframeError ? (
                  <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
                    <div className="text-center max-w-md">
                      <div className="text-6xl mb-4">🚫</div>
                      <h3 className="text-xl font-bold text-red-400 mb-2">Site Blocked Embedding</h3>
                      <p className="text-white/70 text-sm mb-4">
                        This website doesn't allow being displayed in an iframe for security reasons.
                      </p>
                      <button
                        onClick={openInNewTab}
                        className="flex items-center gap-2 mx-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in New Tab
                      </button>
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    src={currentUrl}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                    className="flex-1 w-full border-0"
                    title="Floating Browser"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌐</div>
                  <h3 className="text-lg font-bold text-white mb-1">Floating Browser</h3>
                  <p className="text-white/70 text-sm">Enter a URL to browse</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isMaximized && (
          <>
            <div
              className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'nw')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize"
              onMouseDown={(e) => handleResizeStart(e, 'ne')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize"
              onMouseDown={(e) => handleResizeStart(e, 'sw')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize"
              onMouseDown={(e) => handleResizeStart(e, 'se')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute top-0 left-3 right-3 h-1 cursor-n-resize"
              onMouseDown={(e) => handleResizeStart(e, 'n')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute bottom-0 left-3 right-3 h-1 cursor-s-resize"
              onMouseDown={(e) => handleResizeStart(e, 's')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute left-0 top-3 bottom-3 w-1 cursor-w-resize"
              onMouseDown={(e) => handleResizeStart(e, 'w')}
              style={{ zIndex: 100 }}
            />
            <div
              className="absolute right-0 top-3 bottom-3 w-1 cursor-e-resize"
              onMouseDown={(e) => handleResizeStart(e, 'e')}
              style={{ zIndex: 100 }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
