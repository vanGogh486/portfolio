import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface HeroPortraitProps {
  imageSrc: string
  videoSrc?: string
  posterSrc?: string
  mode?: 'image' | 'video'
  className?: string
  onHoverChange?: (hovering: boolean) => void
}

export default function HeroPortrait({
  imageSrc,
  videoSrc,
  posterSrc,
  mode = 'image',
  className = '',
  onHoverChange,
}: HeroPortraitProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const motionX = useMotionValue(0)
  const motionY = useMotionValue(0)
  const springX = useSpring(motionX, { stiffness: 50, damping: 30, mass: 0.6 })
  const springY = useSpring(motionY, { stiffness: 50, damping: 30, mass: 0.6 })

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const parallaxEnabled = !isTouchDevice && !isReducedMotion

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!parallaxEnabled || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = ((e.clientX - cx) / rect.width) * 24
      const dy = ((e.clientY - cy) / rect.height) * 16
      motionX.set(dx)
      motionY.set(dy)
    },
    [parallaxEnabled, motionX, motionY],
  )

  const handleMouseLeave = useCallback(() => {
    motionX.set(0)
    motionY.set(0)
    setIsHovering(false)
    onHoverChange?.(false)
  }, [motionX, motionY, onHoverChange])

  const handleMouseEnterLocal = useCallback(() => {
    setIsHovering(true)
    onHoverChange?.(true)
  }, [onHoverChange])

  const isVideo = mode === 'video' && videoSrc && !videoError

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 flex items-end justify-center z-20 pointer-events-none ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative pointer-events-auto"
        style={{
          x: parallaxEnabled ? springX : 0,
          y: parallaxEnabled ? springY : 0,
          width: '100%',
          maxWidth: '100vw',
          height: '100%',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnterLocal}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="relative w-full h-full flex items-end justify-center"
          animate={{
            scale: isHovering ? 1.015 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc ?? imageSrc}
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
              className="h-full w-auto max-w-none object-contain object-bottom"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 95%, rgba(0,0,0,0.3) 100%)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 95%, rgba(0,0,0,0.3) 100%)',
              }}
              aria-label="Hero portrait video"
            />
          ) : (
            <img
              src={imageSrc}
              alt="潘奕冰"
              className="h-full w-auto max-w-none object-contain object-bottom select-none"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 95%, rgba(0,0,0,0.3) 100%)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,1) 95%, rgba(0,0,0,0.3) 100%)',
              }}
              draggable={false}
            />
          )}
        </motion.div>

        {/* Bottom fade gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, #0C0C0C 0%, rgba(12,12,12,0.8) 40%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  )
}
