# 🚀 BeyFlow Chat - Advanced 3D Web3 Chat Experience

> The most dopaminergic, web3-ready chat application with cutting-edge 3D visuals and AI integration.

![BeyFlow Chat](https://img.shields.io/badge/BeyFlow-Chat-purple?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D-blue?style=for-the-badge)
![Web Audio](https://img.shields.io/badge/Web%20Audio-API-green?style=for-the-badge)

A production-ready chat application built with React 19, Three.js, and advanced web technologies. Features enterprise-grade audio processing, real-time analytics, performance monitoring, and seamless brand integration.

## ✨ Features

- **3D Interactive Environment** - Immersive Three.js backgrounds with React Three Fiber
- **Voice Interactions** - ElevenLabs TTS + Web Speech API for natural conversations
- **Dopaminergic UI** - Reward-based interface patterns with smooth animations
- **Advanced Analytics** - Real-time user behavior tracking and insights
- **Session Management** - Persistent chat sessions with cloud sync
- **AI Studio** - Creative workspace for AI-powered content generation
- **Brand Integration** - Subtle PNG overlay system for company branding

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Styling**: TailwindCSS with custom dopamine theme
- **State Management**: Zustand
- **Audio**: ElevenLabs TTS + Web Speech API
- **Integrations**: Make.com webhooks

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/bec_macc/beyflow-chat.git
cd beyflow-chat
```

2. Install dependencies:
```bash
npm install
```

3. Add your brand assets:
   - Place PNG files in `public/brand/` directory
   - Update paths in `src/config/brandConfig.js`

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. Start development server:
```bash
npm run dev
```

## 🎨 Brand Asset Integration

The app includes a sophisticated brand integration system:

1. **Add PNG Files** to `public/brand/`:
   - `logo.png` - Main company logo
   - `pattern.png` - Brand patterns/textures
   - `icon.png` - Small icons/symbols
   - `accent.png` - Accent elements

2. **Configure Integration** in `src/config/brandConfig.js`:
   - Adjust opacity levels (0.02-0.08)
   - Position watermarks and overlays
   - Enable/disable different brand elements

3. **Brand Components Available**:
   - `BrandWatermark` - Subtle corner watermarks
   - `FloatingBrandElements` - Animated floating logos
   - `BackgroundBrandLayer` - Texture overlays
   - `BrandParticles` - Interactive particle systems

## 🎮 Usage

### Chat Interface
- Send messages with voice or text
- Experience 3D reactive backgrounds
- Enjoy dopaminergic reward animations

### AI Studio
- Generate creative content
- Collaborative AI workspace
- Advanced prompt engineering

### Session Management
- Auto-save conversations
- Cloud synchronization
- Session analytics

## ⚙️ Configuration

### Audio Settings
Configure voice interactions in `src/modules/audioAPI.js`:
- ElevenLabs API key
- Voice selection
- Speech recognition settings

### Brand Configuration
Customize brand integration in `src/config/brandConfig.js`:
- Opacity levels
- Animation styles
- Positioning rules

### UI Themes
Modify dopaminergic colors in `tailwind.config.js`:
- Reward colors
- Transition timings
- Animation curves

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/         # Reusable UI components
├── modules/           # Feature modules
├── config/            # Configuration files
├── store.js          # Global state management
└── App.jsx           # Main application

public/
├── brand/            # Brand asset directory
└── assets/           # Static assets
```

## 🌟 Brand Integration Examples

### Subtle Watermark
```jsx
<BrandWatermark 
  logoSrc="/brand/logo.png"
  position="bottom-right"
  opacity={0.03}
/>
```

### Floating Elements
```jsx
<FloatingBrandElements 
  images={['/brand/logo.png', '/brand/icon.png']}
  count={3}
  opacity={0.05}
/>
```

### Background Texture
```jsx
<BackgroundBrandLayer 
  patternSrc="/brand/pattern.png"
  opacity={0.02}
/>
```

## 🚀 Deployment

### Replit Ready
This project is optimized for Replit deployment:
1. Import project to Replit
2. Install dependencies automatically
3. Add environment variables
4. Click "Run"

### Production Build
```bash
npm run build
npm run preview
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

**Ready for your brand assets!** 🎨
Add your PNG files to `public/brand/` and watch them integrate seamlessly with the dopaminergic experience.
