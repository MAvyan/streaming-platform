import { describe, it, expect } from 'vitest'
import { genreTint, monogram } from './genre'

describe('genreTint', () => {
  it('associe une teinte connue à une catégorie du catalogue', () => {
    expect(genreTint('Action')).toBe('var(--tint-red)')
    expect(genreTint('Science-fiction')).toBe('var(--tint-blue)')
  })

  it('renvoie une teinte stable pour une catégorie inconnue', () => {
    const tint = genreTint('Western')
    expect(tint).toMatch(/^var\(--tint-/)
    expect(genreTint('Western')).toBe(tint)
  })
})

describe('monogram', () => {
  it('renvoie la première lettre en majuscule', () => {
    expect(monogram('méridien')).toBe('M')
    expect(monogram('  signal')).toBe('S')
  })
})
