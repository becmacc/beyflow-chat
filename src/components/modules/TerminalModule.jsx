import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'
import { useBeyFlowStore } from "../../core/UnifiedStore"
import { getTheme } from '../../config/themes'

export default function TerminalModule({ moduleId }) {
    const themePersona = useBeyFlowStore(state => state.ui.themePersona)
  const theme = getTheme(themePersona)
  
  const [history, setHistory] = useState([
    { type: 'output', text: 'BeyFlow Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" for available commands' }
  ])
  const [input, setInput] = useState('')
  const [currentDir, setCurrentDir] = useState('~')
  const outputRef = useRef(null)
  
  const fileSystem = {
    '~': ['documents', 'projects', 'notes.txt'],
    '~/documents': ['report.pdf', 'resume.docx'],
    '~/projects': ['beyflow', 'website']
  }
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history])
  
  const executeCommand = (cmd) => {
    const parts = cmd.trim().split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    
    const newHistory = [...history, { type: 'input', text: `${currentDir} $ ${cmd}` }]
    
    switch (command) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available commands:\n  ls - list files\n  pwd - print working directory\n  cd [dir] - change directory\n  clear - clear terminal\n  echo [text] - print text\n  date - show current date'
        })
        break
        
      case 'ls':
        const files = fileSystem[currentDir] || []
        newHistory.push({
          type: 'output',
          text: files.length > 0 ? files.join('  ') : 'Directory empty'
        })
        break
        
      case 'pwd':
        newHistory.push({ type: 'output', text: currentDir })
        break
        
      case 'cd':
        if (args[0] === '..') {
          const parts = currentDir.split('/')
          const newDir = parts.slice(0, -1).join('/') || '~'
          setCurrentDir(newDir)
          newHistory.push({ type: 'output', text: `Changed to ${newDir}` })
        } else if (args[0]) {
          const newDir = currentDir === '~' ? `~/${args[0]}` : `${currentDir}/${args[0]}`
          if (fileSystem[newDir]) {
            setCurrentDir(newDir)
            newHistory.push({ type: 'output', text: `Changed to ${newDir}` })
          } else {
            newHistory.push({ type: 'error', text: `cd: ${args[0]}: No such directory` })
          }
        } else {
          setCurrentDir('~')
          newHistory.push({ type: 'output', text: 'Changed to ~' })
        }
        break
        
      case 'clear':
        setHistory([])
        return
        
      case 'echo':
        newHistory.push({ type: 'output', text: args.join(' ') })
        break
        
      case 'date':
        newHistory.push({ type: 'output', text: new Date().toString() })
        break
        
      case '':
        break
        
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${command}` })
    }
    
    setHistory(newHistory)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      executeCommand(input)
      setInput('')
    }
  }
  
  return (
    <div className={`h-full flex flex-col ${theme.colors.card} ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''} border-2 border-green-500/30 shadow-[0_0_20px_rgba(0,255,0,0.2)]`}>
      <div className={`p-4 border-b border-green-500/30 flex items-center gap-2 bg-black/50`}>
        <TerminalIcon size={16} className="text-green-400" />
        <h3 className={`${theme.font} font-bold text-green-400`}>
          TERMINAL
        </h3>
      </div>
      
      <div ref={outputRef} className="flex-1 p-4 overflow-y-auto bg-black font-mono text-sm space-y-1">
        {history.map((entry, idx) => (
          <div key={idx} className={entry.type === 'input' ? 'text-green-300' : entry.type === 'error' ? 'text-red-400' : 'text-green-400/80'}>
            {entry.text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-green-500/30 bg-black/50">
        <div className="flex items-center gap-2">
          <span className="text-green-400 font-mono text-sm">{currentDir} $</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 font-mono text-sm focus:outline-none"
            placeholder="Type command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  )
}
