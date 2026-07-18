# LUMEN — Plateforme de streaming

Application React : une interface de streaming grand public et un dashboard d'administration,
adossés à une API. Monorepo dockerisé, lancé en une commande.

- **Streaming** (`streaming/`) — consultation de contenu vidéo, design inspiré des plateformes grand public.
- **Admin** (`admin/`) — dashboard de suivi de l'activité (KPIs, graphiques, tableaux).
- **API** (`backend/`) — Express + Prisma, données simulées.

## Stack

| Couche  | Technologie                       |
| ------- | --------------------------------- |
| Fronts  | React 19, Vite, TypeScript        |
| Backend | Node, Express, TypeScript, Prisma |
| Base    | PostgreSQL 16                     |
| Run     | Docker Compose                    |

Côté front, l'UI est construite **from scratch** (aucune librairie de composants ni de graphiques),
sur un **design system en atomic design** (atoms → molecules → organisms → templates).

## Démarrage

Prérequis : **Docker** + **Docker Compose**.

```bash
docker compose up --build
```

La base est créée et peuplée automatiquement de données simulées au lancement.

| Service     | URL                          |
| ----------- | ---------------------------- |
| Streaming   | http://localhost:5173        |
| Admin       | http://localhost:5174        |
| API (santé) | http://localhost:4000/health |

Arrêt : `docker compose down` (`-v` pour effacer aussi la base).

## Structure

```
.
├── streaming/          # Front streaming (React)
├── admin/              # Dashboard admin (React)
├── backend/            # API Express + Prisma
│   ├── prisma/         # schéma + seed (données simulées)
│   └── src/            # serveur, routes
├── docker-compose.yml  # orchestration db + api + fronts
├── CLAUDE.md
└── README.md
```

## Développement hors Docker

```bash
cd streaming && npm install && npm run dev
cd admin     && npm install && npm run dev
cd backend   && npm install && npm run dev   # voir backend/.env.example
```
