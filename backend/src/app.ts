import express from 'express'
import cors from 'cors'
import { videosRouter } from './routes/videos.js'
import { statsRouter } from './routes/stats.js'
import { usersRouter } from './routes/users.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  const health = (_req: express.Request, res: express.Response) =>
    res.json({ status: 'ok', service: 'lumen-api' })
  app.get('/health', health)
  app.get('/api/health', health)

  app.use('/api/videos', videosRouter)
  app.use('/api/stats', statsRouter)
  app.use('/api/users', usersRouter)

  return app
}
