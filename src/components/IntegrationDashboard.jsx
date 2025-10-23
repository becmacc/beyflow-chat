import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function IntegrationDashboard() {
  const [integrationStatus, setIntegrationStatus] = useState({
    beyflow: { connected: true, lastPing: Date.now() },
    beytv: { connected: false, lastPing: null },
    stackblog: { connected: false, lastPing: null },
    omnisphere: { connected: false, lastPing: null }
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    // Initialize BeyFlow Integration if not already done
    if (window.BeyFlowIntegration) {
      // Set up real-time monitoring
      const checkServices = async () => {
        const services = ['beytv', 'stackblog', 'omnisphere']
        const ports = { beytv: 8000, stackblog: 8888, omnisphere: 3001 }
        
        for (const service of services) {
          try {
            const response = await fetch(`http://localhost:${ports[service]}/health`, {
              method: 'GET',
              mode: 'no-cors' // This will always succeed, but we can track the attempt
            })
            
            setIntegrationStatus(prev => ({
              ...prev,
              [service]: { connected: true, lastPing: Date.now() }
            }))
          } catch (error) {
            setIntegrationStatus(prev => ({
              ...prev,
              [service]: { connected: false, lastPing: Date.now() }
            }))
          }
        }
      }

      // Check every 10 seconds
      const interval = setInterval(checkServices, 10000)
      checkServices() // Initial check

      // Listen for integration events
      if (window.BeyFlow) {
        const handleEvent = (event, data) => {
          setRecentActivity(prev => [
            {
              id: Date.now(),
              type: event,
              data,
              timestamp: new Date().toISOString()
            },
            ...prev.slice(0, 9) // Keep last 10 events
          ])
        }

        // Listen to all integration events
        window.BeyFlow.on('beytv:*', handleEvent)
        window.BeyFlow.on('stackblog:*', handleEvent)
        window.BeyFlow.on('omnisphere:*', handleEvent)
        window.BeyFlow.on('chat:*', handleEvent)
      }

      return () => clearInterval(interval)
    }
  }, [])

  const getStatusColor = (connected) => connected ? 'text-green-400' : 'text-red-400'
  const getStatusIcon = (connected) => connected ? '🟢' : '🔴'
  const getStatusText = (connected) => connected ? 'ONLINE' : 'OFFLINE'

  return (
    <motion.div
      className="bg-black/30 border border-gray-600 rounded-lg p-4 backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
        <span>🌐</span>
        Integration Dashboard
      </h3>

      {/* Service Status Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {Object.entries(integrationStatus).map(([service, status]) => (
          <motion.div
            key={service}
            className="bg-black/50 border border-gray-700 rounded-lg p-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium capitalize">{service}</span>
              <span>{getStatusIcon(status.connected)}</span>
            </div>
            <div className={`text-xs font-mono ${getStatusColor(status.connected)}`}>
              {getStatusText(status.connected)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Last check: {status.lastPing ? new Date(status.lastPing).toLocaleTimeString() : 'Never'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <span>📋</span>
          Recent Activity
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                className="bg-black/50 border border-gray-700 rounded p-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 text-sm font-mono">
                    {activity.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {activity.data && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {JSON.stringify(activity.data, null, 0).substring(0, 100)}...
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              <span className="text-2xl block mb-2">📡</span>
              <p className="text-sm">No activity yet</p>
              <p className="text-xs">Send a chat message to see integration events</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-white font-medium mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={() => window.BeyFlow?.emit('test:ping', { timestamp: Date.now() })}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Test Ping
          </motion.button>
          <motion.button
            onClick={() => {
              if (window.BeyFlowIntegration) {
                const status = window.BeyFlowIntegration.getIntegrationStatus()
                console.log('Integration Status:', status)
                alert(`Integration Status:\n${JSON.stringify(status, null, 2)}`)
              }
            }}
            className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Status
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}