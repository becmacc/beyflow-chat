/**
 * BeyFlow Integration Status Panel
 * Shows real-time status of all connected components
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntegrationStatusPanel = ({ isVisible = true, position = "top-left" }) => {
  const [status, setStatus] = useState({
    core: false,
    components: {},
    automationRules: 0,
    workflows: 0
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (!window.BeyFlowIntegration) return;

    // Subscribe to status updates
    const unsubscribe = window.BeyFlow?.subscribe('integration:status_updated', (newStatus) => {
      setStatus(newStatus);
      setLastUpdate(Date.now());
    });

    // Initial status check
    const checkStatus = () => {
      if (window.BeyFlowIntegration) {
        const currentStatus = window.BeyFlowIntegration.getIntegrationStatus();
        setStatus(currentStatus);
        setLastUpdate(Date.now());
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Update every 5 seconds

    return () => {
      clearInterval(interval);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case "top-left": return "top-4 left-4";
      case "top-right": return "top-4 right-4";
      case "bottom-left": return "bottom-4 left-4";
      case "bottom-right": return "bottom-4 right-4";
      default: return "top-4 left-4";
    }
  };

  const getStatusColor = (connected) => {
    return connected ? "text-green-400" : "text-red-400";
  };

  const getStatusIcon = (connected) => {
    return connected ? "🟢" : "🔴";
  };

  const componentIcons = {
    beytv: "📺",
    stackblog: "📝", 
    omnisphere: "🤖",
    chat: "💬"
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50 font-mono text-xs`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-lg overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between px-3 py-2 bg-cyan-500/10 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400">🔗</span>
            <span className="text-white font-semibold">BeyFlow</span>
            {status.core && <span className="text-green-400 text-xs">LIVE</span>}
          </div>
          <button className="text-cyan-400 hover:text-white">
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
                {/* Core Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Core</span>
                  <span className={getStatusColor(status.core)}>
                    {getStatusIcon(status.core)} {status.core ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Component Status */}
                <div className="space-y-1">
                  <div className="text-gray-500 text-xs border-b border-gray-700 pb-1">Components</div>
                  {Object.entries(status.components || {}).map(([name, component]) => (
                    <div key={name} className="flex items-center justify-between">
                      <span className="text-gray-400 flex items-center space-x-1">
                        <span>{componentIcons[name] || "📦"}</span>
                        <span>{name}</span>
                      </span>
                      <span className={getStatusColor(component.connected)}>
                        {getStatusIcon(component.connected)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Automation Stats */}
                <div className="space-y-1 pt-2 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rules</span>
                    <span className="text-blue-400">{status.automationRules || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Workflows</span>
                    <span className="text-purple-400">{status.workflows || 0}</span>
                  </div>
                </div>

                {/* Last Update */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="text-gray-500 text-xs">
                    Updated: {new Date(lastUpdate).toLocaleTimeString()}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-2 space-y-1">
                  <button 
                    className="w-full px-2 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded text-xs transition-colors"
                    onClick={() => {
                      if (window.BeyFlowIntegration) {
                        const status = window.BeyFlowIntegration.getIntegrationStatus();
                        console.log('🔍 BeyFlow Status:', status);
                      }
                    }}
                  >
                    Refresh Status
                  </button>
                  
                  <button 
                    className="w-full px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded text-xs transition-colors"
                    onClick={() => {
                      if (window.BeyFlow) {
                        window.BeyFlow.emit('integration:manual_check', { timestamp: Date.now() });
                      }
                    }}
                  >
                    Check Connections
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

export default IntegrationStatusPanel;