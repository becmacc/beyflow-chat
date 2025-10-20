import { useState } from 'react'
import { motion } from 'framer-motion'
import useStore from '../store'
import { getTheme } from '../config/themes'
import { omnigenAgents } from '../config/omnigenAgents'
import GlassmorphicCard from '../components/GlassmorphicCard'
import OmnigenCube from '../components/OmnigenCube'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: import.meta.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: import.meta.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export default function AIStudio() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [selectedAgent, setSelectedAgent] = useState('omnigen')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const agent = omnigenAgents[selectedAgent]

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: agent.systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input }
        ],
        max_tokens: 1000
      })

      const response = completion.choices[0].message.content

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        agent: agent.name
      }])

    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}`,
        agent: agent.name
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`h-full flex flex-col ${theme.colors.bg}`}>
      {/* Header */}
      <div className={`h-12 ${theme.colors.bg} border-b ${theme.colors.border} flex items-center justify-between px-6`}>
        <h2 className={`text-sm ${theme.font} ${theme.colors.textMuted}`}>
          {theme.id === 'glassmorphic' ? 'AI Studio - Omnigen Team' : 'ai_studio_omnigen_team'}
        </h2>
        <div className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
          {agent.icon} {agent.name}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 3D Visualization */}
        <div className={`w-80 ${theme.colors.bg} border-r ${theme.colors.border} p-4`}>
          <h3 className={`text-xs ${theme.font} font-bold ${theme.colors.accent} mb-3`}>
            {theme.id === 'glassmorphic' ? '3D Team Structure' : '// 3D_HIERARCHY'}
          </h3>
          <div className="h-96 rounded-lg overflow-hidden bg-black/50">
            <OmnigenCube 
              onAgentSelect={setSelectedAgent} 
              activeAgent={selectedAgent}
            />
          </div>
          
          <div className={`mt-4 p-3 ${theme.rounded} border ${theme.colors.border}`}>
            <p className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
              {theme.id === 'glassmorphic' 
                ? 'Click the cube to explore the agent hierarchy. Each triangle represents a specialized AI agent.'
                : '> Click cube to fractal_explore\n> Triangles = specialized_agents'
              }
            </p>
          </div>
        </div>

        {/* Agent Selector List */}
        <div className={`w-64 ${theme.colors.bg} border-r ${theme.colors.border} p-4 overflow-y-auto`}>
          <h3 className={`text-xs ${theme.font} font-bold ${theme.colors.accent} mb-3`}>
            {theme.id === 'glassmorphic' ? 'Select Agent' : '// AGENTS'}
          </h3>
          
          <div className="space-y-2">
            {Object.entries(omnigenAgents).map(([id, agentData]) => (
              <motion.button
                key={id}
                onClick={() => setSelectedAgent(id)}
                className={`w-full text-left p-3 transition-all ${theme.font} text-sm ${theme.rounded} border ${
                  selectedAgent === id
                    ? `${theme.colors.borderActive} ${theme.colors.text}`
                    : `${theme.colors.border} ${theme.colors.textMuted} hover:${theme.colors.borderActive}`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{agentData.icon}</span>
                  <span className="font-bold">{agentData.name}</span>
                </div>
                <p className={`text-xs ${theme.colors.textMuted}`}>{agentData.role}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Agent Info */}
          <div className={`p-4 border-b ${theme.colors.border}`}>
            <GlassmorphicCard className="p-4">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl">{agent.icon}</span>
                <div>
                  <h3 className={`${theme.font} font-bold ${theme.colors.text}`}>{agent.name}</h3>
                  <p className={`text-xs ${theme.colors.accent}`}>{agent.role}</p>
                </div>
              </div>
              <p className={`text-sm ${theme.colors.textMuted} ${theme.font}`}>{agent.description}</p>
            </GlassmorphicCard>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-20">
                <div className="text-6xl mb-4">{agent.icon}</div>
                <h3 className={`text-xl ${theme.font} ${theme.colors.text} mb-2`}>
                  {theme.id === 'glassmorphic' ? `Chat with ${agent.name}` : `> ${agent.name.toUpperCase()}_READY`}
                </h3>
                <p className={`${theme.colors.textMuted} ${theme.font} text-sm`}>
                  {agent.description}
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${theme.font} text-sm`}>
                  <GlassmorphicCard className={`p-3 ${
                    msg.role === 'user' 
                      ? 'bg-cyan-500/10 border-cyan-500/30' 
                      : 'bg-white/5'
                  }`}>
                    {msg.agent && (
                      <div className={`text-xs ${theme.colors.accent} mb-1`}>
                        {msg.agent}
                      </div>
                    )}
                    <div className={theme.colors.text}>{msg.content}</div>
                  </GlassmorphicCard>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <GlassmorphicCard className="p-3">
                  <div className={`${theme.font} ${theme.colors.textMuted} text-sm`}>
                    {agent.name} is thinking...
                  </div>
                </GlassmorphicCard>
              </motion.div>
            )}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${theme.colors.border}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${agent.name}...`}
                disabled={loading}
                className={`flex-1 px-4 py-2 ${theme.colors.input} ${theme.font} ${theme.rounded} text-sm focus:outline-none focus:${theme.colors.borderActive}`}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`px-6 py-2 ${theme.font} ${theme.rounded} text-sm ${theme.colors.buttonActive} disabled:opacity-30 transition-all`}
              >
                {loading ? (theme.id === 'glassmorphic' ? 'Sending...' : '[SENDING...]') : (theme.id === 'glassmorphic' ? 'Send' : '[SEND]')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
