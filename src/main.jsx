import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Import integration test and debug analysis for development
if (import.meta.env.DEV) {
  import('./utils/minimalIntegration.js');
  import('./utils/integrationTest.js');
  import('./utils/debugAnalysis.js');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
