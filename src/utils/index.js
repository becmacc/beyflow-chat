// Utility functions for BeyFlow Chat
export function recursivePattern(depth = 0) {
  if (depth > 5) return [];
  return [Math.sin(depth) * 10, ...recursivePattern(depth + 1)];
}

export function animateGradient(element) {
  if (!element) return;
  let pos = 0;
  const interval = setInterval(() => {
    pos = (pos + 1) % 360;
    element.style.background = `linear-gradient(${pos}deg, #ff0080, #7928ca, #2af598)`;
  }, 100);
  return () => clearInterval(interval); // Return cleanup function
}

export function generateParticlePositions(count = 50) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 20,
    y: (Math.random() - 0.5) * 20,
    z: (Math.random() - 0.5) * 20,
    scale: Math.random() * 0.5 + 0.1,
    speed: Math.random() * 2 + 0.5,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`
  }))
}

export function interpolateColors(color1, color2, factor) {
  if (arguments.length < 3) { 
    factor = 0.5; 
  }
  
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

export function createDopamineColors(shift = 0) {
  return {
    primary: `hsl(${(195 + shift) % 360}, 70%, 60%)`,
    secondary: `hsl(${(225 + shift) % 360}, 70%, 60%)`,
    accent: `hsl(${(285 + shift) % 360}, 70%, 60%)`,
    background: `hsl(${(240 + shift) % 360}, 30%, 10%)`
  }
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

export function generateWebhookPayload(user, text, metadata = {}) {
  return {
    user,
    text,
    timestamp: new Date().toISOString(),
    source: 'beyflow-chat',
    session_id: metadata.sessionId || Date.now().toString(),
    ui_state: metadata.uiState || {},
    ...metadata
  }
}

export function validateWebhookUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('make.com');
  } catch {
    return false;
  }
}

export function createBeyFlowTheme(gradientShift = 0) {
  const colors = createDopamineColors(gradientShift);
  return {
    colors,
    gradients: {
      primary: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      accent: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent})`,
      background: `linear-gradient(135deg, ${colors.background}, ${colors.primary}15)`
    },
    animations: {
      float: 'float 4s ease-in-out infinite',
      glow: 'glow 2s ease-in-out infinite',
      pulse: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }
  }
}