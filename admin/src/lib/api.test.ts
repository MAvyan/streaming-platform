import { describe, it, expect, vi, afterEach } from 'vitest'
import { api } from './api'

afterEach(() => {
  vi.restoreAllMocks()
})

function mockFetch(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(body),
  })
}

describe('api admin', () => {
  it('appelle chaque endpoint de statistiques', async () => {
    vi.stubGlobal('fetch', mockFetch([]))
    await api.overview()
    await api.byCategory()
    await api.byPlan()
    await api.topVideos()
    await api.viewsOverTime()

    const calls = (fetch as unknown as { mock: { calls: string[][] } }).mock.calls.map((c) => c[0])
    expect(calls).toEqual([
      '/api/stats/overview',
      '/api/stats/by-category',
      '/api/stats/by-plan',
      '/api/stats/top-videos',
      '/api/stats/views-over-time',
    ])
  })

  it('lève une erreur sur réponse non OK', async () => {
    vi.stubGlobal('fetch', mockFetch(null, false, 503))
    await expect(api.overview()).rejects.toThrow('/stats/overview -> 503')
  })
})
