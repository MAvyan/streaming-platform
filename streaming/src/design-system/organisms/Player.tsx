import { useEffect, useRef, useState } from 'react'
import { Icon } from '../atoms/Icon'

type Props = {
  title: string
  onExit: () => void
}

const CLIP_SECONDS = 90

export function Player({ title, onExit }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const raf = useRef<number | null>(null)
  const last = useRef<number>(performance.now())

  useEffect(() => {
    const tick = (now: number) => {
      const dt = (now - last.current) / 1000
      last.current = now
      if (!paused) setElapsed((e) => Math.min(e + dt, CLIP_SECONDS))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [paused])

  const pct = (elapsed / CLIP_SECONDS) * 100
  const remaining = Math.ceil(CLIP_SECONDS - elapsed)

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 overflow-hidden">
        <span className="player-glow absolute h-[140%] w-[140%]" />
        <span className="relative text-[clamp(1.5rem,5vw,2.5rem)] font-bold tracking-[0.3em] text-accent">
          LUMEN
        </span>
        <span className="relative text-[15px] text-muted">{title}</span>
      </div>

      <div className="bg-gradient-to-t from-black/90 to-transparent px-6 pb-6 pt-4">
        <div
          className="mb-3 h-1 overflow-hidden rounded-sm bg-white/25"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
        >
          <span className="block h-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 bg-ink text-black"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Reprendre' : 'Pause'}
            >
              <Icon name={paused ? 'play' : 'pause'} size={22} />
            </button>
            <span className="text-[15px] text-muted">-{remaining}s</span>
          </div>
          <button
            className="cursor-pointer rounded-btn border border-line px-4 py-2 font-sans text-[15px] text-ink hover:bg-white/10"
            onClick={onExit}
          >
            Quitter le lecteur
          </button>
        </div>
      </div>
    </div>
  )
}
