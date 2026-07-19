import { useEffect } from 'react'
import type { Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { Icon } from '../atoms/Icon'
import { Player } from './Player'
import { formatDuration, matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'
import './DetailModal.css'

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
    <div className="modal" role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Fermer">
          <Icon name="close" size={20} />
        </button>

        <div className="modal__hero">
          {playing ? (
            <Player title={video.title} onExit={onStop} />
          ) : (
            <>
              <div
                className="modal__art"
                style={{ background: genreTint(video.category) }}
              >
                <span className="modal__monogram" aria-hidden="true">
                  {monogram(video.title)}
                </span>
              </div>
              <div className="modal__hero-scrim" />
              <div className="modal__hero-body">
                <h2 className="modal__title">{video.title}</h2>
                <Button variant="primary" onClick={onPlay}>
                  <Icon name="play" size={22} /> Lecture
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="modal__info">
          <div className="modal__meta">
            <span className="modal__match">{matchScore(video.id)}% pour vous</span>
            <span>{video.releaseYear}</span>
            <Badge>{video.maturity}</Badge>
            <span>{formatDuration(video.durationSec)}</span>
          </div>
          <p className="modal__desc">{video.description}</p>
          <div className="modal__tags">
            <span className="modal__tags-label">Catégorie :</span> {video.category}
          </div>
        </div>
      </div>
    </div>
  )
}
