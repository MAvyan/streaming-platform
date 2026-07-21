import { useEffect, useRef, useState } from 'react'
import type { TimePoint } from '../../lib/api'
import { shortDate, fullNumber, compact } from '../../lib/format'

const PAD = { top: 20, right: 62, bottom: 24, left: 46 }

function niceMax(value: number): number {
  const step = Math.pow(10, Math.floor(Math.log10(value))) / 2
  return Math.ceil(value / step) * step
}

const tickStyle = {
  fill: 'var(--color-muted)',
  fontSize: 10,
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  letterSpacing: '0.04em',
}

export function LineChart({ data }: { data: TimePoint[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(900)

  // Le SVG est tracé à l'échelle 1:1 : les libellés gardent leur taille réelle
  // quelle que soit la largeur de l'écran.
  useEffect(() => {
    const el = box.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (data.length === 0) return null

  const W = Math.max(Math.round(width), 320)
  const H = W < 700 ? 190 : 230

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const maxY = niceMax(Math.max(...data.map((d) => d.views), 1))
  const avg = data.reduce((s, d) => s + d.views, 0) / data.length

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * plotW
  const y = (v: number) => PAD.top + (1 - v / maxY) * plotH

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.views)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z`

  const ticks = [0, 0.5, 1].map((t) => Math.round(maxY * t))
  const labelEvery = Math.ceil(data.length / 6)
  const last = data.length - 1
  const peak = data.reduce((best, d, i) => (d.views > data[best].views ? i : best), 0)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    const i = Math.max(0, Math.min(last, Math.round(frac * last)))
    setHover(i)
  }

  return (
    <div className="relative w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Visionnages par jour">
        <defs>
          <linearGradient id="trace-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-main)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--series-main)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--gridline)" strokeWidth={1} />
            <text x={PAD.left - 12} y={y(t)} dy="0.32em" textAnchor="end" style={tickStyle}>
              {compact(t)}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#trace-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--series-main)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Repère de moyenne : une référence, pas une série — d'où la couleur signal */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={y(avg)}
          y2={y(avg)}
          stroke="var(--reference)"
          strokeWidth={1}
          opacity={0.75}
        />
        <text
          x={W - PAD.right + 8}
          y={y(avg)}
          dy="0.32em"
          style={{ ...tickStyle, fill: 'var(--reference)' }}
        >
          moy. {compact(Math.round(avg))}
        </text>

        {/* Seul le pic est étiqueté : l'axe et le survol portent le reste */}
        <circle
          cx={x(peak)}
          cy={y(data[peak].views)}
          r={3.5}
          fill="var(--series-main)"
          stroke="var(--color-bg)"
          strokeWidth={2}
        />
        <text
          x={x(peak)}
          y={y(data[peak].views) - 12}
          textAnchor="middle"
          style={{ ...tickStyle, fill: 'var(--color-ink)', fontSize: 11 }}
        >
          {fullNumber(data[peak].views)}
        </text>

        {data.map((d, i) =>
          i % labelEvery === 0 ? (
            <text key={d.date} x={x(i)} y={H - 8} textAnchor="middle" style={tickStyle}>
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
              stroke="var(--color-line-strong)"
              strokeWidth={1}
            />
            <circle
              cx={x(hover)}
              cy={y(data[hover].views)}
              r={4.5}
              fill="var(--series-main)"
              stroke="var(--color-bg)"
              strokeWidth={2}
            />
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-[calc(100%+14px)] flex-col gap-1 whitespace-nowrap border border-line-strong bg-bg px-3 py-2 shadow-[0_4px_14px_rgba(18,27,38,0.14)]"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].views) / H) * 100}%` }}
        >
          <span className="eyebrow">{shortDate(data[hover].date)}</span>
          <span className="text-[13px] tabular-nums text-ink">
            {fullNumber(data[hover].views)} vues
          </span>
        </div>
      )}
    </div>
  )
}
