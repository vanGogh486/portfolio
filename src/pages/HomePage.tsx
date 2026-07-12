import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { publicAsset } from '@/lib/publicAsset'
import SEOHead from '@/components/shared/SEOHead'
import AboutSectionV3 from '@/components/home/AboutSectionV3'
import WorksSectionV1 from '@/components/home/WorksSectionV1'
import ExperienceSectionSimple from '@/components/home/ExperienceSectionSimple'
import ToolstackSection from '@/components/home/ToolstackSection'
import { projects } from '@/data/projects'
import { publicAsset } from '@/lib/publicAsset'

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement>(null!)
  const bgVideoRef = useRef<HTMLVideoElement>(null!)
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

  useEffect(() => {
    const el = sectionRef.current; if (!el || !showVideo) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) bgVideoRef.current?.play().catch(() => setBgVideoError(true))
      else bgVideoRef.current?.pause()
    }, { threshold: 0.3 })
    obs.observe(el); return () => obs.disconnect()
  }, [showVideo])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.55, 0])
  const personScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])
  const personY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const bgDarken = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.15, 0.35])

  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0)
  const personPX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 35, damping: 28 })
  const personPY = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), { stiffness: 35, damping: 28 })
  const bgPX = useSpring(useTransform(mouseX, [-1, 1], [2.5, -2.5]), { stiffness: 30, damping: 32 })
  const decoPX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 25, damping: 34 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!parallaxOn) return; mouseX.set((e.clientX / window.innerWidth) * 2 - 1); mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
  }, [parallaxOn, mouseX, mouseY])

  const [copied, setCopied] = useState(false)
  const copyEmail = useCallback(async () => {
    try { await navigator.clipboard.writeText('819859568@qq.com'); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { const input = document.createElement('input'); input.value = '819859568@qq.com'; document.body.appendChild(input); input.select(); document.execCommand('copy'); document.body.removeChild(input); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  }, [])

  return (
    <>
      <SEOHead title="Home" ogType="website" />

      {/* ===== HERO ===== */}
      <section ref={sectionRef} className="relative min-h-screen flex items-end bg-[#0C0C0C]" onMouseMove={onMouseMove}>
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {showVideo && !bgVideoError ? (
            <video ref={bgVideoRef} src={publicAsset("/media/portfolio-v2/hero/hero-background.mp4")} className="w-full h-full object-cover opacity-[0.22]" muted loop playsInline preload="metadata" />
          ) : (<div className="absolute inset-0 bg-[#0C0C0C]" />)}
        </div>
        <motion.div className="absolute inset-0 z-[1] pointer-events-none" style={{ backgroundColor: '#0C0C0C', opacity: bgDarken }} />

        <div className="relative z-10 w-full h-full flex flex-col lg:flex-row items-end lg:items-end justify-between mx-auto max-w-7xl px-8 sm:px-12">
          <motion.div className="relative z-20 flex flex-col justify-end pb-12 lg:pb-16 w-full lg:w-[44%]" style={{ opacity: heroOpacity }}>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-6" style={{ color: 'rgba(200,192,184,0.28)' }}>Digital Content &amp; Creative Projects</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-3" style={{ color: '#C8C0B8' }}>潘奕冰</h1>
            <p className="text-sm sm:text-base font-medium tracking-[0.06em] mb-4" style={{ color: 'rgba(200,192,184,0.55)' }}>数字内容与创意项目实践者</p>
            <p className="text-[13px] sm:text-[14px] leading-relaxed max-w-[420px] mb-8" style={{ color: 'rgba(200,192,184,0.45)', lineHeight: '1.7' }}>用影像、内容与生成式AI，将创意转化为可以被观看、传播和使用的项目。</p>
            <div className="flex items-center gap-4">
              <a href="#works-section" className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-medium transition-all duration-300" style={{ borderColor: 'rgba(200,192,184,0.2)', color: 'rgba(200,192,184,0.85)', backgroundColor: 'rgba(200,192,184,0.05)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(184,147,110,0.45)'; e.currentTarget.style.color = '#B8936E' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(200,192,184,0.2)'; e.currentTarget.style.color = 'rgba(200,192,184,0.85)' }}>
                查看作品<svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
              </a>
              <a href="#about-section" className="group text-[13px] font-medium transition-all duration-300" style={{ color: 'rgba(200,192,184,0.45)', borderBottom: '1px solid rgba(200,192,184,0.12)', paddingBottom: '2px' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.7)'; e.currentTarget.style.borderBottomColor = 'rgba(200,192,184,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.45)'; e.currentTarget.style.borderBottomColor = 'rgba(200,192,184,0.12)' }}>关于我</a>
            </div>
          </motion.div>

          <motion.div className="absolute lg:relative inset-0 lg:inset-auto flex items-end justify-center lg:justify-end z-[8] pointer-events-none lg:pointer-events-auto lg:w-[56%]"
            style={{ x: parallaxOn ? personPX : 0, y: parallaxOn ? personPY : 0, scale: personScale, translateY: personY, opacity: heroOpacity }}>
            <div className="absolute inset-0 flex items-end lg:items-center justify-center lg:justify-end pointer-events-none overflow-visible z-0" aria-hidden="true" style={{ x: parallaxOn ? bgPX : 0 }}>
              <p className="font-black uppercase tracking-tight leading-[0.85] text-center lg:text-right" style={{ fontSize: 'clamp(4rem, 14vw, 16rem)', color: 'rgba(200,192,184,0.06)' }}>PAN<br className="lg:hidden"/> YIBING</p>
            </div>
            <div className="relative z-10 flex items-end justify-center h-full w-full lg:w-auto" style={{ pointerEvents: 'auto' }}>
              <img src={publicAsset("/portrait/hero-portrait.png")} alt="" className="w-auto max-w-none object-contain object-bottom select-none" style={{ height: isMobile ? 'clamp(55vh, 65vh, 75vh)' : 'clamp(70vh, 88vh, 92vh)', maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 8%, rgba(0,0,0,1) 22%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.1) 96%, rgba(0,0,0,0) 100%)' }} draggable={false} />
              <div className="absolute bottom-0 left-0 right-0 h-[6%] pointer-events-none" style={{ background: 'linear-gradient(to top, #0C0C0C, transparent)' }} />
            </div>
            {parallaxOn && (
              <motion.div className="absolute z-[6] pointer-events-none" style={{ x: decoPX, bottom: '15%', right: '22%' }} aria-hidden="true">
                <div className="w-[clamp(80px,8vw,110px)] h-[clamp(80px,8vw,110px)] rounded-full border opacity-[0.04]" style={{ borderColor: 'rgba(200,192,184,0.4)' }} />
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div className="absolute bottom-0 right-0 z-20 pr-6 sm:pr-10 pb-6 sm:pb-8" style={{ opacity: heroOpacity }}>
          <motion.div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer overflow-hidden" style={{ backgroundColor: 'rgba(18,18,18,0.85)', borderColor: 'rgba(200,192,184,0.1)', borderWidth: 1, borderStyle: 'solid', backdropFilter: 'blur(8px)' }}
            onMouseEnter={() => setFilmDrawerOpen(true)} onMouseLeave={() => setFilmDrawerOpen(false)}
            animate={{ width: filmDrawerOpen ? 'min(560px, 66vw)' : 280 }} transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}>
            {showVideo && (<div className="absolute left-0 inset-y-0 w-1.5 opacity-[0.12]" aria-hidden="true"><video src={publicAsset("/media/portfolio-v2/decorations/film-loop.mp4")} className="h-full w-full object-cover" muted loop playsInline preload="metadata" ref={(el) => { if (el) el.play().catch(() => {}) }} /></div>)}
            <div className="flex-shrink-0 pl-2"><p className="text-[10px] font-medium tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>01 / Selected Works</p><p className="text-[11px] font-semibold tracking-[0.08em] mt-0.5" style={{ color: 'rgba(200,192,184,0.5)' }}>EXPLORE</p></div>
            {filmDrawerOpen && (
              <motion.div className="flex gap-2 ml-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.1 }}>
                {projects.map((p) => (<div key={p.slug} className="flex-shrink-0 rounded-lg overflow-hidden border" style={{ width: 90, height: 56, borderColor: 'rgba(200,192,184,0.12)' }}><img src={publicAsset(p.cover)} alt={p.title} className="w-full h-full object-cover" loading="lazy" /></div>))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== ABOUT ===== */}
      <AboutSectionV3 />

      {/* ===== TRANSITION ===== */}
      <div className="relative h-[12vh] overflow-hidden pointer-events-none bg-[#0C0C0C]" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(12,12,12,0.6) 0%, #0C0C0C 100%)' }} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i % 3 === 0 ? 'rgba(200,192,184,0.05)' : 'rgba(200,192,184,0.02)' }} />
          ))}
        </div>
      </div>

      {/* ===== SELECTED WORKS ===== */}
      <WorksSectionV1 />

      {/* ===== EXPERIENCE ===== */}
      <ExperienceSectionSimple />

      {/* ===== TOOLSTACK ===== */}
      <ToolstackSection />

      {/* ===== CONTACT ===== */}
      <section id="contact-section" className="px-6 sm:px-10 lg:px-14 py-20 sm:py-28 bg-[#0C0C0C]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(200,192,184,0.18)' }}>05 / Contact</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6" style={{ color: '#C8C0B8' }}>联系方式</h2>
          <p className="text-[14px] leading-relaxed mb-10" style={{ color: 'rgba(200,192,184,0.4)' }}>对作品感兴趣或有合作想法？欢迎通过以下方式联系。</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-3 rounded-xl border px-5 py-3.5" style={{ borderColor: 'rgba(200,192,184,0.08)', backgroundColor: 'rgba(200,192,184,0.02)' }}>
              <span className="text-[14px] font-medium" style={{ color: 'rgba(200,192,184,0.6)' }}>819859568@qq.com</span>
              <button type="button" onClick={copyEmail} className="rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95" style={{ borderColor: 'rgba(200,192,184,0.1)', color: 'rgba(200,192,184,0.4)' }}>{copied ? '已复制' : '复制'}</button>
            </div>
            <a href="mailto:819859568@qq.com" className="rounded-xl border px-6 py-3.5 text-[13px] font-medium transition-all" style={{ borderColor: 'rgba(200,192,184,0.06)', color: 'rgba(200,192,184,0.5)', backgroundColor: 'rgba(200,192,184,0.02)' }}>发送邮件</a>
          </div>
          <p className="text-[16px] font-medium mb-1" style={{ color: 'rgba(200,192,184,0.6)' }}>杭州</p>
          <p className="text-[11px]" style={{ color: 'rgba(200,192,184,0.2)' }}>&copy; {new Date().getFullYear()} 潘奕冰</p>
        </div>
      </section>
    </>
  )
}
