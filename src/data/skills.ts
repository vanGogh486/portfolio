/**
 * 能力与工具分组数据
 */

export interface SkillGroup {
  groupName: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    groupName: '内容与运营',
    items: ['内容运营', '数据复盘', '竞品观察', '用户反馈整理', '项目跟进'],
  },
  {
    groupName: '办公与信息处理',
    items: ['Office', 'Excel数据整理', 'PPT汇报', '文档归档'],
  },
  {
    groupName: '内容与制作工具',
    items: ['剪映', 'Premiere Pro', 'After Effects', 'Photoshop', 'AIGC工具'],
  },
]
