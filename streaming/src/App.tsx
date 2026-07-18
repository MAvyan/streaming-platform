import { useEffect, useState } from 'react'
import './App.css'

type ApiStatus =
  | { state: 'loading' }
  | { state: 'ok'; service: string }
  | { state: 'error'; message: string }

/**
 * Squelette du Livrable 1 — plateforme de consultation de contenu vidéo.
 * Pour l'instant on vérifie surtout que le front est bien câblé au backend
 * (l'appel /api est relayé vers Express via le proxy Vite).
 */
function App() {
  const [api, setApi] = useState<ApiStatus>({ state: 'loading' })

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setApi({ state: 'ok', service: data.service ?? 'backend' }))
      .catch((e) => setApi({ state: 'error', message: String(e) }))
  }, [])

  return (
    <main className="app-shell">
      <span className="badge">Livrable 1</span>
      <h1>🎬 Streaming</h1>
      <p>Plateforme de consultation de contenu vidéo — squelette initial.</p>

      <div className="api-status">
        {api.state === 'loading' && <span>Connexion au backend…</span>}
        {api.state === 'ok' && <span>✅ Backend connecté : {api.service}</span>}
        {api.state === 'error' && <span>❌ Backend injoignable ({api.message})</span>}
      </div>
    </main>
  )
}

export default App
