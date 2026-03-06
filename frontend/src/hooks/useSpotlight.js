import { useRef, useCallback } from 'react'

export function useSpotlight(size = 350) {
  const containerRef = useRef(null)
  const glowRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = containerRef.current
    const glow = glowRef.current
    if (!el || !glow) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glow.style.opacity = '1'
    glow.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, rgba(200, 60, 100, 0.2) 0%, rgba(160, 50, 180, 0.12) 35%, rgba(80, 40, 160, 0.06) 60%, transparent 80%)`
  }, [size])

  const onMouseLeave = useCallback(() => {
    const glow = glowRef.current
    if (!glow) return
    glow.style.opacity = '0'
  }, [])

  return { containerRef, glowRef, onMouseMove, onMouseLeave }
}
