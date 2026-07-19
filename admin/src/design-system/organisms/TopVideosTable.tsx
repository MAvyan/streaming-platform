import type { TopVideo } from '../../lib/api'
import { fullNumber } from '../../lib/format'

export function TopVideosTable({ data }: { data: TopVideo[] }) {
  const max = Math.max(...data.map((d) => d.views), 1)

  const th = 'border-b border-line px-3 pb-3 text-left text-xs font-medium uppercase tracking-[0.04em] text-muted whitespace-nowrap'

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm [&>tbody>tr:last-child>td]:border-b-0">
        <thead>
          <tr>
            <th className={`${th} w-8`}>#</th>
            <th className={th}>Titre</th>
            <th className={th}>Catégorie</th>
            <th className={`${th} text-right`}>Visionnages</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={v.videoId}>
              <td className="border-b border-line p-3 tabular-nums text-muted">{i + 1}</td>
              <td className="border-b border-line p-3 font-medium text-ink">{v.title}</td>
              <td className="border-b border-line p-3">
                <span className="inline-block whitespace-nowrap rounded-full bg-surface-2 px-2 py-0.5 text-xs text-secondary">
                  {v.category}
                </span>
              </td>
              <td className="border-b border-line p-3 text-right tabular-nums">
                <div className="flex items-center justify-end gap-3">
                  <span className="h-1.5 min-w-1 rounded-[3px] bg-accent opacity-55" style={{ width: `${(v.views / max) * 100}%` }} />
                  <span>{fullNumber(v.views)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
