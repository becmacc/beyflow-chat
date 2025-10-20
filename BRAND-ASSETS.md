# Brand Assets Inventory

## 📁 Organized PNG Files

Your brand assets have been organized in `/public/brand/` with descriptive names:

### � Primary Brand
- `beymedia-logo.png` - **BeyMedia Logo** (primary watermark and brand element)

### �🎨 Additional Logos  
- `logo-primary.png` - Main company logo (accent brand mark)
- `logo-secondary.png` - Secondary logo variation

### 🔘 Icons  
- `icon-main.png` - Primary icon/symbol
- `icon-accent.png` - Accent icon for variety

### 🌐 Patterns
- `pattern-texture.png` - Textural background pattern
- `pattern-geometric.png` - Geometric background pattern

### ✨ Brand Elements
- `brand-element-1.png` - Additional brand element
- `brand-element-2.png` - Additional brand element

## 🎯 Usage in App

### Current Integration:
- **Primary Watermark**: Uses `beymedia-logo.png` at 3% opacity (center position)
- **Background Patterns**: Alternates between texture and geometric patterns every 30 seconds  
- **Floating Elements**: All 5 assets including BeyMedia logo float at 8% opacity
- **Chat Accents**: Uses `beymedia-logo.png` in chat bubbles
- **Particles**: Creates particle effects using BeyMedia logo
- **Sidebar Branding**: BeyMedia logo appears subtly in navigation

### Brand Configuration:
All settings are in `src/config/brandConfig.js`:
- Opacity levels: 2-8% (ultra-subtle)
- Animation speeds: Slow, gentle movements
- Audio reactivity: Subtle pulses with voice
- Blend modes: Overlay for seamless integration

## ✅ BeyMedia Logo Integrated

The BeyMedia logo is now active as the primary brand element:
- **Primary Watermark**: Center position, 3% opacity with audio reactivity
- **Floating Element**: Gently moves with dopaminergic animations  
- **Chat Integration**: Appears subtly in message bubbles
- **Particle System**: Creates branded particle effects
- **All other assets**: Now serve as accent elements

## 🔧 Customization

To adjust brand visibility:
1. Edit opacity values in `brandConfig.js`
2. Enable/disable specific elements
3. Adjust animation speeds and positions
4. Configure audio reactivity

Current settings ensure brand presence is **subtle and non-disruptive** while maintaining the dopaminergic experience.