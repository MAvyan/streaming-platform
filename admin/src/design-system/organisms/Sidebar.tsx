type Item = { key: string; label: string; href: string }

const ITEMS: Item[] = [
  { key: 'overview', label: "Vue d'ensemble", href: '#/' },
  { key: 'content', label: 'Contenus', href: '#/contenus' },
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
        <div className="fixed inset-0 z-[39] hidden bg-ink/25 max-[860px]:block" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[212px] flex-col border-r border-line bg-canvas max-[860px]:transition-transform ${
          open ? 'max-[860px]:translate-x-0' : 'max-[860px]:-translate-x-full'
        }`}
      >
        <div className="flex h-14 shrink-0 items-center border-b border-line px-5">
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-[0.18em] text-ink">LUMEN</span>
            <span className="eyebrow text-accent-ink">Régie</span>
          </span>
        </div>

        <nav className="flex flex-col py-3">
          {ITEMS.map((item) => {
            const current = active === item.key
            return (
              <a
                key={item.key}
                href={item.href}
                onClick={onClose}
                aria-current={current ? 'page' : undefined}
                className={`relative px-5 py-2.5 text-sm no-underline transition-colors ${
                  current ? 'font-medium text-ink' : 'text-secondary hover:text-ink'
                }`}
              >
                {current && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-accent" />}
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2 border-t border-line px-5 py-4">
          <span className="pulse h-1.5 w-1.5 shrink-0 rounded-full bg-good" aria-hidden="true" />
          <span className="eyebrow">Données simulées</span>
        </div>
      </aside>
    </>
  )
}
