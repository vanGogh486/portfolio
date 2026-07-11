import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { projects } from '@/data/projects'
import AboutSectionV3 from '@/components/home/AboutSectionV3'
import WorksSectionV1 from '@/components/home/WorksSectionV1'
import ExperienceSectionSimple from '@/components/home/ExperienceSectionSimple'

export default function VisualLabV2() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const bgVideoRef = useRef<HTMLVideoElement | null>(null)
  const [bgVideoError, setBgVideoError] = useState(false)
  const [filmDrawerOpen, setFilmDrawerOpen] = useState(false)

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize)
  }, [])

  const parallaxOn = !isTouchDevice && !isReducedMotion && !isMobile
  const showVideo = !isReducedMotion

  // IO for bg video
  useEffect(() => {
    const el = sectionRef.current; if (!el || !showVideo) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) bgVideoRef.current?.play().catch(() => setBgVideoError(true))
      else bgVideoRef.current?.pause()
    }, { threshold: 0.3 })
    obs.observe(el); return () => obs.disconnect()
  }, [showVideo])

  // Scroll — hero to about transition
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.55, 0])
  const personScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])
  const personY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const personX = useTransform(scrollYProgress, [0, 1], [0, -18])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 20])
  const bgTextOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.065, 0.04, 0])
  const bgDarken = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.15, 0.35])

  // Mouse parallax
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0)
  const personPX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 35, damping: 28 })
  const personPY = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), { stiffness: 35, damping: 28 })
  const bgPX = useSpring(useTransform(mouseX, [-1, 1], [2.5, -2.5]), { stiffness: 30, damping: 32 })
  const decoPX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 25, damping: 34 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!parallaxOn) return
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
  }, [parallaxOn, mouseX, mouseY])

  return (
    <div className="bg-[#0C0C0C]">
      {/* HERO */}
      <section ref={sectionRef} className="relative min-h-screen flex items-end" onMouseMove={onMouseMove}>
        {/* Background video */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {showVideo && !bgVideoError ? (
            <video ref={bgVideoRef} src="/media/portfolio-v2/hero/hero-background.mp4"
              className="w-full h-full object-cover opacity-[0.22]" muted loop playsInline preload="metadata" />
          ) : (
            <div className="absolute inset-0 bg-[#0C0C0C]" />
          )}
        </div>
        {/* Darken on scroll */}
        <motion.div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundColor: '#0C0C0C', opacity: bgDarken }} />

        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-end lg:items-end justify-between mx-auto max-w-7xl px-8 sm:px-12">
          {/* LEFT: Text zone */}
          <motion.div className="relative z-20 flex flex-col justify-end pb-12 lg:pb-16 w-full lg:w-[44%]"
            style={{ y: textY, opacity: heroOpacity }}>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: 'rgba(200,192,184,0.28)' }}>
              Digital Content &amp; Creative Projects
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-3" style={{ color: '#C8C0B8' }}>
              潘奕冰
            </h1>
            <p className="text-sm sm:text-base font-medium tracking-[0.06em] mb-4" style={{ color: 'rgba(200,192,184,0.55)' }}>
              数字内容与创意项目实践者
            </p>
            <p className="text-[13px] sm:text-[14px] leading-relaxed max-w-[420px] mb-8" style={{ color: 'rgba(200,192,184,0.45)', lineHeight: '1.7' }}>
              用影像、内容与生成式AI，将创意转化为可以被观看、传播和使用的项目。
            </p>
            <div className="flex items-center gap-4">
              <motion.a href="#film-strip"
                className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-medium transition-all duration-300"
                style={{ borderColor: 'rgba(200,192,184,0.2)', color: 'rgba(200,192,184,0.85)', backgroundColor: 'rgba(200,192,184,0.05)' }}
                whileHover={{ scale: 1.02 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184,147,110,0.45)'; e.currentTarget.style.color = '#B8936E' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,192,184,0.2)'; e.currentTarget.style.color = 'rgba(200,192,184,0.85)' }}>
                查看作品
                <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
              </motion.a>
              <a href="#"
                className="group text-[13px] font-medium transition-all duration-300"
                style={{ color: 'rgba(200,192,184,0.45)', borderBottom: '1px solid rgba(200,192,184,0.12)', paddingBottom: '2px' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.7)'; e.currentTarget.style.borderBottomColor = 'rgba(200,192,184,0.3)'; e.currentTarget.style.borderBottomWidth = '2px' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.45)'; e.currentTarget.style.borderBottomColor = 'rgba(200,192,184,0.12)'; e.currentTarget.style.borderBottomWidth = '1px' }}>
                关于我
              </a>
            </div>
          </motion.div>

          {/* RIGHT/CENTER: Portrait zone */}
          <motion.div className="absolute lg:relative inset-0 lg:inset-auto flex items-end justify-center lg:justify-end z-[8] pointer-events-none lg:pointer-events-auto lg:w-[56%]"
            style={{
              x: parallaxOn ? personPX : 0, y: parallaxOn ? personPY : 0,
              scale: personScale, translateX: personX, translateY: personY, opacity: heroOpacity,
            }}>
            {/* PAN YIBING — readable, 2 lines, behind portrait */}
            <div className="absolute inset-0 flex items-end lg:items-center justify-center lg:justify-end pointer-events-none overflow-visible z-0" aria-hidden="true"
              style={{ x: parallaxOn ? bgPX : 0 }}>
              <p className="font-black uppercase tracking-tight leading-[0.85] whitespace-nowrap select-none text-center lg:text-right"
                style={{
                  fontSize: 'clamp(4rem, 14vw, 16rem)',
                  color: 'rgba(200,192,184,0.06)',
                  opacity: bgTextOpacity,
                }}>
                PAN<br className="lg:hidden" /> YIBING
              </p>
            </div>

            {/* Portrait */}
            <div className="relative z-10 flex items-end justify-center h-full w-full lg:w-auto" style={{ pointerEvents: 'auto' }}>
              <img src="/portrait/hero-portrait.png" alt=""
                className="w-auto max-w-none object-contain object-bottom select-none"
                style={{
                  height: isMobile ? 'clamp(55vh, 65vh, 75vh)' : 'clamp(70vh, 88vh, 92vh)',
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0) 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0) 100%)',
                }} draggable={false} />
              <div className="absolute bottom-0 left-0 right-0 h-[6%] pointer-events-none"
                style={{ background: 'linear-gradient(to top, #0C0C0C, transparent)' }} />
            </div>

            {/* Decorative ring — smaller, pushed further out */}
            {parallaxOn && (
              <motion.div className="absolute z-[6] pointer-events-none" style={{ x: decoPX, bottom: '15%', right: '22%' }} aria-hidden="true">
                <div className="w-[clamp(80px,8vw,110px)] h-[clamp(80px,8vw,110px)] rounded-full border opacity-[0.04]" style={{ borderColor: 'rgba(200,192,184,0.4)' }} />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Film Drawer — bottom center-right, bigger */}
        <motion.div className="absolute bottom-0 right-0 z-20 pr-6 sm:pr-10 pb-6 sm:pb-8"
          style={{ opacity: heroOpacity }}>
          <motion.div
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer overflow-hidden"
            style={{
              backgroundColor: 'rgba(18,18,18,0.85)',
              borderColor: 'rgba(200,192,184,0.1)',
              borderWidth: 1,
              borderStyle: 'solid',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={() => setFilmDrawerOpen(true)}
            onMouseLeave={() => setFilmDrawerOpen(false)}
            animate={{ width: filmDrawerOpen ? 'min(560px, 66vw)' : 280 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Film strip edge decoration */}
            {showVideo && (
              <div className="absolute left-0 inset-y-0 w-1.5 opacity-[0.12]" aria-hidden="true">
                <video src="/media/portfolio-v2/decorations/film-loop.mp4"
                  className="h-full w-full object-cover" muted loop playsInline preload="metadata"
                  ref={(el) => { if (el) el.play().catch(() => {}) }} />
              </div>
            )}

            <div className="flex-shrink-0 pl-2">
              <p className="text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>
                01 / Selected Works
              </p>
              <p className="text-[11px] font-semibold tracking-[0.08em] mt-0.5" style={{ color: 'rgba(200,192,184,0.5)' }}>
                EXPLORE
              </p>
            </div>

            {filmDrawerOpen && (
              <motion.div className="flex gap-2 ml-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1 }}>
                {projects.map((p, i) => (
                  <div key={p.slug} className="flex-shrink-0 rounded-lg overflow-hidden border"
                    style={{ width: 90, height: 56, borderColor: 'rgba(200,192,184,0.12)' }}>
                    <img src={p.cover} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT V3 */}
      <AboutSectionV3 />

      {/* TRANSITION ZONE — About → Works, studio bg fades out */}
      <div className="relative h-[15vh] overflow-hidden pointer-events-none" aria-hidden="true"
        style={{ backgroundColor: '#0C0C0C' }}>
        {/* Studio bg fading to black */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(12,12,12,0.6) 0%, #0C0C0C 100%)' }} />
        {/* Film perforations continuing down */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i % 3 === 0 ? 'rgba(200,192,184,0.05)' : 'rgba(200,192,184,0.02)' }} />
          ))}
        </div>
      </div>

      {/* SELECTED WORKS — V4 Cinematic Contact Sheet */}
      <WorksSectionV1 />

      {/* EXPERIENCE — Simple editorial */}
      <ExperienceSectionSimple />

      {/* Footer */}
      <div className="px-8 pb-12 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(200,192,184,0.1)' }}>Visual Lab V3.2 — Living Editorial Cover · Cinematic Contact Sheet</p>
      </div>
    </div>
  )
}
