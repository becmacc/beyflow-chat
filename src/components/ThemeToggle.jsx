import { motion } from 'framer-motion'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { themes } from '../config/themes'

export default function ThemeToggle() {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const setThemePersona = useBeyFlowStore(state => state.actions.setTheme)
  const currentTheme = themes[themePersona] || themes.dopaminergic || Object.values(themes)[0]

  const themeOptions = Object.values(themes)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      {themeOptions.map(theme => (
        <motion.button
          key={theme.id}
          onClick={() => setThemePersona(theme.id)}
          className={`px-3 py-1.5 text-xs transition-all ${
            themePersona === theme.id
              ? currentTheme.colors.buttonActive + ' ' + currentTheme.rounded
              : currentTheme.colors.button + ' ' + currentTheme.rounded
          } ${currentTheme.font}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={theme.name}
        >
          <span className="mr-1">{theme.icon}</span>
          {theme.name.split(' ')[0]}
        </motion.button>
      ))}
    </motion.div>
  )
}
