/**
 * Archive / More Works — additional projects beyond the 4 selected works
 */
export interface ArchiveProject {
  slug: string
  title: string
  titleEn: string
  category: string
  year: string
  role: string
  summary: string
  cover: string
  fullVideo: string
  aspectRatio: '16:9' | '9:16'
  disclaimer: string
}

export const archiveProjects: ArchiveProject[] = [
  {
    slug: 'ysl-lipstick',
    title: 'YSL 小金条 #21',
    titleEn: 'YSL ROUGE PUR COUTURE #21',
    category: '美妆商业视觉 / AIGC概念广告',
    year: '2026',
    role: '创意方向 / 产品视觉设计 / 分镜 / AIGC画面生成 / 产品一致性控制 / 视频动态化 / 剪辑包装',
    summary: '以YSL小金条#21为产品主体的AIGC概念广告。聚焦口红产品的高端质感与视觉呈现，验证AI在美妆产品商业视觉中的应用能力。',
    cover: '/projects/ysl-lipstick/cover.jpg',
    fullVideo: '/projects/ysl-lipstick/full.mp4',
    aspectRatio: '16:9',
    disclaimer: '个人概念作品 / 非品牌官方合作',
  },
  {
    slug: 'echocalypse-lilith',
    title: '《绯色回响》莉莉丝生日邀请',
    titleEn: 'ECHOCALYPSE · LILITH INVITATION',
    category: '二次元互动视觉 / AIGC概念短片',
    year: '2026',
    role: '内容策划 / 角色视觉 / 邀请函UI / 分镜与节奏 / AIGC画面生成 / 视频动态化 / 剪辑包装',
    summary: '以《绯色回响》角色莉莉丝为主体的生日邀请互动概念短片。采用竖屏9:16格式，融入游戏角色视觉与邀请函UI设计。',
    cover: '/projects/echocalypse-lilith/cover.jpg',
    fullVideo: '/projects/echocalypse-lilith/full.mp4',
    aspectRatio: '9:16',
    disclaimer: '个人概念作品 / 非官方内容创作',
  },
]
