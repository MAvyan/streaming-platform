import { useEffect, useState } from 'react'
import { Logo } from '../atoms/Logo'
import { Icon } from '../atoms/Icon'
import { SearchBar } from '../molecules/SearchBar'

type Props = {
  categories: string[]
  activeCategory: string | null
  onSelectCategory: (category: string | null) => void
  search: string
  onSearch: (value: string) => void
  onHome: () => void
  profileActive: boolean
}

export function Navbar({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearch,
  onHome,
  profileActive,
}: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const link = (active: boolean) =>
    `border-0 bg-transparent p-0 font-sans text-[15px] cursor-pointer transition-colors ${
      active ? 'text-accent font-semibold' : 'text-muted hover:text-ink'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] flex h-[72px] items-center justify-between px-[clamp(16px,4vw,60px)] transition-colors ${
        scrolled ? 'bg-bg' : 'bg-gradient-to-b from-black/75 to-transparent'
      }`}
    >
      <div className="flex items-center gap-6">
        <Logo onClick={onHome} />
        <nav className="flex items-center gap-4 max-[900px]:hidden">
          <button className={link(!activeCategory)} onClick={() => onSelectCategory(null)}>
            Accueil
          </button>
          {categories.map((c) => (
            <button key={c} className={link(activeCategory === c)} onClick={() => onSelectCategory(c)}>
              {c}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <SearchBar value={search} onChange={onSearch} />
        <button className="flex border-0 bg-transparent text-ink cursor-pointer" aria-label="Notifications">
          <Icon name="bell" size={22} />
        </button>
        <a
          href="#/profil"
          aria-label="Mon profil"
          aria-current={profileActive ? 'page' : undefined}
          className={`inline-block h-8 w-8 rounded transition-shadow ${
            profileActive ? 'ring-2 ring-ink ring-offset-2 ring-offset-bg' : 'hover:brightness-110'
          }`}
          style={{ background: 'linear-gradient(135deg, var(--color-accent), #a8791d)' }}
        />
      </div>
    </header>
  )
}
