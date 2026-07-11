/**
 * 首页核心能力概览
 */

export interface Capability {
  title: string
  description: string
  iconLabel: string
}

export const coreCapabilities: Capability[] = [
  {
    title: '内容策划与运营',
    description:
      '具备账号定位、选题策划、脚本撰写和发布运营的全流程能力。善于从数据中发现问题，通过用户反馈驱动内容迭代优化。',
    iconLabel: '策划',
  },
  {
    title: 'AIGC与影视制作',
    description:
      '熟练使用剪映、Premiere Pro、After Effects等工具，具备AIGC内容生成和影视后期制作经验。能够独立完成从前期策划到成片输出的完整流程。',
    iconLabel: '制作',
  },
  {
    title: '产品与用户体验',
    description:
      '具备产品卖点拆解和用户场景分析能力，能够从目标用户视角出发设计内容方案和交互体验，关注用户路径和体验优化。',
    iconLabel: '产品',
  },
  {
    title: '项目协作与执行',
    description:
      '具备多部门协调和现场统筹经验，善于制定流程排期和人员分工。在实践中注重进度管理、流程衔接和问题解决。',
    iconLabel: '执行',
  },
]
