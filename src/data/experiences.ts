/**
 * 实践经历数据
 */

export interface Experience {
  id: string
  title: string
  organization?: string
  period: string
  platforms?: string[]
  category: string
  summary: string
  highlights: string[]
  dataPoints: { label: string; value: string }[]
  details: string[]
}

export const experiences: Experience[] = [
  {
    id: 'self-media',
    title: '个人自媒体运营',
    period: '2024—2026',
    platforms: ['抖音', '小红书'],
    category: '内容运营',
    summary:
      '独立运营4个自媒体账号，覆盖美食和旅游赛道，累计发布50+条原创视频，完成从账号定位、选题策划到数据复盘的全流程运营。',
    highlights: [
      '独立完成账号定位、竞品观察、选题策划、脚本制作、发布运营、评论反馈整理和数据复盘',
      '基于用户反馈和内容数据持续迭代选题方向和拍摄风格',
      '同时运营多赛道账号，保持差异化的内容策略和视觉风格',
    ],
    dataPoints: [
      { label: '运营账号', value: '4个' },
      { label: '原创视频', value: '50+条' },
      { label: '全平台总曝光', value: '18万+' },
      { label: '抖音单条最高播放', value: '10.2万' },
      { label: '小红书累计涨粉', value: '600+' },
      { label: '抖音累计涨粉', value: '1200+' },
    ],
    details: [
      '负责账号从0到1的全流程，包括账号定位、内容规划、脚本撰写、拍摄剪辑、封面设计、标题文案和发布排期',
      '定期整理竞品爆款内容，分析选题方向和用户偏好，筛选热门话题与内容切入点',
      '持续追踪后台数据（播放量、完播率、互动率、粉丝增长），复盘每期内容效果并调整下期选题和剪辑节奏',
      '通过评论区和私信收集用户反馈，优化内容细节和发布策略',
    ],
  },
  {
    id: 'sirui-film',
    title: '上海思睿公司影视制作实践',
    organization: '上海思睿',
    period: '2025',
    category: '影视制作',
    summary:
      '参与企业宣传片制作流程，完成近千条影视素材的整理归档和3条企业宣传短片的协助制作。',
    highlights: [
      '完成近千条影视素材的分类归档、信息核对和质量初检',
      '协助完成3条企业宣传短片',
      '参与粗剪、字幕包装、基础调色和修改跟进',
    ],
    dataPoints: [
      { label: '素材整理', value: '近千条' },
      { label: '协助完成', value: '3条企业宣传片' },
    ],
    details: [
      '对近千条影视素材进行分类归档，建立统一的命名和标签体系，核对素材信息并完成质量初检',
      '协助完成3条企业宣传短片，参与粗剪、字幕包装、基础调色和修改跟进',
      '在实践中熟悉影视后期制作流程和客户修改反馈流程',
    ],
  },
]

export const campusExperience = {
  id: 'campus',
  title: '大连东软信息学院学生会',
  role: '副会长',
  period: '2024.09—2026.06',
  summary:
    '协同策划和执行3场校级大型活动，参与方案制定、流程排期、人员分工和现场统筹，协调宣传、舞台、后勤等多个部门，处理现场流程衔接和突发事项。',
  highlights: [
    '协同策划和执行3场校级大型活动',
    '参与方案制定、流程排期、人员分工和现场统筹',
    '协调宣传、舞台、后勤等多个部门',
    '处理现场流程衔接和突发事项',
  ],
}
