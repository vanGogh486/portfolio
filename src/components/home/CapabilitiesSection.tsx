import { motion } from 'framer-motion'

const capabilities = [
  { id: '01', title: '内容策划与运营', desc: '选题策划、脚本撰写、用户反馈分析、数据复盘。从内容定位到发布运营的全流程实践。' },
  { id: '02', title: 'AIGC影像制作', desc: '视觉风格开发、分镜设计、Prompt工程、素材生成、剪辑包装。具备从创意到成片的完整制作能力。' },
  { id: '03', title: '互动体验设计', desc: '用户路径规划、分支叙事设计、UI信息层级、交互节点优化。关注选择体验与反馈机制。' },
  { id: '04', title: '项目执行与协作', desc: '需求拆解、进度跟进、素材归档管理、多部门协调。注重流程衔接与成果交付质量。' },
]

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="px-6 sm:px-8 lg:px-10 py-24 sm:py-32 bg-[#0C0C0C]">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/25 mb-4">Capabilities</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            能力领域
          </h2>
        </motion.div>

        <div className="space-y-px">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.id}
              className="flex flex-col sm:flex-row gap-3 sm:gap-8 py-6 sm:py-8 border-b border-white/[0.05]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <span className="text-[11px] font-bold tracking-[0.12em] text-white/20 w-8 flex-shrink-0">
                {cap.id}
              </span>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white/80 mb-1.5">{cap.title}</h3>
                <p className="text-[13px] sm:text-sm text-white/35 leading-relaxed max-w-xl">{cap.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
