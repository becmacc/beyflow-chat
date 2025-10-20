// Enhanced Banana Flow Event Router
import batchSequences from './batch_sequences.json'

class BananaEventRouter {
  constructor() {
    this.flows = batchSequences.bananaFlows.flows
    this.settings = batchSequences.bananaFlows.globalSettings
    this.webhookMap = this.buildWebhookMap()
  }

  buildWebhookMap() {
    const map = {}
    
    this.flows.forEach(flow => {
      if (flow.enabled) {
        map[flow.trigger] = {
          actions: flow.actions,
          priority: flow.priority,
          delay: flow.delay || this.settings.defaultDelay,
          name: flow.name,
          description: flow.description
        }
      }
    })
    
    return map
  }

  getRoute(trigger) {
    return this.webhookMap[trigger] || null
  }

  getAllRoutes() {
    return this.webhookMap
  }

  getEnabledTriggers() {
    return Object.keys(this.webhookMap)
  }

  getFlowByName(name) {
    return this.flows.find(flow => flow.name === name)
  }

  // Dynamic route registration for runtime flows
  registerFlow(trigger, actions, options = {}) {
    this.webhookMap[trigger] = {
      actions: Array.isArray(actions) ? actions : [actions],
      priority: options.priority || 'medium',
      delay: options.delay || this.settings.defaultDelay,
      name: options.name || `Dynamic_${trigger}`,
      description: options.description || 'Dynamically registered flow',
      dynamic: true
    }
    
    console.log(`🍌 Registered dynamic flow: ${trigger}`)
    return this.webhookMap[trigger]
  }

  unregisterFlow(trigger) {
    if (this.webhookMap[trigger]?.dynamic) {
      delete this.webhookMap[trigger]
      console.log(`🍌 Unregistered dynamic flow: ${trigger}`)
      return true
    }
    return false
  }
}

// Create singleton instance
const router = new BananaEventRouter()

// Export both the class and instance for flexibility
export { BananaEventRouter }
export default router

// Legacy webhook map for backwards compatibility  
export const webhookMap = router.getAllRoutes()

// Convenience functions
export const getRoute = (trigger) => router.getRoute(trigger)
export const registerFlow = (trigger, actions, options) => router.registerFlow(trigger, actions, options)
export const unregisterFlow = (trigger) => router.unregisterFlow(trigger)
