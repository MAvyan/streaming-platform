import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Metric } from './Metric'

describe('Metric', () => {
  it('affiche la valeur et le libellé', () => {
    render(<Metric label="Abonnés" value="1 842" />)
    expect(screen.getByText('1 842')).toBeInTheDocument()
    expect(screen.getByText('Abonnés')).toBeInTheDocument()
  })

  it('affiche la mesure dérivée quand elle est fournie', () => {
    render(<Metric label="Vues" value="42k" detail="1 400 par jour en moyenne" />)
    expect(screen.getByText('1 400 par jour en moyenne')).toBeInTheDocument()
  })
})
