import { useState, type FormEvent } from 'react'
import { api, ApiError, type Video } from '../../lib/api'
import { Button } from '../atoms/Button'
import { Input, Select, Textarea } from '../atoms/Input'
import { Field } from '../molecules/Field'
import { Drawer } from '../molecules/Drawer'

const MATURITIES = [
  { value: 'TP', label: 'Tous publics' },
  { value: '-10', label: 'Déconseillé aux moins de 10 ans' },
  { value: '-12', label: 'Déconseillé aux moins de 12 ans' },
  { value: '-16', label: 'Déconseillé aux moins de 16 ans' },
  { value: '-18', label: 'Interdit aux moins de 18 ans' },
]

type Props = {
  video: Video | null
  categories: string[]
  onClose: () => void
  onSaved: (message: string) => void
}

function initialState(video: Video | null) {
  return {
    title: video?.title ?? '',
    description: video?.description ?? '',
    category: video?.category ?? '',
    durationMin: video ? String(Math.round(video.durationSec / 60)) : '',
    releaseYear: video ? String(video.releaseYear) : String(new Date().getFullYear()),
    maturity: video?.maturity ?? 'TP',
    thumbnailUrl: video?.thumbnailUrl ?? '',
    backdropUrl: video?.backdropUrl ?? '',
  }
}

export function VideoForm({ video, categories, onClose, onSaved }: Props) {
  const [form, setForm] = useState(() => initialState(video))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const set = (field: keyof ReturnType<typeof initialState>) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    const key = field === 'durationMin' ? 'durationSec' : field
    setErrors((prev) => {
      if (!prev[key] && !prev.form) return prev
      const next = { ...prev }
      delete next[key]
      delete next.form
      return next
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErrors({})
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        durationSec: Math.round(Number(form.durationMin) * 60),
        releaseYear: Number(form.releaseYear),
        maturity: form.maturity,
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        backdropUrl: form.backdropUrl.trim() || null,
      }
      if (video) {
        await api.updateVideo(video.id, payload)
        onSaved(`« ${payload.title} » mis à jour.`)
      } else {
        await api.createVideo(payload)
        onSaved(`« ${payload.title} » ajouté au catalogue.`)
      }
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length > 0) setErrors(err.fields)
      else setErrors({ form: "Enregistrement impossible. L'API n'a pas répondu." })
      setBusy(false)
    }
  }

  return (
    <Drawer
      title={video ? 'Modifier le titre' : 'Ajouter un titre'}
      onClose={onClose}
      footer={
        <>
          <Button type="button" onClick={onClose} disabled={busy}>
            Annuler
          </Button>
          <Button type="submit" form="video-form" variant="primary" disabled={busy}>
            {busy ? 'Enregistrement…' : video ? 'Enregistrer' : 'Ajouter au catalogue'}
          </Button>
        </>
      }
    >
      <form id="video-form" onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
        {errors.form && (
          <p className="border border-critical/40 bg-critical/5 px-3 py-2 text-[12.5px] text-critical">
            {errors.form}
          </p>
        )}

        <Field id="title" label="Titre" error={errors.title}>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set('title')(e.target.value)}
            invalid={Boolean(errors.title)}
            autoFocus
          />
        </Field>

        <Field id="category" label="Catégorie" error={errors.category} hint="Une nouvelle catégorie est créée si elle n'existe pas.">
          <Input
            id="category"
            list="categories"
            value={form.category}
            onChange={(e) => set('category')(e.target.value)}
            invalid={Boolean(errors.category)}
          />
          <datalist id="categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            id="durationMin"
            label="Durée (minutes)"
            error={errors.durationSec && 'Durée requise, entre 1 et 1440 minutes.'}
          >
            <Input
              id="durationMin"
              type="number"
              min={1}
              max={1440}
              value={form.durationMin}
              onChange={(e) => set('durationMin')(e.target.value)}
              invalid={Boolean(errors.durationSec)}
            />
          </Field>

          <Field id="releaseYear" label="Année de sortie" error={errors.releaseYear}>
            <Input
              id="releaseYear"
              type="number"
              min={1900}
              value={form.releaseYear}
              onChange={(e) => set('releaseYear')(e.target.value)}
              invalid={Boolean(errors.releaseYear)}
            />
          </Field>
        </div>

        <Field id="maturity" label="Public visé" error={errors.maturity}>
          <Select
            id="maturity"
            value={form.maturity}
            onChange={(e) => set('maturity')(e.target.value)}
            invalid={Boolean(errors.maturity)}
          >
            {MATURITIES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="description" label="Synopsis" error={errors.description}>
          <Textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(e) => set('description')(e.target.value)}
            invalid={Boolean(errors.description)}
          />
        </Field>

        <Field id="thumbnailUrl" label="Visuel (URL)" error={errors.thumbnailUrl} hint="Laisser vide si aucun visuel.">
          <Input
            id="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={(e) => set('thumbnailUrl')(e.target.value)}
            invalid={Boolean(errors.thumbnailUrl)}
            placeholder="https://…"
          />
        </Field>

        <Field id="backdropUrl" label="Image de fond (URL)" error={errors.backdropUrl}>
          <Input
            id="backdropUrl"
            value={form.backdropUrl}
            onChange={(e) => set('backdropUrl')(e.target.value)}
            invalid={Boolean(errors.backdropUrl)}
            placeholder="https://…"
          />
        </Field>
      </form>
    </Drawer>
  )
}
