import { useState } from 'react'
import { motion } from 'framer-motion'
import { EDUCATION } from '@/data/profile'
import { experiences, campusExperience } from '@/data/experiences'
import { awards } from '@/data/awards'
import { projects } from '@/data/projects'

interface Clip {
  id: string; track: number; title: string; subtitle?: string
  year: number; span: number; // span in years for width
  type: string; detail: string; previewLabel?: string; previewImage?: string
}

// Build clip data from real sources
const clips: Clip[] = [
  // TRACK 01 — EDUCATION
  { id:'edu', track:1, title:EDUCATION.school, subtitle:`${EDUCATION.major} · ${EDUCATION.degree}`, year:2023, span:4, type:'Education', detail:EDUCATION.period, previewLabel:`${EDUCATION.school}\n${EDUCATION.major}\n${EDUCATION.period}` },
  // TRACK 02 — PROJECTS
  ...projects.map((p,i)=>({ id:p.slug, track:2, title:p.title, subtitle:p.englishTitle, year:parseInt(p.year), span:1, type:'Project', detail:p.role, previewLabel:`${p.title}\n${p.category}\n${p.year}`, previewImage:p.cover })),
  // TRACK 03 — AWARDS & PRACTICE
  { id:'media', track:3, title:'个人自媒体运营', year:2024, span:2, type:'Practice', detail:'4个账号 · 50+原创视频 · 18万+曝光', previewLabel:'自媒体运营\n4个账号 · 50+视频\n全平台18万+曝光' },
  { id:'sirui', track:3, title:'上海思睿影视实践', year:2025, span:1, type:'Practice', detail:'近千条素材 · 3条企业宣传片', previewLabel:'影视制作实践\n近千条素材整理\n协助3条企业短片' },
  { id:'campus', track:3, title:'学生会副会长', year:2024, span:2, type:'Campus', detail:'3场校级活动 · 多部门协调', previewLabel:'学生会\n协同执行3场大型活动\n多部门协调统筹' },
  ...awards.map((a,i)=>({ id:`award-${i}`, track:3, title:a.title, year:parseInt(a.year), span:1, type:'Award', detail:a.level||'', previewLabel:`${a.title}\n${a.level||''}\n${a.year}` })),
]

const years = [2023, 2024, 2025, 2026]
const trackLabels = ['EDUCATION', 'PROJECTS', 'AWARDS & PRACTICE']

export default function ExperienceSectionV1() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hovered = clips.find(c => c.id === hoveredId)

  // Year-to-pixel mapping: each year = 180px
  const yearPx = 180
  const baseYear = 2023

  const getLeft = (year: number) => (year - baseYear) * yearPx
  const getWidth = (span: number) => span * yearPx - 8

  return (
    <section id="experience-section" className="relative px-6 sm:px-10 lg:px-14 pt-16 pb-24 sm:pt-20 sm:pb-32" style={{ backgroundColor: '#0C0C0C' }}>
      {/* Transition fade from Works */}
      <div className="absolute top-0 left-0 right-0 h-[20%] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(12,12,12,0.4) 0%, #0C0C0C 100%)' }} aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(200,192,184,0.2)' }}>04 / Experience</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>创作经历</h2>
        </motion.div>

        {/* DESKTOP — Production Timeline */}
        <div className="hidden lg:block">
          {/* Preview Monitor — top right */}
          <div className="flex justify-end mb-6">
            <div className="rounded-lg overflow-hidden border" style={{ width: 280, height: 160, borderColor: 'rgba(200,192,184,0.06)', backgroundColor: 'rgba(200,192,184,0.015)' }}>
              {hovered ? (
                <motion.div key={hovered.id} className="w-full h-full flex flex-col items-center justify-center p-4 text-center relative"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
                  {hovered.previewImage && (
                    <img src={hovered.previewImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.25]" />
                  )}
                  <div className="relative z-10">
                    <p className="text-[10px] font-medium tracking-[0.12em] uppercase mb-1" style={{ color: 'rgba(200,192,184,0.25)' }}>
                      {hovered.type}
                    </p>
                    {hovered.previewLabel?.split('\n').map((l, i) => (
                      <p key={i} className="text-[11px] leading-relaxed" style={{ color: i === 0 ? 'rgba(200,192,184,0.7)' : 'rgba(200,192,184,0.35)' }}>{l}</p>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: 'rgba(200,192,184,0.12)' }}>SELECT A CLIP</p>
                </div>
              )}
            </div>
          </div>

          {/* Year scale */}
          <div className="flex mb-6 ml-[60px]" style={{ paddingLeft: 0 }}>
            {years.map(y => (
              <div key={y} className="flex items-center gap-2" style={{ width: yearPx }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgba(200,192,184,0.25)' }} />
                <span className="text-[14px] font-bold tabular-nums tracking-tight" style={{ color: 'rgba(200,192,184,0.5)' }}>{y}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(200,192,184,0.06)' }} />
              </div>
            ))}
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(200,192,184,0.15)' }} />
          </div>

          {/* Tracks */}
          <div className="space-y-5 ml-[60px] relative" style={{ overflowX: 'auto', overflowY: 'visible', scrollbarWidth: 'thin' }}>
            {/* Timeline base line */}
            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" aria-hidden="true" />

            {trackLabels.map((label, ti) => {
              const trackClips = clips.filter(c => c.track === ti + 1)
              return (
                <div key={label} className="relative" style={{ minHeight: 72 }}>
                  {/* Track label */}
                  <div className="absolute -left-[60px] top-2 w-[52px] text-right flex-shrink-0">
                    <p className="text-[8px] font-medium tracking-[0.12em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>TRACK {ti + 1}</p>
                    <p className="text-[9px] font-semibold mt-0.5" style={{ color: 'rgba(200,192,184,0.35)' }}>{label}</p>
                  </div>
                  {/* Track background line */}
                  <div className="absolute left-0 right-0 top-4 h-px" style={{ backgroundColor: 'rgba(200,192,184,0.03)' }} />

                  {/* Clips */}
                  <div className="relative" style={{ height: 64, width: (years.length) * yearPx }}>
                    {trackClips.map(clip => (
                      <motion.div key={clip.id}
                        className="absolute top-2 rounded-md border px-3 py-2 cursor-pointer transition-all duration-300 overflow-hidden"
                        style={{
                          left: getLeft(clip.year), width: getWidth(clip.span),
                          borderColor: hoveredId === clip.id ? 'rgba(184,147,110,0.35)' : 'rgba(200,192,184,0.05)',
                          backgroundColor: hoveredId === clip.id ? 'rgba(184,147,110,0.04)' : 'rgba(200,192,184,0.01)',
                          transform: hoveredId === clip.id ? 'translateY(-3px)' : 'none',
                          opacity: hoveredId && hoveredId !== clip.id ? 0.55 : 1,
                          zIndex: hoveredId === clip.id ? 5 : 1,
                        }}
                        onMouseEnter={() => setHoveredId(clip.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: hoveredId === clip.id ? '#B8936E' : 'rgba(200,192,184,0.25)' }} />
                          <span className="text-[9px] font-medium tracking-[0.06em] truncate" style={{ color: hoveredId === clip.id ? 'rgba(200,192,184,0.85)' : 'rgba(200,192,184,0.5)' }}>
                            {clip.title}
                          </span>
                        </div>
                        <p className="text-[8px] truncate" style={{ color: 'rgba(200,192,184,0.25)' }}>{clip.detail}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Timecode strip at bottom */}
            <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(200,192,184,0.04)' }}>
              <span className="text-[9px] tracking-[0.08em] tabular-nums" style={{ color: 'rgba(200,192,184,0.15)' }}>00:00:00:00</span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(200,192,184,0.03)' }} />
              <span className="text-[9px] tracking-[0.08em] tabular-nums" style={{ color: 'rgba(200,192,184,0.1)' }}>END OF REEL</span>
            </div>
          </div>
        </div>

        {/* MOBILE — Vertical clip list */}
        <div className="lg:hidden space-y-10">
          {years.map(y => {
            const yearClips = clips.filter(c => c.year === y || (c.year <= y && c.year + c.span > y))
            if (yearClips.length === 0) return null
            return (
              <div key={y}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#B8936E' }} />
                  <span className="text-lg font-bold" style={{ color: 'rgba(200,192,184,0.6)' }}>{y}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(200,192,184,0.05)' }} />
                </div>
                <div className="space-y-2 pl-5">
                  {yearClips.map(clip => (
                    <motion.button key={clip.id} type="button"
                      className="w-full text-left rounded-lg border px-4 py-3 transition-all duration-300"
                      style={{
                        minHeight: 44,
                        borderColor: hoveredId === clip.id ? 'rgba(184,147,110,0.35)' : 'rgba(200,192,184,0.05)',
                        backgroundColor: hoveredId === clip.id ? 'rgba(184,147,110,0.04)' : 'rgba(200,192,184,0.01)',
                      }}
                      onClick={() => setHoveredId(hoveredId === clip.id ? null : clip.id)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-medium tracking-[0.08em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>{clip.type}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredId === clip.id ? '#B8936E' : 'rgba(200,192,184,0.2)' }} />
                      </div>
                      <p className="text-[13px] font-medium" style={{ color: 'rgba(200,192,184,0.7)' }}>{clip.title}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'rgba(200,192,184,0.3)' }}>{clip.detail}</p>
                      {hoveredId === clip.id && (
                        <motion.div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(200,192,184,0.04)' }}
                          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          {clip.previewLabel?.split('\n').map((l, i) => (
                            <p key={i} className="text-[11px]" style={{ color: 'rgba(200,192,184,0.4)' }}>{l}</p>
                          ))}
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
