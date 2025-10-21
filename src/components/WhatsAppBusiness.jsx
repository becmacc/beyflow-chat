import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Minimize2, Maximize2, ExternalLink } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function WhatsAppBusiness() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  const [isMinimized, setIsMinimized] = useState(true)
  
  const openWhatsApp = () => {
    window.open('https://web.whatsapp.com', '_blank', 'width=1200,height=800')
  }
  
  return (
    <motion.div
      className={`${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}
      style={{
        background: theme.id === 'terminal' 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,40,20,0.4) 100%)'
          : 'linear-gradient(135deg, rgba(37,211,102,0.15) 0%, rgba(0,168,132,0.15) 100%)',
        border: theme.id === 'terminal' ? '1px solid rgba(37,211,102,0.3)' : '1px solid rgba(37,211,102,0.3)',
        boxShadow: '0 8px 32px rgba(37,211,102,0.2)'
      }}
      animate={{
        width: isMinimized ? '56px' : '280px',
        height: isMinimized ? '56px' : 'auto'
      }}
      transition={{ duration: 0.3 }}
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className={`w-full h-full flex items-center justify-center transition-all hover:bg-green-500/10`}
        >
          <MessageCircle className="text-green-500" size={28} />
        </button>
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-green-500" size={24} />
              <div>
                <div className={`${theme.font} text-green-400 text-sm font-bold`}>
                  WhatsApp Business
                </div>
                <div className={`${theme.font} ${theme.colors.textMuted} text-[9px]`}>
                  Quick Connect
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1.5 ${theme.rounded} transition-all ${theme.id === 'terminal' ? 'hover:bg-green-500/10' : 'hover:bg-white/10'}`}
            >
              <Minimize2 className={theme.colors.textMuted} size={14} />
            </button>
          </div>
          
          <button
            onClick={openWhatsApp}
            className={`w-full ${theme.rounded} px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg`}
          >
            <ExternalLink size={16} />
            Open WhatsApp Web
          </button>
          
          <div className={`mt-3 pt-3 border-t ${theme.id === 'terminal' ? 'border-green-500/20' : 'border-white/10'}`}>
            <div className={`${theme.font} ${theme.colors.textMuted} text-[9px] text-center mb-2`}>
              Connect your business account
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://business.whatsapp.com', '_blank')}
                className={`flex-1 ${theme.rounded} px-2 py-1.5 text-[10px] ${theme.font} transition-all ${theme.id === 'terminal' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/40'}`}
              >
                📱 Business
              </button>
              <button
                onClick={() => window.open('https://developers.facebook.com/docs/whatsapp', '_blank')}
                className={`flex-1 ${theme.rounded} px-2 py-1.5 text-[10px] ${theme.font} transition-all ${theme.id === 'terminal' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/40'}`}
              >
                🔧 API
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
