// Advanced AudioWorklet processor for real-time audio analysis
class AudioAnalyzerProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bufferSize = 2048
    this.buffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
    this.frameCount = 0
    this.sampleRate = 44100
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]
    
    if (input.length > 0) {
      const inputChannel = input[0]
      
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i]
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize
        
        // Process every 512 samples (reduce CPU load)
        if (this.bufferIndex % 512 === 0) {
          this.analyzeBuffer()
        }
      }
    }
    
    return true
  }

  analyzeBuffer() {
    // FFT analysis
    const fftResult = this.performFFT(this.buffer)
    
    // Volume analysis
    const volume = this.calculateRMS(this.buffer)
    
    // Pitch detection
    const pitch = this.detectPitch(this.buffer)
    
    // Send results to main thread
    this.port.postMessage({
      type: 'audio-features',
      data: {
        fft: Array.from(fftResult),
        pitch,
        volume,
        frameCount: this.frameCount++
      }
    })
  }

  calculateRMS(buffer) {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  detectPitch(buffer) {
    // Autocorrelation-based pitch detection
    const autocorrelation = new Float32Array(buffer.length)
    
    for (let lag = 0; lag < buffer.length; lag++) {
      let sum = 0
      for (let i = 0; i < buffer.length - lag; i++) {
        sum += buffer[i] * buffer[i + lag]
      }
      autocorrelation[lag] = sum / (buffer.length - lag)
    }
    
    // Find the first peak after the initial peak
    let maxCorrelation = 0
    let bestLag = 0
    
    for (let lag = 20; lag < autocorrelation.length / 2; lag++) {
      if (autocorrelation[lag] > maxCorrelation) {
        maxCorrelation = autocorrelation[lag]
        bestLag = lag
      }
    }
    
    return bestLag > 0 ? this.sampleRate / bestLag : 0
  }

  performFFT(buffer) {
    // Simplified FFT implementation
    const fftSize = 1024
    const real = new Float32Array(fftSize)
    const imag = new Float32Array(fftSize)
    
    // Copy buffer data
    for (let i = 0; i < Math.min(fftSize, buffer.length); i++) {
      real[i] = buffer[i]
    }
    
    // Apply window function (Hanning)
    for (let i = 0; i < fftSize; i++) {
      const window = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (fftSize - 1))
      real[i] *= window
    }
    
    // Perform FFT (simplified)
    this.fft(real, imag)
    
    // Calculate magnitude spectrum
    const magnitude = new Float32Array(fftSize / 2)
    for (let i = 0; i < fftSize / 2; i++) {
      magnitude[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i])
    }
    
    return magnitude
  }

  fft(real, imag) {
    const n = real.length
    
    // Bit-reverse
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1
      for (; j & bit; bit >>= 1) {
        j ^= bit
      }
      j ^= bit
      
      if (i < j) {
        [real[i], real[j]] = [real[j], real[i]]
        [imag[i], imag[j]] = [imag[j], imag[i]]
      }
    }
    
    // FFT
    for (let len = 2; len <= n; len <<= 1) {
      const wlen = 2 * Math.PI / len
      const wreal = Math.cos(wlen)
      const wimag = Math.sin(wlen)
      
      for (let i = 0; i < n; i += len) {
        let wr = 1
        let wi = 0
        
        for (let j = 0; j < len / 2; j++) {
          const u = real[i + j]
          const v = imag[i + j]
          const s = real[i + j + len / 2]
          const t = imag[i + j + len / 2]
          
          real[i + j] = u + s * wr - t * wi
          imag[i + j] = v + s * wi + t * wr
          real[i + j + len / 2] = u - s * wr + t * wi
          imag[i + j + len / 2] = v - s * wi - t * wr
          
          const tempWr = wr * wreal - wi * wimag
          wi = wr * wimag + wi * wreal
          wr = tempWr
        }
      }
    }
  }
}

registerProcessor('audio-analyzer-processor', AudioAnalyzerProcessor)