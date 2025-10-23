/**
 * 📚 COMPONENT LIBRARY INDEX
 * Organized component exports for the BeyFlow ecosystem
 */

// 🎯 Core Components
export { 
  Button, 
  Input, 
  Card, 
  Modal, 
  Notification,
  ModuleLayout,
  ANIMATION_VARIANTS,
  getThemeStyles,
  withStandardProps,
  withLoadingState,
  withErrorBoundary,
  createLazyComponent,
  createAsyncHook
} from '../core/StandardComponents.js'

// 🏪 Store Hooks
export {
  useBeyFlowStore,
  useUser,
  useUserActions,
  useUI,
  useChat,
  useAudio,
  useIntegrations,
  useAnalytics,
  useModule,
  useMessages,
  useTheme,
  useNotifications,
  useLoading,
  useLegacyStore
} from '../core/UnifiedStore.js'

// 🔗 Integration System
export {
  useIntegrationSystem,
  useServiceStatus,
  useIntegrationEvents
} from '../core/UnifiedIntegrationSystem.js'

// 🎨 UI Components (Legacy - will be migrated)
export { 
  DopamineSlider,
  GradientBackground,
  PulseCard,
  FluidButton,
  RecursivePattern,
  ChatBubble,
  LoadingDots
} from './DopamineUI.jsx'

// 🔊 Audio Components
export {
  AudioPlayer,
  VoiceInput,
  VoiceSettings
} from './AudioComponents.jsx'

// 🏢 Brand Components
export {
  BrandWatermark,
  FloatingBrandElements,
  BackgroundBrandLayer,
  BrandParticles
} from './BrandAssets.jsx'

export {
  CustomFontLoader
} from './CustomFontLoader.jsx'

export {
  DynamicBrandBackground
} from './DynamicBrandBackground.jsx'

export {
  EnhancedBrandWatermark
} from './EnhancedBrandWatermark.jsx'

export {
  BrandIntegrationStatus
} from './BrandIntegrationStatus.jsx'

// 🔗 Integration Components
export {
  IntegrationStatusPanel
} from './IntegrationStatusPanel.jsx'

export {
  IntegrationDashboard
} from './IntegrationDashboard.jsx'

// 🎮 Control Components
export {
  ColorModeControl
} from './ColorModeControl.jsx'

export {
  SpectrumControl
} from './SpectrumControl.jsx'

export {
  ParallaxDepth
} from './ParallaxDepth.jsx'

export {
  InteractiveLighting
} from './InteractiveLighting.jsx'

// 🚀 Performance & Monitoring
export {
  PerformancePanel
} from './PerformanceMonitor.jsx'

export {
  OptimizedScene
} from './OptimizedScene.jsx'

// 🎯 Specialized Components
export {
  HologramHost
} from './HologramHost.jsx'

export {
  MotivationalQuote
} from './MotivationalQuote.jsx'

export {
  FloatingBrowser
} from './FloatingBrowser.jsx'

export {
  WidgetHub
} from './WidgetHub.jsx'

export {
  MinimizablePanel
} from './MinimizablePanel.jsx'

export {
  ThemeToggle
} from './ThemeToggle.jsx'

// 🛡️ Error Handling
export {
  ErrorBoundary
} from './ErrorBoundary.jsx'

// 🌊 Background Effects
export {
  FluidGradientBg
} from './FluidGradientBg.jsx'

export {
  MeshGradient
} from './MeshGradient.jsx'

// 🎬 3D Components (Re-export for easy access)
export {
  Scene
} from '../modules/Visualizer3D.jsx'

// 🔄 Default export for convenience
export default {
  // Core
  Button,
  Input,
  Card,
  Modal,
  Notification,
  ModuleLayout,
  
  // Hooks
  useBeyFlowStore,
  useModule,
  useMessages,
  useTheme,
  useIntegrationSystem,
  
  // Theme
  getThemeStyles,
  ANIMATION_VARIANTS,
  
  // HOCs
  withStandardProps,
  withLoadingState,
  withErrorBoundary
}