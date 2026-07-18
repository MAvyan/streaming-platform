import { useRef } from 'react'
import type { Video } from '../../lib/api'
import { VideoCard } from '../molecules/VideoCard'
import { Icon } from '../atoms/Icon'
import './Carousel.css'

type Props = {
  title: string
  videos: Video[]
  onOpen: (video: Video) => void
}

export function Carousel({ title, videos, onOpen }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: 'smooth' })
  }

  if (videos.length === 0) return null

  return (
    <section className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__viewport">
        <button
          className="row__ctrl row__ctrl--left"
          onClick={() => scrollBy(-1)}
          aria-label="Précédent"
        >
          <Icon name="chevron-left" size={28} />
        </button>
        <div className="row__track" ref={trackRef}>
          {videos.map((v) => (
            <div className="row__item" key={v.id}>
              <VideoCard video={v} onOpen={onOpen} />
            </div>
          ))}
        </div>
        <button
          className="row__ctrl row__ctrl--right"
          onClick={() => scrollBy(1)}
          aria-label="Suivant"
        >
          <Icon name="chevron-right" size={28} />
        </button>
      </div>
    </section>
  )
}
