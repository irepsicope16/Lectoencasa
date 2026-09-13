import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { seedIfNeeded } from './data/seed'
import { applyTheme, useUIStore } from './stores/uiStore'

seedIfNeeded().then(() => {
  applyTheme(useUIStore.getState().theme)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
