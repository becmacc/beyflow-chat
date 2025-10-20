// API connectors for Make, Gmail, Outlook
const API_BASE = 'https://hook.eu2.make.com'

export const api = {
  // Send message to Make webhook
  async sendMessage(webhook, payload) {
    const startTime = Date.now()
    
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'beyflow-chat'
        })
      })

      const data = await response.json().catch(() => ({}))
      const responseTime = Date.now() - startTime

      return {
        success: response.ok,
        data,
        responseTime,
        status: response.status
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      }
    }
  },

  // Gmail integration
  async sendEmail(payload) {
    return this.sendMessage(`${API_BASE}/gmail-webhook`, payload)
  },

  // Outlook integration  
  async sendOutlook(payload) {
    return this.sendMessage(`${API_BASE}/outlook-webhook`, payload)
  },

  // Analytics endpoint
  async sendAnalytics(data) {
    return this.sendMessage(`${API_BASE}/analytics-webhook`, data)
  },

  // AI Studio endpoints
  async callOpenAI(prompt) {
    return this.sendMessage(`${API_BASE}/openai-webhook`, { prompt })
  },

  async callGemini(prompt) {
    return this.sendMessage(`${API_BASE}/gemini-webhook`, { prompt })
  }
}

export default api