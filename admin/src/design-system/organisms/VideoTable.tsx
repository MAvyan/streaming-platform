import type { Video } from '../../lib/api'
import { Badge } from '../atoms/Badge'
import { duration } from '../../lib/format'

type Props = {
  videos: Video[]
  onEdit: (video: Video) => void
  onDelete: (video: Video) => void
}

const MATURITY_LABEL: Record<string, string> = {
  TP: 'Tous publics',
  '-10': 'Moins de 10 ans',
  '-12': 'Moins de 12 ans',
  '-16': 'Moins de 16 ans',
  '-18': 'Moins de 18 ans',
}

export function VideoTable({ videos, onEdit, onDelete }: Props) {
  const th = 'eyebrow border-b border-line px-3 pb-3 text-left whitespace-nowrap'
  const td = 'border-b border-line px-3 py-3 align-middle'

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm [&>tbody>tr:last-child>td]:border-b-0">
        <thead>
          <tr>
            <th className={`${th} w-full`}>Titre</th>
            <th className={th}>Catégorie</th>
            <th className={`${th} text-right`}>Durée</th>
            <th className={`${th} text-right`}>Année</th>
            <th className={th}>Public</th>
            <th className={`${th} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v) => (
            <tr key={v.id} className="group transition-colors hover:bg-panel">
              <td className={`${td} font-medium text-ink`}>{v.title}</td>
              <td className={td}>
                <Badge>{v.category}</Badge>
              </td>
              <td className={`${td} whitespace-nowrap text-right tabular-nums text-secondary`}>
                {duration(v.durationSec)}
              </td>
              <td className={`${td} text-right tabular-nums text-secondary`}>{v.releaseYear}</td>
              <td className={`${td} whitespace-nowrap text-secondary`}>
                {MATURITY_LABEL[v.maturity] ?? v.maturity}
              </td>
              <td className={`${td} text-right`}>
                <div className="flex justify-end gap-3 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(v)}
                    aria-label={`Modifier ${v.title}`}
                    className="cursor-pointer border-0 bg-transparent text-[12.5px] font-medium text-accent hover:text-accent-ink"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => onDelete(v)}
                    aria-label={`Supprimer ${v.title}`}
                    className="cursor-pointer border-0 bg-transparent text-[12.5px] font-medium text-muted hover:text-critical"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
