import { PrismaClient, Plan } from '@prisma/client'

const prisma = new PrismaClient()

const CATALOG: { title: string; category: string; year: number }[] = [
  { title: 'Horizon Perdu', category: 'Science-fiction', year: 2023 },
  { title: 'La Dernière Frontière', category: 'Science-fiction', year: 2021 },
  { title: 'Nébuleuse', category: 'Science-fiction', year: 2024 },
  { title: 'Signal', category: 'Science-fiction', year: 2020 },
  { title: 'Orbite Basse', category: 'Science-fiction', year: 2022 },
  { title: 'Au-delà des Étoiles', category: 'Science-fiction', year: 2019 },
  { title: 'Code Rouge', category: 'Action', year: 2023 },
  { title: 'Point de Rupture', category: 'Action', year: 2024 },
  { title: 'Onde de Choc', category: 'Action', year: 2022 },
  { title: 'La Traque', category: 'Action', year: 2021 },
  { title: 'Zone Franche', category: 'Action', year: 2020 },
  { title: 'Le Grand Saut', category: 'Action', year: 2018 },
  { title: 'Éclats de Rire', category: 'Comédie', year: 2023 },
  { title: 'Voisins Impossibles', category: 'Comédie', year: 2022 },
  { title: 'Un Été à Trop', category: 'Comédie', year: 2021 },
  { title: 'Rendez-vous Manqué', category: 'Comédie', year: 2024 },
  { title: 'La Coloc', category: 'Comédie', year: 2019 },
  { title: 'Racines', category: 'Drame', year: 2022 },
  { title: 'Le Silence des Montagnes', category: 'Drame', year: 2023 },
  { title: 'Mémoires Oubliées', category: 'Drame', year: 2020 },
  { title: 'La Ville Endormie', category: 'Drame', year: 2021 },
  { title: 'Lignes de Faille', category: 'Drame', year: 2024 },
  { title: 'Marée Haute', category: 'Drame', year: 2018 },
  { title: 'Planète Bleue', category: 'Documentaire', year: 2023 },
  { title: 'Au Cœur des Océans', category: 'Documentaire', year: 2022 },
  { title: 'Villes du Futur', category: 'Documentaire', year: 2024 },
  { title: 'Mémoire du Monde', category: 'Documentaire', year: 2021 },
  { title: 'Vies Sauvages', category: 'Documentaire', year: 2020 },
  { title: 'Nuits Électriques', category: 'Thriller', year: 2023 },
  { title: 'Tempête Numérique', category: 'Thriller', year: 2022 },
  { title: "L'Heure Trouble", category: 'Thriller', year: 2024 },
  { title: 'Sans Issue', category: 'Thriller', year: 2021 },
  { title: 'Le Témoin', category: 'Thriller', year: 2019 },
  { title: 'Fréquence Interdite', category: 'Thriller', year: 2020 },
]

const COUNTRIES = ['FR', 'US', 'DE', 'ES', 'GB', 'IT', 'BE', 'CA']
const PLANS: Plan[] = [Plan.FREE, Plan.STANDARD, Plan.PREMIUM]

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const img = (title: string, w: number, h: number) =>
  `https://picsum.photos/seed/${encodeURIComponent(title)}/${w}/${h}`

async function main() {
  await prisma.viewEvent.deleteMany()
  await prisma.video.deleteMany()
  await prisma.user.deleteMany()

  const videos = await Promise.all(
    CATALOG.map((v) =>
      prisma.video.create({
        data: {
          title: v.title,
          category: v.category,
          releaseYear: v.year,
          description: `Synopsis fictif du contenu « ${v.title} ». Une histoire ${v.category.toLowerCase()} portée par des personnages marquants.`,
          durationSec: randInt(24, 158) * 60,
          thumbnailUrl: img(v.title, 400, 600),
          backdropUrl: img(v.title, 1280, 720),
          maturity: pick(['TP', '-12', '-16']),
        },
      }),
    ),
  )

  const users = await Promise.all(
    Array.from({ length: 60 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          name: `Utilisateur ${i + 1}`,
          plan: pick(PLANS),
          country: pick(COUNTRIES),
        },
      }),
    ),
  )

  const events = Array.from({ length: 1800 }).map(() => {
    const video = pick(videos)
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - randInt(0, 29))
    const watchedSec = randInt(60, video.durationSec)
    return {
      userId: pick(users).id,
      videoId: video.id,
      watchedSec,
      completed: watchedSec > video.durationSec * 0.9,
      createdAt,
    }
  })
  await prisma.viewEvent.createMany({ data: events })

  console.log(
    `Seed: ${videos.length} vidéos, ${users.length} utilisateurs, ${events.length} visionnages.`,
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
