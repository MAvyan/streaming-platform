import { Legend, type LegendEntry } from '../molecules/Legend'
import { fullNumber } from '../../lib/format'

export type DonutDatum = { label: string; value: number; color: string }

const SIZE = 180
const R = 70
const STROKE = 26
const CIRC = 2 * Math.PI * R
const GAP = 3

const totalStyle = { fill: 'var(--color-ink)', fontSize: 30, fontWeight: 700 }
const captionStyle = { fill: 'var(--color-muted)', fontSize: 12 }

export function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0

  const legend: LegendEntry[] = data.map((d) => ({
    label: d.label,
    color: d.color,
    value: `${Math.round((d.value / total) * 100)}%`,
  }))

  return (
    <div className="flex flex-wrap items-center gap-8">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-[180px] w-[180px] shrink-0" role="img" aria-label="Répartition des abonnés par offre">
        <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
          {data.map((d) => {
            const len = (d.value / total) * CIRC
            const seg = (
              <circle
                key={d.label}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={d.color}
                strokeWidth={STROKE}
                strokeDasharray={`${Math.max(len - GAP, 0)} ${CIRC - Math.max(len - GAP, 0)}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return seg
          })}
        </g>
        <text x="50%" y="46%" textAnchor="middle" className="tabular-nums" style={totalStyle}>
          {fullNumber(total)}
        </text>
        <text x="50%" y="58%" textAnchor="middle" style={captionStyle}>
          abonnés
        </text>
      </svg>
      <div className="min-w-[140px] flex-1">
        <Legend entries={legend} />
      </div>
    </div>
  )
}
