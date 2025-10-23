import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useBeyFlowStore } from "../core/UnifiedStore"
import api from "./api"
import { generateSpeech, processVoiceCommand } from "./audioAPI"
import { AudioPlayer, VoiceInput, VoiceSettings } from "../components/AudioComponents"
import { ChatBubble, FluidButton, LoadingDots } from "../components/DopamineUI"
import { useAnalytics } from "../hooks/useAnalytics"

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-3"
    >
      <div className="bg-white/10 backdrop-blur-sm text-white mr-3 border border-white/20 px-3 py-1.5 rounded-2xl">
        <div className="flex space-x-1 items-center">
          <p className="text-xs font-medium">BeyFlow is thinking</p>
          <LoadingDots />
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPanel() {
    const user = useBeyFlowStore(state => state.user)
  const messages = useBeyFlowStore(state => state.chat.messages)
  const addMessage = useBeyFlowStore(state => state.chat.addMessage)
  const webhook = useBeyFlowStore(state => state.integrations.webhook)
  const setUser = useBeyFlowStore(state => state.setUser)
  const isLoading = useBeyFlowStore(state => state.ui.loading)
  const setLoading = useBeyFlowStore(state => state.ui.setLoading)
  const updateAnalytics = useBeyFlowStore(state => state.analytics.update)
  const audio = useBeyFlowStore(state => state.audio)
  const setAudioUrl = useBeyFlowStore(state => state.audio.setUrl)
  const setModule = useBeyFlowStore(state => state.ui.setCurrentModule)
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState(user)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const [integrationConnected, setIntegrationConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const { trackEvent } = useAnalytics()

  // Connect to BeyFlow Integration System
  useEffect(() => {
    if (window.BeyFlow) {
      setIntegrationConnected(true)
      
      // Register chat component
      window.BeyFlow.register('chat', {
        addSystemMessage: (data) => {
          addMessage({
            text: data.message,
            user: 'BeyFlow System',
            timestamp: Date.now(),
            type: data.type || 'system'
          })
        },
        addAIMessage: (data) => {
          addMessage({
            text: data.message,
            user: 'AI Assistant',
            timestamp: Date.now(),
            type: 'ai_response'
          })
        }
      })
      
      // Listen for cross-component messages
      window.BeyFlow.subscribe('chat:system_message', (data) => {
        addMessage({
          text: data.message,
          user: 'BeyFlow',
          timestamp: Date.now(),
          type: data.type || 'system'
        })
      })
      
      // Listen for AI responses
      window.BeyFlow.subscribe('ai:response_ready', (data) => {
        addMessage({
          text: data.aiResponse.message,
          user: 'AI Assistant',
          timestamp: Date.now(),
          type: 'ai_response'
        })
      })
      
      console.log('💬 Chat connected to BeyFlow Integration')
    }
  }, [addMessage])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim()) return
    if (isLoading) return

    const messageText = text.trim()
    setText("")
    setLoading(true)

    // Track message send event
    trackEvent('message_sent', {
      feature: 'chat',
      messageLength: messageText.length,
      hasAudio: !!currentAudioUrl,
      timestamp: Date.now()
    })

    // Update user if changed
    if (userInput !== user) {
      setUser(userInput)
    }

    // Add user message
    addMessage({
      text: messageText,
      user: userInput,
      type: 'user',
      timestamp: Date.now()
    })

    // **NEW: Emit to BeyFlow Integration System**
    if (window.BeyFlow) {
      window.BeyFlow.emit('chat:message_sent', {
        message: messageText,
        user: userInput,
        timestamp: Date.now(),
        aiEnabled: true, // Enable AI processing
        logToBlog: messageText.includes('#blog'), // Auto-blog if #blog hashtag
        context: { 
          messageCount: messages.length,
          integrationConnected
        }
      })
    }

    try {
      // Send to webhook
      const result = await api.sendMessage(webhook, {
        user: userInput,
        text: messageText
      })

      // Update analytics
      updateAnalytics({
        messageCount: messages.length + 1,
        responseTime: [...(useBeyFlowStore.getState().analytics.responseTime || []), result.responseTime]
      })

      // Add response
      if (result.success) {
        const responseText = result.data.message || result.data.response || "Message sent successfully! 🚀"
        addMessage({
          text: responseText,
          user: 'BeyFlow',
          type: 'bot'
        })

        // Generate audio for response
        if (!audio.muted) {
          try {
            const audioUrl = await generateSpeech(responseText, audio.voice)
            if (audioUrl) {
              setCurrentAudioUrl(audioUrl)
              setAudioUrl(audioUrl)
            }
          } catch (error) {
            console.warn('Audio generation failed:', error)
          }
        }
      } else {
        addMessage({
          text: "Sorry, there was an error. Please try again! 😅",
          user: 'BeyFlow',
          type: 'bot'
        })
      }
    } catch (error) {
      addMessage({
        text: "Connection error. Please check your internet and try again! 🌐",
        user: 'BeyFlow',
        type: 'bot'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleVoiceTranscript = (transcript) => {
    setText(transcript)
  }

  const handleVoiceCommand = (transcript) => {
    const command = processVoiceCommand(transcript)
    
    switch (command.action) {
      case 'clear_chat':
        // Clear messages logic would go here
        break
      case 'show_module':
        setModule(command.module)
        break
      case 'send_message':
        setText(command.message)
        // Auto-send after a short delay
        setTimeout(() => sendMessage(), 500)
        break
      default:
        handleVoiceTranscript(transcript)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area - COMPACT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-1"
        >
          <h2 className="text-base font-bold text-white mb-0.5">
            Welcome to BeyFlow Chat! 🚀
          </h2>
          <p className="text-white/70 text-[11px]">
            Your AI-powered conversation experience
          </p>
        </motion.div>

        {messages.map((message, index) => (
          <ChatBubble
            key={message.id || index}
            message={message}
            isUser={message.type === 'user'}
          />
        ))}

        {/* Audio Player for bot responses */}
        <AnimatePresence>
          {currentAudioUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AudioPlayer 
                src={currentAudioUrl} 
                onEnded={() => setCurrentAudioUrl(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - COMPACT & STICKY */}
      <motion.div
        className="sticky bottom-0 p-2 bg-black/30 backdrop-blur-xl border-t border-white/10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col space-y-1.5">
          {/* User Input */}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Your name..."
            aria-label="Your name"
            className="w-full px-2.5 py-1.5 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white text-xs placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all min-h-[36px]"
          />
          
          {/* Message Input */}
          <div className="flex space-x-1.5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (Enter to send)"
              aria-label="Message input"
              className="flex-1 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-white text-xs placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all resize-none"
              rows="2"
            />
            
            <FluidButton
              onClick={sendMessage}
              disabled={!text.trim() || isLoading}
              variant="primary"
              className="px-4 py-2 text-sm font-bold shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all"
            >
              {isLoading ? <LoadingDots /> : "Send 🚀"}
            </FluidButton>
          </div>

          {/* Voice and Audio Controls */}
          <div className="flex items-center justify-between pt-0.5">
            <VoiceInput 
              onTranscript={handleVoiceTranscript}
              onCommand={handleVoiceCommand}
            />
            <VoiceSettings />
          </div>
        </div>
      </motion.div>
    </div>
  )
}