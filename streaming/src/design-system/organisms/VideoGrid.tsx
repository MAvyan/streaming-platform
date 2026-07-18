import type { Video } from '../../lib/api'
import { VideoCard } from '../molecules/VideoCard'
import './VideoGrid.css'

type Props = {
  title: string
  videos: Video[]
  onOpen: (video: Video) => void
}

export function VideoGrid({ title, videos, onOpen }: Props) {
  return (
    <section className="grid-section">
      <h2 className="grid-section__title">{title}</h2>
      {videos.length === 0 ? (
        <p className="grid-section__empty">Aucun titre ne correspond à votre recherche.</p>
      ) : (
        <div className="grid">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  )
}
