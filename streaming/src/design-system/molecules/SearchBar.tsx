import { useEffect, useRef, useState } from 'react'
import { Icon } from '../atoms/Icon'

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
    <div
      className={`flex items-center rounded border transition-colors ${
        expanded ? 'border-line bg-black/70' : 'border-transparent bg-transparent'
      }`}
    >
      <button
        className="flex items-center justify-center border-0 bg-transparent p-2 text-ink cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-label="Rechercher"
      >
        <Icon name="search" size={20} />
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Titres, catégories..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        aria-label="Rechercher un contenu"
        className={`border-0 bg-transparent font-sans text-[15px] text-ink outline-none transition-all duration-200 ${
          expanded ? 'w-[180px] pr-3 max-sm:w-[120px]' : 'w-0 p-0'
        }`}
      />
    </div>
  )
}
