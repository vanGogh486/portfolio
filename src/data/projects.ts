/**
 * 首页精选项目数据 — 仅4个真实项目
 */

export interface Project {
  slug: string
  title: string
  englishTitle: string
  year: string
  category: string
  role: string
  summary: string
  cover: string
  preview: string
  hoverVideo: string | null
  fullVideo: string | null
  gallery: string[]
  process?: string[]
  featured: boolean
  size: 'large' | 'medium' | 'wide'
  disclaimer: string
}

export const projects: Project[] = [
  {
    slug: 'unarmored',
    title: '《卸甲》',
    englishTitle: 'UNARMORED',
    year: '2026',
    category: 'AIGC叙事动画短片',
    role: '创意策划 / 视觉风格 / 分镜设计 / AIGC生成 / 剪辑包装',
    summary:
      '战争结束后，木兰回到故乡，却发现身体已经回家，记忆仍停留在战场。作品以冷灰水墨与克制叙事，讨论"如何带着伤口重新生活"。',
    cover: '/media/portfolio-v2/projects/unarmored/poster.png',
    preview: '/projects/unarmored/preview.mp4',
    hoverVideo: '/projects/unarmored/preview.mp4',
    fullVideo: '/projects/unarmored/full.mp4',
    gallery: [
      '/projects/unarmored/gallery/5s.jpg',
      '/projects/unarmored/gallery/25s.jpg',
      '/projects/unarmored/gallery/45s.jpg',
      '/projects/unarmored/gallery/105s.jpg',
      '/projects/unarmored/gallery/125s.jpg',
      '/projects/unarmored/gallery/145s.jpg',
    ],
    featured: true,
    size: 'large',
    disclaimer: '',
  },
  {
    slug: 'vivo-relic',
    title: '《终局圣物》',
    englishTitle: 'THE FINAL RELIC',
    year: '2026',
    category: 'AIGC产品概念片',
    role: '卖点拆解 / 内容策划 / 脚本分镜 / Prompt设计 / AIGC生成 / 剪辑复盘',
    summary:
      '将手机的防护、防水、续航与通信能力，转译成异世界Boss战中的关键生存能力，用短剧化叙事替代传统参数堆叠。',
    cover: '/media/portfolio-v2/projects/vivo/poster.png',
    preview: '/projects/vivo-relic/preview.mp4',
    hoverVideo: null,
    fullVideo: '/projects/vivo-relic/full.mp4',
    gallery: [
      '/projects/vivo-relic/gallery/5s.jpg',
      '/projects/vivo-relic/gallery/15s.jpg',
      '/projects/vivo-relic/gallery/25s.jpg',
      '/projects/vivo-relic/gallery/35s.jpg',
      '/projects/vivo-relic/gallery/45s.jpg',
      '/projects/vivo-relic/gallery/53s.jpg',
    ],
    featured: true,
    size: 'medium',
    disclaimer: '非vivo官方项目，为个人AIGC产品概念练习。',
  },
  {
    slug: 'sk2-concept',
    title: 'SK-II 神仙水 AIGC概念广告',
    englishTitle: 'SK-II CONCEPT FILM',
    year: '2026',
    category: 'AIGC商业视觉练习',
    role: '视觉定位 / 分镜设计 / Prompt设计 / 产品一致性控制 / 剪辑包装',
    summary:
      '以冷白银色、镜面水域、液体微距与极简产品英雄镜头，完成一支45秒高端护肤品概念TVC，重点验证产品还原和统一视觉控制。',
    cover: '/media/portfolio-v2/projects/sk2/poster.png',
    preview: '/projects/sk2-concept/preview.mp4',
    hoverVideo: null,
    fullVideo: '/projects/sk2-concept/full.mp4',
    gallery: [
      '/projects/sk2-concept/gallery/4s.jpg',
      '/projects/sk2-concept/gallery/10s.jpg',
      '/projects/sk2-concept/gallery/18s.jpg',
      '/projects/sk2-concept/gallery/26s.jpg',
      '/projects/sk2-concept/gallery/34s.jpg',
      '/projects/sk2-concept/gallery/42s.jpg',
    ],
    featured: true,
    size: 'medium',
    disclaimer: '非SK-II官方项目，为个人AIGC商业视觉练习。',
  },
  {
    slug: 'midnight-elevator',
    title: '《午夜电梯》',
    englishTitle: 'MIDNIGHT ELEVATOR',
    year: '2026',
    category: 'AIGC互动恐怖短片 Demo',
    role: '互动机制 / 文字脚本 / 用户路径 / UI信息层级 / 双分支制作',
    summary:
      '女主被困在不存在的B13层，观众必须在"开门救人"和"关门自保"之间选择。项目包含A/B分支、倒计时确认、QTE和下一轮互动钩子。',
    cover: '/media/portfolio-v2/projects/midnight-elevator/poster.png',
    preview: '/projects/midnight-elevator/preview.mp4',
    hoverVideo: null,
    fullVideo: '/projects/midnight-elevator/full.mp4',
    gallery: [
      '/projects/midnight-elevator/gallery/01_setup.jpg',
      '/projects/midnight-elevator/gallery/02_b13.jpg',
      '/projects/midnight-elevator/gallery/03_choice.jpg',
      '/projects/midnight-elevator/gallery/04_route_a.jpg',
      '/projects/midnight-elevator/gallery/05_route_b_qte.jpg',
      '/projects/midnight-elevator/gallery/06_route_b_result.jpg',
    ],
    featured: true,
    size: 'wide',
    disclaimer: '',
  },
]
