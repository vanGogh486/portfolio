import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
  onClick: () => void
}

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const [hoverState, setHoverState] = useState<'idle' | 'pending' | 'preview' | 'leave'>('idle')
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoError, setVideoError] = useState(false)

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const clearTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
  }

  const handleMouseEnter = useCallback(() => {
    if (isTouchDevice) return
    clearTimer()
    setHoverState('pending')
    hoverTimer.current = setTimeout(() => {
      setHoverState('preview')
      if (videoRef.current && !videoError) {
        videoRef.current.currentTime = 0
        videoRef.current.play().catch(() => setVideoError(true))
      }
    }, 250)
  }, [isTouchDevice, videoError])

  const handleMouseLeave = useCallback(() => {
    clearTimer()
    setHoverState('leave')
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setTimeout(() => {
      if (hoverState !== 'preview' && hoverState !== 'pending') {
        setHoverState('idle')
      }
    }, 300)
  }, [])

  const isActive = hoverState === 'preview' || hoverState === 'pending'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-project-slug={project.slug}
        className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-400 cursor-pointer
          hover:-translate-y-1
          focus-visible:outline-2 focus-visible:outline-offset-2
          ${project.size === 'large' ? 'aspect-[16/9]' : project.size === 'wide' ? 'aspect-[21/9]' : 'aspect-[16/10]'}
        `}
        style={{
          backgroundColor: '#141414',
          borderColor: isActive ? 'rgba(200,192,184,0.08)' : 'rgba(200,192,184,0.04)',
          outlineColor: '#B8936E',
        }}
      >
        {/* Cover image — always visible */}
        <div className="absolute inset-0 bg-[#0C0C0C]">
          <img
            src={project.cover}
            alt={project.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              hoverState === 'preview' ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />
          {/* Hover preview video — desktop only */}
          {!isTouchDevice && !videoError && (
            <video
              ref={videoRef}
              src={project.preview}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
                hoverState === 'preview' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
              }`}
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoError(true)}
              aria-hidden="true"
            />
          )}
          {/* Error fallback: keep cover visible */}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <img src={project.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            </div>
          )}
        </div>

        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(12,12,12,0.9) 0%, rgba(12,12,12,0.25) 45%, transparent 75%)',
          }}
        />

        {/* Content overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
          {/* Number + category row */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-[0.15em]" style={{ color: 'rgba(200,192,184,0.3)' }}>
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span className="text-[10px] font-medium tracking-[0.1em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl sm:text-2xl font-bold leading-tight transition-colors duration-300"
            style={{ color: hoverState === 'preview' ? 'rgba(200,192,184,0.95)' : 'rgba(200,192,184,0.85)' }}
          >
            {project.title}
            {/* Accent underline on hover */}
            <span
              className="block h-[1px] mt-1 transition-all duration-400"
              style={{
                width: hoverState === 'preview' ? '100%' : '0%',
                backgroundColor: '#B8936E',
              }}
            />
          </h3>

          {/* EN title + year */}
          <p className="text-[10px] tracking-[0.06em] uppercase mt-1.5" style={{ color: 'rgba(200,192,184,0.22)' }}>
            {project.englishTitle} · {project.year}
          </p>

          {/* Role */}
          <p className="text-[12px] leading-relaxed line-clamp-1 max-w-lg mt-1.5" style={{ color: 'rgba(200,192,184,0.4)' }}>
            {project.role}
          </p>

          {/* Disclaimer badge */}
          {project.disclaimer && (
            <p className="text-[9px] italic mt-1.5" style={{ color: 'rgba(200,192,184,0.18)' }}>
              {project.disclaimer}
            </p>
          )}
        </div>

        {/* Top-right disclaimer pill */}
        {project.disclaimer && (
          <div
            className="absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[9px] backdrop-blur-sm"
            style={{ color: 'rgba(200,192,184,0.25)', backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            个人概念练习
          </div>
        )}

        {/* Number badge — top left */}
        <div
          className="absolute top-3 left-3 z-10 rounded-md px-2 py-1 text-[10px] font-bold tracking-[0.1em] backdrop-blur-sm"
          style={{ color: 'rgba(200,192,184,0.25)', backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          {(index + 1).toString().padStart(2, '0')}
        </div>

        {/* Hover arrow — bottom right */}
        <div
          className={`absolute bottom-5 right-5 transition-all duration-400 ${
            hoverState === 'preview' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
          }`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="rgba(200,192,184,0.45)" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
          </svg>
        </div>
      </button>
    </motion.div>
  )
}
