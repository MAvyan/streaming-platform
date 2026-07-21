import { describe, it, expect } from 'vitest'
import { paginate } from './paginate'

const items = Array.from({ length: 34 }, (_, i) => i + 1)

describe('paginate', () => {
  it('decoupe la premiere page et decrit la plage', () => {
    const page = paginate(items, 1, 15)
    expect(page.items).toHaveLength(15)
    expect(page.items[0]).toBe(1)
    expect([page.from, page.to, page.total]).toEqual([1, 15, 34])
    expect(page.pageCount).toBe(3)
  })

  it('renvoie le reste sur la derniere page', () => {
    const page = paginate(items, 3, 15)
    expect(page.items).toHaveLength(4)
    expect([page.from, page.to]).toEqual([31, 34])
  })

  it('ramene une page hors bornes dans la plage valide', () => {
    expect(paginate(items, 99, 15).page).toBe(3)
    expect(paginate(items, 0, 15).page).toBe(1)
    expect(paginate(items, -2, 15).page).toBe(1)
  })

  it('gere une liste vide sans page fantome', () => {
    const page = paginate([], 1, 15)
    expect(page.items).toEqual([])
    expect(page.pageCount).toBe(1)
    expect([page.from, page.to, page.total]).toEqual([0, 0, 0])
  })
})
