import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Box, Environment, Float } from "@react-three/drei"
import { Suspense, useEffect } from "react"
import useStore from "./store"
import { PerformancePanel } from "./components/PerformanceMonitor"
import ChatPanel from "./modules/ChatPanel"
import Sidebar from "./modules/Sidebar"
import Visualizer3D from "./modules/Visualizer3D"
import SessionManager from "./modules/SessionManager"
import AIStudio from "./modules/AIStudio"
import WorkflowBuilder from "./modules/WorkflowBuilder"
import UIShowcase from "./modules/UIShowcase"
import { GradientBackground, RecursivePattern } from "./components/DopamineUI"
import FluidGradientBg from "./components/FluidGradientBg"
import MeshGradient from "./components/MeshGradient"
import { 
  BrandWatermark, 
  FloatingBrandElements, 
  BackgroundBrandLayer, 
  BrandParticles 
} from "./components/BrandAssets"
import { BananaFlowStatus, useBananaFlow } from "./automation/BananaFlowIntegration"
import { brandAssets, brandConfig } from "./config/brandConfig"
import { recursivePattern, createDopamineColors } from "./utils"
import ErrorBoundary from "./components/ErrorBoundary"
import MinimizablePanel from "./components/MinimizablePanel"
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { useAnalytics } from "./hooks/useAnalytics"
import { useAdvancedAudio } from "./hooks/useAdvancedAudio"
import OptimizedScene from "./components/OptimizedScene"
import ThemeToggle from "./components/ThemeToggle"
import YouTubeMusicPlayer from "./components/YouTubeMusicPlayer"
import InstagramBrowser from "./components/InstagramBrowser"
import MotivationalQuote from "./components/MotivationalQuote"
import InteractiveLighting from "./components/InteractiveLighting"
import HologramHost from "./components/HologramHost"
import { getTheme } from "./config/themes"

// 3D Scene Component with enhanced dopamine visuals
function Scene({ audioData }) {
  const { sceneConfig, ui, audio } = useStore()
  const colors = createDopamineColors(ui.gradientShift)
  const pattern = recursivePattern(ui.patternDepth)
  
  return (
    <Suspense fallback={null}>
      <OptimizedScene audioData={audioData} />
    </Suspense>
  )
}

// Module Router
function ModuleRouter() {
  const { currentModule } = useStore()
  
  const modules = {
    chat: <ChatPanel />,
    workflows: <WorkflowBuilder />,
    sessions: <SessionManager />,
    visualizer: <Visualizer3D />,
    ai: <AIStudio />,
    ui: <UIShowcase />,
    settings: <div className="p-8 text-white">Settings Module</div>
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentModule}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-hidden"
      >
        {modules[currentModule] || modules.chat}
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  const { ui, audio, themePersona } = useStore()
  const theme = getTheme(themePersona)
  const bananaFlow = useBananaFlow()
  const { trackEvent, insights } = useAnalytics()
  const audioData = useAdvancedAudio()
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()
  
  // Track app initialization
  useEffect(() => {
    trackEvent('app_initialized', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
    
    // Track performance metrics
    const trackPerformance = () => {
      trackEvent('performance_metrics', {
        feature: 'app_performance',
        loadTime: performance.now(),
        memoryUsage: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        } : null
      })
    }
    
    // Track after initial render
    setTimeout(trackPerformance, 1000)
  }, [trackEvent])
  
  return (
    <ErrorBoundary>
      <div className={`h-screen overflow-hidden relative ${theme.colors.bgGradient}`}>
      {/* Interactive Lighting Layer */}
      <InteractiveLighting />
      
      {/* Background Layers - adapt to theme */}
      {theme.effects.scanlines && <FluidGradientBg />}
      {theme.effects.grid && <MeshGradient />}
      
      {/* Glassmorphic background */}
      {theme.id === 'glassmorphic' && (
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900" />
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 40% 80%, rgba(34, 211, 238, 0.3) 0%, transparent 50%)`
            }}
          />
        </div>
      )}
      
      {/* Brand Watermark */}
      {brandConfig.watermark.enabled && (
        <BrandWatermark 
          logoSrc={brandAssets.beyMediaLogo}
          position={brandConfig.watermark.position}
          opacity={brandConfig.watermark.opacity}
          rotateWithAudio={brandConfig.watermark.rotateWithAudio}
          scale={brandConfig.watermark.scale}
          pulseWithReward={brandConfig.watermark.pulseWithReward}
        />
      )}
      
      {/* Removed 3D - pure cyberpunk doesn't need it */}

      
      {/* Main UI */}
      <div className="relative z-10 flex h-full">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar - adapts to theme */}
          <div className={`h-12 ${theme.colors.bg} border-b ${theme.colors.border} flex items-center justify-between px-6`}>
            <div className="flex items-center space-x-3">
              <img 
                src={brandAssets.beyMediaLogo} 
                alt="BeyMedia" 
                className="w-6 h-6 object-contain opacity-30"
              />
              <h1 className={`text-sm ${theme.font} ${theme.colors.textMuted}`}>
                beyflow_chat
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className={`flex items-center space-x-3 text-xs ${theme.font} ${theme.colors.textMuted}`}>
                {audio.isListening && <span>[REC]</span>}
                {audio.playing && <span>[PLAY]</span>}
              </div>
            </div>
          </div>
          
          {/* Module Content */}
          <ModuleRouter />
        </div>
      </div>
      
      
      {/* Smaller particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Dopamine gradient pulse overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(76, 195, 217, 0.1), transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Banana Flow Status Indicator */}
      <BananaFlowStatus />
      
      {/* Minimizable Analytics Display */}
      {import.meta.env.DEV && insights && (
        <MinimizablePanel title="LIVE" position="top-right">
          <div className="space-y-0.5 font-mono">
            <div className="flex justify-between gap-2"><span className="text-gray-500">USR</span> <span className="text-neon-green">{insights.realTimeData?.activeUsers || 0}</span></div>
            <div className="flex justify-between gap-2"><span className="text-gray-500">MSG</span> <span className="text-neon-cyan">{insights.realTimeData?.messagesPerMinute || 0}</span></div>
            <div className="flex justify-between gap-2"><span className="text-gray-500">ERR</span> <span className="text-neon-magenta">{(insights.realTimeData?.errorRate || 0).toFixed(1)}%</span></div>
          </div>
        </MinimizablePanel>
      )}
      
      {/* Minimizable Performance Monitor */}
      {import.meta.env.DEV && (
        <MinimizablePanel title="Performance" position="bottom-right" defaultMinimized={true}>
          <PerformancePanel isVisible={true} position="bottom-right" />
        </MinimizablePanel>
      )}
      
      {/* YouTube Music Player */}
      <YouTubeMusicPlayer />
      
      {/* Instagram Browser */}
      <InstagramBrowser />
      
      {/* Motivational Quote */}
      <div className="fixed top-20 right-4 max-w-xs z-10">
        <MotivationalQuote />
      </div>
      
      {/* Hologram Host */}
      <HologramHost />
    </div>
    </ErrorBoundary>
  )
}

export default App
