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
import { GradientBackground, RecursivePattern } from "./components/DopamineUI"
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
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts"
import { useAnalytics } from "./hooks/useAnalytics"
import { useAdvancedAudio } from "./hooks/useAdvancedAudio"
import OptimizedScene from "./components/OptimizedScene"

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
    sessions: <SessionManager />,
    visualizer: <Visualizer3D />,
    ai: <AIStudio />,
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
  const { ui, audio } = useStore()
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
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Brand Background Layer (Ultra-faded) */}
            {/* Background Brand Layer */}
      {brandConfig.background.enabled && (
        <BackgroundBrandLayer 
          patternSrc={brandAssets.backgroundPattern}
          patternAltSrc={brandAssets.backgroundPatternAlt}
          opacity={brandConfig.background.intensity}
        />
      )}
      
      {/* Enhanced Gradient Background */}
      <GradientBackground intensity={ui.sliderValue / 100} />
      
      {/* Brand Watermark (Subtle center logo) */}
            {/* BeyMedia Brand Watermark */}
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
      
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene audioData={audioData} />
        </Canvas>
      </div>

      {/* Floating Brand Elements */}
      {brandConfig.floating.enabled && (
        <FloatingBrandElements images={brandAssets.floatingElements} />
      )}

      {/* Brand Particles */}
      {brandConfig.particles.enabled && (
        <BrandParticles 
          logoSrc={brandAssets.beyMediaLogo}
          count={brandConfig.particles.count}
        />
      )}

      {/* Recursive Pattern Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
          >
            <RecursivePattern depth={ui.patternDepth} size={30 + i * 10} />
          </div>
        ))}
      </div>
      
      {/* Main UI */}
      <div className="relative z-10 flex h-full">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Enhanced Top Bar */}
          <motion.div 
            className="h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">
                BeyFlow Chat
              </h1>
              {audio.playing && (
                <motion.div
                  className="text-cyan-400 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🎵 Playing
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Audio status indicator */}
              <motion.div 
                className={`w-3 h-3 rounded-full ${
                  audio.isListening ? 'bg-red-400' : 
                  audio.playing ? 'bg-green-400' : 'bg-gray-400'
                }`}
                animate={audio.isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </div>
          </motion.div>
          
          {/* Module Content */}
          <ModuleRouter />
        </div>
      </div>
      
      {/* Enhanced floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
      
      {/* Development Analytics Display */}
      {import.meta.env.DEV && insights && (
        <div className="absolute top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
          <h3 className="font-bold mb-2">Live Analytics</h3>
          <div>Active Users: {insights.realTimeData?.activeUsers || 0}</div>
          <div>Messages/min: {insights.realTimeData?.messagesPerMinute || 0}</div>
          <div>Error Rate: {(insights.realTimeData?.errorRate || 0).toFixed(2)}%</div>
          <div>Engagement: {insights.users?.engagementScore || 0}/100</div>
        </div>
      )}
      
      {/* Performance Monitor */}
      <PerformancePanel 
        isVisible={import.meta.env.DEV} 
        position="bottom-right" 
      />
    </div>
    </ErrorBoundary>
  )
}

export default App
