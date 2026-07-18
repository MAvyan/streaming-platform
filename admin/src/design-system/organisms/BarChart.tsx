import type { CategoryStat } from '../../lib/api'
import { fullNumber } from '../../lib/format'
import './BarChart.css'

const SERIES = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
]

const W = 560
const ROW_H = 44
const BAR_H = 22
const LABEL_W = 120
const VALUE_W = 52

export function BarChart({ data }: { data: CategoryStat[] }) {
  if (data.length === 0) return null

  const max = Math.max(...data.map((d) => d.views), 1)
  const trackW = W - LABEL_W - VALUE_W
  const H = data.length * ROW_H

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="bar" role="img" aria-label="Visionnages par catégorie">
      {data.map((d, i) => {
        const y = i * ROW_H + (ROW_H - BAR_H) / 2
        const w = Math.max(2, (d.views / max) * trackW)
        return (
          <g key={d.category} className="bar__row">
            <title>{`${d.category} : ${fullNumber(d.views)} visionnages`}</title>
            <text x="0" y={i * ROW_H + ROW_H / 2} dy="0.32em" className="bar__label">
              {d.category}
            </text>
            <rect
              x={LABEL_W}
              y={y}
              width={trackW}
              height={BAR_H}
              rx="4"
              className="bar__track"
            />
            <rect
              x={LABEL_W}
              y={y}
              width={w}
              height={BAR_H}
              rx="4"
              fill={SERIES[i % SERIES.length]}
            />
            <text x={W} y={i * ROW_H + ROW_H / 2} dy="0.32em" className="bar__value">
              {fullNumber(d.views)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
