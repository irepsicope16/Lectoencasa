import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SignaturePadHandle {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string | null
}

/** Firma trazada con el dedo o el mouse sobre un canvas. Sin dependencias externas. */
export const SignaturePad = React.forwardRef<SignaturePadHandle, { className?: string }>(
  ({ className }, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const drawing = React.useRef(false)
    const hasStroke = React.useRef(false)
    const last = React.useRef<{ x: number; y: number } | null>(null)

    const ctx = () => canvasRef.current?.getContext('2d') ?? null

    // El canvas se dibuja a resolución real (devicePixelRatio) para que la
    // firma no se vea pixelada, pero el trazo se calcula en coordenadas CSS.
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ratio = window.devicePixelRatio || 1
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width * ratio
      canvas.height = height * ratio
      const c = ctx()
      if (!c) return
      c.scale(ratio, ratio)
      c.lineWidth = 2.2
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.strokeStyle = '#1d1f24'
    }, [])

    const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      drawing.current = true
      last.current = posFromEvent(e)
    }

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return
      const c = ctx()
      const pos = posFromEvent(e)
      if (c && last.current) {
        c.beginPath()
        c.moveTo(last.current.x, last.current.y)
        c.lineTo(pos.x, pos.y)
        c.stroke()
        hasStroke.current = true
      }
      last.current = pos
    }

    const end = () => {
      drawing.current = false
      last.current = null
    }

    React.useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current
        const c = ctx()
        if (canvas && c) c.clearRect(0, 0, canvas.width, canvas.height)
        hasStroke.current = false
      },
      isEmpty: () => !hasStroke.current,
      toDataURL: () => (hasStroke.current ? (canvasRef.current?.toDataURL('image/png') ?? null) : null),
    }))

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className={cn('h-full w-full touch-none rounded-lg bg-white', className)}
      />
    )
  },
)
SignaturePad.displayName = 'SignaturePad'
