/**
 * 🎯 UNIFIED BEYFLOW STORE
 * Consolidates all state management into a single, performant store
 * Eliminates redundancies and creates clear data flow patterns
 */
import { create } from 'zustand'
import { subscribeWithSelector, devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// 🏗️ Core Application State
const coreSlice = (set, get) => ({
  // 👤 User & Session
  user: {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Anonymous',
    avatar: null,
    status: 'online',
    preferences: {
      theme: 'dopaminergic',
      fontSize: 14,
      animations: true,
      notifications: true
    }
  },
  
  // 🎮 UI State
  ui: {
    currentModule: 'chat',
    sidebarOpen: true,
    compactMode: false,
    themePersona: 'dopaminergic',
    colorMode: 'dark',
    spectrum: {
      blur: 0.3,
      glow: 0.3,
      saturation: 0.3,
      speed: 0.5
    },
    modals: new Map(),
    notifications: [],
    loading: new Set()
  },
  
  // 💬 Chat System
  chat: {
    messages: [],
    currentMessage: '',
    isTyping: false,
    typingUsers: new Set(),
    sessions: [],
    currentSession: null,
    reactions: new Map(),
    drafts: new Map()
  },
  
  // 🔊 Audio System
  audio: {
    enabled: true,
    volume: 0.7,
    muted: false,
    voice: 'Rachel',
    isRecording: false,
    isPlaying: false,
    currentSource: null,
    visualizationMode: 'spectrum',
    audioData: {
      frequency: new Uint8Array(256),
      waveform: new Uint8Array(1024),
      rms: 0,
      pitch: 0,
      tempo: 120
    }
  },
  
  // 🔗 Integration System
  integrations: {
    beytv: { connected: false, status: 'offline', lastPing: null },
    stackblog: { connected: false, status: 'offline', lastPing: null },
    omnisphere: { connected: false, status: 'offline', lastPing: null },
    events: [],
    workflows: new Map(),
    automations: new Set()
  },
  
  // 📊 Analytics & Performance
  analytics: {
    messageCount: 0,
    sessionTime: 0,
    interactions: 0,
    errors: [],
    performance: {
      renderTime: 0,
      memoryUsage: 0,
      fps: 60
    }
  },
  
  // Actions
  actions: {
    // 👤 User Actions
    setUser: (userData) => set(state => {
      state.user = { ...state.user, ...userData }
    }),
    
    updateUserPreferences: (prefs) => set(state => {
      state.user.preferences = { ...state.user.preferences, ...prefs }
    }),
    
    // 🎮 UI Actions
    setModule: (module) => set(state => {
      state.ui.currentModule = module
    }),
    
    toggleSidebar: () => set(state => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen
    }),
    
    updateSpectrum: (spectrum) => set(state => {
      state.ui.spectrum = { ...state.ui.spectrum, ...spectrum }
    }),
    
    setTheme: (theme) => set(state => {
      state.ui.themePersona = theme
    }),
    
    openModal: (id, props = {}) => set(state => {
      state.ui.modals.set(id, { isOpen: true, props, timestamp: Date.now() })
    }),
    
    closeModal: (id) => set(state => {
      const modal = state.ui.modals.get(id)
      if (modal) {
        state.ui.modals.set(id, { ...modal, isOpen: false })
      }
    }),
    
    addNotification: (notification) => set(state => {
      state.ui.notifications.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification
      })
    }),
    
    removeNotification: (id) => set(state => {
      state.ui.notifications = state.ui.notifications.filter(n => n.id !== id)
    }),
    
    setLoading: (key, isLoading) => set(state => {
      if (isLoading) {
        state.ui.loading.add(key)
      } else {
        state.ui.loading.delete(key)
      }
    }),
    
    // 💬 Chat Actions
    addMessage: (message) => set(state => {
      const newMessage = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        from: message.from || state.user.name,
        type: message.type || 'user',
        ...message
      }
      state.chat.messages.push(newMessage)
      state.analytics.messageCount += 1
    }),
    
    clearMessages: () => set(state => {
      state.chat.messages = []
    }),
    
    setTyping: (isTyping) => set(state => {
      state.chat.isTyping = isTyping
    }),
    
    setCurrentMessage: (message) => set(state => {
      state.chat.currentMessage = message
    }),
    
    saveSession: (name) => set(state => {
      const session = {
        id: Date.now(),
        name: name || `Session ${state.chat.sessions.length + 1}`,
        messages: [...state.chat.messages],
        timestamp: new Date().toISOString()
      }
      state.chat.sessions.push(session)
    }),
    
    loadSession: (sessionId) => set(state => {
      const session = state.chat.sessions.find(s => s.id === sessionId)
      if (session) {
        state.chat.messages = [...session.messages]
        state.chat.currentSession = sessionId
      }
    }),
    
    // 🔊 Audio Actions
    setAudioEnabled: (enabled) => set(state => {
      state.audio.enabled = enabled
    }),
    
    setVolume: (volume) => set(state => {
      state.audio.volume = Math.max(0, Math.min(1, volume))
    }),
    
    toggleMute: () => set(state => {
      state.audio.muted = !state.audio.muted
    }),
    
    setVoice: (voice) => set(state => {
      state.audio.voice = voice
    }),
    
    setRecording: (isRecording) => set(state => {
      state.audio.isRecording = isRecording
    }),
    
    updateAudioData: (audioData) => set(state => {
      state.audio.audioData = { ...state.audio.audioData, ...audioData }
    }),
    
    // 🔗 Integration Actions
    updateIntegrationStatus: (service, status) => set(state => {
      if (state.integrations[service]) {
        state.integrations[service] = {
          ...state.integrations[service],
          ...status,
          lastPing: Date.now()
        }
      }
    }),
    
    addIntegrationEvent: (event) => set(state => {
      state.integrations.events.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...event
      })
      // Keep only last 100 events
      if (state.integrations.events.length > 100) {
        state.integrations.events = state.integrations.events.slice(-100)
      }
    }),
    
    createWorkflow: (workflow) => set(state => {
      const id = Date.now()
      state.integrations.workflows.set(id, {
        id,
        timestamp: new Date().toISOString(),
        status: 'active',
        ...workflow
      })
    }),
    
    // 📊 Analytics Actions
    updateAnalytics: (data) => set(state => {
      state.analytics = { ...state.analytics, ...data }
    }),
    
    addError: (error) => set(state => {
      state.analytics.errors.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        message: error.message || error,
        stack: error.stack || null
      })
      // Keep only last 50 errors
      if (state.analytics.errors.length > 50) {
        state.analytics.errors = state.analytics.errors.slice(-50)
      }
    }),
    
    updatePerformance: (metrics) => set(state => {
      state.analytics.performance = { ...state.analytics.performance, ...metrics }
    }),
    
    // 🔄 Computed Values & Getters
    getState: () => get(),
    
    getIntegrationStatus: () => {
      const { integrations } = get()
      return {
        connected: Object.values(integrations).filter(s => s.connected?.length).length,
        total: Object.keys(integrations).filter(k => k !== 'events' && k !== 'workflows' && k !== 'automations').length,
        services: Object.fromEntries(
          Object.entries(integrations).filter(([k]) => k !== 'events' && k !== 'workflows' && k !== 'automations')
        )
      }
    },
    
    getRecentEvents: (limit = 10) => {
      const { integrations } = get()
      return integrations.events.slice(-limit).reverse()
    },
    
    isLoading: (key) => {
      const { ui } = get()
      return key ? ui.loading.has(key) : ui.loading.size > 0
    }
  }
})

// 🏪 Create Unified Store
export const useBeyFlowStore = create()(
  devtools(
    subscribeWithSelector(
      persist(
        immer(coreSlice),
        {
          name: 'beyflow-store',
          partialize: (state) => ({
            user: state.user,
            ui: {
              themePersona: state.ui.themePersona,
              colorMode: state.ui.colorMode,
              spectrum: state.ui.spectrum,
              compactMode: state.ui.compactMode
            },
            chat: {
              sessions: state.chat.sessions
            },
            audio: {
              enabled: state.audio.enabled,
              volume: state.audio.volume,
              voice: state.audio.voice,
              visualizationMode: state.audio.visualizationMode
            }
          }),
          merge: (persistedState, currentState) => {
            // Deep merge to preserve initial state for unpersisted fields
            const merged = { ...currentState }
            
            if (persistedState) {
              if (persistedState.user) merged.user = { ...currentState.user, ...persistedState.user }
              if (persistedState.ui) merged.ui = { ...currentState.ui, ...persistedState.ui }
              if (persistedState.chat) merged.chat = { ...currentState.chat, ...persistedState.chat }
              if (persistedState.audio) merged.audio = { ...currentState.audio, ...persistedState.audio }
            }
            
            return merged
          }
        }
      )
    ),
    { name: 'BeyFlowStore' }
  )
)

// 🎯 Selective Hooks for Performance
export const useUser = () => useBeyFlowStore(state => state.user)
export const useUserActions = () => useBeyFlowStore(state => state.actions)
export const useUI = () => useBeyFlowStore(state => state.ui)
export const useChat = () => useBeyFlowStore(state => state.chat)
export const useAudio = () => useBeyFlowStore(state => state.audio)
export const useIntegrations = () => useBeyFlowStore(state => state.integrations)
export const useAnalytics = () => useBeyFlowStore(state => state.analytics)

// 🚀 High-Level Hooks
export const useModule = () => {
  const currentModule = useBeyFlowStore(state => state.ui.currentModule)
  const setModule = useBeyFlowStore(state => state.actions.setModule)
  return [currentModule, setModule]
}

export const useMessages = () => {
  const messages = useBeyFlowStore(state => state.chat.messages)
  const addMessage = useBeyFlowStore(state => state.actions.addMessage)
  const clearMessages = useBeyFlowStore(state => state.actions.clearMessages)
  return { messages, addMessage, clearMessages }
}

export const useTheme = () => {
  const theme = useBeyFlowStore(state => state.ui.themePersona)
  const spectrum = useBeyFlowStore(state => state.ui.spectrum)
  const setTheme = useBeyFlowStore(state => state.actions.setTheme)
  const updateSpectrum = useBeyFlowStore(state => state.actions.updateSpectrum)
  return { theme, spectrum, setTheme, updateSpectrum }
}

export const useNotifications = () => {
  const notifications = useBeyFlowStore(state => state.ui.notifications)
  const addNotification = useBeyFlowStore(state => state.actions.addNotification)
  const removeNotification = useBeyFlowStore(state => state.actions.removeNotification)
  return { notifications, addNotification, removeNotification }
}

export const useLoading = () => {
  const setLoading = useBeyFlowStore(state => state.actions.setLoading)
  const isLoading = useBeyFlowStore(state => state.actions.isLoading)
  return { setLoading, isLoading }
}

// 🧠 Legacy Compatibility Hook
export const useLegacyStore = () => {
  const store = useBeyFlowStore()
  
  return {
    // Map to legacy structure
    user: store.user.name,
    setUser: (name) => store.actions.setUser({ name }),
    
    messages: store.chat.messages,
    addMessage: store.actions.addMessage,
    clearMessages: store.actions.clearMessages,
    
    currentModule: store.ui.currentModule,
    setModule: store.actions.setModule,
    
    ui: {
      theme: store.ui.themePersona,
      gradientShift: store.ui.spectrum.saturation * 100,
      sliderValue: store.ui.spectrum.glow * 100,
      patternDepth: store.ui.compactMode ? 2 : 4
    },
    updateUI: (updates) => {
      if (updates.theme) store.actions.setTheme(updates.theme)
      if (updates.gradientShift !== undefined) {
        store.actions.updateSpectrum({ saturation: updates.gradientShift / 100 })
      }
      if (updates.sliderValue !== undefined) {
        store.actions.updateSpectrum({ glow: updates.sliderValue / 100 })
      }
    },
    
    audio: {
      volume: store.audio.volume,
      playing: store.audio.enabled,
      muted: store.audio.muted,
      voice: store.audio.voice
    },
    updateAudio: (updates) => {
      if (updates.volume !== undefined) store.actions.setVolume(updates.volume)
      if (updates.playing !== undefined) store.actions.setAudioEnabled(updates.playing)
      if (updates.muted !== undefined && updates.muted !== store.audio.muted) {
        store.actions.toggleMute()
      }
      if (updates.voice) store.actions.setVoice(updates.voice)
    }
  }
}

export default useBeyFlowStore