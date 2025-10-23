/**
 * BeyFlow Universal Integration Core
 * Organically connects Chat + BeyTV + Stack Blog + Omnisphere
 * Zero external dependencies - pure JavaScript
 */

class BeyFlowCore {
  constructor() {
    this.components = new Map();
    this.eventBus = new Map();
    this.apiRoutes = new Map();
    this.crossComponentData = new Map();
    this.automationTriggers = new Map();
    
    // Component status tracking
    this.status = {
      chat: 'active',
      beytv: 'checking',
      stackblog: 'checking', 
      omnisphere: 'checking'
    };
    
    this.initializeCore();
  }

  initializeCore() {
    console.log('🚀 BeyFlow Core initializing...');
    
    // Set up cross-component communication channels
    this.setupEventChannels();
    
    // Initialize API routing for Make/Zapier integration
    this.setupAPIRouting();
    
    // Check component connectivity
    this.checkComponentStatus();
    
    console.log('✅ BeyFlow Core ready');
  }

  /**
   * Register a component with the ecosystem
   */
  registerComponent(name, component, config = {}) {
    this.components.set(name, {
      instance: component,
      config: config,
      status: 'active',
      lastUpdate: Date.now()
    });
    
    // Give component access to the ecosystem
    if (component && typeof component === 'object') {
      component.beyflowCore = this;
      component.emit = (event, data) => this.emit(event, data);
      component.subscribe = (event, callback) => this.subscribe(event, callback);
      component.crossComponentCall = (target, method, data) => this.crossComponentCall(target, method, data);
    }
    
    console.log(`📦 Component registered: ${name}`);
    this.emit('component:registered', { name, config });
  }

  /**
   * Cross-component communication
   */
  emit(event, data) {
    if (this.eventBus.has(event)) {
      this.eventBus.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event handler error for ${event}:`, error);
        }
      });
    }
    
    // Log important events
    if (event.includes(':') || event.includes('automation:')) {
      console.log(`🔄 Event: ${event}`, data);
    }
  }

  subscribe(event, callback) {
    if (!this.eventBus.has(event)) {
      this.eventBus.set(event, []);
    }
    this.eventBus.get(event).push(callback);
  }

  /**
   * Direct component-to-component calls
   */
  crossComponentCall(targetComponent, method, data) {
    const component = this.components.get(targetComponent);
    if (component && component.instance && typeof component.instance[method] === 'function') {
      return component.instance[method](data);
    }
    console.warn(`Cross-component call failed: ${targetComponent}.${method}`);
    return null;
  }

  /**
   * Universal API router for external integrations (Make/Zapier)
   */
  setupAPIRouting() {
    // Chat automation triggers
    this.apiRoutes.set('chat/message', (data) => {
      this.emit('automation:chat_message', data);
      return this.routeToAutomation('chat_message', data);
    });
    
    // BeyTV media triggers  
    this.apiRoutes.set('beytv/download', (data) => {
      this.emit('automation:media_download', data);
      return this.routeToBeyTV('add_download', data);
    });
    
    // Stack Blog content triggers
    this.apiRoutes.set('blog/publish', (data) => {
      this.emit('automation:content_published', data);
      return this.routeToStackBlog('publish_content', data);
    });
    
    // Omnisphere AI triggers
    this.apiRoutes.set('ai/process', (data) => {
      this.emit('automation:ai_request', data);
      return this.routeToOmnisphere('process_request', data);
    });
    
    // Cross-component workflows
    this.apiRoutes.set('workflow/execute', (data) => {
      return this.executeWorkflow(data);
    });
  }

  /**
   * Setup event channels for organic integration
   */
  setupEventChannels() {
    // Chat → Other Components
    this.subscribe('chat:message_sent', (data) => {
      // Automatically log to Stack Blog if flagged
      if (data.logToBlog) {
        this.crossComponentCall('stackblog', 'createPost', {
          title: `Chat Log: ${new Date().toISOString()}`,
          content: data.message,
          category: 'chat-logs'
        });
      }
      
      // Process through Omnisphere AI if needed
      if (data.aiAnalysis) {
        this.crossComponentCall('omnisphere', 'analyzeMessage', data);
      }
    });
    
    // BeyTV → Chat notifications
    this.subscribe('beytv:download_complete', (data) => {
      this.crossComponentCall('chat', 'addSystemMessage', {
        message: `📺 Download complete: ${data.title}`,
        type: 'media_notification'
      });
    });
    
    // Stack Blog → Chat integration
    this.subscribe('blog:content_published', (data) => {
      this.crossComponentCall('chat', 'addSystemMessage', {
        message: `📝 New post published: ${data.title}`,
        type: 'content_notification',
        link: data.url
      });
    });
    
    // Omnisphere → All components
    this.subscribe('ai:response_ready', (data) => {
      // Send AI response to chat
      this.crossComponentCall('chat', 'addAIMessage', data);
      
      // If AI suggests content, route to blog
      if (data.suggestBlogPost) {
        this.crossComponentCall('stackblog', 'draftPost', data.suggestedContent);
      }
      
      // If AI suggests media, route to BeyTV
      if (data.suggestMedia) {
        this.crossComponentCall('beytv', 'searchAndQueue', data.mediaQuery);
      }
    });
  }

  /**
   * Component connectivity checking
   */
  async checkComponentStatus() {
    // Check BeyTV (Python server)
    try {
      const beytvResponse = await fetch('http://localhost:8000/api/qbt-status');
      this.status.beytv = beytvResponse.ok ? 'connected' : 'offline';
    } catch {
      this.status.beytv = 'offline';
    }
    
    // Check Stack Blog (Kirby)
    try {
      const blogResponse = await fetch('http://localhost:8888');
      this.status.stackblog = blogResponse.ok ? 'connected' : 'offline';  
    } catch {
      this.status.stackblog = 'offline';
    }
    
    // Check Omnisphere
    try {
      const aiResponse = await fetch('http://localhost:3001/health');
      this.status.omnisphere = aiResponse.ok ? 'connected' : 'offline';
    } catch {
      this.status.omnisphere = 'offline';
    }
    
    this.emit('status:updated', this.status);
    console.log('🔍 Component status:', this.status);
  }

  /**
   * Automation workflow execution
   */
  executeWorkflow(workflowData) {
    const { type, steps, data } = workflowData;
    
    console.log(`🔄 Executing workflow: ${type}`);
    
    const results = [];
    
    steps.forEach((step, index) => {
      try {
        const result = this.executeWorkflowStep(step, data, results);
        results.push(result);
        
        // Emit progress
        this.emit('workflow:step_complete', {
          workflow: type,
          step: index,
          result: result
        });
        
      } catch (error) {
        console.error(`Workflow step ${index} failed:`, error);
        results.push({ error: error.message });
      }
    });
    
    this.emit('workflow:complete', { type, results });
    return results;
  }

  executeWorkflowStep(step, data, previousResults) {
    const { component, action, params } = step;
    
    // Merge data with previous results if needed
    const stepData = { ...data, ...params, previousResults };
    
    return this.crossComponentCall(component, action, stepData);
  }

  /**
   * Route to specific components
   */
  routeToBeyTV(action, data) {
    // For BeyTV Python server
    if (this.status.beytv === 'connected') {
      return fetch(`http://localhost:8000/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    return Promise.reject('BeyTV not connected');
  }

  routeToStackBlog(action, data) {
    // For Kirby CMS integration
    if (this.status.stackblog === 'connected') {
      return fetch(`http://localhost:8888/api/${action}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    return Promise.reject('Stack Blog not connected');
  }

  routeToOmnisphere(action, data) {
    // For AI processing
    if (this.status.omnisphere === 'connected') {
      return fetch(`http://localhost:3001/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    return Promise.reject('Omnisphere not connected');
  }

  routeToAutomation(trigger, data) {
    // For Make/Zapier webhooks
    const webhookUrl = this.getWebhookUrl(trigger);
    if (webhookUrl) {
      return fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: trigger,
          timestamp: Date.now(),
          source: 'beyflow',
          data: data
        })
      });
    }
    console.log(`📤 Automation trigger: ${trigger}`, data);
    return Promise.resolve({ status: 'logged' });
  }

  getWebhookUrl(trigger) {
    // Environment variables for webhook URLs
    const webhooks = {
      'chat_message': process.env.VITE_WEBHOOK_CHAT,
      'media_download': process.env.VITE_WEBHOOK_MEDIA,
      'content_published': process.env.VITE_WEBHOOK_CONTENT,
      'ai_request': process.env.VITE_WEBHOOK_AI
    };
    
    return webhooks[trigger];
  }

  /**
   * Public API for external access
   */
  getPublicAPI() {
    return {
      // Component registration
      register: (name, component, config) => this.registerComponent(name, component, config),
      
      // Event system
      emit: (event, data) => this.emit(event, data),
      subscribe: (event, callback) => this.subscribe(event, callback),
      
      // Cross-component communication  
      call: (component, method, data) => this.crossComponentCall(component, method, data),
      
      // Status
      getStatus: () => ({ ...this.status }),
      
      // Automation
      executeWorkflow: (workflow) => this.executeWorkflow(workflow),
      
      // API routing for external integrations
      route: (endpoint, data) => {
        const handler = this.apiRoutes.get(endpoint);
        return handler ? handler(data) : Promise.reject(`Unknown endpoint: ${endpoint}`);
      }
    };
  }
}

// Create singleton instance
const beyflowCore = new BeyFlowCore();

// Global access
window.BeyFlow = beyflowCore.getPublicAPI();

export default beyflowCore;