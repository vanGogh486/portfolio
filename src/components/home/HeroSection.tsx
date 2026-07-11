import { useRef, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { publicAsset } from '@/lib/publicAsset'

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const bgVideoRef = useRef<HTMLVideoElement | null>(null)
  const personVideoRef = useRef<HTMLVideoElement | null>(null)
  const [videoError, setVideoError] = useState(false)
  const [bgError, setBgError] = useState(false)

  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const showVideo = !isReducedMotion
  const parallaxOn = !isTouchDevice && !isReducedMotion && !isMobile

  // Scroll exit
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0])
  const personY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 30])

  // Mouse parallax
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0)
  const personPX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 40, damping: 30 })
  const personPY = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), { stiffness: 40, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!parallaxOn) return
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
  }, [parallaxOn, mouseX, mouseY])

  // IO for video playback
  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && showVideo) {
        bgVideoRef.current?.play().catch(() => setBgError(true))
        personVideoRef.current?.play().catch(() => setVideoError(true))
      } else {
        bgVideoRef.current?.pause(); personVideoRef.current?.pause()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [showVideo])

  // Pause on tab hidden
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) { bgVideoRef.current?.pause(); personVideoRef.current?.pause() }
      else if (showVideo) { bgVideoRef.current?.play().catch(()=>{}); personVideoRef.current?.play().catch(()=>{}) }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [showVideo])

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-[#0C0C0C]" onMouseMove={handleMouseMove}>
      {/* Background layer */}
      <div className="absolute inset-0 z-0" style={{ opacity: sectionOpacity }}>
        {showVideo && !bgError ? (
          <video ref={bgVideoRef} src="/media/portfolio-v2/hero/hero-background.mp4"
            className="absolute inset-0 h-full w-full object-cover opacity-30" muted loop playsInline preload="metadata"
            onError={() => setBgError(true)} aria-hidden="true" />
        ) : (
          <div className="absolute inset-0 bg-[#0C0C0C]" aria-hidden="true" />
        )}
        {/* Fine grid */}
        <div className="absolute inset-0 opacity-[0.008]" aria-hidden="true"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      </div>

      {/* DESKTOP: Editorial split */}
      <motion.div className="hidden lg:flex h-full relative z-10" style={{ opacity: sectionOpacity }}>
        {/* LEFT: Text zone ~42% */}
        <div className="w-[42%] flex flex-col justify-center px-12 xl:px-16">
          <motion.div style={{ y: textY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-8" style={{ color: 'rgba(200,192,184,0.3)' }}>
              Digital Content &amp; Creative Projects
            </p>
            <h1 className="text-[clamp(3rem,5.5vw,6.5rem)] font-black uppercase tracking-tight leading-[0.9] mb-6" style={{ color: '#C8C0B8' }}>
              PAN<br />YIBING
            </h1>
            <div className="mb-5">
              <p className="text-2xl font-bold tracking-wide" style={{ color: 'rgba(200,192,184,0.85)' }}>潘奕冰</p>
              <p className="text-[13px] mt-1.5 tracking-[0.08em]" style={{ color: 'rgba(200,192,184,0.42)' }}>数字内容与创意项目实践者</p>
            </div>
            <p className="text-[13px] leading-relaxed max-w-[340px] mb-8" style={{ color: 'rgba(200,192,184,0.28)' }}>
              用影像、内容与生成式AI，将创意转化为可以被观看、传播和使用的项目。
            </p>
            <div className="flex items-center gap-3">
              <Link to="/#selected-works"
                className="group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 sm:px-6 sm:py-3 text-[12px] sm:text-[13px] font-medium transition-all duration-300"
                style={{ borderColor: 'rgba(200,192,184,0.15)', color: 'rgba(200,192,184,0.8)', backgroundColor: 'rgba(200,192,184,0.04)' }}>
                查看作品
                <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
              </Link>
              <Link to="/#contact"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 sm:px-6 sm:py-3 text-[12px] sm:text-[13px] font-medium transition-all duration-300"
                style={{ borderColor: 'rgba(200,192,184,0.06)', color: 'rgba(200,192,184,0.32)' }}>
                联系我
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-white/[0.04]" aria-hidden="true" />

        {/* RIGHT: Person video ~58% */}
        <motion.div className="flex-1 flex items-end justify-center overflow-hidden relative"
          style={{ x: parallaxOn ? personPX : 0, y: personPY, translateY: personY }}>
          {showVideo && !videoError ? (
            <video ref={personVideoRef} src="/media/portfolio-v2/hero/hero-desktop.mp4"
              poster="/portrait/hero-portrait.png"
              className="h-[90%] w-auto max-w-none object-contain object-bottom"
              muted loop playsInline preload="metadata" onError={() => setVideoError(true)}
              style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.15) 96%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.15) 96%, rgba(0,0,0,0) 100%)' }} />
          ) : (
            <img src="/portrait/hero-portrait.png" alt="潘奕冰"
              className="h-[88%] w-auto max-w-none object-contain object-bottom"
              style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.15) 96%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.15) 96%, rgba(0,0,0,0) 100%)' }} />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-[10%] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0C0C0C 0%, transparent 100%)' }} aria-hidden="true" />
        </motion.div>
      </motion.div>

      {/* MOBILE: stacked */}
      <motion.div className="lg:hidden flex flex-col h-full relative z-10" style={{ opacity: sectionOpacity }}>
        <div className="flex-1 flex items-end justify-center overflow-hidden">
          {showVideo && !videoError ? (
            <video ref={personVideoRef} src="/media/portfolio-v2/hero/hero-mobile.mp4"
              poster="/portrait/hero-portrait.png"
              className="h-[85%] w-auto max-w-none object-contain object-bottom"
              muted loop playsInline preload="metadata" onError={() => setVideoError(true)}
              style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 6%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 96%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 6%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.2) 96%, rgba(0,0,0,0) 100%)' }} />
          ) : (
            <img src="/portrait/hero-portrait.png" alt="潘奕冰"
              className="h-[82%] w-auto max-w-none object-contain object-bottom" />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0C0C0C 0%, transparent 100%)' }} aria-hidden="true" />
        </div>
        {/* Text below person */}
        <div className="px-6 pb-8 pt-2 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'rgba(200,192,184,0.9)' }}>潘奕冰</h2>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.35)' }}>数字内容与创意项目实践者</p>
          <div className="flex gap-3 pt-3">
            <Link to="/#selected-works"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12px] font-medium"
              style={{ borderColor: 'rgba(200,192,184,0.15)', color: 'rgba(200,192,184,0.8)' }}>查看作品</Link>
            <Link to="/#contact"
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[12px] font-medium"
              style={{ borderColor: 'rgba(200,192,184,0.06)', color: 'rgba(200,192,184,0.32)' }}>联系我</Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
