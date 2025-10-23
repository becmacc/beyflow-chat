/**
 * Omnisphere AI Integration Adapter
 * Connects AI assistance component to BeyFlow ecosystem
 */

class OmnisphereAdapter {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.isConnected = false;
    this.conversations = new Map();
    this.context = new Map();
    this.aiCapabilities = [];
    
    this.checkConnection();
    this.initializeContext();
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      this.isConnected = response.ok;
      
      if (this.isConnected) {
        this.emit('omnisphere:connected', { baseUrl: this.baseUrl });
        console.log('🤖 Omnisphere AI connected');
        await this.loadCapabilities();
      }
    } catch (error) {
      this.isConnected = false;
      console.log('🤖 Omnisphere offline - AI assistance unavailable');
    }
  }

  initializeContext() {
    // Initialize cross-component context
    this.context.set('beyflow', {
      components: ['chat', 'beytv', 'stackblog'],
      capabilities: [
        'media_automation',
        'content_creation', 
        'workflow_orchestration',
        'cross_component_communication'
      ],
      integrations: ['make', 'zapier', 'webhooks']
    });
  }

  async loadCapabilities() {
    // Load AI model capabilities
    this.aiCapabilities = [
      'text_generation',
      'conversation',
      'content_enhancement',
      'workflow_suggestion',
      'media_recommendation',
      'automation_scripting',
      'cross_component_analysis'
    ];
    
    this.emit('omnisphere:capabilities_loaded', this.aiCapabilities);
  }

  // Core AI processing methods
  async processMessage(message, conversationId = 'default', context = {}) {
    if (!this.isConnected) {
      return this.getOfflineResponse(message);
    }

    try {
      // Add BeyFlow context to AI request
      const enhancedContext = {
        ...context,
        beyflow: this.context.get('beyflow'),
        conversation: this.conversations.get(conversationId) || [],
        timestamp: Date.now()
      };

      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationId,
          context: enhancedContext
        })
      });

      const result = await response.json();
      
      // Update conversation history
      this.updateConversation(conversationId, message, result.response);
      
      // Process AI suggestions
      const processed = this.processAIResponse(result);
      
      this.emit('omnisphere:response_generated', {
        conversationId,
        message,
        response: processed,
        suggestions: result.suggestions
      });

      return processed;

    } catch (error) {
      console.error('AI processing failed:', error);
      return this.getErrorResponse(message, error);
    }
  }

  processAIResponse(aiResult) {
    const { response, suggestions = [], actions = [] } = aiResult;
    
    // Analyze response for cross-component actions
    const componentActions = this.extractComponentActions(response);
    const workflowSuggestions = this.extractWorkflowSuggestions(response);
    
    return {
      message: response,
      componentActions,
      workflowSuggestions,
      suggestions,
      actions,
      timestamp: Date.now()
    };
  }

  extractComponentActions(response) {
    const actions = [];
    const text = response.toLowerCase();
    
    // BeyTV media actions
    if (text.includes('download') || text.includes('torrent') || text.includes('media')) {
      const mediaMatch = text.match(/(?:download|find|get)\s+([^.!?]+)/);
      if (mediaMatch) {
        actions.push({
          component: 'beytv',
          action: 'search_media',
          query: mediaMatch[1].trim(),
          confidence: 0.8
        });
      }
    }
    
    // Stack Blog content actions
    if (text.includes('blog') || text.includes('post') || text.includes('write')) {
      const contentMatch = text.match(/(?:write|create|post)\s+(?:about\s+)?([^.!?]+)/);
      if (contentMatch) {
        actions.push({
          component: 'stackblog',
          action: 'create_post',
          title: contentMatch[1].trim(),
          confidence: 0.7
        });
      }
    }
    
    // Workflow automation
    if (text.includes('automate') || text.includes('workflow') || text.includes('trigger')) {
      actions.push({
        component: 'workflow',
        action: 'suggest_automation',
        context: text,
        confidence: 0.6
      });
    }
    
    return actions;
  }

  extractWorkflowSuggestions(response) {
    const suggestions = [];
    const text = response.toLowerCase();
    
    // Multi-component workflows
    if (text.includes('download') && text.includes('blog')) {
      suggestions.push({
        type: 'media_to_content',
        description: 'Download media and create blog post about it',
        steps: [
          { component: 'beytv', action: 'search_and_download' },
          { component: 'stackblog', action: 'create_review_post' }
        ]
      });
    }
    
    if (text.includes('rss') && text.includes('automatic')) {
      suggestions.push({
        type: 'rss_automation',
        description: 'Set up automatic RSS monitoring and downloads',
        steps: [
          { component: 'beytv', action: 'monitor_rss' },
          { component: 'chat', action: 'notify_new_content' }
        ]
      });
    }
    
    return suggestions;
  }

  // Conversation management
  updateConversation(conversationId, userMessage, aiResponse) {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }
    
    const conversation = this.conversations.get(conversationId);
    conversation.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: Date.now()
    });
    
    // Keep conversation history limited
    if (conversation.length > 50) {
      conversation.splice(0, conversation.length - 50);
    }
  }

  // Cross-component analysis
  async analyzeComponentData(componentName, data) {
    if (!this.isConnected) return null;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component: componentName,
          data,
          context: this.context.get('beyflow')
        })
      });
      
      const analysis = await response.json();
      
      this.emit('omnisphere:analysis_complete', {
        component: componentName,
        analysis
      });
      
      return analysis;
      
    } catch (error) {
      console.error('Component analysis failed:', error);
      return null;
    }
  }

  // Content enhancement
  async enhanceContent(content, type = 'general') {
    if (!this.isConnected) return content;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          type,
          context: this.context.get('beyflow')
        })
      });
      
      const enhanced = await response.json();
      
      this.emit('omnisphere:content_enhanced', {
        original: content,
        enhanced: enhanced.content,
        improvements: enhanced.improvements
      });
      
      return enhanced.content;
      
    } catch (error) {
      console.error('Content enhancement failed:', error);
      return content;
    }
  }

  // Workflow generation
  async generateWorkflow(description, components = []) {
    if (!this.isConnected) return null;
    
    try {
      const response = await fetch(`${this.baseUrl}/api/workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          availableComponents: components,
          context: this.context.get('beyflow')
        })
      });
      
      const workflow = await response.json();
      
      this.emit('omnisphere:workflow_generated', workflow);
      
      return workflow;
      
    } catch (error) {
      console.error('Workflow generation failed:', error);
      return null;
    }
  }

  // Chat integration methods
  handleChatMessage(message, user = 'user', context = {}) {
    // Extract intent and route to appropriate processing
    const intent = this.extractIntent(message);
    
    switch (intent.type) {
      case 'question':
        return this.processMessage(message, user, context);
      case 'command':
        return this.processCommand(message, context);
      case 'workflow':
        return this.processWorkflowRequest(message, context);
      default:
        return this.processMessage(message, user, context);
    }
  }

  extractIntent(message) {
    const text = message.toLowerCase();
    
    if (text.startsWith('/') || text.includes('command')) {
      return { type: 'command', confidence: 0.9 };
    }
    
    if (text.includes('automate') || text.includes('workflow') || text.includes('trigger')) {
      return { type: 'workflow', confidence: 0.8 };
    }
    
    if (text.includes('?') || text.startsWith('what') || text.startsWith('how')) {
      return { type: 'question', confidence: 0.7 };
    }
    
    return { type: 'general', confidence: 0.5 };
  }

  async processCommand(message, context) {
    // Extract command and parameters
    const commandMatch = message.match(/\/(\w+)(?:\s+(.+))?/);
    if (!commandMatch) return null;
    
    const [, command, params] = commandMatch;
    
    switch (command) {
      case 'analyze':
        return this.analyzeComponentData(params, context);
      case 'enhance':
        return this.enhanceContent(params);
      case 'workflow':
        return this.generateWorkflow(params);
      default:
        return { error: `Unknown command: ${command}` };
    }
  }

  async processWorkflowRequest(message, context) {
    const workflow = await this.generateWorkflow(message, ['chat', 'beytv', 'stackblog']);
    
    if (workflow) {
      this.emit('omnisphere:workflow_suggested', {
        request: message,
        workflow,
        context
      });
    }
    
    return workflow;
  }

  // Offline fallbacks
  getOfflineResponse(message) {
    return {
      message: "🤖 AI assistance offline. Processing locally...",
      componentActions: this.getLocalActions(message),
      workflowSuggestions: [],
      suggestions: [],
      actions: [],
      offline: true
    };
  }

  getLocalActions(message) {
    const actions = [];
    const text = message.toLowerCase();
    
    // Simple pattern matching for offline mode
    if (text.includes('download')) {
      actions.push({
        component: 'beytv',
        action: 'search_media',
        query: text.replace(/download|get|find/g, '').trim(),
        confidence: 0.5
      });
    }
    
    if (text.includes('blog') || text.includes('post')) {
      actions.push({
        component: 'stackblog',
        action: 'create_post',
        title: text,
        confidence: 0.5
      });
    }
    
    return actions;
  }

  getErrorResponse(message, error) {
    return {
      message: `🤖 AI processing error: ${error.message}`,
      componentActions: [],
      workflowSuggestions: [],
      suggestions: [],
      actions: [],
      error: true
    };
  }

  // Context management
  updateContext(key, data) {
    this.context.set(key, data);
    this.emit('omnisphere:context_updated', { key, data });
  }

  getContext(key) {
    return this.context.get(key);
  }

  // Status and utilities
  getStatus() {
    return {
      connected: this.isConnected,
      baseUrl: this.baseUrl,
      conversations: this.conversations.size,
      capabilities: this.aiCapabilities.length,
      contextItems: this.context.size
    };
  }

  getConversationHistory(conversationId = 'default') {
    return this.conversations.get(conversationId) || [];
  }

  clearConversation(conversationId = 'default') {
    this.conversations.delete(conversationId);
    this.emit('omnisphere:conversation_cleared', { conversationId });
  }
}

export default OmnisphereAdapter;