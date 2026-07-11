import { useEffect, useRef, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { open: boolean; onClose: () => void }

export default function BookModal({ open, onClose }: Props) {
  const [playerState, setPlayerState] = useState<'idle' | 'playing' | 'paused'>('idle')
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [videoError, setVideoError] = useState(false)
  const fullVideoRef = useRef<HTMLVideoElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const scrollY = useRef(0)

  // Open/close lifecycle
  useEffect(() => {
    if (open) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`
      document.body.style.width = '100%'
      setTimeout(() => modalRef.current?.focus(), 100)
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY.current)
      setPlayerState('idle')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [open])

  const handleClose = useCallback(() => {
    if (fullVideoRef.current) { fullVideoRef.current.pause(); fullVideoRef.current.currentTime = 0 }
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, handleClose])

  const togglePlay = () => {
    const v = fullVideoRef.current; if (!v) return
    if (v.paused) { v.play().catch(() => setVideoError(true)); setPlayerState('playing') }
    else { v.pause(); setPlayerState('paused') }
  }
  const toggleMute = () => { if (fullVideoRef.current) { fullVideoRef.current.muted = !isMuted; setIsMuted(!isMuted) } }
  const fmt = (t: number) => { const m = Math.floor(t / 60); const s = Math.floor(t % 60); return `${m}:${s.toString().padStart(2, '0')}` }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={handleClose} aria-hidden="true" />

          {/* Modal container — explicit dimensions */}
          <motion.div
            ref={modalRef}
            className="relative z-10 w-full rounded-2xl border shadow-2xl focus:outline-none flex flex-col overflow-hidden"
            style={{
              width: 'min(1200px, 92vw)',
              height: 'min(760px, 88vh)',
              minHeight: '560px',
              backgroundColor: '#1a1a18',
              borderColor: 'rgba(200,192,184,0.06)',
            }}
            role="dialog" aria-modal="true" aria-label="《卸甲》项目详情" tabIndex={-1}
            data-modal-project-slug="unarmored"
          >
            {/* Close btn */}
            <button onClick={handleClose}
              className="absolute top-4 right-4 z-30 rounded-full bg-black/60 p-2.5 text-white/60 hover:text-white transition-colors"
              aria-label="关闭">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Two-page layout */}
            <div className="flex flex-col lg:flex-row flex-1 min-h-0">
              {/* Left page — real HTML text */}
              <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/[0.05] overflow-y-auto">
                <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>01 · AIGC叙事动画短片</span>
                <h2 className="mt-3 text-3xl sm:text-4xl font-bold" style={{ color: '#C8C0B8' }}>《卸甲》</h2>
                <p className="text-[10px] tracking-[0.06em] uppercase mt-1" style={{ color: 'rgba(200,192,184,0.2)' }}>UNARMORED · 2026</p>
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'rgba(200,192,184,0.3)' }}>我的职责</p>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.48)' }}>创意策划 / 视觉风格 / 分镜设计 / AIGC生成 / 剪辑包装</p>
                </div>
                <p className="mt-5 text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.35)' }}>
                  战争结束后，木兰回到故乡，却发现身体已经回家，记忆仍停留在战场。以冷灰水墨与克制叙事，讨论"如何带着伤口重新生活"。
                </p>
              </div>

              {/* Right page — video player */}
              <div className="flex-1 bg-black flex flex-col min-h-0">
                <div className="flex-1 relative min-h-[280px]">
                  <video ref={fullVideoRef}
                    src="/projects/unarmored/preview.mp4"
                    poster="/media/portfolio-v2/projects/unarmored/poster.png"
                    className="absolute inset-0 w-full h-full object-contain bg-black cursor-pointer"
                    muted={isMuted} loop playsInline preload="metadata"
                    onTimeUpdate={() => { if (fullVideoRef.current) setCurrentTime(fullVideoRef.current.currentTime) }}
                    onLoadedMetadata={() => { if (fullVideoRef.current) setDuration(fullVideoRef.current.duration) }}
                    onError={() => setVideoError(true)}
                    onClick={togglePlay}
                  />
                  {/* Play overlay */}
                  {playerState !== 'playing' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10" onClick={togglePlay}>
                      <div className="rounded-full bg-black/50 p-4 hover:bg-black/70 transition-colors cursor-pointer">
                        <svg className="h-10 w-10" fill="rgba(200,192,184,0.8)" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Player controls */}
                <div className="bg-gradient-to-t from-black/90 to-transparent pt-10 pb-3 px-4">
                  <input type="range" min="0" max={duration || 0} value={currentTime}
                    onChange={e => { if (fullVideoRef.current) { fullVideoRef.current.currentTime = Number(e.target.value); setCurrentTime(fullVideoRef.current.currentTime) } }}
                    className="w-full mb-3 h-1 appearance-none rounded-full cursor-pointer"
                    style={{ background: `linear-gradient(to right, #B8936E ${duration > 0 ? (currentTime / duration) * 100 : 0}%, rgba(200,192,184,0.15) ${duration > 0 ? (currentTime / duration) * 100 : 0}%)` }}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={togglePlay} className="text-white/70 hover:text-white" aria-label={playerState === 'playing' ? '暂停' : '播放'}>
                        {playerState === 'playing'
                          ? <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                          : <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                      </button>
                      <button onClick={toggleMute} className="text-white/50 hover:text-white/80" aria-label={isMuted ? '取消静音' : '静音'}>
                        {isMuted
                          ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                          : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>}
                      </button>
                      <span className="text-[10px] text-white/40 tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-[9px] py-2" style={{ color: 'rgba(200,192,184,0.12)' }}>预览片 · 完整成片待接入</p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/[0.04] px-6 py-3 flex justify-between items-center flex-shrink-0">
              <p className="text-[9px]" style={{ color: 'rgba(200,192,184,0.12)' }}>Unarmored / 2026</p>
              <Link to="/project/unarmored" onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-[12px] font-medium transition-all"
                style={{ borderColor: 'rgba(200,192,184,0.12)', color: 'rgba(200,192,184,0.7)', backgroundColor: 'rgba(200,192,184,0.03)' }}>
                查看完整案例 →</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
