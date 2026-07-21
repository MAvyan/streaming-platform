import { describe, it, expect } from 'vitest'
import { formatDuration, formatDay, formatMonth, progress, initials, matchScore } from './format'

describe('formatDuration', () => {
  it('formate les durées de moins d’une heure en minutes', () => {
    expect(formatDuration(45 * 60)).toBe('45 min')
  })

  it('formate les durées longues en heures et minutes', () => {
    expect(formatDuration(90 * 60)).toBe('1h 30')
  })

  it('remplit les minutes sur deux chiffres', () => {
    expect(formatDuration(65 * 60)).toBe('1h 05')
  })
})

describe('formatDay et formatMonth', () => {
  it('formate un jour avec son mois en toutes lettres', () => {
    expect(formatDay('2026-07-20T18:00:00Z')).toMatch(/20 juillet/i)
  })

  it('formate un mois avec son année', () => {
    expect(formatMonth('2026-07-20T18:00:00Z')).toMatch(/juillet 2026/i)
  })
})

describe('progress', () => {
  it('calcule un pourcentage de progression', () => {
    expect(progress(1800, 3600)).toBe(50)
  })

  it('plafonne à 100 et protège la division par zéro', () => {
    expect(progress(7200, 3600)).toBe(100)
    expect(progress(60, 0)).toBe(0)
  })
})

describe('initials', () => {
  it('prend la premiere lettre des deux premiers mots', () => {
    expect(initials('Utilisateur 2')).toBe('U2')
    expect(initials('Ada Lovelace Byron')).toBe('AL')
  })

  it('gere un nom en un seul mot', () => {
    expect(initials('  lumen ')).toBe('L')
  })
})

describe('matchScore', () => {
  it('renvoie un score stable entre 70 et 99', () => {
    const score = matchScore('abc123')
    expect(score).toBeGreaterThanOrEqual(70)
    expect(score).toBeLessThanOrEqual(99)
    expect(matchScore('abc123')).toBe(score)
  })

  it('varie selon l’identifiant', () => {
    expect(matchScore('aaa')).not.toBe(matchScore('zzz'))
  })
})
