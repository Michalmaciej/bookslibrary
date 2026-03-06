import { useEffect, useRef } from 'react'

const BUBBLES = [
  { color: 'rgba(233, 69, 96, 0.5)',   r: 280, x: 0.15, y: 0.2,  dur: 9 },
  { color: 'rgba(124, 58, 237, 0.45)', r: 320, x: 0.75, y: 0.7,  dur: 11 },
  { color: 'rgba(15, 52, 96, 0.7)',    r: 380, x: 0.5,  y: 0.85, dur: 13 },
  { color: 'rgba(83, 52, 131, 0.5)',   r: 240, x: 0.85, y: 0.15, dur: 10 },
  { color: 'rgba(233, 69, 96, 0.3)',   r: 180, x: 0.3,  y: 0.6,  dur: 7 },
  { color: 'rgba(26, 106, 74, 0.35)',  r: 200, x: 0.65, y: 0.35, dur: 12 },
]

export function BubbleBackground({ className = '' }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const bubbles = BUBBLES.map(b => ({ ...b }))

    const draw = (ts) => {
      const t = ts * 0.001
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      bubbles.forEach((b, i) => {
        const phase = (i * Math.PI * 2) / bubbles.length
        let bx = b.x * w + Math.sin(t / b.dur + phase) * w * 0.28
        let by = b.y * h + Math.cos(t / b.dur + phase * 1.3) * h * 0.25

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(bx, by, b.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.filter = 'blur(40px)'
        ctx.fill()
        ctx.filter = 'none'
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
