import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Sliders, LayoutGrid, Box } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'
import ThemedSlider from '../components/ThemedSlider'
import ThemedCarousel from '../components/ThemedCarousel'
import Model3DViewer from '../components/Model3DViewer'

export default function UIShowcase() {
  const { themePersona, updateUI, updateSceneConfig, updateAudio, ui } = useStore()
  const theme = getTheme(themePersona)
  
  const [volume, setVolume] = useState(75)
  const [brightness, setBrightness] = useState(50)
  const [speed, setSpeed] = useState(33)
  
  const handleVolumeChange = (val) => {
    setVolume(val)
    updateAudio({ volume: val / 100 })
  }
  
  const handleBrightnessChange = (val) => {
    setBrightness(val)
    updateUI({ gradientShift: val })
  }
  
  const handleSpeedChange = (val) => {
    setSpeed(val)
    updateSceneConfig({ animationSpeed: val / 100 })
  }

  const carouselSlides = [
    'Visual Workflow Builder with Multi-Agent AI',
    'Connect APIs, LLMs, and Automation Tools',
    'Real-time Execution with Progress Tracking',
    'Omnigen, GPT-Marketer, GPT-Engineer, DALL-E',
    'Terminal Hacker & Glassmorphic Modern Themes'
  ]

  return (
    <div className={`flex-1 overflow-y-auto p-8 ${theme.colors.bg}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Sparkles className={theme.colors.accent} size={32} />
            <h1 className={`text-3xl font-bold ${theme.font} ${theme.colors.text}`}>
              {theme.id === 'terminal' ? '[UI_COMPONENTS]' : 'UI Components'}
            </h1>
          </div>
          <p className={`${theme.colors.textMuted} ${theme.font}`}>
            {theme.id === 'terminal' 
              ? '> Interactive sliders and carousels with theme support'
              : 'Interactive sliders and carousels that adapt to your theme'
            }
          </p>
        </div>

        {/* Sliders Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Sliders className={theme.colors.accent} size={20} />
            <h2 className={`text-xl font-semibold ${theme.font} ${theme.colors.text}`}>
              {theme.id === 'terminal' ? '[THEMED_SLIDERS]' : 'Themed Sliders'}
            </h2>
          </div>

          <div className="space-y-6">
            <ThemedSlider
              label="Volume"
              min={0}
              max={100}
              defaultValue={volume}
              onChange={handleVolumeChange}
            />

            <ThemedSlider
              label="Brightness"
              min={0}
              max={100}
              defaultValue={brightness}
              onChange={handleBrightnessChange}
            />

            <ThemedSlider
              label="Speed"
              min={0}
              max={100}
              defaultValue={speed}
              onChange={handleSpeedChange}
            />
          </div>

          <div className={`mt-6 p-4 ${theme.colors.input} ${theme.rounded}`}>
            <p className={`text-sm ${theme.colors.textMuted} ${theme.font}`}>
              {theme.id === 'terminal'
                ? `> VOLUME: ${volume}% | BRIGHTNESS: ${brightness}% | SPEED: ${speed}%`
                : `Volume: ${volume}% • Brightness: ${brightness}% • Speed: ${speed}%`
              }
            </p>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <LayoutGrid className={theme.colors.accent} size={20} />
            <h2 className={`text-xl font-semibold ${theme.font} ${theme.colors.text}`}>
              {theme.id === 'terminal' ? '[FEATURE_CAROUSEL]' : 'Feature Carousel'}
            </h2>
          </div>

          <ThemedCarousel
            slides={carouselSlides}
            autoplay={true}
            navigation={true}
            pagination={true}
          />
        </motion.div>

        {/* Cube Effect Carousel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <LayoutGrid className={theme.colors.accent} size={20} />
            <h2 className={`text-xl font-semibold ${theme.font} ${theme.colors.text}`}>
              {theme.id === 'terminal' ? '[3D_CUBE_EFFECT]' : '3D Cube Effect'}
            </h2>
          </div>

          <ThemedCarousel
            slides={[
              'Multi-Agent Workflow Automation',
              'Cyberpunk Visual Design',
              'Real-time AI Processing',
              'OpenAI Integration'
            ]}
            effect="cube"
            autoplay={true}
            navigation={false}
            pagination={true}
          />
        </motion.div>

        {/* 3D Model Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-6 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}
        >
          <div className="flex items-center space-x-2 mb-6">
            <Box className={theme.colors.accent} size={20} />
            <h2 className={`text-xl font-semibold ${theme.font} ${theme.colors.text}`}>
              {theme.id === 'terminal' ? '[3D_MODEL_VIEWER]' : '3D Model Viewer'}
            </h2>
          </div>

          <Model3DViewer />
        </motion.div>

        {/* Info */}
        <div className={`p-4 ${theme.colors.input} ${theme.rounded}`}>
          <p className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
            {theme.id === 'terminal'
              ? '> POWERED_BY: Swiper.js + react-slider + React Three Fiber\n> FULLY_THEMED: Terminal & Glassmorphic support\n> ACCESSIBLE: ARIA-compliant controls + Interactive 3D'
              : '🎨 Powered by Swiper.js, react-slider, and React Three Fiber • Fully themed • Interactive 3D models with camera controls'
            }
          </p>
        </div>
      </motion.div>
    </div>
  )
}
