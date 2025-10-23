import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, Box, Environment, Float } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import BeyTVModule from "./modules/BeyTVModule"
import StackBlogModule from "./modules/StackBlogModule"
import OmnisphereModule from "./modules/OmnisphereModule"
import { useBeyFlowStore } from "./core/UnifiedStore"
import { UnifiedIntegrationSystem } from "./core/UnifiedIntegrationSystem"
import { OptimizedLayout } from "./core/OptimizedLayout"
import { LayoutProvider, EnhancedLayout, ComponentZone, CardContainer, GridLayout } from "./core/EnhancedLayoutSystem"
import { NotionContainer, GlassCard, ParallaxBackground, FloatingActionButton, CommandPalette } from "./core/ModernUISystem"
import { PerformancePanel } from "./components/PerformanceMonitor"
import ChatPanel from "./modules/ChatPanel"
import Sidebar from "./modules/Sidebar"
import Visualizer3D from "./modules/Visualizer3D"
import SessionManager from "./modules/SessionManager"
import AIStudio from "./modules/AIStudio"
import WorkflowBuilder from "./modules/WorkflowBuilder"
import UIShowcase from "./modules/UIShowcase"
import ContactsHub from "./modules/ContactsHub"
import Workspace from "./modules/Workspace"
import WebBrowser from "./modules/WebBrowser"
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
import MotivationalQuote from "./components/MotivationalQuote"
import InteractiveLighting from "./components/InteractiveLighting"
import HologramHost from "./components/HologramHost"
import ColorModeControl from "./components/ColorModeControl"
import ParallaxDepth from "./components/ParallaxDepth"
import SpectrumControl from "./components/SpectrumControl"
import FloatingBrowser from "./components/FloatingBrowser"
import WidgetHub from "./components/WidgetHub"
import IntegrationDashboard from "./components/IntegrationDashboard"
import CustomFontLoader from "./components/CustomFontLoader"
import DynamicBrandBackground from "./components/DynamicBrandBackground"
import EnhancedBrandWatermark from "./components/EnhancedBrandWatermark"
import BrandIntegrationStatus from "./components/BrandIntegrationStatus"
import { getTheme } from "./config/themes"

// 3D Scene Component with enhanced dopamine visuals
function Scene({ audioData }) {
  const sceneConfig = useBeyFlowStore(state => state.scene.config)
  const ui = useBeyFlowStore(state => state.ui)
  const audio = useBeyFlowStore(state => state.audio)
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
  const currentModule = useBeyFlowStore(state => state.ui.currentModule)
  
  const modules = {
    chat: <ChatPanel />,
    beytv: <BeyTVModule />,
    stackblog: <StackBlogModule />,
    omnisphere: <OmnisphereModule />,
    contacts: <ContactsHub />,
    workspace: <Workspace />,
    workflows: <WorkflowBuilder />,
    browser: <WebBrowser />,
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
  const ui = useBeyFlowStore(state => state.ui)
  const audio = useBeyFlowStore(state => state.audio)
  const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const colorMode = useBeyFlowStore(state => state.ui.colorMode)
  const spectrum = useBeyFlowStore(state => state.ui.spectrum)
  const openFloatingBrowser = useBeyFlowStore(state => state.ui.openFloatingBrowser)
  const theme = getTheme(themePersona)
  
  // Modern UX enhancements
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -500])
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
  
  // Get spectrum values for enhanced effects
  const blur = spectrum?.blur ?? 0.3
  const glow = spectrum?.glow ?? 0.3
  const saturation = spectrum?.saturation ?? 0.3
  const speed = spectrum?.speed ?? 0.3
  
  // Enhanced keyboard shortcuts for modern UX
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command Palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      
      // Quick navigation shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault()
        const setCurrentModule = useBeyFlowStore.getState().ui.setCurrentModule
        setCurrentModule('chat')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  // Command palette commands
  const commands = [
    {
      icon: '💬',
      title: 'Open Chat',
      description: 'Navigate to chat panel',
      action: () => useBeyFlowStore.getState().ui.setCurrentModule('chat')
    },
    {
      icon: '📺',
      title: 'Open BeyTV',
      description: 'Navigate to BeyTV module',
      action: () => useBeyFlowStore.getState().ui.setCurrentModule('beytv')
    },
    {
      icon: '🌐',
      title: 'Open Browser',
      description: 'Open floating browser',
      action: () => useBeyFlowStore.getState().ui.openFloatingBrowser()
    },
    {
      icon: '🎨',
      title: 'Change Theme',
      description: 'Switch between themes',
      action: () => {
        const themes = ['dopaminergic', 'nootropic', 'cyberpunk', 'glassmorphic']
        const current = useBeyFlowStore.getState().ui.themePersona
        const currentIndex = themes.indexOf(current)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        useBeyFlowStore.getState().ui.setThemePersona(nextTheme)
      }
    }
  ]
  
  // Log color mode changes
  useEffect(() => {
    console.log('🎨 App: Current colorMode is:', colorMode)
  }, [colorMode])
  const bananaFlow = useBananaFlow()
  const { trackEvent, insights } = useAnalytics()
  const audioData = useAdvancedAudio()
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts()
  
  // Initialize Unified Integration System
  useEffect(() => {
    console.log('🚀 Initializing Unified Integration System...');
    
    // Initialize the unified system
    const integration = UnifiedIntegrationSystem.getInstance();
    integration.initialize();
    
    // Listen for system events
    integration.subscribe('system:ready', (data) => {
      console.log('✅ Unified Integration System connected:', data.services);
    });
    
    // Listen for cross-service notifications
    integration.subscribe('notification:system', (data) => {
      console.log('💬 System notification:', data.message);
    });
    
  }, []);
  
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
    <LayoutProvider>
      <ErrorBoundary>
        {/* Load Custom Brand Fonts */}
        <CustomFontLoader />
        
        {/* Enhanced Parallax Background System */}
        <ParallaxBackground
          layers={[
            {
              speed: 0.1,
              opacity: 0.3,
              zIndex: 1,
              content: <DynamicBrandBackground audioData={audioData} spectrum={spectrum} />,
              className: "absolute inset-0"
            },
            {
              speed: 0.3,
              opacity: 0.5,
              zIndex: 2,
              content: <ParallaxDepth />,
              className: "absolute inset-0"
            },
            {
              speed: 0.5,
              opacity: 0.7,
              zIndex: 3,
              content: <InteractiveLighting />,
              className: "absolute inset-0"
            }
          ]}
        >
          {/* Enhanced Layout System */}
          <EnhancedLayout>
            {{
              sidebar: (
                <ComponentZone zone="sidebar">
                  <Sidebar />
                </ComponentZone>
              ),
              
              header: (
                <ComponentZone zone="top-bar" padding={false}>
                  <motion.div 
                    className="flex items-center space-x-3"
                    style={{
                      backdropFilter: `blur(${8 + blur * 16}px) saturate(${0.8 + saturation * 1.2})`,
                    }}
                  >
                    <img 
                      src={brandAssets.beyMediaLogo} 
                      alt="BeyMedia" 
                      className="w-6 h-6 object-contain opacity-40"
                    />
                    <h1 className="text-sm font-brand-primary text-white/80">
                      beyflow_chat
                    </h1>
                    <span className="text-xs font-brand-accent text-cyan-400 opacity-60">
                      by BeyMedia
                    </span>
                  </motion.div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setCommandPaletteOpen(true)}
                      className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors text-white/70 hover:text-white"
                      title="Open Command Palette (⌘K)"
                    >
                      ⌘K
                    </button>
                    
                    <button
                      onClick={openFloatingBrowser}
                      className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all"
                      title="Open Floating Browser"
                    >
                      <span className="text-lg">🌐</span>
                    </button>
                    
                    <ThemeToggle />
                  </div>
                </ComponentZone>
              ),
              
              main: (
                <ComponentZone zone="main-content">
                  {/* Notion-like Content Organization */}
                  <div className="h-full overflow-y-auto">
                    <NotionContainer 
                      title="Workspace" 
                      level={1} 
                      className="p-6"
                    >
                      <GridLayout columns={1} gap={6}>
                        {/* Main Module Content */}
                        <GlassCard hover={false} className="min-h-[400px]">
                          <ModuleRouter />
                        </GlassCard>
                        
                        {/* Secondary Content Areas */}
                        <NotionContainer 
                          title="Tools & Utilities" 
                          level={2} 
                          collapsible 
                          defaultCollapsed={true}
                        >
                          <GridLayout columns={3} gap={4}>
                            <CardContainer title="Performance" variant="minimal">
                              {import.meta.env.DEV && (
                                <PerformancePanel isVisible={true} position="bottom-right" />
                              )}
                            </CardContainer>
                            
                            <CardContainer title="Integration Status" variant="minimal">
                              <BananaFlowStatus />
                            </CardContainer>
                            
                            <CardContainer title="Analytics" variant="minimal">
                              {import.meta.env.DEV && insights && (
                                <div className="space-y-2 font-mono text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Users</span>
                                    <span className="text-cyan-400">{insights.realTimeData?.activeUsers || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Messages</span>
                                    <span className="text-cyan-400">{insights.realTimeData?.messagesPerMinute || 0}</span>
                                  </div>
                                </div>
                              )}
                            </CardContainer>
                          </GridLayout>
                        </NotionContainer>
                      </GridLayout>
                    </NotionContainer>
                  </div>
                </ComponentZone>
              )
            }}
          </EnhancedLayout>
        </ParallaxBackground>
        
        {/* Modern Floating Action Button */}
        <FloatingActionButton
          actions={[
            {
              icon: "💬",
              onClick: () => useBeyFlowStore.getState().ui.setCurrentModule('chat')
            },
            {
              icon: "📺", 
              onClick: () => useBeyFlowStore.getState().ui.setCurrentModule('beytv')
            },
            {
              icon: "🎨",
              onClick: () => setCommandPaletteOpen(true)
            },
            {
              icon: "⚡",
              onClick: () => console.log('Quick action!')
            }
          ]}
        />
        
        {/* Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          commands={commands}
        />
        
        {/* Organized Widget Areas (No More Overlapping!) */}
        <ComponentZone zone="floating" className="bottom-4 right-80">
          <WidgetHub />
        </ComponentZone>
        
        <ComponentZone zone="floating" className="bottom-6 left-6">
          <ColorModeControl />
        </ComponentZone>
        
        <ComponentZone zone="floating" className="top-4 right-4">
          <SpectrumControl />
        </ComponentZone>
        
        {/* Hologram Host - Clean positioning */}
        <ComponentZone zone="floating" className="bottom-20 right-20">
          <div className="scale-150 opacity-90">
            <HologramHost />
          </div>
        </ComponentZone>
        
        {/* Motivational Quote - Side panel style */}
        <ComponentZone zone="floating" className="top-1/2 -translate-y-1/2 right-6 max-w-xs">
          <GlassCard className="p-4">
            <MotivationalQuote />
          </GlassCard>
        </ComponentZone>
      </ErrorBoundary>
    </LayoutProvider>
  )
}

export default App
