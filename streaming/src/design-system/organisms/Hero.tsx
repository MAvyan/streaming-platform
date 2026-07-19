import type { Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { formatDuration, matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'

type Props = {
  video: Video
  onPlay: (video: Video) => void
  onInfo: (video: Video) => void
}

export function Hero({ video, onPlay, onInfo }: Props) {
  return (
    <section
      className="relative flex h-[min(82vh,760px)] items-end overflow-hidden px-[clamp(16px,4vw,60px)] pb-16 max-sm:h-[72vh]"
      style={{ background: `linear-gradient(135deg, ${genreTint(video.category)}, var(--color-bg) 78%)` }}
    >
      <span className="pointer-events-none absolute right-[4%] top-[4%] text-[clamp(16rem,40vw,34rem)] font-bold leading-[0.8] text-ink/[0.06]" aria-hidden="true">
        {monogram(video.title)}
      </span>
      {video.backdropUrl && (
        <img src={video.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_20%]" />
      )}
      <div className="hero-scrim absolute inset-0" />

      <div className="relative flex max-w-[640px] flex-col items-start gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Nouveau film Lumen
        </span>
        <h1 className="m-0 text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-none tracking-[-0.02em]">
          {video.title}
        </h1>
        <div className="flex items-center gap-3 text-[15px] text-muted">
          <span>{video.releaseYear}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-current opacity-60" />
          <span>{formatDuration(video.durationSec)}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-current opacity-60" />
          <span>{video.category}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-current opacity-60" />
          <span className="font-semibold text-accent">★ {(matchScore(video.id) / 20).toFixed(1)}</span>
        </div>
        <p className="line-clamp-3 max-w-[36rem] text-base leading-[1.55] text-ink max-sm:line-clamp-2 max-sm:text-[15px]">
          {video.description}
        </p>
        <div className="mt-2 flex gap-3">
          <Button variant="primary" onClick={() => onPlay(video)}>
            <Icon name="play" size={20} /> Lecture
          </Button>
          <Button variant="secondary" onClick={() => onInfo(video)}>
            <Icon name="info" size={20} /> Plus d'infos
          </Button>
        </div>
      </div>
    </section>
  )
}
