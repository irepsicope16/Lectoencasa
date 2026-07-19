import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { seedIfNeeded } from './data/seed'
import { isCloudEnabled } from './services/cloud/config'
import { applyTheme, useUIStore } from './stores/uiStore'

// Siembra de datos demo (solo modo local, primera vez) y tema antes de montar.
const boot = isCloudEnabled() ? Promise.resolve() : seedIfNeeded()
boot.then(() => {
  applyTheme(useUIStore.getState().theme)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
