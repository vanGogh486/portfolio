import clsx from 'clsx'

interface CategoryBadgeProps {
  category: string
  active?: boolean
  onClick?: () => void
}

export default function CategoryBadge({ category, active = false, onClick }: CategoryBadgeProps) {
  const isButton = !!onClick

  const Component = isButton ? 'button' : 'span'

  return (
    <Component
      type={isButton ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all',
        active
          ? 'bg-accent text-white shadow-lg shadow-accent/25'
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white',
        isButton && 'cursor-pointer',
      )}
    >
      {category}
    </Component>
  )
}
