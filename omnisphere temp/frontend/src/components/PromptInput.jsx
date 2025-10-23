import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PromptInput({ onSubmit }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      style={{
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
      }}
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Omnigen anything..."
        style={{
          flex: 1,
          padding: '15px 20px',
          borderRadius: '30px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(0,0,0,0.5)',
          color: 'white',
          fontSize: '16px',
          outline: 'none',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0 10px rgba(0,255,255,0.2)',
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 12px cyan' }}
        onClick={handleSubmit}
        style={{
          background: 'linear-gradient(to right, #00f2ff, #4facfe)',
          border: 'none',
          padding: '12px 18px',
          borderRadius: '25px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Send
      </motion.button>
    </motion.div>
  );
}
