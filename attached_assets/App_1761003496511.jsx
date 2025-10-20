import React, { useState } from 'react'
import Scene from './components/Scene.jsx'
import PromptInput from './components/PromptInput'
import AgentPanel from './components/AgentPanel'
import OmnigenRouter from './OmnigenRouter'

function App() {
  const [messages, setMessages] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [exploded, setExploded] = useState(false)

  const handleMessage = (newMessage) => {
    setMessages(prev => [...prev, newMessage])
  }

  const phase = exploded ? (selectedAgent ? 'recursion' : 'explode') : 'intro'

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
      fontFamily: 'monospace'
    }}>
      <Scene phase={phase} />


      <div style={{
        position: 'absolute',
        top: '24%',
        left: '5%',
        zIndex: 10,
        color: 'white',
        maxWidth: '500px'
      }}>
        <OmnigenRouter onMessage={handleMessage} setAgent={setSelectedAgent} setExploded={setExploded} />
        <AgentPanel selectedAgent={selectedAgent} />

        <div style={{ margin: '20px 0', maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              {msg.role === 'image' ? (
                <img
                  src={msg.content}
                  alt="Generated"
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px #0ff'
                  }}
                />
              ) : (
                <div style={{
                  color: msg.role === 'user' ? '#0ff' : '#fff',
                  background: msg.role === 'user' ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                  padding: '10px',
                  borderRadius: '8px'
                }}>
                  <strong>{msg.role}:</strong> {msg.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
