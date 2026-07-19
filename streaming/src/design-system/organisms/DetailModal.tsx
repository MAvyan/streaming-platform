import { useEffect } from 'react'
import type { Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { Icon } from '../atoms/Icon'
import { Player } from './Player'
import { formatDuration, matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'

type Props = {
  video: Video
  playing: boolean
  onPlay: () => void
  onStop: () => void
  onClose: () => void
}

export function DetailModal({ video, playing, onPlay, onStop, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-4 py-12 max-sm:p-0"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="fixed inset-0 bg-black/75" onClick={onClose} />
      <div className="modal-pop relative w-[min(880px,100%)] overflow-hidden rounded-[12px] bg-surface shadow-2xl max-sm:rounded-none">
        <button
          className="absolute right-3 top-3 z-[4] flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-bg text-ink"
          onClick={onClose}
          aria-label="Fermer"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="relative aspect-video bg-black">
          {playing ? (
            <Player title={video.title} onExit={onStop} />
          ) : (
            <>
              <div className="relative h-full w-full overflow-hidden" style={{ background: genreTint(video.category) }}>
                <span className="absolute -top-[6%] right-[2%] text-[clamp(9rem,26vw,16rem)] font-bold leading-[0.8] text-ink/[0.08]" aria-hidden="true">
                  {monogram(video.title)}
                </span>
                {video.backdropUrl && (
                  <img src={video.backdropUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div className="modal-scrim absolute inset-0" />
              <div className="absolute inset-x-6 bottom-6 flex flex-col items-start gap-4 max-sm:inset-x-4">
                <h2 className="m-0 text-[clamp(1.5rem,4vw,2.5rem)] font-bold">{video.title}</h2>
                <Button variant="primary" onClick={onPlay}>
                  <Icon name="play" size={22} /> Lecture
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="p-6 max-sm:p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-[15px] text-muted">
            <span className="font-bold text-accent">{matchScore(video.id)}% pour vous</span>
            <span>{video.releaseYear}</span>
            <Badge>{video.maturity}</Badge>
            <span>{formatDuration(video.durationSec)}</span>
          </div>
          <p className="mb-4 text-base leading-relaxed">{video.description}</p>
          <div className="text-[15px] text-muted">
            <span className="text-dim">Catégorie :</span> {video.category}
          </div>
        </div>
      </div>
    </div>
  )
}
