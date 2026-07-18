import type { Video } from '../../lib/api'
import { Icon } from '../atoms/Icon'
import { Badge } from '../atoms/Badge'
import { matchScore } from '../../lib/format'
import './VideoCard.css'

type Props = {
  video: Video
  onOpen: (video: Video) => void
}

export function VideoCard({ video, onOpen }: Props) {
  return (
    <button
      className="card"
      onClick={() => onOpen(video)}
      aria-label={`Ouvrir ${video.title}`}
    >
      <div className="card__art">
        {video.thumbnailUrl && (
          <img src={video.thumbnailUrl} alt="" loading="lazy" className="card__img" />
        )}
        <span className="card__play">
          <Icon name="play" size={20} />
        </span>
      </div>

      <div className="card__hover">
        <div className="card__title">{video.title}</div>
        <div className="card__meta">
          <span className="card__match">{matchScore(video.id)}%</span>
          <Badge>{video.maturity}</Badge>
          <span>{video.releaseYear}</span>
        </div>
        <div className="card__cat">{video.category}</div>
      </div>
    </button>
  )
}
