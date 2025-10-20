// Banana Flow - Nano Agent for Lightweight Automation
// Handles parallel flows and event orchestration

export class BananaAgent {
  constructor(webhookMap = {}) {
    this.webhookMap = webhookMap
    this.activeSequences = new Map()
    this.isRunning = false
    this.stats = {
      sequencesRun: 0,
      errors: 0,
      averageTime: 0
    }
  }

  async start() {
    this.isRunning = true
    console.log('🍌 Banana Flow Agent Started')
  }

  async stop() {
    this.isRunning = false
    // Clean up active sequences
    for (const [id, sequence] of this.activeSequences) {
      if (sequence.cleanup) {
        await sequence.cleanup()
      }
    }
    this.activeSequences.clear()
    console.log('🍌 Banana Flow Agent Stopped')
  }

  async runSequence(trigger, data = {}, options = {}) {
    if (!this.isRunning) {
      console.warn('🍌 Agent not running, ignoring trigger:', trigger)
      return
    }

    const route = this.webhookMap[trigger]
    if (!route) {
      console.warn('🍌 No route for trigger:', trigger)
      return
    }

    const sequenceId = `${trigger}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    const startTime = Date.now()

    try {
      this.activeSequences.set(sequenceId, {
        trigger,
        data,
        startTime,
        status: 'running'
      })

      console.log(`🍌 Starting sequence [${sequenceId}]:`, trigger)

      for (let i = 0; i < route.actions.length; i++) {
        const action = route.actions[i]
        
        if (!this.isRunning) {
          console.log(`🍌 Sequence [${sequenceId}] interrupted`)
          break
        }

        console.log(`🍌 [${sequenceId}] Action ${i + 1}/${route.actions.length}: ${action}`)
        
        // Execute action with error handling
        await this.executeAction(action, data, sequenceId)
        
        // Small delay between actions to prevent overwhelming
        await new Promise(r => setTimeout(r, options.delay || 250))
      }

      const duration = Date.now() - startTime
      this.stats.sequencesRun++
      this.stats.averageTime = (this.stats.averageTime + duration) / 2

      console.log(`🍌 Sequence [${sequenceId}] completed in ${duration}ms`)
      
      this.activeSequences.delete(sequenceId)
      return { success: true, duration, sequenceId }

    } catch (error) {
      this.stats.errors++
      console.error(`🍌 Sequence [${sequenceId}] error:`, error.message)
      this.activeSequences.delete(sequenceId)
      return { success: false, error: error.message, sequenceId }
    }
  }

  async executeAction(action, data, sequenceId) {
    // Action execution logic - can be extended for specific actions
    switch (action) {
      case 'format_email':
        return this.formatEmail(data)
      case 'send_to_gmail':
        return this.sendToGmail(data)
      case 'log_to_sheet':
        return this.logToSheet(data)
      case 'capture_sentiment':
        return this.captureSentiment(data)
      case 'update_ui_state':
        return this.updateUIState(data)
      case 'adjust_gradient':
        return this.adjustGradient(data)
      case 'send_to_gemini':
        return this.sendToGemini(data)
      case 'receive_summary':
        return this.receiveSummary(data)
      case 'update_dashboard':
        return this.updateDashboard(data)
      default:
        console.log(`🍌 Unknown action: ${action}`)
        return null
    }
  }

  // Action implementations
  async formatEmail(data) {
    console.log('📧 Formatting email from chat data')
    return { formatted: true, subject: `Chat: ${data.message?.slice(0, 50)}...` }
  }

  async sendToGmail(data) {
    console.log('📮 Sending to Gmail API')
    return { sent: true, messageId: 'gmail_' + Date.now() }
  }

  async logToSheet(data) {
    console.log('📊 Logging to Google Sheets')
    return { logged: true, row: Math.floor(Math.random() * 1000) }
  }

  async captureSentiment(data) {
    console.log('🎭 Analyzing sentiment')
    const sentiments = ['positive', 'neutral', 'negative']
    return { sentiment: sentiments[Math.floor(Math.random() * sentiments.length)] }
  }

  async updateUIState(data) {
    console.log('🎨 Updating UI state')
    // This would connect to your Zustand store
    return { uiUpdated: true }
  }

  async adjustGradient(data) {
    console.log('🌈 Adjusting gradient colors')
    return { gradientShift: Math.floor(Math.random() * 360) }
  }

  async sendToGemini(data) {
    console.log('🧠 Sending to Gemini AI')
    return { response: 'Gemini response placeholder' }
  }

  async receiveSummary(data) {
    console.log('📝 Receiving AI summary')
    return { summary: 'AI summary placeholder' }
  }

  async updateDashboard(data) {
    console.log('📊 Updating dashboard')
    return { dashboardUpdated: true }
  }

  // Utility methods
  getStats() {
    return {
      ...this.stats,
      activeSequences: this.activeSequences.size,
      isRunning: this.isRunning
    }
  }

  getActiveSequences() {
    return Array.from(this.activeSequences.entries()).map(([id, seq]) => ({
      id,
      ...seq,
      duration: Date.now() - seq.startTime
    }))
  }
}

// Legacy function for backwards compatibility
export async function runSequence(trigger, data, webhookMap) {
  const agent = new BananaAgent(webhookMap)
  await agent.start()
  const result = await agent.runSequence(trigger, data)
  await agent.stop()
  return result
}
