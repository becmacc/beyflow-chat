import { useState, useMemo } from 'react'
import { Search, Mail, MessageCircle, Linkedin, Calendar } from 'lucide-react'
import useStore from '../store'
import { getTheme } from '../config/themes'

export default function ContactsHub() {
  const { themePersona, contacts } = useStore()
  const theme = getTheme(themePersona)
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredContacts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return contacts
    return contacts.filter(contact => 
      [contact.name, contact.role, contact.company]
        .join(' ')
        .toLowerCase()
        .includes(query)
    )
  }, [contacts, searchQuery])
  
  const quickMail = (email) => `mailto:${email}`
  
  const quickWhatsApp = (phone, message = 'Hello from BeyFlow') => {
    const clean = phone.replace(/[^+\d]/g, '')
    return `https://wa.me/${clean.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`
  }
  
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-2xl ${theme.font} ${theme.colors.text} font-bold mb-1`}>
            {theme.id === 'terminal' ? 'CONTACTS_HUB' : 'Contacts Hub'}
          </h1>
          <p className={`text-sm ${theme.colors.textMuted}`}>
            Manage your network and quick actions
          </p>
        </div>
        
        {/* Search */}
        <div className={`flex items-center gap-2 px-4 py-2 ${theme.colors.input} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-md' : ''}`}>
          <Search size={16} className={theme.colors.textMuted} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={theme.id === 'terminal' ? 'SEARCH...' : 'Search contacts...'}
            className={`bg-transparent ${theme.font} text-sm ${theme.colors.text} focus:outline-none placeholder:${theme.colors.textMuted} w-64`}
          />
        </div>
      </div>
      
      {/* Contacts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-5 ${theme.colors.bg} border ${theme.colors.border} ${theme.rounded} ${theme.effects.blur ? 'backdrop-blur-xl' : ''} hover:border-cyan-500/40 transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className={`${theme.font} ${theme.colors.text} font-semibold text-lg mb-1`}>
                  {contact.name}
                </div>
                <div className={`text-xs ${theme.colors.textMuted}`}>
                  {contact.role} · {contact.company}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={quickMail(contact.email)}
                className={`flex items-center justify-center gap-2 px-3 py-2 ${theme.rounded} transition-all ${
                  theme.id === 'terminal' 
                    ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Mail size={14} />
                <span className={`${theme.font} text-xs`}>Email</span>
              </a>
              
              <a
                href={quickWhatsApp(contact.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2 ${theme.rounded} transition-all
                  bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30`}
              >
                <MessageCircle size={14} />
                <span className={`${theme.font} text-xs`}>WhatsApp</span>
              </a>
              
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2 ${theme.rounded} transition-all
                  bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30`}
              >
                <Linkedin size={14} />
                <span className={`${theme.font} text-xs`}>LinkedIn</span>
              </a>
              
              <a
                href={contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2 ${theme.rounded} transition-all
                  bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30`}
              >
                <Calendar size={14} />
                <span className={`${theme.font} text-xs`}>Calendly</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className={`text-center py-16 ${theme.colors.textMuted}`}>
          <p className={theme.font}>No contacts found</p>
        </div>
      )}
    </div>
  )
}
