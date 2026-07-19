import { Icon, type IconName } from '../atoms/Icon'
import { Badge } from '../atoms/Badge'

type Props = {
  label: string
  value: string
  icon: IconName
  delta?: number
}

export function KpiCard({ label, value, icon, delta }: Props) {
  const positive = (delta ?? 0) >= 0
  return (
    <article className="flex flex-col gap-2 rounded-card border border-line bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-md bg-accent/15 text-accent">
          <Icon name={icon} size={18} />
        </span>
        {delta !== undefined && (
          <Badge tone={positive ? 'good' : 'critical'}>
            <Icon name={positive ? 'trend-up' : 'trend-down'} size={12} />
            {positive ? '+' : ''}
            {delta}%
          </Badge>
        )}
      </div>
      <div className="text-[2rem] font-bold leading-[1.1] tabular-nums">{value}</div>
      <div className="text-sm text-muted">{label}</div>
    </article>
  )
}
