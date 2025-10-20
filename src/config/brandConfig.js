// Brand Assets Configuration
// Add your PNG files to the public/brand/ folder and update paths here

export const brandAssets = {
  // BeyMedia logo - primary brand watermark
  beyMediaLogo: '/brand/beymedia-logo.png',
  
  // Main logo/watermark (appears subtly in background)
  mainLogo: '/brand/logo-primary.png',
  
  // Secondary logo for variety
  secondaryLogo: '/brand/logo-secondary.png',
  
  // Background patterns (ultra-faded full background)
  backgroundPattern: '/brand/pattern-texture.png',
  backgroundPatternAlt: '/brand/pattern-geometric.png',
  
  // Floating elements (small icons that float around)
  floatingElements: [
    '/brand/beymedia-logo.png',
    '/brand/logo-primary.png',
    '/brand/logo-secondary.png',
    '/brand/icon-main.png',
    '/brand/icon-accent.png'
  ],
  
  // Chat accent (tiny logo in chat bubbles)
  chatAccent: '/brand/beymedia-logo.png',
  
  // Sidebar brand element
  sidebarBrand: '/brand/beymedia-logo.png',
  
  // Additional brand elements for particles and accents
  brandElements: [
    '/brand/brand-element-1.png',
    '/brand/brand-element-2.png'
  ],
  
  // Icon collection for various uses
  icons: {
    main: '/brand/icon-main.png',
    accent: '/brand/icon-accent.png'
  },
  
  // Pattern collection for backgrounds
  patterns: {
    texture: '/brand/pattern-texture.png',
    geometric: '/brand/pattern-geometric.png'
  }
}

// Brand colors that sync with your dopamine theme
export const brandColors = {
  primary: '#4CC3D9',      // Your main brand color
  secondary: '#3b82f6',    // Complementary color
  accent: '#10b981',       // Accent color
  neutral: '#ffffff'       // Text/neutral color
}

// Configuration for how brand elements appear
export const brandConfig = {
  // BeyMedia Watermark settings (primary brand presence)
  watermark: {
    enabled: true,
    opacity: 0.04,           // Slightly more visible for BeyMedia logo
    position: 'center',      // center, topLeft, topRight, etc.
    rotateWithAudio: true,   // Gentle rotation when audio plays
    scale: 1.1,              // Slightly larger for BeyMedia prominence
    pulseWithReward: true    // Subtle pulse on dopamine rewards
  },
  
  // Background layer settings
  background: {
    enabled: true,
    intensity: 0.02,         // Ultra-faded
    blurAmount: 3,           // Soft blur
    animateWithAudio: true   // Subtle pulse with audio
  },
  
  // Floating elements settings
  floating: {
    enabled: true,
    count: 4,                // Increased for more brand presence
    opacity: 0.06,           // Slightly more subtle with more elements
    size: 'small',           // small, medium, large  
    speed: 'slow',           // slow, medium, fast
    beyMediaPriority: true   // Give BeyMedia logo priority in floating sequence
  },
  
  // Chat accent settings
  chatAccent: {
    enabled: true,
    opacity: 0.3,            // Visible but subtle
    showOnUserMessages: true,
    showOnBotMessages: true
  },
  
  // Particle system settings
  particles: {
    enabled: true,
    count: 6,                // Number of brand particles
    opacity: 0.06,           // Very subtle
    animationSpeed: 'slow'
  }
}

// Helper function to check if brand asset exists
export function getBrandAsset(key) {
  const asset = brandAssets[key]
  if (!asset) return null
  
  // In a real app, you might want to check if file exists
  return asset
}

// Helper function to get brand config
export function getBrandConfig(section) {
  return brandConfig[section] || {}
}

// Color utility to blend brand colors with dopamine theme
export function getBlendedBrandColor(colorKey, dopamineShift = 0) {
  const baseColor = brandColors[colorKey]
  if (!baseColor) return '#4CC3D9'
  
  // Simple hue rotation for dopamine effect
  // In a real implementation, you'd use proper color manipulation
  return baseColor
}