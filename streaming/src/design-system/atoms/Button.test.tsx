import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('affiche son contenu', () => {
    render(<Button>Lecture</Button>)
    expect(screen.getByRole('button', { name: 'Lecture' })).toBeInTheDocument()
  })

  it('déclenche onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applique la variante secondaire', () => {
    render(<Button variant="secondary">X</Button>)
    expect(screen.getByRole('button').className).toContain('border-line')
  })
})
