import { describe, it, expect, vi, afterEach } from 'vitest'
import { api, ApiError } from './api'

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

const videoInput = {
  title: 'Titre',
  description: 'Synopsis',
  category: 'Drame',
  durationSec: 5400,
  releaseYear: 2024,
  maturity: '-12',
  thumbnailUrl: null,
  backdropUrl: null,
}

describe('catalogue', () => {
  it('envoie la création en POST avec le corps sérialisé', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 'v1' }, true, 201))
    await api.createVideo(videoInput)

    const [path, init] = (fetch as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0]
    expect(path).toBe('/api/videos')
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toEqual(videoInput)
  })

  it('envoie la mise à jour en PATCH sur l identifiant', async () => {
    vi.stubGlobal('fetch', mockFetch({ id: 'v1' }))
    await api.updateVideo('v1', videoInput)

    const [path, init] = (fetch as unknown as { mock: { calls: [string, RequestInit][] } }).mock.calls[0]
    expect(path).toBe('/api/videos/v1')
    expect(init.method).toBe('PATCH')
  })

  it('accepte un 204 sans corps à la suppression', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: () => Promise.reject(new Error('pas de corps')),
      }),
    )
    await expect(api.deleteVideo('v1')).resolves.toBeUndefined()
  })

  it('remonte les erreurs de validation par champ', async () => {
    vi.stubGlobal('fetch', mockFetch({ errors: { title: 'Titre requis.' } }, false, 400))

    await expect(api.createVideo(videoInput)).rejects.toBeInstanceOf(ApiError)
    await expect(api.createVideo(videoInput)).rejects.toMatchObject({
      status: 400,
      fields: { title: 'Titre requis.' },
    })
  })
})
