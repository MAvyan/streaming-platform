import type { CSSProperties } from 'react'
import type { Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Icon } from '../atoms/Icon'
import { formatDuration, matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'
import './Hero.css'

type Props = {
  video: Video
  onPlay: (video: Video) => void
  onInfo: (video: Video) => void
}

export function Hero({ video, onPlay, onInfo }: Props) {
  return (
    <section
      className="hero"
      style={{ '--hero-tint': genreTint(video.category) } as CSSProperties}
    >
      <span className="hero__monogram" aria-hidden="true">
        {monogram(video.title)}
      </span>
      <div className="hero__scrim" />
      <div className="hero__content">
        <span className="hero__eyebrow">Nouveau film Lumen</span>
        <h1 className="hero__title">{video.title}</h1>
        <div className="hero__meta">
          <span>{video.releaseYear}</span>
          <span className="hero__dot" />
          <span>{formatDuration(video.durationSec)}</span>
          <span className="hero__dot" />
          <span>{video.category}</span>
          <span className="hero__dot" />
          <span className="hero__rating">★ {(matchScore(video.id) / 20).toFixed(1)}</span>
        </div>
        <p className="hero__desc">{video.description}</p>
        <div className="hero__actions">
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
