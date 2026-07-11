import { motion } from 'framer-motion'
import { EDUCATION } from '@/data/profile'
import { experiences, campusExperience } from '@/data/experiences'
import { awards } from '@/data/awards'

export default function ExperienceSectionSimple() {
  return (
    <section id="experience-section" className="relative px-6 sm:px-10 lg:px-14 py-24 sm:py-32" style={{ backgroundColor: '#0C0C0C' }}>
      <div className="mx-auto max-w-5xl">
        <motion.div className="mb-14" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(200,192,184,0.2)' }}>04 / Experience</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>创作经历</h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Education */}
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>Education</p>
            <p className="text-lg font-semibold" style={{ color: 'rgba(200,192,184,0.8)' }}>{EDUCATION.school}</p>
            <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.4)' }}>{EDUCATION.major} · {EDUCATION.degree}</p>
            <p className="text-[11px]" style={{ color: 'rgba(200,192,184,0.25)' }}>{EDUCATION.period}</p>
          </motion.div>

          {/* Practice */}
          <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>Practice</p>
            {experiences.map(exp => (
              <div key={exp.id} className="space-y-1.5">
                <p className="text-sm font-semibold" style={{ color: 'rgba(200,192,184,0.7)' }}>{exp.title}</p>
                <p className="text-[12px]" style={{ color: 'rgba(200,192,184,0.35)' }}>{exp.organization}{exp.organization ? ' · ' : ''}{exp.period}</p>
                <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.4)' }}>{exp.summary}</p>
                {exp.dataPoints.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                    {exp.dataPoints.slice(0, 4).map(dp => (
                      <span key={dp.label} className="text-[11px]" style={{ color: 'rgba(200,192,184,0.3)' }}>{dp.value} {dp.label}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Campus */}
            <div className="space-y-1.5 pt-2">
              <p className="text-sm font-semibold" style={{ color: 'rgba(200,192,184,0.7)' }}>{campusExperience.title} — {campusExperience.role}</p>
              <p className="text-[12px]" style={{ color: 'rgba(200,192,184,0.35)' }}>{campusExperience.period}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.4)' }}>{campusExperience.summary}</p>
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <p className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>Awards &amp; Honors</p>
            {awards.map((a, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[13px] font-medium leading-snug" style={{ color: 'rgba(200,192,184,0.6)' }}>{a.title}</p>
                <p className="text-[11px]" style={{ color: 'rgba(200,192,184,0.25)' }}>{a.level} · {a.year}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
