import type { Video } from '../../lib/api'
import { Icon } from '../atoms/Icon'
import { Badge } from '../atoms/Badge'
import { matchScore } from '../../lib/format'
import { genreTint, monogram } from '../../lib/genre'
import './VideoCard.css'

type Props = {
  video: Video
  onOpen: (video: Video) => void
  ratio?: 'poster' | 'wide'
}

export function VideoCard({ video, onOpen, ratio = 'poster' }: Props) {
  const image = ratio === 'wide' ? video.backdropUrl : video.thumbnailUrl

  return (
    <button
      className={`card card--${ratio}`}
      onClick={() => onOpen(video)}
      aria-label={`Ouvrir ${video.title}`}
    >
      <div className="card__art" style={{ background: genreTint(video.category) }}>
        <span className="card__monogram" aria-hidden="true">
          {monogram(video.title)}
        </span>
        {image && <img src={image} alt="" loading="lazy" className="card__img" />}
        <div className="card__scrim" />
        <div className="card__base">
          <span className="card__name">{video.title}</span>
          <span className="card__genre">{video.category}</span>
        </div>
        <span className="card__play">
          <Icon name="play" size={20} />
        </span>
      </div>

      <div className="card__hover">
        <div className="card__meta">
          <span className="card__match">{matchScore(video.id)}%</span>
          <Badge>{video.maturity}</Badge>
          <span>{video.releaseYear}</span>
        </div>
      </div>
    </button>
  )
}
