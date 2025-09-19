import React from 'react'
import ReactDOM from 'react-dom/client'
import { Global, css } from '@emotion/react'
import { fonts } from '@workday/canvas-kit-react-fonts'
import App from './App.tsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={css(fonts)} />
    <App />
  </React.StrictMode>,
)