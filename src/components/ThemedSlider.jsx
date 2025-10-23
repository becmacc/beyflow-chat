import { useState } from 'react'
import ReactSlider from 'react-slider'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'
import './ThemedSlider.css'

export default function ThemedSlider({ 
  min = 0, 
  max = 100, 
  defaultValue = 50, 
  step = 1,
  label,
  onChange,
  showValue = true
}) {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const theme = getTheme(themePersona)
  const [value, setValue] = useState(defaultValue)

  const handleChange = (newValue) => {
    setValue(newValue)
    onChange?.(newValue)
  }

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className={`text-sm ${theme.font} ${theme.colors.text}`}>
            {theme.id === 'terminal' ? `[${label.toUpperCase()}]` : label}
          </label>
          {showValue && (
            <span className={`text-sm ${theme.font} ${theme.colors.textMuted}`}>
              {value}
            </span>
          )}
        </div>
      )}
      <ReactSlider
        className={`themed-slider ${theme.id}`}
        thumbClassName={`themed-slider-thumb ${theme.id}`}
        trackClassName={`themed-slider-track ${theme.id}`}
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
        ariaLabel={[label || 'Slider']}
      />
    </div>
  )
}
