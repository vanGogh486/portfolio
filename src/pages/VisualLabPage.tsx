import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import Layout from '@/components/layout/Layout'

export default function VisualLabPage() {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const [cursorVariant, setCursorVariant] = useState<string>('default')
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const cursorSpringX = useSpring(cursorX, { stiffness: 150, damping: 15 })
  const cursorSpringY = useSpring(cursorY, { stiffness: 150, damping: 15 })

  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cursorOn = !isTouchDevice && !isReducedMotion

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cursorOn) return
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }, [cursorOn, cursorX, cursorY])

  // Scroll progress
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const letterSpacing = useTransform(scrollYProgress, [0, 0.5, 1], ['0em', '0.15em', '0.35em'])
  const personScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const personOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.75, 0.3])
  const personX = useTransform(scrollYProgress, [0, 1], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [1, 0.6, 0])
  const nextSectionY = useTransform(scrollYProgress, [0.4, 1], [120, 0])
  const nextSectionOpacity = useTransform(scrollYProgress, [0.4, 0.6, 1], [0, 1, 1])

  // Multilayer parallax from single mouse event
  const mouseX = useMotionValue(0); const mouseY = useMotionValue(0)
  const personPX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 35, damping: 28 })
  const personPY = useSpring(useTransform(mouseY, [-1, 1], [-3, 3]), { stiffness: 35, damping: 28 })
  const textBackPX = useSpring(useTransform(mouseX, [-1, 1], [2, -2]), { stiffness: 30, damping: 32 })
  const textFrontPX = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), { stiffness: 38, damping: 26 })
  const decoPX = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), { stiffness: 25, damping: 34 })
  const decoPY = useSpring(useTransform(mouseY, [-1, 1], [-8, 8]), { stiffness: 25, damping: 34 })

  const parallaxOn = !isTouchDevice && !isReducedMotion && !isMobile

  const onMouseMoveSection = useCallback((e: React.MouseEvent) => {
    handleMouseMove(e)
    if (!parallaxOn) return
    mouseX.set((e.clientX / window.innerWidth) * 2 - 1)
    mouseY.set((e.clientY / window.innerHeight) * 2 - 1)
  }, [parallaxOn, mouseX, mouseY, handleMouseMove])

  return (
    <>
      {/* Custom cursor overlay — only on desktop */}
      {cursorOn && (
        <motion.div
          className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference"
          style={{ x: cursorSpringX, y: cursorSpringY }}
        >
          <motion.div
            className="flex items-center justify-center rounded-full border border-white/70"
            animate={{
              width: cursorVariant === 'button' ? 72 : cursorVariant === 'portrait' ? 88 : 28,
              height: cursorVariant === 'button' ? 72 : cursorVariant === 'portrait' ? 88 : 28,
              marginLeft: cursorVariant === 'button' ? -36 : cursorVariant === 'portrait' ? -44 : -14,
              marginTop: cursorVariant === 'button' ? -36 : cursorVariant === 'portrait' ? -44 : -14,
              backgroundColor: cursorVariant === 'portrait' ? 'rgba(200,192,184,0.04)' : 'transparent',
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {cursorVariant === 'button' && (
              <span className="text-[9px] font-medium tracking-[0.15em] text-white uppercase">Open</span>
            )}
            {cursorVariant === 'portrait' && (
              <div className="w-20 h-20 rounded-full border border-white/[0.08] opacity-50" />
            )}
          </motion.div>
        </motion.div>
      )}

      <div
        className="bg-[#0C0C0C]"
        onMouseMove={onMouseMoveSection}
        style={{ cursor: cursorOn ? 'none' : 'auto' }}
      >
        {/* HERO SECTION — Living Editorial Cover */}
        <section ref={sectionRef} className="relative h-screen overflow-hidden" style={{ cursor: cursorOn ? 'none' : 'auto' }}>
          {/* Background video */}
          <div className="absolute inset-0 z-0 opacity-[0.25]" aria-hidden="true">
            {!isReducedMotion && (
              <video src="/media/portfolio-v2/hero/hero-background.mp4" autoPlay muted loop playsInline
                className="w-full h-full object-cover" />
            )}
          </div>

          {/* Layer 0: PAN YIBING — back layer (behind portrait) */}
          <motion.div className="absolute inset-0 flex items-center justify-center z-[3] pointer-events-none overflow-hidden" aria-hidden="true"
            style={{ x: parallaxOn ? textBackPX : 0, opacity: heroOpacity }}>
            <motion.p className="font-black uppercase tracking-tight whitespace-nowrap leading-none select-none"
              style={{
                fontSize: 'clamp(6rem, 20vw, 22rem)',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(200,192,184,0.07)',
                letterSpacing,
              }}>
              PAN YIBING
            </motion.p>
          </motion.div>

          {/* Layer 1: Portrait — center-right with mask blending */}
          <motion.div className="absolute inset-0 flex items-end justify-center z-10 pointer-events-none"
            style={{
              x: parallaxOn ? personPX : 0, y: parallaxOn ? personPY : 0,
              scale: personScale, translateX: personX, opacity: personOpacity,
            }}>
            <motion.div className="relative"
              onMouseEnter={() => setCursorVariant('portrait')}
              onMouseLeave={() => setCursorVariant('default')}
              style={{ pointerEvents: 'auto' }}>
              <img
                src={isMobile ? '/portrait/hero-portrait.png' : '/portrait/hero-portrait.png'}
                alt=""
                className="h-[80vh] sm:h-[88vh] w-auto max-w-none object-contain object-bottom select-none"
                style={{
                  maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.05) 97%)',
                  WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, rgba(0,0,0,0.05) 97%)',
                }}
                draggable={false} />
              <div className="absolute bottom-0 left-0 right-0 h-[8%] pointer-events-none"
                style={{ background: 'linear-gradient(to top, #0C0C0C, transparent)' }} />
            </motion.div>
          </motion.div>

          {/* Layer 2: PAN YIBING — front layer (partial letters over portrait) */}
          <motion.div className="absolute inset-0 flex items-center justify-center z-[15] pointer-events-none overflow-hidden" aria-hidden="true"
            style={{ x: parallaxOn ? textFrontPX : 0, opacity: heroOpacity }}>
            <p className="font-black uppercase tracking-tight whitespace-nowrap leading-none select-none"
              style={{
                fontSize: 'clamp(6rem, 20vw, 22rem)',
                color: 'rgba(200,192,184,0.06)',
                letterSpacing,
                clipPath: 'inset(45% 0 0 0)',
              }}>
              PAN YIBING
            </p>
          </motion.div>

          {/* Decorative elements */}
          {parallaxOn && (
            <motion.div className="absolute top-[18%] right-[12%] z-[12] pointer-events-none" aria-hidden="true"
              style={{ x: decoPX, y: decoPY }}>
              <div className="w-32 h-32 rounded-full border border-white/[0.03]" />
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full border border-white/[0.04]" />
            </motion.div>
          )}

          {/* Layer 3: Bottom-left info */}
          <motion.div className="absolute bottom-0 left-0 right-0 z-20 px-8 sm:px-12 pb-10 sm:pb-12"
            style={{ opacity: heroOpacity }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-3">
                <p className="text-[10px] font-medium tracking-[0.25em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>
                  01 / Digital Content &amp; Creative Projects
                </p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>
                  潘奕冰
                </h1>
                <p className="text-[13px] sm:text-sm font-medium tracking-[0.08em]" style={{ color: 'rgba(200,192,184,0.4)' }}>
                  数字内容与创意项目实践者
                </p>
                <p className="text-[13px] leading-relaxed max-w-sm" style={{ color: 'rgba(200,192,184,0.25)' }}>
                  用影像、内容与生成式AI，将创意转化为可以被观看、传播和使用的项目。
                </p>
              </div>
              <div className="flex items-center gap-4">
                <motion.a href="#next-section"
                  className="group inline-flex items-center gap-3 rounded-full border px-6 py-3 text-[13px] font-medium transition-all duration-300"
                  style={{ borderColor: 'rgba(200,192,184,0.15)', color: 'rgba(200,192,184,0.8)', backgroundColor: 'rgba(200,192,184,0.04)' }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}>
                  <span className="text-[10px] tracking-[0.2em] uppercase opacity-50">01</span>
                  查看作品
                  <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10"/></svg>
                </motion.a>
                <a href="#about-section"
                  className="group text-[13px] font-medium transition-all duration-300 border-b pb-0.5"
                  style={{ color: 'rgba(200,192,184,0.35)', borderColor: 'rgba(200,192,184,0.1)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.7)'; e.currentTarget.style.borderColor = 'rgba(200,192,184,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(200,192,184,0.35)'; e.currentTarget.style.borderColor = 'rgba(200,192,184,0.1)' }}>
                  关于我
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* NEXT SECTION — Selected Works placeholder */}
        <motion.section id="next-section" className="relative px-8 sm:px-12 py-24 sm:py-32 min-h-screen"
          style={{ y: nextSectionY, opacity: nextSectionOpacity }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-20">
              <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(200,192,184,0.2)' }}>02</p>
              <p className="text-[clamp(3rem,8vw,8rem)] font-black uppercase tracking-tight leading-none" style={{ color: 'rgba(200,192,184,0.08)' }}>
                SELECTED<br />WORKS
              </p>
              <p className="text-lg mt-4" style={{ color: 'rgba(200,192,184,0.35)' }}>精选项目</p>
            </div>

            {/* Visual placeholders — 4 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {['AIGC叙事动画短片', 'AIGC产品概念片', 'AIGC商业视觉练习', '互动短视频 Demo'].map((cat, i) => (
                <motion.div key={i}
                  className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: 'rgba(200,192,184,0.04)', backgroundColor: 'rgba(200,192,184,0.015)' }}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <div className="aspect-[16/10] flex items-center justify-center" style={{ backgroundColor: 'rgba(200,192,184,0.03)' }}>
                    <span className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.12)' }}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>{cat}</span>
                    <div className="mt-3 h-1.5 w-12 rounded-full" style={{ backgroundColor: 'rgba(200,192,184,0.06)' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Footer note */}
        <div className="px-8 pb-12 text-center">
          <p className="text-[10px]" style={{ color: 'rgba(200,192,184,0.1)' }}>Visual Lab — Living Editorial Cover — /visual-lab</p>
        </div>
      </div>
    </>
  )
}
