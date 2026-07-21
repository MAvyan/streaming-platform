import type { CategoryStat } from '../../lib/api'
import { fullNumber } from '../../lib/format'

/** Une seule mesure sur des catégories nominales : une seule couleur, tri par valeur. */
export function BarChart({ data }: { data: CategoryStat[] }) {
  if (data.length === 0) return null

  const rows = [...data].sort((a, b) => b.views - a.views)
  const max = Math.max(...rows.map((d) => d.views), 1)

  return (
    <ul className="flex flex-col">
      {rows.map((d) => (
        <li
          key={d.category}
          title={`${d.category} : ${fullNumber(d.views)} visionnages`}
          className="group grid grid-cols-[minmax(80px,124px)_1fr_auto] items-center gap-4 py-2.5"
        >
          <span className="truncate text-[13px] text-secondary">{d.category}</span>
          <span
            className="h-3 w-full rounded-chip"
            style={{ background: 'var(--series-track)' }}
            aria-hidden="true"
          >
            <span
              className="block h-full rounded-chip transition-opacity group-hover:opacity-80"
              style={{ background: 'var(--series-main)', width: `${Math.max((d.views / max) * 100, 1)}%` }}
            />
          </span>
          <span className="w-[60px] text-right text-xs tabular-nums text-ink">
            {fullNumber(d.views)}
          </span>
        </li>
      ))}
    </ul>
  )
}
