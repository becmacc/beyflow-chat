/**
 * Custom Font Loader for BeyFlow
 * Loads and applies your custom brand fonts
 */

import { useEffect } from 'react'
import { Button, Card, Input, Modal } from "../core/StandardComponents";
import { brandAssets, brandConfig } from '../config/brandConfig';

const CustomFontLoader = () => {
  useEffect(() => {
    if (!brandConfig.typography.enabled || !brandConfig.typography.loadCustomFonts) {
      return;
    }

    console.log('🔤 Loading custom brand fonts...');

    // Create font face declarations
    const fontFaces = [
      {
        family: 'FilsonPro',
        src: brandAssets.fonts.filsonPro,
        weight: 'normal',
        style: 'normal'
      },
      {
        family: 'FilsonProBold', 
        src: brandAssets.fonts.filsonProBold,
        weight: 'bold',
        style: 'normal'
      },
      {
        family: 'FuturaPTLight',
        src: brandAssets.fonts.futuraPTLight,
        weight: '300',
        style: 'normal'
      },
      {
        family: 'RegulatorNova',
        src: brandAssets.fonts.regulatorNovaLight,
        weight: '300', 
        style: 'normal'
      }
    ];

    // Load fonts using CSS Font Loading API
    const loadFont = async (fontFace) => {
      try {
        const font = new FontFace(fontFace.family, `url(${fontFace.src})`, {
          weight: fontFace.weight,
          style: fontFace.style
        });

        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        
        console.log(`✅ Loaded font: ${fontFace.family}`);
        return true;
      } catch (error) {
        console.warn(`❌ Failed to load font ${fontFace.family}:`, error);
        return false;
      }
    };

    // Load all fonts
    Promise.all(fontFaces.map(loadFont)).then(results => {
      const loadedCount = results.filter(Boolean).length;
      console.log(`🔤 Font loading complete: ${loadedCount}/${fontFaces.length} fonts loaded`);
      
      if (loadedCount > 0) {
        // Apply fonts to CSS custom properties
        applyFontVariables();
        
        // Trigger font-loaded event
        document.dispatchEvent(new CustomEvent('beyflow:fonts-loaded', {
          detail: { loadedCount, total: fontFaces.length }
        }));
      }
    });

  }, []);

  const applyFontVariables = () => {
    const root = document.documentElement;
    
    // Set CSS custom properties for fonts
    root.style.setProperty('--font-filson-pro', 'FilsonPro, -apple-system, BlinkMacSystemFont, sans-serif');
    root.style.setProperty('--font-filson-bold', 'FilsonProBold, -apple-system, BlinkMacSystemFont, sans-serif');
    root.style.setProperty('--font-futura-light', 'FuturaPTLight, -apple-system, BlinkMacSystemFont, sans-serif');
    root.style.setProperty('--font-regulator-nova', 'RegulatorNova, -apple-system, BlinkMacSystemFont, sans-serif');
    
    // Set primary font hierarchy
    root.style.setProperty('--font-primary', 'var(--font-filson-pro)');
    root.style.setProperty('--font-heading', 'var(--font-filson-bold)');
    root.style.setProperty('--font-accent', 'var(--font-futura-light)');
    root.style.setProperty('--font-special', 'var(--font-regulator-nova)');
    
    console.log('🎨 Font CSS variables applied');
  };

  return null; // This component doesn't render anything
};

// CSS classes for easy font application
export const fontClasses = {
  primary: 'font-filson-pro',
  heading: 'font-filson-bold', 
  accent: 'font-futura-light',
  special: 'font-regulator-nova'
};

// Hook to use brand fonts
export const useBrandFonts = () => {
  return {
    primary: 'var(--font-primary)',
    heading: 'var(--font-heading)',
    accent: 'var(--font-accent)',
    special: 'var(--font-special)',
    classes: fontClasses
  };
};

export default CustomFontLoader;