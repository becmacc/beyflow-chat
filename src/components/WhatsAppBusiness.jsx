import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function WhatsAppBusiness() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const openWhatsApp = () => {
    window.open('https://web.whatsapp.com', '_blank', 'width=1200,height=800')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={openWhatsApp}
      className={`flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white ${theme.rounded} shadow-lg hover:shadow-xl transition-all`}
    >
      <MessageCircle size={18} />
      <span className={`${theme.font} text-sm font-bold`}>
        {theme.id === 'glassmorphic' ? 'WhatsApp Web' : '[WHATSAPP]'}
      </span>
    </motion.button>
  )
}
