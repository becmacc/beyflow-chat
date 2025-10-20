// Brand Asset Test - Run this in browser console to verify assets
console.log('🎨 Testing BeyFlow Brand Assets...')

const brandAssets = {
  beyMediaLogo: '/brand/beymedia-logo.png',
  logosPrimary: '/brand/logo-primary.png',
  logosSecondary: '/brand/logo-secondary.png',
  iconMain: '/brand/icon-main.png',
  iconAccent: '/brand/icon-accent.png',
  patternTexture: '/brand/pattern-texture.png',
  patternGeometric: '/brand/pattern-geometric.png',
  brandElement1: '/brand/brand-element-1.png',
  brandElement2: '/brand/brand-element-2.png'
}

// Test function to check asset loading
async function testBrandAssets() {
  const results = {}
  
  for (const [name, path] of Object.entries(brandAssets)) {
    try {
      const img = new Image()
      const loadPromise = new Promise((resolve, reject) => {
        img.onload = () => resolve({ name, path, status: '✅ Loaded', dimensions: `${img.width}x${img.height}` })
        img.onerror = () => reject({ name, path, status: '❌ Failed' })
      })
      img.src = path
      results[name] = await loadPromise
    } catch (error) {
      results[name] = { name, path, status: '❌ Failed', error: error.message }
    }
  }
  
  console.table(results)
  return results
}

// Run the test
testBrandAssets().then(results => {
  const loaded = Object.values(results).filter(r => r.status.includes('✅')).length
  const total = Object.keys(results).length
  console.log(`🎯 Brand Assets Status: ${loaded}/${total} loaded successfully`)
  
  if (loaded === total) {
    console.log('🚀 All brand assets are ready for integration!')
  } else {
    console.log('⚠️  Some assets failed to load - check file paths and names')
  }
})