import { useEffect, useState } from 'react'
import { Logo } from '../atoms/Logo'
import { Icon } from '../atoms/Icon'
import { SearchBar } from '../molecules/SearchBar'
import './Navbar.css'

type Props = {
  categories: string[]
  activeCategory: string | null
  onSelectCategory: (category: string | null) => void
  search: string
  onSearch: (value: string) => void
  onHome: () => void
}

export function Navbar({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearch,
  onHome,
}: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__left">
        <Logo onClick={onHome} />
        <nav className="nav__links">
          <button
            className={`nav__link ${!activeCategory ? 'is-active' : ''}`}
            onClick={() => onSelectCategory(null)}
          >
            Accueil
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`nav__link ${activeCategory === c ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(c)}
            >
              {c}
            </button>
          ))}
        </nav>
      </div>

      <div className="nav__right">
        <SearchBar value={search} onChange={onSearch} />
        <button className="nav__icon" aria-label="Notifications">
          <Icon name="bell" size={22} />
        </button>
        <span className="nav__avatar" aria-hidden="true" />
      </div>
    </header>
  )
}
