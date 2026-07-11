import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { archiveProjects, type ArchiveProject } from '@/data/archive'

export default function ArchiveSection() {
  const [activeProject, setActiveProject] = useState<ArchiveProject | null>(null)

  return (
    <>
      <section className="px-6 sm:px-10 lg:px-14 py-20 sm:py-28 bg-[#0C0C0C]">
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(200,192,184,0.18)' }}>More Works / Archive</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>更多作品</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {archiveProjects.map((proj, i) => (
              <motion.button
                key={proj.slug}
                type="button"
                onClick={() => setActiveProject(proj)}
                className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-400 hover:-translate-y-1 cursor-pointer ${proj.aspectRatio === '9:16' ? 'sm:col-span-1' : ''}`}
                style={{ borderColor: 'rgba(200,192,184,0.05)', backgroundColor: 'rgba(200,192,184,0.01)', aspectRatio: proj.aspectRatio === '9:16' ? '9/16' : '16/10' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <img src={publicAsset(proj.cover)} alt={proj.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[10px] tracking-[0.1em] uppercase" style={{ color: 'rgba(200,192,184,0.25)' }}>{proj.category}</span>
                  <h3 className="text-base font-semibold mt-1" style={{ color: 'rgba(200,192,184,0.85)' }}>{proj.title}</h3>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(200,192,184,0.35)' }}>{proj.titleEn} · {proj.year}</p>
                  {proj.disclaimer && (
                    <p className="text-[9px] mt-1.5 italic" style={{ color: 'rgba(200,192,184,0.18)' }}>{proj.disclaimer}</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Archive Viewer */}
      <AnimatePresence onExitComplete={() => {
        document.body.style.overflow = ''; document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = '';
      }}>
        {activeProject && (
          <motion.div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            onClick={() => setActiveProject(null)}>
            <button onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2.5 text-white/70 hover:text-white" aria-label="关闭">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <div className={`relative ${activeProject.aspectRatio === '9:16' ? 'h-[85vh]' : 'w-[85vw] max-w-5xl'}`} onClick={e => e.stopPropagation()}>
              <video src={publicAsset(activeProject.fullVideo)} poster={publicAsset(activeProject.cover)}
                className="w-full h-full object-contain rounded-lg" controls playsInline preload="metadata" />
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <p className="text-sm font-semibold" style={{ color: '#C8C0B8' }}>{activeProject.title}</p>
              <p className="text-[10px]" style={{ color: 'rgba(200,192,184,0.3)' }}>{activeProject.category} · {activeProject.year}</p>
              <p className="text-[10px] italic" style={{ color: 'rgba(200,192,184,0.18)' }}>{activeProject.disclaimer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
