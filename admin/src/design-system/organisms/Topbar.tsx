import { Icon } from '../atoms/Icon'
import './Topbar.css'

type Props = {
  title: string
  subtitle?: string
  onMenu: () => void
}

export function Topbar({ title, subtitle, onMenu }: Props) {
  return (
    <header className="topbar">
      <button className="topbar__menu" onClick={onMenu} aria-label="Ouvrir le menu">
        <Icon name="menu" size={22} />
      </button>
      <div className="topbar__titles">
        <h1 className="topbar__title">{title}</h1>
        {subtitle && <p className="topbar__subtitle">{subtitle}</p>}
      </div>
      <span className="topbar__range">30 derniers jours</span>
    </header>
  )
}
