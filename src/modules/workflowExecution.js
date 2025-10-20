import OpenAI from 'openai'
import { omnigenAgents } from '../config/omnigenAgents'

const openai = new OpenAI({
  baseURL: import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export class WorkflowExecutor {
  constructor(nodes, connections, webhookUrl) {
    this.nodes = nodes
    this.connections = connections
    this.webhookUrl = webhookUrl
    this.results = new Map()
    this.onProgress = null
  }

  setProgressCallback(callback) {
    this.onProgress = callback
  }

  buildExecutionOrder() {
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]))
    const inDegree = new Map(this.nodes.map(n => [n.id, 0]))
    const graph = new Map(this.nodes.map(n => [n.id, []]))

    this.connections.forEach(({ from, to }) => {
      graph.get(from).push(to)
      inDegree.set(to, inDegree.get(to) + 1)
    })

    const queue = this.nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id)
    const order = []

    while (queue.length > 0) {
      const nodeId = queue.shift()
      order.push(nodeId)

      graph.get(nodeId).forEach(nextId => {
        inDegree.set(nextId, inDegree.get(nextId) - 1)
        if (inDegree.get(nextId) === 0) {
          queue.push(nextId)
        }
      })
    }

    return order.map(id => nodeMap.get(id))
  }

  async executeNode(node, inputData = {}) {
    this.onProgress?.({ nodeId: node.id, status: 'running', message: `Executing ${node.type}...` })

    try {
      let result = null

      switch (node.category) {
        case 'trigger':
          result = await this.executeTrigger(node, inputData)
          break
        case 'action':
          result = await this.executeAction(node, inputData)
          break
        case 'logic':
          result = await this.executeLogic(node, inputData)
          break
        default:
          throw new Error(`Unknown node category: ${node.category}`)
      }

      this.results.set(node.id, result)
      this.onProgress?.({ nodeId: node.id, status: 'success', result })
      return result

    } catch (error) {
      this.onProgress?.({ nodeId: node.id, status: 'error', error: error.message })
      throw error
    }
  }

  async executeTrigger(node, inputData) {
    switch (node.type) {
      case 'chatgpt':
      case 'message':
        return { 
          type: 'message', 
          content: inputData.message || 'Workflow triggered',
          timestamp: Date.now()
        }
      
      case 'webhook':
        return { 
          type: 'webhook', 
          payload: inputData,
          timestamp: Date.now()
        }
      
      case 'schedule':
        return { 
          type: 'schedule', 
          timestamp: Date.now()
        }
      
      default:
        return inputData
    }
  }

  async executeAction(node, inputData) {
    switch (node.type) {
      case 'openai':
        return await this.callOpenAI(inputData)
      
      case 'omnigen':
      case 'gptMarketer':
      case 'gptEngineer':
      case 'dalle':
        return await this.callOmnigenAgent(node.type, inputData)
      
      case 'make':
        return await this.callMakeWebhook(inputData)
      
      case 'gmail':
      case 'notion':
      case 'sheets':
      case 'discord':
      case 'twilio':
        return await this.callMakeWebhook({ 
          ...inputData, 
          action: node.type 
        })
      
      default:
        return { ...inputData, processed: true }
    }
  }

  async executeLogic(node, inputData) {
    switch (node.type) {
      case 'condition':
        return {
          ...inputData,
          conditionMet: true,
          branch: 'then'
        }
      
      case 'delay':
        await new Promise(resolve => setTimeout(resolve, node.config?.delayMs || 1000))
        return { ...inputData, delayed: true }
      
      case 'filter':
        return {
          ...inputData,
          filtered: true
        }
      
      case 'transform':
        return {
          ...inputData,
          transformed: true,
          transformedAt: Date.now()
        }
      
      default:
        return inputData
    }
  }

  async callOpenAI(inputData) {
    const prompt = inputData.content || inputData.message || 'Process this data'
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful automation assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500
    })

    return {
      type: 'openai',
      response: completion.choices[0].message.content,
      model: completion.model,
      usage: completion.usage
    }
  }

  async callOmnigenAgent(agentType, inputData) {
    const agent = omnigenAgents[agentType]
    const prompt = inputData.content || inputData.message || inputData.response || 'Process this task'
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: agent.systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800
    })

    const response = completion.choices[0].message.content

    // If DALL-E agent, check if it generated an image prompt
    if (agentType === 'dalle' && response) {
      return {
        type: 'agent',
        agent: agent.name,
        response,
        imagePrompt: response,
        usage: completion.usage
      }
    }

    return {
      type: 'agent',
      agent: agent.name,
      response,
      model: completion.model,
      usage: completion.usage
    }
  }

  async callMakeWebhook(inputData) {
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trigger: 'workflow',
        data: inputData,
        timestamp: Date.now()
      })
    })

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.statusText}`)
    }

    const result = await response.json()
    return {
      type: 'webhook',
      success: true,
      response: result
    }
  }

  async execute(initialData = {}) {
    this.onProgress?.({ status: 'started', message: 'Building execution order...' })
    
    const executionOrder = this.buildExecutionOrder()
    
    if (executionOrder.length === 0) {
      throw new Error('No nodes to execute')
    }

    this.onProgress?.({ 
      status: 'ordered', 
      message: `Executing ${executionOrder.length} nodes...`,
      nodeCount: executionOrder.length
    })

    let currentData = initialData

    for (const node of executionOrder) {
      const parents = this.connections
        .filter(c => c.to === node.id)
        .map(c => this.results.get(c.from))
        .filter(Boolean)

      const nodeInput = parents.length > 0 
        ? { ...currentData, ...parents[parents.length - 1] }
        : currentData

      currentData = await this.executeNode(node, nodeInput)
    }

    this.onProgress?.({ 
      status: 'completed', 
      message: 'Workflow completed successfully!',
      finalResult: currentData
    })

    return {
      success: true,
      finalResult: currentData,
      nodeResults: Object.fromEntries(this.results)
    }
  }
}
