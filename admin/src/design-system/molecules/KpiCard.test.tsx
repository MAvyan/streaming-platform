import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { KpiCard } from './KpiCard'

describe('KpiCard', () => {
  it('affiche la valeur et le libellé', () => {
    render(<KpiCard label="Abonnés" value="1.8k" icon="users" />)
    expect(screen.getByText('1.8k')).toBeInTheDocument()
    expect(screen.getByText('Abonnés')).toBeInTheDocument()
  })

  it('affiche un delta positif', () => {
    render(<KpiCard label="Vues" value="42" icon="eye" delta={12.4} />)
    expect(screen.getByText('+12.4%')).toBeInTheDocument()
  })
})
