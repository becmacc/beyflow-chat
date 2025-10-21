# BeyFlow Chat - Visual Workflow Automation Platform

## Overview
BeyFlow Chat is a visual workflow automation platform designed for connecting APIs, LLMs, agents, and tools through an intuitive drag-and-drop interface. Built with React 19 and Vite, it sports a cyberpunk-styled Web3 aesthetic featuring neon colors, glitch effects, and smooth animations. The platform enables users to create automation flows using trigger, action, and logic nodes, processing them in topological order, making real API calls (OpenAI, Make.com), and displaying real-time execution progress. It includes a theme persona system for UI customization and emphasizes a dopaminergic, reward-based UI with modular architecture, ready for Web3 integration.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Updates (October 21, 2025)

### Web Browser Module (Mini Browser)
- **iframe-based Web Browser**: New module for browsing websites within BeyFlow with URL input, navigation controls, and bookmarking system
- **Floating Browser Window**: Draggable + resizable overlay window (🌐 button in navbar) with 8 resize handles (4 corners + 4 edges), min 400x300px constraints, minimize/maximize controls
- **WorkflowBuilder Split View**: Toggle split-screen mode in Workflows with adjustable vertical divider (30-80% ratio), workflow canvas on left + embedded browser on right for simultaneous API documentation reference
- **Reusable BrowserPanel Component**: Extracted browser UI (URL bar, navigation, bookmarks, iframe) for use in both floating window and inline split-view modes
- **Security Implementation**: Sandboxed iframe with proper `sandbox` attributes (allow-scripts, allow-same-origin, allow-forms, allow-popups)
- **Bookmark Management**: Persistent localStorage-backed bookmarks with add/remove functionality and organized sidebar display
- **Navigation Features**: Back/Forward/Reload/Home buttons with browsing history tracking synchronized with bookmark navigation
- **X-Frame-Options Fallback**: Warning banner and "Open in new tab" button for sites that block iframe embedding
- **Accessibility**: Clear warning messages about security restrictions, proper ARIA labels, 44px touch targets, col-resize cursor on divider

### Spectrum Control System (Dynamic Visual Intensity)
- **Dynamic Spectrum Sliders**: Four controls (Blur, Glow, Color, Speed) that transform UI from "Notion minimal" to "full rave mode"
- **All-particle Control**: 70+ parallax particles across 4 depth layers respond to spectrum settings in real-time
- **UI-wide Impact**: Sliders affect sidebar blur, navbar blur, background gradients, particle animations, glow halos, and color saturation
- **Performance Ranges**: Blur (0-30px), Glow (0-30px halo), Saturation (50-150%), Speed (0.5x-3x animation multiplier)
- **Preset Button**: "🔥 FULL RAVE MODE" instantly maxes all controls for dramatic effect
- **ColorMode Integration**: Bottom-right positioned (Neutral/Positive/Warning/Danger) buttons work alongside spectrum for dual-axis visual control

### UX/UI Polish & Accessibility
- **Reduced Visual Chaos**: Background animations lowered to 50% opacity, speeds doubled for calmer ambience
- **Improved Readability**: Minimum 14px font sizes, enhanced contrast ratios (WCAG AA compliance), dark backdrops behind text on gradients
- **Enhanced Affordances**: All buttons now have visible 2px borders, stronger hover states (brightness +20%, scale 1.05), solid backgrounds on primary CTAs
- **Navigation Labels**: Sidebar items show text labels with descriptions (always visible), active module highlighted with colored border and glow effect
- **Accessibility**: Global focus outlines (2px cyan), 44px minimum touch targets, comprehensive ARIA labels, keyboard navigation support
- **Organized HUD Layout**: Clear z-index hierarchy (FloatingBrowser z-9999, UtilityPanel z-50, ColorModeControl z-40, SpectrumControl z-30) prevents overlapping widgets
- **Consolidated UI**: UtilityPanel combines Calendar and Social Hub into single collapsible interface (bottom-right), reducing floating widget clutter, with glow effect when collapsed
- **Compact Chat**: Welcome banner optimized for space, prominent send button with enhanced visual hierarchy
- **Subtle Effects**: ColorModeControl flash reduced (0.2 opacity, 0.4s duration), repositioned to bottom-center to avoid conflicts

### Modular Workspace System (MGX Integration)
- Transformed Workspace from Notion-style pages to MGX-inspired modular dashboard
- Grid-based layout with add/remove module capability and active module counter
- 5 production-ready modules: Notes (markdown), Analytics (real-time metrics), Code Editor (syntax highlighting), Terminal (shell simulation), Web3 Wallet (portfolio tracker)
- Full persistence layer: Save/Load named workspace configs, Export/Import JSON, localStorage auto-save via Zustand persist middleware
- Module sizing controls (Small/Medium/Large) for customized layouts

## System Architecture

### Frontend Architecture
The frontend is built with **React 19** and **Vite**, utilizing **Zustand** for state management (with middlewares like `persist` and `immer` for localStorage auto-saving). Styling is handled by **TailwindCSS v3**, implementing a cyberpunk/Web3 theme with neon colors, glitch effects, and custom fonts (Inter, Space Grotesk, Orbitron). **Framer Motion v11** provides smooth animations and transitions. Background animations have been carefully tuned to reduce visual chaos while maintaining the cyberpunk aesthetic.

### Semantic Color System
Global semantic color modes (neutral, positive, warning, danger) provide dramatic visual feedback throughout the application. The InteractiveLighting component creates pulsing colored gradients and corner lights that respond to color mode changes: cyan/teal for Neutral, green for Positive, orange for Warning, and red for Danger. These color modes affect cursor-reactive lighting, background atmosphere, workflow node execution states, and hologram host appearance. The ColorModeControl buttons at the top center allow instant switching between modes with immediate, obvious visual changes.

### Workflow Builder Module
The visual workflow builder offers a drag-and-drop canvas with 15+ node types categorized into Triggers (ChatGPT, Webhook, Schedule), Actions (Make.com, OpenAI, Gmail), and Logic (Condition, Delay, Filter). It features a functional execution engine that processes nodes, makes real API calls (OpenAI via Replit AI Integrations), displays real-time progress, and provides detailed execution logs. OpenAI integration leverages Replit AI for GPT-4o access, billed via Replit credits.

### Backend Architecture
The system primarily integrates with **Make.com scenarios** via HTTP webhooks. A lightweight parallel automation engine called **Banana Flow** handles event-driven, JSON-based flow configurations with priority-based execution. Data flow follows a pattern where user interactions dispatch actions to Zustand stores, which then trigger side effects and update UI reactively.

### Audio System
**ElevenLabs Text-to-Speech API** is used for voice synthesis with multi-voice support and customizable settings. **Web Speech API** handles voice input and real-time transcription. Advanced audio processing includes custom AudioWorklet processors for low-latency analysis (FFT, RMS, pitch detection) and an audio effects chain.

### Data Storage
Browser storage relies on `localStorage` for persistent settings and `sessionStorage` for temporary data, with Zustand's `persist` middleware synchronizing state. Contacts and workspace data are seeded from JSON files (`src/data/contacts.json`, `src/data/beyflow.json`) and managed through dedicated Zustand slices.

### Brand Integration System
An organized PNG-based brand system, configured in `src/config/brandConfig.js`, integrates assets as watermarks, floating elements, chat accents, and particle effects with audio-reactive animations.

### Performance Optimization
Vite's esbuild, code splitting, tree shaking, and asset optimization ensure build efficiency. Runtime performance is optimized through event debouncing, animation frame throttling, efficient store subscriptions, and memoization. Custom analytics track user interactions and performance metrics.

### Modular Architecture
The project is organized into `components`, `modules`, `hooks`, `store`, `automation`, `config`, and `utils` directories. Key navigation modules include:
- **Chat**: Real-time AI-powered conversation experience
- **Contacts Hub**: CRM with searchable contacts and quick actions (Email, WhatsApp, LinkedIn, Calendly)
- **Workspace**: MGX-style modular dashboard with customizable grid layout, supporting 5 module types (Notes, Analytics, Code Editor, Terminal, Web3 Wallet). Features save/load workspace configurations, export/import JSON, module sizing (S/M/L), and localStorage persistence via Zustand persist middleware.
- **Workflows**: Visual node-based automation builder
- **Web Browser**: iframe-based mini browser with URL input, navigation controls (Back/Forward/Reload/Home), persistent bookmarks via localStorage, and "Open in new tab" fallback for sites blocking iframe embedding
- **Sessions**: Saved conversation management
- **AI Studio**: Multi-agent system (GPT-Marketer, GPT-Engineer, DALL-E)
- **UI Components**: Themed sliders, carousels, 3D model viewer, hologram host
- **Settings**: Configuration management

**Workspace Modules**: 
- **NotesModule**: Markdown-enabled note taking with live preview and save functionality
- **AnalyticsModule**: Real-time system metrics with message count, session time, response time tracking, and animated bar charts
- **CodeModule**: Multi-language code editor with syntax highlighting (JavaScript, Python, HTML, CSS), line numbers, and copy/run buttons
- **TerminalModule**: Interactive shell simulation with command history, file system navigation (ls, cd, pwd), and utility commands
- **Web3Module**: Crypto wallet interface displaying ETH balance, portfolio value, 24h changes, and recent transaction activity

Minimizable panels provide non-intrusive monitoring of analytics and performance. Media integrations include YouTube Music Player (with background playback) and Instagram Browser (quick-launch with search). Business integrations are consolidated in UtilityPanel (Calendar + Social Hub) positioned bottom-right for reduced UI clutter. Extension points are planned for Web3 wallet integration and a plugin architecture.

**UI Components Library**: 
- **ThemedSlider**: Accessible range/value slider with Terminal and Glassmorphic theme support
- **ThemedCarousel**: Full-featured slideshow with slide, cube, and fade effects
- **Model3DViewer**: Interactive 3D model viewer with shape and color selectors
- **MotivationalQuote**: Rotating inspirational quotes from corporate, military, existential, tech, and personal growth categories
- **InteractiveLighting**: Cursor-reactive gradient and spotlight effects with semantic color mode support (neutral, positive, warning, danger)
- **HologramHost**: 3D holographic female AI host (ARIA/EVE) with floating animations, voice controls, and color mode responsiveness
- **ColorModeControl**: Global semantic color state switcher affecting entire app theme
- **UtilityPanel**: Consolidated floating panel (bottom-right) combining Calendar and Social Hub into tabbed interface, collapsible to minimize UI clutter, includes 44px touch targets and full accessibility support

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