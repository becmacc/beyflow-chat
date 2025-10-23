import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'

export default function InstagramBrowser() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const openInstagram = () => {
    window.open('https://www.instagram.com/', '_blank')
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={openInstagram}
      className={`flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white ${theme.rounded} shadow-lg hover:shadow-xl transition-all`}
    >
      <Instagram size={18} />
      <span className={`${theme.font} text-sm font-bold`}>
        {theme.id === 'glassmorphic' ? 'Instagram' : '[INSTAGRAM]'}
      </span>
    </motion.button>
  )
}
