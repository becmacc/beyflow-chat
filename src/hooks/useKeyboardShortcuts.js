import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Keyboard shortcuts configuration
const SHORTCUTS = {
  // Chat shortcuts
  'cmd+enter': { action: 'sendMessage', description: 'Send message', category: 'Chat' },
  'ctrl+enter': { action: 'sendMessage', description: 'Send message', category: 'Chat' },
  'cmd+k': { action: 'clearChat', description: 'Clear chat', category: 'Chat' },
  'ctrl+k': { action: 'clearChat', description: 'Clear chat', category: 'Chat' },
  'cmd+n': { action: 'newChat', description: 'New chat', category: 'Chat' },
  'ctrl+n': { action: 'newChat', description: 'New chat', category: 'Chat' },
  
  // Audio shortcuts
  'cmd+m': { action: 'toggleMute', description: 'Toggle mute', category: 'Audio' },
  'ctrl+m': { action: 'toggleMute', description: 'Toggle mute', category: 'Audio' },
  'cmd+r': { action: 'startRecording', description: 'Start/stop recording', category: 'Audio' },
  'ctrl+r': { action: 'startRecording', description: 'Start/stop recording', category: 'Audio' },
  'space': { action: 'playPause', description: 'Play/pause audio', category: 'Audio' },
  
  // Navigation shortcuts
  'cmd+1': { action: 'switchToChat', description: 'Switch to Chat', category: 'Navigation' },
  'cmd+2': { action: 'switchToVisualizer', description: 'Switch to Visualizer', category: 'Navigation' },
  'cmd+3': { action: 'switchToAI', description: 'Switch to AI Studio', category: 'Navigation' },
  'cmd+4': { action: 'switchToSessions', description: 'Switch to Sessions', category: 'Navigation' },
  'ctrl+1': { action: 'switchToChat', description: 'Switch to Chat', category: 'Navigation' },
  'ctrl+2': { action: 'switchToVisualizer', description: 'Switch to Visualizer', category: 'Navigation' },
  'ctrl+3': { action: 'switchToAI', description: 'Switch to AI Studio', category: 'Navigation' },
  'ctrl+4': { action: 'switchToSessions', description: 'Switch to Sessions', category: 'Navigation' },
  
  // UI shortcuts
  'cmd+/': { action: 'showShortcuts', description: 'Show shortcuts', category: 'UI' },
  'ctrl+/': { action: 'showShortcuts', description: 'Show shortcuts', category: 'UI' },
  'escape': { action: 'closePanels', description: 'Close panels/modals', category: 'UI' },
  'cmd+,': { action: 'openSettings', description: 'Open settings', category: 'UI' },
  'ctrl+,': { action: 'openSettings', description: 'Open settings', category: 'UI' },
  'f': { action: 'toggleFullscreen', description: 'Toggle fullscreen', category: 'UI' },
  'cmd+d': { action: 'toggleDarkMode', description: 'Toggle dark mode', category: 'UI' },
  'ctrl+d': { action: 'toggleDarkMode', description: 'Toggle dark mode', category: 'UI' },
  
  // Advanced shortcuts
  'cmd+shift+c': { action: 'copyLastMessage', description: 'Copy last message', category: 'Advanced' },
  'ctrl+shift+c': { action: 'copyLastMessage', description: 'Copy last message', category: 'Advanced' },
  'cmd+shift+v': { action: 'pasteAndSend', description: 'Paste and send', category: 'Advanced' },
  'ctrl+shift+v': { action: 'pasteAndSend', description: 'Paste and send', category: 'Advanced' },
  'cmd+shift+d': { action: 'duplicateMessage', description: 'Duplicate last message', category: 'Advanced' },
  'ctrl+shift+d': { action: 'duplicateMessage', description: 'Duplicate last message', category: 'Advanced' }
}

// Keyboard shortcut hook
export const useKeyboardShortcuts = (actions = {}) => {
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [lastShortcut, setLastShortcut] = useState(null)

  // Normalize key combination string
  const normalizeShortcut = useCallback((keys) => {
    const keyArray = Array.from(keys).sort()
    const hasCmd = keyArray.includes('Meta') || keyArray.includes('cmd')
    const hasCtrl = keyArray.includes('Control') || keyArray.includes('ctrl')
    const hasShift = keyArray.includes('Shift') || keyArray.includes('shift')
    const hasAlt = keyArray.includes('Alt') || keyArray.includes('alt')
    
    // Filter out modifier keys to get the main key
    const mainKeys = keyArray.filter(key => 
      !['Meta', 'Control', 'Shift', 'Alt', 'cmd', 'ctrl', 'shift', 'alt'].includes(key)
    )
    
    if (mainKeys.length === 0) return null
    
    const mainKey = mainKeys[0].toLowerCase()
    
    // Build shortcut string
    let shortcut = ''
    if (hasCmd) shortcut += 'cmd+'
    if (hasCtrl) shortcut += 'ctrl+'
    if (hasShift) shortcut += 'shift+'
    if (hasAlt) shortcut += 'alt+'
    shortcut += mainKey
    
    return shortcut
  }, [])

  // Handle keydown
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === 'true') {
      // Allow some shortcuts even in inputs
      const allowedInInputs = ['escape', 'cmd+enter', 'ctrl+enter']
      const currentKeys = new Set(pressedKeys)
      currentKeys.add(event.key)
      const shortcut = normalizeShortcut(currentKeys)
      
      if (!allowedInInputs.includes(shortcut)) {
        return
      }
    }

    const newKeys = new Set(pressedKeys)
    newKeys.add(event.key)
    setPressedKeys(newKeys)

    const shortcut = normalizeShortcut(newKeys)
    if (shortcut && SHORTCUTS[shortcut]) {
      event.preventDefault()
      const { action, description } = SHORTCUTS[shortcut]
      
      // Execute action if handler exists
      if (actions[action]) {
        actions[action](event)
        setLastShortcut({ shortcut, description, timestamp: Date.now() })
      }
    }
  }, [actions, pressedKeys, normalizeShortcut])

  // Handle keyup
  const handleKeyUp = useCallback((event) => {
    const newKeys = new Set(pressedKeys)
    newKeys.delete(event.key)
    setPressedKeys(newKeys)
  }, [pressedKeys])

  // Setup event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    // Clear keys on window blur (prevents stuck keys)
    const handleBlur = () => setPressedKeys(new Set())
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleBlur)
    }
  }, [handleKeyDown, handleKeyUp])

  return { lastShortcut, pressedKeys: Array.from(pressedKeys) }
}

// Shortcuts help modal component
export const ShortcutsModal = ({ isOpen, onClose }) => {
  const groupedShortcuts = Object.entries(SHORTCUTS).reduce((acc, [key, value]) => {
    if (!acc[value.category]) acc[value.category] = []
    acc[value.category].push({ key, ...value })
    return acc
  }, {})

  const categoryColors = {
    Chat: 'from-blue-500 to-cyan-500',
    Audio: 'from-purple-500 to-pink-500',
    Navigation: 'from-green-500 to-teal-500',
    UI: 'from-orange-500 to-red-500',
    Advanced: 'from-indigo-500 to-purple-500'
  }

  const formatShortcut = (shortcut) => {
    return shortcut
      .replace('cmd+', '⌘')
      .replace('ctrl+', '⌃')
      .replace('shift+', '⇧')
      .replace('alt+', '⌥')
      .replace('enter', '↵')
      .replace('escape', '⎋')
      .replace('space', '␣')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">⌨️ Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
                <motion.div
                  key={category}
                  className="space-y-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: Object.keys(groupedShortcuts).indexOf(category) * 0.1 }}
                >
                  <h3 className={`text-lg font-semibold bg-gradient-to-r ${categoryColors[category]} bg-clip-text text-transparent`}>
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {shortcuts.map(({ key, description }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <span className="text-white/80 text-sm">{description}</span>
                        <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white/90 font-mono">
                          {formatShortcut(key)}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 text-center">
              <p className="text-white/60 text-sm">
                Press <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs">⌘/</kbd> or{' '}
                <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs">⌃/</kbd> to toggle this panel
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Shortcut notification component
export const ShortcutNotification = ({ shortcut, description }) => {
  return (
    <AnimatePresence>
      {shortcut && (
        <motion.div
          className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-40"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded text-xs text-white font-mono">
              {shortcut.replace('cmd+', '⌘').replace('ctrl+', '⌃')}
            </kbd>
            <span className="text-white/80 text-sm">{description}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}