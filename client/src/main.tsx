import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from './features/lang/i18n'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { config } from './config/env.config'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={config.google_clientId}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
