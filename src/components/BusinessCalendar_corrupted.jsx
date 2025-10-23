import { useState, useEffect } from 'react'
import { Button, Card, Input, Modal } from "../core/StandardComponents"
import { motion } from 'framer-motion'
import { Calendar, Clock, Plus, Minimize2, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'

export default function BusinessCalendar() {
  const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const theme = getTheme(themePersona)
  const [isMinimized, setIsMinimized] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek }
  }
  
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }
  
  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }
  
  const isSelected = (day) => {
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear()
  }
  
  return (
    <motion.div
      className={`${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}
      style={{
        background: theme.id === 'terminal' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,40,40,0.4) 100%)'
          : 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(59,130,246,0.1) 100%)',
        border: theme.id === 'terminal' ? '1px solid rgba(0,255,255,0.2)' : '1px solid rgba(255,255,255,0.2)',
        boxShadow: theme.id === 'terminal' 
          ? '0 8px 32px rgba(0,255,255,0.15)' 
          : '0 8px 32px rgba(139,92,246,0.2)'
      }}
      animate={{
        width: isMinimized ? '200px' : '320px',
        height: isMinimized ? '80px' : 'auto'
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className={theme.colors.accent} size={20} />
            <div>
              <div className={`${theme.font} ${theme.colors.text} text-sm font-bold`}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className={`${theme.font} ${theme.colors.textMuted} text-xs flex items-center gap-1`}>
                <Clock size={10} />
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}
          >
            {isMinimized ? <Maximize2 size={14} className={theme.colors.textMuted} /> : <Minimize2 size={14} className={theme.colors.textMuted} />}
          </button>
        </div>
        
        {!isMinimized && (
          <>
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className={`p-1 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}>
                <ChevronLeft size={16} className={theme.colors.text} />
              </button>
              <div className={`${theme.font} ${theme.colors.text} text-sm font-bold`}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <button onClick={nextMonth} className={`p-1 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-cyan-500/10' : 'hover:bg-white/10'}`}>
                <ChevronRight size={16} className={theme.colors.text} />
              </button>
            </div>
            
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className={`${theme.font} ${theme.colors.textMuted} text-[9px] text-center font-medium`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`${theme.rounded} p-1.5 text-xs ${theme.font} transition-all ${
                      isToday(day) 
                        ? theme.id === 'terminal' 
                          ? 'bg-cyan-500 text-black font-bold' 
                          : 'bg-indigo-500 text-white font-bold'
                        : isSelected(day)
                          ? theme.id === 'terminal'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : 'bg-white/20 text-white border border-white/40'
                          : theme.id === 'terminal'
                            ? 'hover:bg-cyan-500/10 text-cyan-400'
                            : 'hover:bg-white/10 text-white'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            
            {/* Integration Buttons */}
            <div className="flex gap-2">
              <button 
                className={`flex-1 ${theme.rounded} px-3 py-2 text-xs ${theme.font} transition-all ${theme.id === 'terminal' ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/40'}`}
                onClick={() => window.open('https://calendar.google.com', '_blank')}
              >
                📅 Google
              </button>
              <button 
                className={`flex-1 ${theme.rounded} px-3 py-2 text-xs ${theme.font} transition-all ${theme.id === 'terminal' ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30' : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-600/40'}`}
                onClick={() => window.open('https://outlook.live.com/calendar', '_blank')}
              >
                📧 Outlook
              </button>
            </div>
            
            <div className={`mt-2 pt-2 border-t ${theme.id === 'terminal' ? 'border-cyan-500/10' : 'border-white/10'}`}>
              <div className={`${theme.font} ${theme.colors.textMuted} text-[9px] text-center`}>
                Click Google or Outlook to sync calendars
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
