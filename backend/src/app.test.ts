import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    video: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    user: { count: vi.fn(), groupBy: vi.fn(), findFirst: vi.fn() },
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

const validVideo = {
  title: 'Nouveau titre',
  description: 'Une description.',
  category: 'Drame',
  durationSec: 5400,
  releaseYear: 2024,
  maturity: '-12',
}

describe('écriture du catalogue', () => {
  it('crée une vidéo et renvoie 201', async () => {
    prismaMock.video.create.mockResolvedValue({ id: 'v1', ...validVideo })
    const res = await request(app).post('/api/videos').send(validVideo)
    expect(res.status).toBe(201)
    expect(res.body.id).toBe('v1')
    expect(prismaMock.video.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ title: 'Nouveau titre', durationSec: 5400 }),
    })
  })

  it('refuse une création incomplète avec le détail par champ', async () => {
    const res = await request(app).post('/api/videos').send({ title: '  ' })
    expect(res.status).toBe(400)
    expect(Object.keys(res.body.errors).sort()).toEqual([
      'category',
      'description',
      'durationSec',
      'maturity',
      'releaseYear',
      'title',
    ])
    expect(prismaMock.video.create).not.toHaveBeenCalled()
  })

  it('refuse une année ou un public hors bornes', async () => {
    const res = await request(app)
      .post('/api/videos')
      .send({ ...validVideo, releaseYear: 1789, maturity: 'X' })
    expect(res.status).toBe(400)
    expect(res.body.errors.releaseYear).toBeDefined()
    expect(res.body.errors.maturity).toBeDefined()
  })

  it('refuse une URL de visuel malformée', async () => {
    const res = await request(app)
      .post('/api/videos')
      .send({ ...validVideo, thumbnailUrl: 'javascript:alert(1)' })
    expect(res.status).toBe(400)
    expect(res.body.errors.thumbnailUrl).toBeDefined()
  })

  it('vide un visuel quand la chaîne est vide', async () => {
    prismaMock.video.create.mockResolvedValue({ id: 'v1' })
    await request(app)
      .post('/api/videos')
      .send({ ...validVideo, thumbnailUrl: '' })
    expect(prismaMock.video.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ thumbnailUrl: null }),
    })
  })

  it('met à jour uniquement les champs fournis', async () => {
    prismaMock.video.findUnique.mockResolvedValue({ id: 'v1' })
    prismaMock.video.update.mockResolvedValue({ id: 'v1', title: 'Corrigé' })
    const res = await request(app).patch('/api/videos/v1').send({ title: 'Corrigé' })
    expect(res.status).toBe(200)
    expect(prismaMock.video.update).toHaveBeenCalledWith({
      where: { id: 'v1' },
      data: { title: 'Corrigé' },
    })
  })

  it('refuse une mise à jour vide', async () => {
    const res = await request(app).patch('/api/videos/v1').send({})
    expect(res.status).toBe(400)
    expect(prismaMock.video.update).not.toHaveBeenCalled()
  })

  it('renvoie 404 en mise à jour d une vidéo inconnue', async () => {
    prismaMock.video.findUnique.mockResolvedValue(null)
    const res = await request(app).patch('/api/videos/x').send({ title: 'Corrigé' })
    expect(res.status).toBe(404)
    expect(prismaMock.video.update).not.toHaveBeenCalled()
  })

  it('supprime une vidéo et renvoie 204', async () => {
    prismaMock.video.findUnique.mockResolvedValue({ id: 'v1' })
    prismaMock.video.delete.mockResolvedValue({ id: 'v1' })
    const res = await request(app).delete('/api/videos/v1')
    expect(res.status).toBe(204)
    expect(prismaMock.video.delete).toHaveBeenCalledWith({ where: { id: 'v1' } })
  })

  it('renvoie 404 en suppression d une vidéo inconnue', async () => {
    prismaMock.video.findUnique.mockResolvedValue(null)
    const res = await request(app).delete('/api/videos/x')
    expect(res.status).toBe(404)
    expect(prismaMock.video.delete).not.toHaveBeenCalled()
  })
})

describe('/api/users/me', () => {
  const user = {
    id: 'u1',
    name: 'Utilisateur 1',
    email: 'user1@example.com',
    plan: 'PREMIUM',
    country: 'FR',
    createdAt: new Date('2026-01-05T10:00:00Z'),
  }

  it('renvoie le profil et ses compteurs de visionnage', async () => {
    prismaMock.user.findFirst.mockResolvedValue(user)
    prismaMock.viewEvent.findMany.mockResolvedValue([
      { videoId: 'v1', watchedSec: 3600, completed: true },
      { videoId: 'v1', watchedSec: 1800, completed: false },
      { videoId: 'v2', watchedSec: 1800, completed: false },
    ])

    const res = await request(app).get('/api/users/me')
    expect(res.status).toBe(200)
    expect(res.body.email).toBe('user1@example.com')
    expect(res.body.stats).toEqual({ views: 3, titles: 2, completed: 1, watchHours: 2 })
  })

  it('renvoie 404 quand la base ne contient aucun abonné', async () => {
    prismaMock.user.findFirst.mockResolvedValue(null)
    const res = await request(app).get('/api/users/me')
    expect(res.status).toBe(404)
  })

  it('aplatit l historique avec la vidéo associée', async () => {
    prismaMock.user.findFirst.mockResolvedValue(user)
    prismaMock.viewEvent.findMany.mockResolvedValue([
      {
        id: 'e1',
        videoId: 'v1',
        watchedSec: 900,
        completed: false,
        createdAt: new Date('2026-07-20T20:00:00Z'),
        video: {
          title: 'Le Témoin',
          category: 'Thriller',
          thumbnailUrl: null,
          backdropUrl: null,
          durationSec: 4320,
        },
      },
    ])

    const res = await request(app).get('/api/users/me/history')
    expect(res.status).toBe(200)
    expect(res.body[0]).toMatchObject({
      videoId: 'v1',
      title: 'Le Témoin',
      category: 'Thriller',
      watchedSec: 900,
      durationSec: 4320,
    })
  })

  it('limite l historique aux visionnages les plus récents', async () => {
    prismaMock.user.findFirst.mockResolvedValue(user)
    prismaMock.viewEvent.findMany.mockResolvedValue([])
    await request(app).get('/api/users/me/history')
    expect(prismaMock.viewEvent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'desc' }, take: 12 }),
    )
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
