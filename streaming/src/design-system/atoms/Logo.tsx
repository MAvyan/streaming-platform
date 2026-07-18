import './Logo.css'

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <span className="logo" onClick={onClick} role={onClick ? 'button' : undefined}>
      LUMEN
    </span>
  )
}
