import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useWorkBySlug } from '@/hooks/useWorkBySlug'
import { allWorks } from '@/data/works'
import SEOHead from '@/components/shared/SEOHead'
import ErrorBoundary from '@/components/shared/ErrorBoundary'
import NotFound from '@/components/shared/NotFound'
import MidnightElevatorInteractive from '@/components/detail/MidnightElevatorInteractive'
import CinematicBookPlayer from '@/components/detail/CinematicBookPlayer'

// Per-project detail content
const projectDetails: Record<string, {
  overview: { background: string; goal: string }
  contribution: string[]
  workflow: { step: string; detail: string }[]
  processImages: string[]
  disclaimer?: string
}> = {
  unarmored: {
    overview: {
      background: '《卸甲》是一部AIGC叙事动画短片，以花木兰战后归乡为背景，探讨"如何带着伤口重新生活"。作品采用冷灰水墨视觉风格，强调克制叙事与情绪表达。',
      goal: '通过AIGC工具完成从选题策划到成片输出的完整动画短片制作流程，验证人物一致性控制与古风叙事氛围的AI生成能力。',
    },
    contribution: [
      '负责从选题策划、故事结构、人物与场景视觉设定、分镜设计，到AI图像生成、视频动态化和后期剪辑的完整制作流程',
      '重点控制人物一致性、古风叙事氛围以及镜头之间的情绪衔接',
      '通过参考图、首尾帧和风格锁定，确保全片冷灰水墨视觉统一',
    ],
    workflow: [
      { step: '主题分析', detail: '花木兰战后归乡 — 讨论创伤与重新生活' },
      { step: '剧本与结构', detail: '确立三段式叙事：战场闪回→归乡独白→新生' },
      { step: '人物与场景设定', detail: '冷灰水墨风格，木兰、战马、雪原、故乡庭院' },
      { step: '分镜设计', detail: '参考黑白分镜图锁定镜头构图与人物位置' },
      { step: 'AI图像生成', detail: '逐帧生成关键帧，控制人物与场景一致性' },
      { step: '视频动态化', detail: '图生视频，低幅运镜，保持画面稳定' },
      { step: '剪辑与包装', detail: '情绪节奏剪辑，音效设计，成片输出' },
    ],
    processImages: [
      '/projects/unarmored/process/storyboard-01.png',
      '/projects/unarmored/process/storyboard-02.png',
      '/projects/unarmored/process/storyboard-03.png',
    ],
  },
  'vivo-relic': {
    overview: {
      background: '《终局圣物》是为vivo手机定制的AIGC产品概念片，将防护、防水、续航和通信四项核心卖点，转译成异世界Boss战中的关键生存能力。非vivo官方项目，为个人AIGC产品概念练习。',
      goal: '探索将产品功能参数转化为剧情叙事的方法，验证AIGC在产品广告制作中的可行性。',
    },
    contribution: [
      '根据产品卖点完成冰雪幻想世界观、广告脚本和镜头设计',
      '通过参考图、首尾帧和低幅运镜控制产品外观稳定',
      '独立完成57秒脚本、分镜、AI素材生成、视频动态化与剪辑包装',
      '输出4K成片与完整项目案例材料',
    ],
    workflow: [
      { step: '产品卖点拆解', detail: '围绕防护、防水、续航、通信4项核心卖点分析目标用户场景' },
      { step: '创意方向', detail: '设计"异世界Boss战"叙事框架，将产品功能融入剧情' },
      { step: '广告脚本', detail: '完成57秒完整脚本与分镜头设计' },
      { step: '产品视觉设定', detail: '参考产品图，确保手机外观在AI生成中保持一致' },
      { step: '镜头与图像生成', detail: '分镜图→AI关键帧→图生视频，控制运镜幅度' },
      { step: '剪辑包装', detail: '成片剪辑、音效设计、4K输出与项目复盘' },
    ],
    processImages: [
      '/projects/vivo-relic/process/storyboard.png',
    ],
    disclaimer: '非vivo官方项目，为个人AIGC产品概念练习。',
  },
  'sk2-concept': {
    overview: {
      background: 'SK-II神仙水AIGC概念广告是一支45秒高端护肤品概念TVC，以冷白银色、镜面水域、液体微距与极简产品英雄镜头为核心视觉元素。非SK-II官方项目，为个人AIGC商业视觉练习。',
      goal: '验证AI在产品级商业广告中的产品还原能力和统一视觉控制能力。',
    },
    contribution: [
      '负责视觉定位、分镜设计和Prompt工程',
      '重点控制产品瓶身与瓶盖的一致性，确保产品在不同镜头中保持可识别外观',
      '完成液体微距、镜面反射等高端护肤品类视觉元素的AI生成',
      '独立完成全片剪辑包装，统一冷白银色调',
    ],
    workflow: [
      { step: '视觉概念定位', detail: '确立冷白银色、镜面水域、液体微距的视觉方向' },
      { step: '分镜设计', detail: '产品英雄镜头→液体细节→镜面反射→产品收束' },
      { step: '产品一致性控制', detail: '通过参考图和Prompt锁定瓶身外观与材质' },
      { step: 'AI视觉生成', detail: '生成产品定格图与动态场景素材' },
      { step: '剪辑与包装', detail: '45秒成片输出，统一色调与节奏' },
    ],
    processImages: [
      '/projects/sk2-concept/process/product-reference.png',
      '/projects/sk2-concept/process/storyboard-01.png',
      '/projects/sk2-concept/process/storyboard-02.png',
    ],
    disclaimer: '非SK-II官方项目，为个人AIGC商业视觉练习。',
  },
  'midnight-elevator': {
    overview: {
      background: '《午夜电梯》是一个AIGC互动恐怖短片Demo，女主被困在不存在的B13层，观众必须在"开门救人"和"关门自保"之间做出选择。项目包含A/B分支、倒计时确认、QTE操作和双分支结局。',
      goal: '探索互动叙事在短视频中的应用，设计用户选择机制与多分支内容制作流程。',
    },
    contribution: [
      '设计互动叙事结构，包括公共剧情、A/B选择节点、倒计时与QTE机制',
      '完成文字脚本撰写与用户路径规划',
      '制作双分支视频内容，包括Route A与Route B的完整视觉素材',
      '通过多轮测试优化选择停留时间、提示清晰度和剧情节奏',
    ],
    workflow: [
      { step: '互动结构设计', detail: '公共剧情→A/B选择→倒计时确认→QTE操作→双分支结局' },
      { step: '文字脚本', detail: '撰写完整剧本与用户路径文档' },
      { step: '视觉设定', detail: '竖屏恐怖氛围，电梯场景与UI交互界面' },
      { step: 'AI素材生成', detail: '生成场景、角色与UI元素的视觉素材' },
      { step: '双分支制作', detail: '同时制作Route A和Route B两套内容' },
      { step: '测试与优化', detail: '多轮用户测试，优化选择时间与提示设计' },
    ],
    processImages: [],
  },
}

export default function WorkDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const work = useWorkBySlug(slug ?? '')
  const detail = slug ? projectDetails[slug] : undefined
  const [interactiveOpen, setInteractiveOpen] = useState(false)
  const [bookPlayerOpen, setBookPlayerOpen] = useState(false)

  if (!work || !detail) {
    return <NotFound message="项目未找到" />
  }

  // Find prev/next projects
  const idx = allWorks.findIndex((w: { slug: string }) => w.slug === slug)
  const prev = idx > 0 ? allWorks[idx - 1] : null
  const next = idx < allWorks.length - 1 ? allWorks[idx + 1] : null

  return (
    <>
      <SEOHead title={work.title} description={work.description} ogImage={work.thumbnail} ogType="video.other" />

      <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-10 py-12 lg:py-16 bg-[#0C0C0C] min-h-screen">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] font-medium transition-colors mb-10" style={{ color: 'rgba(200,192,184,0.3)' }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7"/></svg>
          返回作品集
        </Link>

        {/* 01 PROJECT HERO */}
        <section className="mb-16">
          <p className="text-[10px] font-medium tracking-[0.15em] uppercase mb-4" style={{ color: 'rgba(200,192,184,0.2)' }}>{work.category}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3" style={{ color: '#C8C0B8' }}>{work.title}</h1>
          <p className="text-sm mb-2" style={{ color: 'rgba(200,192,184,0.4)' }}>{work.description}</p>
          <div className="flex items-center gap-4 mt-4 text-[12px]" style={{ color: 'rgba(200,192,184,0.3)' }}>
            <span>{work.date}</span>
            <span>·</span>
            <span>{work.category}</span>
          </div>
          {detail.disclaimer && (
            <p className="mt-3 text-[11px] italic" style={{ color: 'rgba(200,192,184,0.18)' }}>{detail.disclaimer}</p>
          )}
        </section>

        {/* 02 PROJECT OVERVIEW */}
        <section className="mb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-6 pb-4" style={{ color: '#C8C0B8', borderBottom: '1px solid rgba(200,192,184,0.06)' }}>项目概述</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(200,192,184,0.25)' }}>项目背景</p>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.5)' }}>{detail.overview.background}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-2" style={{ color: 'rgba(200,192,184,0.25)' }}>创作目标</p>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.5)' }}>{detail.overview.goal}</p>
            </div>
          </div>
        </section>

        {/* 03 MY CONTRIBUTION */}
        <section className="mb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-6 pb-4" style={{ color: '#C8C0B8', borderBottom: '1px solid rgba(200,192,184,0.06)' }}>
            MY CONTRIBUTION · 我的贡献
          </h2>
          <ul className="space-y-3">
            {detail.contribution.map((c, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.5)' }}>
                <span className="flex-shrink-0 mt-0.5" style={{ color: '#B8936E' }}>—</span>
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* 04 CINEMATIC BOOK PLAYER — unarmored only */}
        {slug === 'unarmored' && (
          <section className="mb-10">
            <button onClick={() => setBookPlayerOpen(true)}
              className="inline-flex items-center gap-3 rounded-full border px-7 py-3.5 text-[14px] font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: 'rgba(184,147,110,0.35)', color: '#B8936E', backgroundColor: 'rgba(184,147,110,0.05)' }}>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              播放作品
            </button>
          </section>
        )}

        {/* 05 INTERACTIVE MODE — midnight-elevator only */}
        {slug === 'midnight-elevator' && (
          <section className="mb-10">
            <button onClick={() => setInteractiveOpen(true)}
              className="inline-flex items-center gap-3 rounded-full border px-7 py-3.5 text-[14px] font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: 'rgba(184,147,110,0.35)', color: '#B8936E', backgroundColor: 'rgba(184,147,110,0.05)' }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              进入互动模式
            </button>
            <p className="text-[11px] mt-3 ml-1" style={{ color: 'rgba(200,192,184,0.22)' }}>体验A/B分支叙事 · 做出你的选择</p>
          </section>
        )}

        {/* 05 FULL VIDEO */}
        {work.fullVideo && (
          <section className="mb-16">
            <h2 className="text-lg sm:text-xl font-bold mb-6 pb-4" style={{ color: '#C8C0B8', borderBottom: '1px solid rgba(200,192,184,0.06)' }}>{slug === 'midnight-elevator' ? '观看线性完整版' : '完整作品'}</h2>
            <div className="rounded-xl overflow-hidden bg-black border" style={{ borderColor: 'rgba(200,192,184,0.06)' }}>
              <video src={work.fullVideo} poster={work.thumbnail} className="w-full" controls playsInline preload="metadata" />
            </div>
          </section>
        )}

        {/* 05 WORKFLOW */}
        <section className="mb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-6 pb-4" style={{ color: '#C8C0B8', borderBottom: '1px solid rgba(200,192,184,0.06)' }}>
            WORKFLOW · 工作流程
          </h2>
          <div className="space-y-0">
            {detail.workflow.map((w, i) => (
              <div key={i} className="flex items-start gap-4 py-3" style={{ borderBottom: i < detail.workflow.length - 1 ? '1px solid rgba(200,192,184,0.04)' : 'none' }}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(184,147,110,0.1)' }}>
                  <span className="text-[10px] font-bold" style={{ color: '#B8936E' }}>{i + 1}</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium mb-0.5" style={{ color: 'rgba(200,192,184,0.6)' }}>{w.step}</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(200,192,184,0.35)' }}>{w.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PREV / NEXT */}
        <section className="flex justify-between items-center pt-10" style={{ borderTop: '1px solid rgba(200,192,184,0.05)' }}>
          {prev ? (
            <Link to={`/project/${prev.slug}`} className="text-[12px] font-medium transition-colors hover:text-[#B8936E]" style={{ color: 'rgba(200,192,184,0.35)' }}>
              ← {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/project/${next.slug}`} className="text-[12px] font-medium transition-colors hover:text-[#B8936E]" style={{ color: 'rgba(200,192,184,0.35)' }}>
              {next.title} →
            </Link>
          ) : <span />}
        </section>
      </div>

      {/* Midnight Elevator Interactive */}
      {slug === 'midnight-elevator' && (
        <MidnightElevatorInteractive open={interactiveOpen} onClose={() => setInteractiveOpen(false)} />
      )}

      {/* Unarmored Cinematic Book Player */}
      {slug === 'unarmored' && (
        <CinematicBookPlayer open={bookPlayerOpen} onClose={() => setBookPlayerOpen(false)} />
      )}
    </>
  )
}
