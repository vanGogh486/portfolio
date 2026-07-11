import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PROFILE, EDUCATION } from '@/data/profile'

export default function AboutSection() {
  const glassRef = useRef<HTMLVideoElement | null>(null)
  const filmRef = useRef<HTMLVideoElement | null>(null)

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showDeco = !isReducedMotion

  // IO for decoration videos
  useEffect(() => {
    if (!showDeco) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        glassRef.current?.play().catch(() => {})
        filmRef.current?.play().catch(() => {})
      } else {
        glassRef.current?.pause()
        filmRef.current?.pause()
      }
    }, { threshold: 0.2 })
    const glass = glassRef.current; const film = filmRef.current
    if (glass) obs.observe(glass)
    return () => obs.disconnect()
  }, [showDeco])

  const stats = [
    { label: '全平台曝光', value: '18万+' },
    { label: '原创视频', value: '50+' },
    { label: '自媒体账号', value: '4个' },
    { label: '企业宣传短片', value: '3条' },
  ]

  return (
    <section id="about" className="relative px-6 sm:px-8 lg:px-10 py-24 sm:py-32 bg-[#0C0C0C] overflow-hidden">
      {/* Glass ring decoration */}
      {showDeco && (
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] opacity-[0.12] pointer-events-none z-0" aria-hidden="true">
          <video ref={glassRef} src="/media/portfolio-v2/decorations/glass-loop.mp4"
            className="w-full h-full object-contain" muted loop playsInline preload="metadata" />
        </div>
      )}

      {/* Film decoration */}
      {showDeco && (
        <div className="absolute bottom-[5%] left-[-5%] w-[250px] h-[180px] opacity-[0.08] pointer-events-none z-0" aria-hidden="true">
          <video ref={filmRef} src="/media/portfolio-v2/decorations/film-loop.mp4"
            className="w-full h-full object-contain" muted loop playsInline preload="metadata" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div className="mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(200,192,184,0.2)' }}>About</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>关于我</h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          {/* Left: portrait + intro */}
          <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: 0.1 }}>
            {/* Portrait */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/[0.06]">
              <img src="/media/portfolio-v2/about/portrait.png" alt="潘奕冰"
                className="w-full h-full object-cover" loading="lazy" />
            </div>
            {/* Intro */}
            <div className="space-y-3 max-w-lg">
              {PROFILE.intro.map((p, i) => (
                <p key={i} className="text-[14px] sm:text-[15px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.45)' }}>{p}</p>
              ))}
            </div>
          </motion.div>

          {/* Right: stats + skills + education */}
          <motion.div className="space-y-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: 0.2 }}>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(s => (
                <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: 'rgba(200,192,184,0.06)', backgroundColor: 'rgba(200,192,184,0.02)' }}>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: 'rgba(200,192,184,0.8)' }}>{s.value}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(200,192,184,0.3)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Key capability tags */}
            <div className="flex flex-wrap gap-2">
              {['内容策划','AIGC制作','运营分析','互动设计','影视制作','项目执行'].map(t => (
                <span key={t} className="rounded-full border px-3 py-1.5 text-[11px] font-medium"
                  style={{ borderColor: 'rgba(200,192,184,0.08)', color: 'rgba(200,192,184,0.35)' }}>{t}</span>
              ))}
            </div>

            {/* Education */}
            <div className="rounded-xl border p-5 space-y-1" style={{ borderColor: 'rgba(200,192,184,0.05)', backgroundColor: 'rgba(200,192,184,0.015)' }}>
              <p className="text-[9px] font-medium uppercase tracking-[0.15em]" style={{ color: 'rgba(200,192,184,0.2)' }}>Education</p>
              <p className="text-sm font-semibold" style={{ color: 'rgba(200,192,184,0.7)' }}>{EDUCATION.school}</p>
              <p className="text-[12px]" style={{ color: 'rgba(200,192,184,0.35)' }}>{EDUCATION.major} · {EDUCATION.degree}</p>
              <p className="text-[11px]" style={{ color: 'rgba(200,192,184,0.2)' }}>{EDUCATION.period}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
