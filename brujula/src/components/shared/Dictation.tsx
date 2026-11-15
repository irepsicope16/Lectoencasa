import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

// Dictado por voz con el reconocimiento del propio navegador (Web Speech
// API): no graba ni guarda audio, solo escribe el texto en el campo.
// Funciona en Chrome, Edge y Safari; en Firefox no existe y se avisa.

interface SpeechResultLike {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechEventLike {
  resultIndex: number
  results: ArrayLike<SpeechResultLike>
}
interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((e: SpeechEventLike) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechCtor = new () => SpeechRecognitionLike

function getSpeechCtor(): SpeechCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: SpeechCtor; webkitSpeechRecognition?: SpeechCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/** Suma un fragmento dictado al texto existente, con espacio y mayúscula inicial. */
export function appendDictado(actual: string, fragmento: string): string {
  const limpio = fragmento.trim()
  if (!limpio) return actual
  const base = actual.trimEnd()
  const empiezaOracion = !base || /[.!?\n]$/.test(base)
  const texto = empiezaOracion ? limpio.charAt(0).toUpperCase() + limpio.slice(1) : limpio
  return base ? `${base} ${texto}` : texto
}

/**
 * Botón de dictado. `onText` recibe cada frase terminada; el texto en curso
 * se muestra debajo mientras la profesional habla.
 */
export function DictationButton({ onText, className }: { onText: (texto: string) => void; className?: string }) {
  const [listening, setListening] = useState(false)
  const [parcial, setParcial] = useState('')
  const recRef = useRef<SpeechRecognitionLike | null>(null)
  const onTextRef = useRef(onText)
  onTextRef.current = onText

  // Si se cierra el formulario mientras dicta, se corta el micrófono.
  useEffect(() => () => recRef.current?.stop(), [])

  function start() {
    const Ctor = getSpeechCtor()
    if (!Ctor) {
      toast.error('Este navegador no permite dictar. Abrí Método Brújula en Chrome, Edge o Safari.')
      return
    }
    const rec = new Ctor()
    rec.lang = 'es-AR'
    rec.continuous = true
    rec.interimResults = true
    rec.onresult = (e) => {
      let enCurso = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) onTextRef.current(r[0].transcript)
        else enCurso += r[0].transcript
      }
      setParcial(enCurso)
    }
    rec.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        toast.error('Necesitás permitir el micrófono en el navegador para poder dictar.')
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        toast.error('Se cortó el dictado. Volvé a tocar «Dictar» para seguir.')
      }
    }
    rec.onend = () => {
      setListening(false)
      setParcial('')
      recRef.current = null
    }
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      toast.error('No se pudo iniciar el dictado. Probá de nuevo.')
    }
  }

  function stop() {
    recRef.current?.stop()
  }

  return (
    <div className={cn('flex flex-col items-start', className)}>
      <button
        type="button"
        onClick={listening ? stop : start}
        aria-pressed={listening}
        className={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold shadow-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring',
          listening
            ? 'bg-accent-strong text-accent-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary-strong',
        )}
      >
        {listening ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            Escuchando… tocá para terminar
            <Square className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" /> Dictar
          </>
        )}
      </button>
      {listening && parcial && (
        <p className="mt-1.5 max-w-full text-[12px] italic text-muted-foreground">{parcial}…</p>
      )}
    </div>
  )
}
