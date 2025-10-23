# BeyFlow Chat — Replit Optimized

## 💡 Purpose
This repo is pre-configured for one-click Replit builds.

### ✅ Agent Workflow
1. Uses `npm ci --prefer-offline --no-audit`
2. Builds via `vite build`
3. Stops automatically after build

### 🧰 Manual Commands
```bash
npm ci --prefer-offline --no-audit
npm run build
npm run dev
```

### 🧩 Environment
- Node 18+
- React 18 / Vite 7
- ESLint 9 / Prettier 3
- Three.js 163
- Zustand 4
- Framer Motion 11

### 🚀 Quick Start
1. Import to Replit
2. Click "Run" - builds automatically
3. Use "Start Dev" for development mode

### 📦 Optimizations
- Cached dependencies with `.npmrc`
- Minimal scripts (dev/build/preview only)
- Grouped dependencies by function
- Clean directory structure
- PWA + compression enabled

---

## Original Project Information

### 💬 AI Chat Interface
- **OpenAI Integration** - Powered by GPT-4o with multiple specialized agents
- **Voice Capabilities** - ElevenLabs TTS and Web Speech API for natural voice interactions
- **Real-time Messaging** - Instant responses with typing indicators and smooth animations
- **Session Management** - Save, load, and manage conversation sessions

### 🧠 AI Studio
- **Multiple AI Agents** - Omnigen orchestrator, GPT-Marketer, GPT-Engineer, and DALL-E
- **3D Agent Visualization** - Interactive 3D hierarchy display
- **Specialized Workflows** - Tailored system prompts for marketing, engineering, and creative tasks

### 🔄 Workflow Builder
- **Visual Automation** - Drag-and-drop interface for creating workflows
- **Rich Node Library**:
  - **Triggers**: ChatGPT, Webhook, Schedule, Chat Message
  - **Actions**: Make.com, OpenAI, Omnigen, Gmail, Notion, Google Sheets, Discord, Twilio
  - **Logic**: Conditions, Delays, Filters, Transformations
- **Real-time Execution** - Live workflow testing with execution logs
- **Integration Ready** - Connect with Make.com and other automation platforms

### 📊 Workspace
- **Modular Dashboard** - Add and arrange multiple workspace modules
- **Available Modules**:
  - **Notes** - Rich text note-taking
  - **Analytics** - Real-time performance insights
  - **Code Editor** - Integrated code editing
  - **Terminal** - Command-line access
  - **Web3 Wallet** - Cryptocurrency wallet integration
- **Workspace Management** - Save, load, import, and export configurations

### 🎯 WidgetHub
All-in-one panel with essential tools:
- **Analytics Dashboard** - Message counts, session time, and response metrics
- **YouTube Player** - Background music with playback controls
- **Social Media Hub** - Quick launchers for Instagram, Pinterest, WhatsApp Web
- **Business Calendar** - Schedule and event management
- **Mini Browser** - In-app web browsing with bookmarks

### 🌐 Browser Capabilities
- **WebBrowser Module** - Full-featured in-app browser with navigation, bookmarks, and history
- **FloatingBrowser** - Draggable, resizable browser overlay
- **Split-Screen Mode** - Browse documentation alongside workflows

### 🎨 3D Visuals & Effects
- **Three.js Integration** - Immersive 3D backgrounds with React Three Fiber
- **Interactive Lighting** - Dynamic lighting that responds to user interactions
- **Audio-Reactive Visuals** - 3D scenes that pulse with audio
- **Multiple Themes** - Terminal and Glassmorphic themes
- **Fluid Gradients** - Animated mesh gradients and fluid backgrounds

### 📞 Contacts Hub
- **Contact Management** - Organize and manage contacts
- **Integration Ready** - Connect with CRM and communication platforms

### ⚡ Performance & Analytics
- **Real-time Monitoring** - FPS, memory usage, and performance metrics
- **User Analytics** - Track events, interactions, and engagement
- **Error Tracking** - Comprehensive error monitoring and reporting
- **Performance Optimization** - Optimized 3D rendering and lazy loading

### 🎹 Keyboard Shortcuts
- **Comprehensive Shortcuts** - Navigate and control the app entirely from keyboard
- **Categories**: Chat, Audio, Navigation, UI controls
- **Customizable** - Shortcuts help modal with `Cmd/Ctrl + /`

### 🎨 Brand Integration System
- **Seamless Branding** - Integrate brand assets with configurable opacity
- **Multiple Components**: Watermarks, floating elements, background layers, particles
- **Non-intrusive** - Subtle integration that enhances rather than distracts

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Zustand** - Lightweight state management

### UI & Styling
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Custom Themes** - Terminal and Glassmorphic UI themes

### 3D Graphics
- **Three.js** - WebGL 3D library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber

### AI & Integrations
- **OpenAI API** - GPT-4o chat completions
- **ElevenLabs** - Text-to-speech voice generation
- **Web Speech API** - Browser-native voice recognition
- **Make.com** - Workflow automation webhooks

### Audio
- **Web Audio API** - Advanced audio processing and analysis
- **Custom Audio Hooks** - Frequency analysis and visualization

## 📦 Installation

### Clone the Repository
```bash
git clone https://github.com/yourusername/beyflow-chat.git
cd beyflow-chat
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory:
```env
# OpenAI API (handled by Replit integration)
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key
AI_INTEGRATIONS_OPENAI_BASE_URL=https://api.openai.com/v1

# ElevenLabs API (optional, for voice features)
VITE_ELEVEN_API_KEY=your_elevenlabs_api_key

# Make.com Webhook (optional, for workflow automation)
VITE_MAKE_WEBHOOK_URL=your_make_webhook_url
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 🚀 Deploy on Replit

This project is optimized for Replit deployment:

1. **Import to Replit**: Click "Import from GitHub" and paste the repository URL
2. **Install Dependencies**: Replit will automatically run `npm install`
3. **Set Up Integrations**: Configure OpenAI integration in the Replit secrets/integrations panel
4. **Add Environment Variables**: Set `VITE_ELEVEN_API_KEY` in Replit Secrets if using voice features
5. **Run**: Click the "Run" button - the app will start on port 5000

[![Run on Replit](https://replit.com/badge/github/yourusername/beyflow-chat)](https://replit.com/@yourusername/beyflow-chat)

## 🎯 Usage

### Quick Start Guide

1. **Chat**: Start chatting with AI using text or voice input
2. **Switch Modules**: Use the sidebar to navigate between Chat, AI Studio, Workflows, Workspace, etc.
3. **Build Workflows**: Open the Workflow Builder to create automation flows
4. **Customize Workspace**: Add modules to your workspace and arrange them as needed
5. **Access Widgets**: Click the WidgetHub to access analytics, YouTube player, and more
6. **Keyboard Shortcuts**: Press `Cmd/Ctrl + /` to view all keyboard shortcuts

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Enter` | Send message |
| `Cmd/Ctrl + K` | Clear chat |
| `Cmd/Ctrl + N` | New chat |
| `Cmd/Ctrl + 1-4` | Switch modules |
| `Cmd/Ctrl + M` | Toggle mute |
| `Cmd/Ctrl + /` | Show shortcuts |
| `Escape` | Close panels |

## 📁 Project Structure

```
beyflow-chat/
├── public/
│   ├── brand/              # Brand assets (logos, patterns)
│   └── audio-processor.js  # Web Audio processor
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── WidgetHub.jsx
│   │   ├── FloatingBrowser.jsx
│   │   ├── BrandAssets.jsx
│   │   └── ...
│   ├── modules/           # Feature modules
│   │   ├── ChatPanel.jsx
│   │   ├── WorkflowBuilder.jsx
│   │   ├── Workspace.jsx
│   │   ├── AIStudio.jsx
│   │   └── ...
│   ├── automation/        # Workflow automation
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── docs/                 # Documentation
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Screenshots & Demo

_Screenshots coming soon! Feel free to add screenshots of your BeyFlow Chat instance here._

**Suggested screenshots:**
- Main chat interface with 3D background
- Workflow Builder with connected nodes
- Workspace with multiple modules
- AI Studio with agent selection
- WidgetHub panel open

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** - For the GPT-4o API
- **ElevenLabs** - For text-to-speech capabilities
- **Three.js** - For amazing 3D graphics
- **Replit** - For providing an excellent development and deployment platform
- **React Team** - For React 19 and concurrent features

## 📞 Support

For support, please open an issue in the GitHub repository or reach out via the discussions tab.

---

**Built with ❤️ using React, Three.js, and modern web technologies**
