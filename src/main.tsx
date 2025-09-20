import React from 'react'
import ReactDOM from 'react-dom/client'
import { Global, css } from '@emotion/react'
import { fonts } from '@workday/canvas-kit-react-fonts'
import App from './App.tsx'
import './styles/index.css'

// Conditionally import Tailwind CSS
if (import.meta.env.VITE_TW_ENABLED === 'true') {
  import('./tw.css');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={css(fonts)} />
    <App />
  </React.StrictMode>,
)