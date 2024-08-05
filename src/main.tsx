import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import LanguageProvider from './contexts/LanguageContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  </LanguageProvider>
)
