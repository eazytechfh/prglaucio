interface BadgeProps {
  children: string
  variant?: 'green' | 'blue' | 'slate' | 'red'
}

const variants = {
  green: 'bg-emerald-100 text-emerald-700',
  blue:  'bg-primary-100 text-primary-700',
  slate: 'bg-slate-100 text-slate-600',
  red:   'bg-red-100 text-red-700',
}

export default function Badge({ children, variant = 'slate' }: BadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
