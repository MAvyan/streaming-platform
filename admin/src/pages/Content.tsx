import { useMemo, useState } from 'react'
import { useVideos } from '../hooks/useVideos'
import { api, type Video } from '../lib/api'
import { Button } from '../design-system/atoms/Button'
import { Input, Select } from '../design-system/atoms/Input'
import { Notice } from '../design-system/molecules/Notice'
import { Panel } from '../design-system/molecules/Panel'
import { ConfirmDialog } from '../design-system/molecules/ConfirmDialog'
import { VideoTable } from '../design-system/organisms/VideoTable'
import { VideoForm } from '../design-system/organisms/VideoForm'

export function Content() {
  const { videos, loading, error, reload } = useVideos()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [editing, setEditing] = useState<Video | null>(null)
  const [creating, setCreating] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Video | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const categories = useMemo(
    () => [...new Set(videos.map((v) => v.category))].sort((a, b) => a.localeCompare(b)),
    [videos],
  )

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return videos.filter(
      (v) =>
        (category === '' || v.category === category) &&
        (needle === '' || v.title.toLowerCase().includes(needle)),
    )
  }, [videos, search, category])

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await api.deleteVideo(pendingDelete.id)
      setStatus(`« ${pendingDelete.title} » supprimé du catalogue.`)
      setPendingDelete(null)
      await reload()
    } catch {
      setStatus('Suppression impossible. Réessayez.')
    } finally {
      setDeleting(false)
    }
  }

  async function onSaved(message: string) {
    setEditing(null)
    setCreating(false)
    setStatus(message)
    await reload()
  }

  if (error) return <Notice>Catalogue indisponible. Vérifiez que l'API répond, puis rechargez.</Notice>
  if (loading) return <Notice>Lecture du catalogue…</Notice>

  return (
    <div className="flex flex-col gap-px bg-line">
      {status && (
        <div className="flex items-center gap-3 bg-bg px-6 py-3 text-[13px] text-secondary max-[860px]:px-4">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-good" aria-hidden="true" />
          <span role="status">{status}</span>
          <button
            onClick={() => setStatus(null)}
            className="eyebrow ml-auto cursor-pointer border-0 bg-transparent hover:text-ink"
          >
            Masquer
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 bg-bg px-6 py-4 max-[860px]:px-4">
        <div className="w-[260px] max-[520px]:w-full">
          <Input
            aria-label="Rechercher un titre"
            placeholder="Rechercher un titre"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-[200px] max-[520px]:w-full">
          <Select
            aria-label="Filtrer par catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <span className="eyebrow ml-auto">
          {filtered.length} / {videos.length} titres
        </span>
        <Button variant="primary" onClick={() => setCreating(true)}>
          Ajouter un titre
        </Button>
      </div>

      <Panel title="Catalogue" meta="les plus récents en tête">
        {videos.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Le catalogue est vide. Ajoutez un premier titre.
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-muted">Aucun titre ne correspond à ces filtres.</p>
            <Button
              onClick={() => {
                setSearch('')
                setCategory('')
              }}
            >
              Effacer les filtres
            </Button>
          </div>
        ) : (
          <VideoTable videos={filtered} onEdit={setEditing} onDelete={setPendingDelete} />
        )}
      </Panel>

      {(creating || editing) && (
        <VideoForm
          video={editing}
          categories={categories}
          onClose={() => {
            setCreating(false)
            setEditing(null)
          }}
          onSaved={onSaved}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title={`Supprimer « ${pendingDelete.title} » ?`}
          body="Le titre disparaît du catalogue et ses visionnages sont supprimés avec lui. Les statistiques seront recalculées en conséquence."
          confirmLabel="Supprimer"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
