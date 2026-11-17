import { useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from './button'
import { toast } from './toast'

// Dictado por voz para campos de texto largos (notas de sesión, etc.), vía
// Web Speech API. Solo Chrome/Edge/Safari la soportan — en los demás
// navegadores (Firefox) el botón directamente no se muestra.
interface SpeechRecognitionResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognitionEventLike {
  resultIndex: number
  results: ArrayLike<SpeechRecognitionResultLike>
}
interface SpeechRecognitionLike extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: SpeechRecognitionEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as Record<string, unknown>
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionLike)
    | null
}

export function DictationButton({ onText }: { onText: (chunk: string) => void }) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<SpeechRecognitionLike | null>(null)

  if (typeof window === 'undefined' || !getSpeechRecognitionCtor()) return null

  const stop = () => {
    recRef.current?.stop()
    setListening(false)
  }

  const start = () => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return
    const rec = new Ctor()
    rec.lang = 'es-AR'
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e) => {
      let chunk = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) chunk += r[0].transcript
      }
      if (chunk.trim()) onText(chunk.trim())
    }
    rec.onerror = (e) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        toast.error('No se pudo usar el dictado por voz en este navegador.')
      }
      setListening(false)
    }
    rec.onend = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={listening ? 'danger' : 'soft'}
      onClick={listening ? stop : start}
      className={listening ? 'animate-pulse' : ''}
    >
      {listening ? <Square className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
      {listening ? 'Escuchando…' : 'Dictar'}
    </Button>
  )
}
