import { create } from 'zustand'
import { subscribeWithSelector, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Audio state store
export const useAudioStore = create()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          // Audio settings
          volume: 0.7,
          isMuted: false,
          audioEnabled: true,
          visualizationMode: 'spectrum',
          
          // Audio analysis data
          audioData: {
            frequency: new Uint8Array(256),
            waveform: new Uint8Array(1024),
            rms: 0,
            pitch: 0,
            tempo: 120,
            key: 'C',
            loudness: 0
          },
          
          // Advanced audio features
          effects: {
            reverb: 0,
            delay: 0,
            distortion: 0,
            filter: {
              type: 'lowpass',
              frequency: 20000,
              q: 1
            },
            compressor: {
              threshold: -24,
              ratio: 12,
              attack: 0.003,
              release: 0.25
            }
          },
          
          // Audio sources
          sources: new Map(),
          currentSource: null,
          
          // Recording state
          isRecording: false,
          recordedChunks: [],
          recordingTime: 0,
          
          // Actions
          setVolume: (volume) => set((state) => {
            state.volume = Math.max(0, Math.min(1, volume))
          }),
          
          toggleMute: () => set((state) => {
            state.isMuted = !state.isMuted
          }),
          
          setAudioEnabled: (enabled) => set((state) => {
            state.audioEnabled = enabled
          }),
          
          setVisualizationMode: (mode) => set((state) => {
            state.visualizationMode = mode
          }),
          
          updateAudioData: (data) => set((state) => {
            state.audioData = { ...state.audioData, ...data }
          }),
          
          setEffect: (effectName, value) => set((state) => {
            if (typeof value === 'object') {
              state.effects[effectName] = { ...state.effects[effectName], ...value }
            } else {
              state.effects[effectName] = value
            }
          }),
          
          addAudioSource: (id, source) => set((state) => {
            state.sources.set(id, source)
          }),
          
          removeAudioSource: (id) => set((state) => {
            state.sources.delete(id)
            if (state.currentSource === id) {
              state.currentSource = null
            }
          }),
          
          setCurrentSource: (id) => set((state) => {
            state.currentSource = id
          }),
          
          startRecording: () => set((state) => {
            state.isRecording = true
            state.recordedChunks = []
            state.recordingTime = 0
          }),
          
          stopRecording: () => set((state) => {
            state.isRecording = false
          }),
          
          addRecordedChunk: (chunk) => set((state) => {
            state.recordedChunks.push(chunk)
          }),
          
          updateRecordingTime: (time) => set((state) => {
            state.recordingTime = time
          }),
          
          resetEffects: () => set((state) => {
            state.effects = {
              reverb: 0,
              delay: 0,
              distortion: 0,
              filter: {
                type: 'lowpass',
                frequency: 20000,
                q: 1
              },
              compressor: {
                threshold: -24,
                ratio: 12,
                attack: 0.003,
                release: 0.25
              }
            }
          })
        })),
        {
          name: 'beyflow-audio-storage',
          partialize: (state) => ({
            volume: state.volume,
            isMuted: state.isMuted,
            audioEnabled: state.audioEnabled,
            visualizationMode: state.visualizationMode,
            effects: state.effects
          })
        }
      )
    ),
    { name: 'AudioStore' }
  )
)

// Chat state store
export const useChatStore = create()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          // Messages
          messages: [],
          currentMessage: '',
          isTyping: false,
          typingUsers: new Set(),
          
          // Chat settings
          settings: {
            theme: 'dark',
            fontSize: 14,
            showTimestamps: true,
            showAvatars: true,
            enableNotifications: true,
            soundEffects: true,
            autoScroll: true,
            maxMessages: 1000
          },
          
          // User presence
          users: new Map(),
          currentUser: {
            id: 'user_' + Math.random().toString(36).substr(2, 9),
            name: 'User',
            avatar: null,
            status: 'online',
            lastSeen: Date.now()
          },
          
          // Chat features
          reactions: new Map(),
          threads: new Map(),
          drafts: new Map(),
          bookmarks: new Set(),
          
          // Search and filters
          searchQuery: '',
          searchResults: [],
          activeFilters: new Set(),
          
          // Connection state
          isConnected: false,
          connectionStatus: 'disconnected',
          lastConnectionTime: null,
          reconnectAttempts: 0,
          
          // Actions
          addMessage: (message) => set((state) => {
            const newMessage = {
              id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
              timestamp: Date.now(),
              userId: state.currentUser.id,
              ...message
            }
            
            state.messages.push(newMessage)
            
            // Limit messages to maxMessages
            if (state.messages.length > state.settings.maxMessages) {
              state.messages = state.messages.slice(-state.settings.maxMessages)
            }
          }),
          
          updateMessage: (messageId, updates) => set((state) => {
            const messageIndex = state.messages.findIndex(m => m.id === messageId)
            if (messageIndex !== -1) {
              state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates }
            }
          }),
          
          deleteMessage: (messageId) => set((state) => {
            state.messages = state.messages.filter(m => m.id !== messageId)
            state.reactions.delete(messageId)
            state.threads.delete(messageId)
          }),
          
          setCurrentMessage: (message) => set((state) => {
            state.currentMessage = message
          }),
          
          setIsTyping: (isTyping, userId = null) => set((state) => {
            if (userId) {
              if (isTyping) {
                state.typingUsers.add(userId)
              } else {
                state.typingUsers.delete(userId)
              }
            } else {
              state.isTyping = isTyping
            }
          }),
          
          updateSettings: (newSettings) => set((state) => {
            state.settings = { ...state.settings, ...newSettings }
          }),
          
          setCurrentUser: (user) => set((state) => {
            state.currentUser = { ...state.currentUser, ...user }
          }),
          
          addUser: (user) => set((state) => {
            state.users.set(user.id, user)
          }),
          
          removeUser: (userId) => set((state) => {
            state.users.delete(userId)
            state.typingUsers.delete(userId)
          }),
          
          updateUser: (userId, updates) => set((state) => {
            const user = state.users.get(userId)
            if (user) {
              state.users.set(userId, { ...user, ...updates })
            }
          }),
          
          addReaction: (messageId, emoji, userId) => set((state) => {
            if (!state.reactions.has(messageId)) {
              state.reactions.set(messageId, new Map())
            }
            const messageReactions = state.reactions.get(messageId)
            if (!messageReactions.has(emoji)) {
              messageReactions.set(emoji, new Set())
            }
            messageReactions.get(emoji).add(userId)
          }),
          
          removeReaction: (messageId, emoji, userId) => set((state) => {
            const messageReactions = state.reactions.get(messageId)
            if (messageReactions) {
              const emojiReactions = messageReactions.get(emoji)
              if (emojiReactions) {
                emojiReactions.delete(userId)
                if (emojiReactions.size === 0) {
                  messageReactions.delete(emoji)
                }
                if (messageReactions.size === 0) {
                  state.reactions.delete(messageId)
                }
              }
            }
          }),
          
          addThread: (messageId, thread) => set((state) => {
            state.threads.set(messageId, thread)
          }),
          
          updateThread: (messageId, updates) => set((state) => {
            const thread = state.threads.get(messageId)
            if (thread) {
              state.threads.set(messageId, { ...thread, ...updates })
            }
          }),
          
          saveDraft: (draftId, content) => set((state) => {
            state.drafts.set(draftId, {
              content,
              timestamp: Date.now()
            })
          }),
          
          loadDraft: (draftId) => {
            const state = get()
            return state.drafts.get(draftId)
          },
          
          deleteDraft: (draftId) => set((state) => {
            state.drafts.delete(draftId)
          }),
          
          toggleBookmark: (messageId) => set((state) => {
            if (state.bookmarks.has(messageId)) {
              state.bookmarks.delete(messageId)
            } else {
              state.bookmarks.add(messageId)
            }
          }),
          
          setSearchQuery: (query) => set((state) => {
            state.searchQuery = query
            if (query.trim()) {
              // Simple search implementation
              state.searchResults = state.messages.filter(message =>
                message.content?.toLowerCase().includes(query.toLowerCase()) ||
                message.user?.name?.toLowerCase().includes(query.toLowerCase())
              )
            } else {
              state.searchResults = []
            }
          }),
          
          addFilter: (filter) => set((state) => {
            state.activeFilters.add(filter)
          }),
          
          removeFilter: (filter) => set((state) => {
            state.activeFilters.delete(filter)
          }),
          
          clearFilters: () => set((state) => {
            state.activeFilters.clear()
          }),
          
          setConnectionStatus: (status) => set((state) => {
            state.connectionStatus = status
            state.isConnected = status === 'connected'
            if (status === 'connected') {
              state.lastConnectionTime = Date.now()
              state.reconnectAttempts = 0
            }
          }),
          
          incrementReconnectAttempts: () => set((state) => {
            state.reconnectAttempts++
          }),
          
          clearMessages: () => set((state) => {
            state.messages = []
            state.reactions.clear()
            state.threads.clear()
            state.bookmarks.clear()
          })
        })),
        {
          name: 'beyflow-chat-storage',
          partialize: (state) => ({
            settings: state.settings,
            currentUser: state.currentUser,
            bookmarks: Array.from(state.bookmarks),
            drafts: Array.from(state.drafts.entries())
          })
        }
      )
    ),
    { name: 'ChatStore' }
  )
)

// UI state store
export const useUIStore = create()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        // Layout
        isSidebarOpen: true,
        activePanel: 'chat',
        panelSizes: {
          sidebar: 300,
          chat: 400,
          visualizer: 600
        },
        
        // Modals and overlays
        modals: new Map(),
        notifications: [],
        tooltips: new Map(),
        
        // Theme and appearance
        theme: 'dark',
        accentColor: '#3b82f6',
        fontSize: 14,
        compactMode: false,
        animations: true,
        reducedMotion: false,
        
        // Performance
        fpsTarget: 60,
        qualityLevel: 'high',
        enableGPUAcceleration: true,
        enableWebGL: true,
        
        // Accessibility
        highContrast: false,
        screenReader: false,
        keyboardNavigation: false,
        focusOutlines: true,
        
        // Developer tools
        showDevTools: false,
        showPerformanceMetrics: false,
        debugMode: false,
        
        // Loading states
        loadingStates: new Map(),
        
        // Actions
        toggleSidebar: () => set((state) => {
          state.isSidebarOpen = !state.isSidebarOpen
        }),
        
        setActivePanel: (panel) => set((state) => {
          state.activePanel = panel
        }),
        
        setPanelSize: (panel, size) => set((state) => {
          state.panelSizes[panel] = size
        }),
        
        openModal: (id, props = {}) => set((state) => {
          state.modals.set(id, {
            isOpen: true,
            props,
            timestamp: Date.now()
          })
        }),
        
        closeModal: (id) => set((state) => {
          const modal = state.modals.get(id)
          if (modal) {
            state.modals.set(id, { ...modal, isOpen: false })
          }
        }),
        
        addNotification: (notification) => set((state) => {
          const newNotification = {
            id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            timestamp: Date.now(),
            type: 'info',
            duration: 5000,
            ...notification
          }
          state.notifications.push(newNotification)
        }),
        
        removeNotification: (id) => set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id)
        }),
        
        clearNotifications: () => set((state) => {
          state.notifications = []
        }),
        
        showTooltip: (id, content, position) => set((state) => {
          state.tooltips.set(id, { content, position, visible: true })
        }),
        
        hideTooltip: (id) => set((state) => {
          const tooltip = state.tooltips.get(id)
          if (tooltip) {
            state.tooltips.set(id, { ...tooltip, visible: false })
          }
        }),
        
        setTheme: (theme) => set((state) => {
          state.theme = theme
        }),
        
        setAccentColor: (color) => set((state) => {
          state.accentColor = color
        }),
        
        setFontSize: (size) => set((state) => {
          state.fontSize = Math.max(10, Math.min(24, size))
        }),
        
        toggleCompactMode: () => set((state) => {
          state.compactMode = !state.compactMode
        }),
        
        setAnimations: (enabled) => set((state) => {
          state.animations = enabled
        }),
        
        setReducedMotion: (enabled) => set((state) => {
          state.reducedMotion = enabled
        }),
        
        setQualityLevel: (level) => set((state) => {
          state.qualityLevel = level
          // Adjust FPS target based on quality
          switch (level) {
            case 'low':
              state.fpsTarget = 30
              break
            case 'medium':
              state.fpsTarget = 45
              break
            case 'high':
              state.fpsTarget = 60
              break
            case 'ultra':
              state.fpsTarget = 120
              break
          }
        }),
        
        setGPUAcceleration: (enabled) => set((state) => {
          state.enableGPUAcceleration = enabled
        }),
        
        setWebGL: (enabled) => set((state) => {
          state.enableWebGL = enabled
        }),
        
        setHighContrast: (enabled) => set((state) => {
          state.highContrast = enabled
        }),
        
        setScreenReader: (enabled) => set((state) => {
          state.screenReader = enabled
        }),
        
        setKeyboardNavigation: (enabled) => set((state) => {
          state.keyboardNavigation = enabled
        }),
        
        toggleDevTools: () => set((state) => {
          state.showDevTools = !state.showDevTools
        }),
        
        togglePerformanceMetrics: () => set((state) => {
          state.showPerformanceMetrics = !state.showPerformanceMetrics
        }),
        
        setDebugMode: (enabled) => set((state) => {
          state.debugMode = enabled
        }),
        
        setLoadingState: (key, isLoading) => set((state) => {
          if (isLoading) {
            state.loadingStates.set(key, Date.now())
          } else {
            state.loadingStates.delete(key)
          }
        }),
        
        isLoading: (key) => {
          const state = get()
          return state.loadingStates.has(key)
        }
      }))
    ),
    { name: 'UIStore' }
  )
)

// Combined store selectors
export const useAppState = () => {
  const audio = useAudioStore()
  const chat = useChatStore()
  const ui = useUIStore()
  
  return {
    audio,
    chat,
    ui
  }
}

// Computed selectors
export const useComputedSelectors = () => {
  const filteredMessages = useChatStore(state => {
    if (state.activeFilters.size === 0 && !state.searchQuery) {
      return state.messages
    }
    
    let filtered = state.messages
    
    // Apply search
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase()
      filtered = filtered.filter(msg =>
        msg.content?.toLowerCase().includes(query) ||
        msg.user?.name?.toLowerCase().includes(query)
      )
    }
    
    // Apply filters
    for (const filter of state.activeFilters) {
      switch (filter) {
        case 'bookmarked':
          filtered = filtered.filter(msg => state.bookmarks.has(msg.id))
          break
        case 'has-reactions':
          filtered = filtered.filter(msg => state.reactions.has(msg.id))
          break
        case 'has-threads':
          filtered = filtered.filter(msg => state.threads.has(msg.id))
          break
        case 'images':
          filtered = filtered.filter(msg => msg.type === 'image')
          break
        case 'audio':
          filtered = filtered.filter(msg => msg.type === 'audio')
          break
      }
    }
    
    return filtered
  })
  
  const unreadCount = useChatStore(state => {
    const lastReadTime = state.currentUser.lastReadTime || 0
    return state.messages.filter(msg => msg.timestamp > lastReadTime).length
  })
  
  const activeUsersCount = useChatStore(state => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    return Array.from(state.users.values())
      .filter(user => user.lastSeen > fiveMinutesAgo).length
  })
  
  const currentAudioLevel = useAudioStore(state => {
    return state.isMuted ? 0 : state.volume * (state.audioData.rms || 0)
  })
  
  return {
    filteredMessages,
    unreadCount,
    activeUsersCount,
    currentAudioLevel
  }
}

// Store middleware for analytics
export const withAnalytics = (store) => {
  return (set, get, api) => {
    const originalSet = set
    
    set = (partial, replace) => {
      const prevState = get()
      originalSet(partial, replace)
      const nextState = get()
      
      // Track state changes for analytics
      if (window.analytics) {
        const changes = findStateChanges(prevState, nextState)
        if (changes.length > 0) {
          window.analytics.track('state_change', {
            store: store.name,
            changes
          })
        }
      }
    }
    
    return store(set, get, api)
  }
}

// Helper function to find state changes
const findStateChanges = (prev, next, path = '') => {
  const changes = []
  
  for (const key in next) {
    const currentPath = path ? `${path}.${key}` : key
    
    if (typeof next[key] === 'object' && next[key] !== null && prev[key] !== null) {
      if (Array.isArray(next[key])) {
        if (JSON.stringify(prev[key]) !== JSON.stringify(next[key])) {
          changes.push({
            path: currentPath,
            type: 'array',
            prevLength: prev[key]?.length || 0,
            nextLength: next[key].length
          })
        }
      } else if (next[key] instanceof Map) {
        if (prev[key]?.size !== next[key].size) {
          changes.push({
            path: currentPath,
            type: 'map',
            prevSize: prev[key]?.size || 0,
            nextSize: next[key].size
          })
        }
      } else if (next[key] instanceof Set) {
        if (prev[key]?.size !== next[key].size) {
          changes.push({
            path: currentPath,
            type: 'set',
            prevSize: prev[key]?.size || 0,
            nextSize: next[key].size
          })
        }
      } else {
        changes.push(...findStateChanges(prev[key] || {}, next[key], currentPath))
      }
    } else if (prev[key] !== next[key]) {
      changes.push({
        path: currentPath,
        type: typeof next[key],
        prevValue: prev[key],
        nextValue: next[key]
      })
    }
  }
  
  return changes
}