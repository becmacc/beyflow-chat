
import React, { useMemo, useState } from 'react'
import data from '../../data/contacts.json'

type Contact = typeof data[number]

function quickMail(email: string) { return `mailto:${email}` }
function quickWhatsApp(phone: string, message = 'Hi') {
  const clean = phone.replace(/[^+\d]/g, '')
  return `https://wa.me/${clean.replace(/^\+/, '')}?text=${encodeURIComponent(message)}`
}
function quickLinkedIn(url: string) { return url }
function quickCalendly(url: string) { return url }

export default function ContactsHub() {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return data
    return data.filter(c => [c.name, c.role, c.company].join(' ').toLowerCase().includes(s))
  }, [q])

  return (
    <div className="panel">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Contacts Hub</div>
        <input className="input w-56" placeholder="Search" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((c: Contact) => (
          <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs opacity-70">{c.role} · {c.company}</div>
            </div>
            <div className="flex gap-2">
              <a className="btn pill" href={quickMail(c.email)}>Email</a>
              <a className="btn pill" href={quickWhatsApp(c.phone, 'Hello from BeyFlow')}>WhatsApp</a>
              <a className="btn pill" href={quickLinkedIn(c.linkedin)} target="_blank">LinkedIn</a>
              <a className="btn pill" href={quickCalendly(c.calendly)} target="_blank">Calendly</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
