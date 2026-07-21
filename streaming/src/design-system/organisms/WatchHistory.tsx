import type { HistoryEntry } from '../../lib/api'
import { HistoryRow } from '../molecules/HistoryRow'

type Props = {
  entries: HistoryEntry[]
  onOpen: (videoId: string) => void
}

export function WatchHistory({ entries, onOpen }: Props) {
  if (entries.length === 0) {
    return (
      <p className="rounded-card bg-surface px-4 py-8 text-center text-sm text-muted">
        Aucun visionnage pour l'instant. Lancez un titre depuis l'accueil, il apparaîtra ici.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <HistoryRow key={entry.id} entry={entry} onOpen={onOpen} />
      ))}
    </ul>
  )
}
