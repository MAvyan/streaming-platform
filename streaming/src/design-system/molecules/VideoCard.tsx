import type { Video } from '../../lib/api'
import { Icon } from '../atoms/Icon'
import { Badge } from '../atoms/Badge'
import { matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'

type Props = {
  video: Video
  onOpen: (video: Video) => void
  ratio?: 'poster' | 'wide'
}

export function VideoCard({ video, onOpen, ratio = 'poster' }: Props) {
  const image = ratio === 'wide' ? video.backdropUrl : video.thumbnailUrl

  return (
    <button
      onClick={() => onOpen(video)}
      aria-label={`Ouvrir ${video.title}`}
      className="group relative w-full shrink-0 rounded-card border-0 bg-transparent p-0 text-left text-ink cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent"
    >
      <div
        className={`relative flex flex-col justify-end overflow-hidden rounded-card p-3 ${
          ratio === 'wide' ? 'aspect-[16/9]' : 'aspect-[2/3]'
        }`}
        style={{ background: genreTint(video.category) }}
      >
        <span className="absolute left-3 top-2 text-[2.75rem] font-bold leading-none text-ink/30" aria-hidden="true">
          {monogram(video.title)}
        </span>
        {image && (
          <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="card-scrim absolute inset-0" />
        <div className="relative flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold leading-tight">{video.title}</span>
          <span className="text-xs text-muted">{video.category}</span>
        </div>
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-accent opacity-0 transition-opacity group-hover:opacity-100">
          <Icon name="play" size={20} />
        </span>
      </div>

      <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:max-h-10 group-hover:opacity-100">
        <div className="flex items-center gap-2 pt-2 text-xs text-muted">
          <span className="font-bold text-accent">{matchScore(video.id)}%</span>
          <Badge>{video.maturity}</Badge>
          <span>{video.releaseYear}</span>
        </div>
      </div>
    </button>
  )
}
