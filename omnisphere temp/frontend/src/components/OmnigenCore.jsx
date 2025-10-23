import React, { useState } from 'react';
import PromptInput from './PromptInput';
import { motion } from 'framer-motion';

export default function OmnigenCore() {
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (prompt) => {
    setChat([...chat, { type: 'user', content: prompt }]);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();

      if (data.image_url) {
        setChat(c => [...c, { type: 'image', content: data.image_url }]);
      } else {
        setChat(c => [...c, { type: 'agent', content: data.response }]);
      }

    } catch (err) {
      setChat(c => [...c, { type: 'agent', content: "⚠️ Error: Could not reach Omnigen." }]);
    }

    setLoading(false);
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '70%',
        maxHeight: '60vh',
        overflowY: 'auto',
        padding: '20px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 30px rgba(0,255,255,0.15)',
        color: 'white',
        fontSize: '18px',
        lineHeight: '1.6',
      }}>
        {chat.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {msg.type === 'image' ? (
              <img src={msg.content} alt="Generated" style={{ width: '100%', borderRadius: '10px', margin: '15px 0' }} />
            ) : (
              <p style={{
                color: msg.type === 'user' ? '#00f2ff' : '#fff',
                fontWeight: msg.type === 'user' ? '600' : '400'
              }}>{msg.content}</p>
            )}
          </motion.div>
        ))}
        {loading && <p style={{ opacity: 0.5 }}>Omnigen is thinking...</p>}
      </div>

      <PromptInput onSubmit={handleSubmit} />
    </>
  );
}
