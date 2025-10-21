
import React, { useMemo, useState } from 'react'
import ContactsHub from './components/contacts/ContactsHub'
import flow from './data/beyflow.json'
import TextBlock from './components/workspace/TextBlock'
import TodoBlock from './components/workspace/TodoBlock'

type Block = { type: 'text'|'todo'|'h2'|'h3'; text: string; done?: boolean }
type Page = { id: string; title: string; blocks: Block[] }

export default function App() {
  const [tab, setTab] = useState<'workspace'|'contacts'>('contacts')
  const pages = flow.pages as Page[]
  const [active, setActive] = useState(pages[0]?.id ?? 'p1')
  const page = useMemo(()=> pages.find(p=>p.id===active) ?? pages[0], [active])

  return (
    <div className="min-h-screen px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <div className="text-xl font-semibold">BeyFlow Space</div>
        <nav className="flex gap-2">
          <button className={`pill ${tab==='contacts'?'bg-white/20':''}`} onClick={()=>setTab('contacts')}>Contacts</button>
          <button className={`pill ${tab==='workspace'?'bg-white/20':''}`} onClick={()=>setTab('workspace')}>Workspace</button>
        </nav>
      </header>

      {tab === 'contacts' ? (
        <ContactsHub />
      ) : (
        <div className="grid md:grid-cols-[220px,1fr] gap-6">
          <aside className="panel">
            <div className="text-sm opacity-80 mb-2">Pages</div>
            <div className="flex flex-col gap-2">
              {pages.map(p => (
                <button key={p.id} onClick={()=>setActive(p.id)} className={`text-left btn ${active===p.id?'bg-white/10':''}`}>{p.title}</button>
              ))}
            </div>
          </aside>
          <main className="panel">
            <div className="text-lg font-semibold mb-4">{page.title}</div>
            <div className="space-y-4">
              {page.blocks.map((b,i)=>{
                if (b.type==='h2') return <h2 key={i} className="text-2xl font-semibold">{b.text}</h2>
                if (b.type==='h3') return <h3 key={i} className="text-xl font-semibold">{b.text}</h3>
                if (b.type==='todo') return <TodoBlock key={i} text={b.text} done={!!b.done} onToggle={()=>{}} onEdit={()=>{}} />
                return <TextBlock key={i} text={b.text} onChange={()=>{}} />
              })}
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
