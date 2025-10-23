/**
 * Brand Integration Status
 * Shows current brand assets and font loading status
 */

import { useState, useEffect } from 'react'
import { Button, Card, Input, Modal } from "../core/StandardComponents";
import { motion, AnimatePresence } from 'framer-motion';
import { brandAssets, brandConfig, brandColors } from '../config/brandConfig';

const BrandIntegrationStatus = ({ isVisible = true, position = "top-right" }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loadedFonts, setLoadedFonts] = useState(0);
  const [totalFonts, setTotalFonts] = useState(4);
  const [assetsStatus, setAssetsStatus] = useState({});
  const [isMinimized, setIsMinimized] = useState(true);

  useEffect(() => {
    // Listen for font loading events
    const handleFontsLoaded = (event) => {
      setLoadedFonts(event.detail.loadedCount);
      setTotalFonts(event.detail.total);
      setFontsLoaded(event.detail.loadedCount > 0);
    };

    document.addEventListener('beyflow:fonts-loaded', handleFontsLoaded);

    // Check asset availability
    checkAssetStatus();

    // Check fonts immediately
    checkFontStatus();

    return () => {
      document.removeEventListener('beyflow:fonts-loaded', handleFontsLoaded);
    };
  }, []);

  const checkFontStatus = () => {
    // Check if fonts are available
    if (document.fonts) {
      document.fonts.ready.then(() => {
        const fontFamilies = ['FilsonPro', 'FilsonProBold', 'FuturaPTLight', 'RegulatorNova'];
        let loaded = 0;
        
        fontFamilies.forEach(family => {
          if (document.fonts.check(`16px ${family}`)) {
            loaded++;
          }
        });
        
        setLoadedFonts(loaded);
        setFontsLoaded(loaded > 0);
      });
    }
  };

  const checkAssetStatus = async () => {
    const assets = [
      { name: 'BeyMedia Logo', url: brandAssets.beyMediaLogo },
      { name: 'BeyGen Logo', url: brandAssets.beyGenLogo },
      { name: 'Footer Logo', url: brandAssets.footerLogo },
      { name: 'Background 1', url: brandAssets.backgroundVisuals[0] },
      { name: 'Background 2', url: brandAssets.backgroundVisuals[1] }
    ];

    const status = {};
    
    for (const asset of assets) {
      try {
        const response = await fetch(asset.url);
        status[asset.name] = response.ok;
      } catch {
        status[asset.name] = false;
      }
    }
    
    setAssetsStatus(status);
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "top-4 left-4";
      case "top-right": return "top-4 right-4";
      case "bottom-left": return "bottom-4 left-4";
      case "bottom-right": return "bottom-4 right-4";
      default: return "top-4 right-4";
    }
  };

  const getStatusIcon = (status) => {
    return status ? "✅" : "❌";
  };

  const getBrandHealthScore = () => {
    const fontScore = (loadedFonts / totalFonts) * 50;
    const assetCount = Object.keys(assetsStatus).length;
    const assetScore = assetCount > 0 
      ? (Object.values(assetsStatus).filter(Boolean).length / assetCount) * 50
      : 0;
    
    return Math.round(fontScore + assetScore);
  };

  if (!isVisible) return null;

  const healthScore = getBrandHealthScore();

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50 font-mono text-xs`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-lg overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between px-3 py-2 bg-purple-500/10 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">🎨</span>
            <span className="text-white font-semibold">Brand</span>
            <span className={`text-xs px-1 rounded ${
              healthScore >= 80 ? 'bg-green-500/20 text-green-400' :
              healthScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {healthScore}%
            </span>
          </div>
          <button className="text-purple-400 hover:text-white">
            {isMinimized ? "+" : "−"}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-2">
                {/* Font Status */}
                <div className="space-y-1">
                  <div className="text-gray-500 text-xs border-b border-gray-700 pb-1">Fonts</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">FilsonPro</span>
                    <span className={fontsLoaded ? "text-green-400" : "text-red-400"}>
                      {getStatusIcon(document.fonts?.check('16px FilsonPro'))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">FuturaPT</span>
                    <span className={fontsLoaded ? "text-green-400" : "text-red-400"}>
                      {getStatusIcon(document.fonts?.check('16px FuturaPTLight'))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Loaded</span>
                    <span className="text-blue-400">{loadedFonts}/{totalFonts}</span>
                  </div>
                </div>

                {/* Asset Status */}
                <div className="space-y-1 pt-2 border-t border-gray-700">
                  <div className="text-gray-500 text-xs border-b border-gray-700 pb-1">Assets</div>
                  {Object.entries(assetsStatus).map(([name, status]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-gray-400 truncate" title={name}>
                        {name.length > 12 ? name.substring(0, 12) + '...' : name}
                      </span>
                      <span className={status ? "text-green-400" : "text-red-400"}>
                        {getStatusIcon(status)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Configuration Status */}
                <div className="space-y-1 pt-2 border-t border-gray-700">
                  <div className="text-gray-500 text-xs border-b border-gray-700 pb-1">Config</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Watermark</span>
                    <span className={brandConfig.watermark.enabled ? "text-green-400" : "text-gray-400"}>
                      {getStatusIcon(brandConfig.watermark.enabled)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Background</span>
                    <span className={brandConfig.background.enabled ? "text-green-400" : "text-gray-400"}>
                      {getStatusIcon(brandConfig.background.enabled)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Typography</span>
                    <span className={brandConfig.typography.enabled ? "text-green-400" : "text-gray-400"}>
                      {getStatusIcon(brandConfig.typography.enabled)}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-2 space-y-1">
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      checkAssetStatus();
                      checkFontStatus();
                    }}
                  >
                    Refresh Status
                  </button>
                  
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      console.log('🎨 Brand Assets:', brandAssets);
                      console.log('🎨 Brand Config:', brandConfig);
                      console.log('🎨 Brand Colors:', brandColors);
                    }}
                  >
                    Log Brand Data
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BrandIntegrationStatus;