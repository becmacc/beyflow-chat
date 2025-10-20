// Bridge between legacy store and new advanced stores
import { useAudioStore, useChatStore, useUIStore } from './store/index.js'

// Enhanced store hook that combines all stores for legacy compatibility
export const useAppState = () => {
  const audio = useAudioStore()
  const chat = useChatStore()
  const ui = useUIStore()
  
  return {
    // Legacy audio mappings
    audio: {
      playing: audio.audioEnabled,
      volume: audio.volume,
      isListening: audio.isRecording,
      audioUrl: audio.currentSource
    },
    setAudio: (updates) => {
      if (updates.volume !== undefined) audio.setVolume(updates.volume)
      if (updates.playing !== undefined) audio.setAudioEnabled(updates.playing)
    },
    setAudioUrl: (url) => audio.setCurrentSource(url),
    
    // Legacy UI mappings  
    ui: {
      theme: ui.theme,
      gradientShift: ui.accentColor,
      sliderValue: ui.fontSize * 4, // Scale to legacy range
      patternDepth: ui.compactMode ? 2 : 4
    },
    updateUI: (updates) => {
      if (updates.theme) ui.setTheme(updates.theme)
      if (updates.gradientShift) ui.setAccentColor(updates.gradientShift)
      if (updates.sliderValue) ui.setFontSize(updates.sliderValue / 4)
    },
    
    // Legacy message mappings
    messages: chat.messages,
    addMessage: (message) => chat.addMessage({
      content: message.text || message.msg || '',
      user: { name: message.user || message.from || 'Anonymous' },
      type: message.type || 'user'
    }),
    clearMessages: () => chat.clearMessages(),
    
    // Legacy user mappings
    user: chat.currentUser.name,
    setUser: (name) => chat.setCurrentUser({ name }),
    
    // Module system
    currentModule: ui.activePanel,
    setModule: (module) => ui.setActivePanel(module),
    
    // Loading states
    isLoading: ui.isLoading('general'),
    setLoading: (loading) => ui.setLoadingState('general', loading),
    
    // Scene config
    sceneConfig: {
      color: ui.accentColor,
      rotation: ui.animations,
      scale: ui.compactMode ? 0.8 : 1
    },
    setSceneConfig: (config) => {
      if (config.color) ui.setAccentColor(config.color)
      if (config.rotation !== undefined) ui.setAnimations(config.rotation)
    },
    
    // Analytics placeholder
    analytics: {
      totalMessages: chat.messages.length,
      sessionTime: 0,
      interactions: 0
    },
    updateAnalytics: () => {},
    
    // Webhook placeholder
    webhook: null,
    setWebhook: () => {}
  }
}

export default useAppState
export { useAudioStore, useChatStore, useUIStore }