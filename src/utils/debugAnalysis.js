/**
 * BeyFlow Debug Analysis - No Installation Required
 * Analyzes integration and branding without external dependencies
 */

export function runDebugAnalysis() {
  console.log('🔍 Starting BeyFlow Debug Analysis...');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    results: [],
    errors: [],
    warnings: [],
    summary: {}
  };

  // 1. Check Integration System
  console.log('📊 Analyzing Integration System...');
  
  const integrationCheck = {
    name: 'Integration System',
    status: 'checking',
    details: {}
  };

  try {
    // Check BeyFlow Core
    integrationCheck.details.core = {
      available: typeof window.BeyFlow !== 'undefined',
      type: typeof window.BeyFlow,
      methods: window.BeyFlow ? Object.keys(window.BeyFlow) : []
    };

    // Check Integration Manager
    integrationCheck.details.manager = {
      available: typeof window.BeyFlowIntegration !== 'undefined',
      type: typeof window.BeyFlowIntegration,
      initialized: window.BeyFlowIntegration?.isInitialized || false
    };

    // Check Component Status
    if (window.BeyFlowIntegration) {
      integrationCheck.details.status = window.BeyFlowIntegration.getIntegrationStatus();
    }

    integrationCheck.status = 'completed';
    analysis.results.push(integrationCheck);
    
  } catch (error) {
    integrationCheck.status = 'error';
    integrationCheck.error = error.message;
    analysis.errors.push(`Integration check failed: ${error.message}`);
  }

  // 2. Check Brand Assets
  console.log('🎨 Analyzing Brand Assets...');
  
  const brandCheck = {
    name: 'Brand Assets',
    status: 'checking',
    details: {}
  };

  try {
    // Check if brand config is loaded
    const brandConfigAvailable = typeof window !== 'undefined' && 
      document.querySelector('link[href*="brand"]') !== null;
    
    brandCheck.details.config = {
      loaded: brandConfigAvailable,
      assetsPath: '/brand/',
      fontsPath: '/fonts/',
      backgroundsPath: '/backgrounds/'
    };

    // Check specific assets
    const assetsToCheck = [
      'beymedia-logo.svg',
      'beygen-logo.png', 
      'footer-logo.svg'
    ];

    brandCheck.details.assets = {};
    
    // We can't actually fetch in this context, so we'll check the DOM
    assetsToCheck.forEach(asset => {
      const exists = document.querySelector(`img[src*="${asset}"]`) !== null;
      brandCheck.details.assets[asset] = exists;
    });

    // Check fonts
    brandCheck.details.fonts = {
      filsonPro: document.fonts ? document.fonts.check('16px FilsonPro') : 'unknown',
      filsonBold: document.fonts ? document.fonts.check('16px FilsonProBold') : 'unknown',
      futuraPT: document.fonts ? document.fonts.check('16px FuturaPTLight') : 'unknown',
      regulatorNova: document.fonts ? document.fonts.check('16px RegulatorNova') : 'unknown'
    };

    brandCheck.status = 'completed';
    analysis.results.push(brandCheck);
    
  } catch (error) {
    brandCheck.status = 'error';
    brandCheck.error = error.message;
    analysis.errors.push(`Brand check failed: ${error.message}`);
  }

  // 3. Check File Structure
  console.log('📁 Analyzing File Structure...');
  
  const fileStructureCheck = {
    name: 'File Structure',
    status: 'checking',
    details: {}
  };

  try {
    // Check critical files exist (by checking if they're referenced)
    const scripts = Array.from(document.scripts);
    const links = Array.from(document.querySelectorAll('link'));
    
    fileStructureCheck.details.scripts = {
      count: scripts.length,
      hasMain: scripts.some(s => s.src.includes('main')),
      hasVite: scripts.some(s => s.src.includes('vite'))
    };

    fileStructureCheck.details.stylesheets = {
      count: links.filter(l => l.rel === 'stylesheet').length,
      hasIndex: links.some(l => l.href.includes('index.css'))
    };

    fileStructureCheck.status = 'completed';
    analysis.results.push(fileStructureCheck);
    
  } catch (error) {
    fileStructureCheck.status = 'error';
    fileStructureCheck.error = error.message;
    analysis.errors.push(`File structure check failed: ${error.message}`);
  }

  // 4. Check Dependencies
  console.log('📦 Analyzing Dependencies...');
  
  const dependencyCheck = {
    name: 'Dependencies',
    status: 'checking',
    details: {}
  };

  try {
    // Check React
    dependencyCheck.details.react = {
      available: typeof React !== 'undefined' || window.React !== undefined,
      version: window.React?.version || 'unknown'
    };

    // Check Framer Motion
    dependencyCheck.details.framerMotion = {
      available: document.querySelector('[data-framer-motion]') !== null ||
                 window.FramerMotion !== undefined
    };

    // Check Three.js
    dependencyCheck.details.threejs = {
      available: window.THREE !== undefined ||
                 document.querySelector('canvas') !== null
    };

    // Check Tailwind
    dependencyCheck.details.tailwind = {
      available: document.querySelector('[class*="bg-"]') !== null ||
                 document.querySelector('[class*="text-"]') !== null
    };

    dependencyCheck.status = 'completed';
    analysis.results.push(dependencyCheck);
    
  } catch (error) {
    dependencyCheck.status = 'error';
    dependencyCheck.error = error.message;
    analysis.errors.push(`Dependency check failed: ${error.message}`);
  }

  // 5. Check Component Health
  console.log('🏥 Analyzing Component Health...');
  
  const componentHealthCheck = {
    name: 'Component Health',
    status: 'checking',
    details: {}
  };

  try {
    // Check if main app is running
    componentHealthCheck.details.app = {
      mounted: document.getElementById('root') !== null,
      hasContent: document.getElementById('root')?.children.length > 0
    };

    // Check for common components
    const componentSelectors = [
      '[class*="chat"]',
      '[class*="sidebar"]', 
      '[class*="brand"]',
      'canvas',
      '[class*="status"]'
    ];

    componentHealthCheck.details.components = {};
    componentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      componentHealthCheck.details.components[selector] = elements.length;
    });

    componentHealthCheck.status = 'completed';
    analysis.results.push(componentHealthCheck);
    
  } catch (error) {
    componentHealthCheck.status = 'error';
    componentHealthCheck.error = error.message;
    analysis.errors.push(`Component health check failed: ${error.message}`);
  }

  // 6. Performance Analysis
  console.log('⚡ Analyzing Performance...');
  
  const performanceCheck = {
    name: 'Performance',
    status: 'checking',
    details: {}
  };

  try {
    // Basic performance metrics
    performanceCheck.details.memory = {
      used: performance.memory?.usedJSHeapSize || 'unknown',
      total: performance.memory?.totalJSHeapSize || 'unknown',
      limit: performance.memory?.jsHeapSizeLimit || 'unknown'
    };

    performanceCheck.details.timing = {
      domLoaded: performance.timing?.domContentLoadedEventEnd - performance.timing?.navigationStart || 'unknown',
      fullyLoaded: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 'unknown'
    };

    performanceCheck.details.resources = {
      count: performance.getEntriesByType('resource').length,
      scripts: performance.getEntriesByType('resource').filter(r => r.name.includes('.js')).length,
      styles: performance.getEntriesByType('resource').filter(r => r.name.includes('.css')).length,
      images: performance.getEntriesByType('resource').filter(r => r.name.match(/\.(png|jpg|jpeg|svg|gif)$/)).length
    };

    performanceCheck.status = 'completed';
    analysis.results.push(performanceCheck);
    
  } catch (error) {
    performanceCheck.status = 'error';
    performanceCheck.error = error.message;
    analysis.errors.push(`Performance check failed: ${error.message}`);
  }

  // Generate Summary
  analysis.summary = {
    totalChecks: analysis.results.length,
    successful: analysis.results.filter(r => r.status === 'completed').length,
    failed: analysis.results.filter(r => r.status === 'error').length,
    errors: analysis.errors.length,
    warnings: analysis.warnings.length,
    healthScore: Math.round((analysis.results.filter(r => r.status === 'completed').length / analysis.results.length) * 100)
  };

  // Log Results
  console.log('\n🎯 DEBUG ANALYSIS COMPLETE');
  console.log('=' .repeat(50));
  console.log(`✅ Successful Checks: ${analysis.summary.successful}/${analysis.summary.totalChecks}`);
  console.log(`❌ Failed Checks: ${analysis.summary.failed}`);
  console.log(`⚠️  Warnings: ${analysis.summary.warnings}`);
  console.log(`📊 Health Score: ${analysis.summary.healthScore}%`);
  
  if (analysis.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    analysis.errors.forEach(error => console.log(`  • ${error}`));
  }
  
  if (analysis.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    analysis.warnings.forEach(warning => console.log(`  • ${warning}`));
  }

  console.log('\n📋 DETAILED RESULTS:');
  analysis.results.forEach(result => {
    console.log(`\n${result.status === 'completed' ? '✅' : '❌'} ${result.name}`);
    if (result.details) {
      console.log('  Details:', result.details);
    }
    if (result.error) {
      console.log('  Error:', result.error);
    }
  });

  console.log('\n🔍 Full analysis object available as window.BeyFlowDebugAnalysis');
  window.BeyFlowDebugAnalysis = analysis;
  
  return analysis;
}

// Run analysis automatically after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      console.log('🚀 Auto-running BeyFlow Debug Analysis...');
      runDebugAnalysis();
    }, 3000); // Wait 3 seconds for everything to initialize
  });
}

// Export for manual usage
window.runBeyFlowDebugAnalysis = runDebugAnalysis;