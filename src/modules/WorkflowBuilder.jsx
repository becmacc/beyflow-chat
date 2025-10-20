import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'
import GlassmorphicCard from '../components/GlassmorphicCard'

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

function WorkflowNode({ node, onEdit, onDelete, onConnect, isSelected, onClick }) {
  const nodeConfig = nodeTypes[node.category]?.[node.type]
  
  return (
    <motion.div
      layout
      onClick={() => onClick(node.id)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`absolute cursor-pointer ${isSelected ? 'z-20' : 'z-10'}`}
      style={{ left: node.x, top: node.y }}
      drag
      dragMomentum={false}
      onDragEnd={(e, info) => {
        node.x += info.offset.x
        node.y += info.offset.y
      }}
    >
      <GlassmorphicCard className={`w-48 p-4 ${isSelected ? 'ring-2 ring-neon-cyan shadow-[0_0_30px_rgba(0,240,255,0.5)]' : ''}`} hover={!isSelected}>
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
  const [nodes, setNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectingFrom, setConnectingFrom] = useState(null)
  const [showPalette, setShowPalette] = useState(false)

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
    console.log('🚀 Executing workflow...', { nodes, connections })
    // TODO: Implement actual workflow execution
    alert('Workflow execution coming soon! Your nodes are ready to connect.')
  }, [nodes, connections])

  return (
    <div className="h-full flex flex-col bg-black/20 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-tech font-bold neon-text">Workflow Builder</h2>
          <div className="text-xs text-gray-400">
            {nodes.length} nodes • {connections.length} connections
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => setShowPalette(!showPalette)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg neon-text hover:bg-white/20 hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add Node
          </motion.button>
          
          <motion.button
            onClick={executeWorkflow}
            disabled={nodes.length === 0}
            className="relative overflow-hidden bg-gradient-to-r from-neon-cyan to-neon-magenta px-6 py-2 rounded-lg font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,240,255,0.5)]"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,240,255,0.8)' }}
            whileTap={{ scale: 0.95 }}
          >
            ▶️ Execute
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      >
        {/* Connection Lines */}
        {connections.map((conn, i) => (
          <ConnectionLine key={i} from={conn.from} to={conn.to} nodes={nodes} />
        ))}
        
        {/* Nodes */}
        <AnimatePresence>
          {nodes.map(node => (
            <WorkflowNode
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onClick={setSelectedNode}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={deleteNode}
              onConnect={handleConnect}
            />
          ))}
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
              <h3 className="text-2xl font-tech font-bold neon-text mb-2">
                Start Building Your Workflow
              </h3>
              <p className="text-gray-400 mb-6">
                Connect ChatGPT, Make.com, and other tools together
              </p>
              <motion.button
                onClick={() => setShowPalette(true)}
                className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-lg neon-text hover:bg-white/20 hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ➕ Add Your First Node
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Node Palette */}
      <AnimatePresence>
        {showPalette && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="absolute right-0 top-16 bottom-0 w-96 bg-black/60 backdrop-blur-2xl border-l border-white/20 overflow-y-auto z-30"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-tech font-bold neon-text">Add Node</h3>
                <button
                  onClick={() => setShowPalette(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Triggers */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-neon-green mb-3">⚡ TRIGGERS</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(nodeTypes.trigger).map(([type, config]) => (
                    <motion.button
                      key={type}
                      onClick={() => addNode('trigger', type)}
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

              {/* Actions */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-neon-cyan mb-3">🔧 ACTIONS</h4>
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
                <h4 className="text-sm font-bold text-neon-magenta mb-3">🧠 LOGIC</h4>
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
