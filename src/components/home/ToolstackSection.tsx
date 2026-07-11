import { motion } from 'framer-motion'

const groups = [
  {
    title: 'AIGC视觉与视频',
    desc: '用于人物与场景设定、关键帧生成、图生视频和风格一致性控制。',
    tools: ['即梦', '可灵', 'ComfyUI', 'Midjourney', 'Stable Diffusion'],
  },
  {
    title: '视频制作与包装',
    desc: '用于镜头组织、节奏控制、字幕包装和成片输出。',
    tools: ['剪映', 'CapCut', 'Premiere Pro', 'After Effects'],
  },
  {
    title: '策划与内容制作',
    desc: '用于选题策划、脚本撰写、分镜设计和项目复盘。',
    tools: ['脚本撰写', '分镜设计', '内容策划', '项目复盘', '视觉设定'],
  },
  {
    title: 'AI协作与开发',
    desc: '用于提升创作效率与协作能力。',
    tools: ['Claude Code', 'GitHub', 'Photoshop'],
  },
]

export default function ToolstackSection() {
  return (
    <section className="px-6 sm:px-10 lg:px-14 py-20 sm:py-28 bg-[#0C0C0C]">
      <div className="mx-auto max-w-5xl">
        <motion.div className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[10px] font-medium tracking-[0.25em] uppercase mb-2" style={{ color: 'rgba(200,192,184,0.18)' }}>Toolstack</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#C8C0B8' }}>工具与能力</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 gap-10 sm:gap-14">
          {groups.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'rgba(200,192,184,0.7)' }}>{g.title}</p>
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: 'rgba(200,192,184,0.35)' }}>{g.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.tools.map(t => (
                  <span key={t} className="text-[11px] px-2.5 py-1 rounded-md border" style={{ borderColor: 'rgba(200,192,184,0.06)', color: 'rgba(200,192,184,0.4)', backgroundColor: 'rgba(200,192,184,0.015)' }}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
