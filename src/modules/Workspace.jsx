import { useState, useEffect } from 'react'
import { Plus, X, Save, FolderOpen, Grid3x3, Download, Upload, Trash2, Check, Maximize2 } from 'lucide-react'
import useStore from '../store'
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
  code: 'Code Editor',
  terminal: 'Terminal',
  web3: 'Web3 Wallet'
}

const moduleSizes = {
  small: { rows: 1, cols: 1 },
  medium: { rows: 2, cols: 2 },
  large: { rows: 2, cols: 4 }
}

export default function Workspace() {
  const { 
    themePersona, 
    workspaceModules, 
    availableModuleTypes, 
    workspaceConfigs,
    addWorkspaceModule, 
    removeWorkspaceModule,
    updateModuleSize,
    saveWorkspaceConfig,
    loadWorkspaceConfig,
    deleteWorkspaceConfig,
    exportWorkspaceConfig,
    importWorkspaceConfig
  } = useStore()
  const theme = getTheme(themePersona)
  
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [toast, setToast] = useState(null)
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  const handleAddModule = (type) => {
    addWorkspaceModule(type)
    setShowAddMenu(false)
    showToast(`Added ${moduleLabels[type]} module`)
  }
  
  const handleRemoveModule = (id) => {
    removeWorkspaceModule(id)
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
          } else {
            showToast('Failed to import workspace', 'error')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }
  
  const handleSizeChange = (moduleId, sizeKey) => {
    updateModuleSize(moduleId, moduleSizes[sizeKey])
    showToast(`Module resized to ${sizeKey}`)
  }
  
  return (
    <div className="p-8 h-full overflow-hidden flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3x3 size={24} className={theme.colors.accent} />
            <h1 className={`text-2xl ${theme.font} ${theme.colors.text} font-bold`}>
              {theme.id === 'terminal' ? '> MODULAR_WORKSPACE' : 'Workspace Dashboard'}
            </h1>
          </div>
          
          <div className={`px-3 py-1 ${theme.rounded} ${theme.colors.card} border ${theme.colors.border}`}>
            <span className={`text-sm ${theme.font} ${theme.colors.textMuted}`}>
              {workspaceModules.length} {workspaceModules.length === 1 ? 'module' : 'modules'} active
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className={`px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-2 transition-all hover:opacity-80`}
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          
          <button
            onClick={() => setShowLoadDialog(true)}
            className={`px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-2 transition-all hover:opacity-80`}
          >
            <FolderOpen size={16} />
            <span>Load</span>
          </button>
          
          <button
            onClick={handleExport}
            className={`px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-2 transition-all hover:opacity-80`}
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleImport}
            className={`px-4 py-2 ${theme.rounded} ${theme.colors.button} ${theme.font} flex items-center gap-2 transition-all hover:opacity-80`}
          >
            <Upload size={16} />
            <span>Import</span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`px-4 py-2 ${theme.rounded} ${theme.colors.buttonActive} ${theme.font} flex items-center gap-2 transition-all ${theme.colors.glow}`}
            >
              <Plus size={16} />
              <span>Add Module</span>
            </button>
            
            {showAddMenu && (
              <div className={`absolute top-full right-0 mt-2 ${theme.colors.card} border ${theme.colors.border} ${theme.rounded} overflow-hidden z-50 min-w-[200px] ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
                {availableModuleTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddModule(type)}
                    className={`w-full px-4 py-3 text-left ${theme.font} ${theme.colors.text} hover:${theme.colors.buttonActive} transition-all border-b ${theme.colors.border} last:border-b-0`}
                  >
                    {moduleLabels[type] || type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'minmax(300px, auto)',
          gap: '1.5rem'
        }}
      >
        {workspaceModules.length === 0 ? (
          <div className="col-span-4 flex items-center justify-center h-full">
            <div className={`text-center p-12 ${theme.colors.card} ${theme.rounded} border ${theme.colors.border} ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
              <Grid3x3 size={48} className={`${theme.colors.textMuted} mx-auto mb-4`} />
              <h2 className={`text-xl ${theme.font} ${theme.colors.text} font-bold mb-2`}>
                {theme.id === 'terminal' ? '> WORKSPACE_EMPTY' : 'No Modules Yet'}
              </h2>
              <p className={`${theme.font} ${theme.colors.textMuted} mb-6`}>
                Click "Add Module" to start building your workspace
              </p>
              <button
                onClick={() => setShowAddMenu(true)}
                className={`px-6 py-3 ${theme.rounded} ${theme.colors.buttonActive} ${theme.font} flex items-center gap-2 mx-auto transition-all ${theme.colors.glow}`}
              >
                <Plus size={20} />
                <span>Add Your First Module</span>
              </button>
            </div>
          </div>
        ) : (
          workspaceModules.map((module) => {
            const ModuleComponent = moduleComponents[module.type]
            
            if (!ModuleComponent) {
              return null
            }
            
            const currentSize = Object.keys(moduleSizes).find(
              key => moduleSizes[key].rows === module.size?.rows && moduleSizes[key].cols === module.size?.cols
            ) || 'medium'
            
            return (
              <div
                key={module.id}
                className="relative group"
                style={{
                  gridColumn: `span ${module.size?.cols || 2}`,
                  gridRow: `span ${module.size?.rows || 2}`
                }}
              >
                <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <div className={`flex ${theme.rounded} overflow-hidden border ${theme.colors.border} bg-gray-900/90`}>
                    {Object.keys(moduleSizes).map((sizeKey) => (
                      <button
                        key={sizeKey}
                        onClick={() => handleSizeChange(module.id, sizeKey)}
                        className={`px-3 py-2 text-xs ${theme.font} transition-all ${
                          currentSize === sizeKey 
                            ? 'bg-blue-500 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                        title={`Resize to ${sizeKey}`}
                      >
                        {sizeKey[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveModule(module.id)}
                    className={`p-2 ${theme.rounded} bg-red-500/80 hover:bg-red-500 text-white transition-all`}
                  >
                    <X size={14} />
                  </button>
                </div>
                
                <ModuleComponent moduleId={module.id} />
              </div>
            )
          })
        )}
      </div>
      
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${theme.colors.card} ${theme.rounded} border ${theme.colors.border} p-6 min-w-[400px] ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
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
      
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`${theme.colors.card} ${theme.rounded} border ${theme.colors.border} p-6 min-w-[400px] max-h-[600px] overflow-y-auto ${theme.effects.blur ? 'backdrop-blur-xl' : ''}`}>
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
      
      {toast && (
        <div className={`fixed bottom-8 right-8 z-50 px-6 py-4 ${theme.rounded} ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white ${theme.font} shadow-lg animate-fade-in flex items-center gap-2`}>
          <Check size={20} />
          {toast.message}
        </div>
      )}
    </div>
  )
}
