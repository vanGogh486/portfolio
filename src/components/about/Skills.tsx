const skills = [
  { name: 'Stable Diffusion', level: 'Advanced' },
  { name: 'Deforum', level: 'Advanced' },
  { name: 'Runway Gen-3', level: 'Intermediate' },
  { name: 'Pika Labs', level: 'Intermediate' },
  { name: 'ComfyUI', level: 'Advanced' },
  { name: 'ControlNet', level: 'Advanced' },
  { name: 'DaVinci Resolve', level: 'Intermediate' },
  { name: 'After Effects', level: 'Basic' },
]

export default function Skills() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-white">Skills &amp; Tools</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-200">{skill.name}</span>
            <span className="text-xs text-slate-500">{skill.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
