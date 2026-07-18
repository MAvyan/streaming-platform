import type { Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { Icon } from '../atoms/Icon'
import './Hero.css'

type Props = {
  video: Video
  onPlay: (video: Video) => void
  onInfo: (video: Video) => void
}

export function Hero({ video, onPlay, onInfo }: Props) {
  return (
    <section className="hero">
      {video.backdropUrl && (
        <img src={video.backdropUrl} alt="" className="hero__bg" />
      )}
      <div className="hero__scrim" />
      <div className="hero__content">
        <Badge variant="accent">À la une</Badge>
        <h1 className="hero__title">{video.title}</h1>
        <div className="hero__meta">
          <span>{video.releaseYear}</span>
          <Badge>{video.maturity}</Badge>
          <span>{video.category}</span>
        </div>
        <p className="hero__desc">{video.description}</p>
        <div className="hero__actions">
          <Button variant="primary" onClick={() => onPlay(video)}>
            <Icon name="play" size={22} /> Lecture
          </Button>
          <Button variant="secondary" onClick={() => onInfo(video)}>
            <Icon name="info" size={22} /> Plus d'infos
          </Button>
        </div>
      </div>
    </section>
  )
}
