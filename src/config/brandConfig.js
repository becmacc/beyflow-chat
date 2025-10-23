// Brand Assets Configuration
// Add your PNG files to the public/brand/ folder and update paths here

export const brandAssets = {
  // BeyMedia logo - primary brand watermark (SVG for scalability)
  beyMediaLogo: '/brand/beymedia-logo.svg',
  
  // BeyGen logo - engine/tech brand
  beyGenLogo: '/brand/beygen-logo.png',
  
  // Footer logo for bottom placement
  footerLogo: '/brand/footer-logo.svg',
  
  // Main logo/watermark (appears subtly in background)
  mainLogo: '/brand/beymedia-logo.svg',
  
  // Secondary logo for variety (BeyGen engine)
  secondaryLogo: '/brand/beygen-logo.png',
  
  // Background visuals collection
  backgroundVisuals: [
    '/backgrounds/3.svg',
    '/backgrounds/4.svg', 
    '/backgrounds/5.svg',
    '/backgrounds/6.svg',
    '/backgrounds/7.svg',
    '/backgrounds/8.svg',
    '/backgrounds/9.svg',
    '/backgrounds/10.svg'
  ],
  
  // Primary background pattern
  backgroundPattern: '/backgrounds/6.svg',
  backgroundPatternAlt: '/backgrounds/8.svg',
  
  // Floating elements (BeyMedia + BeyGen rotation)
  floatingElements: [
    '/brand/beymedia-logo.svg',
    '/brand/beygen-logo.png',
    '/brand/footer-logo.svg'
  ],
  
  // Chat accent (BeyMedia primary)
  chatAccent: '/brand/beymedia-logo.svg',
  
  // Sidebar brand element
  sidebarBrand: '/brand/beymedia-logo.svg',
  
  // Brand elements for particles and accents
  brandElements: [
    '/brand/beymedia-logo.svg',
    '/brand/beygen-logo.png',
    '/brand/footer-logo.svg'
  ],
  
  // Icon collection for various uses
  icons: {
    main: '/brand/beymedia-logo.svg',
    accent: '/brand/beygen-logo.png',
    footer: '/brand/footer-logo.svg'
  },
  
  // Font collection
  fonts: {
    filsonPro: '/fonts/FilsonPro.otf',
    filsonProBold: '/fonts/FilsonProBold.otf',
    futuraPTLight: '/fonts/Futura PT Light.otf',
    regulatorNovaLight: '/fonts/fonnts.com-Regulator_Nova_Light.otf'
  }
}

// BeyMedia/BeyGen brand colors that sync with your dopamine theme
export const brandColors = {
  // BeyMedia primary colors
  beyMediaPrimary: '#4CC3D9',    // Cyan/Turquoise - your main brand color
  beyMediaSecondary: '#3b82f6',  // Blue - professional complement
  
  // BeyGen engine colors  
  beyGenPrimary: '#10b981',      // Green - engine/tech accent
  beyGenSecondary: '#8b5cf6',    // Purple - innovation accent
  
  // Universal colors
  accent: '#ff6b6b',             // Red accent for highlights
  neutral: '#ffffff',            // Text/neutral color
  dark: '#1a1a1a',               // Dark theme support
  
  // Gradient combinations
  gradients: {
    beyMedia: 'linear-gradient(135deg, #4CC3D9 0%, #3b82f6 100%)',
    beyGen: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
    unified: 'linear-gradient(135deg, #4CC3D9 0%, #10b981 50%, #8b5cf6 100%)'
  }
}

// Configuration for how brand elements appear
export const brandConfig = {
  // BeyMedia Watermark settings (primary brand presence)
  watermark: {
    enabled: true,
    opacity: 0.15,           // Slightly more visible for brand recognition
    position: 'bottomRight', // Professional, non-intrusive placement
    rotateWithAudio: true,   // Gentle rotation when audio plays
    scale: 0.6,              // Optimal size for corner placement
    pulseWithReward: true,   // Subtle pulse on dopamine rewards
    useSVG: true            // Use SVG for crisp scaling
  },
  
  // Background visuals settings (your SVG backgrounds)
  background: {
    enabled: true,
    intensity: 0.03,         // Subtle but visible
    blurAmount: 2,           // Soft blur for background effect
    animateWithAudio: true,  // Subtle pulse with audio
    rotateCollection: true,  // Rotate through different background SVGs
    rotateInterval: 30000,   // Change background every 30 seconds
    useGradientOverlay: true // Add gradient overlay for depth
  },
  
  // Floating elements settings (BeyMedia + BeyGen logos)
  floating: {
    enabled: true,
    count: 3,                // BeyMedia + BeyGen + Footer logos
    opacity: 0.12,           // Visible but not distracting
    size: 'small',           // small, medium, large  
    speed: 'slow',           // slow, medium, fast
    beyMediaPriority: true,  // Give BeyMedia logo priority
    includeBeyGen: true,     // Include BeyGen engine branding
    rotationEffect: true     // Gentle rotation as they float
  },
  
  // Chat accent settings
  chatAccent: {
    enabled: true,
    opacity: 0.25,           // Visible brand presence in chat
    showOnUserMessages: true,
    showOnBotMessages: true,
    useBeyGenForAI: true,    // Use BeyGen logo for AI messages
    useBeyMediaForUser: true // Use BeyMedia logo for user messages
  },
  
  // Typography settings (your custom fonts)
  typography: {
    enabled: true,
    primaryFont: 'FilsonPro',        // Main UI font
    headingFont: 'FilsonProBold',    // Headings and emphasis
    accentFont: 'FuturaPTLight',     // Futuristic accent text
    specialFont: 'RegulatorNova',    // Special elements
    loadCustomFonts: true            // Enable custom font loading
  },
  
  // Particle system settings
  particles: {
    enabled: true,
    count: 8,                // More particles for richer effect
    opacity: 0.08,           // Very subtle
    animationSpeed: 'slow',
    useBrandLogos: true,     // Use actual brand logos as particles
    includeBackground: false // Don't use background SVGs as particles
  },
  
  // Theme integration
  themeIntegration: {
    enabled: true,
    adaptToColorMode: true,   // Adapt opacity/colors to current theme
    enhanceWithBranding: true, // Add brand colors to theme palette
    useGradientAccents: true   // Use brand gradients in UI elements
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