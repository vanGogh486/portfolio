import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CinematicProjectViewer from './CinematicProjectViewer'
import { publicAsset } from '@/lib/publicAsset'

interface ProjectEntry {
  slug: string; num: string; title: string; titleEn: string
  category: string; year: string; role: string; summary: string
  cover: string; duration: string; preview?: string; fullVideo?: string
  objectPosition: string; cssFilter?: string; hoverVideo?: string
  aspectRatio?: 'landscape' | 'portrait'
  disclaimer?: string
}

const entries: ProjectEntry[] = [
  { slug:'unarmored', num:'01', title:'《卸甲》', titleEn:'UNARMORED', category:'AIGC叙事动画短片', year:'2026', role:'创意策划 / 视觉风格 / 分镜设计 / AIGC生成 / 剪辑包装', summary:'战争结束后，木兰回到故乡，却发现身体已经回家，记忆仍停留在战场。以冷灰水墨与克制叙事，讨论如何带着伤口重新生活。', cover:'/media/portfolio-v2/projects/unarmored/poster.png', duration:'00:02:28:00', objectPosition:'center 30%', preview:'/projects/unarmored/preview.mp4', hoverVideo:'/projects/unarmored/preview.mp4', fullVideo:'/projects/unarmored/full.mp4' },
  { slug:'vivo-relic', num:'02', title:'《终局圣物》', titleEn:'THE FINAL RELIC', category:'AIGC产品概念片', year:'2026', role:'卖点拆解 / 内容策划 / 脚本分镜 / Prompt设计 / AIGC生成 / 剪辑复盘', summary:'将手机的防护、防水、续航与通信能力，转译成异世界Boss战中的关键生存能力，用短剧化叙事替代传统参数堆叠。', cover:'/media/portfolio-v2/projects/vivo/poster.png', duration:'00:00:57:00', objectPosition:'center center', preview:'/projects/vivo-relic/preview.mp4', fullVideo:'/projects/vivo-relic/full.mp4' },
  { slug:'sk2-concept', num:'03', title:'SK-II 神仙水 AIGC概念广告', titleEn:'SK-II CONCEPT FILM', category:'AIGC商业视觉练习', year:'2026', role:'视觉定位 / 分镜设计 / Prompt设计 / 产品一致性控制 / 剪辑包装', summary:'以冷白银色、镜面水域、液体微距与极简产品英雄镜头，完成一支45秒高端护肤品概念TVC，重点验证产品还原和统一视觉控制。', cover:'/media/portfolio-v2/projects/sk2/poster.png', duration:'00:00:45:00', objectPosition:'center 40%', preview:'/projects/sk2-concept/preview.mp4', fullVideo:'/projects/sk2-concept/full.mp4' },
  { slug:'midnight-elevator', num:'04', title:'《午夜电梯》', titleEn:'MIDNIGHT ELEVATOR', category:'AIGC互动恐怖短片 Demo', year:'2026', role:'互动机制 / 文字脚本 / 用户路径 / UI信息层级 / 双分支制作', summary:'女主被困在不存在的B13层，观众必须在开门救人和关门自保之间选择。包含A/B分支、倒计时确认、QTE和双分支结局。', cover:'/media/portfolio-v2/projects/midnight-elevator/poster.png', duration:'00:01:30:00', objectPosition:'center center', cssFilter:'brightness(1.18) contrast(1.06)', preview:'/projects/midnight-elevator/preview.mp4', fullVideo:'/projects/midnight-elevator/full.mp4', aspectRatio:'portrait' },
  { slug:'ysl-lipstick', num:'05', title:'YSL小金条 #21', titleEn:'YSL ROUGE PUR COUTURE #21', category:'美妆商业视觉 / AIGC概念广告', year:'2026', role:'创意方向 / 产品视觉 / 分镜 / AIGC画面生成 / 产品一致性 / 视频动态化 / 剪辑包装', summary:'以YSL小金条#21为主体的AIGC概念广告，聚焦口红产品的高端质感与视觉呈现。', cover:'/projects/ysl-lipstick/cover.jpg', duration:'00:00:15:00', objectPosition:'center 35%', preview:'/projects/ysl-lipstick/full.mp4', fullVideo:'/projects/ysl-lipstick/full.mp4', aspectRatio:'landscape', disclaimer:'个人概念作品 / 非品牌官方合作' },
  { slug:'echocalypse-lilith', num:'06', title:'《绯色回响》莉莉丝生日邀请', titleEn:'ECHOCALYPSE · LILITH INVITATION', category:'二次元互动视觉 / AIGC概念短片', year:'2026', role:'内容策划 / 角色视觉 / 邀请函UI / 分镜与节奏 / AIGC画面生成 / 视频动态化 / 剪辑包装', summary:'以《绯色回响》角色莉莉丝为主体的生日邀请互动概念短片。采用竖屏9:16格式，融入游戏角色视觉与邀请函UI设计。', cover:'/projects/echocalypse-lilith/cover.png', duration:'00:00:15:00', objectPosition:'center center', preview:'/projects/echocalypse-lilith/full.mp4', fullVideo:'/projects/echocalypse-lilith/full.mp4', aspectRatio:'portrait', disclaimer:'个人概念作品 / 非官方内容创作' },
]

export default function WorksSectionV1() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [imageHovered, setImageHovered] = useState(false)
  const [hoverPlaying, setHoverPlaying] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hoverVideoRef = useRef<HTMLVideoElement | null>(null)
  const active = entries[activeIdx]
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const clearHoverTimer = () => { if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null } }

  // Hover video: 300ms delay → play, mouseleave → pause+reset
  const handleImgEnter = useCallback(() => {
    setImageHovered(true)
    if (!active.hoverVideo || isTouchDevice) return
    clearHoverTimer()
    hoverTimer.current = setTimeout(() => {
      setHoverPlaying(true)
      if (hoverVideoRef.current) { hoverVideoRef.current.currentTime = 0; hoverVideoRef.current.play().catch(() => setHoverPlaying(false)) }
    }, 300)
  }, [active.hoverVideo, isTouchDevice])

  const handleImgLeave = useCallback(() => {
    setImageHovered(false)
    clearHoverTimer()
    setHoverPlaying(false)
    if (hoverVideoRef.current) { hoverVideoRef.current.pause(); hoverVideoRef.current.currentTime = 0 }
  }, [])

  // Reset hover when activeIdx changes
  useEffect(() => { setHoverPlaying(false); if (hoverVideoRef.current) { hoverVideoRef.current.pause(); hoverVideoRef.current.currentTime = 0 } }, [activeIdx])

  const handlePrev = () => setActiveIdx(i => (i - 1 + entries.length) % entries.length)
  const handleNext = () => setActiveIdx(i => (i + 1) % entries.length)

  return (
    <>
      <section id="works-section" className="relative px-6 sm:px-10 lg:px-14 pt-8 pb-20 sm:pt-10 sm:pb-28" style={{ backgroundColor: '#0C0C0C' }}>
        <div className="absolute top-0 left-0 right-0 h-[20%] pointer-events-none" style={{ background:'linear-gradient(to bottom, rgba(12,12,12,0.4) 0%, #0C0C0C 100%)' }} aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div className="mb-8 lg:mb-10" initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <div className="flex items-center gap-1.5 mb-3" aria-hidden="true">
              {Array.from({ length:20 }).map((_,i)=><div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:i%3===0?'rgba(200,192,184,0.06)':'rgba(200,192,184,0.03)' }} />)}
            </div>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-1" style={{ color:'rgba(200,192,184,0.2)' }}>03 / Selected Works</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color:'#C8C0B8' }}>精选项目</h2>
          </motion.div>

          {/* DESKTOP */}
          <div className="hidden lg:grid items-start" style={{ gridTemplateColumns:'155px 1fr 250px', gap:'clamp(20px, 2.5vw, 40px)' }}>
            {/* LEFT: Index */}
            <div className="space-y-1">
              {entries.map((e,i)=>(
                <motion.button key={e.slug} type="button" className="w-full text-left group flex items-center gap-3 py-3 px-2 transition-all duration-300 relative"
                  onMouseEnter={()=>setActiveIdx(i)} initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}>
                  <div className="relative flex-shrink-0">
                    <span className="text-[11px] font-bold tracking-[0.1em] transition-colors duration-300" style={{ color:i===activeIdx?'#B8936E':'rgba(200,192,184,0.25)' }}>{e.num}</span>
                    {i===activeIdx && <motion.div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor:'#B8936E' }} layoutId="dot" transition={{ duration:0.3 }} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium leading-tight transition-colors duration-300 truncate" style={{ color:i===activeIdx?'rgba(200,192,184,0.88)':'rgba(200,192,184,0.42)' }}>{e.title}</p>
                    <p className="text-[9px] tracking-[0.06em] uppercase mt-0.5 truncate" style={{ color:i===activeIdx?'rgba(200,192,184,0.35)':'rgba(200,192,184,0.2)' }}>{e.category}</p>
                  </div>
                  <div className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[0,1].map(j=><div key={j} className="w-1 h-1 rounded-full" style={{ backgroundColor:'rgba(200,192,184,0.12)' }} />)}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* CENTER: Image with hover video + click → viewer */}
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-x-3 w-3 h-px pointer-events-none z-10" style={{ backgroundColor:'rgba(184,147,110,0.15)' }} aria-hidden="true" />
              <motion.div className="relative overflow-hidden rounded-[4px] cursor-pointer"
                style={{ aspectRatio:'16/10', backgroundColor:'rgba(200,192,184,0.02)' }}
                onMouseEnter={handleImgEnter} onMouseLeave={handleImgLeave}
                onClick={()=>setViewerOpen(true)}>
                {/* Portrait blur bg fill — only for vertical projects */}
                {active.aspectRatio === 'portrait' && (
                  <img src={publicAsset(active.cover)} alt="" aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ filter: 'blur(28px) brightness(0.35)', transform: 'scale(1.15)', opacity: 0.35 }} />
                )}
                {/* Poster */}
                <img src={publicAsset(active.cover)} alt={active.title} className={`absolute inset-0 w-full h-full transition-all duration-500 ${hoverPlaying?'opacity-0 scale-105':'opacity-100 scale-100'}`}
                  style={{ objectFit: active.aspectRatio === 'portrait' ? 'contain' : 'cover', objectPosition:active.objectPosition, filter:active.cssFilter }} />
                {/* Hover video — 卸甲 only */}
                {active.hoverVideo && (
                  <video ref={hoverVideoRef} src={publicAsset(active.hoverVideo)}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 pointer-events-none ${hoverPlaying?'opacity-100 scale-100':'opacity-0 scale-105'}`}
                    muted loop playsInline preload="metadata" onError={()=>setHoverPlaying(false)} />
                )}
                {/* Timecode */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4"><p className="text-[10px] font-medium tracking-[0.15em]" style={{ color:'rgba(200,192,184,0.3)' }}>PROJECT {active.num}</p></div>
                  <div className="absolute top-4 right-4"><p className="text-[10px] tracking-[0.1em]" style={{ color:'rgba(200,192,184,0.22)' }}>{active.year} / {active.category.split(' ')[0]}</p></div>
                  <div className="absolute bottom-4 left-4"><p className="text-[10px] tracking-[0.08em] tabular-nums" style={{ color:'rgba(200,192,184,0.2)' }}>{active.duration}</p></div>
                  <div className="absolute bottom-4 right-4"><p className="text-[9px] tracking-[0.08em] uppercase" style={{ color:'rgba(200,192,184,0.15)' }}>PAN YIBING / SELECTED WORK</p></div>
                </div>
                {/* Crop marks */}
                <div className="absolute inset-0 pointer-events-none">
                  {['top-3 left-3','top-3 right-3','bottom-3 left-3','bottom-3 right-3'].map((p,i)=>{const[py,px]=p.split(' ');return <div key={i} className={`absolute ${py} ${px} w-4 h-4`} style={{ borderTop:py==='top-3'?'1px solid rgba(200,192,184,0.08)':undefined, borderBottom:py==='bottom-3'?'1px solid rgba(200,192,184,0.08)':undefined, borderLeft:px==='left-3'?'1px solid rgba(200,192,184,0.08)':undefined, borderRight:px==='right-3'?'1px solid rgba(200,192,184,0.08)':undefined }} />})}
                </div>
                {imageHovered && <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" initial={{ opacity:0 }} animate={{ opacity:1 }}><span className="text-[10px] tracking-[0.15em] uppercase" style={{ color:'rgba(200,192,184,0.35)' }}>VIEW</span></motion.div>}
              </motion.div>
            </div>

            {/* RIGHT: Info */}
            <motion.div key={active.slug} className="space-y-5" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>
              <div><p className="text-[28px] font-bold tracking-tight leading-tight" style={{ color:'#C8C0B8' }}>{active.title}</p><p className="text-[10px] tracking-[0.06em] uppercase mt-1" style={{ color:'rgba(200,192,184,0.28)' }}>{active.titleEn} · {active.year}</p></div>
              <div><p className="text-[9px] font-medium tracking-[0.12em] uppercase mb-1" style={{ color:'rgba(200,192,184,0.35)' }}>Category</p><p className="text-[12px]" style={{ color:'rgba(200,192,184,0.6)' }}>{active.category}</p></div>
              <div><p className="text-[9px] font-medium tracking-[0.12em] uppercase mb-1" style={{ color:'rgba(200,192,184,0.35)' }}>Role</p><p className="text-[12px] leading-relaxed" style={{ color:'rgba(200,192,184,0.55)' }}>{active.role}</p></div>
              <p className="text-[12px] leading-relaxed" style={{ color:'rgba(200,192,184,0.45)' }}>{active.summary}</p>
              <div className="pt-2 space-y-2">
                {active.slug === 'unarmored' ? (
                  <>
                    <p className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color:'rgba(184,147,110,0.45)' }}>SIGNATURE EXPERIENCE</p>
                    <Link to="/project/unarmored" className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors duration-300"
                      style={{ color:'#B8936E' }}>
                      ENTER BOOK EXPERIENCE
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                    </Link>
                    <br/>
                    <button onClick={()=>setViewerOpen(true)} className="text-[10px] tracking-[0.08em] transition-colors duration-300"
                      style={{ color:'rgba(200,192,184,0.28)' }}>
                      沉浸式书册放映 · 查看项目 →
                    </button>
                  </>
                ) : active.slug === 'midnight-elevator' ? (
                  <>
                    <p className="text-[9px] font-medium tracking-[0.12em] uppercase" style={{ color:'rgba(184,147,110,0.45)' }}>INTERACTIVE NARRATIVE</p>
                    <Link to="/project/midnight-elevator?mode=interactive" className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors duration-300"
                      style={{ color:'#B8936E' }}>
                      PLAY INTERACTIVE STORY
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </Link>
                    <br/>
                    <button onClick={()=>setViewerOpen(true)} className="text-[10px] tracking-[0.08em] transition-colors duration-300"
                      style={{ color:'rgba(200,192,184,0.28)' }}>
                      A/B分支互动剧情 · 查看项目 →
                    </button>
                  </>
                ) : (
                  <button onClick={()=>setViewerOpen(true)} className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] uppercase transition-colors duration-300"
                    style={{ color:'#B8936E' }}>
                    VIEW PROJECT
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* MOBILE */}
          <div className="lg:hidden space-y-8">
            <motion.div className="relative overflow-hidden rounded-[4px] aspect-[16/10] cursor-pointer" style={{ backgroundColor:'rgba(200,192,184,0.02)' }} onClick={()=>setViewerOpen(true)}>
              <motion.img key={active.slug} src={publicAsset(active.cover)} alt={active.title} className="absolute inset-0 w-full h-full" style={{ objectFit:'cover', objectPosition:active.objectPosition, filter:active.cssFilter }} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.35 }} />
              <div className="absolute top-3 left-3"><p className="text-[10px] tracking-[0.1em]" style={{ color:'rgba(200,192,184,0.25)' }}>{active.num}</p></div>
            </motion.div>
            <div className="space-y-3"><p className="text-2xl font-bold" style={{ color:'#C8C0B8' }}>{active.title}</p><p className="text-[11px]" style={{ color:'rgba(200,192,184,0.35)' }}>{active.titleEn} · {active.year} · {active.category}</p><p className="text-[12px] leading-relaxed" style={{ color:'rgba(200,192,184,0.4)' }}>{active.role}</p></div>
            <div className="flex gap-2 overflow-x-auto py-2" style={{ scrollbarWidth:'none', scrollSnapType:'x mandatory' }}>
              {entries.map((e,i)=>(
                <button key={e.slug} type="button" className="flex-shrink-0 px-4 py-2.5 rounded-full border transition-all duration-300" style={{ minWidth:44, minHeight:44, borderColor:i===activeIdx?'rgba(184,147,110,0.4)':'rgba(200,192,184,0.06)', color:i===activeIdx?'#B8936E':'rgba(200,192,184,0.4)', backgroundColor:i===activeIdx?'rgba(184,147,110,0.06)':'transparent' }} onClick={()=>setActiveIdx(i)}><span className="text-[12px] font-medium">{e.num} {e.title}</span></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Viewer */}
      <CinematicProjectViewer projects={entries} activeIndex={activeIdx} open={viewerOpen} onClose={()=>setViewerOpen(false)} onPrev={handlePrev} onNext={handleNext} />
    </>
  )
}
