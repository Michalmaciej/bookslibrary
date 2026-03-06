import { useRef, useCallback } from 'react'

export function useTilt(maxDeg = 12) {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // pozycja kursora względem środka karty (-1 do 1)
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    // rotateY (przechylenie lewo/prawo), rotateX (góra/dół) - odwrócone Y
    el.style.transform = `perspective(600px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg) scale(1.02)`
    el.style.transition = 'transform 0.1s ease'
  }, [maxDeg])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
    el.style.transition = 'transform 0.4s ease'
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
