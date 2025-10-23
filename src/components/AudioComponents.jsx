import { useState, useRef, useEffect } from "react"
import { Button, Card, Input, Modal } from "../core/StandardComponents"
import { motion, AnimatePresence } from "framer-motion"
import { useBeyFlowStore } from "../core/UnifiedStore"
import { analyzeAudioFrequency } from "../modules/audioAPI"

export function AudioPlayer({ src, onEnded = () => {} }) {
  const { audio, updateAudio } = useStore()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [frequencyData, setFrequencyData] = useState(new Array(64).fill(0))

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.src = src
      if (!audio.muted) {
        audioRef.current.play()
        setIsPlaying(true)
        updateAudio({ playing: true })
      }
    }
  }, [src, audio.muted, updateAudio])

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const { audioContext, analyser } = analyzeAudioFrequency(
        audioRef.current,
        (data) => setFrequencyData(Array.from(data.slice(0, 64)))
      )
      
      return () => {
        audioContext.close()
      }
    }
  }, [isPlaying])

  const handlePlay = () => {
    setIsPlaying(true)
    updateAudio({ playing: true })
  }

  const handlePause = () => {
    setIsPlaying(false)
    updateAudio({ playing: false })
  }

  const handleEnded = () => {
    setIsPlaying(false)
    updateAudio({ playing: false })
    onEnded()
  }

  if (!src) return null

  return (
    <motion.div
      className="w-full mt-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl p-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Audio Visualizer */}
      <div className="h-16 flex items-end justify-center space-x-1 mb-3">
        {frequencyData.map((value, index) => (
          <motion.div
            key={index}
            className="w-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-full"
            style={{ height: `${Math.max(2, (value / 255) * 60)}px` }}
            animate={{
              height: `${Math.max(2, (value / 255) * 60)}px`,
              opacity: value > 10 ? 1 : 0.3
            }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Audio Controls */}
      <audio
        ref={audioRef}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        volume={audio.volume}
        muted={audio.muted}
        className="w-full"
        controls
      />

      {/* Enhanced Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={() => updateAudio({ muted: !audio.muted })}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {audio.muted ? '🔇' : '🔊'}
          </motion.button>
          
          <span className="text-white/60 text-sm">
            Voice: {audio.voice}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-xs">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audio.volume}
            onChange={(e) => updateAudio({ volume: parseFloat(e.target.value) })}
            className="w-16 accent-cyan-400"
          />
        </div>
      </div>
    </motion.div>
  )
}

export function VoiceInput({ onTranscript, onCommand }) {
  const { audio, updateAudio } = useStore()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.lang = "en-US"
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = true

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      updateAudio({ isListening: true })
    }

    recognitionRef.current.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setTranscript(finalTranscript || interimTranscript)
      
      if (finalTranscript) {
        onTranscript(finalTranscript)
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      updateAudio({ isListening: false })
      setTranscript('')
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      updateAudio({ isListening: false })
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return (
    <motion.div
      className="flex items-center space-x-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`p-3 rounded-xl font-medium transition-all ${
          isListening
            ? 'bg-red-500 text-white'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? { scale: [1, 1.1, 1] } : {}}
        transition={isListening ? { duration: 1, repeat: Infinity } : {}}
      >
        {isListening ? '🔴 Stop' : '🎤 Voice'}
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-red-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            <span className="text-white/80 text-sm">
              {transcript || 'Listening...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function VoiceSettings() {
  const { audio, updateAudio } = useStore()
  const [showSettings, setShowSettings] = useState(false)

  const voices = [
    { id: 'Rachel', name: 'Rachel (Female)', accent: 'American' },
    { id: 'Drew', name: 'Drew (Male)', accent: 'American' },
    { id: 'Clyde', name: 'Clyde (Male)', accent: 'American' },
    { id: 'Sarah', name: 'Sarah (Female)', accent: 'American' },
    { id: 'Antoni', name: 'Antoni (Male)', accent: 'Polish' },
    { id: 'Thomas', name: 'Thomas (Male)', accent: 'American' }
  ]

  return (
    <motion.div className="relative">
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🎵 Voice
      </motion.button>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="absolute top-12 right-0 w-64 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-50"
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
          >
            <h3 className="text-white font-semibold mb-3">Voice Settings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-white/80 text-sm block mb-2">Voice</label>
                <select
                  value={audio.voice}
                  onChange={(e) => updateAudio({ voice: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id} className="bg-slate-800">
                      {voice.name} - {voice.accent}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/80 text-sm block mb-2">
                  Volume: {Math.round(audio.volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audio.volume}
                  onChange={(e) => updateAudio({ volume: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={audio.muted}
                  onChange={(e) => updateAudio({ muted: e.target.checked })}
                  className="rounded"
                />
                <label className="text-white/80 text-sm">Mute audio responses</label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}