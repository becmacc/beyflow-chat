import React, { useState } from 'react'
import { askChatGPT, generateImage } from './api'
import PromptInput from './components/PromptInput'

export default function OmnigenRouter({ onMessage, setAgent, setExploded }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (input) => {
    if (!input) return
    setLoading(true)

    // 💥 Trigger explosion!
    if (setExploded) setExploded(true)

    onMessage({ role: 'user', content: input })

    const reply = await askChatGPT(`You are Omnigen. Interpret this user input and either answer directly or call one of your agents (GPT-Marketer, GPT-Engineer, DALL·E). If it's visual, respond with 'Image:' followed by the prompt to send to DALL·E.\n\nUser: ${input}`)

    if (reply.startsWith("Image:")) {
      const imagePrompt = reply.replace("Image:", "").trim()
      const url = await generateImage(imagePrompt)
      if (url) {
        onMessage({ role: 'image', content: url })
      } else {
        onMessage({ role: 'bot', content: "Error generating image." })
      }
    } else {
      onMessage({ role: 'bot', content: reply })

      // Optional: Infer agent from reply content
      if (reply.includes("GPT-Marketer")) {
        setAgent({ name: 'GPT-Marketer', role: 'Marketing', description: 'Handles branding, audience, and content strategy.' })
      } else if (reply.includes("GPT-Engineer")) {
        setAgent({ name: 'GPT-Engineer', role: 'Coding & Logic', description: 'Handles coding, backend, and system design.' })
      } else if (reply.includes("DALL·E")) {
        setAgent({ name: 'DALL·E', role: 'Vision & Image', description: 'Creates AI-generated images based on text prompts.' })
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <PromptInput onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
