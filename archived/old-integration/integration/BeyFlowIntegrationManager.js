/**
 * BeyFlow Integration Manager
 * Orchestrates organic integration of all components
 */

import BeyFlowCore from '../core/BeyFlowCore.js';
import BeyTVAdapter from '../adapters/BeyTVAdapter.js';
import StackBlogAdapter from '../adapters/StackBlogAdapter.js';
import OmnisphereAdapter from '../adapters/OmnisphereAdapter.js';

class BeyFlowIntegrationManager {
  constructor() {
    this.core = BeyFlowCore;
    this.adapters = {};
    this.isInitialized = false;
    this.automationRules = new Map();
    this.workflowEngine = null;
    
    this.initialize();
  }

  async initialize() {
    console.log('🔗 Initializing BeyFlow Integration...');
    
    try {
      // Initialize component adapters
      await this.initializeAdapters();
      
      // Set up automation rules
      this.setupAutomationRules();
      
      // Create workflow engine
      this.createWorkflowEngine();
      
      // Set up cross-component events
      this.setupCrossComponentEvents();
      
      this.isInitialized = true;
      console.log('✅ BeyFlow Integration ready');
      
      // Emit ready event
      this.core.emit('integration:ready', {
        components: Object.keys(this.adapters),
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('❌ Integration initialization failed:', error);
    }
  }

  async initializeAdapters() {
    console.log('📦 Initializing component adapters...');
    
    // Initialize BeyTV adapter
    this.adapters.beytv = new BeyTVAdapter();
    this.core.registerComponent('beytv', this.adapters.beytv, {
      type: 'media_automation',
      capabilities: ['search', 'download', 'rss_monitoring'],
      endpoints: ['http://localhost:8000']
    });
    
    // Initialize Stack Blog adapter
    this.adapters.stackblog = new StackBlogAdapter();
    this.core.registerComponent('stackblog', this.adapters.stackblog, {
      type: 'content_management',
      capabilities: ['create_post', 'publish', 'manage_drafts'],
      endpoints: ['http://localhost:8888']
    });
    
    // Initialize Omnisphere AI adapter
    this.adapters.omnisphere = new OmnisphereAdapter();
    this.core.registerComponent('omnisphere', this.adapters.omnisphere, {
      type: 'ai_assistance',
      capabilities: ['conversation', 'content_enhancement', 'workflow_generation'],
      endpoints: ['http://localhost:3001']
    });
    
    console.log('📦 Adapters initialized');
  }

  setupAutomationRules() {
    console.log('⚙️ Setting up automation rules...');
    
    // Chat → Blog automation
    this.automationRules.set('chat_to_blog', {
      trigger: 'chat:message_sent',
      condition: (data) => data.message.includes('#blog') || data.saveToBlog,
      action: async (data) => {
        return this.adapters.stackblog.createPost({
          title: `Chat Entry - ${new Date().toLocaleDateString()}`,
          content: data.message,
          category: 'chat-logs',
          tags: ['chat', 'auto-generated']
        });
      }
    });
    
    // AI → Media automation
    this.automationRules.set('ai_media_suggestion', {
      trigger: 'omnisphere:response_generated',
      condition: (data) => data.response.componentActions.some(a => a.component === 'beytv'),
      action: async (data) => {
        const mediaActions = data.response.componentActions.filter(a => a.component === 'beytv');
        const results = [];
        
        for (const action of mediaActions) {
          if (action.action === 'search_media') {
            const searchResults = await this.adapters.beytv.searchMedia(action.query);
            results.push({ action: action.action, results: searchResults });
          }
        }
        
        return results;
      }
    });
    
    // BeyTV → Blog automation
    this.automationRules.set('media_to_content', {
      trigger: 'beytv:download_complete',
      condition: (data) => data.title && data.title.length > 0,
      action: async (data) => {
        return this.adapters.stackblog.createPost({
          title: `Media Downloaded: ${data.title}`,
          content: `Successfully downloaded ${data.title}\n\nSize: ${Math.round(data.size / 1024 / 1024)}MB\nPath: ${data.path}`,
          category: 'downloads',
          tags: ['media', 'download', 'auto-generated']
        });
      }
    });
    
    // Blog → AI enhancement
    this.automationRules.set('enhance_blog_content', {
      trigger: 'stackblog:draft_created',
      condition: (data) => data.category !== 'chat-logs', // Don't enhance chat logs
      action: async (data) => {
        const enhanced = await this.adapters.omnisphere.enhanceContent(data.content, 'blog_post');
        if (enhanced !== data.content) {
          return this.adapters.stackblog.updatePost(data.id, { content: enhanced });
        }
        return null;
      }
    });
    
    console.log(`⚙️ ${this.automationRules.size} automation rules configured`);
  }

  createWorkflowEngine() {
    this.workflowEngine = {
      predefinedWorkflows: new Map(),
      customWorkflows: new Map(),
      
      // Predefined workflow templates
      register: (name, workflow) => {
        this.workflowEngine.predefinedWorkflows.set(name, workflow);
      },
      
      execute: async (workflowName, data) => {
        const workflow = this.workflowEngine.predefinedWorkflows.get(workflowName) ||
                        this.workflowEngine.customWorkflows.get(workflowName);
        
        if (!workflow) {
          throw new Error(`Workflow not found: ${workflowName}`);
        }
        
        return this.executeWorkflow(workflow, data);
      }
    };
    
    // Register predefined workflows
    this.registerPredefinedWorkflows();
    
    console.log('🔧 Workflow engine created');
  }

  registerPredefinedWorkflows() {
    // Content Creation Workflow
    this.workflowEngine.register('content_creation', {
      name: 'Content Creation Pipeline',
      description: 'AI-assisted content creation and publishing',
      steps: [
        { component: 'omnisphere', action: 'generateContent', params: {} },
        { component: 'stackblog', action: 'createPost', params: {} },
        { component: 'omnisphere', action: 'enhanceContent', params: {} },
        { component: 'stackblog', action: 'publishDraft', params: {} }
      ]
    });
    
    // Media Discovery Workflow
    this.workflowEngine.register('media_discovery', {
      name: 'Smart Media Discovery',
      description: 'Search, download, and catalog media content',
      steps: [
        { component: 'beytv', action: 'searchMedia', params: {} },
        { component: 'omnisphere', action: 'analyzeResults', params: {} },
        { component: 'beytv', action: 'addDownload', params: {} },
        { component: 'stackblog', action: 'createPost', params: { category: 'media' } }
      ]
    });
    
    // Cross-Platform Publishing
    this.workflowEngine.register('cross_platform_publish', {
      name: 'Cross-Platform Content Publishing',
      description: 'Publish content across multiple platforms',
      steps: [
        { component: 'stackblog', action: 'createPost', params: {} },
        { component: 'omnisphere', action: 'adaptForPlatforms', params: {} },
        { component: 'automation', action: 'triggerWebhooks', params: {} }
      ]
    });
    
    // Daily Automation
    this.workflowEngine.register('daily_automation', {
      name: 'Daily BeyFlow Automation',
      description: 'Daily RSS check, content curation, and reporting',
      steps: [
        { component: 'beytv', action: 'refreshFeeds', params: {} },
        { component: 'omnisphere', action: 'curateContent', params: {} },
        { component: 'stackblog', action: 'createDailyDigest', params: {} }
      ]
    });
  }

  setupCrossComponentEvents() {
    console.log('🔄 Setting up cross-component events...');
    
    // Process automation rules on events
    this.core.subscribe('*', (eventName, data) => {
      this.processAutomationRules(eventName, data);
    });
    
    // Chat message processing
    this.core.subscribe('chat:message_sent', async (data) => {
      // Route to AI for processing
      if (this.adapters.omnisphere && data.aiEnabled !== false) {
        const aiResponse = await this.adapters.omnisphere.handleChatMessage(data.message, data.user, {
          timestamp: data.timestamp,
          chatContext: data.context
        });
        
        if (aiResponse) {
          this.core.emit('ai:response_ready', {
            originalMessage: data,
            aiResponse: aiResponse
          });
        }
      }
      
      // Check for component-specific commands
      this.processComponentCommands(data);
    });
    
    // AI response processing
    this.core.subscribe('ai:response_ready', (data) => {
      const { aiResponse } = data;
      
      // Execute suggested component actions
      if (aiResponse.componentActions && aiResponse.componentActions.length > 0) {
        this.executeSuggestedActions(aiResponse.componentActions);
      }
      
      // Process workflow suggestions
      if (aiResponse.workflowSuggestions && aiResponse.workflowSuggestions.length > 0) {
        this.processSuggestedWorkflows(aiResponse.workflowSuggestions);
      }
    });
    
    // Component status monitoring
    this.core.subscribe('component:status_changed', (data) => {
      console.log(`📊 Component status: ${data.component} → ${data.status}`);
      
      // Update integration status
      this.updateIntegrationStatus();
    });
    
    console.log('🔄 Cross-component events configured');
  }

  async processAutomationRules(eventName, data) {
    for (const [ruleName, rule] of this.automationRules) {
      if (rule.trigger === eventName && rule.condition(data)) {
        try {
          console.log(`🤖 Executing automation rule: ${ruleName}`);
          const result = await rule.action(data);
          
          this.core.emit('automation:rule_executed', {
            rule: ruleName,
            trigger: eventName,
            result: result
          });
          
        } catch (error) {
          console.error(`❌ Automation rule failed: ${ruleName}`, error);
        }
      }
    }
  }

  processComponentCommands(data) {
    const message = data.message.toLowerCase();
    
    // BeyTV commands
    if (message.includes('download') || message.includes('search media')) {
      this.adapters.beytv?.handleChatCommand(data.message);
    }
    
    // Blog commands
    if (message.includes('blog') || message.includes('post') || message.includes('write')) {
      this.adapters.stackblog?.handleChatCommand(data.message);
    }
    
    // Status commands
    if (message.includes('status') || message.includes('check')) {
      this.handleStatusCommand(data);
    }
    
    // Workflow commands
    if (message.includes('workflow') || message.includes('automate')) {
      this.handleWorkflowCommand(data);
    }
  }

  async executeSuggestedActions(actions) {
    for (const action of actions) {
      const adapter = this.adapters[action.component];
      if (adapter && typeof adapter[action.action] === 'function') {
        try {
          console.log(`🎯 Executing suggested action: ${action.component}.${action.action}`);
          const result = await adapter[action.action](action.query || action.params);
          
          this.core.emit('automation:action_executed', {
            component: action.component,
            action: action.action,
            result: result
          });
          
        } catch (error) {
          console.error(`❌ Suggested action failed: ${action.component}.${action.action}`, error);
        }
      }
    }
  }

  async processSuggestedWorkflows(workflows) {
    for (const workflow of workflows) {
      console.log(`💡 Workflow suggested: ${workflow.type}`);
      
      this.core.emit('workflow:suggested', {
        type: workflow.type,
        description: workflow.description,
        steps: workflow.steps
      });
      
      // Auto-execute simple workflows
      if (workflow.steps && workflow.steps.length <= 3) {
        try {
          await this.executeWorkflow(workflow, {});
        } catch (error) {
          console.error('❌ Auto-workflow execution failed:', error);
        }
      }
    }
  }

  async executeWorkflow(workflow, data) {
    console.log(`🔄 Executing workflow: ${workflow.name || workflow.type}`);
    
    const results = [];
    
    for (const [index, step] of workflow.steps.entries()) {
      try {
        const adapter = this.adapters[step.component];
        
        if (adapter && typeof adapter[step.action] === 'function') {
          const stepData = { ...data, ...step.params, previousResults: results };
          const result = await adapter[step.action](stepData);
          
          results.push({
            step: index,
            component: step.component,
            action: step.action,
            result: result
          });
          
          this.core.emit('workflow:step_complete', {
            workflow: workflow.name || workflow.type,
            step: index,
            result: result
          });
          
        } else {
          throw new Error(`Invalid step: ${step.component}.${step.action}`);
        }
        
      } catch (error) {
        console.error(`❌ Workflow step ${index} failed:`, error);
        results.push({
          step: index,
          error: error.message
        });
        break;
      }
    }
    
    this.core.emit('workflow:complete', {
      workflow: workflow.name || workflow.type,
      results: results
    });
    
    return results;
  }

  handleStatusCommand(data) {
    const status = this.getIntegrationStatus();
    
    this.core.emit('chat:system_message', {
      message: this.formatStatusMessage(status),
      type: 'status_report'
    });
  }

  handleWorkflowCommand(data) {
    const message = data.message.toLowerCase();
    
    if (message.includes('list')) {
      const workflows = Array.from(this.workflowEngine.predefinedWorkflows.keys());
      this.core.emit('chat:system_message', {
        message: `Available workflows:\n${workflows.map(w => `• ${w}`).join('\n')}`,
        type: 'workflow_list'
      });
    }
  }

  getIntegrationStatus() {
    return {
      core: this.isInitialized,
      components: Object.fromEntries(
        Object.entries(this.adapters).map(([name, adapter]) => [
          name,
          adapter.getStatus ? adapter.getStatus() : { connected: false }
        ])
      ),
      automationRules: this.automationRules.size,
      workflows: this.workflowEngine.predefinedWorkflows.size
    };
  }

  formatStatusMessage(status) {
    const components = Object.entries(status.components)
      .map(([name, comp]) => `${name}: ${comp.connected ? '🟢' : '🔴'}`)
      .join('\n');
    
    return `🔗 BeyFlow Integration Status\n\n${components}\n\nAutomation Rules: ${status.automationRules}\nWorkflows: ${status.workflows}`;
  }

  updateIntegrationStatus() {
    const status = this.getIntegrationStatus();
    this.core.emit('integration:status_updated', status);
  }

  // Public API methods
  async executeCustomWorkflow(workflowName, data) {
    return this.workflowEngine.execute(workflowName, data);
  }

  addAutomationRule(name, rule) {
    this.automationRules.set(name, rule);
    console.log(`⚙️ Added automation rule: ${name}`);
  }

  removeAutomationRule(name) {
    this.automationRules.delete(name);
    console.log(`🗑️ Removed automation rule: ${name}`);
  }

  getComponent(name) {
    return this.adapters[name];
  }

  getAllComponents() {
    return { ...this.adapters };
  }

  // Make/Zapier webhook integration
  async processWebhook(webhookData) {
    const { trigger, data, source } = webhookData;
    
    console.log(`🔗 Processing webhook: ${trigger} from ${source}`);
    
    // Route webhook to appropriate component
    switch (trigger) {
      case 'media_request':
        return this.adapters.beytv?.searchAndSuggest(data.query);
      case 'content_publish':
        return this.adapters.stackblog?.createPost(data);
      case 'ai_process':
        return this.adapters.omnisphere?.processMessage(data.message);
      case 'workflow_execute':
        return this.executeCustomWorkflow(data.workflow, data.params);
      default:
        console.warn(`🤷 Unknown webhook trigger: ${trigger}`);
        return null;
    }
  }
}

// Create singleton instance
const integrationManager = new BeyFlowIntegrationManager();

// Global access
window.BeyFlowIntegration = integrationManager;

export default integrationManager;