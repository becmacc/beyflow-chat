import { useState } from 'react'
import { Plus, X, Save, FolderOpen, Download, Upload, Trash2, Check } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'
import NotesModule from '../components/modules/NotesModule'
import AnalyticsModule from '../components/modules/AnalyticsModule'
import CodeModule from '../components/modules/CodeModule'
import TerminalModule from '../components/modules/TerminalModule'
import Web3Module from '../components/modules/Web3Module'

const moduleComponents = {
  notes: NotesModule,
  analytics: AnalyticsModule,
  code: CodeModule,
  terminal: TerminalModule,
  web3: Web3Module
}

const moduleLabels = {
  notes: 'Notes',
  analytics: 'Analytics',
  code: 'Code',
  terminal: 'Terminal',
  web3: 'Web3'
}

export default function Workspace() {
  const { 
    themePersona, 
    spectrum,
    workspaceModules, 
    availableModuleTypes, 
    workspaceConfigs,
    addWorkspaceModule, 
    removeWorkspaceModule,
    saveWorkspaceConfig,
    loadWorkspaceConfig,
    deleteWorkspaceConfig,
    exportWorkspaceConfig,
    importWorkspaceConfig
  } = useStore()
  const theme = getTheme(themePersona)
  
  const [activeModuleId, setActiveModuleId] = useState(workspaceModules[0]?.id || null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [toast, setToast] = useState(null)
  
  const blur = spectrum?.blur ?? 0
  const glow = spectrum?.glow ?? 0
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  const handleAddModule = (type) => {
    const newModule = {
      id: `m${Date.now()}`,
      type,
      position: { row: 1, col: 1 },
      size: { rows: 2, cols: 2 }
    }
    addWorkspaceModule(type)
    setShowAddMenu(false)
    showToast(`Added ${moduleLabels[type]} module`)
    setTimeout(() => {
      const modules = useStore.getState().workspaceModules
      const addedModule = modules[modules.length - 1]
      if (addedModule) {
        setActiveModuleId(addedModule.id)
      }
    }, 100)
  }
  
  const handleRemoveModule = (id) => {
    removeWorkspaceModule(id)
    if (activeModuleId === id && workspaceModules.length > 1) {
      const remainingModules = workspaceModules.filter(m => m.id !== id)
      setActiveModuleId(remainingModules[0]?.id || null)
    }
    showToast('Module removed')
  }
  
  const handleSave = () => {
    if (saveName.trim()) {
      saveWorkspaceConfig(saveName.trim())
      showToast(`Saved workspace: "${saveName.trim()}"`)
      setShowSaveDialog(false)
      setSaveName('')
    }
  }
  
  const handleLoad = (name) => {
    if (loadWorkspaceConfig(name)) {
      showToast(`Loaded workspace: "${name}"`)
      setShowLoadDialog(false)
      const modules = useStore.getState().workspaceModules
      setActiveModuleId(modules[0]?.id || null)
    } else {
      showToast('Failed to load workspace', 'error')
    }
  }
  
  const handleDelete = (name) => {
    deleteWorkspaceConfig(name)
    showToast(`Deleted workspace: "${name}"`)
  }
  
  const handleExport = () => {
    const json = exportWorkspaceConfig()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workspace-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Workspace exported')
  }
  
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          if (importWorkspaceConfig(event.target.result)) {
            showToast('Workspace imported successfully')
            const modules = useStore.getState().workspaceModules
            setActiveModuleId(modules[0]?.id || null)
          } else {
            showToast('Failed to import workspace', 'error')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }
  
  const activeModule = workspaceModules.find(m => m.id === activeModuleId)
  const ModuleComponent = activeModule ? moduleComponents[activeModule.type] : null
  
  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header with actions */}
      <div className={`px-6 py-4 border-b ${theme.colors.border} flex items-center justify-between`}
        style={{
          backdropFilter: `blur(${0 + blur * 24}px)`,
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex items-center gap-3">
          <h1 className={`text-lg ${theme.font} ${theme.colors.text} font-semibold`}>
            Workspace
          </h1>
          <div className={`px-2 py-1 text-xs ${theme.rounded} ${theme.colors.card} border ${theme.colors.border}`}>
            <span className={`${theme.font} ${theme.colors.textMuted}`}>
              {workspaceModules.length} {workspaceModules.length === 1 ? 'module' : 'modules'} active
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className={`px-3 py-1.5 text-sm ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-1.5 transition-all hover:opacity-80`}
            title="Save workspace configuration"
          >
            <Save size={14} />
            <span>Save</span>
          </button>
          
          <button
            onClick={() => setShowLoadDialog(true)}
            className={`px-3 py-1.5 text-sm ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-1.5 transition-all hover:opacity-80`}
            title="Load workspace configuration"
          >
            <FolderOpen size={14} />
            <span>Load</span>
          </button>
          
          <button
            onClick={handleExport}
            className={`px-3 py-1.5 text-sm ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-1.5 transition-all hover:opacity-80`}
            title="Export workspace"
          >
            <Download size={14} />
          </button>
          
          <button
            onClick={handleImport}
            className={`px-3 py-1.5 text-sm ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-1.5 transition-all hover:opacity-80`}
            title="Import workspace"
          >
            <Upload size={14} />
          </button>
        </div>
      </div>
      
      {/* Module Tabs */}
      <div 
        className={`flex items-center gap-1 px-6 py-2 border-b ${theme.colors.border} overflow-x-auto`}
        style={{
          backdropFilter: `blur(${0 + blur * 16}px)`,
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        {workspaceModules.map((module) => (
          <div key={module.id} className="relative group flex-shrink-0">
            <button
              onClick={() => setActiveModuleId(module.id)}
              className={`px-4 py-2 ${theme.rounded} ${theme.font} text-sm flex items-center gap-2 transition-all ${
                activeModuleId === module.id
                  ? theme.id === 'terminal'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/30'
                    : 'bg-white/10 text-white border border-white/20'
                  : theme.id === 'terminal'
                    ? 'text-cyan-400/60 hover:bg-cyan-500/10 border border-transparent'
                    : 'text-white/60 hover:bg-white/5 border border-transparent'
              }`}
              style={{
                boxShadow: activeModuleId === module.id && glow > 0.5
                  ? `0 0 ${glow * 12}px rgba(0, 255, 255, ${glow * 0.3})`
                  : 'none'
              }}
            >
              <span>{moduleLabels[module.type]}</span>
            </button>
            
            {activeModuleId === module.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveModule(module.id)
                }}
                className={`absolute -top-1 -right-1 p-1 rounded-full bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all z-10`}
                title="Remove module"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
        
        {/* Add Module Button in Tabs */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`px-4 py-2 ${theme.rounded} ${theme.font} text-sm flex items-center gap-2 transition-all ${
              theme.id === 'terminal'
                ? 'text-cyan-400 hover:bg-cyan-500/10 border border-cyan-400/30'
                : 'text-white hover:bg-white/5 border border-white/20'
            }`}
          >
            <Plus size={16} />
            <span>Add Module</span>
          </button>
          
          {showAddMenu && (
            <div className={`absolute top-full left-0 mt-2 ${theme.colors.card} border ${theme.colors.border} ${theme.rounded} overflow-hidden z-50 min-w-[160px]`}
              style={{
                backdropFilter: `blur(${8 + blur * 16}px)`,
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
              }}
            >
              {availableModuleTypes
                .filter(type => !workspaceModules.find(m => m.type === type))
                .map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddModule(type)}
                    className={`w-full px-4 py-2.5 text-left ${theme.font} ${theme.colors.text} hover:bg-white/10 transition-all border-b ${theme.colors.border} last:border-b-0 text-sm`}
                  >
                    {moduleLabels[type]}
                  </button>
                ))}
              
              {availableModuleTypes.filter(type => !workspaceModules.find(m => m.type === type)).length === 0 && (
                <div className={`px-4 py-3 text-sm ${theme.font} ${theme.colors.textMuted}`}>
                  All modules added
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Module Content */}
      <div className="flex-1 overflow-hidden">
        {workspaceModules.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.colors.card} border ${theme.colors.border} flex items-center justify-center`}>
                <Plus size={32} className={theme.colors.textMuted} />
              </div>
              <h2 className={`text-xl ${theme.font} ${theme.colors.text} font-semibold mb-2`}>
                No Modules Yet
              </h2>
              <p className={`${theme.font} ${theme.colors.textMuted} mb-6 max-w-sm`}>
                Get started by adding your first module to the workspace
              </p>
              <button
                onClick={() => setShowAddMenu(true)}
                className={`px-6 py-2.5 ${theme.rounded} ${theme.colors.buttonActive} ${theme.font} flex items-center gap-2 mx-auto transition-all`}
              >
                <Plus size={18} />
                <span>Add Module</span>
              </button>
            </div>
          </div>
        ) : ModuleComponent ? (
          <div className="h-full">
            <ModuleComponent moduleId={activeModuleId} />
          </div>
        ) : null}
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`${theme.colors.card} ${theme.rounded} border ${theme.colors.border} p-6 min-w-[400px]`}
            style={{
              backdropFilter: `blur(${8 + blur * 16}px)`,
              backgroundColor: 'rgba(0, 0, 0, 0.85)'
            }}
          >
            <h2 className={`text-xl ${theme.font} ${theme.colors.text} font-bold mb-4`}>
              Save Workspace Configuration
            </h2>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Enter configuration name..."
              className={`w-full px-4 py-2 ${theme.rounded} bg-gray-900/50 border ${theme.colors.border} ${theme.colors.text} ${theme.font} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={!saveName.trim()}
                className={`flex-1 px-4 py-2 ${theme.rounded} ${theme.colors.buttonActive} ${theme.font} flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Check size={16} />
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveDialog(false)
                  setSaveName('')
                }}
                className={`flex-1 px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} transition-all`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`${theme.colors.card} ${theme.rounded} border ${theme.colors.border} p-6 min-w-[400px] max-h-[600px] overflow-y-auto`}
            style={{
              backdropFilter: `blur(${8 + blur * 16}px)`,
              backgroundColor: 'rgba(0, 0, 0, 0.85)'
            }}
          >
            <h2 className={`text-xl ${theme.font} ${theme.colors.text} font-bold mb-4`}>
              Load Workspace Configuration
            </h2>
            
            {workspaceConfigs.length === 0 ? (
              <p className={`${theme.font} ${theme.colors.textMuted} text-center py-8`}>
                No saved configurations yet
              </p>
            ) : (
              <div className="space-y-2">
                {workspaceConfigs.map((config) => (
                  <div
                    key={config.name}
                    className={`flex items-center justify-between p-3 ${theme.rounded} border ${theme.colors.border} hover:bg-gray-800/50 transition-all`}
                  >
                    <div>
                      <p className={`${theme.font} ${theme.colors.text} font-semibold`}>
                        {config.name}
                      </p>
                      <p className={`text-xs ${theme.font} ${theme.colors.textMuted}`}>
                        {config.modules.length} modules • {new Date(config.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(config.name)}
                        className={`px-3 py-1 ${theme.rounded} ${theme.colors.buttonActive} ${theme.font} text-sm transition-all`}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(config.name)}
                        className={`px-3 py-1 ${theme.rounded} bg-red-500/80 hover:bg-red-500 text-white ${theme.font} text-sm transition-all`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowLoadDialog(false)}
              className={`w-full mt-4 px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} transition-all`}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-3 ${theme.rounded} ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white ${theme.font} shadow-lg flex items-center gap-2`}>
          <Check size={18} />
          {toast.message}
        </div>
      )}
    </div>
  )
}
