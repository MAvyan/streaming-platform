import type { HistoryEntry } from '../../lib/api'
import { formatDay, formatDuration, progress } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'

type Props = {
  entry: HistoryEntry
  onOpen: (videoId: string) => void
}

export function HistoryRow({ entry, onOpen }: Props) {
  const percent = progress(entry.watchedSec, entry.durationSec)
  const image = entry.backdropUrl ?? entry.thumbnailUrl

  return (
    <li>
      <button
        onClick={() => onOpen(entry.videoId)}
        aria-label={`Ouvrir ${entry.title}`}
        className="group flex w-full cursor-pointer items-center gap-4 rounded-card border-0 bg-surface p-3 text-left text-ink transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span
          className="relative flex aspect-video w-[124px] shrink-0 items-center justify-center overflow-hidden rounded"
          style={{ background: genreTint(entry.category) }}
        >
          <span className="text-2xl font-bold text-ink/30" aria-hidden="true">
            {monogram(entry.title)}
          </span>
          {image && (
            <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="truncate text-[15px] font-semibold">{entry.title}</span>
          <span className="text-xs text-dim">
            {entry.category} · {formatDuration(entry.durationSec)} · vu le {formatDay(entry.watchedAt)}
          </span>
          <span className="mt-1 block h-1 w-full max-w-[320px] overflow-hidden rounded bg-surface-3">
            <span className="block h-full rounded bg-accent" style={{ width: `${percent}%` }} />
          </span>
        </span>

        <span className="w-24 shrink-0 text-right text-xs text-muted max-[600px]:hidden">
          {entry.completed ? 'Terminé' : `${percent} % vu`}
        </span>
      </button>
    </li>
  )
}
