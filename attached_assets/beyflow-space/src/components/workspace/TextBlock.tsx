
import React from 'react'
export default function TextBlock({ text, onChange }: { text: string; onChange: (v: string)=>void }) {
  return <textarea className="input min-h-[100px]" value={text} onChange={(e)=>onChange(e.target.value)} />
}
