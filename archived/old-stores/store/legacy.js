// Legacy store for backward compatibility
import { create } from 'zustand'

const useStore = create((set, get) => ({
  // User state
  user: 'Anonymous',
  setUser: (user) => set({ user }),

  // Messages (following state schema)
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      id: Date.now(),
      from: message.user || message.from || 'Anonymous',
      msg: message.text || message.msg || '',
      time: new Date().toISOString(),
      type: message.type || 'user',
      ...message
    }]
  })),
  clearMessages: () => set({ messages: [] }),

  // UI state (following schema)
  ui: {
    theme: 'dopaminergic',
    gradientShift: 0,
    sliderValue: 50,
    patternDepth: 3
  },
  updateUI: (uiUpdates) => set((state) => ({
    ui: { ...state.ui, ...uiUpdates }
  })),

  // Audio state
  audio: {
    playing: false,
    volume: 0.7,
    isListening: false,
    audioUrl: null
  },
  setAudio: (audioUpdates) => set((state) => ({
    audio: { ...state.audio, ...audioUpdates }
  })),
  setAudioUrl: (url) => set((state) => ({
    audio: { ...state.audio, audioUrl: url }
  })),

  // Scene/3D state
  sceneConfig: {
    color: '#4ade80',
    rotation: true,
    scale: 1
  },
  setSceneConfig: (config) => set((state) => ({
    sceneConfig: { ...state.sceneConfig, ...config }
  })),

  // Module system
  currentModule: 'chat',
  setModule: (module) => set({ currentModule: module }),

  // Webhook integration
  webhook: null,
  setWebhook: (webhook) => set({ webhook }),

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Analytics
  analytics: {
    totalMessages: 0,
    sessionTime: 0,
    interactions: 0
  },
  updateAnalytics: (analyticsUpdates) => set((state) => ({
    analytics: { ...state.analytics, ...analyticsUpdates }
  }))
}))

export default useStore