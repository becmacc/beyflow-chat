import { useEffect, useState } from 'react'
import { BarChart3, MessageSquare, Clock } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../../config/themes'

export default function AnalyticsModule({ moduleId }) {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const analytics = useBeyFlowStore(state => state.analytics)
  const messages = useBeyFlowStore(state => state.chat.messages)
  const theme = getTheme(themePersona)
  const [sessionTime, setSessionTime] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const messageCount = messages.length
  const avgResponseTime = analytics.responseTime.length > 0
    ? (analytics.responseTime.reduce((a, b) => a + b, 0) / analytics.responseTime.length / 1000).toFixed(2)
    : 0
  
  const stats = [
    { label: 'Messages', value: messageCount, max: 100, icon: MessageSquare },
    { label: 'Session', value: formatTime(sessionTime), max: 100, icon: Clock },
    { label: 'Avg Response', value: `${avgResponseTime}s`, max: 100, icon: BarChart3 }
  ]
  
  return (
    <div className={`h-full flex flex-col ${theme.colors.card} ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''} ${theme.colors.glow}`}>
      <div className={`p-4 border-b ${theme.colors.border} flex items-center gap-2`}>
        <BarChart3 size={16} className={theme.colors.accent} />
        <h3 className={`${theme.font} font-bold ${theme.colors.text}`}>
          {theme.id === 'terminal' ? '> ANALYTICS_CORE' : 'Analytics'}
        </h3>
      </div>
      
      <div className="flex-1 p-4 space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            const percentage = typeof stat.value === 'number' ? (stat.value / stat.max) * 100 : 50
            
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={theme.colors.accent} />
                    <span className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
                      {stat.label}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${theme.colors.text} ${theme.font}`}>
                    {stat.value}
                  </span>
                </div>
                
                <div className={`h-2 ${theme.rounded} overflow-hidden bg-black/30 border ${theme.colors.border}`}>
                  <div
                    className={`h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 ${theme.colors.glow}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="space-y-2">
          <div className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
            {theme.id === 'terminal' ? 'ACTIVITY_GRAPH' : 'Recent Activity'}
          </div>
          <div className="flex items-end justify-between h-24 gap-1">
            {[...Array(12)].map((_, i) => {
              const height = Math.random() * 100
              return (
                <div
                  key={i}
                  className={`flex-1 ${theme.rounded} bg-gradient-to-t from-cyan-500/50 to-purple-500/50 border ${theme.colors.border} transition-all hover:from-cyan-400 hover:to-purple-400`}
                  style={{ height: `${height}%` }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
