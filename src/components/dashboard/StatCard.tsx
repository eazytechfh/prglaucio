interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  color?: 'indigo' | 'emerald' | 'amber' | 'rose'
}

const colors = {
  indigo: { bg: 'bg-primary-50', icon: 'bg-primary-100 text-primary-600', text: 'text-primary-700' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700' },
  rose: { bg: 'bg-rose-50', icon: 'bg-rose-100 text-rose-600', text: 'text-rose-700' },
}

export default function StatCard({ title, value, subtitle, icon, color = 'indigo' }: StatCardProps) {
  const c = colors[color]
  return (
    <div className={`rounded-2xl ${c.bg} border border-white/60 p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`mt-1 text-3xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`rounded-xl ${c.icon} p-3`}>{icon}</div>
      </div>
    </div>
  )
}
