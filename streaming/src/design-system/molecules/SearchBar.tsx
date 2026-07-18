import { useEffect, useRef, useState } from 'react'
import { Icon } from '../atoms/Icon'
import './SearchBar.css'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const expanded = open || value.length > 0

  return (
    <div className={`search ${expanded ? 'search--open' : ''}`}>
      <button
        className="search__btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Rechercher"
      >
        <Icon name="search" size={20} />
      </button>
      <input
        ref={inputRef}
        className="search__input"
        type="text"
        placeholder="Titres, catégories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        aria-label="Rechercher un contenu"
      />
    </div>
  )
}
