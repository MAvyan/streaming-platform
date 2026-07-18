import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...rest}>
      {children}
    </button>
  )
}
