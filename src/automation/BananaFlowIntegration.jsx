// Banana Flow Integration for BeyFlow Chat
// Lightweight automation system for parallel event handling

import { useEffect, useRef, useState } from 'react'
import { BananaAgent } from './nanoAgent'
import router from './event_router'
import { useBeyFlowStore } from "../core/UnifiedStore"

export function useBananaFlow() {
  const agentRef = useRef(null)
  const [stats, setStats] = useState({})
  const [isActive, setIsActive] = useState(false)
    const messages = useBeyFlowStore(state => state.chat.messages)
  const audio = useBeyFlowStore(state => state.audio)
  const ui = useBeyFlowStore(state => state.ui)

  // Initialize Banana Agent
  useEffect(() => {
    const agent = new BananaAgent(router.getAllRoutes())
    agentRef.current = agent
    
    const startAgent = async () => {
      await agent.start()
      setIsActive(true)
      
      // Update stats periodically
      const statsInterval = setInterval(() => {
        setStats(agent.getStats())
      }, 2000)
      
      return () => clearInterval(statsInterval)
    }
    
    startAgent()
    
    return () => {
      if (agentRef.current) {
        agentRef.current.stop()
        setIsActive(false)
      }
    }
  }, [])

  // Trigger flows based on app state changes
  useEffect(() => {
    if (!agentRef.current || !isActive) return

    const agent = agentRef.current
    
    // Listen for new messages and trigger chat flow
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1]
      agent.runSequence('chat_message', {
        message: latestMessage.content,
        timestamp: latestMessage.timestamp,
        type: latestMessage.type
      })
    }
  }, [messages, isActive])

  useEffect(() => {
    if (!agentRef.current || !isActive) return

    const agent = agentRef.current
    
    // Trigger audio feedback flow when audio plays
    if (audio.isPlaying) {
      agent.runSequence('audio_played', {
        currentTrack: audio.currentTrack,
        volume: audio.volume,
        timestamp: Date.now()
      })
    }
  }, [audio.isPlaying, isActive])

  useEffect(() => {
    if (!agentRef.current || !isActive) return

    const agent = agentRef.current
    
    // Trigger UI analytics when gradient shifts
    if (ui.gradientShift > 0) {
      agent.runSequence('session_event', {
        eventType: 'gradient_shift',
        value: ui.gradientShift,
        timestamp: Date.now()
      })
    }
  }, [ui.gradientShift, isActive])

  // Exposed functions for manual triggers
  const triggerFlow = async (trigger, data = {}) => {
    if (!agentRef.current || !isActive) {
      console.warn('🍌 Banana Flow not active')
      return null
    }
    
    return await agentRef.current.runSequence(trigger, data)
  }

  const triggerImageGeneration = async (prompt, options = {}) => {
    return await triggerFlow('image_request', {
      prompt,
      options,
      timestamp: Date.now(),
      userId: 'current_user' // You can get this from your auth system
    })
  }

  const triggerBrandInteraction = async (assetType, interaction = 'click') => {
    return await triggerFlow('brand_interaction', {
      assetType,
      interaction,
      timestamp: Date.now()
    })
  }

  return {
    isActive,
    stats,
    triggerFlow,
    triggerImageGeneration,
    triggerBrandInteraction,
    agent: agentRef.current
  }
}

// Banana Flow Status Component
export function BananaFlowStatus() {
  const { isActive, stats } = useBananaFlow()
  
  if (!isActive) return null
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/20 backdrop-blur-sm rounded-lg p-2 text-xs text-white/60 z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span>🍌 Banana Flow</span>
        <span className="text-white/40">|</span>
        <span>{stats.sequencesRun || 0} flows</span>
        <span className="text-white/40">|</span>
        <span>{stats.activeSequences || 0} active</span>
      </div>
    </div>
  )
}

// Hook for triggering flows from components
export function useBananaFlowTrigger() {
  const { triggerFlow, triggerImageGeneration, triggerBrandInteraction } = useBananaFlow()
  
  return {
    triggerFlow,
    triggerImageGeneration, 
    triggerBrandInteraction
  }
}