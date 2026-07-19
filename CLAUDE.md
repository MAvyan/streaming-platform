# CLAUDE.md — LUMEN

Guide de travail sur ce dépôt. Lu au démarrage de chaque session.

## Projet

Plateforme de streaming (LUMEN) : deux interfaces React + une API.

- **`streaming/`** — interface grand public de consultation de contenu vidéo. Design inspiré des plateformes de streaming (Netflix-like).
- **`admin/`** — dashboard de suivi d'activité (KPIs, graphiques, tableaux).
- **`backend/`** — API REST servant des données simulées aux deux fronts.

## Parti-pris front

- **From scratch** : aucune librairie de composants UI ni de graphiques. Les composants,
  le routing et les graphiques (SVG) sont écrits à la main.
- **Atomic design** : le design system est organisé en `atoms → molecules → organisms → templates`.
- **Styling = Tailwind v4** (`@tailwindcss/vite`). Les tokens (couleurs, typo, radius) vivent dans
  le bloc `@theme` de `src/index.css` de chaque app → utilitaires `bg-bg`, `text-accent`, `font-sans`…
  Pas de `.css` par composant : un seul `index.css` par app (theme + quelques cas non triviaux :
  dégradés/scrims, keyframes, colonnes de carrousel, variables de séries dataviz).
- Streaming : design "Lumen" (fond `#0c0c0e`, accent or `#f2c74c`, Hanken Grotesk).
  Admin : registre outil sobre (accent bleu `#3987e5`).

## Architecture

Monorepo, 3 projets orchestrés par `docker-compose.yml`.

| Projet      | Stack                         | Port | Rôle                     |
| ----------- | ----------------------------- | ---- | ------------------------ |
| `streaming` | React 19 + Vite + TypeScript  | 5173 | Front streaming          |
| `admin`     | React 19 + Vite + TypeScript  | 5174 | Front dashboard admin    |
| `backend`   | Express + TypeScript + Prisma | 4000 | API REST                 |
| `db`        | PostgreSQL 16                 | 5433 | Base (5433 côté hôte)    |

Les fronts appellent `/api/*` ; le proxy Vite relaie vers `http://backend:4000` (voir `vite.config.ts`).

## Commandes

```bash
docker compose up --build          # tout lancer (seed automatique)
docker compose down                # arrêter
docker compose down -v && docker compose up --build   # base vierge
```

Hors Docker : `npm install && npm run dev` dans chaque projet (le backend requiert un Postgres, voir `backend/.env.example`).

## Backend

- Entrée `src/server.ts` → `src/app.ts` (montage des routes).
- Routes : `src/routes/videos.ts` (catalogue), `src/routes/stats.ts` (KPIs).
- Client Prisma partagé : `src/prisma.ts`. Schéma : `prisma/schema.prisma`. Seed : `prisma/seed.ts`.
- Schéma appliqué via `prisma db push` en Docker (pas de migrations à ce stade).

Endpoints : `/api/videos` (`?category=`), `/api/videos/:id`, `/api/videos/categories`,
`/api/stats/overview|top-videos|by-category|by-plan|views-over-time`.

## Conventions

- TypeScript strict, ESM (imports backend relatifs en `.js`).
- Commentaires rares, uniquement sur la logique non évidente.
- Commits fréquents et granulaires, style `(feat) add home header`, `(fix) ...`, `(chore) ...`.
- Pas de secret en dur (variables d'environnement).
- Responsive desktop + mobile sur les deux fronts.
