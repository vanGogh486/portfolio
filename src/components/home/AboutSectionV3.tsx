import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { PROFILE, EDUCATION } from '@/data/profile'

const stats = [
  { value: '18万+', label: '全平台曝光', key: 'exposure' },
  { value: '50+', label: '原创视频', key: 'videos' },
  { value: '04', label: '自媒体账号', key: 'accounts' },
  { value: '03', label: '企业宣传短片', key: 'films' },
]

const capabilities = [
  { id: '01', name: '内容策划', key: 'content' },
  { id: '02', name: '影视制作', key: 'film' },
  { id: '03', name: 'AIGC创作', key: 'aigc' },
  { id: '04', name: '项目执行', key: 'execution' },
  { id: '05', name: '运营分析', key: 'ops' },
  { id: '06', name: '互动设计', key: 'interaction' },
]

const capMap: Record<string, string> = {
  content: 'SCRIPT', film: 'TIMELINE', aigc: 'PROMPT',
  execution: 'WORKFLOW', ops: 'ANALYTICS', interaction: 'UX-PATH',
}

export default function AboutSectionV3() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const bgRef = useRef<HTMLVideoElement | null>(null)
  const filmRef = useRef<HTMLVideoElement | null>(null)
  const lensRef = useRef<HTMLVideoElement | null>(null)
  const glassRef = useRef<HTMLVideoElement | null>(null)
  const [lensHovered, setLensHovered] = useState(false)
  const [activeCapKey, setActiveCapKey] = useState<string | null>(null)
  const [activeDataKey, setActiveDataKey] = useState<string | null>(null)
  const [bgError, setBgError] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize); return () => window.removeEventListener('resize', onResize)
  }, [])

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const showVideo = !isReducedMotion
  const parallaxOn = !isTouchDevice && !isReducedMotion

  // IO videos
  useEffect(() => {
    if (!showVideo || !sectionRef.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        bgRef.current?.play().catch(() => setBgError(true))
        filmRef.current?.play().catch(() => {})
        lensRef.current?.play().catch(() => {})
        glassRef.current?.play().catch(() => {})
      } else {
        bgRef.current?.pause(); filmRef.current?.pause(); lensRef.current?.pause(); glassRef.current?.pause()
      }
    }, { threshold: 0.15 })
    obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [showVideo])

  // Scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const filmShiftX = useTransform(scrollYProgress, [0, 1], [-40, 20])

  // Lens magnet
  const lensX = useMotionValue(0); const lensY = useMotionValue(0)
  const lensSpringX = useSpring(lensX, { stiffness: 50, damping: 30 })
  const lensSpringY = useSpring(lensY, { stiffness: 50, damping: 30 })

  const handleLensMove = useCallback((e: React.MouseEvent) => {
    if (!parallaxOn) return
    const r = e.currentTarget.getBoundingClientRect()
    lensX.set(((e.clientX - r.left - r.width / 2) / r.width) * 6)
    lensY.set(((e.clientY - r.top - r.height / 2) / r.height) * 6)
  }, [parallaxOn, lensX, lensY])
  const handleLensLeave = useCallback(() => { lensX.set(0); lensY.set(0); setLensHovered(false) }, [lensX, lensY])

  // Film guide line direction
  const filmGuideX = useTransform(scrollYProgress, [0, 0.5, 1], [200, 40, -40])

  return (
    <section ref={sectionRef} id="about-section" className="relative px-6 sm:px-10 lg:px-14 py-24 sm:py-32 overflow-hidden" style={{ backgroundColor: '#0C0C0C' }}>
      {/* L0: Studio bg */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ y: bgY }} aria-hidden="true">
        {showVideo && !bgError ? (
          <video ref={bgRef} src="/media/portfolio-v2/hero/hero-background.mp4"
            className="w-full h-full object-cover opacity-[0.12] blur-[2px]" muted loop playsInline preload="metadata" />
        ) : <div className="absolute inset-0 bg-[#0C0C0C]" />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/60 via-transparent to-[#0C0C0C]/80" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div className="mb-16 lg:mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(200,192,184,0.22)' }}>02 / About</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>关于我</h2>
        </motion.div>

        {/* DESKTOP */}
        <div className="hidden lg:block">
          {/* BG ABOUT text */}
          <div className="absolute left-0 top-[15%] pointer-events-none select-none" aria-hidden="true">
            <p className="font-black uppercase tracking-tight leading-none whitespace-nowrap"
              style={{ fontSize: 'clamp(8rem, 16vw, 20rem)', color: 'rgba(200,192,184,0.035)' }}>ABOUT</p>
          </div>

          {/* Main grid */}
          <div className="relative grid grid-cols-[auto_1fr_auto] gap-12 xl:gap-16 items-start">
            {/* LEFT: Portrait — with reading zone glow behind */}
            <div className="relative">
              {/* Warm reading glow */}
              <div className="absolute -inset-8 rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(200,192,184,0.03) 0%, transparent 60%)' }} />
              <motion.div className="relative" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <img src="/media/portfolio-v2/about/portrait.png" alt="潘奕冰"
                  className="w-auto object-contain object-bottom select-none"
                  style={{
                    height: 'clamp(420px, 55vh, 580px)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 4%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.08) 95%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.03) 4%, rgba(0,0,0,1) 14%, rgba(0,0,0,1) 85%, rgba(0,0,0,0.08) 95%, rgba(0,0,0,0) 100%)',
                  }} draggable={false} />
              </motion.div>
            </div>

            {/* CENTER: Info — BOOSTED contrast */}
            <div className="space-y-10 pt-4">
              <motion.div className="space-y-3 max-w-[460px]" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                {PROFILE.intro.map((p, i) => (
                  <p key={i} className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.62)', lineHeight: '1.75' }}>
                    {p}
                  </p>
                ))}
              </motion.div>

              {/* Stats — boosted */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-[380px]">
                {stats.map(s => (
                  <motion.div key={s.key} className="group cursor-default"
                    onMouseEnter={() => setActiveDataKey(s.key)} onMouseLeave={() => setActiveDataKey(null)}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                    <span className="text-3xl sm:text-4xl font-bold tabular-nums transition-colors duration-300"
                      style={{ color: activeDataKey === s.key ? '#B8936E' : 'rgba(200,192,184,0.85)' }}>{s.value}</span>
                    <p className="text-[11px] mt-1 transition-colors duration-300"
                      style={{ color: activeDataKey === s.key ? 'rgba(200,192,184,0.45)' : 'rgba(200,192,184,0.4)' }}>{s.label}</p>
                    <div className="h-px mt-2 transition-all duration-400"
                      style={{ width: activeDataKey === s.key ? '100%' : '40px', backgroundColor: activeDataKey === s.key ? 'rgba(184,147,110,0.3)' : 'rgba(200,192,184,0.1)' }} />
                  </motion.div>
                ))}
              </div>

              {/* Capabilities — boosted + triggers lens */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-[380px]">
                {capabilities.map((c, i) => (
                  <motion.p key={c.key} className="group flex items-center gap-3 text-[13px] cursor-default"
                    style={{ color: 'rgba(200,192,184,0.6)' }}
                    onMouseEnter={() => setActiveCapKey(c.key)} onMouseLeave={() => setActiveCapKey(null)}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <span className="text-[10px] font-bold tracking-[0.1em] transition-colors duration-300 w-5"
                      style={{ color: activeCapKey === c.key ? '#B8936E' : 'rgba(200,192,184,0.22)' }}>{c.id}</span>
                    {c.name}
                    <span className="h-px flex-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      style={{ backgroundColor: 'rgba(184,147,110,0.2)' }} />
                  </motion.p>
                ))}
              </div>
            </div>

            {/* RIGHT: Lens — SMALLER (340px) + clean */}
            <div className="relative flex-shrink-0">
              {/* Glass ring behind lens — smaller, lower opacity */}
              {showVideo && (
                <div className="absolute -inset-[10%] pointer-events-none z-[2] opacity-[0.06]" aria-hidden="true">
                  <video ref={glassRef} src="/media/portfolio-v2/decorations/glass-loop.mp4"
                    className="w-full h-full object-contain" muted loop playsInline preload="metadata" />
                </div>
              )}

              {/* Lens container — 340px, NO video controls */}
              <motion.div
                className="relative z-10 overflow-hidden rounded-full"
                style={{
                  width: 340, height: 340,
                  x: lensSpringX, y: lensSpringY,
                  borderColor: lensHovered ? 'rgba(200,192,184,0.14)' : 'rgba(200,192,184,0.06)',
                  borderWidth: 1,
                }}
                animate={{ scale: lensHovered ? 1.04 : 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                onMouseMove={handleLensMove}
                onMouseEnter={() => setLensHovered(true)}
                onMouseLeave={handleLensLeave}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                {/* Lens video — scaled up 1.35x, centered, NO controls, pointer-events-none */}
                {showVideo && (
                  <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                    <video ref={lensRef} src="/media/portfolio-v2/decorations/lens-loading.mp4"
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ width: '135%', height: '135%', objectFit: 'cover', opacity: lensHovered ? 1 : 0.65, transition: 'opacity 500ms' }}
                      muted loop playsInline preload="metadata"
                      disablePictureInPicture
                      tabIndex={-1}
                      aria-hidden="true" />
                  </div>
                )}

                {/* CSS ring markings on outer edge */}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0 0 0 8px rgba(12,12,12,0.7)' }} />

                {/* Center — clean */}
                <div className="absolute inset-[22%] rounded-full flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: 'rgba(12,12,12,0.88)' }}>
                  <div className="absolute inset-0 rounded-full transition-opacity duration-500"
                    style={{ opacity: activeCapKey ? 0 : 1, background: 'radial-gradient(ellipse at center, rgba(200,192,184,0.07) 0%, transparent 60%)' }} />
                  {activeCapKey ? (
                    <motion.div className="relative z-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                      <p className="text-[12px] font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.5)' }}>
                        {capMap[activeCapKey]}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="relative z-10 text-center">
                      <p className="text-[9px] font-medium tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(200,192,184,0.45)' }}>FOCUS ON</p>
                      <p className="text-[8px] tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.22)' }}>STORY · IMAGE · EXPERIENCE</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Guide line + MOVE TO FOCUS hint — visible on capability hover */}
              {activeCapKey && (
                <motion.div className="absolute bottom-1/2 right-full h-px pointer-events-none z-[3]"
                  style={{ width: 60, backgroundColor: 'rgba(184,147,110,0.25)' }}
                  initial={{ width: 0 }} animate={{ width: 60 }} transition={{ duration: 0.4 }} />
              )}
              {/* MOVE TO FOCUS hint */}
              <motion.div className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none"
                initial={{ opacity: 0 }} animate={{ opacity: lensHovered ? 1 : 0.5 }} transition={{ duration: 0.4 }}>
                <p className="text-[8px] tracking-[0.15em] uppercase text-center" style={{ color: 'rgba(200,192,184,0.15)' }}>MOVE TO FOCUS</p>
              </motion.div>
            </div>
          </div>

          {/* Film connector — CSS film strip, no black background */}
          <motion.div className="relative mt-6 pointer-events-none mx-auto" style={{ width: 'min(600px, 80%)', height: 80, x: filmShiftX }} aria-hidden="true">
            {/* CSS film perforations */}
            <div className="flex justify-between px-2" style={{ height: 18 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(200,192,184,0.06)' }} />
              ))}
            </div>
            {/* Film strip body */}
            <div className="flex-1 rounded-sm" style={{ height: 40, backgroundColor: 'rgba(200,192,184,0.025)', borderTop: '1px solid rgba(200,192,184,0.04)', borderBottom: '1px solid rgba(200,192,184,0.04)' }}>
              {/* Subtle video texture overlay if available */}
              {showVideo && (
                <video ref={filmRef} src="/media/portfolio-v2/decorations/film-loop.mp4"
                  className="w-full h-full object-cover opacity-[0.08]" muted loop playsInline preload="metadata" />
              )}
            </div>
            {/* Bottom perforations */}
            <div className="flex justify-between px-2" style={{ height: 18 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(200,192,184,0.06)' }} />
              ))}
            </div>
          </motion.div>

          {/* Education strip — boosted */}
          <motion.div className="mt-8 pt-8 flex items-center gap-8 flex-wrap"
            style={{ borderTop: '1px solid rgba(200,192,184,0.06)' }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.18)' }}>EDUCATION</span>
            <span className="text-sm font-semibold" style={{ color: 'rgba(200,192,184,0.6)' }}>{EDUCATION.school}</span>
            <span className="text-[12px]" style={{ color: 'rgba(200,192,184,0.3)' }}>{EDUCATION.major} · {EDUCATION.degree}</span>
            <span className="text-[11px]" style={{ color: 'rgba(200,192,184,0.18)' }}>{EDUCATION.period}</span>
          </motion.div>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden space-y-12">
          <motion.div className="flex justify-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <img src="/media/portfolio-v2/about/portrait.png" alt="潘奕冰"
              className="w-auto object-contain object-bottom"
              style={{
                height: 'clamp(300px, 55vh, 450px)',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.1) 94%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 5%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 78%, rgba(0,0,0,0.1) 94%, rgba(0,0,0,0) 100%)',
              }} />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map(s => <div key={s.key}><span className="text-2xl font-bold" style={{ color: 'rgba(200,192,184,0.85)' }}>{s.value}</span><p className="text-[11px] mt-0.5" style={{ color: 'rgba(200,192,184,0.4)' }}>{s.label}</p></div>)}
          </div>
          <div className="flex flex-wrap gap-3">
            {capabilities.map(c => <span key={c.key} className="text-[12px] px-3 py-1.5 rounded-full border" style={{ borderColor: 'rgba(200,192,184,0.1)', color: 'rgba(200,192,184,0.45)' }}>{c.name}</span>)}
          </div>
          <div className="space-y-2">
            {PROFILE.intro.map((p, i) => <p key={i} className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.55)' }}>{p}</p>)}
          </div>
          <div className="flex justify-center">
            <div className="relative overflow-hidden rounded-full" style={{ width: 260, height: 260, borderColor: 'rgba(200,192,184,0.06)', borderWidth: 1 }}>
              {showVideo && (
                <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                  <video ref={lensRef} src="/media/portfolio-v2/decorations/lens-loading.mp4"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-65"
                    style={{ width: '135%', height: '135%', objectFit: 'cover' }}
                    muted loop playsInline preload="metadata" disablePictureInPicture tabIndex={-1} aria-hidden="true" />
                </div>
              )}
              <div className="absolute inset-[22%] rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(12,12,12,0.88)' }}>
                <p className="text-[9px] font-medium tracking-[0.15em]" style={{ color: 'rgba(200,192,184,0.4)' }}>FOCUS ON</p>
              </div>
            </div>
          </div>
          <div className="pt-6 space-y-1" style={{ borderTop: '1px solid rgba(200,192,184,0.05)' }}>
            <p className="text-[9px] tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.18)' }}>EDUCATION</p>
            <p className="text-sm font-semibold" style={{ color: 'rgba(200,192,184,0.6)' }}>{EDUCATION.school}</p>
            <p className="text-[11px]" style={{ color: 'rgba(200,192,184,0.3)' }}>{EDUCATION.major} · {EDUCATION.degree}</p>
            <p className="text-[10px]" style={{ color: 'rgba(200,192,184,0.18)' }}>{EDUCATION.period}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
