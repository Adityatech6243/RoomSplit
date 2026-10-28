import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Fire-and-forget: wake the Render backend before any auth call.
// On cold start this ping starts the JVM; by the time the user
// types credentials the server is already warm.
const _backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api')
  .trim().replace(/\/+$/, '').replace(/\/api$/, '');
fetch(`${_backendBase}/health`, { method: 'GET', cache: 'no-store' }).catch(() => {});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
