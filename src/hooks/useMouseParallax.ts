import { useState, useEffect, useCallback } from 'react'

interface ParallaxOptions {
  maxX?: number
  maxY?: number
  invert?: boolean
}

interface ParallaxResult {
  offsetX: number
  offsetY: number
}

/**
 * Lightweight mouse parallax — updates CSS custom properties style values.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function useMouseParallax(options: ParallaxOptions = {}): ParallaxResult {
  const { maxX = 10, maxY = 10, invert = false } = options
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const enabled = !isTouchDevice && !isReducedMotion

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Normalize to [-1, 1] range based on viewport
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      const sign = invert ? -1 : 1
      setOffset({
        x: nx * maxX * sign,
        y: ny * maxY * sign,
      })
    },
    [maxX, maxY, invert],
  )

  useEffect(() => {
    if (!enabled) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [enabled, handleMouseMove])

  return { offsetX: enabled ? offset.x : 0, offsetY: enabled ? offset.y : 0 }
}
