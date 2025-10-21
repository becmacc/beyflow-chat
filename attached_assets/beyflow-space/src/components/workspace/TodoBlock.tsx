
import React from 'react'
export default function TodoBlock({ text, done, onToggle, onEdit }: { text: string; done: boolean; onToggle: ()=>void; onEdit:(v:string)=>void }) {
  return (
    <label className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
      <input type="checkbox" checked={done} onChange={onToggle} />
      <input className="bg-transparent outline-none flex-1" value={text} onChange={(e)=>onEdit(e.target.value)} />
    </label>
  )
}
