/**
 * 🎨 OPTIMIZED LAYOUT SYSTEM
 * Clean, responsive, accessibility-first design
 */
import { memo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBeyFlowStore, useTheme } from '../core/UnifiedStore.js'
import { Card, Button } from '../core/StandardComponents.js'

// 📱 Responsive breakpoints
const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440
}

// 🎯 Layout zones configuration
const LAYOUT_ZONES = {
  sidebar: { width: 280, collapsedWidth: 64 },
  main: { minWidth: 400 },
  panel: { width: 320, maxWidth: 400 }
}

// 📐 Main Layout Container
export const OptimizedLayout = memo(({ children }) => {
  const { theme, spectrum } = useTheme()
  const sidebarOpen = useBeyFlowStore(state => state.ui.sidebarOpen)
  const [screenSize, setScreenSize] = useState('desktop')
  const [contextPanels, setContextPanels] = useState(new Set())
  
  // 📱 Responsive detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.tablet) setScreenSize('mobile')
      else if (width < BREAKPOINTS.desktop) setScreenSize('tablet')
      else if (width < BREAKPOINTS.wide) setScreenSize('desktop')
      else setScreenSize('wide')
    }
    
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])
  
  const isMobile = screenSize === 'mobile'
  const isTablet = screenSize === 'tablet'
  const sidebarWidth = sidebarOpen ? LAYOUT_ZONES.sidebar.width : LAYOUT_ZONES.sidebar.collapsedWidth
  
  return (
    <div 
      className="h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-teal-900/40"
      style={{
        backdropFilter: `blur(${8 + spectrum.blur * 16}px) saturate(${0.8 + spectrum.saturation * 1.2})`
      }}
    >
      {/* 🎨 Background Layer (z-0) */}
      <BackgroundLayer />
      
      {/* 📐 Main Layout Grid (z-10) */}
      <div 
        className="relative z-10 h-full flex"
        style={{
          gridTemplateColumns: isMobile 
            ? '1fr' 
            : `${sidebarWidth}px 1fr ${contextPanels.size > 0 ? `${LAYOUT_ZONES.panel.width}px` : '0px'}`
        }}
      >
        {/* 🔧 Sidebar Navigation */}
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            className="bg-black/20 border-r border-white/10 backdrop-blur-xl relative z-20"
            animate={{ 
              width: isMobile ? '100%' : sidebarWidth,
              x: isMobile && !sidebarOpen ? -320 : 0
            }}
            transition={{ duration: 0.3 }}
          >
            {children.sidebar}
          </motion.aside>
        )}
        
        {/* 📄 Main Content Area */}
        <main className="flex-1 relative z-10 overflow-hidden">
          <ResponsiveMainContent screenSize={screenSize}>
            {children.main}
          </ResponsiveMainContent>
        </main>
        
        {/* 🔧 Context Panels */}
        <AnimatePresence>
          {contextPanels.size > 0 && !isMobile && (
            <motion.aside
              className="bg-black/20 border-l border-white/10 backdrop-blur-xl relative z-20"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: LAYOUT_ZONES.panel.width, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContextPanelManager 
                panels={contextPanels} 
                onClose={(panelId) => {
                  const newPanels = new Set(contextPanels)
                  newPanels.delete(panelId)
                  setContextPanels(newPanels)
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
      
      {/* 🎮 Control Center */}
      <ControlCenter 
        screenSize={screenSize}
        onOpenPanel={(panelId) => {
          const newPanels = new Set(contextPanels)
          newPanels.add(panelId)
          setContextPanels(newPanels)
        }}
      />
      
      {/* 📱 Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => useBeyFlowStore.getState().actions.toggleSidebar()}
        />
      )}
    </div>
  )
})

// ✅ OPTIMIZED: Background Layer with viewport-based animation
const BackgroundLayer = memo(() => {
  const { spectrum } = useTheme()
  const [isInView, setIsInView] = useState(true)
  
  return (
    <div className="absolute inset-0 z-0">
      {/* Animated gradient background - only animates when in view */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-600/20"
        animate={isInView ? {
          background: [
            'linear-gradient(45deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(20, 184, 166, 0.2))',
            'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(20, 184, 166, 0.2), rgba(147, 51, 234, 0.2))',
            'linear-gradient(225deg, rgba(20, 184, 166, 0.2), rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2))',
            'linear-gradient(315deg, rgba(147, 51, 234, 0.2), rgba(59, 130, 246, 0.2), rgba(20, 184, 166, 0.2))'
          ]
        } : {}}
        transition={{
          duration: 20 / (0.5 + spectrum.speed * 1.5),
          repeat: isInView ? Infinity : 0,
          ease: "linear"
        }}
        onViewportEnter={() => setIsInView(true)}
        onViewportLeave={() => setIsInView(false)}
      />
      
      {/* Particle effects - reduced animation when not in view */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at 20% 80%, rgba(0, 255, 255, ${spectrum.glow * 0.3}) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 0, 255, ${spectrum.glow * 0.2}) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(0, 255, 0, ${spectrum.glow * 0.1}) 0%, transparent 50%)`
        }}
        animate={isInView ? {
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        } : { scale: 1, opacity: 0.2 }}
        transition={{
          duration: 8,
          repeat: isInView ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </div>
  )
})

// 📄 Responsive Main Content
const ResponsiveMainContent = memo(({ children, screenSize }) => {
  const isMobile = screenSize === 'mobile'
  
  return (
    <div className={`h-full flex flex-col ${isMobile ? 'p-4' : 'p-6'}`}>
      {/* Content container with proper spacing */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
})

// 🔧 Context Panel Manager
const ContextPanelManager = memo(({ panels, onClose }) => {
  const [activePanel, setActivePanel] = useState(Array.from(panels)[0])
  
  const panelComponents = {
    integration: <IntegrationPanel />,
    performance: <PerformancePanel />,
    brand: <BrandPanel />,
    settings: <SettingsPanel />
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Panel tabs */}
      {panels.size > 1 && (
        <div className="flex border-b border-white/10 p-2 space-x-1">
          {Array.from(panels).map(panelId => (
            <button
              key={panelId}
              onClick={() => setActivePanel(panelId)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                activePanel === panelId 
                  ? 'bg-cyan-400/20 text-cyan-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {panelId}
            </button>
          ))}
        </div>
      )}
      
      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4">
          {panelComponents[activePanel] || <div>Panel not found</div>}
        </div>
      </div>
      
      {/* Close button */}
      <div className="p-2 border-t border-white/10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onClose(activePanel)}
          className="w-full"
        >
          Close Panel
        </Button>
      </div>
    </div>
  )
})

// 🎮 Control Center
const ControlCenter = memo(({ screenSize, onOpenPanel }) => {
  const isMobile = screenSize === 'mobile'
  const [showControls, setShowControls] = useState(false)
  const toggleSidebar = useBeyFlowStore(state => state.actions.toggleSidebar)
  
  if (isMobile) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <div className="flex flex-col space-y-2">
          {/* Mobile menu button */}
          <Button
            onClick={() => toggleSidebar()}
            className="w-12 h-12 rounded-full bg-cyan-500 text-white shadow-lg"
            aria-label="Toggle menu"
          >
            ☰
          </Button>
          
          {/* Quick actions */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="flex flex-col space-y-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  size="sm"
                  onClick={() => onOpenPanel('integration')}
                  className="w-12 h-12 rounded-full"
                  aria-label="Integration status"
                >
                  🔗
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenPanel('settings')}
                  className="w-12 h-12 rounded-full"
                  aria-label="Settings"
                >
                  ⚙️
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Expand/collapse toggle */}
          <Button
            onClick={() => setShowControls(!showControls)}
            className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs"
            aria-label={showControls ? "Hide controls" : "Show controls"}
          >
            {showControls ? '−' : '+'}
          </Button>
        </div>
      </div>
    )
  }
  
  // Desktop control bar
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <Card className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20">
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            onClick={() => onOpenPanel('integration')}
            variant="ghost"
            aria-label="Integration dashboard"
          >
            🔗
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenPanel('performance')}
            variant="ghost"
            aria-label="Performance monitor"
          >
            📊
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenPanel('brand')}
            variant="ghost"
            aria-label="Brand settings"
          >
            🎨
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenPanel('settings')}
            variant="ghost"
            aria-label="Settings"
          >
            ⚙️
          </Button>
        </div>
      </Card>
    </div>
  )
})

// 🔗 Individual Panel Components
const IntegrationPanel = memo(() => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Integration Status</h3>
    <div className="space-y-2">
      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
        <span className="text-sm">BeyTV</span>
        <span className="text-green-400 text-xs">🟢 Connected</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
        <span className="text-sm">Stack Blog</span>
        <span className="text-red-400 text-xs">🔴 Offline</span>
      </div>
      <div className="flex justify-between items-center p-2 bg-black/30 rounded">
        <span className="text-sm">Omnisphere</span>
        <span className="text-yellow-400 text-xs">🟡 Checking</span>
      </div>
    </div>
  </div>
))

const PerformancePanel = memo(() => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Performance</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">FPS</span>
        <span className="text-green-400">60</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Memory</span>
        <span className="text-cyan-400">45MB</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Render</span>
        <span className="text-blue-400">16ms</span>
      </div>
    </div>
  </div>
))

const BrandPanel = memo(() => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Brand Settings</h3>
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Font Family</label>
        <select className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white text-sm">
          <option>FilsonPro</option>
          <option>FuturaPT</option>
          <option>RegulatorNova</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Logo Style</label>
        <select className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white text-sm">
          <option>BeyMedia</option>
          <option>BeyGen</option>
        </select>
      </div>
    </div>
  </div>
))

const SettingsPanel = memo(() => (
  <div className="space-y-4">
    <h3 className="text-lg font-bold text-white">Settings</h3>
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Theme</label>
        <select className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white text-sm">
          <option>Dopaminergic</option>
          <option>Terminal</option>
          <option>Glassmorphic</option>
        </select>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm text-gray-300">Animations</span>
        </label>
      </div>
      <div>
        <label className="flex items-center space-x-2">
          <input type="checkbox" className="rounded" />
          <span className="text-sm text-gray-300">Sound Effects</span>
        </label>
      </div>
    </div>
  </div>
))

export default OptimizedLayout