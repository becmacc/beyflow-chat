import { MessageCircle, Instagram } from 'lucide-react'
import { useBeyFlowStore } from "../core/UnifiedStore"
import { getTheme } from '../config/themes'

const PinterestIcon = ({ size = 20, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
  </svg>
)

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/',
    gradient: 'from-purple-500 via-pink-500 to-orange-500',
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: PinterestIcon,
    url: 'https://www.pinterest.com/',
    gradient: 'from-red-600 to-red-500',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    url: 'https://web.whatsapp.com',
    gradient: 'from-green-600 to-green-500',
  }
]

export default function SocialMediaBrowser() {
  const { themePersona } = useStore()
  const theme = getTheme(themePersona)

  return (
    <div className="fixed bottom-20 right-4 z-40 flex gap-2">
      {platforms.map((platform) => {
        const Icon = platform.icon
        return (
          <button
            key={platform.id}
            onClick={() => window.open(platform.url, '_blank')}
            className={`p-2.5 bg-gradient-to-r ${platform.gradient} text-white ${theme.rounded} shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200`}
            title={platform.name}
          >
            <Icon size={20} />
          </button>
        )
      })}
    </div>
  )
}
