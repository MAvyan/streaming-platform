import { describe, it, expect } from 'vitest'
import { compact, fullNumber, shortDate, duration } from './format'

describe('compact', () => {
  it('laisse les petits nombres inchanges', () => {
    expect(compact(500)).toBe('500')
  })

  it('abrege les milliers avec une decimale', () => {
    expect(compact(1500)).toBe('1.5k')
  })

  it('abrege les dizaines de milliers sans decimale', () => {
    expect(compact(12000)).toBe('12k')
  })
})

describe('fullNumber', () => {
  it('n ajoute pas de separateur sous 1000', () => {
    expect(fullNumber(42)).toBe('42')
  })

  it('separe les milliers', () => {
    // le separateur fr-FR (espace insecable) varie selon l environnement
    expect(fullNumber(1800).replace(/\D/g, '')).toBe('1800')
  })
})

describe('duration', () => {
  it('affiche les durees courtes en minutes', () => {
    expect(duration(2700)).toBe('45 min')
  })

  it('affiche les heures avec les minutes sur deux chiffres', () => {
    expect(duration(5400)).toBe('1 h 30')
    expect(duration(3900)).toBe('1 h 05')
  })
})

describe('shortDate', () => {
  it('formate en jour + mois court', () => {
    const out = shortDate('2026-06-19T12:00:00Z')
    expect(out).toMatch(/\d{1,2}/)
    expect(out).toMatch(/juin/i)
  })
})
