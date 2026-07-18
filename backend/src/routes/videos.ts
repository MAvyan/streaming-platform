import { Router } from 'express'
import { prisma } from '../prisma.js'

export const videosRouter = Router()

videosRouter.get('/', async (req, res) => {
  const { category } = req.query
  const videos = await prisma.video.findMany({
    where: category ? { category: String(category) } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  res.json(videos)
})

videosRouter.get('/categories', async (_req, res) => {
  const rows = await prisma.video.findMany({
    distinct: ['category'],
    select: { category: true },
    orderBy: { category: 'asc' },
  })
  res.json(rows.map((r) => r.category))
})

videosRouter.get('/:id', async (req, res) => {
  const video = await prisma.video.findUnique({ where: { id: req.params.id } })
  if (!video) {
    res.status(404).json({ error: 'Vidéo introuvable' })
    return
  }
  res.json(video)
})
