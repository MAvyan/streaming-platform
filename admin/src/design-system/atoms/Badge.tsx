import './Badge.css'

type Props = {
  children: React.ReactNode
  tone?: 'neutral' | 'good' | 'critical'
}

export function Badge({ children, tone = 'neutral' }: Props) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
