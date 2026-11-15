import { create } from 'zustand'

// Instalación como app (PWA). Chrome/Edge en Android y computadora avisan que
// la app se puede instalar con el evento `beforeinstallprompt`, que llega una
// sola vez y apenas carga la página: por eso se escucha desde main.tsx, antes
// de montar React. iPhone/iPad no lo tienen: ahí se muestran los pasos a mano.

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type InstallPlatform = 'ios' | 'android' | 'desktop'

interface InstallState {
  promptEvent: InstallPromptEvent | null
  installed: boolean
}

export const useInstallStore = create<InstallState>(() => ({
  promptEvent: null,
  installed: isStandalone(),
}))

export function listenForInstallPrompt() {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    useInstallStore.setState({ promptEvent: e as InstallPromptEvent })
  })
  window.addEventListener('appinstalled', () => {
    useInstallStore.setState({ promptEvent: null, installed: true })
  })
}

/** ¿Ya se está usando como app instalada (abierta desde el ícono)? */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia?.('(display-mode: standalone)').matches || nav.standalone === true
}

export function getPlatform(): InstallPlatform {
  const ua = navigator.userAgent
  // iPadOS se presenta como Mac: se distingue por la pantalla táctil.
  const iPadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  if (/iPhone|iPad|iPod/.test(ua) || iPadOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

/** Abre el aviso nativo de instalación. Devuelve false si no hay uno disponible. */
export async function promptInstall(): Promise<boolean> {
  const ev = useInstallStore.getState().promptEvent
  if (!ev) return false
  await ev.prompt()
  const { outcome } = await ev.userChoice
  // El evento sirve una sola vez, se acepte o no.
  useInstallStore.setState({ promptEvent: null, installed: outcome === 'accepted' })
  return true
}

const DISMISS_KEY = 'mb:install-dismissed'
const DISMISS_DAYS = 30

export function wasDismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    return Date.now() - Number(raw) < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

export function rememberDismissal() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    /* sin almacenamiento (modo privado): se vuelve a mostrar, no pasa nada */
  }
}
