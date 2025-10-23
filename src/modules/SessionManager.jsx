import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useBeyFlowStore } from "../core/UnifiedStore"
import storage from "./storage"

export default function SessionManager() {
  const { messages, user, setUser, addMessage, clearMessages } = useStore()
  const [sessions, setSessions] = useState(storage.getSessions())
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [sessionName, setSessionName] = useState("")

  const saveCurrentSession = () => {
    if (!sessionName.trim()) return
    
    const sessionId = Date.now().toString()
    const sessionData = {
      messages,
      user,
      timestamp: Date.now(),
      name: sessionName.trim()
    }
    
    storage.saveSession(sessionId, sessionData)
    setSessions(storage.getSessions())
    setSessionName("")
    setShowSaveModal(false)
  }

  const loadSession = (sessionId) => {
    const sessionData = storage.loadSession(sessionId)
    if (sessionData) {
      clearMessages()
      setUser(sessionData.user || 'Anonymous')
      sessionData.messages?.forEach(message => {
        addMessage(message)
      })
    }
  }

  const deleteSession = (sessionId) => {
    storage.remove(`chat-session-${sessionId}`)
    setSessions(storage.getSessions())
  }

  const clearAllSessions = () => {
    storage.clearSessions()
    setSessions([])
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Session Manager 💾
            </h2>
            <p className="text-white/70">
              Save and load your conversation history
            </p>
          </div>
          
          <div className="flex space-x-3">
            <motion.button
              onClick={() => setShowSaveModal(true)}
              disabled={messages.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💾 Save Current
            </motion.button>
            
            <motion.button
              onClick={clearAllSessions}
              className="px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear All
            </motion.button>
          </div>
        </div>

        {/* Current Session Info */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-white text-lg font-semibold mb-4">Current Session</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-cyan-400">{messages.length}</p>
              <p className="text-white/60 text-sm">Messages</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{user}</p>
              <p className="text-white/60 text-sm">Current User</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {messages.length > 0 ? 'Active' : 'Empty'}
              </p>
              <p className="text-white/60 text-sm">Status</p>
            </div>
          </div>
        </motion.div>

        {/* Saved Sessions */}
        <div>
          <h3 className="text-white text-xl font-semibold mb-4">
            Saved Sessions ({sessions.length})
          </h3>
          
          {sessions.length === 0 ? (
            <motion.div
              className="text-center py-12 text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-6xl mb-4">📭</p>
              <p className="text-lg">No saved sessions yet</p>
              <p className="text-sm">Start chatting and save your conversations!</p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.sessionId}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">
                        {session.name || `Session ${session.sessionId}`}
                      </h4>
                      <p className="text-white/60 text-sm">
                        {session.messages?.length || 0} messages • {session.user} • {new Date(session.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => loadSession(session.sessionId)}
                        className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-lg text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        📂 Load
                      </motion.button>
                      
                      <motion.button
                        onClick={() => deleteSession(session.sessionId)}
                        className="px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-300 rounded-lg text-sm"
                        whileHover={{ scale: 1.05 }}
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-white text-xl font-bold mb-4">Save Session</h3>
              
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveCurrentSession()}
                placeholder="Enter session name..."
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
                autoFocus
              />
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={saveCurrentSession}
                  disabled={!sessionName.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                >
                  💾 Save
                </motion.button>
                
                <motion.button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}