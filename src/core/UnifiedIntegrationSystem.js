/**
 * 🔗 UNIFIED INTEGRATION SYSTEM
 * Consolidates BeyFlowCore, IntegrationManager, and Adapters
 * Single source of truth for all cross-component communication
 */
import { useBeyFlowStore } from './UnifiedStore.js'

class UnifiedIntegrationSystem {
  constructor() {
    this.services = new Map()
    this.eventBus = new Map()
    this.workflows = new Map()
    this.heartbeatInterval = null
    this.initialized = false
    
    // Auto-initialize when store is ready
    this.init()
  }

  /**
   * 🚀 Initialize the integration system
   */
  async init() {
    if (this.initialized) return
    
    console.log('🔗 Initializing Unified Integration System...')
    
    // Register default services
    this.registerService('beytv', {
      name: 'BeyTV Media Server',
      url: 'http://localhost:8000',
      healthEndpoint: '/health',
      apiEndpoints: {
        search: '/api/media/search',
        download: '/api/media/download',
        recent: '/api/media/recent'
      }
    })
    
    this.registerService('stackblog', {
      name: 'Stack Blog CMS',
      url: 'http://localhost:8888',
      healthEndpoint: '/api/health',
      apiEndpoints: {
        posts: '/api/posts',
        create: '/api/posts',
        categories: '/api/categories'
      }
    })
    
    this.registerService('omnisphere', {
      name: 'Omnisphere AI',
      url: 'http://localhost:3001',
      healthEndpoint: '/health',
      apiEndpoints: {
        process: '/api/process',
        workflows: '/api/workflows',
        tasks: '/api/tasks'
      }
    })
    
    // Start health monitoring
    this.startHealthMonitoring()
    
    // Setup global event listeners
    this.setupGlobalEvents()
    
    // Expose to window for external access
    window.BeyFlowIntegration = this
    
    this.initialized = true
    this.emit('system:initialized', { timestamp: Date.now() })
    
    console.log('✅ Integration System Ready')
  }

  /**
   * 📋 Register a new service
   */
  registerService(id, config) {
    this.services.set(id, {
      id,
      connected: false,
      status: 'offline',
      lastPing: null,
      errors: [],
      ...config
    })
    
    console.log(`📋 Registered service: ${id}`)
    this.emit('service:registered', { serviceId: id, config })
  }

  /**
   * 🔌 Connect to a service
   */
  async connectService(serviceId) {
    const service = this.services.get(serviceId)
    if (!service) {
      throw new Error(`Service ${serviceId} not found`)
    }

    try {
      const response = await fetch(`${service.url}${service.healthEndpoint}`)
      const isHealthy = response.ok
      
      this.updateServiceStatus(serviceId, {
        connected: isHealthy,
        status: isHealthy ? 'connected' : 'error',
        lastPing: Date.now(),
        error: isHealthy ? null : `HTTP ${response.status}`
      })
      
      if (isHealthy) {
        this.emit('service:connected', { serviceId })
      }
      
      return isHealthy
    } catch (error) {
      this.updateServiceStatus(serviceId, {
        connected: false,
        status: 'error',
        lastPing: Date.now(),
        error: error.message
      })
      
      this.emit('service:error', { serviceId, error: error.message })
      return false
    }
  }

  /**
   * 📊 Update service status in store
   */
  updateServiceStatus(serviceId, updates) {
    const service = this.services.get(serviceId)
    if (service) {
      Object.assign(service, updates)
      this.services.set(serviceId, service)
      
      // Update global store
      const store = useBeyFlowStore.getState()
      store.actions.updateIntegrationStatus(serviceId, updates)
    }
  }

  /**
   * 💓 Health monitoring system
   */
  startHealthMonitoring() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    
    this.heartbeatInterval = setInterval(async () => {
      for (const [serviceId] of this.services) {
        await this.connectService(serviceId)
      }
    }, 10000) // Check every 10 seconds
    
    // Initial health check
    setTimeout(() => {
      for (const [serviceId] of this.services) {
        this.connectService(serviceId)
      }
    }, 1000)
  }

  /**
   * 📡 Event system
   */
  on(event, callback) {
    if (!this.eventBus.has(event)) {
      this.eventBus.set(event, new Set())
    }
    this.eventBus.get(event).add(callback)
    
    return () => this.off(event, callback)
  }

  off(event, callback) {
    const listeners = this.eventBus.get(event)
    if (listeners) {
      listeners.delete(callback)
    }
  }

  emit(event, data = {}) {
    const listeners = this.eventBus.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
    
    // Log to store
    const store = useBeyFlowStore.getState()
    store.actions.addIntegrationEvent({
      type: event,
      data,
      source: 'integration-system'
    })
  }

  /**
   * 🌍 Global event setup
   */
  setupGlobalEvents() {
    // Listen for chat messages
    this.on('chat:message_sent', async (data) => {
      const { message, flags } = data
      
      // Auto-process with AI if flagged
      if (flags?.aiProcessing) {
        await this.processWithAI(message)
      }
      
      // Auto-create blog post if flagged
      if (flags?.blogPost) {
        await this.createBlogPost(message, data.response)
      }
      
      // Auto-search media if flagged
      if (flags?.mediaSearch) {
        await this.searchMedia(message)
      }
    })
    
    // Listen for workflow triggers
    this.on('workflow:trigger', async (data) => {
      await this.executeWorkflow(data.workflowId, data.context)
    })
  }

  /**
   * 🤖 AI Processing
   */
  async processWithAI(message) {
    const service = this.services.get('omnisphere')
    if (!service?.connected) {
      console.warn('Omnisphere not connected')
      return null
    }

    try {
      const response = await fetch(`${service.url}${service.apiEndpoints.process}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          type: 'chat_message',
          timestamp: new Date().toISOString()
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        this.emit('ai:processed', { message, result })
        return result
      }
    } catch (error) {
      console.error('AI processing failed:', error)
      this.emit('ai:error', { message, error: error.message })
    }
    
    return null
  }

  /**
   * 📝 Blog Post Creation
   */
  async createBlogPost(message, aiResponse) {
    const service = this.services.get('stackblog')
    if (!service?.connected) {
      console.warn('Stack Blog not connected')
      return null
    }

    const postData = {
      title: `Chat Session - ${new Date().toLocaleDateString()}`,
      content: `## User Question\n${message}\n\n## AI Response\n${aiResponse}\n\n---\n*Auto-generated from BeyFlow chat*`,
      category: 'chat-logs',
      tags: ['auto-generated', 'chat', 'ai']
    }

    try {
      const response = await fetch(`${service.url}${service.apiEndpoints.create}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        const result = await response.json()
        this.emit('blog:post_created', { postData, result })
        return result
      }
    } catch (error) {
      console.error('Blog post creation failed:', error)
      this.emit('blog:error', { postData, error: error.message })
    }
    
    return null
  }

  /**
   * 🎬 Media Search
   */
  async searchMedia(query) {
    const service = this.services.get('beytv')
    if (!service?.connected) {
      console.warn('BeyTV not connected')
      return null
    }

    try {
      const response = await fetch(`${service.url}${service.apiEndpoints.search}?q=${encodeURIComponent(query)}`)
      
      if (response.ok) {
        const result = await response.json()
        this.emit('media:search_results', { query, result })
        return result
      }
    } catch (error) {
      console.error('Media search failed:', error)
      this.emit('media:error', { query, error: error.message })
    }
    
    return null
  }

  /**
   * ⚙️ Workflow Execution
   */
  async executeWorkflow(workflowId, context = {}) {
    const workflow = this.workflows.get(workflowId)
    if (!workflow) {
      console.warn(`Workflow ${workflowId} not found`)
      return
    }

    this.emit('workflow:started', { workflowId, context })

    try {
      for (const step of workflow.steps) {
        await this.executeWorkflowStep(step, context)
      }
      
      this.emit('workflow:completed', { workflowId, context })
    } catch (error) {
      console.error(`Workflow ${workflowId} failed:`, error)
      this.emit('workflow:error', { workflowId, error: error.message })
    }
  }

  /**
   * 🔧 Execute workflow step
   */
  async executeWorkflowStep(step, context) {
    switch (step.type) {
      case 'ai_process':
        return await this.processWithAI(step.input || context.message)
      
      case 'create_post':
        return await this.createBlogPost(step.input || context.message, context.aiResponse)
      
      case 'search_media':
        return await this.searchMedia(step.input || context.query)
      
      case 'delay':
        return new Promise(resolve => setTimeout(resolve, step.duration || 1000))
      
      default:
        console.warn(`Unknown workflow step type: ${step.type}`)
    }
  }

  /**
   * 📊 Status and utilities
   */
  getStatus() {
    const services = {}
    for (const [id, service] of this.services) {
      services[id] = {
        connected: service.connected,
        status: service.status,
        lastPing: service.lastPing,
        error: service.error
      }
    }
    
    return {
      initialized: this.initialized,
      services,
      eventCount: Array.from(this.eventBus.values()).reduce((sum, set) => sum + set.size, 0),
      workflowCount: this.workflows.size
    }
  }

  /**
   * 🧹 Cleanup
   */
  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    
    this.eventBus.clear()
    this.services.clear()
    this.workflows.clear()
    this.initialized = false
    
    if (window.BeyFlowIntegration === this) {
      delete window.BeyFlowIntegration
    }
  }

  /**
   * 🔄 Create workflow
   */
  createWorkflow(name, steps, triggers = []) {
    const id = Date.now().toString()
    const workflow = {
      id,
      name,
      steps,
      triggers,
      created: new Date().toISOString(),
      status: 'active'
    }
    
    this.workflows.set(id, workflow)
    this.emit('workflow:created', { workflow })
    
    // Setup triggers
    triggers.forEach(trigger => {
      this.on(trigger.event, (data) => {
        if (this.matchesTriggerCondition(trigger, data)) {
          this.executeWorkflow(id, data)
        }
      })
    })
    
    return id
  }

  /**
   * 🎯 Match trigger condition
   */
  matchesTriggerCondition(trigger, data) {
    if (!trigger.condition) return true
    
    // Simple condition matching
    for (const [key, value] of Object.entries(trigger.condition)) {
      if (data[key] !== value) return false
    }
    
    return true
  }
}

// 🌍 Global instance
const integrationSystem = new UnifiedIntegrationSystem()

// 🎣 React hooks for integration system
export const useIntegrationSystem = () => {
  const integrations = useBeyFlowStore(state => state.integrations)
  const addEvent = useBeyFlowStore(state => state.actions.addIntegrationEvent)
  
  return {
    ...integrations,
    system: integrationSystem,
    emit: integrationSystem.emit.bind(integrationSystem),
    on: integrationSystem.on.bind(integrationSystem),
    off: integrationSystem.off.bind(integrationSystem),
    getStatus: integrationSystem.getStatus.bind(integrationSystem),
    createWorkflow: integrationSystem.createWorkflow.bind(integrationSystem),
    addEvent
  }
}

export const useServiceStatus = (serviceId) => {
  const integrations = useBeyFlowStore(state => state.integrations)
  return integrations[serviceId] || { connected: false, status: 'offline' }
}

export const useIntegrationEvents = (limit = 10) => {
  const events = useBeyFlowStore(state => state.integrations.events)
  return events.slice(-limit).reverse()
}

export default integrationSystem