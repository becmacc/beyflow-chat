# BeyFlow Chat - Visual Workflow Automation Platform

## Overview
BeyFlow Chat is a visual workflow automation platform for connecting APIs, LLMs, agents, and tools via a drag-and-drop interface. It enables users to create and execute automation flows using trigger, action, and logic nodes, processing real API calls (OpenAI, Make.com), and displaying real-time execution. The platform features a cyberpunk-styled Web3 aesthetic, a theme persona system for UI customization, and a modular architecture designed for a dopaminergic, reward-based user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
Built with React 19 and Vite, the frontend uses Zustand for state management (with `persist` and `immer` middlewares). Styling is handled by TailwindCSS v3, implementing a cyberpunk/Web3 theme with neon colors and custom fonts. Framer Motion v11 provides smooth animations. A semantic color system dynamically changes UI elements (gradients, lights, node states) based on global modes (neutral, positive, warning, danger).

### Workflow Builder Module
The visual workflow builder offers a drag-and-drop canvas with over 15 node types (Triggers, Actions, Logic). It includes a functional execution engine for processing nodes, making real API calls (OpenAI via Replit AI Integrations), and displaying real-time progress and logs.

### Backend Architecture
The system integrates with Make.com scenarios via HTTP webhooks. A lightweight parallel automation engine, Banana Flow, handles event-driven, JSON-based flow configurations with priority-based execution.

### Audio System
ElevenLabs Text-to-Speech API provides voice synthesis, while the Web Speech API handles voice input and real-time transcription. Advanced audio processing includes custom AudioWorklet processors for low-latency analysis and an audio effects chain.

### Data Storage
Browser storage utilizes `localStorage` for persistent settings and `sessionStorage` for temporary data, with Zustand's `persist` middleware. Contacts and workspace data are managed via dedicated Zustand slices, seeded from JSON files.

### Modular Architecture
The project is organized into `components`, `modules`, `hooks`, `store`, `automation`, `config`, and `utils`. Key modules include:
- **Chat**: AI-powered conversation.
- **Contacts Hub**: CRM with search and quick actions.
- **Workspace**: MGX-style modular dashboard with a customizable grid layout, supporting Notes, Analytics, Code Editor, Terminal, and Web3 Wallet modules. Features include save/load configurations, export/import JSON, module sizing, and localStorage persistence.
- **Workflows**: Visual node-based automation builder.
- **Web Browser**: An iframe-based mini browser with URL input, navigation controls, persistent bookmarks, and a split-view mode for simultaneous workflow building and documentation browsing. It can be used as a draggable, resizable floating overlay or integrated into a split-screen layout.
- **Sessions**: Saved conversation management.
- **AI Studio**: Multi-agent system (GPT-Marketer, GPT-Engineer, DALL-E).
- **UI Components**: Themed sliders, carousels, 3D model viewer, hologram host, and a global ColorModeControl.
- **Settings**: Configuration management.
- **WidgetHub**: Consolidates all floating widgets into a single minimizable panel with tabs for Analytics, YouTube (background playback), Social (launchers), Utilities (Calendar + Social Hub), and Browser.

## External Dependencies

### Third-Party Services
-   **Make.com**: Primary webhook automation platform for external workflows.
-   **ElevenLabs**: AI Voice Synthesis API.
-   **OpenAI**: Integrated via Replit AI Integrations for GPT-4o access.

### NPM Dependencies
-   **Core Runtime**: `react`, `react-dom`, `zustand`.
-   **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`.
-   **Styling & UI**: `tailwindcss`, `autoprefixer`, `postcss`, `framer-motion`, `lucide-react`, `clsx`, `swiper`, `react-slider`.

### Browser APIs
-   **Web Audio API**: For audio processing and effects.
-   **Web Speech API**: For voice input and speech recognition.
-   **Storage APIs**: `localStorage` and `sessionStorage`.

### Configuration Requirements
-   **Environment Variables**: `VITE_ELEVEN_API_KEY` and webhook URLs.
-   **Replit Configuration**: Node.js runtime, dev server on port 5000.