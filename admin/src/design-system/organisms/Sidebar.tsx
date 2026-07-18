import { Icon, type IconName } from '../atoms/Icon'
import './Sidebar.css'

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
      <div className={`sidebar__overlay ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="sidebar__brand">
          LUMEN <span className="sidebar__brand-tag">Admin</span>
        </div>
        <nav className="sidebar__nav">
          {ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar__item ${active === item.key ? 'is-active' : ''}`}
              aria-current={active === item.key ? 'page' : undefined}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <p className="sidebar__foot">Données simulées</p>
      </aside>
    </>
  )
}
