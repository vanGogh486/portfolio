import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'

interface HeroBackgroundTextProps {
  text: string
  isHoveringPortrait: boolean
}

export default function HeroBackgroundText({
  text,
  isHoveringPortrait,
}: HeroBackgroundTextProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { offsetX, offsetY } = useMouseParallax({
    maxX: 6,
    maxY: 4,
    invert: true,
  })

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-10"
      aria-hidden="true"
    >
      <motion.h1
        className="font-black uppercase tracking-tight leading-none whitespace-nowrap"
        style={{
          fontSize: 'clamp(3.5rem, 16vw, 20rem)',
          background:
            'linear-gradient(180deg, #3a4048 0%, #7a8a98 35%, #bcc8d4 70%, #d0dae4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          opacity: isHoveringPortrait ? 0.62 : 0.50,
          x: offsetX,
          y: offsetY,
          transition: 'opacity 0.5s ease',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHoveringPortrait ? 0.62 : 0.50 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {text}
      </motion.h1>
    </div>
  )
}
