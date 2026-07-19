import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    video: { findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
    user: { count: vi.fn(), groupBy: vi.fn() },
    viewEvent: { count: vi.fn(), aggregate: vi.fn(), groupBy: vi.fn(), findMany: vi.fn() },
  },
}))

vi.mock('./prisma.js', () => ({ prisma: prismaMock }))

const { createApp } = await import('./app.js')
const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
})

describe('health', () => {
  it('répond ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})

describe('/api/videos', () => {
  it('liste le catalogue', async () => {
    prismaMock.video.findMany.mockResolvedValue([{ id: '1', title: 'A' }])
    const res = await request(app).get('/api/videos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
  })

  it('filtre par catégorie', async () => {
    prismaMock.video.findMany.mockResolvedValue([])
    await request(app).get('/api/videos?category=Action')
    expect(prismaMock.video.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { category: 'Action' } }),
    )
  })

  it('renvoie les catégories distinctes', async () => {
    prismaMock.video.findMany.mockResolvedValue([{ category: 'Action' }, { category: 'Drame' }])
    const res = await request(app).get('/api/videos/categories')
    expect(res.body).toEqual(['Action', 'Drame'])
  })

  it('renvoie une vidéo par id', async () => {
    prismaMock.video.findUnique.mockResolvedValue({ id: '1', title: 'A' })
    const res = await request(app).get('/api/videos/1')
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('A')
  })

  it('renvoie 404 pour une vidéo inconnue', async () => {
    prismaMock.video.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/videos/x')
    expect(res.status).toBe(404)
  })
})

describe('/api/stats', () => {
  it('calcule les indicateurs clés', async () => {
    prismaMock.user.count.mockResolvedValue(60)
    prismaMock.video.count.mockResolvedValue(34)
    prismaMock.viewEvent.count.mockResolvedValue(1800)
    prismaMock.viewEvent.aggregate.mockResolvedValue({ _sum: { watchedSec: 3_600_000 } })

    const res = await request(app).get('/api/stats/overview')
    expect(res.body).toEqual({
      totalUsers: 60,
      totalVideos: 34,
      totalViews: 1800,
      totalWatchHours: 1000,
    })
  })

  it('renvoie le top des vidéos', async () => {
    prismaMock.viewEvent.groupBy.mockResolvedValue([{ videoId: 'v1', _count: { _all: 5 } }])
    prismaMock.video.findMany.mockResolvedValue([{ id: 'v1', title: 'T', category: 'C' }])
    const res = await request(app).get('/api/stats/top-videos')
    expect(res.body).toEqual([{ videoId: 'v1', title: 'T', category: 'C', views: 5 }])
  })

  it('agrège les visionnages par catégorie', async () => {
    prismaMock.viewEvent.findMany.mockResolvedValue([
      { video: { category: 'Action' } },
      { video: { category: 'Action' } },
      { video: { category: 'Drame' } },
    ])
    const res = await request(app).get('/api/stats/by-category')
    expect(res.body).toEqual([
      { category: 'Action', views: 2 },
      { category: 'Drame', views: 1 },
    ])
  })

  it('répartit les abonnés par offre', async () => {
    prismaMock.user.groupBy.mockResolvedValue([{ plan: 'FREE', _count: { _all: 15 } }])
    const res = await request(app).get('/api/stats/by-plan')
    expect(res.body).toEqual([{ plan: 'FREE', users: 15 }])
  })

  it('renvoie une série de 30 jours', async () => {
    prismaMock.viewEvent.findMany.mockResolvedValue([{ createdAt: new Date() }])
    const res = await request(app).get('/api/stats/views-over-time')
    expect(res.body).toHaveLength(30)
  })
})
