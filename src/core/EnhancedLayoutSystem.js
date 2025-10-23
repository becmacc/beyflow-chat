import { motion, AnimatePresence } from "framer-motion"
import { useState, createContext, useContext } from "react"
import { useBeyFlowStore } from "./UnifiedStore"

// 🏗️ Enhanced Layout System with Notion-like Organization
// Eliminates overlapping elements and provides clean hierarchy

const LayoutContext = createContext()

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return context
}

// Main layout provider
export const LayoutProvider = ({ children }) => {
  const [activePanel, setActivePanel] = useState(null)
  const [sidePanels, setSidePanels] = useState({})
  const [notifications, setNotifications] = useState([])
  
  const registerPanel = (id, config) => {
    setSidePanels(prev => ({ ...prev, [id]: config }))
  }
  
  const togglePanel = (id) => {
    setActivePanel(prev => prev === id ? null : id)
  }
  
  const addNotification = (notification) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { ...notification, id }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, notification.duration || 5000)
  }
  
  return (
    <LayoutContext.Provider value={{
      activePanel,
      setActivePanel,
      sidePanels,
      registerPanel,
      togglePanel,
      notifications,
      addNotification
    }}>
      {children}
    </LayoutContext.Provider>
  )
}

// Clean main layout structure
export const EnhancedLayout = ({ children }) => {
  const { activePanel, sidePanels, notifications } = useLayout()
  const sidebarCollapsed = useBeyFlowStore(state => state.ui.sidebarCollapsed)
  
  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Effects Layer */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-900 to-black" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>
      
      {/* Sidebar - Collapsible */}
      <motion.aside 
        className="relative border-r border-white/10 backdrop-blur-xl bg-black/20"
        animate={{ width: sidebarCollapsed ? 60 : 240 }}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
      >
        <div className="h-full flex flex-col">
          {children.sidebar}
        </div>
      </motion.aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-14 border-b border-white/10 backdrop-blur-xl bg-black/20 flex items-center justify-between px-6">
          {children.header}
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex min-h-0">
          {/* Primary Content */}
          <div className="flex-1 flex flex-col">
            {children.main}
          </div>
          
          {/* Dynamic Side Panel */}
          <AnimatePresence>
            {activePanel && sidePanels[activePanel] && (
              <motion.aside
                className="w-80 border-l border-white/10 backdrop-blur-xl bg-black/20"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">
                      {sidePanels[activePanel].title}
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {sidePanels[activePanel].content}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Floating Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 text-white shadow-2xl max-w-sm"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">{notification.icon}</span>
                <div>
                  <h4 className="font-medium">{notification.title}</h4>
                  {notification.message && (
                    <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Enhanced component zones
export const ComponentZone = ({ 
  zone, 
  children, 
  className = "",
  padding = true 
}) => {
  const zoneStyles = {
    'top-bar': 'h-14 flex items-center justify-between',
    'sidebar': 'w-full h-full flex flex-col',
    'main-content': 'flex-1 flex flex-col overflow-hidden',
    'floating': 'fixed z-40',
    'modal': 'fixed inset-0 z-50 flex items-center justify-center',
    'notification': 'fixed top-4 right-4 z-50'
  }
  
  return (
    <div className={`
      ${zoneStyles[zone] || ''}
      ${padding ? 'p-4' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

// Modern card container with consistent spacing
export const CardContainer = ({ 
  children, 
  title, 
  subtitle,
  action,
  variant = "default",
  className = ""
}) => {
  const variants = {
    default: "bg-white/5 border-white/10",
    elevated: "bg-white/10 border-white/20 shadow-2xl shadow-cyan-500/10",
    minimal: "bg-transparent border-white/5",
    accent: "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20"
  }
  
  return (
    <motion.div
      className={`
        backdrop-blur-xl border rounded-2xl
        ${variants[variant]}
        ${className}
      `}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  )
}

// Grid layout system for organized content
export const GridLayout = ({ 
  children, 
  columns = 3, 
  gap = 6,
  responsive = true 
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  }
  
  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4', 
    6: 'gap-6',
    8: 'gap-8'
  }
  
  return (
    <div className={`
      grid ${responsive ? gridClasses[columns] : `grid-cols-${columns}`}
      ${gapClasses[gap]}
      w-full
    `}>
      {children}
    </div>
  )
}

export default {
  LayoutProvider,
  EnhancedLayout,
  ComponentZone,
  CardContainer,
  GridLayout,
  useLayout
}