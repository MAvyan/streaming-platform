import type { ReactNode } from 'react'
import { Icon } from '../atoms/Icon'

type Props = {
  title: string
  subtitle?: string
  action?: ReactNode
  onMenu: () => void
}

export function Topbar({ title, subtitle, action, onMenu }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-bg/95 px-8 backdrop-blur max-[860px]:px-4">
      <button
        className="hidden cursor-pointer border-0 bg-transparent text-ink max-[860px]:inline-flex"
        onClick={onMenu}
        aria-label="Ouvrir le menu"
      >
        <Icon name="menu" size={20} />
      </button>

      <h1 className="shrink-0 text-[15px] font-semibold tracking-[-0.01em]">{title}</h1>
      {subtitle && (
        <>
          <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-line-strong max-[700px]:hidden" />
          <p className="eyebrow truncate max-[700px]:hidden">{subtitle}</p>
        </>
      )}

      {action && <div className="ml-auto">{action}</div>}
    </header>
  )
}
