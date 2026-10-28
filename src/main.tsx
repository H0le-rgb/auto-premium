import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DemoApp from './DemoApp'
import './style.css'
import './demo.css'

const path = window.location.pathname.replace(/\/$/, '') || '/'
const isDemoRoute = path === '/demos' || path.startsWith('/demo/')
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isDemoRoute ? <DemoApp /> : <App />}</React.StrictMode>,
)
