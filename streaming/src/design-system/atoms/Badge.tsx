import './Badge.css'

type Props = {
  children: React.ReactNode
  variant?: 'outline' | 'accent'
}

export function Badge({ children, variant = 'outline' }: Props) {
  return <span className={`badge badge--${variant}`}>{children}</span>
}
