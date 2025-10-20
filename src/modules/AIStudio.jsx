import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useStore from "../store"
import api from "./api"

const aiProviders = [
  { id: 'openai', name: 'OpenAI GPT', icon: '🤖', color: 'from-green-500 to-emerald-600' },
  { id: 'gemini', name: 'Google Gemini', icon: '✨', color: 'from-blue-500 to-indigo-600' },
  { id: 'claude', name: 'Anthropic Claude', icon: '🧠', color: 'from-purple-500 to-violet-600' }
]

const promptTemplates = [
  { name: 'Creative Writing', prompt: 'Write a creative story about' },
  { name: 'Code Review', prompt: 'Please review this code and suggest improvements:' },
  { name: 'Business Strategy', prompt: 'Develop a business strategy for' },
  { name: 'Technical Explanation', prompt: 'Explain in simple terms how' },
  { name: 'Marketing Copy', prompt: 'Create compelling marketing copy for' }
]

export default function AIStudio() {
  const { addMessage, isLoading, setLoading } = useStore()
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [prompt, setPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [responses, setResponses] = useState([])

  const generateResponse = async () => {
    if (!prompt.trim() || isLoading) return

    setLoading(true)
    const currentPrompt = prompt.trim()
    setPrompt('')

    // Add to chat log
    addMessage({
      text: `AI Studio (${selectedProvider}): ${currentPrompt}`,
      user: 'AI Studio',
      type: 'user'
    })

    try {
      let result
      switch (selectedProvider) {
        case 'openai':
          result = await api.callOpenAI({
            prompt: currentPrompt,
            temperature,
            max_tokens: maxTokens
          })
          break
        case 'gemini':
          result = await api.callGemini({
            prompt: currentPrompt,
            temperature,
            max_tokens: maxTokens
          })
          break
        default:
          result = { success: false, error: 'Provider not implemented' }
      }

      const response = {
        id: Date.now(),
        provider: selectedProvider,
        prompt: currentPrompt,
        response: result.success ? result.data.message : result.error,
        timestamp: Date.now(),
        success: result.success
      }

      setResponses(prev => [response, ...prev])

      // Add to chat log
      addMessage({
        text: response.response,
        user: `${aiProviders.find(p => p.id === selectedProvider)?.name} AI`,
        type: 'bot'
      })

    } catch (error) {
      addMessage({
        text: "AI Studio error: " + error.message,
        user: 'AI Studio',
        type: 'bot'
      })
    } finally {
      setLoading(false)
    }
  }

  const useTemplate = (template) => {
    setPrompt(template.prompt + ' ')
  }

  return (
    <div className="h-full p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            AI Studio 🤖
          </h2>
          <p className="text-white/70">
            Experiment with different AI models and prompts
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Prompt Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Provider Selection */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">AI Provider</h3>
              <div className="flex flex-wrap gap-3">
                {aiProviders.map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${
                      selectedProvider === provider.id
                        ? `bg-gradient-to-r ${provider.color} text-white border-transparent`
                        : 'bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{provider.icon}</span>
                    <span>{provider.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Prompt Input */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">Prompt</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your AI prompt here..."
                className="w-full h-32 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-white/60 text-sm">
                  {prompt.length} characters
                </div>
                
                <motion.button
                  onClick={generateResponse}
                  disabled={!prompt.trim() || isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center space-x-2"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Generating...</span>
                    </motion.div>
                  ) : (
                    "✨ Generate"
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Response History */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">
                Response History ({responses.length})
              </h3>
              
              {responses.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <p className="text-4xl mb-2">🤖</p>
                  <p>No AI responses yet</p>
                  <p className="text-sm">Generate your first AI response above!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {responses.map((response, index) => (
                    <motion.div
                      key={response.id}
                      className={`p-4 rounded-xl border ${
                        response.success
                          ? 'bg-green-500/10 border-green-400/30'
                          : 'bg-red-500/10 border-red-400/30'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{aiProviders.find(p => p.id === response.provider)?.icon}</span>
                          <span className="text-white/80 text-sm font-medium">
                            {aiProviders.find(p => p.id === response.provider)?.name}
                          </span>
                        </div>
                        <span className="text-white/50 text-xs">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-2">
                        <strong>Prompt:</strong> {response.prompt}
                      </p>
                      
                      <p className="text-white">
                        {response.response}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Parameters */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">Parameters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm block mb-2">
                    Temperature: {temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Controls randomness (0 = focused, 1 = creative)
                  </p>
                </div>

                <div>
                  <label className="text-white/80 text-sm block mb-2">
                    Max Tokens: {maxTokens}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="100"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Maximum response length
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Prompt Templates */}
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">Templates</h3>
              
              <div className="space-y-2">
                {promptTemplates.map((template, index) => (
                  <motion.button
                    key={index}
                    onClick={() => useTemplate(template)}
                    className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-all"
                    whileHover={{ scale: 1.02 }}
                  >
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-white/60 mt-1">{template.prompt}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}