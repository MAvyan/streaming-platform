import type { ReactNode } from 'react'
import './ChartCard.css'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, action, children, className = '' }: Props) {
  return (
    <section className={`chart-card ${className}`}>
      <header className="chart-card__head">
        <div>
          <h2 className="chart-card__title">{title}</h2>
          {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="chart-card__body">{children}</div>
    </section>
  )
}
