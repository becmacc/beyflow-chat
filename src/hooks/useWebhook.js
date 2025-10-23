import { useState, useCallback } from 'react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import api from '../modules/api'

export function useWebhook() {
  const { webhook, addMessage, updateAnalytics } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (payload) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await api.sendMessage(webhook, payload)
      
      // Update analytics
      const currentAnalytics = useStore.getState().analytics
      updateAnalytics({
        messageCount: currentAnalytics.messageCount + 1,
        responseTime: [...(currentAnalytics.responseTime || []), result.responseTime]
      })

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [webhook, addMessage, updateAnalytics])

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null)
  }
}

export function useAnalytics() {
  const { analytics, updateAnalytics } = useStore()

  const getAverageResponseTime = useCallback(() => {
    if (!analytics.responseTime || analytics.responseTime.length === 0) return 0
    const sum = analytics.responseTime.reduce((a, b) => a + b, 0)
    return sum / analytics.responseTime.length
  }, [analytics.responseTime])

  const getSessionTime = useCallback(() => {
    // This would be more complex in a real app, tracking start time
    return analytics.sessionTime || 0
  }, [analytics.sessionTime])

  const trackEvent = useCallback((eventName, data = {}) => {
    console.log('Analytics Event:', eventName, data)
    // In a real app, you'd send this to an analytics service
  }, [])

  return {
    analytics,
    updateAnalytics,
    getAverageResponseTime,
    getSessionTime,
    trackEvent
  }
}