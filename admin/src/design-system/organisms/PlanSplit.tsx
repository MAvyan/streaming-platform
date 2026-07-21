import { Legend, type LegendEntry } from '../molecules/Legend'
import { fullNumber } from '../../lib/format'

export type PlanDatum = { label: string; value: number; color: string }

export function PlanSplit({ data }: { data: PlanDatum[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1

  const legend: LegendEntry[] = data.map((d) => ({
    label: d.label,
    color: d.color,
    value: fullNumber(d.value),
    note: `${Math.round((d.value / total) * 100)} %`,
  }))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] tabular-nums">
          {fullNumber(total)}
        </p>
        <p className="eyebrow mt-2">Abonnés actifs</p>
      </div>

      <div
        className="flex h-3 w-full gap-[2px] overflow-hidden"
        role="img"
        aria-label={`Répartition des abonnés : ${legend.map((e) => `${e.label} ${e.note}`).join(', ')}`}
      >
        {data.map((d) => (
          <span
            key={d.label}
            className="h-full rounded-chip"
            style={{ background: d.color, width: `${(d.value / total) * 100}%` }}
          />
        ))}
      </div>

      <Legend entries={legend} />
    </div>
  )
}
