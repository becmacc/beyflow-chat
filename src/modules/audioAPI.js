// Audio API integration for BeyFlow Chat
export async function generateSpeech(text, voice = "Rachel") {
  // Note: In Replit, set ELEVEN_API_KEY in Secrets
  const apiKey = import.meta.env.VITE_ELEVEN_API_KEY;
  
  if (!apiKey) {
    console.warn('ElevenLabs API key not found. Audio synthesis disabled.');
    return null;
  }

  try {
    const voiceId = getVoiceId(voice);
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        text: text.substring(0, 500), // Limit text length
        model_id: "eleven_multilingual_v2",
        voice_settings: { 
          stability: 0.5, 
          similarity_boost: 0.8,
          style: 0.3,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Speech generation failed:', error);
    return null;
  }
}

function getVoiceId(voice) {
  const voices = {
    "Rachel": "21m00Tcm4TlvDq8ikWAM",
    "Drew": "29vD33N1CtxCmqQRPOHJ", 
    "Clyde": "2EiwWnXFnvU5JabPnv8n",
    "Dave": "CYw3kZ02Hs0563khs1Fj",
    "Fin": "D38z5RcWu1voky8WS1ja",
    "Sarah": "EXAVITQu4vr4xnSDxMaL",
    "Antoni": "ErXwobaYiN019PkySvjV",
    "Thomas": "GBv7mTt0atIp3Br8iCZE"
  };
  return voices[voice] || voices["Rachel"];
}

// Speech-to-Text using Web Speech API
export function startListening(onResult, onError = () => {}) {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition not supported');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log('Voice recognition started');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    onResult(transcript, confidence);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    console.log('Voice recognition ended');
  };

  recognition.start();
  return recognition;
}

// Audio utilities
export function createAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
}

export function analyzeAudioFrequency(audioElement, callback) {
  const audioContext = createAudioContext();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audioElement);
  
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function analyze() {
    analyser.getByteFrequencyData(dataArray);
    callback(dataArray);
    requestAnimationFrame(analyze);
  }
  
  analyze();
  return { audioContext, analyser };
}

// Voice commands processor
export function processVoiceCommand(transcript) {
  const command = transcript.toLowerCase().trim();
  
  // Define voice commands
  const commands = {
    'clear chat': () => ({ action: 'clear_chat' }),
    'new session': () => ({ action: 'new_session' }),
    'save session': () => ({ action: 'save_session' }),
    'change voice': () => ({ action: 'change_voice' }),
    'mute audio': () => ({ action: 'mute_audio' }),
    'unmute audio': () => ({ action: 'unmute_audio' }),
    'show visualizer': () => ({ action: 'show_module', module: 'visualizer' }),
    'show chat': () => ({ action: 'show_module', module: 'chat' }),
    'show ai studio': () => ({ action: 'show_module', module: 'ai' })
  };

  // Check for exact matches
  if (commands[command]) {
    return commands[command]();
  }

  // Check for partial matches
  for (const [key, handler] of Object.entries(commands)) {
    if (command.includes(key.split(' ')[0])) {
      return handler();
    }
  }

  // Default: treat as message
  return { action: 'send_message', message: transcript };
}