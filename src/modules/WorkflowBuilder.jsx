import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import GlassmorphicCard from '../components/GlassmorphicCard'
import { WorkflowExecutor } from './workflowExecution'

// Available workflow nodes
const nodeTypes = {
  trigger: {
    chatgpt: { name: 'ChatGPT', icon: '🤖', color: 'from-green-500 to-emerald-600', description: 'OpenAI ChatGPT' },
    webhook: { name: 'Webhook', icon: '🔗', color: 'from-blue-500 to-cyan-600', description: 'HTTP Webhook' },
    schedule: { name: 'Schedule', icon: '⏰', color: 'from-purple-500 to-pink-600', description: 'Cron/Timer' },
    message: { name: 'Chat Message', icon: '💬', color: 'from-cyan-500 to-blue-600', description: 'User Message' },
  },
  action: {
    make: { name: 'Make.com', icon: '⚡', color: 'from-orange-500 to-red-600', description: 'Make Scenario' },
    openai: { name: 'OpenAI', icon: '✨', color: 'from-violet-500 to-purple-600', description: 'GPT-4/GPT-5' },
    gmail: { name: 'Gmail', icon: '📧', color: 'from-red-500 to-pink-600', description: 'Send Email' },
    notion: { name: 'Notion', icon: '📝', color: 'from-gray-700 to-gray-900', description: 'Update Database' },
    sheets: { name: 'Google Sheets', icon: '📊', color: 'from-green-600 to-teal-600', description: 'Log Data' },
    discord: { name: 'Discord', icon: '💬', color: 'from-indigo-500 to-blue-700', description: 'Send Message' },
    twilio: { name: 'Twilio', icon: '📱', color: 'from-blue-600 to-cyan-700', description: 'Send SMS' },
  },
  logic: {
    condition: { name: 'Condition', icon: '🔀', color: 'from-yellow-500 to-orange-600', description: 'If/Then/Else' },
    delay: { name: 'Delay', icon: '⏸️', color: 'from-gray-500 to-gray-700', description: 'Wait Time' },
    filter: { name: 'Filter', icon: '🔍', color: 'from-teal-500 to-cyan-600', description: 'Filter Data' },
    transform: { name: 'Transform', icon: '🔄', color: 'from-pink-500 to-rose-600', description: 'Format Data' },
  }
}

function WorkflowNode({ node, onEdit, onDelete, onConnect, isSelected, onClick, isExecuting }) {
  const nodeConfig = nodeTypes[node.category]?.[node.type]
  
  return (
    <motion.div
      layout
      onClick={() => onClick(node.id)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        ...(isExecuting && {
          boxShadow: [
            '0 0 0px rgba(0,255,255,0)',
            '0 0 20px rgba(0,255,255,0.8)',
            '0 0 0px rgba(0,255,255,0)'
          ]
        })
      }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ 
        boxShadow: { duration: 1, repeat: Infinity }
      }}
      className={`absolute cursor-pointer ${isSelected ? 'z-20' : 'z-10'}`}
      style={{ left: node.x, top: node.y }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        node.x += info.offset.x
        node.y += info.offset.y
      }}
    >
      <GlassmorphicCard 
        className={`w-48 p-4 ${
          isExecuting ? 'ring-2 ring-cyan-400 border-cyan-400' :
          isSelected ? 'ring-2 ring-cyan-500/40' : ''
        }`} 
        hover={!isSelected && !isExecuting}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`text-3xl bg-gradient-to-r ${nodeConfig?.color || 'from-gray-500 to-gray-700'} bg-clip-text`}>
            {nodeConfig?.icon || '⚙️'}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(node.id)
            }}
            className="text-red-400 hover:text-red-300 text-xs"
          >
            ✕
          </button>
        </div>
        
        <h4 className="neon-text text-sm font-bold mb-1">{nodeConfig?.name || node.type}</h4>
        <p className="text-xs text-gray-400 mb-3">{nodeConfig?.description}</p>
        
        {/* Connection Points */}
        <div className="flex justify-between items-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConnect(node.id, 'input')
            }}
            className="w-3 h-3 rounded-full bg-neon-cyan shadow-neon-cyan hover:scale-150 transition-transform"
            title="Input"
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onConnect(node.id, 'output')
            }}
            className="w-3 h-3 rounded-full bg-neon-magenta shadow-neon-magenta hover:scale-150 transition-transform"
            title="Output"
          />
        </div>
      </GlassmorphicCard>
    </motion.div>
  )
}

function ConnectionLine({ from, to, nodes }) {
  const fromNode = nodes.find(n => n.id === from)
  const toNode = nodes.find(n => n.id === to)
  
  if (!fromNode || !toNode) return null
  
  const x1 = fromNode.x + 192 // node width
  const y1 = fromNode.y + 80 // approximate center
  const x2 = toNode.x
  const y2 = toNode.y + 80
  
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="100%" stopColor="#FF00FF" />
        </linearGradient>
      </defs>
      <motion.path
        d={`M ${x1} ${y1} C ${x1 + 100} ${y1}, ${x2 - 100} ${y2}, ${x2} ${y2}`}
        stroke="url(#lineGradient)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
        filter="drop-shadow(0 0 5px rgba(0,240,255,0.5))"
      />
    </svg>
  )
}

export default function WorkflowBuilder() {
  const { webhook } = useStore()
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [showPalette, setShowPalette] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [executionLog, setExecutionLog] = useState([])
  const [executionResult, setExecutionResult] = useState(null)

  const addNode = useCallback((category, type) => {
    const newNode = {
      id: `node_${Date.now()}`,
      category,
      type,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100,
      config: {}
    }
    setNodes(prev => [...prev, newNode])
    setShowPalette(false)
  }, [])

  const deleteNode = useCallback((id) => {
    setNodes(prev => prev.filter(n => n.id !== id))
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id))
    if (selectedNode === id) setSelectedNode(null)
  }, [selectedNode])

  const handleConnect = useCallback((nodeId, type) => {
    if (type === 'output') {
      setConnectingFrom(nodeId)
    } else if (type === 'input' && connectingFrom) {
      setConnections(prev => [...prev, { from: connectingFrom, to: nodeId }])
      setConnectingFrom(null)
    }
  }, [connectingFrom])

  const executeWorkflow = useCallback(async () => {
    if (nodes.length === 0) return

    setExecuting(true)
    setExecutionLog([])
    setExecutionResult(null)

    const executor = new WorkflowExecutor(nodes, connections, webhook)
    
    executor.setProgressCallback((progress) => {
      setExecutionLog(prev => [...prev, progress])
    })

    try {
      const result = await executor.execute({ 
        message: 'Workflow started',
        initiatedBy: 'user'
      })
      
      setExecutionResult(result)
      console.log('✅ Workflow completed:', result)
      
    } catch (error) {
      console.error('❌ Workflow failed:', error)
      setExecutionLog(prev => [...prev, { 
        status: 'error', 
        message: `Execution failed: ${error.message}` 
      }])
    } finally {
      setExecuting(false)
    }
  }, [nodes, connections, webhook])

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Toolbar */}
      <div className="h-12 bg-black border-b border-cyan-500/5 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-mono text-cyan-700/50">workflow_builder</h2>
          <div className="text-xs text-cyan-900/30 font-mono">
            [{nodes.length}] nodes / [{connections.length}] conn
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="bg-black border border-cyan-500/30 px-4 py-2 text-cyan-500 hover:border-cyan-500 transition-colors font-mono text-xs"
          >
            [+] NODE
          </button>
          
          <button
            onClick={executeWorkflow}
            disabled={nodes.length === 0 || executing}
            className={`bg-black border px-6 py-2 font-mono text-xs disabled:opacity-20 disabled:cursor-not-allowed transition-all ${
              executing 
                ? 'border-cyan-400 text-cyan-400 animate-pulse' 
                : 'border-cyan-500 text-cyan-400 hover:bg-cyan-500/10'
            }`}
          >
            {executing ? '[RUNNING...]' : '[EXECUTE]'}
          </button>
          
          {executionLog.length > 0 && (
            <button
              onClick={() => setExecutionLog([])}
              className="bg-black border border-gray-700 px-4 py-2 font-mono text-xs text-gray-500 hover:text-gray-400 transition-colors"
            >
              [CLEAR_LOG]
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-black"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        {/* Connection Lines */}
        {connections.map((conn, i) => (
          <ConnectionLine key={i} from={conn.from} to={conn.to} nodes={nodes} />
        ))}
        
        {/* Nodes */}
        <AnimatePresence>
          {nodes.map(node => {
            const currentlyExecuting = executionLog.some(
              log => log.nodeId === node.id && log.status === 'running'
            )
            
            return (
              <WorkflowNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                isExecuting={currentlyExecuting}
                onClick={setSelectedNode}
                onEdit={(id) => console.log('Edit', id)}
                onDelete={deleteNode}
                onConnect={handleConnect}
              />
            )
          })}
        </AnimatePresence>

        {/* Empty State */}
        {nodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🔗</div>
              <h3 className="text-2xl font-mono font-bold text-cyan-400 mb-2">
                INITIALIZE_WORKFLOW
              </h3>
              <p className="text-gray-600 mb-6 font-mono text-sm">
                {'>'} Connect APIs + LLMs + Agents
              </p>
              <button
                onClick={() => setShowPalette(true)}
                className="bg-black border border-cyan-500/30 px-6 py-3 text-cyan-500 hover:border-cyan-500 transition-colors font-mono text-xs"
              >
                [+] ADD_NODE
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Execution Log Panel */}
      {executionLog.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-4 left-4 right-4 max-w-2xl mx-auto z-40"
        >
          <GlassmorphicCard className="p-4 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono text-cyan-400 font-bold">EXECUTION_LOG</h3>
              <button 
                onClick={() => setExecutionLog([])}
                className="text-gray-600 hover:text-cyan-500 text-xs font-mono"
              >
                [X]
              </button>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {executionLog.map((log, i) => (
                <div 
                  key={i}
                  className={`flex items-start space-x-2 ${
                    log.status === 'error' ? 'text-red-400' :
                    log.status === 'success' ? 'text-green-400' :
                    log.status === 'running' ? 'text-cyan-400' :
                    'text-gray-400'
                  }`}
                >
                  <span className="opacity-50">{i + 1}.</span>
                  <span className="flex-1">{log.message || JSON.stringify(log)}</span>
                </div>
              ))}
            </div>
            {executionResult && (
              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                <div className="text-xs text-green-400 font-mono">
                  ✓ SUCCESS - {Object.keys(executionResult.nodeResults || {}).length} nodes executed
                </div>
              </div>
            )}
          </GlassmorphicCard>
        </motion.div>
      )}

      {/* Node Palette */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-12 bottom-0 w-96 bg-black border-l border-cyan-500/10 overflow-y-auto z-30"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-mono font-bold text-cyan-400">NODE_PALETTE</h3>
                <button
                  onClick={() => setShowPalette(false)}
                  className="text-gray-600 hover:text-cyan-500 font-mono text-xs"
                >
                  [X]
                </button>
              </div>

              {/* Triggers */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold text-cyan-600 mb-3">// TRIGGERS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(nodeTypes.trigger).map(([type, config]) => (
                    <motion.button
                      key={type}
                      onClick={() => addNode('trigger', type)}
                      className="bg-black border border-gray-800 p-3 text-left hover:border-neon-cyan/40 hover:bg-black hover:shadow-[0_0_6px_rgba(0,240,255,0.2)] transition-all"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-2xl mb-1">{config.icon}</div>
                      <div className="text-xs font-bold text-white">{config.name}</div>
                      <div className="text-xs text-gray-400">{config.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-bold text-cyan-600 mb-3">// ACTIONS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(nodeTypes.action).map(([type, config]) => (
                    <motion.button
                      key={type}
                      onClick={() => addNode('action', type)}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-left hover:bg-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-1">{config.icon}</div>
                      <div className="text-xs font-bold text-white">{config.name}</div>
                      <div className="text-xs text-gray-400">{config.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Logic */}
              <div>
                <h4 className="text-xs font-mono font-bold text-cyan-600 mb-3">// LOGIC</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(nodeTypes.logic).map(([type, config]) => (
                    <motion.button
                      key={type}
                      onClick={() => addNode('logic', type)}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-lg text-left hover:bg-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl mb-1">{config.icon}</div>
                      <div className="text-xs font-bold text-white">{config.name}</div>
                      <div className="text-xs text-gray-400">{config.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
