import { describe, it, expect } from 'vitest'
import { formatDuration, matchScore } from './format'

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
