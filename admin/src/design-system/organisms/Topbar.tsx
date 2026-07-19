import { Icon } from '../atoms/Icon'

type Props = {
  title: string
  subtitle?: string
  onMenu: () => void
}

export function Topbar({ title, subtitle, onMenu }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-bg px-8 max-[860px]:px-4">
      <button
        className="hidden cursor-pointer border-0 bg-transparent text-ink max-[860px]:inline-flex"
        onClick={onMenu}
        aria-label="Ouvrir le menu"
      >
        <Icon name="menu" size={22} />
      </button>
      <div className="min-w-0">
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      <span className="ml-auto whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm text-secondary max-[860px]:hidden">
        30 derniers jours
      </span>
    </header>
  )
}
