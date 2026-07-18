import { Icon, type IconName } from '../atoms/Icon'
import { Badge } from '../atoms/Badge'
import './KpiCard.css'

type Props = {
  label: string
  value: string
  icon: IconName
  delta?: number
}

export function KpiCard({ label, value, icon, delta }: Props) {
  const positive = (delta ?? 0) >= 0
  return (
    <article className="kpi">
      <div className="kpi__head">
        <span className="kpi__icon">
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
      <div className="kpi__value">{value}</div>
      <div className="kpi__label">{label}</div>
    </article>
  )
}
