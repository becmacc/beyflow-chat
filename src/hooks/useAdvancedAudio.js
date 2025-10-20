import { useState, useEffect, useRef, useCallback } from 'react'

export const useAdvancedAudio = () => {
  const [audioContext, setAudioContext] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [volume, setVolume] = useState(0)
  
  const streamRef = useRef(null)
  const animationFrameRef = useRef(null)
  const dataArrayRef = useRef(null)
  const workletRef = useRef(null)

  // Advanced audio analysis with custom AudioWorklet
  const initializeAudioWorklet = useCallback(async (context) => {
    try {
      // Register custom audio processor
      await context.audioWorklet.addModule('/audio-processor.js')
      
      const processor = new AudioWorkletNode(context, 'audio-analyzer-processor')
      
      processor.port.onmessage = (event) => {
        const { type, data } = event.data
        
        switch (type) {
          case 'audio-features':
            setAudioData(prev => ({
              ...prev,
              ...data,
              timestamp: Date.now()
            }))
            break
          case 'volume-meter':
            setVolume(data.volume)
            break
        }
      }
      
      workletRef.current = processor
      return processor
    } catch (error) {
      console.warn('AudioWorklet not supported, falling back to AnalyserNode')
      return null
    }
  }, [])

  // High-performance audio analysis
  const startAdvancedAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      })

      const context = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 44100,
        latencyHint: 'playback' // Optimized for real-time
      })

      const source = context.createMediaStreamSource(stream)
      
      // Try to use AudioWorklet for advanced processing
      const workletProcessor = await initializeAudioWorklet(context)
      
      if (workletProcessor) {
        source.connect(workletProcessor)
        workletProcessor.connect(context.destination)
      } else {
        // Fallback to AnalyserNode
        const analyserNode = context.createAnalyser()
        analyserNode.fftSize = 2048
        analyserNode.smoothingTimeConstant = 0.8
        analyserNode.minDecibels = -90
        analyserNode.maxDecibels = -10
        
        source.connect(analyserNode)
        setAnalyser(analyserNode)
        
        dataArrayRef.current = new Uint8Array(analyserNode.frequencyBinCount)
      }

      streamRef.current = stream
      setAudioContext(context)
      setIsRecording(true)

      // Start analysis loop
      const analyze = () => {
        if (!analyser || !dataArrayRef.current) return

        analyser.getByteFrequencyData(dataArrayRef.current)
        
        // Advanced audio feature extraction
        const features = extractAudioFeatures(dataArrayRef.current)
        setAudioData(features)
        
        animationFrameRef.current = requestAnimationFrame(analyze)
      }
      
      if (!workletProcessor) {
        analyze()
      }

    } catch (error) {
      console.error('Audio initialization failed:', error)
    }
  }, [analyser, initializeAudioWorklet])

  // Advanced audio feature extraction
  const extractAudioFeatures = useCallback((frequencyData) => {
    const dataLength = frequencyData.length
    
    // Frequency bands analysis
    const bassRange = frequencyData.slice(0, dataLength * 0.1)
    const midRange = frequencyData.slice(dataLength * 0.1, dataLength * 0.4)
    const trebleRange = frequencyData.slice(dataLength * 0.4, dataLength)
    
    const bass = bassRange.reduce((sum, val) => sum + val, 0) / bassRange.length
    const mid = midRange.reduce((sum, val) => sum + val, 0) / midRange.length
    const treble = trebleRange.reduce((sum, val) => sum + val, 0) / trebleRange.length
    
    // Energy and dynamics
    const totalEnergy = frequencyData.reduce((sum, val) => sum + val * val, 0)
    const averageFrequency = frequencyData.reduce((sum, val) => sum + val, 0) / dataLength
    
    // Peak detection
    const peaks = []
    for (let i = 1; i < dataLength - 1; i++) {
      if (frequencyData[i] > frequencyData[i-1] && frequencyData[i] > frequencyData[i+1] && frequencyData[i] > 100) {
        peaks.push({ frequency: i, amplitude: frequencyData[i] })
      }
    }
    
    // Spectral features
    const spectralCentroid = calculateSpectralCentroid(frequencyData)
    const spectralRolloff = calculateSpectralRolloff(frequencyData)
    const zeroCrossingRate = calculateZeroCrossingRate(frequencyData)
    
    return {
      frequencyData: Array.from(frequencyData),
      bass: bass / 255,
      mid: mid / 255,
      treble: treble / 255,
      energy: totalEnergy / (dataLength * 255 * 255),
      average: averageFrequency / 255,
      peaks: peaks.slice(0, 10), // Top 10 peaks
      spectralCentroid,
      spectralRolloff,
      zeroCrossingRate,
      timestamp: Date.now()
    }
  }, [])

  // Advanced spectral analysis functions
  const calculateSpectralCentroid = (data) => {
    let numerator = 0
    let denominator = 0
    
    for (let i = 0; i < data.length; i++) {
      numerator += i * data[i]
      denominator += data[i]
    }
    
    return denominator > 0 ? numerator / denominator : 0
  }

  const calculateSpectralRolloff = (data, threshold = 0.85) => {
    const totalEnergy = data.reduce((sum, val) => sum + val, 0)
    const targetEnergy = totalEnergy * threshold
    
    let cumulativeEnergy = 0
    for (let i = 0; i < data.length; i++) {
      cumulativeEnergy += data[i]
      if (cumulativeEnergy >= targetEnergy) {
        return i / data.length
      }
    }
    return 1
  }

  const calculateZeroCrossingRate = (data) => {
    let crossings = 0
    for (let i = 1; i < data.length; i++) {
      if ((data[i] >= 128 && data[i-1] < 128) || (data[i] < 128 && data[i-1] >= 128)) {
        crossings++
      }
    }
    return crossings / data.length
  }

  // Cleanup
  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close()
    }
    
    if (workletRef.current) {
      workletRef.current.disconnect()
    }
    
    setIsRecording(false)
    setAudioContext(null)
    setAnalyser(null)
    setAudioData(null)
  }, [audioContext])

  useEffect(() => {
    return () => stopAnalysis()
  }, [stopAnalysis])

  return {
    startAnalysis: startAdvancedAnalysis,
    stopAnalysis,
    audioData,
    isRecording,
    volume,
    audioContext,
    analyser
  }
}