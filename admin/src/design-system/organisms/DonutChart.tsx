import { Legend, type LegendEntry } from '../molecules/Legend'
import { fullNumber } from '../../lib/format'
import './DonutChart.css'

export type DonutDatum = { label: string; value: number; color: string }

const SIZE = 180
const R = 70
const STROKE = 26
const CIRC = 2 * Math.PI * R
const GAP = 3 // écart visuel entre segments (px sur la circonférence)

export function DonutChart({ data }: { data: DonutDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  let offset = 0

  const legend: LegendEntry[] = data.map((d) => ({
    label: d.label,
    color: d.color,
    value: `${Math.round((d.value / total) * 100)}%`,
  }))

  return (
    <div className="donut">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="donut__svg"
        role="img"
        aria-label="Répartition des abonnés par offre"
      >
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
        <text x="50%" y="46%" className="donut__total">
          {fullNumber(total)}
        </text>
        <text x="50%" y="58%" className="donut__caption">
          abonnés
        </text>
      </svg>
      <Legend entries={legend} />
    </div>
  )
}
