import { Router } from 'express'
import { prisma } from '../prisma.js'

export const statsRouter = Router()

statsRouter.get('/overview', async (_req, res) => {
  const [totalUsers, totalVideos, totalViews, watch] = await Promise.all([
    prisma.user.count(),
    prisma.video.count(),
    prisma.viewEvent.count(),
    prisma.viewEvent.aggregate({ _sum: { watchedSec: true } }),
  ])

  res.json({
    totalUsers,
    totalVideos,
    totalViews,
    totalWatchHours: Math.round((watch._sum.watchedSec ?? 0) / 3600),
  })
})

statsRouter.get('/top-videos', async (_req, res) => {
  const grouped = await prisma.viewEvent.groupBy({
    by: ['videoId'],
    _count: { _all: true },
    orderBy: { _count: { videoId: 'desc' } },
    take: 6,
  })

  const videos = await prisma.video.findMany({
    where: { id: { in: grouped.map((g) => g.videoId) } },
  })
  const byId = new Map(videos.map((v) => [v.id, v]))

  res.json(
    grouped.map((g) => ({
      videoId: g.videoId,
      title: byId.get(g.videoId)?.title ?? 'Inconnu',
      category: byId.get(g.videoId)?.category ?? '',
      views: g._count._all,
    })),
  )
})

statsRouter.get('/by-category', async (_req, res) => {
  const events = await prisma.viewEvent.findMany({
    select: { video: { select: { category: true } } },
  })
  const counts = new Map<string, number>()
  for (const e of events) {
    counts.set(e.video.category, (counts.get(e.video.category) ?? 0) + 1)
  }
  res.json(
    [...counts.entries()]
      .map(([category, views]) => ({ category, views }))
      .sort((a, b) => b.views - a.views),
  )
})

statsRouter.get('/by-plan', async (_req, res) => {
  const grouped = await prisma.user.groupBy({
    by: ['plan'],
    _count: { _all: true },
  })
  res.json(grouped.map((g) => ({ plan: g.plan, users: g._count._all })))
})

statsRouter.get('/views-over-time', async (_req, res) => {
  const since = new Date()
  since.setDate(since.getDate() - 29)
  since.setHours(0, 0, 0, 0)

  const events = await prisma.viewEvent.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })

  const counts = new Map<string, number>()
  for (const e of events) {
    const day = e.createdAt.toISOString().slice(0, 10)
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }

  const series: { date: string; views: number }[] = []
  for (let i = 0; i < 30; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    series.push({ date: key, views: counts.get(key) ?? 0 })
  }

  res.json(series)
})
