export type LegendEntry = { label: string; color: string; value?: string; note?: string }

export function Legend({ entries }: { entries: LegendEntry[] }) {
  return (
    <ul className="flex flex-col">
      {entries.map((e) => (
        <li key={e.label} className="flex items-center gap-2.5 border-b border-line py-2.5 text-sm last:border-b-0">
          <span className="h-2 w-2 shrink-0 rounded-chip" style={{ background: e.color }} />
          <span className="text-secondary">{e.label}</span>
          {e.value && <span className="ml-auto text-[13px] tabular-nums text-ink">{e.value}</span>}
          {e.note && <span className="eyebrow w-9 text-right">{e.note}</span>}
        </li>
      ))}
    </ul>
  )
}
