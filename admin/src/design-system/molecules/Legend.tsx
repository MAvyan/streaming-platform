export type LegendEntry = { label: string; color: string; value?: string }

export function Legend({ entries }: { entries: LegendEntry[] }) {
  return (
    <ul className="flex flex-1 flex-col gap-3">
      {entries.map((e) => (
        <li key={e.label} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: e.color }} />
          <span className="text-secondary">{e.label}</span>
          {e.value && <span className="ml-auto font-semibold tabular-nums text-ink">{e.value}</span>}
        </li>
      ))}
    </ul>
  )
}
