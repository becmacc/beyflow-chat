/**
 * Enhanced Brand Watermark Component
 * Displays BeyMedia/BeyGen logos with sophisticated animations
 */

import { useState, useEffect } from 'react'
import { Button, Card, Input, Modal } from "../core/StandardComponents";
import { motion } from 'framer-motion';
import { brandAssets, brandConfig, brandColors } from '../config/brandConfig';

const EnhancedBrandWatermark = ({ audioData, spectrum, colorMode }) => {
  const [currentLogo, setCurrentLogo] = useState('beymedia');
  const [isVisible, setIsVisible] = useState(brandConfig.watermark.enabled);
  
  // Logo rotation for variety
  useEffect(() => {
    const logos = ['beymedia', 'beygen'];
    let logoIndex = 0;
    
    const interval = setInterval(() => {
      logoIndex = (logoIndex + 1) % logos.length;
      setCurrentLogo(logos[logoIndex]);
    }, 15000); // Switch every 15 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Get logo source based on current selection
  const getLogoSrc = () => {
    switch (currentLogo) {
      case 'beygen':
        return brandAssets.beyGenLogo;
      case 'footer':
        return brandAssets.footerLogo;
      default:
        return brandAssets.beyMediaLogo;
    }
  };
  
  // Get logo alt text
  const getLogoAlt = () => {
    switch (currentLogo) {
      case 'beygen':
        return 'BeyGen Engine';
      case 'footer':
        return 'BeyFlow';
      default:
        return 'BeyMedia';
    }
  };
  
  // Dynamic opacity based on color mode and spectrum
  const getOpacity = () => {
    let baseOpacity = brandConfig.watermark.opacity;
    
    // Adjust for color mode
    if (colorMode === 'dark') {
      baseOpacity *= 0.8; // Slightly less visible in dark mode
    }
    
    // Spectrum adjustments
    if (spectrum) {
      const spectrumBoost = (spectrum.glow || 0) * 0.1;
      baseOpacity += spectrumBoost;
    }
    
    return Math.min(baseOpacity, 0.4); // Cap at 40%
  };
  
  // Dynamic scale based on audio and configuration
  const getScale = () => {
    let baseScale = brandConfig.watermark.scale;
    
    if (spectrum && brandConfig.watermark.pulseWithReward) {
      const pulseScale = 1 + (spectrum.glow || 0) * 0.1;
      baseScale *= pulseScale;
    }
    
    return baseScale;
  };
  
  // Rotation animation
  const getRotation = () => {
    if (!brandConfig.watermark.rotateWithAudio || !audioData) {
      return 0;
    }
    
    // Gentle rotation based on audio
    return audioData.volume ? audioData.volume * 5 : 0;
  };
  
  // Position classes
  const getPositionClasses = () => {
    switch (brandConfig.watermark.position) {
      case 'topLeft':
        return 'top-4 left-4';
      case 'topRight':
        return 'top-4 right-4';
      case 'bottomLeft':
        return 'bottom-4 left-4';
      case 'bottomRight':
      default:
        return 'bottom-4 right-4';
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <motion.div
      className={`fixed ${getPositionClasses()} pointer-events-none z-20`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: getOpacity(),
        scale: getScale(),
        rotate: getRotation()
      }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 0.8, ease: "easeOut" },
        rotate: { duration: 2, ease: "easeInOut" }
      }}
    >
      {/* Glow effect for enhanced visibility */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: spectrum?.glow > 0.5 
            ? `0 0 ${spectrum.glow * 20}px ${brandColors.beyMediaPrimary}40`
            : 'none'
        }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Main logo */}
      <motion.img
        src={getLogoSrc()}
        alt={getLogoAlt()}
        className="w-16 h-16 object-contain filter drop-shadow-lg"
        style={{
          filter: `drop-shadow(0 0 8px ${brandColors.beyMediaPrimary}30)`
        }}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.2 }
        }}
      />
      
      {/* Subtle brand indicator */}
      <motion.div
        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full"
        style={{
          backgroundColor: currentLogo === 'beygen' 
            ? brandColors.beyGenPrimary 
            : brandColors.beyMediaPrimary
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Brand text (subtle) */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 1 }}
      >
        {getLogoAlt()}
      </motion.div>
    </motion.div>
  );
};

export default EnhancedBrandWatermark;