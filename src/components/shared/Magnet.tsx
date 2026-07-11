import { useState, useRef, useEffect, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  strength?: number
  maxDisplacement?: number
  padding?: number
  className?: string
}

export default function Magnet({
  children,
  strength = 18,
  maxDisplacement = 20,
  padding = 120,
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)
  const prefersReducedMotion = useRef(false)
  const isTouchDevice = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    isTouchDevice.current =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (prefersReducedMotion.current || isTouchDevice.current) return

    const el = ref.current
    if (!el) return

    const handleMove = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = clientX - centerX
      const distanceY = clientY - centerY

      // Check if cursor is within padding distance of the element
      const withinPadding =
        Math.abs(distanceX) < rect.width / 2 + padding &&
        Math.abs(distanceY) < rect.height / 2 + padding

      if (withinPadding) {
        const x = Math.max(
          -maxDisplacement,
          Math.min(maxDisplacement, distanceX / strength),
        )
        const y = Math.max(
          -maxDisplacement,
          Math.min(maxDisplacement, distanceY / strength),
        )
        setOffset({ x, y })
        setIsActive(true)
      } else {
        setOffset({ x: 0, y: 0 })
        setIsActive(false)
      }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [strength, maxDisplacement, padding])

  const transition = isActive
    ? 'transform 0.3s ease-out'
    : 'transform 0.6s ease-in-out'

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition,
        willChange: isActive ? 'transform' : 'auto',
      }}
    >
      {children}
    </div>
  )
}
