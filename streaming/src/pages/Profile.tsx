import { useProfile } from '../hooks/useProfile'
import { Badge } from '../design-system/atoms/Badge'
import { WatchHistory } from '../design-system/organisms/WatchHistory'
import { formatMonth, initials } from '../lib/format'

const PLAN_LABEL: Record<string, string> = {
  FREE: 'Offre Gratuite',
  STANDARD: 'Offre Standard',
  PREMIUM: 'Offre Premium',
}

type Props = {
  onOpen: (videoId: string) => void
}

export function Profile({ onOpen }: Props) {
  const { profile, history, loading, error } = useProfile(true)

  if (error) {
    return (
      <p className="px-[var(--page-x)] pt-[136px] text-center text-muted">
        Profil indisponible ({error}).
      </p>
    )
  }

  if (loading || !profile) {
    return <p className="px-[var(--page-x)] pt-[136px] text-center text-muted">Chargement du profil…</p>
  }

  const stats = [
    { label: 'Titres découverts', value: profile.stats.titles },
    { label: 'Visionnages', value: profile.stats.views },
    { label: 'Heures visionnées', value: profile.stats.watchHours },
    { label: 'Titres terminés', value: profile.stats.completed },
  ]

  return (
    <section className="px-[var(--page-x)] pb-20 pt-[112px]">
      <header className="flex flex-wrap items-center gap-6 border-b border-line pb-8">
        <span
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-card text-2xl font-bold text-on-accent"
          style={{ background: 'linear-gradient(135deg, var(--color-accent), #a8791d)' }}
          aria-hidden="true"
        >
          {initials(profile.name)}
        </span>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-dim">Mon profil</p>
          <h1 className="mt-2 text-[2rem] font-bold leading-tight">{profile.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {profile.email} · {profile.country}
          </p>
        </div>

        <div className="ml-auto text-right max-[600px]:ml-0 max-[600px]:text-left">
          <Badge variant="accent">{PLAN_LABEL[profile.plan] ?? profile.plan}</Badge>
          <p className="mt-2 text-sm text-dim">Abonné depuis {formatMonth(profile.createdAt)}</p>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 border-b border-line py-8 max-[700px]:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-[1.75rem] font-bold leading-none tabular-nums">{stat.value}</p>
            <p className="mt-2 text-sm text-dim">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="pb-4 pt-10 text-xl font-semibold">Historique de visionnage</h2>
      <WatchHistory entries={history} onOpen={onOpen} />
    </section>
  )
}
