import { Router } from 'express'
import { prisma } from '../prisma.js'

export const videosRouter = Router()

const MATURITIES = ['TP', '-10', '-12', '-16', '-18']
const MAX_YEAR = new Date().getFullYear() + 5

type VideoInput = {
  title: string
  description: string
  category: string
  durationSec: number
  releaseYear: number
  maturity: string
  thumbnailUrl: string | null
  backdropUrl: string | null
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null
}

function integer(value: unknown, min: number, max: number): number | null {
  const parsed = typeof value === 'number' ? value : Number(value)
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null
  return parsed
}

function url(value: unknown): string | null | undefined {
  if (value === null || value === '' || value === undefined) return null
  if (typeof value !== 'string') return undefined
  return /^https?:\/\/\S+$/.test(value.trim()) ? value.trim() : undefined
}

function validate(body: unknown, partial: boolean) {
  const source = (body ?? {}) as Record<string, unknown>
  const data: Partial<VideoInput> = {}
  const errors: Record<string, string> = {}
  const given = (field: string) => Object.hasOwn(source, field)

  if (given('title') || !partial) {
    const value = text(source.title, 120)
    if (value) data.title = value
    else errors.title = 'Titre requis, 120 caractères maximum.'
  }

  if (given('description') || !partial) {
    const value = text(source.description, 2000)
    if (value) data.description = value
    else errors.description = 'Description requise, 2000 caractères maximum.'
  }

  if (given('category') || !partial) {
    const value = text(source.category, 40)
    if (value) data.category = value
    else errors.category = 'Catégorie requise, 40 caractères maximum.'
  }

  if (given('durationSec') || !partial) {
    const value = integer(source.durationSec, 1, 86400)
    if (value) data.durationSec = value
    else errors.durationSec = 'Durée en secondes, entre 1 et 86400.'
  }

  if (given('releaseYear') || !partial) {
    const value = integer(source.releaseYear, 1900, MAX_YEAR)
    if (value) data.releaseYear = value
    else errors.releaseYear = `Année de sortie, entre 1900 et ${MAX_YEAR}.`
  }

  if (given('maturity') || !partial) {
    const value = typeof source.maturity === 'string' ? source.maturity.trim() : ''
    if (MATURITIES.includes(value)) data.maturity = value
    else errors.maturity = `Public visé : ${MATURITIES.join(', ')}.`
  }

  for (const field of ['thumbnailUrl', 'backdropUrl'] as const) {
    if (!given(field)) continue
    const value = url(source[field])
    if (value === undefined) errors[field] = 'URL invalide (http ou https attendu).'
    else data[field] = value
  }

  return { data, errors }
}

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

videosRouter.post('/', async (req, res) => {
  const { data, errors } = validate(req.body, false)
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors })
    return
  }
  const video = await prisma.video.create({ data: data as VideoInput })
  res.status(201).json(video)
})

videosRouter.patch('/:id', async (req, res) => {
  const { data, errors } = validate(req.body, true)
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ errors })
    return
  }
  if (Object.keys(data).length === 0) {
    res.status(400).json({ errors: { form: 'Aucun champ à mettre à jour.' } })
    return
  }
  const existing = await prisma.video.findUnique({ where: { id: req.params.id } })
  if (!existing) {
    res.status(404).json({ error: 'Vidéo introuvable' })
    return
  }
  const video = await prisma.video.update({ where: { id: req.params.id }, data })
  res.json(video)
})

videosRouter.delete('/:id', async (req, res) => {
  const existing = await prisma.video.findUnique({ where: { id: req.params.id } })
  if (!existing) {
    res.status(404).json({ error: 'Vidéo introuvable' })
    return
  }
  await prisma.video.delete({ where: { id: req.params.id } })
  res.status(204).end()
})
