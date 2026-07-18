import './Legend.css'

export type LegendEntry = { label: string; color: string; value?: string }

export function Legend({ entries }: { entries: LegendEntry[] }) {
  return (
    <ul className="legend">
      {entries.map((e) => (
        <li key={e.label} className="legend__item">
          <span className="legend__swatch" style={{ background: e.color }} />
          <span className="legend__label">{e.label}</span>
          {e.value && <span className="legend__value">{e.value}</span>}
        </li>
      ))}
    </ul>
  )
}
