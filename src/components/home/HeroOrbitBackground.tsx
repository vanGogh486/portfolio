import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMouseParallax } from '@/hooks/useMouseParallax'

interface HeroOrbitBackgroundProps {
  isHoveringPortrait: boolean
}

export default function HeroOrbitBackground({
  isHoveringPortrait,
}: HeroOrbitBackgroundProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { offsetX, offsetY } = useMouseParallax({
    maxX: 10,
    maxY: 10,
    invert: true,
  })

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-[5]"
      aria-hidden="true"
    >
      <motion.div
        className="relative"
        style={{
          x: offsetX,
          y: offsetY,
        }}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{
          scale: isHoveringPortrait ? 1.02 : 1,
          opacity: isHoveringPortrait ? 0.7 : 0.45,
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Outer ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
          style={{ width: 'min(72vw, 620px)', height: 'min(72vw, 620px)' }}
          aria-hidden="true"
        />
        {/* Middle ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
          style={{ width: 'min(56vw, 480px)', height: 'min(56vw, 480px)' }}
          aria-hidden="true"
        />
        {/* Inner ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
          style={{ width: 'min(40vw, 340px)', height: 'min(40vw, 340px)' }}
          aria-hidden="true"
        />
        {/* Core glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 'min(28vw, 220px)',
            height: 'min(28vw, 220px)',
            background:
              'radial-gradient(ellipse at center, rgba(160,180,200,0.05) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
      </motion.div>
    </div>
  )
}
