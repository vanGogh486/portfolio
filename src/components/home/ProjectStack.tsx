import { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import ProjectCard from './ProjectCard'
import ProjectPreviewModal from './ProjectPreviewModal'
import BookModal from './BookModal'
import type { Project } from '@/data/projects'

export default function ProjectStack() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [bookOpen, setBookOpen] = useState(false)

  const handleCardClick = (project: Project) => {
    if (project.slug === 'unarmored') {
      setBookOpen(true)
    } else {
      setSelectedProject(project)
    }
  }

  return (
    <>
      <section id="selected-works" className="px-6 sm:px-8 lg:px-10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase" style={{ color: 'rgba(200,192,184,0.2)' }}>
              Selected Works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mt-3" style={{ color: '#C8C0B8' }}>
              精选项目
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                onClick={() => handleCardClick(project)}
              />
            ))}
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <BookModal
        open={bookOpen}
        onClose={() => setBookOpen(false)}
      />
    </>
  )
}
