import type { Video } from '../../lib/api'
import { VideoCard } from '../molecules/VideoCard'

type Props = {
  title: string
  videos: Video[]
  onOpen: (video: Video) => void
}

export function VideoGrid({ title, videos, onOpen }: Props) {
  return (
    <section className="px-[var(--page-x)] pb-8 pt-[96px]">
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      {videos.length === 0 ? (
        <p className="text-muted">Aucun titre ne correspond à votre recherche.</p>
      ) : (
        <div className="grid grid-cols-6 gap-x-3 gap-y-4 max-[1200px]:grid-cols-5 max-[900px]:grid-cols-4 max-sm:grid-cols-3 max-[420px]:grid-cols-2">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onOpen={onOpen} />
          ))}
        </div>
      )}
    </section>
  )
}
