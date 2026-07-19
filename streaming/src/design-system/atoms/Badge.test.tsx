import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('affiche son contenu', () => {
    render(<Badge>-12</Badge>)
    expect(screen.getByText('-12')).toBeInTheDocument()
  })

  it('applique le style accent', () => {
    render(<Badge variant="accent">À la une</Badge>)
    expect(screen.getByText('À la une').className).toContain('bg-accent')
  })
})
