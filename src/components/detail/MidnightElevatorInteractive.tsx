import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { publicAsset } from '@/lib/publicAsset'

type Phase = 'closed' | 'intro' | 'choice' | 'loading-a' | 'loading-b' | 'branch-a' | 'branch-b' | 'ending'

const CHOICE_TIME = 32.55

export default function MidnightElevatorInteractive({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [chosenBranch, setChosenBranch] = useState<'a' | 'b' | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null!)
  const scrollY = useRef(0)
  const choiceFired = useRef(false)

  // Lock body
  useEffect(() => {
    if (open) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`; document.body.style.width = '100%'
      choiceFired.current = false
      setPhase('intro')
    }
    return () => {
      document.body.style.overflow = ''; document.body.style.position = ''
      document.body.style.top = ''; document.body.style.width = ''
    }
  }, [open])

  // Start intro when phase becomes intro
  useEffect(() => {
    if (phase === 'intro') {
      const v = videoRef.current
      v.src = publicAsset('/projects/midnight-elevator/interactive/intro.mp4')
      v.currentTime = 0
      v.load()
      const onCanPlay = () => { v.removeEventListener('canplay', onCanPlay); v.play().catch(() => {}) }
      v.addEventListener('canplay', onCanPlay)
    }
  }, [phase])

  // timeupdate — detect choice point
  const handleTimeUpdate = useCallback(() => {
    if (choiceFired.current || phase !== 'intro') return
    const v = videoRef.current
    if (v && v.currentTime >= CHOICE_TIME) {
      choiceFired.current = true
      v.pause()
      setPhase('choice')
    }
  }, [phase])

  // Select branch
  const selectBranch = useCallback((branch: 'a' | 'b') => {
    setChosenBranch(branch)
    setPhase(branch === 'a' ? 'loading-a' : 'loading-b')

    const v = videoRef.current
    v.pause()
    v.src = publicAsset(`/projects/midnight-elevator/interactive/branch-${branch}.mp4`)
    v.currentTime = 0
    v.load()

    const targetPhase = branch === 'a' ? 'branch-a' : 'branch-b'
    const onCanPlay = () => {
      v.removeEventListener('canplay', onCanPlay)
      v.play().catch(() => {})
      setPhase(targetPhase)
    }
    v.addEventListener('canplay', onCanPlay)
    // Timeout fallback
    setTimeout(() => {
      if (v.readyState >= 3 && phase.startsWith('loading-')) {
        v.play().catch(() => {})
        setPhase(targetPhase)
      }
    }, 3000)
  }, [phase])

  // Branch ended
  const handleEnded = useCallback(() => {
    setPhase('ending')
  }, [])

  // View other ending
  const viewOther = useCallback(() => {
    const target = chosenBranch === 'a' ? 'b' : 'a'
    setChosenBranch(target)
    setPhase(target === 'a' ? 'loading-a' : 'loading-b')

    const v = videoRef.current
    v.pause()
    v.src = `/projects/midnight-elevator/interactive/branch-${target}.mp4`
    v.currentTime = 0
    v.load()

    const onCanPlay = () => {
      v.removeEventListener('canplay', onCanPlay)
      v.play().catch(() => {})
      setPhase(target === 'a' ? 'branch-a' : 'branch-b')
    }
    v.addEventListener('canplay', onCanPlay)
  }, [chosenBranch])

  // Restart
  const restart = useCallback(() => {
    choiceFired.current = false
    setChosenBranch(null)
    setPhase('intro')
  }, [])

  // Close
  const handleClose = useCallback(() => {
    const v = videoRef.current
    if (v) { v.pause(); v.removeAttribute('src'); v.load() }
    setPhase('closed')
    document.body.style.overflow = ''; document.body.style.position = ''
    document.body.style.top = ''; document.body.style.width = ''
    window.scrollTo({ top: scrollY.current, behavior: 'instant' as ScrollBehavior })
    onClose()
  }, [onClose])

  // Keyboard
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { handleClose(); return }
      if (phase === 'choice') {
        if (e.key === 'a' || e.key === 'A') selectBranch('a')
        if (e.key === 'b' || e.key === 'B') selectBranch('b')
      }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [open, phase, handleClose, selectBranch])

  // Pause on tab hidden
  useEffect(() => {
    if (!open) return
    const onVis = () => {
      const v = videoRef.current
      if (document.hidden && v && !v.paused) v.pause()
      else if (!document.hidden && v && phase === 'intro' && !choiceFired.current) v.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [open, phase])

  if (!open) return null

  const isLoading = phase === 'loading-a' || phase === 'loading-b'

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/92 backdrop-blur-md">
      {/* Close */}
      <button onClick={handleClose}
        className="absolute top-4 right-4 z-20 rounded-full bg-white/10 p-2.5 text-white/60 hover:text-white transition-colors" aria-label="关闭">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      {/* Single video container — fixed 9:16 */}
      <div className="relative" style={{ aspectRatio: '9 / 16', maxHeight: '86vh', height: 'min(86vh, 95vw * 16/9)' }}>
        {/* Choice frame backdrop during loading */}
        {(isLoading || phase === 'choice') && (
          <img src={publicAsset("/projects/midnight-elevator/interactive/choice-frame.jpg")} alt=""
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
            style={{ opacity: isLoading ? 0.5 : 0.3 }} aria-hidden="true" />
        )}

        {/* SINGLE video element */}
        <video ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain rounded-lg"
          playsInline preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded} />

        {/* Choice overlay — on top of paused video */}
        {phase === 'choice' && (
          <motion.div className="absolute inset-0 flex rounded-lg overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.12) 100%)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <button onClick={() => selectBranch('a')} className="flex-1 h-full"
              aria-label="A 打开门" style={{ background: 'transparent', cursor: 'pointer' }} />
            <button onClick={() => selectBranch('b')} className="flex-1 h-full"
              aria-label="B 按住关门键" style={{ background: 'transparent', cursor: 'pointer' }} />
            {/* Subtle text labels */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12 pointer-events-none">
              <span className="text-[15px] font-bold" style={{ color: 'rgba(220,80,60,0.85)' }}>A 打开门</span>
              <span className="text-[15px] font-bold" style={{ color: 'rgba(130,170,210,0.8)' }}>B 按住关门键</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="mt-4 text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>LOADING</p>
      )}

      {/* Ending */}
      {phase === 'ending' && (
        <motion.div className="mt-6 flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={viewOther}
            className="rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300 min-w-[44px] min-h-[44px] hover:scale-105"
            style={{ borderColor: 'rgba(200,192,184,0.12)', color: 'rgba(200,192,184,0.5)' }}>
            查看另一结局
          </button>
          <button onClick={restart}
            className="rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300 min-w-[44px] min-h-[44px]"
            style={{ borderColor: 'rgba(200,192,184,0.08)', color: 'rgba(200,192,184,0.35)' }}>
            重新开始
          </button>
          <button onClick={handleClose}
            className="rounded-full border px-5 py-2.5 text-[13px] font-medium transition-all duration-300 min-w-[44px] min-h-[44px]"
            style={{ borderColor: 'rgba(200,192,184,0.06)', color: 'rgba(200,192,184,0.25)' }}>
            返回详情页
          </button>
        </motion.div>
      )}
    </div>
  )
}
