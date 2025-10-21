import { useState, useEffect } from 'react'
import { Wallet, TrendingUp, Activity } from 'lucide-react'
import useStore from '../../store'
import { getTheme } from '../../config/themes'

export default function Web3Module({ moduleId }) {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)
  
  const [ethBalance] = useState(2.5423)
  const [portfolioValue] = useState(8234.56)
  const [priceChange] = useState(+5.23)
  
  const recentActivity = [
    { type: 'receive', amount: 0.5, from: '0x742d...8f3a', time: '2m ago' },
    { type: 'send', amount: 0.2, to: '0x9a8b...4c2d', time: '1h ago' },
    { type: 'swap', amount: 1.0, token: 'USDC', time: '3h ago' }
  ]
  
  return (
    <div className={`h-full flex flex-col ${theme.colors.card} ${theme.rounded} overflow-hidden ${theme.effects.blur ? 'backdrop-blur-xl' : ''} border-2 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.2)]`}>
      <div className={`p-4 border-b border-cyan-500/30 flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10`}>
        <Wallet size={16} className="text-cyan-400" />
        <h3 className={`${theme.font} font-bold text-cyan-400`}>
          {theme.id === 'terminal' ? '> WEB3_WALLET' : 'Web3 Wallet'}
        </h3>
      </div>
      
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          <div className={`p-4 ${theme.rounded} bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className={`text-xs ${theme.colors.textMuted} ${theme.font} mb-1`}>
                  ETH Balance
                </div>
                <div className={`text-3xl font-bold ${theme.font} text-cyan-400`}>
                  {ethBalance.toFixed(4)}
                </div>
              </div>
              <div className={`p-2 ${theme.rounded} bg-cyan-500/20 border border-cyan-500/30`}>
                <TrendingUp size={20} className="text-cyan-400" />
              </div>
            </div>
            <div className={`text-sm ${theme.colors.textMuted} ${theme.font}`}>
              ≈ ${(ethBalance * 3240).toFixed(2)} USD
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 ${theme.rounded} bg-black/30 border border-cyan-500/20`}>
              <div className={`text-xs ${theme.colors.textMuted} ${theme.font} mb-1`}>
                Portfolio
              </div>
              <div className={`text-lg font-bold ${theme.font} text-white`}>
                ${portfolioValue.toLocaleString()}
              </div>
            </div>
            
            <div className={`p-3 ${theme.rounded} bg-black/30 border border-cyan-500/20`}>
              <div className={`text-xs ${theme.colors.textMuted} ${theme.font} mb-1`}>
                24h Change
              </div>
              <div className={`text-lg font-bold ${theme.font} ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            <div className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
              Recent Activity
            </div>
          </div>
          
          <div className="space-y-2">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className={`p-3 ${theme.rounded} bg-black/30 border border-cyan-500/10 hover:border-cyan-500/30 transition-all`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${theme.font} uppercase ${
                    activity.type === 'receive' ? 'text-green-400' :
                    activity.type === 'send' ? 'text-red-400' :
                    'text-purple-400'
                  }`}>
                    {activity.type}
                  </span>
                  <span className={`text-xs ${theme.colors.textMuted} ${theme.font}`}>
                    {activity.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme.font} ${theme.colors.text}`}>
                    {activity.amount} {activity.token || 'ETH'}
                  </span>
                  <span className={`text-xs ${theme.colors.textMuted} font-mono`}>
                    {activity.from || activity.to}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
