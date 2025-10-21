import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import contactsData from './data/contacts.json'
import workspaceData from './data/beyflow.json'

const useStore = create(
  persist(
    (set, get) => ({
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

  // Theme persona
  themePersona: 'terminal',
  setThemePersona: (persona) => set({ themePersona: persona }),
  
  // Color mode (semantic states)
  colorMode: 'neutral',
  setColorMode: (mode) => {
    console.log('🎨 Store: Setting colorMode to:', mode)
    set({ colorMode: mode })
  },

  // Current module
  currentModule: 'chat',
  setModule: (module) => set({ currentModule: module }),

  // Loading states
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Webhook config
  webhook: 'https://hook.eu2.make.com/8n2onkq2qybp58ugij473e7ekvex',
  setWebhook: (webhook) => set({ webhook }),

  // 3D scene state
  sceneConfig: {
    particleCount: 100,
    rotation: true,
    color: '#4CC3D9'
  },
  updateSceneConfig: (config) => set((state) => ({
    sceneConfig: { ...state.sceneConfig, ...config }
  })),

  // Analytics
  analytics: {
    messageCount: 0,
    sessionTime: 0,
    responseTime: []
  },
  updateAnalytics: (data) => set((state) => ({
    analytics: { ...state.analytics, ...data }
  })),

  // Audio state (following audio_state.json)
  audio: {
    playing: false,
    voice: "Rachel",
    volume: 1.0,
    muted: false,
    currentAudioUrl: null,
    isListening: false
  },
  updateAudio: (audioUpdates) => set((state) => ({
    audio: { ...state.audio, ...audioUpdates }
  })),
  setAudioUrl: (url) => set((state) => ({
    audio: { ...state.audio, currentAudioUrl: url }
  })),
  toggleMute: () => set((state) => ({
    audio: { ...state.audio, muted: !state.audio.muted }
  })),

  // Contacts Hub
  contacts: contactsData,
  addContact: (contact) => set((state) => ({
    contacts: [...state.contacts, { ...contact, id: `c${Date.now()}` }]
  })),
  
  // Workspace
  workspacePages: workspaceData.pages,
  activePageId: workspaceData.pages[0]?.id || 'p1',
  setActivePage: (pageId) => set({ activePageId: pageId }),
  updateBlock: (pageId, blockIndex, updates) => set((state) => ({
    workspacePages: state.workspacePages.map(page =>
      page.id === pageId
        ? {
            ...page,
            blocks: page.blocks.map((block, idx) =>
              idx === blockIndex ? { ...block, ...updates } : block
            )
          }
        : page
    )
  })),

  // Modular Workspace Grid
  workspaceModules: [
    { id: 'm1', type: 'notes', position: { row: 1, col: 1 }, size: { rows: 2, cols: 2 } },
    { id: 'm2', type: 'analytics', position: { row: 1, col: 3 }, size: { rows: 1, cols: 1 } },
  ],
  availableModuleTypes: ['code', 'web3', 'terminal', 'notes', 'analytics'],
  addWorkspaceModule: (type) => set((state) => ({
    workspaceModules: [
      ...state.workspaceModules,
      {
        id: `m${Date.now()}`,
        type,
        position: { row: 1, col: 1 },
        size: { rows: 2, cols: 2 }
      }
    ]
  })),
  removeWorkspaceModule: (id) => set((state) => ({
    workspaceModules: state.workspaceModules.filter(m => m.id !== id)
  })),
  updateModuleSize: (id, size) => set((state) => ({
    workspaceModules: state.workspaceModules.map(m =>
      m.id === id ? { ...m, size } : m
    )
  })),
  
  // Workspace Config Persistence
  workspaceConfigs: JSON.parse(localStorage.getItem('workspaceConfigs') || '[]'),
  
  saveWorkspaceConfig: (name) => {
    const { workspaceModules, workspaceConfigs } = get()
    const newConfig = {
      name,
      modules: workspaceModules,
      timestamp: Date.now()
    }
    
    const existingIndex = workspaceConfigs.findIndex(c => c.name === name)
    let updatedConfigs
    
    if (existingIndex >= 0) {
      updatedConfigs = workspaceConfigs.map((c, i) => 
        i === existingIndex ? newConfig : c
      )
    } else {
      updatedConfigs = [...workspaceConfigs, newConfig]
    }
    
    localStorage.setItem('workspaceConfigs', JSON.stringify(updatedConfigs))
    set({ workspaceConfigs: updatedConfigs })
    return true
  },
  
  loadWorkspaceConfig: (name) => {
    const { workspaceConfigs } = get()
    const config = workspaceConfigs.find(c => c.name === name)
    
    if (config) {
      set({ workspaceModules: config.modules })
      return true
    }
    return false
  },
  
  deleteWorkspaceConfig: (name) => {
    const { workspaceConfigs } = get()
    const updatedConfigs = workspaceConfigs.filter(c => c.name !== name)
    
    localStorage.setItem('workspaceConfigs', JSON.stringify(updatedConfigs))
    set({ workspaceConfigs: updatedConfigs })
    return true
  },
  
  exportWorkspaceConfig: () => {
    const { workspaceModules } = get()
    return JSON.stringify(workspaceModules, null, 2)
  },
  
  importWorkspaceConfig: (jsonString) => {
    try {
      const modules = JSON.parse(jsonString)
      if (Array.isArray(modules)) {
        set({ workspaceModules: modules })
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to import workspace config:', error)
      return false
    }
  }
    }),
    {
      name: 'beyflow-workspace-storage',
      partialize: (state) => ({
        workspaceModules: state.workspaceModules,
      })
    }
  )
)

export default useStore