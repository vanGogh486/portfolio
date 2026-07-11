import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { publicAsset } from '@/lib/publicAsset'

type Phase = 'cover' | 'opening' | 'screening' | 'auto-closing'

export default function CinematicBookPlayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('cover')
  const [showCover, setShowCover] = useState(true)

  const openRef = useRef<HTMLVideoElement>(null!)
  const fullRef = useRef<HTMLVideoElement>(null!)
  const flipRef = useRef<HTMLVideoElement>(null!)
  const closeRef = useRef<HTMLVideoElement>(null!)
  const scrollY = useRef(0)
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Lock body
  useEffect(() => {
    if (open) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`; document.body.style.width = '100%'
      setPhase('cover'); setShowCover(true)
    }
    return () => {
      document.body.style.overflow = ''; document.body.style.position = ''
      document.body.style.top = ''; document.body.style.width = ''
    }
  }, [open])

  // Start opening
  const startOpening = useCallback(() => {
    setShowCover(false)
    if (isReducedMotion) { setPhase('screening'); startScreening(); return }
    setPhase('opening')
    const v = openRef.current
    v.src = '/media/portfolio-v2/book/open.mp4'; v.currentTime = 0; v.load()
    const onCanPlay = () => { v.removeEventListener('canplay', onCanPlay); v.play().catch(() => { setPhase('screening'); startScreening() }) }
    v.addEventListener('canplay', onCanPlay)
    v.onended = () => { v.onended = null; setPhase('screening'); startScreening() }
    animTimeout.current = setTimeout(() => { setPhase('screening'); startScreening() }, 5000)
  }, [isReducedMotion])

  // Start screening
  const startScreening = useCallback(() => {
    // Play flip as subtle background
    if (!isReducedMotion) {
      const f = flipRef.current
      f.src = '/media/portfolio-v2/book/flip.mp4'; f.currentTime = 0; f.load()
      f.oncanplay = () => { f.oncanplay = null; f.play().catch(() => {}) }
    }
    // Play full video
    const v = fullRef.current
    v.src = '/projects/unarmored/full.mp4'; v.currentTime = 0; v.load()
    const onCanPlay = () => { v.removeEventListener('canplay', onCanPlay); v.play().catch(() => {}) }
    v.addEventListener('canplay', onCanPlay)
    v.onended = () => { v.onended = null; startClosing() }
  }, [isReducedMotion])

  // Auto close — only triggered by full video ending
  const startClosing = useCallback(() => {
    // Stop flip background
    if (flipRef.current) { flipRef.current.pause(); flipRef.current.removeAttribute('src') }
    if (isReducedMotion) { setPhase('cover'); setShowCover(true); return }
    setPhase('auto-closing')
    const v = closeRef.current
    v.src = '/media/portfolio-v2/book/close.mp4'; v.currentTime = 0; v.load()
    v.oncanplay = () => { v.oncanplay = null; v.play().catch(() => {}) }
    v.onended = () => { v.onended = null; setPhase('cover'); setShowCover(true) }
    animTimeout.current = setTimeout(() => { setPhase('cover'); setShowCover(true) }, 5000)
  }, [isReducedMotion])

  // Manual exit — NO close animation
  const manualExit = useCallback(() => {
    [openRef, fullRef, flipRef, closeRef].forEach(r => {
      if (r.current) { r.current.pause(); r.current.removeAttribute('src'); r.current.load() }
    })
    if (animTimeout.current) clearTimeout(animTimeout.current)
    document.body.style.overflow = ''; document.body.style.position = ''
    document.body.style.top = ''; document.body.style.width = ''
    window.scrollTo({ top: scrollY.current, behavior: 'instant' as ScrollBehavior })
    onClose()
  }, [onClose])

  // Esc = manual exit
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') manualExit() }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [open, manualExit])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[115] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Close button — always visible */}
      <button onClick={manualExit}
        className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2.5 text-white/60 hover:text-white transition-colors" aria-label="关闭">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      {/* Flip background — subtle, behind everything */}
      <video ref={flipRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ filter: 'blur(36px)', opacity: phase === 'screening' ? 0.12 : 0, scale: '1.1', transition: 'opacity 0.6s' }}
        muted loop playsInline preload="metadata" />

      {/* Main stage — all phases in same container */}
      <div className="relative w-[min(92vw,1100px)] h-[min(78vh,82vw*9/16)] min-h-[360px] rounded-xl overflow-hidden"
        style={{ backgroundColor: '#0C0C0C', borderColor: 'rgba(200,192,184,0.06)', borderWidth: 1 }}>

        {/* COVER */}
        {showCover && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={startOpening}
            style={{ backgroundColor: '#0C0C0C' }}>
            <motion.div className="text-center" whileHover={{ scale: 1.015 }} transition={{ duration: 0.4 }}>
              <img src={publicAsset("/media/portfolio-v2/projects/unarmored/poster.png")} alt="《卸甲》"
                className="max-w-[85%] max-h-[65%] object-contain mx-auto rounded-lg mb-6 opacity-90"
                style={{ filter: 'brightness(0.9)' }} />
              <h2 className="text-3xl sm:text-4xl font-bold text-[#C8C0B8] mb-1">《卸甲》</h2>
              <p className="text-[11px] tracking-[0.12em] uppercase text-white/20">UNARMORED</p>
              <p className="mt-4 text-[12px] text-white/30 tracking-[0.1em]">点击打开作品</p>
            </motion.div>
          </motion.div>
        )}

        {/* Opening animation */}
        <video ref={openRef}
          className={`absolute inset-0 w-full h-full object-contain ${phase === 'opening' ? '' : 'hidden'}`}
          muted playsInline preload="metadata" />

        {/* Full video — screening */}
        <video ref={fullRef}
          className={`absolute inset-0 w-full h-full object-contain ${phase === 'screening' ? '' : 'hidden'}`}
          controls playsInline preload="metadata" />

        {/* Closing animation */}
        <video ref={closeRef}
          className={`absolute inset-0 w-full h-full object-contain ${phase === 'auto-closing' ? '' : 'hidden'}`}
          muted playsInline preload="metadata" />
      </div>

      {/* Phase label */}
      {phase !== 'cover' && (
        <p className="mt-4 text-[10px] tracking-[0.15em] uppercase text-white/15">
          {phase === 'opening' ? 'OPENING' : phase === 'screening' ? 'NOW PLAYING' : phase === 'auto-closing' ? 'CLOSING' : ''}
        </p>
      )}
    </div>
  )
}
