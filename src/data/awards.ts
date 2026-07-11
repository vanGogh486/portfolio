/**
 * 比赛与荣誉数据
 */

export interface Award {
  title: string
  level?: string
  year: string
}

export const awards: Award[] = [
  {
    title: '全国大学生数字媒体科技作品及创意竞赛',
    level: '一等奖（国家级）',
    year: '2025',
  },
  {
    title: '3D精英赛',
    level: '全国一等奖',
    year: '2026',
  },
  {
    title: '全国大学生广告艺术大赛',
    level: '获奖（国家级）',
    year: '2025',
  },
  {
    title: '东方设计奖全国高校创新设计大赛',
    level: '获奖',
    year: '2025',
  },
]
