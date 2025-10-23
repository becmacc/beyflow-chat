/**
 * Dynamic Brand Background Component
 * Rotates through your SVG backgrounds with smooth transitions
 */

import { useState, useEffect } from 'react'
import { Button, Card, Input, Modal } from "../core/StandardComponents";
import { motion, AnimatePresence } from 'framer-motion';
import { brandAssets, brandConfig, brandColors } from '../config/brandConfig';

const DynamicBrandBackground = ({ audioData, spectrum }) => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(brandConfig.background.enabled);
  
  const backgrounds = brandAssets.backgroundVisuals;
  
  // Rotate through backgrounds
  useEffect(() => {
    if (!brandConfig.background.rotateCollection || backgrounds.length <= 1) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentBgIndex(prev => (prev + 1) % backgrounds.length);
    }, brandConfig.background.rotateInterval);
    
    return () => clearInterval(interval);
  }, [backgrounds.length]);
  
  // Get current background
  const currentBackground = backgrounds[currentBgIndex];
  
  // Dynamic intensity based on audio and spectrum
  const getIntensity = () => {
    let baseIntensity = brandConfig.background.intensity;
    
    if (spectrum && brandConfig.background.animateWithAudio) {
      const audioBoost = (spectrum.glow || 0) * 0.02;
      baseIntensity += audioBoost;
    }
    
    return Math.min(baseIntensity, 0.1); // Cap at 10% opacity
  };
  
  // Dynamic blur based on spectrum
  const getBlur = () => {
    let baseBlur = brandConfig.background.blurAmount;
    
    if (spectrum) {
      const blurAdjust = (spectrum.blur || 0) * 2;
      baseBlur += blurAdjust;
    }
    
    return `${baseBlur}px`;
  };
  
  // Dynamic scale for subtle audio responsiveness
  const getScale = () => {
    if (!spectrum || !brandConfig.background.animateWithAudio) {
      return 1;
    }
    
    const audioScale = 1 + (spectrum.glow || 0) * 0.02;
    return audioScale;
  };
  
  if (!isVisible || !currentBackground) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: getIntensity() }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {/* Primary Background */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentBackground})`,
              filter: `blur(${getBlur()})`,
            }}
            animate={{
              scale: getScale()
            }}
            transition={{
              scale: { duration: 0.5, ease: "easeOut" }
            }}
          />
          
          {/* Gradient Overlay */}
          {brandConfig.background.useGradientOverlay && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: brandColors.gradients.unified,
                opacity: 0.1
              }}
              animate={{
                opacity: 0.05 + (spectrum?.saturation || 0) * 0.05
              }}
            />
          )}
          
          {/* Brand Color Accent Layer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${brandColors.beyMediaPrimary}20, transparent 70%)`,
            }}
            animate={{
              opacity: spectrum?.glow ? spectrum.glow * 0.3 : 0.15,
              scale: getScale()
            }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Background Info (Dev Mode) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 bg-black/50 text-white p-2 rounded text-xs font-mono z-50">
          <div>BG: {currentBackground.split('/').pop()}</div>
          <div>Intensity: {(getIntensity() * 100).toFixed(1)}%</div>
          <div>Index: {currentBgIndex + 1}/{backgrounds.length}</div>
        </div>
      )}
    </div>
  );
};

export default DynamicBrandBackground;