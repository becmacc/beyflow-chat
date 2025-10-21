# BeyFlow Chat - Visual Workflow Automation Platform

## Overview
BeyFlow Chat is a visual workflow automation platform designed for connecting APIs, LLMs, agents, and tools through an intuitive drag-and-drop interface. Built with React 19 and Vite, it sports a cyberpunk-styled Web3 aesthetic featuring neon colors, glitch effects, and smooth animations. The platform enables users to create automation flows using trigger, action, and logic nodes, processing them in topological order, making real API calls (OpenAI, Make.com), and displaying real-time execution progress. It includes a theme persona system for UI customization and emphasizes a dopaminergic, reward-based UI with modular architecture, ready for Web3 integration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 19** and **Vite**, utilizing **Zustand** for state management (with middlewares like `persist` and `immer`). Styling is handled by **TailwindCSS v3**, implementing a cyberpunk/Web3 theme with neon colors, glitch effects, and custom fonts (Inter, Space Grotesk, Orbitron). **Framer Motion v11** provides smooth animations and transitions, while **Three.js** with **React Three Fiber** is used for 3D graphics, including interactive particle systems, holographic AI host, and audio-reactive elements.

### Semantic Color System
Global semantic color modes (neutral, positive, warning, danger) affect the entire application including cursor-reactive lighting, workflow node execution states, and hologram host appearance. Color modes provide visual feedback for system states and user interactions.

### Workflow Builder Module
The visual workflow builder offers a drag-and-drop canvas with 15+ node types categorized into Triggers (ChatGPT, Webhook, Schedule), Actions (Make.com, OpenAI, Gmail), and Logic (Condition, Delay, Filter). It features a functional execution engine that processes nodes, makes real API calls (OpenAI via Replit AI Integrations), displays real-time progress, and provides detailed execution logs. OpenAI integration leverages Replit AI for GPT-4o access, billed via Replit credits.

### Backend Architecture
The system primarily integrates with **Make.com scenarios** via HTTP webhooks. A lightweight parallel automation engine called **Banana Flow** handles event-driven, JSON-based flow configurations with priority-based execution. Data flow follows a pattern where user interactions dispatch actions to Zustand stores, which then trigger side effects and update UI reactively.

### Audio System
**ElevenLabs Text-to-Speech API** is used for voice synthesis with multi-voice support and customizable settings. **Web Speech API** handles voice input and real-time transcription. Advanced audio processing includes custom AudioWorklet processors for low-latency analysis (FFT, RMS, pitch detection) and an audio effects chain.

### Data Storage
Browser storage relies on `localStorage` for persistent settings and `sessionStorage` for temporary data, with Zustand's `persist` middleware synchronizing state.

### Brand Integration System
An organized PNG-based brand system, configured in `src/config/brandConfig.js`, integrates assets as watermarks, floating elements, chat accents, and particle effects with audio-reactive animations.

### Performance Optimization
Vite's esbuild, code splitting, tree shaking, and asset optimization ensure build efficiency. Runtime performance is optimized through event debouncing, animation frame throttling, efficient store subscriptions, and memoization. Custom analytics track user interactions and performance metrics.

### Modular Architecture
The project is organized into `components`, `modules`, `hooks`, `store`, `automation`, `config`, and `utils` directories. Key navigation modules include Chat, Workflows, Sessions, AI Studio (with Omnigen multi-agent system like GPT-Marketer, GPT-Engineer, DALL-E), UI Components (themed sliders, carousels, 3D model viewer, hologram host), and Settings. Minimizable panels provide non-intrusive monitoring of analytics and performance. Media integrations include YouTube Music Player (with background playback) and Instagram Browser (quick-launch with search). Business integrations include WhatsApp Business quick-launcher and Business Calendar (Google Calendar, Outlook). Extension points are planned for Web3 wallet integration and a plugin architecture.

**UI Components Library**: 
- **ThemedSlider**: Accessible range/value slider with Terminal and Glassmorphic theme support
- **ThemedCarousel**: Full-featured slideshow with slide, cube, and fade effects
- **Model3DViewer**: Interactive 3D model viewer with shape and color selectors
- **MotivationalQuote**: Rotating inspirational quotes from corporate, military, existential, tech, and personal growth categories
- **InteractiveLighting**: Cursor-reactive gradient and spotlight effects with semantic color mode support (neutral, positive, warning, danger)
- **HologramHost**: 3D holographic female AI host (ARIA/EVE) with floating animations, voice controls, and color mode responsiveness
- **ColorModeControl**: Global semantic color state switcher affecting entire app theme
- **BusinessCalendar**: Google Calendar and Outlook connector for event management
- **WhatsAppBusiness**: Quick-launch integration for WhatsApp Web with business account connection

## External Dependencies

### Third-Party Services
-   **Make.com**: Primary webhook automation platform for external workflows and integrations (e.g., Gmail).
-   **ElevenLabs**: AI Voice Synthesis API for text-to-speech, requiring `VITE_ELEVEN_API_KEY`.
-   **OpenAI**: Integrated via Replit AI Integrations for GPT-4o access, with charges billed to Replit credits.
-   **Google Gemini**: (Future/Planned) For AI-powered content analysis.

### NPM Dependencies
-   **Core Runtime**: `react`, `react-dom`, `zustand`.
-   **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`.
-   **Styling & UI**: `tailwindcss`, `autoprefixer`, `postcss`, `framer-motion`, `lucide-react`, `clsx`, `swiper`, `react-slider`.
-   **Development Tools**: `vite`, `@vitejs/plugin-react`, `eslint`.

### Browser APIs
-   **Web Audio API**: For advanced audio processing, analysis, and effects.
-   **Web Speech API**: For voice input and speech recognition.
-   **Storage APIs**: `localStorage` and `sessionStorage`.
-   **Media APIs**: `MediaStream`, `Blob API`, `URL.createObjectURL`.

### Configuration Requirements
-   **Environment Variables**: `VITE_ELEVEN_API_KEY` and webhook URLs, typically managed via a `.env` file and Replit Secrets.
-   **Replit Configuration**: Node.js runtime, dev server on port 5000, auto-install dependencies.
-   **Build Configuration**: Vite, TailwindCSS, ESLint, and PostCSS configurations.