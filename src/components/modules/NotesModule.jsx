import { useState } from 'react'
import { Save, Eye, Edit3 } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../../config/themes'

export default function NotesModule({ moduleId }) {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [notes, setNotes] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  
  const renderMarkdown = (text) => {
    let html = text
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
    html = html.replace(/`(.+?)`/g, '<code class="bg-cyan-500/20 px-1 rounded">$1</code>')
    html = html.replace(/\n/g, '<br/>')
    return html
  }
  
  return (
    <div className={`h-full flex flex-col ${theme.colors.card} ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''} ${theme.colors.glow}`}>
      <div className={`p-4 border-b ${theme.colors.border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Edit3 size={16} className={theme.colors.accent} />
          <h3 className={`${theme.font} font-bold ${theme.colors.text}`}>
            {theme.id === 'terminal' ? '> NOTES_MODULE' : 'Quick Notes'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 ${theme.rounded} ${showPreview ? theme.colors.buttonActive : theme.colors.button} transition-all`}
          >
            {showPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => console.log('Save notes:', notes)}
            className={`p-2 ${theme.rounded} ${theme.colors.button} transition-all`}
          >
            <Save size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {showPreview ? (
          <div
            className={`${theme.font} ${theme.colors.text} prose prose-invert max-w-none`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(notes) }}
          />
        ) : (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={theme.id === 'terminal' ? '# Type your notes here...\n## Markdown supported' : 'Start typing... Markdown supported!'}
            className={`w-full h-full bg-transparent ${theme.font} ${theme.colors.text} placeholder:${theme.colors.textMuted} focus:outline-none resize-none`}
          />
        )}
      </div>
    </div>
  )
}
