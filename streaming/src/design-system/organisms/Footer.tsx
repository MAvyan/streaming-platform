const LINKS = ['Audiodescription', "Centre d'aide", 'Presse', 'Confidentialité', 'Contact']

export function Footer() {
  return (
    <footer className="px-[var(--page-x)] pb-12 pt-16 text-dim">
      <nav className="mb-4 flex flex-wrap gap-x-6 gap-y-3">
        {LINKS.map((l) => (
          <a
            key={l}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="text-[15px] text-dim no-underline hover:text-muted hover:underline"
          >
            {l}
          </a>
        ))}
      </nav>
      <p className="text-xs">LUMEN — projet de démonstration. Contenus et données simulés.</p>
    </footer>
  )
}
