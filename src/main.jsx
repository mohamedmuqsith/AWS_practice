import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GrammarProvider } from './context/GrammarContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GrammarProvider>
      <App />
    </GrammarProvider>
  </React.StrictMode>,
)
