import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useBeyFlowStore } from '../core/UnifiedStore'
import { getTheme } from '../config/themes'

export default function OmnisphereModule() {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const spectrum = useBeyFlowStore(state => state.ui.spectrum)
  const [aiTasks, setAiTasks] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('tasks')
  const theme = getTheme(themePersona)

  // Get spectrum values
  const blur = spectrum?.blur ?? 0.3
  const glow = spectrum?.glow ?? 0.3

  useEffect(() => {
    // Check Omnisphere connection
    checkConnection()
    
    // Register with BeyFlow integration
    if (window.BeyFlowIntegration) {
      window.BeyFlowIntegration.registerModule('omnisphere', {
        processMessage: handleProcessMessage,
        createWorkflow: handleCreateWorkflow,
        getStatus: () => ({ connected: isConnected }),
        refresh: loadData
      })
    }

    // Listen for chat messages to process with AI
    if (window.BeyFlow) {
      window.BeyFlow.on('chat:message_sent', (data) => {
        if (data.flags?.aiProcessing) {
          handleProcessMessage(data.message)
        }
      })
    }
  }, [isConnected])

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/health')
      if (response.ok) {
        setIsConnected(true)
        loadData()
      } else {
        setIsConnected(false)
      }
    } catch (error) {
      setIsConnected(false)
    }
  }

  const loadData = async () => {
    if (!isConnected) return
    
    setLoading(true)
    try {
      const [tasksRes, workflowsRes] = await Promise.all([
        fetch('http://localhost:3001/api/tasks'),
        fetch('http://localhost:3001/api/workflows')
      ])
      
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setAiTasks(tasksData.tasks || [])
      }
      
      if (workflowsRes.ok) {
        const workflowsData = await workflowsRes.json()
        setWorkflows(workflowsData.workflows || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProcessMessage = async (message) => {
    if (!isConnected) return
    
    try {
      const response = await fetch('http://localhost:3001/api/process', {
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
        
        // Add to tasks list
        setAiTasks(prev => [result.task, ...prev])
        
        // Emit event for workflow automation
        if (window.BeyFlow) {
          window.BeyFlow.emit('omnisphere:task_created', result.task)
        }
        
        return result
      }
    } catch (error) {
      console.error('Failed to process message:', error)
    }
  }

  const handleCreateWorkflow = async (workflowData) => {
    if (!isConnected) return
    
    try {
      const response = await fetch('http://localhost:3001/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setWorkflows(prev => [result.workflow, ...prev])
        
        // Emit event
        if (window.BeyFlow) {
          window.BeyFlow.emit('omnisphere:workflow_created', result.workflow)
        }
        
        return result
      }
    } catch (error) {
      console.error('Failed to create workflow:', error)
    }
  }

  const handleExecuteWorkflow = async (workflowId) => {
    if (!isConnected) return
    
    try {
      const response = await fetch(`http://localhost:3001/api/workflows/${workflowId}/execute`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const result = await response.json()
        
        // Update workflow status
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId 
            ? { ...w, status: 'running', lastRun: new Date().toISOString() }
            : w
        ))
        
        // Emit event
        if (window.BeyFlow) {
          window.BeyFlow.emit('omnisphere:workflow_executed', { workflowId, result })
        }
      }
    } catch (error) {
      console.error('Failed to execute workflow:', error)
    }
  }

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <motion.div
          className="text-red-400 text-6xl mb-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌐
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Omnisphere Offline</h3>
        <p className="text-gray-400 mb-4">AI frontend not running on localhost:3001</p>
        <motion.button
          onClick={checkConnection}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Connection
        </motion.button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b ${theme.colors.border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌐</span>
            <div>
              <h2 className="text-xl font-bold text-white">Omnisphere</h2>
              <p className="text-green-400 text-sm font-mono">CONNECTED</p>
            </div>
          </div>
          <motion.button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? '⟳' : '↻'}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['tasks', 'workflows'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-black/30 text-gray-400 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <motion.div
              className="text-blue-400 text-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⟳
            </motion.div>
          </div>
        ) : activeTab === 'tasks' ? (
          <div className="space-y-3">
            {aiTasks.length > 0 ? (
              aiTasks.map((task, index) => (
                <motion.div
                  key={task.id || index}
                  className={`p-4 bg-black/30 border ${theme.colors.border} rounded-lg`}
                  style={{
                    backdropFilter: `blur(${8 + blur * 16}px)`,
                    boxShadow: glow > 0.5 ? `0 0 ${glow * 20}px rgba(0, 255, 255, ${glow * 0.2})` : 'none'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          task.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          task.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.status?.toUpperCase() || 'PENDING'}
                        </span>
                        <span className="text-xs text-gray-500">{task.type}</span>
                      </div>
                      <h4 className="font-bold text-white mb-2">{task.title || 'AI Task'}</h4>
                      <p className="text-gray-300 text-sm mb-2">{task.description || task.message}</p>
                      <div className="text-xs text-gray-500">
                        📅 {task.timestamp ? new Date(task.timestamp).toLocaleString() : 'Now'}
                      </div>
                    </div>
                  </div>
                  {task.result && (
                    <div className="mt-3 p-3 bg-black/50 rounded border-l-2 border-green-400">
                      <p className="text-green-300 text-sm">{task.result}</p>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <span className="text-4xl mb-4 block">🤖</span>
                <p>No AI tasks yet</p>
                <p className="text-sm mt-2">Send a chat message with AI processing enabled</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {workflows.length > 0 ? (
              workflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id || index}
                  className={`p-4 bg-black/30 border ${theme.colors.border} rounded-lg`}
                  style={{
                    backdropFilter: `blur(${8 + blur * 16}px)`,
                    boxShadow: glow > 0.5 ? `0 0 ${glow * 20}px rgba(0, 255, 255, ${glow * 0.2})` : 'none'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          workflow.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                          workflow.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {workflow.status?.toUpperCase() || 'IDLE'}
                        </span>
                        <span className="text-xs text-gray-500">{workflow.triggers?.length || 0} triggers</span>
                      </div>
                      <h4 className="font-bold text-white mb-2">{workflow.name}</h4>
                      <p className="text-gray-300 text-sm mb-2">{workflow.description}</p>
                      <div className="text-xs text-gray-500">
                        📅 Last run: {workflow.lastRun ? new Date(workflow.lastRun).toLocaleString() : 'Never'}
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleExecuteWorkflow(workflow.id)}
                      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Execute
                    </motion.button>
                  </div>
                  {workflow.steps && (
                    <div className="mt-3 space-y-1">
                      {workflow.steps.slice(0, 3).map((step, i) => (
                        <div key={i} className="text-xs text-gray-400 flex items-center gap-2">
                          <span>→</span>
                          <span>{step.name || step.action}</span>
                        </div>
                      ))}
                      {workflow.steps.length > 3 && (
                        <div className="text-xs text-gray-500">
                          ... and {workflow.steps.length - 3} more steps
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <span className="text-4xl mb-4 block">⚙️</span>
                <p>No workflows configured</p>
                <p className="text-sm mt-2">Create workflows to automate your tasks</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}