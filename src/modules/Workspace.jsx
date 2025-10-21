import { useState, useMemo } from 'react'
import { FileText, CheckSquare, Square } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

function TextBlock({ text, onChange }) {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  return (
    <div className={`p-3 ${theme.rounded} ${theme.colors.input} ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent ${theme.font} text-sm ${theme.colors.text} focus:outline-none resize-none`}
        rows={3}
      />
    </div>
  )
}

function TodoBlock({ text, done, onToggle, onEdit }) {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  return (
    <div className="flex items-start gap-3">
      <button
        onClick={onToggle}
        className={`mt-1 ${theme.colors.textMuted} hover:${theme.colors.accent} transition-colors`}
      >
        {done ? <CheckSquare size={18} /> : <Square size={18} />}
      </button>
      <input
        type="text"
        value={text}
        onChange={(e) => onEdit(e.target.value)}
        className={`flex-1 bg-transparent ${theme.font} text-sm ${theme.colors.text} focus:outline-none ${done ? 'line-through opacity-50' : ''}`}
      />
    </div>
  )
}

export default function Workspace() {
  const { themePersona, workspacePages, activePageId, setActivePage, updateBlock } = useStore()
  const theme = getTheme(themePersona)
  
  const activePage = useMemo(
    () => workspacePages.find(p => p.id === activePageId) || workspacePages[0],
    [workspacePages, activePageId]
  )
  
  const handleBlockEdit = (blockIndex, updates) => {
    updateBlock(activePageId, blockIndex, updates)
  }
  
  return (
    <div className="p-8 h-full overflow-hidden flex gap-6">
      {/* Sidebar - Pages List */}
      <div className={`w-56 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} p-4 ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
        <div className={`text-xs ${theme.colors.textMuted} mb-3 uppercase ${theme.font}`}>
          {theme.id === 'terminal' ? 'PAGES' : 'Pages'}
        </div>
        <div className="space-y-1">
          {workspacePages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`w-full text-left px-3 py-2 ${theme.rounded} transition-all ${theme.font} text-sm ${
                activePageId === page.id
                  ? `${theme.colors.buttonActive} ${theme.colors.text}`
                  : `${theme.colors.textMuted} hover:${theme.colors.text} hover:bg-white/5`
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={14} />
                <span>{page.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} p-6 ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
          {/* Page Title */}
          <h1 className={`text-2xl ${theme.font} ${theme.colors.text} font-bold mb-6`}>
            {activePage?.title}
          </h1>
          
          {/* Blocks */}
          <div className="space-y-4">
            {activePage?.blocks.map((block, index) => {
              if (block.type === 'h2') {
                return (
                  <h2 key={index} className={`text-xl ${theme.font} ${theme.colors.text} font-semibold mt-6`}>
                    {block.text}
                  </h2>
                )
              }
              
              if (block.type === 'h3') {
                return (
                  <h3 key={index} className={`text-lg ${theme.font} ${theme.colors.text} font-semibold mt-4`}>
                    {block.text}
                  </h3>
                )
              }
              
              if (block.type === 'todo') {
                return (
                  <TodoBlock
                    key={index}
                    text={block.text}
                    done={block.done || false}
                    onToggle={() => handleBlockEdit(index, { done: !block.done })}
                    onEdit={(newText) => handleBlockEdit(index, { text: newText })}
                  />
                )
              }
              
              // Default: text block
              return (
                <TextBlock
                  key={index}
                  text={block.text}
                  onChange={(newText) => handleBlockEdit(index, { text: newText })}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
