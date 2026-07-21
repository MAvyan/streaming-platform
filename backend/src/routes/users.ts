import { Router } from 'express'
import { prisma } from '../prisma.js'

export const usersRouter = Router()

const HISTORY_LIMIT = 12

function currentUser() {
  return prisma.user.findFirst({ orderBy: [{ createdAt: 'asc' }, { id: 'asc' }] })
}

usersRouter.get('/me', async (_req, res) => {
  const user = await currentUser()
  if (!user) {
    res.status(404).json({ error: 'Aucun abonné' })
    return
  }

  const events = await prisma.viewEvent.findMany({
    where: { userId: user.id },
    select: { videoId: true, watchedSec: true, completed: true },
  })

  const watchedSec = events.reduce((sum, e) => sum + e.watchedSec, 0)

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    country: user.country,
    createdAt: user.createdAt,
    stats: {
      views: events.length,
      titles: new Set(events.map((e) => e.videoId)).size,
      completed: events.filter((e) => e.completed).length,
      watchHours: Math.round(watchedSec / 3600),
    },
  })
})

usersRouter.get('/me/history', async (_req, res) => {
  const user = await currentUser()
  if (!user) {
    res.status(404).json({ error: 'Aucun abonné' })
    return
  }

  const events = await prisma.viewEvent.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_LIMIT,
    include: { video: true },
  })

  res.json(
    events.map((e) => ({
      id: e.id,
      videoId: e.videoId,
      title: e.video.title,
      category: e.video.category,
      thumbnailUrl: e.video.thumbnailUrl,
      backdropUrl: e.video.backdropUrl,
      durationSec: e.video.durationSec,
      watchedSec: e.watchedSec,
      completed: e.completed,
      watchedAt: e.createdAt,
    })),
  )
})
