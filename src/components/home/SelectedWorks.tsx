import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'

export default function SelectedWorks() {
  return (
    <section id="selected-works" className="px-6 lg:px-8 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-[11px] font-medium tracking-[0.25em] uppercase text-white/25 mb-3">
            Selected Works
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            精选项目
          </h2>
        </motion.div>

        {/* Grid — 4 projects in editorial layout */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              size={project.size}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
