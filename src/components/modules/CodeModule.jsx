import { useState } from 'react'
import { Code2, Copy, Play } from 'lucide-react'
import { useBeyFlowStore } from "../../core/UnifiedStore"
import { getTheme } from '../../config/themes'

export default function CodeModule({ moduleId }) {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const theme = getTheme(themePersona)
  
  const [code, setCode] = useState('// Start coding...\nfunction hello() {\n  console.log("Hello, World!");\n}')
  const [language, setLanguage] = useState('javascript')
  
  const languages = ['javascript', 'python', 'html', 'css']
  
  const getLineNumbers = () => {
    const lines = code.split('\n').length
    return Array.from({ length: lines }, (_, i) => i + 1)
  }
  
  const highlightSyntax = (text, lang) => {
    const lines = text.split('\n')
    return lines.map((line, idx) => {
      let highlighted = line
      
      if (lang === 'javascript') {
        highlighted = highlighted
          .replace(/(function|const|let|var|if|else|return|class|import|export|from)/g, '<span class="text-purple-400">$1</span>')
          .replace(/(console|document|window)/g, '<span class="text-cyan-400">$1</span>')
          .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
          .replace(/(\/\/.*$)/g, '<span class="text-gray-500">$1</span>')
      } else if (lang === 'python') {
        highlighted = highlighted
          .replace(/(def|class|if|else|return|import|from|for|while)/g, '<span class="text-purple-400">$1</span>')
          .replace(/(print|range|len)/g, '<span class="text-cyan-400">$1</span>')
          .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
          .replace(/(#.*$)/g, '<span class="text-gray-500">$1</span>')
      } else if (lang === 'html') {
        highlighted = highlighted
          .replace(/(&lt;.*?&gt;)/g, '<span class="text-purple-400">$1</span>')
          .replace(/(class|id|src|href)=/g, '<span class="text-cyan-400">$1</span>=')
      } else if (lang === 'css') {
        highlighted = highlighted
          .replace(/([.#][\w-]+)/g, '<span class="text-purple-400">$1</span>')
          .replace(/([\w-]+):/g, '<span class="text-cyan-400">$1</span>:')
      }
      
      return highlighted
    })
  }
  
  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }
  
  return (
    <div className={`h-full flex flex-col ${theme.colors.card} ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''} ${theme.colors.glow}`}>
      <div className={`p-4 border-b ${theme.colors.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Code2 size={16} className={theme.colors.accent} />
          <h3 className={`${theme.font} font-bold ${theme.colors.text}`}>
            {theme.id === 'terminal' ? '> CODE_EDITOR' : 'Code Editor'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-3 py-1 ${theme.rounded} ${theme.colors.button} ${theme.font} text-xs uppercase`}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
          <button
            onClick={copyCode}
            className={`p-2 ${theme.rounded} ${theme.colors.button} transition-all`}
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => console.log('Run code:', code)}
            className={`p-2 ${theme.rounded} ${theme.colors.buttonActive} transition-all`}
          >
            <Play size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex">
        <div className={`p-4 ${theme.colors.textMuted} border-r ${theme.colors.border} select-none`}>
          {getLineNumbers().map(num => (
            <div key={num} className={`font-mono text-xs text-right pr-2 leading-6`}>
              {num}
            </div>
          ))}
        </div>
        
        <div className="flex-1 relative overflow-auto">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`absolute inset-0 w-full h-full p-4 bg-transparent font-mono text-sm ${theme.colors.text} focus:outline-none resize-none leading-6 z-10`}
            spellCheck={false}
            style={{ caretColor: theme.id === 'terminal' ? '#00ffff' : '#fff' }}
          />
          <div 
            className={`p-4 font-mono text-sm ${theme.colors.text} leading-6 pointer-events-none whitespace-pre`}
            style={{ opacity: 0.8 }}
          >
            {highlightSyntax(code, language).map((line, idx) => (
              <div key={idx} dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
