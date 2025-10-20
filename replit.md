# BeyFlow Chat - Visual Workflow Automation Platform

## Overview

BeyFlow Chat has evolved into a visual workflow automation platform where users can connect APIs (ChatGPT, Make.com scenarios), LLMs, agents, and tools together through an intuitive drag-and-drop interface. Built with React 19 and Vite, it features a cyberpunk-styled Web3 aesthetic with neon colors, glitch effects, and smooth animations.

The platform includes a fully functional visual workflow builder that lets users create automation flows by connecting trigger nodes (ChatGPT, webhooks, schedules), action nodes (Make.com, OpenAI, Gmail, Discord, Twilio), and logic nodes (conditions, delays, filters). The workflow execution engine processes nodes in topological order, makes real API calls to OpenAI (via Replit AI integration) and Make.com webhooks, and displays real-time execution progress with visual node highlighting and detailed logging.

The application features a **theme persona system** allowing users to switch between different UI aesthetics:
- **Terminal Hacker**: Dark cyberpunk with monospace fonts, minimal cyan accents, pure black backgrounds
- **Glassmorphic Modern**: Colorful gradient backgrounds, frosted glass effects, rounded corners, soft shadows

The app emphasizes a dopaminergic, reward-based UI with minimizable panels for performance monitoring and analytics, and a modular architecture ready for Web3 integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Framework**: React 19 with Vite as the build tool and development server
- Fast refresh for instant updates during development
- ESBuild for optimized production builds
- JSX files treated as JavaScript modules with automatic transformation

**State Management**: Zustand with advanced middleware stack
- Multiple specialized stores (audio, chat, UI) for separation of concerns
- `subscribeWithSelector` middleware for granular subscriptions
- `devtools` middleware for Redux DevTools integration
- `persist` middleware for localStorage synchronization
- `immer` middleware for immutable state updates with mutable syntax
- Legacy store bridge for backward compatibility during migration

**Styling System**: TailwindCSS v3 with cyberpunk/Web3 theme
- Neon color palette: neon-cyan (#00F0FF), neon-magenta (#FF00FF), neon-green (#00FF41)
- Cyberpunk effects: scanlines, glitch effects, tech-focused grid backgrounds
- Custom animations (float, pulse-slow, bounce-slow) for dopaminergic effects
- Glassmorphism design patterns with backdrop blur utilities (cyber-card class)
- Custom scrollbar styling with neon accents
- Google Fonts integration (Inter, Space Grotesk, Orbitron for tech text)
- Shadow effects with neon glow (shadow-neon-cyan, shadow-neon-magenta)

**Animation Framework**: Framer Motion v11
- Smooth page transitions and component animations
- Physics-based spring animations
- Gesture-based interactions
- Exit animations for component unmounting

**3D Graphics**: Three.js with React Three Fiber ecosystem
- `@react-three/fiber` for declarative Three.js in React
- `@react-three/drei` for helper components and abstractions
- Interactive particle systems with recursive patterns
- Audio-reactive lighting and transformations
- Orbit controls with auto-rotation capabilities

### Workflow Builder Module

**Visual Workflow Canvas**: Drag-and-drop node-based automation designer with real execution
- 15+ pre-configured node types across 3 categories (triggers, actions, logic)
- Drag-and-drop positioning with smooth Framer Motion animations
- Visual connection lines with gradient effects between nodes
- Real-time workflow validation and connection management
- Node palette sidebar with searchable, categorized nodes
- Fully functional execution engine that:
  - Builds topological execution order from node graph
  - Executes nodes sequentially with data flow between nodes
  - Makes real API calls (OpenAI GPT-4, Make.com webhooks)
  - Shows real-time progress with node highlighting during execution
  - Displays detailed execution log with success/error states
  - Returns complete execution results with all node outputs

**Node Categories**:
1. **Triggers**: ChatGPT, Webhook, Schedule, Chat Message
2. **Actions**: Make.com, OpenAI, Gmail, Notion, Google Sheets, Discord, Twilio
3. **Logic**: Condition (if/then/else), Delay, Filter, Transform

**OpenAI Integration**: Via Replit AI Integrations (no API key needed)
- Charges billed directly to Replit credits
- Environment variables auto-configured: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
- Exposed to client-side via Vite define config for browser access
- GPT-4o model access through standardized OpenAI SDK
- Used in workflow execution for OpenAI action nodes
- Returns full completion responses with usage metrics

### Backend Architecture

**API Integration Pattern**: Webhook-based architecture
- Primary integration with Make.com scenarios via HTTP webhooks
- Default webhook endpoint: `https://hook.eu2.make.com/8n2onkq2qybp58ugij473e7ekvex`
- Centralized API module (`src/modules/api.js`) for all external calls
- Response time tracking and analytics built into API layer
- Retry logic and error handling for resilient communication

**Automation System (Banana Flow)**: Lightweight parallel automation engine
- Event-driven architecture with trigger-action mapping
- JSON-based flow configuration (`batch_sequences.json`)
- Priority-based execution (high/medium/low)
- Configurable delays to manage system load
- Active sequence tracking with cleanup handlers
- Six pre-configured flows: ChatToGmailSync, VoiceFeedbackLoop, GeminiAssist, BrandAssetReaction, SessionAnalytics, ImageGenerationPrep

**Data Flow Pattern**:
1. User interaction → UI component
2. Component dispatches action to Zustand store
3. Store updates trigger side effects (webhooks, audio, animations)
4. Webhook responses update store state
5. UI reactively renders based on state changes

### Audio System

**Voice Synthesis**: ElevenLabs Text-to-Speech API
- Multi-voice support (Rachel, Drew, Clyde)
- Multilingual model with voice settings customization
- Stability, similarity boost, and speaker boost parameters
- Text truncation to 500 characters for API limits
- Blob-based audio URL generation for playback

**Voice Input**: Web Speech API integration
- Browser-native speech recognition
- Voice command processing
- Real-time transcription for chat input

**Advanced Audio Processing**:
- Custom AudioWorklet processor for low-latency analysis
- FFT (Fast Fourier Transform) for frequency analysis
- RMS (Root Mean Square) volume calculation
- Pitch detection algorithms
- Real-time audio feature extraction (frequency, waveform, tempo, key)
- Audio effects chain (reverb, delay, distortion, filters, compression)
- Visualization modes (spectrum, waveform)

### Data Storage

**Browser Storage Strategy**:
- localStorage for persistent user preferences and settings
- sessionStorage for temporary session data
- Zustand persist middleware for automatic state synchronization
- Session management with save/load capabilities
- Chat history persistence across page refreshes

**State Schema**:
```javascript
{
  user: string,
  messages: array<{id, from, msg, time, type}>,
  ui: {theme, gradientShift, sliderValue, patternDepth},
  audio: {playing, volume, isListening, audioUrl},
  sceneConfig: {particleCount, rotation, color},
  analytics: {messageCount, responseTime, sessionStart}
}
```

### Brand Integration System

**Asset Management**: Organized PNG-based brand system
- Centralized configuration in `src/config/brandConfig.js`
- Nine brand assets organized in `/public/brand/` directory
- BeyMedia logo as primary watermark element
- Ultra-subtle opacity levels (2-8%) for non-intrusive branding
- Audio-reactive animations synchronized with voice interactions
- Multiple integration points: watermarks, floating elements, chat accents, particles, sidebar

**Visual Integration Strategy**:
- Background patterns with 30-second alternation
- Center-positioned watermark with 4% opacity
- Floating brand elements with gentle dopaminergic animations
- Particle effects using brand assets
- Blend modes (overlay) for seamless integration
- Scale differentiation (BeyMedia logo 1.1x larger)

### Performance Optimization

**Build Optimization**:
- Vite's esbuild for fast bundling
- Code splitting with dynamic imports
- Tree shaking for unused code elimination
- Asset optimization and compression

**Runtime Performance**:
- Event debouncing for expensive operations
- Animation frame throttling for 3D rendering
- Efficient store subscriptions with selectors
- Memoization of expensive computations
- Lazy loading of heavy modules

**Analytics & Monitoring**:
- Custom analytics engine tracking user interactions
- Real-time metrics (active users, messages per minute, response time, error rate)
- Session tracking with unique IDs
- Performance metrics collection (viewport, user agent, timing data)
- Event buffering (last 1000 events in memory)

### Modular Architecture

**Component Organization**:
- `/src/components/` - Reusable UI components (BrandAssets, MinimizablePanel, AudioComponents, DopamineUI)
- `/src/modules/` - Feature modules (ChatPanel, WorkflowBuilder, Visualizer3D, AIStudio, SessionManager)
- `/src/hooks/` - Custom React hooks (useAdvancedAudio, useAnalytics, useKeyboardShortcuts, useWebhook, useWeb3)
- `/src/store/` - State management with multiple specialized stores
- `/src/automation/` - Banana Flow automation system
- `/src/config/` - Configuration files (brand assets, API endpoints)
- `/src/utils/` - Utility functions (patterns, gradients, particles, color interpolation)

**Navigation Modules**:
1. **Chat** - Real-time messaging with AI
2. **Workflows** - Visual workflow builder (NEW - primary feature)
3. **Sessions** - Saved conversations and session management
4. **AI Studio** - AI playground and experimentation
5. **Settings** - Configuration and preferences

**Minimizable Panels**: Collapsible UI components for non-intrusive monitoring
- `MinimizablePanel` component for analytics and performance displays
- Minimized state shows compact button with icon and title
- Expanded state shows full panel with cyber-card styling
- Positioned at screen corners (top-left, top-right, bottom-left, bottom-right)
- Live Analytics panel (top-right) - minimizable
- Performance Monitor panel (bottom-right) - minimizable, default minimized in dev mode

**Extension Points**:
- Web3 wallet integration hooks (placeholder for MetaMask/WalletConnect)
- 3D avatar identity system (placeholder for blockchain-based avatars)
- Plugin architecture for custom flows in Banana Flow
- Dynamic route registration for runtime automation flows

## External Dependencies

### Third-Party Services

**Make.com**: Webhook automation platform
- Primary integration point for external workflows
- Scenario-based automation triggers
- Gmail and Outlook email integration endpoints
- Custom webhook URLs for different automation flows

**ElevenLabs**: AI Voice Synthesis API
- Text-to-speech conversion with multiple voice options
- Requires API key stored in environment variable `VITE_ELEVEN_API_KEY`
- Audio synthesis endpoint: `https://api.elevenlabs.io/v1/text-to-speech/{voiceId}`
- Returns audio/mpeg format for playback

**AI Providers**:
- **OpenAI**: Via Replit AI Integrations (charges billed to Replit credits, no separate API key needed)
  - Auto-configured environment variables: `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY`
  - OpenAI npm package installed
  - GPT-4/GPT-5 access for AI Studio and workflow nodes
- **Google Gemini** (Future/Planned): AI-powered content analysis

### NPM Dependencies

**Core Runtime**:
- `react@18.3.1` - UI framework
- `react-dom@18.3.1` - DOM rendering
- `zustand@4.5.2` - State management

**3D Graphics**:
- `three@0.163.0` - 3D library
- `@react-three/fiber@8.16.2` - React renderer for Three.js
- `@react-three/drei@9.105.4` - Helper components and abstractions

**Styling & UI**:
- `tailwindcss@3.4.3` - Utility-first CSS framework
- `autoprefixer@10.4.19` - CSS vendor prefixing
- `postcss@8.4.38` - CSS transformation
- `framer-motion@11.1.7` - Animation library
- `lucide-react@0.376.0` - Icon library
- `clsx@2.1.1` - Conditional class name utility

**Development Tools**:
- `vite@7.1.7` - Build tool and dev server
- `@vitejs/plugin-react@5.0.4` - React plugin for Vite
- `eslint@9.36.0` - Code linting
- `eslint-plugin-react-hooks@5.2.0` - React hooks linting
- `eslint-plugin-react-refresh@0.4.22` - Fast refresh linting

### Browser APIs

**Web Audio API**: Advanced audio processing and analysis
- AudioContext for audio graph management
- AnalyserNode for frequency/waveform data
- AudioWorklet for custom low-latency processing
- GainNode for volume control

**Web Speech API**: Voice input and recognition
- SpeechRecognition for voice-to-text
- SpeechSynthesis (fallback option)

**Storage APIs**:
- localStorage for persistent data
- sessionStorage for temporary data

**Media APIs**:
- MediaStream for microphone access
- Blob API for audio file handling
- URL.createObjectURL for audio playback

### Configuration Requirements

**Environment Variables** (via `.env` file):
- `VITE_ELEVEN_API_KEY` - ElevenLabs API key for TTS
- Webhook URLs configured in `src/store.js`
- Future variables for OpenAI, Gemini APIs

**Replit Configuration** (`.replit` file):
- Node.js runtime with npm package manager
- Dev server on port 5000 with host 0.0.0.0
- Auto-install dependencies on startup
- Environment variables via Replit Secrets

**Build Configuration**:
- Vite config for JSX transformation and server settings
- TailwindCSS config with custom theme extensions
- ESLint config for code quality standards
- PostCSS config for CSS processing