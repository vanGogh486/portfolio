import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProjectEntry {
  slug: string; num: string; title: string; titleEn: string
  category: string; year: string; role: string; summary: string
  cover: string; preview?: string; hoverVideo?: string; fullVideo?: string
}

interface Props {
  projects: ProjectEntry[]
  activeIndex: number
  open: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function CinematicProjectViewer({ projects, activeIndex, open, onClose, onPrev, onNext }: Props) {
  const [videoError, setVideoError] = useState(false)
  const [playerState, setPlayerState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fullVideoRef = useRef<HTMLVideoElement | null>(null)
  const [fullPlayerOpen, setFullPlayerOpen] = useState(false)
  const scrollY = useRef(0)

  const active = projects[activeIndex]
  const hasFullVideo = !!active?.fullVideo
  const hasVideo = !!active.preview

  // On open: lock scroll. On close: restore AFTER exit animation.
  useEffect(() => {
    if (open) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`; document.body.style.width = '100%'
      setPlayerState('idle'); setVideoError(false)
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
      }, 100)
    }
    return () => {
      // Cleanup on unmount only — scroll restore handled by onExitComplete
    }
  }, [open])

  const handleExitComplete = useCallback(() => {
    document.body.style.overflow = ''; document.body.style.position = ''
    document.body.style.top = ''; document.body.style.width = ''
    window.scrollTo({ top: scrollY.current, behavior: 'instant' as ScrollBehavior })
  }, [])

  const handleClose = useCallback(() => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 }
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open, handleClose, onPrev, onNext])

  // Reset video on project change
  useEffect(() => { setPlayerState('idle'); setVideoError(false); if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() } }, [activeIndex])

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return
    if (v.paused) { v.play().catch(() => setVideoError(true)); setPlayerState('playing') }
    else { v.pause(); setPlayerState('paused') }
  }
  const toggleMute = () => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted) } }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {open && active && (
        <motion.div className="fixed inset-0 z-[110] flex items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" onClick={handleClose} />

          {/* Main container */}
          <motion.div className="relative z-10 w-full max-w-6xl max-h-[94vh] flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden"
            style={{ backgroundColor: '#141414', borderColor: 'rgba(200,192,184,0.06)', borderWidth: 1 }}
            initial={{ scale: 0.96, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 16 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
            {/* Close */}
            <button onClick={handleClose} className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2.5 text-white/60 hover:text-white transition-colors" aria-label="关闭">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* PREV / NEXT arrows */}
            <button onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white/40 hover:text-white/80 transition-colors hidden lg:block" aria-label="上一个">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/50 p-2 text-white/40 hover:text-white/80 transition-colors hidden lg:block" aria-label="下一个">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
            </button>

            {/* LEFT/BOTTOM: Info */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center order-2 lg:order-1">
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>{active.num} · {active.category}</span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: '#C8C0B8' }}>{active.title}</h2>
              <p className="text-[10px] tracking-[0.06em] uppercase mt-1" style={{ color: 'rgba(200,192,184,0.2)' }}>{active.titleEn} · {active.year}</p>
              <div className="mt-5 space-y-2">
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(200,192,184,0.28)' }}>职责</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.48)' }}>{active.role}</p>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.35)' }}>{active.summary}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: '#B8936E' }}>
                    VIEWING · {active.num} / {projects.length.toString().padStart(2,'0')}
                  </span>
                  {hasFullVideo && (
                    <button type="button" onClick={() => setFullPlayerOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] font-medium transition-all duration-300 hover:bg-white/[0.04]"
                      style={{ borderColor: 'rgba(200,192,184,0.15)', color: 'rgba(200,192,184,0.5)' }}>
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      播放完整作品
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT/TOP: Big image or video */}
            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[300px] lg:min-h-[500px] order-1 lg:order-2 rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none overflow-hidden">
              {/* Poster — always shown when video not playing */}
              <img src={publicAsset(active.cover)} alt={active.title}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${playerState === 'playing' ? 'opacity-0' : 'opacity-100'}`} />
              {/* Video — shown when playing */}
              {hasVideo && !videoError && (
                <video ref={videoRef} src={publicAsset(active.preview)} poster={publicAsset(active.cover)}
                  className={`absolute inset-0 w-full h-full object-contain bg-black cursor-pointer transition-opacity duration-500 ${playerState === 'playing' ? 'opacity-100' : 'opacity-0'}`}
                  muted={isMuted} loop playsInline preload="metadata"
                  onError={() => setVideoError(true)} onClick={togglePlay} />
              )}
              {/* Play button */}
              {hasVideo && playerState !== 'playing' && (
                <button onClick={togglePlay} className="relative z-10 rounded-full bg-black/50 p-5 hover:bg-black/70 transition-colors" aria-label="播放">
                  <svg className="h-12 w-12" fill="rgba(200,192,184,0.7)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </button>
              )}
              {/* Controls */}
              {hasVideo && playerState === 'playing' && (
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-3 px-4">
                  <div className="flex items-center justify-between">
                    <button onClick={togglePlay} className="text-white/70 hover:text-white" aria-label="暂停">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    </button>
                    <button onClick={toggleMute} className="text-white/50 hover:text-white/80" aria-label={isMuted ? '取消静音' : '静音'}>
                      {isMuted
                        ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                        : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Full Video Player Overlay */}
      {fullPlayerOpen && active?.fullVideo && (
        <div className="fixed inset-0 z-[120] bg-black flex items-center justify-center">
          <button onClick={() => { fullVideoRef.current?.pause(); if (fullVideoRef.current) fullVideoRef.current.currentTime = 0; setFullPlayerOpen(false) }}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white/70 hover:text-white transition-colors" aria-label="关闭">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          <video ref={fullVideoRef} src={publicAsset(active.fullVideo)} poster={publicAsset(active.cover)}
            className="max-w-full max-h-full object-contain" controls playsInline preload="metadata" />
        </div>
      )}
    </AnimatePresence>
  )
}
