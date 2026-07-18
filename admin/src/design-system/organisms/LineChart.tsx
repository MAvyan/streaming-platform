import { useState } from 'react'
import type { TimePoint } from '../../lib/api'
import { shortDate, fullNumber } from '../../lib/format'
import './LineChart.css'

const W = 760
const H = 280
const PAD = { top: 16, right: 20, bottom: 30, left: 44 }

function niceMax(value: number): number {
  const step = Math.pow(10, Math.floor(Math.log10(value))) / 2
  return Math.ceil(value / step) * step
}

export function LineChart({ data }: { data: TimePoint[] }) {
  const [hover, setHover] = useState<number | null>(null)

  if (data.length === 0) return null

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const maxY = niceMax(Math.max(...data.map((d) => d.views), 1))

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * plotW
  const y = (v: number) => PAD.top + (1 - v / maxY) * plotH

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.views)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z`

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxY * t))
  const labelEvery = Math.ceil(data.length / 6)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    const i = Math.max(0, Math.min(data.length - 1, Math.round(frac * (data.length - 1))))
    setHover(i)
  }

  return (
    <div className="line" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="line__svg" role="img" aria-label="Visionnages par jour">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="line__grid"
            />
            <text x={PAD.left - 10} y={y(t)} dy="0.32em" className="line__ytick">
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#line-fill)" />
        <path d={line} className="line__path" />

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d.date} x={x(i)} y={H - 10} className="line__xtick">
              {shortDate(d.date)}
            </text>
          ) : null,
        )}

        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              className="line__crosshair"
            />
            <circle cx={x(hover)} cy={y(data[hover].views)} r="5" className="line__dot" />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="line__tooltip"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].views) / H) * 100}%` }}
        >
          <span className="line__tooltip-date">{shortDate(data[hover].date)}</span>
          <span className="line__tooltip-value">{fullNumber(data[hover].views)} vues</span>
        </div>
      )}
    </div>
  )
}
