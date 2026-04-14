import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <- Добавь этот импорт!
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Оберни App в BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)