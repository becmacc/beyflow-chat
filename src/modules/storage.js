// Storage utilities for persistence
export const storage = {
  // Local storage helpers
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  },

  // Session storage helpers
  setSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('Failed to save to sessionStorage:', error)
    }
  },

  getSession(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('Failed to read from sessionStorage:', error)
      return defaultValue
    }
  },

  // Save/load chat sessions
  saveSession(sessionId, data) {
    this.set(`chat-session-${sessionId}`, data)
  },

  loadSession(sessionId) {
    return this.get(`chat-session-${sessionId}`, {
      messages: [],
      user: 'Anonymous',
      timestamp: Date.now()
    })
  },

  // List all saved sessions
  getSessions() {
    const sessions = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('chat-session-')) {
        const sessionId = key.replace('chat-session-', '')
        const data = this.get(key)
        sessions.push({ sessionId, ...data })
      }
    }
    return sessions.sort((a, b) => b.timestamp - a.timestamp)
  },

  // Clear all sessions
  clearSessions() {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('chat-session-')) {
        keys.push(key)
      }
    }
    keys.forEach(key => this.remove(key))
  }
}

export default storage