import { Icon, type IconName } from '../atoms/Icon'

type Item = { key: string; label: string; icon: IconName }

const ITEMS: Item[] = [
  { key: 'overview', label: "Vue d'ensemble", icon: 'dashboard' },
  { key: 'audience', label: 'Audience', icon: 'users' },
  { key: 'content', label: 'Contenus', icon: 'film' },
  { key: 'watch', label: 'Temps de visionnage', icon: 'clock' },
]

type Props = {
  active: string
  open: boolean
  onClose: () => void
}

export function Sidebar({ active, open, onClose }: Props) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[39] hidden bg-black/50 max-[860px]:block" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[232px] flex-col border-r border-line bg-surface px-4 py-6 max-[860px]:transition-transform max-[860px]:shadow-[0_6px_20px_rgba(0,0,0,0.35)] ${
          open ? 'max-[860px]:translate-x-0' : 'max-[860px]:-translate-x-full'
        }`}
      >
        <div className="flex items-baseline gap-2 px-2 pb-8 text-xl font-bold tracking-[0.04em] text-ink">
          LUMEN <span className="text-xs font-medium uppercase tracking-[0.06em] text-accent">Admin</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {ITEMS.map((item) => (
            <button
              key={item.key}
              aria-current={active === item.key ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-left font-sans text-sm transition-colors ${
                active === item.key
                  ? 'bg-accent/15 font-medium text-accent'
                  : 'text-secondary hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <p className="mt-auto px-2 pt-3 text-xs text-muted">Données simulées</p>
      </aside>
    </>
  )
}
