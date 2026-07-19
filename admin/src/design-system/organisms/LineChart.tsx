import { useState } from 'react'
import type { TimePoint } from '../../lib/api'
import { shortDate, fullNumber } from '../../lib/format'

const W = 760
const H = 280
const PAD = { top: 16, right: 20, bottom: 30, left: 44 }

function niceMax(value: number): number {
  const step = Math.pow(10, Math.floor(Math.log10(value))) / 2
  return Math.ceil(value / step) * step
}

const tickStyle = { fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }

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
    <div className="relative w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label="Visionnages par jour">
        <defs>
          <linearGradient id="line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--series-1)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--gridline)" strokeWidth={1} />
            <text x={PAD.left - 10} y={y(t)} dy="0.32em" textAnchor="end" style={tickStyle}>
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#line-fill)" />
        <path d={line} fill="none" stroke="var(--series-1)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d.date} x={x(i)} y={H - 10} textAnchor="middle" style={tickStyle}>
              {shortDate(d.date)}
            </text>
          ) : null,
        )}

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke="var(--color-line-strong)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={x(hover)} cy={y(data[hover].views)} r="5" fill="var(--series-1)" stroke="var(--color-surface)" strokeWidth={2} />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-[calc(100%+12px)] flex-col gap-0.5 whitespace-nowrap rounded-md border border-line-strong bg-surface-3 px-3 py-2 shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].views) / H) * 100}%` }}
        >
          <span className="text-xs text-muted">{shortDate(data[hover].date)}</span>
          <span className="text-sm font-semibold tabular-nums">{fullNumber(data[hover].views)} vues</span>
        </div>
      )}
    </div>
  )
}
