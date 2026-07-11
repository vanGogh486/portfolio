import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { experiences, campusExperience } from '@/data/experiences'
import { awards } from '@/data/awards'

export default function ExperienceSection() {
  const filmRef = useRef<HTMLVideoElement | null>(null)
  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const showDeco = !isReducedMotion

  useEffect(() => {
    if (!showDeco) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) filmRef.current?.play().catch(() => {})
      else filmRef.current?.pause()
    }, { threshold: 0.2 })
    if (filmRef.current) obs.observe(filmRef.current)
    return () => obs.disconnect()
  }, [showDeco])

  return (
    <section id="experience" className="relative px-6 sm:px-8 lg:px-10 py-24 sm:py-32 bg-[#0C0C0C]">
      {/* Film strip decoration */}
      {showDeco && (
        <div className="absolute top-[15%] right-[2%] w-[200px] h-[140px] opacity-[0.06] pointer-events-none z-0" aria-hidden="true">
          <video ref={filmRef} src="/media/portfolio-v2/decorations/film-loop.mp4"
            className="w-full h-full object-contain" muted loop playsInline preload="metadata" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.div className="mb-16" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}>
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(200,192,184,0.2)' }}>Experience</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>实践经历</h2>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-16 sm:space-y-20">
          {experiences.map((exp, i) => (
            <motion.div key={exp.id} className="relative pl-8 sm:pl-10 border-l"
              style={{ borderColor: 'rgba(200,192,184,0.06)' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              {/* Timeline dot */}
              <div className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full" style={{ backgroundColor: '#B8936E' }} />
              <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>{exp.category}</span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1" style={{ color: 'rgba(200,192,184,0.8)' }}>{exp.title}</h3>
              <p className="text-[13px] mt-1" style={{ color: 'rgba(200,192,184,0.3)' }}>{exp.organization}{exp.organization ? ' · ' : ''}{exp.period}</p>
              <p className="text-[14px] leading-relaxed mt-4 max-w-2xl" style={{ color: 'rgba(200,192,184,0.42)' }}>{exp.summary}</p>
              {exp.dataPoints.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-5">
                  {exp.dataPoints.map(dp => (
                    <div key={dp.label} className="rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(200,192,184,0.05)', backgroundColor: 'rgba(200,192,184,0.02)' }}>
                      <p className="text-xl font-bold" style={{ color: 'rgba(200,192,184,0.75)' }}>{dp.value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(200,192,184,0.25)' }}>{dp.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* Campus */}
          <motion.div className="relative pl-8 sm:pl-10 border-l"
            style={{ borderColor: 'rgba(200,192,184,0.06)' }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full" style={{ backgroundColor: '#B8936E' }} />
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>校园经历</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1" style={{ color: 'rgba(200,192,184,0.8)' }}>{campusExperience.title}</h3>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(200,192,184,0.3)' }}>{campusExperience.role} · {campusExperience.period}</p>
            <p className="text-[14px] leading-relaxed mt-4 max-w-2xl" style={{ color: 'rgba(200,192,184,0.42)' }}>{campusExperience.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {campusExperience.highlights.map((h, j) => (
                <li key={j} className="text-[13px] flex gap-2" style={{ color: 'rgba(200,192,184,0.35)' }}>
                  <span style={{ color: 'rgba(200,192,184,0.15)' }}>—</span>{h}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Awards */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: 0.4 }}>
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>Awards &amp; Honors</span>
            <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-6" style={{ color: 'rgba(200,192,184,0.8)' }}>比赛与荣誉</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {awards.map(a => (
                <div key={a.title} className="rounded-xl border px-5 py-4" style={{ borderColor: 'rgba(200,192,184,0.05)', backgroundColor: 'rgba(200,192,184,0.015)' }}>
                  <p className="text-[13px] font-medium leading-snug" style={{ color: 'rgba(200,192,184,0.6)' }}>{a.title}</p>
                  <p className="text-[11px] mt-1.5" style={{ color: 'rgba(200,192,184,0.22)' }}>{a.level} · {a.year}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
