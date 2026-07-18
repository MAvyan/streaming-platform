import './Footer.css'

const LINKS = ['Audiodescription', 'Centre d\'aide', 'Presse', 'Confidentialité', 'Contact']

export function Footer() {
  return (
    <footer className="footer">
      <nav className="footer__links">
        {LINKS.map((l) => (
          <a key={l} href="#" className="footer__link" onClick={(e) => e.preventDefault()}>
            {l}
          </a>
        ))}
      </nav>
      <p className="footer__note">
        LUMEN — projet de démonstration. Contenus et données simulés.
      </p>
    </footer>
  )
}
