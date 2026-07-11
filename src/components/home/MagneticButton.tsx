import { useState, useRef, useCallback, type ReactNode } from 'react'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  maxDisplacement?: number
  onClick?: () => void
  href?: string
  as?: 'button' | 'a' | 'link'
  to?: string
}

export default function MagneticButton({
  children,
  className = '',
  strength = 22,
  maxDisplacement = 6,
  onClick,
  href,
  as = 'button',
  to,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(false)

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const enabled = !isReducedMotion && !isTouchDevice

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const x = (e.clientX - cx) / strength
      const y = (e.clientY - cy) / strength
      setOffset({
        x: Math.max(-maxDisplacement, Math.min(maxDisplacement, x)),
        y: Math.max(-maxDisplacement, Math.min(maxDisplacement, y)),
      })
      setIsActive(true)
    },
    [enabled, strength, maxDisplacement],
  )

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 })
    setIsActive(false)
  }, [])

  const transition = isActive
    ? 'transform 0.3s ease-out'
    : 'transform 0.6s ease-in-out'

  const style = {
    transform: enabled
      ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
      : 'none',
    transition: enabled ? transition : 'none',
    willChange: isActive ? 'transform' : 'auto',
  }

  if (as === 'a' && href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    )
  }

  if (as === 'link' && to) {
    // We can't use Link directly with refs like this, so use an <a> with href
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={to}
        className={className}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => {
          e.preventDefault()
          // Smooth scroll or navigate
          if (to.startsWith('/#')) {
            const id = to.replace('/#', '')
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          } else if (to.startsWith('#')) {
            const id = to.replace('#', '')
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
          } else if (to.startsWith('/')) {
            window.location.href = to
          }
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      className={className}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}
