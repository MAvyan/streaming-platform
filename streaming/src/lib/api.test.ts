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

describe('api', () => {
  it('récupère le catalogue via /api/videos', async () => {
    const videos = [{ id: '1', title: 'A' }]
    vi.stubGlobal('fetch', mockFetch(videos))
    await expect(api.videos()).resolves.toEqual(videos)
    expect(fetch).toHaveBeenCalledWith('/api/videos')
  })

  it('récupère les catégories via /api/videos/categories', async () => {
    vi.stubGlobal('fetch', mockFetch(['Action']))
    await expect(api.categories()).resolves.toEqual(['Action'])
    expect(fetch).toHaveBeenCalledWith('/api/videos/categories')
  })

  it('lève une erreur sur réponse non OK', async () => {
    vi.stubGlobal('fetch', mockFetch(null, false, 500))
    await expect(api.videos()).rejects.toThrow('/videos -> 500')
  })
})
