import { useEffect, useRef, useState } from 'react'
import { Icon } from '../atoms/Icon'
import './Player.css'

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
      if (!paused) {
        setElapsed((e) => Math.min(e + dt, CLIP_SECONDS))
      }
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
    <div className="player">
      <div className="player__stage">
        <span className="player__ambient" />
        <span className="player__brand">LUMEN</span>
        <span className="player__now">{title}</span>
      </div>

      <div className="player__controls">
        <div className="player__bar" role="progressbar" aria-valuenow={Math.round(pct)}>
          <span className="player__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="player__row">
          <div className="player__buttons">
            <button
              className="player__btn"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Reprendre' : 'Pause'}
            >
              <Icon name={paused ? 'play' : 'pause'} size={22} />
            </button>
            <span className="player__time">-{remaining}s</span>
          </div>
          <button className="player__exit" onClick={onExit}>
            Quitter le lecteur
          </button>
        </div>
      </div>
    </div>
  )
}
