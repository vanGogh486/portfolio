import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '@/data/projects'

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectPreviewModal({ project, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const scrollY = useRef(0)

  const [playerState, setPlayerState] = useState<'idle' | 'playing' | 'paused' | 'ended'>('idle')
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Lock body scroll + save position on open
  useEffect(() => {
    if (project) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`
      document.body.style.width = '100%'
      setIsMuted(true)
      setPlayerState('idle')
      setVideoError(false)
      setCurrentTime(0)
      setDuration(0)
      // Focus modal
      setTimeout(() => modalRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY.current)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [project])

  // Esc to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!project) return
      if (e.key === 'Escape') {
        onClose()
      }
      if (e.key === 'Tab' && modalRef.current) {
        // Focus trap
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    },
    [project, onClose],
  )

  useEffect(() => {
    if (project) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [project, handleKeyDown])

  // Video time update
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) setDuration(videoRef.current.duration)
  }, [])

  // Play/pause
  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused || v.ended) {
      v.currentTime = v.ended ? 0 : v.currentTime
      v.play().catch(() => setVideoError(true))
      setPlayerState(v.ended ? 'playing' : 'playing')
    } else {
      v.pause()
      setPlayerState('paused')
    }
    if (v.ended) setPlayerState('playing')
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    }
  }, [])

  // Seek
  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = Number(e.target.value)
    setCurrentTime(v.currentTime)
  }, [])

  // Format time
  const fmt = (t: number) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full max-w-5xl max-h-[95vh] rounded-2xl bg-[#141414] border border-white/[0.08] shadow-2xl overflow-hidden focus:outline-none"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            data-modal-project-slug={project.slug}
            tabIndex={-1}
          >
            {/* Close button — top right */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 rounded-full bg-black/60 p-2.5 text-white/60 hover:text-white hover:bg-black/80 transition-colors"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* LEFT: Info panel */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
                <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/25">
                  {project.category}
                </span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: '#C8C0B8' }}>
                  {project.title}
                </h2>
                <p className="mt-1 text-[10px] tracking-[0.06em] uppercase text-white/18">
                  {project.englishTitle} &nbsp;·&nbsp; {project.year}
                </p>

                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider">职责</p>
                  <p className="text-[13px] text-white/50 leading-relaxed">{project.role}</p>
                </div>

                <p className="mt-4 text-[13px] text-white/35 leading-relaxed">{project.summary}</p>

                {project.disclaimer && (
                  <p className="mt-4 text-[10px] text-white/18 italic border-l-2 border-white/[0.06] pl-3">
                    {project.disclaimer}
                  </p>
                )}

                <Link
                  to={`/project/${project.slug}`}
                  onClick={onClose}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-full border px-5 py-2.5 text-[12px] font-medium transition-all duration-300"
                  style={{
                    borderColor: 'rgba(200,192,184,0.12)',
                    color: 'rgba(200,192,184,0.75)',
                    backgroundColor: 'rgba(200,192,184,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(184,147,110,0.4)'
                    e.currentTarget.style.color = '#B8936E'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200,192,184,0.12)'
                    e.currentTarget.style.color = 'rgba(200,192,184,0.75)'
                  }}
                >
                  查看完整案例
                  <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              </div>

              {/* RIGHT: Video player */}
              <div className="flex-1 bg-black relative min-h-[260px] lg:min-h-[420px] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none overflow-hidden">
                {/* Poster / idle overlay */}
                <div
                  className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 ${
                    playerState === 'playing' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <img
                    src={publicAsset(project.cover)}
                    alt={project.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  {/* Play button */}
                  <button
                    onClick={togglePlay}
                    className="relative z-20 rounded-full bg-black/50 p-4 hover:bg-black/70 transition-colors"
                    aria-label="播放"
                  >
                    <svg className="h-10 w-10" fill="rgba(200,192,184,0.8)" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>

                {/* Video element */}
                {videoError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={publicAsset(project.cover)} alt={project.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    <p className="relative text-white/30 text-sm">无法加载视频</p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    src={publicAsset(project.preview)}
                    poster={publicAsset(project.cover)}
                    className="absolute inset-0 h-full w-full object-contain bg-black cursor-pointer"
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setPlayerState('ended')}
                    onError={() => setVideoError(true)}
                    onClick={togglePlay}
                    aria-label={`${project.title} 预览视频`}
                    style={{ display: videoError ? 'none' : 'block' }}
                  />
                )}

                {/* Player controls bar */}
                <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent pt-12 pb-3 px-4 transition-opacity duration-300 ${playerState === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Progress bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full mb-3 h-1 appearance-none rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #B8936E ${duration > 0 ? (currentTime / duration) * 100 : 0}%, rgba(200,192,184,0.2) ${duration > 0 ? (currentTime / duration) * 100 : 0}%)`,
                      accentColor: '#B8936E',
                    }}
                    aria-label="视频进度"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Play/Pause */}
                      <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors" aria-label={playerState === 'playing' ? '暂停' : '播放'}>
                        {playerState === 'playing' ? (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                        ) : (
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      {/* Mute/Unmute */}
                      <button onClick={toggleMute} className="text-white/50 hover:text-white/80 transition-colors" aria-label={isMuted ? '取消静音' : '静音'}>
                        {isMuted ? (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                        )}
                      </button>
                      {/* Time */}
                      <span className="text-[10px] text-white/40 tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
                    </div>
                    {/* Fullscreen */}
                    <button onClick={toggleFullscreen} className="text-white/40 hover:text-white/70 transition-colors" aria-label="全屏">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
