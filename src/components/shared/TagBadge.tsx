import clsx from 'clsx'

interface TagBadgeProps {
  tag: string
  active?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export default function TagBadge({ tag, active = false, onClick, size = 'sm' }: TagBadgeProps) {
  const isButton = !!onClick

  const Component = isButton ? 'button' : 'span'

  return (
    <Component
      type={isButton ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-full font-medium transition-all',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        active
          ? 'bg-accent text-white'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200',
        isButton && 'cursor-pointer',
      )}
    >
      {tag}
    </Component>
  )
}
