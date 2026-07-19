import { useRef } from 'react'
import type { Video } from '../../lib/api'
import { VideoCard } from '../molecules/VideoCard'
import { Icon } from '../atoms/Icon'

type Props = {
  title: string
  videos: Video[]
  onOpen: (video: Video) => void
  ratio?: 'poster' | 'wide'
}

export function Carousel({ title, videos, onOpen, ratio = 'poster' }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: 'smooth' })
  }

  if (videos.length === 0) return null

  const ctrl =
    'absolute inset-y-0 z-[3] flex w-[var(--page-x)] cursor-pointer items-center justify-center border-0 text-ink opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 max-sm:hidden'

  return (
    <section className="my-8">
      <h2 className="mb-3 px-[var(--page-x)] text-xl font-semibold">{title}</h2>
      <div className="group/row relative">
        <button
          className={`${ctrl} left-0 bg-gradient-to-r from-bg to-transparent`}
          onClick={() => scrollBy(-1)}
          aria-label="Précédent"
        >
          <Icon name="chevron-left" size={28} />
        </button>
        <div ref={trackRef} className={`row-track row-track--${ratio}`}>
          {videos.map((v) => (
            <div key={v.id} className="snap-start">
              <VideoCard video={v} onOpen={onOpen} ratio={ratio} />
            </div>
          ))}
        </div>
        <button
          className={`${ctrl} right-0 bg-gradient-to-l from-bg to-transparent`}
          onClick={() => scrollBy(1)}
          aria-label="Suivant"
        >
          <Icon name="chevron-right" size={28} />
        </button>
      </div>
    </section>
  )
}
