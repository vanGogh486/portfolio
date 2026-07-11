import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'

export default function MotionReel() {
  // Double the array for seamless loop effect
  const doubled = [...projects, ...projects]

  return (
    <section className="relative bg-[#0C0C0C] py-16 sm:py-20 overflow-hidden">
      {/* Label */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 mb-8">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/20">
          Motion Reel
        </p>
        <p className="text-[13px] text-white/30 mt-1">
          项目预览 — 悬停播放，点击查看详情
        </p>
      </div>

      {/* Desktop: two-row reverse scroll */}
      <div className="hidden sm:block space-y-3">
        {/* Row 1 — left scroll */}
        <div className="flex gap-3 animate-scroll-left" style={{ width: 'max-content' }}>
          {doubled.map((project, i) => (
            <ReelCard key={`${project.slug}-r1-${i}`} project={project} index={i} />
          ))}
        </div>
        {/* Row 2 — right scroll */}
        <div className="flex gap-3 animate-scroll-right" style={{ width: 'max-content' }}>
          {doubled.reverse().map((project, i) => (
            <ReelCard key={`${project.slug}-r2-${i}`} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="sm:hidden flex gap-3 overflow-x-auto px-6 scrollbar-hide">
        {projects.map((project, i) => (
          <ReelCard key={project.slug} project={project} index={i} compact />
        ))}
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 60s linear infinite;
        }
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  )
}

function ReelCard({ project, index, compact }: { project: typeof projects[0]; index: number; compact?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      },
      { threshold: 0.5 },
    )
    observerRef.current.observe(video)

    return () => observerRef.current?.disconnect()
  }, [])

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <a
      href={`/project/${project.slug}`}
      className={`group relative flex-shrink-0 overflow-hidden rounded-2xl bg-[#141414] transition-all duration-400 hover:-translate-y-1 ${
        compact ? 'w-[75vw] aspect-[4/3]' : 'w-[420px] h-[270px]'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cover poster (visible until hover) */}
      <img
        src={project.cover}
        alt={project.title}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        loading="lazy"
      />
      {/* Preview video */}
      <video
        ref={videoRef}
        src={project.preview}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Label */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/50 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
          {project.title}
        </span>
      </div>
    </a>
  )
}
