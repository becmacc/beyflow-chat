import { useState, useEffect, useCallback, useRef } from 'react'

// Advanced analytics engine
export class AnalyticsEngine {
  constructor() {
    this.events = []
    this.sessions = new Map()
    this.userMetrics = new Map()
    this.realTimeData = {
      activeUsers: 0,
      messagesPerMinute: 0,
      averageResponseTime: 0,
      errorRate: 0
    }
    this.startTime = Date.now()
    this.isRecording = true
  }

  // Track user interactions with detailed context
  trackEvent(eventType, data = {}, userId = 'anonymous') {
    if (!this.isRecording) return

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type: eventType,
      userId,
      timestamp: Date.now(),
      sessionId: this.getSessionId(userId),
      data: {
        ...data,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        performance: this.getPerformanceMetrics()
      }
    }

    this.events.push(event)
    this.updateRealTimeMetrics(event)
    this.updateUserMetrics(userId, event)

    // Trigger real-time analytics if configured
    this.broadcastEvent(event)

    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    return event
  }

  // Get or create session for user
  getSessionId(userId) {
    if (!this.sessions.has(userId)) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      this.sessions.set(userId, {
        sessionId,
        startTime: Date.now(),
        events: [],
        metrics: {
          pageViews: 0,
          interactions: 0,
          timeSpent: 0,
          bounceRate: 0
        }
      })
    }
    return this.sessions.get(userId).sessionId
  }

  // Performance monitoring
  getPerformanceMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0]
    const memory = performance.memory

    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      memoryUsage: memory ? {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      } : null,
      fps: this.getCurrentFPS(),
      connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
    }
  }

  getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint')
    const fpEntry = paintEntries.find(entry => entry.name === 'first-paint')
    return fpEntry ? fpEntry.startTime : 0
  }

  getFirstContentfulPaint() {
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcpEntry ? fcpEntry.startTime : 0
  }

  getCurrentFPS() {
    // This would be updated by a RAF loop in practice
    return this.currentFPS || 60
  }

  // Update real-time metrics
  updateRealTimeMetrics(event) {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Filter recent events
    const recentEvents = this.events.filter(e => e.timestamp > oneMinuteAgo)
    
    // Messages per minute
    const messageEvents = recentEvents.filter(e => e.type === 'message_sent')
    this.realTimeData.messagesPerMinute = messageEvents.length

    // Error rate (errors per 100 events)
    const errorEvents = recentEvents.filter(e => e.type === 'error')
    this.realTimeData.errorRate = recentEvents.length > 0 ? (errorEvents.length / recentEvents.length) * 100 : 0

    // Active users (unique users in last 5 minutes)
    const fiveMinutesAgo = now - 300000
    const recentUsers = new Set(
      this.events
        .filter(e => e.timestamp > fiveMinutesAgo)
        .map(e => e.userId)
    )
    this.realTimeData.activeUsers = recentUsers.size
  }

  // Update user-specific metrics
  updateUserMetrics(userId, event) {
    if (!this.userMetrics.has(userId)) {
      this.userMetrics.set(userId, {
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        totalEvents: 0,
        sessionCount: 1,
        totalTimeSpent: 0,
        avgSessionLength: 0,
        preferredFeatures: new Map(),
        behaviorPattern: 'new_user'
      })
    }

    const userMetric = this.userMetrics.get(userId)
    userMetric.lastSeen = Date.now()
    userMetric.totalEvents++

    // Track feature usage
    if (event.data.feature) {
      const currentCount = userMetric.preferredFeatures.get(event.data.feature) || 0
      userMetric.preferredFeatures.set(event.data.feature, currentCount + 1)
    }

    // Analyze behavior patterns
    userMetric.behaviorPattern = this.analyzeBehaviorPattern(userId)
  }

  // AI-powered behavior pattern analysis
  analyzeBehaviorPattern(userId) {
    const userEvents = this.events.filter(e => e.userId === userId)
    if (userEvents.length < 10) return 'new_user'

    // Analyze patterns
    const eventTypes = userEvents.map(e => e.type)
    const timeIntervals = userEvents.slice(1).map((e, i) => e.timestamp - userEvents[i].timestamp)
    
    const avgInterval = timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length
    const mostCommonEvent = this.getMostCommon(eventTypes)
    
    // Pattern classification
    if (avgInterval < 5000 && mostCommonEvent === 'message_sent') return 'power_user'
    if (avgInterval > 30000) return 'casual_user'
    if (mostCommonEvent === 'audio_played') return 'audio_focused'
    if (mostCommonEvent === 'visualizer_interaction') return 'visual_focused'
    
    return 'regular_user'
  }

  getMostCommon(arr) {
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1
      return acc
    }, {})
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
  }

  // Generate insights using AI
  generateInsights() {
    const totalEvents = this.events.length
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size
    const avgEventsPerUser = totalEvents / uniqueUsers

    // Feature usage analysis
    const featureUsage = this.events.reduce((acc, event) => {
      if (event.data.feature) {
        acc[event.data.feature] = (acc[event.data.feature] || 0) + 1
      }
      return acc
    }, {})

    const topFeatures = Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)

    // Performance insights
    const performanceEvents = this.events.filter(e => e.data.performance)
    const avgLoadTime = performanceEvents.length > 0 
      ? performanceEvents.reduce((sum, e) => sum + e.data.performance.loadTime, 0) / performanceEvents.length
      : 0

    // User journey analysis
    const userJourneys = this.analyzeUserJourneys()

    return {
      overview: {
        totalEvents,
        uniqueUsers,
        avgEventsPerUser: Math.round(avgEventsPerUser * 100) / 100,
        sessionDuration: (Date.now() - this.startTime) / 1000 / 60, // minutes
        realTimeData: this.realTimeData
      },
      features: {
        mostUsed: topFeatures,
        leastUsed: Object.entries(featureUsage)
          .sort(([,a], [,b]) => a - b)
          .slice(0, 3),
        usageDistribution: featureUsage
      },
      performance: {
        avgLoadTime: Math.round(avgLoadTime),
        avgFPS: this.getCurrentFPS(),
        errorRate: this.realTimeData.errorRate,
        criticalIssues: this.detectCriticalIssues()
      },
      users: {
        behaviorPatterns: this.getBehaviorPatternDistribution(),
        retentionRate: this.calculateRetentionRate(),
        engagementScore: this.calculateEngagementScore()
      },
      recommendations: this.generateRecommendations(featureUsage, userJourneys)
    }
  }

  analyzeUserJourneys() {
    const journeys = new Map()
    
    for (const [userId, session] of this.sessions) {
      const userEvents = this.events.filter(e => e.userId === userId)
      const journey = userEvents.map(e => e.type).join(' -> ')
      journeys.set(journey, (journeys.get(journey) || 0) + 1)
    }
    
    return Array.from(journeys.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
  }

  getBehaviorPatternDistribution() {
    const patterns = {}
    for (const [userId, metrics] of this.userMetrics) {
      patterns[metrics.behaviorPattern] = (patterns[metrics.behaviorPattern] || 0) + 1
    }
    return patterns
  }

  calculateRetentionRate() {
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
    
    const totalUsers = this.userMetrics.size
    const dailyRetained = Array.from(this.userMetrics.values())
      .filter(m => m.lastSeen > oneDayAgo).length
    const weeklyRetained = Array.from(this.userMetrics.values())
      .filter(m => m.lastSeen > oneWeekAgo).length
    
    return {
      daily: totalUsers > 0 ? (dailyRetained / totalUsers) * 100 : 0,
      weekly: totalUsers > 0 ? (weeklyRetained / totalUsers) * 100 : 0
    }
  }

  calculateEngagementScore() {
    let totalScore = 0
    let userCount = 0
    
    for (const [userId, metrics] of this.userMetrics) {
      let score = 0
      
      // Factor in event frequency
      score += Math.min(metrics.totalEvents / 100, 1) * 30 // Max 30 points
      
      // Factor in session count
      score += Math.min(metrics.sessionCount / 10, 1) * 25 // Max 25 points
      
      // Factor in time spent
      score += Math.min(metrics.totalTimeSpent / 3600000, 1) * 25 // Max 25 points (1 hour)
      
      // Factor in feature diversity
      const featureCount = metrics.preferredFeatures.size
      score += Math.min(featureCount / 5, 1) * 20 // Max 20 points
      
      totalScore += score
      userCount++
    }
    
    return userCount > 0 ? Math.round(totalScore / userCount) : 0
  }

  detectCriticalIssues() {
    const issues = []
    
    // High error rate
    if (this.realTimeData.errorRate > 5) {
      issues.push({
        type: 'high_error_rate',
        severity: 'critical',
        description: `Error rate is ${this.realTimeData.errorRate.toFixed(2)}% (threshold: 5%)`
      })
    }
    
    // Performance issues
    const recentPerformanceEvents = this.events
      .filter(e => e.data.performance && e.timestamp > Date.now() - 300000) // Last 5 minutes
    
    if (recentPerformanceEvents.length > 0) {
      const avgLoadTime = recentPerformanceEvents
        .reduce((sum, e) => sum + e.data.performance.loadTime, 0) / recentPerformanceEvents.length
      
      if (avgLoadTime > 5000) {
        issues.push({
          type: 'slow_performance',
          severity: 'warning',
          description: `Average load time is ${(avgLoadTime / 1000).toFixed(2)}s (threshold: 5s)`
        })
      }
    }
    
    // Memory leaks
    const memoryEvents = this.events
      .filter(e => e.data.performance?.memoryUsage)
      .slice(-10) // Last 10 events with memory data
    
    if (memoryEvents.length >= 2) {
      const memoryTrend = memoryEvents[memoryEvents.length - 1].data.performance.memoryUsage.used - 
                         memoryEvents[0].data.performance.memoryUsage.used
      
      if (memoryTrend > 50 * 1024 * 1024) { // 50MB increase
        issues.push({
          type: 'memory_leak',
          severity: 'warning',
          description: `Memory usage increased by ${(memoryTrend / 1024 / 1024).toFixed(2)}MB`
        })
      }
    }
    
    return issues
  }

  generateRecommendations(featureUsage, userJourneys) {
    const recommendations = []
    
    // Feature recommendations
    const totalUsage = Object.values(featureUsage).reduce((sum, count) => sum + count, 0)
    const leastUsedFeatures = Object.entries(featureUsage)
      .filter(([, count]) => count < totalUsage * 0.1) // Less than 10% usage
    
    if (leastUsedFeatures.length > 0) {
      recommendations.push({
        type: 'feature_promotion',
        priority: 'medium',
        suggestion: `Consider promoting underused features: ${leastUsedFeatures.map(([name]) => name).join(', ')}`,
        impact: 'User engagement'
      })
    }
    
    // Performance recommendations
    if (this.realTimeData.errorRate > 2) {
      recommendations.push({
        type: 'error_reduction',
        priority: 'high',
        suggestion: 'Investigate and fix high error rate to improve user experience',
        impact: 'User retention'
      })
    }
    
    // User experience recommendations
    const powerUsers = Array.from(this.userMetrics.values())
      .filter(m => m.behaviorPattern === 'power_user').length
    const totalUsers = this.userMetrics.size
    
    if (powerUsers / totalUsers > 0.3) {
      recommendations.push({
        type: 'advanced_features',
        priority: 'medium',
        suggestion: 'Consider adding advanced features for your power user base',
        impact: 'User satisfaction'
      })
    }
    
    return recommendations
  }

  // Broadcast events for real-time analytics
  broadcastEvent(event) {
    // This would typically send to analytics service or WebSocket
    if (window.analytics) {
      window.analytics.track(event.type, event.data)
    }
  }

  // Export data for external analysis
  exportData(format = 'json') {
    const data = {
      events: this.events,
      sessions: Array.from(this.sessions.entries()),
      userMetrics: Array.from(this.userMetrics.entries()),
      insights: this.generateInsights(),
      exportedAt: new Date().toISOString()
    }
    
    switch (format) {
      case 'csv':
        return this.convertToCSV(data.events)
      case 'json':
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  convertToCSV(events) {
    const headers = ['timestamp', 'type', 'userId', 'sessionId', 'data']
    const rows = events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.type,
      event.userId,
      event.sessionId,
      JSON.stringify(event.data)
    ])
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  // Privacy controls
  enablePrivacyMode() {
    this.isRecording = false
  }

  disablePrivacyMode() {
    this.isRecording = true
  }

  clearUserData(userId) {
    this.events = this.events.filter(e => e.userId !== userId)
    this.sessions.delete(userId)
    this.userMetrics.delete(userId)
  }
}

// React hook for analytics
export const useAnalytics = () => {
  const [analytics] = useState(() => new AnalyticsEngine())
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const trackEvent = useCallback((eventType, data, userId) => {
    return analytics.trackEvent(eventType, data, userId)
  }, [analytics])

  const getInsights = useCallback(async () => {
    setIsLoading(true)
    try {
      const insights = analytics.generateInsights()
      setInsights(insights)
      return insights
    } finally {
      setIsLoading(false)
    }
  }, [analytics])

  const exportData = useCallback((format) => {
    return analytics.exportData(format)
  }, [analytics])

  // Auto-generate insights every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      getInsights()
    }, 5 * 60 * 1000) // 5 minutes

    // Initial insights
    getInsights()

    return () => clearInterval(interval)
  }, [getInsights])

  return {
    trackEvent,
    getInsights,
    exportData,
    insights,
    isLoading,
    realTimeData: analytics.realTimeData
  }
}