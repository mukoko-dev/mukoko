import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'

console.log('main.jsx loaded')

// Performance measurement
const startTime = performance.now()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

// Log page load time
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime
  console.log(`⚡ Page load time: ${loadTime.toFixed(0)}ms`)
})

// Remove all PWA/Service Worker code for now
// No service worker registration
console.log('✅ React app loaded without PWA')