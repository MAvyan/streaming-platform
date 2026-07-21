import type { TopVideo } from '../../lib/api'
import { Badge } from '../atoms/Badge'
import { fullNumber } from '../../lib/format'

export function TopVideosTable({ data }: { data: TopVideo[] }) {
  const max = Math.max(...data.map((d) => d.views), 1)

  const th = 'eyebrow border-b border-line px-3 pb-3 text-left whitespace-nowrap'
  const td = 'border-b border-line px-3 py-3'

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm [&>tbody>tr:last-child>td]:border-b-0">
        <thead>
          <tr>
            <th className={`${th} w-8`}>Rang</th>
            <th className={`${th} w-full`}>Titre</th>
            <th className={th}>Catégorie</th>
            <th className={`${th} text-right`}>Visionnages</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={v.videoId} className="transition-colors hover:bg-panel">
              <td className={`${td} text-xs tabular-nums text-muted`}>
                {String(i + 1).padStart(2, '0')}
              </td>
              <td className={`${td} font-medium text-ink`}>{v.title}</td>
              <td className={td}>
                <Badge>{v.category}</Badge>
              </td>
              <td className={`${td} text-right`}>
                <div className="flex items-center justify-end gap-4">
                  <span
                    className="h-[3px] w-[120px] shrink-0 rounded-chip max-[700px]:hidden"
                    style={{ background: 'var(--series-track)' }}
                    aria-hidden="true"
                  >
                    <span
                      className="block h-full rounded-chip bg-accent"
                      style={{ width: `${Math.max((v.views / max) * 100, 2)}%` }}
                    />
                  </span>
                  <span className="text-[12.5px] tabular-nums">{fullNumber(v.views)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
