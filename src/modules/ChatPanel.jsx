import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useStore from "../store"
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
      className="flex justify-start mb-4"
    >
      <div className="bg-white/10 backdrop-blur-sm text-white mr-4 border border-white/20 px-4 py-2 rounded-2xl">
        <div className="flex space-x-1 items-center">
          <p className="text-sm font-medium">BeyFlow is thinking</p>
          <LoadingDots />
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatPanel() {
  const { user, messages, addMessage, webhook, setUser, isLoading, setLoading, updateAnalytics, audio, setAudioUrl, setModule } = useStore()
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState(user)
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null)
  const messagesEndRef = useRef(null)
  const { trackEvent } = useAnalytics()

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
      type: 'user'
    })

    try {
      // Send to webhook
      const result = await api.sendMessage(webhook, {
        user: userInput,
        text: messageText
      })

      // Update analytics
      updateAnalytics({
        messageCount: messages.length + 1,
        responseTime: [...(useStore.getState().analytics.responseTime || []), result.responseTime]
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
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome to BeyFlow Chat! 🚀
          </h2>
          <p className="text-white/70">
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

      {/* Input Area */}
      <motion.div
        className="p-6 bg-black/20 backdrop-blur-xl border-t border-white/10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col space-y-3">
          {/* User Input */}
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Your name..."
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
          />
          
          {/* Message Input */}
          <div className="flex space-x-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message... (Enter to send)"
              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none"
              rows="2"
            />
            
            <FluidButton
              onClick={sendMessage}
              disabled={!text.trim() || isLoading}
              variant="primary"
            >
              {isLoading ? <LoadingDots /> : "Send 🚀"}
            </FluidButton>
          </div>

          {/* Voice and Audio Controls */}
          <div className="flex items-center justify-between pt-3">
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