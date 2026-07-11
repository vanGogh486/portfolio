import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'closed' | 'opening' | 'page-1' | 'flipping' | 'page-2' | 'page-3' | 'page-4' | 'closing'

const TOTAL_PAGES = 4

export default function UnarmoredCasebook({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('closed')
  const [currentPage, setCurrentPage] = useState(1)
  const [targetPage, setTargetPage] = useState(1)

  const animRef = useRef<HTMLVideoElement>(null!)
  const scrollY = useRef(0)
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Lock body on open
  useEffect(() => {
    if (open) {
      scrollY.current = window.scrollY
      document.body.style.overflow = 'hidden'; document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY.current}px`; document.body.style.width = '100%'
      setCurrentPage(1); setTargetPage(1)
      if (isReducedMotion) { setPhase('page-1') }
      else { setPhase('opening'); playAnim('open', 'page-1') }
    }
    return () => {
      document.body.style.overflow = ''; document.body.style.position = ''
      document.body.style.top = ''; document.body.style.width = ''
    }
  }, [open, isReducedMotion])

  // Play animation video, transition to target phase on end
  const playAnim = useCallback((anim: 'open' | 'flip' | 'close', target: Phase) => {
    // Delay to allow React to render the video element first
    const doPlay = () => {
      const v = animRef.current
      if (!v) { setTimeout(doPlay, 50); return }
      v.onended = null; if (animTimeout.current) clearTimeout(animTimeout.current)
      v.src = `/media/portfolio-v2/book/${anim}.mp4`
      v.currentTime = 0; v.load()
      v.onloadeddata = () => v.play().catch(() => {})
      v.onended = () => {
        v.onended = null
        if (anim === 'close') { handleClose(); return }
        setPhase(target)
        if (anim === 'flip') setCurrentPage(targetPage)
      }
      animTimeout.current = setTimeout(() => {
        if (anim === 'close') { handleClose(); return }
        setPhase(target)
        if (anim === 'flip') setCurrentPage(targetPage)
      }, 7000)
    }
    doPlay()
  }, [targetPage])

  // Go to page
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page > TOTAL_PAGES || phase.startsWith('flipping') || phase === 'opening' || phase === 'closing') return
    if (page === currentPage) return
    setTargetPage(page)
    if (isReducedMotion) { setPhase(page === 1 ? 'page-1' : page === 2 ? 'page-2' : page === 3 ? 'page-3' : 'page-4'); setCurrentPage(page) }
    else { setPhase('flipping'); playAnim('flip', page === 1 ? 'page-1' : page === 2 ? 'page-2' : page === 3 ? 'page-3' : 'page-4') }
  }, [currentPage, phase, isReducedMotion, playAnim])

  // Close
  const triggerClose = useCallback(() => {
    if (animTimeout.current) clearTimeout(animTimeout.current)
    if (isReducedMotion) { handleClose(); return }
    setPhase('closing'); playAnim('close', 'closed')
  }, [isReducedMotion, playAnim])

  const handleClose = useCallback(() => {
    const v = animRef.current; if (v) { v.pause(); v.removeAttribute('src'); v.load() }
    setPhase('closed')
    document.body.style.overflow = ''; document.body.style.position = ''
    document.body.style.top = ''; document.body.style.width = ''
    window.scrollTo({ top: scrollY.current, behavior: 'instant' as ScrollBehavior })
    onClose()
  }, [onClose])

  // Keyboard
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') triggerClose()
      if (e.key === 'ArrowRight') goToPage(currentPage + 1)
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1)
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [open, currentPage, triggerClose, goToPage])

  // Pause anim on tab hidden
  useEffect(() => {
    if (!open) return
    const vis = () => { if (document.hidden && animRef.current) animRef.current.pause() }
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [open])

  if (!open) return null

  const isAnimating = phase === 'opening' || phase === 'flipping' || phase === 'closing'
  const showContent = !isAnimating && !isReducedMotion
  const showReduced = isReducedMotion

  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Close button */}
      <button onClick={triggerClose}
        className="absolute top-4 right-4 z-30 rounded-full bg-white/10 p-2.5 text-white/60 hover:text-white transition-colors" aria-label="关闭">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      {/* Page indicator */}
      {!isAnimating && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${currentPage === i + 1 ? 'bg-[#B8936E]' : 'bg-white/10'}`} />
          ))}
        </div>
      )}

      {/* Book container — dual page on desktop, single on mobile */}
      <div className="relative w-[min(92vw,1100px)] h-[min(88vh,700px)] min-h-[480px] rounded-xl overflow-hidden border"
        style={{ borderColor: 'rgba(200,192,184,0.06)', backgroundColor: '#1a1a18' }}>

        {/* Animation video overlay — always mounted for ref access */}
        <video ref={animRef}
          className={`absolute inset-0 w-full h-full object-cover z-20 pointer-events-none ${(isAnimating && !isReducedMotion) ? '' : 'hidden'}`}
          muted playsInline preload="metadata" />

        {/* Content — only shown when not animating */}
        {(showContent || showReduced) && (
          <div className="absolute inset-0 flex flex-col lg:flex-row">
            {/* LEFT PAGE */}
            <PageLeft page={currentPage} />
            {/* RIGHT PAGE */}
            <PageRight page={currentPage} goToPage={goToPage} />
          </div>
        )}
      </div>

      {/* Navigation bar */}
      {!isAnimating && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
          <button onClick={() => goToPage(currentPage - 1)}
            className={`text-[12px] font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${currentPage > 1 ? 'text-white/50 hover:text-white/80' : 'text-white/15 cursor-default'}`}
            disabled={currentPage <= 1}>← 上一页</button>
          <span className="text-[11px] font-medium tracking-[0.1em] text-white/25">{currentPage} / {TOTAL_PAGES}</span>
          <button onClick={() => goToPage(currentPage + 1)}
            className={`text-[12px] font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center ${currentPage < TOTAL_PAGES ? 'text-white/50 hover:text-white/80' : 'text-white/15 cursor-default'}`}
            disabled={currentPage >= TOTAL_PAGES}>下一页 →</button>
        </div>
      )}
    </div>
  )
}

function PageLeft({ page }: { page: number }) {
  const content: Record<number, { num: string; title: string; subtitle: string; body: string[] }> = {
    1: { num:'01', title:'项目起点', subtitle:'PROJECT ORIGIN', body: [
      '《卸甲》以花木兰战后归乡为背景，讨论"如何带着伤口重新生活"。',
      '视觉定位：冷灰水墨风格，克制叙事，强调人物内心世界的视觉化表达。',
      '人物设定：木兰、战马、雪原、故乡庭院。以冷色调和留白构建古风视觉体系。',
      '场景设定：战场闪回→归乡独白→新生，三个时空通过色彩和光影区分。',
    ]},
    2: { num:'02', title:'故事与分镜', subtitle:'STORY & STORYBOARD', body: [
      '三段式叙事结构：战场记忆（冷灰+高速剪辑）→ 归乡独白（固定镜头+长镜头）→ 新生（暖灰+缓慢推进）。',
      '情绪节奏：从创伤到接纳，通过镜头时长和画面密度传递情感变化。',
      '分镜设计：使用黑白分镜图锁定每个镜头的构图、人物位置和关键动作。',
      '镜头衔接：通过人物视线方向和物体运动方向保持视觉连续性。',
    ]},
    3: { num:'03', title:'AIGC制作流程', subtitle:'PRODUCTION', body: [
      '人物一致性控制：通过参考图和风格锁定，确保木兰在不同镜头中保持统一外貌。',
      '场景视觉生成：分别建立雪原、战场、庭院三个场景的视觉模板和提示词库。',
      '图像生成：逐帧生成关键帧，控制光影和色调的连贯性。',
      '视频动态化：使用图生视频工具，通过低幅运镜保持画面稳定和电影感。',
      '剪辑与包装：情绪节奏剪辑，音效设计，成片输出。',
    ]},
    4: { num:'04', title:'完整作品', subtitle:'FINAL FILM', body: [
      '负责从选题策划、故事结构、人物与场景设定、分镜设计，到AI图像生成、视频动态化和后期剪辑的完整制作流程。',
      '重点控制人物一致性、古风叙事氛围以及镜头之间的情绪衔接。',
      '使用完整视频播放器观看成片。',
    ]},
  }
  const c = content[page] || content[1]
  return (
    <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/[0.04] overflow-y-auto">
      <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-white/20">{c.num} · {c.subtitle}</span>
      <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#C8C0B8]">{c.title}</h2>
      <div className="mt-5 space-y-2.5">
        {c.body.map((p, i) => (
          <p key={i} className="text-[13px] sm:text-[14px] leading-relaxed text-white/45">{p}</p>
        ))}
      </div>
    </div>
  )
}

function PageRight({ page, goToPage }: { page: number; goToPage: (p: number) => void }) {
  if (page === 1) return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#111] rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none overflow-hidden">
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <img src="/projects/unarmored/process/storyboard-01.png" alt="分镜01" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <img src="/projects/unarmored/process/storyboard-02.png" alt="分镜02" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <img src="/projects/unarmored/process/storyboard-03.png" alt="分镜03" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <div className="rounded-lg border border-white/[0.04] flex items-center justify-center bg-[#0C0C0C]">
          <span className="text-[10px] tracking-[0.1em] text-white/15 uppercase">CHARACTER<br/>REFERENCE</span>
        </div>
      </div>
    </div>
  )
  if (page === 2) return (
    <div className="flex-1 flex items-center justify-center p-6 bg-[#111] rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none overflow-hidden">
      <div className="grid grid-cols-2 gap-3 w-full max-w-md">
        <img src="/projects/unarmored/gallery/5s.jpg" alt="00:05" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <img src="/projects/unarmored/gallery/45s.jpg" alt="00:45" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <img src="/projects/unarmored/gallery/105s.jpg" alt="01:45" className="rounded-lg w-full object-cover border border-white/[0.04]" />
        <img src="/projects/unarmored/gallery/145s.jpg" alt="02:25" className="rounded-lg w-full object-cover border border-white/[0.04]" />
      </div>
    </div>
  )
  if (page === 3) return (
    <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 bg-[#111] rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none overflow-y-auto">
      <div className="space-y-3">
        {[
          { step:'主题分析', detail:'花木兰战后归乡 → 讨论创伤与重新生活' },
          { step:'剧本与结构', detail:'三段式叙事：战场→归乡→新生' },
          { step:'人物与场景设定', detail:'冷灰水墨风格，参考古风视觉资料' },
          { step:'分镜设计', detail:'黑白分镜图，锁定构图与人物位置' },
          { step:'AI图像生成', detail:'逐帧关键帧，控制人物与场景一致性' },
          { step:'视频动态化', detail:'图生视频，低幅运镜，画面稳定' },
          { step:'剪辑与包装', detail:'情绪节奏剪辑，音效设计，成片输出' },
        ].map((w, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-[10px] font-bold text-[#B8936E] w-5 flex-shrink-0 mt-0.5">{i + 1}</span>
            <div>
              <p className="text-[13px] font-medium text-white/55">{w.step}</p>
              <p className="text-[11px] text-white/25 mt-0.5">{w.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  // Page 4 — Full video
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#111] rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none">
      <div className="max-w-md w-full space-y-4 text-center">
        <p className="text-[14px] font-medium text-[#C8C0B8]">播放完整作品</p>
        <video src="/projects/unarmored/full.mp4" poster="/media/portfolio-v2/projects/unarmored/poster.png"
          className="w-full rounded-lg" controls playsInline preload="metadata" />
        <div className="flex gap-4 justify-center pt-2">
          <button onClick={() => goToPage(1)}
            className="text-[12px] text-white/30 hover:text-white/60 transition-colors min-w-[44px] min-h-[44px]">← 回到首页</button>
        </div>
      </div>
    </div>
  )
}
