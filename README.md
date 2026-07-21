# LUMEN — Plateforme de streaming

Application React : une interface de streaming grand public et un dashboard d'administration,
adossés à une API. Monorepo dockerisé, lancé en une commande.

- **Streaming** (`streaming/`) — consultation de contenu vidéo, design inspiré des plateformes grand public.
- **Admin** (`admin/`) — dashboard de suivi de l'activité et gestion du catalogue.
- **API** (`backend/`) — Express + Prisma, données simulées.

## Stack

| Couche  | Technologie                       |
| ------- | --------------------------------- |
| Fronts  | React 19, Vite, TypeScript        |
| Backend | Node, Express, TypeScript, Prisma |
| Base    | PostgreSQL 16                     |
| Run     | Docker Compose                    |
| CI      | GitHub Actions                    |

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

## Fonctionnalités

**Streaming** — hero, carrousels par catégorie, recherche, fiche détaillée en modale,
lecteur simulé, page profil (`#/profil`) avec offre, compteurs et historique de visionnage
à progression réelle.

**Admin** — vue d'ensemble (courbe des visionnages sur 30 jours, indicateurs, répartition
par catégorie et par offre, top des titres) et page Contenus : recherche, filtre, pagination,
création / modification / suppression d'un titre.

## API

| Méthode              | Route                                                            |
| -------------------- | ---------------------------------------------------------------- |
| `GET`                | `/api/videos` (`?category=`), `/api/videos/:id`, `/api/videos/categories` |
| `POST/PATCH/DELETE`  | `/api/videos`, `/api/videos/:id`                                  |
| `GET`                | `/api/stats/overview\|top-videos\|by-category\|by-plan\|views-over-time` |
| `GET`                | `/api/users/me`, `/api/users/me/history`                          |

Les écritures sont validées côté serveur et renvoient `400 { errors: { champ: message } }`,
que le formulaire admin réaffiche champ par champ.

## Intégration continue

Workflow unique : [`.github/workflows/ci.yml`](.github/workflows/ci.yml), déclenché sur
**push vers `main`** et sur **chaque pull request**.

Les trois projets tournent en **matrice parallèle** (`streaming`, `admin`, `backend`) avec
`fail-fast: false` : un projet en échec n'annule pas les deux autres, on voit d'un coup tout
ce qui casse. Chaque job enchaîne :

| Étape                     | Outil                          |
| ------------------------- | ------------------------------ |
| Installation              | `npm ci` (Node 22, cache npm par lockfile) |
| Client Prisma (backend)   | `prisma generate`              |
| Lint                      | `oxlint`                       |
| Build                     | `tsc` + `vite build`           |
| Tests + couverture        | `vitest run --coverage`        |

Les rapports de couverture sont publiés en artefacts (`coverage-<projet>`), y compris quand
le job échoue, pour pouvoir les consulter depuis l'exécution.

Deux points à connaître :

- Le workflow force `npm install -g npm@latest` avant l'installation. Les versions plus
  anciennes de npm n'installent pas les dépendances optionnelles natives ([npm/cli#4828](https://github.com/npm/cli/issues/4828)),
  ce qui privait la CI des binaires de plateforme d'`oxlint` et de `rollup`.
- **Il n'y a pas d'étape de déploiement.** Aucun environnement cible n'est provisionné pour ce
  projet ; la livraison s'arrête à la validation. Le déploiement se brancherait ici, après le job
  `quality` : build des images Docker, push vers un registre, puis application sur l'hébergeur.

Les tests d'API n'ont **pas besoin de base de données** : le client Prisma est remplacé par un
mock, ce qui garde la CI rapide et sans service externe à démarrer.

## Choix techniques

**Tout est écrit à la main.** Pas de librairie de composants, pas de librairie de graphiques,
pas de routeur. Les courbes et barres sont du **SVG** construit à la main, le routing est un
petit routeur par hash (`useRoute` côté admin, `useHashRoute` côté streaming), les modales,
tiroirs et formulaires sont des composants du design system. C'est le sujet même de l'exercice :
montrer la maîtrise du DOM, du SVG et du CSS plutôt que l'assemblage de paquets.

**Atomic design.** Chaque front range son design system en `atoms → molecules → organisms →
templates`, les pages composant ces briques. Un composant ne descend jamais dans le niveau
au-dessus de lui.

**Tailwind v4, tokens dans `@theme`.** Une seule feuille `index.css` par application : les
tokens (couleurs, typo, rayons) y sont déclarés dans `@theme` et deviennent des utilitaires
(`bg-bg`, `text-accent`, `font-sans`). Pas de CSS par composant ; seuls les cas non triviaux
(dégradés, scrims, keyframes, pistes de carrousel, variables de séries dataviz) restent en CSS
global.

**Deux identités, une famille.** Le streaming est sombre et cinéma (fond `#0c0c0e`, accent or) ;
l'admin est une console en registre clair, sans cartes : une surface continue découpée par des
filets d'un pixel. Les deux partagent Montserrat, ce qui les rattache à la même maison sans les
confondre.

**Dataviz sobre et honnête.** Une seule teinte par graphique — un arc-en-ciel sur des catégories
n'encode rien —, une rampe ordinale à teinte unique pour les offres, la couleur signal réservée
aux repères (moyenne). Aucun indicateur inventé : les mesures secondaires des tuiles sont
dérivées des séries renvoyées par l'API.

**TypeScript strict, ESM.** Le backend importe en `.js` (résolution ESM native), aucun `any`
dans le code applicatif, les entrées d'API sont typées et validées à la main plutôt qu'avec un
schéma tiers — cohérent avec le parti-pris « sans librairie ».

**Prisma sans migrations.** Le schéma est appliqué par `prisma db push` au démarrage du
conteneur, et le seed peuple la base de données simulées. À ce stade, un historique de
migrations apporterait de la cérémonie sans bénéfice ; il deviendrait nécessaire dès qu'une
base de production existerait.

**Tests.** Vitest partout. Testing Library sur les fronts, Supertest + client Prisma mocké côté
API. L'effort porte sur la logique qui peut casser en silence : validation des écritures,
pagination et bornes, formatage, contrat des appels réseau.

## Perspectives d'évolution

### Livraison continue

La CI s'arrête à la validation. Le prolongement naturel, dans l'ordre où il faudrait le traiter :

1. **Migrations versionnées d'abord.** Tant que le schéma est appliqué par `prisma db push`,
   aucun déploiement automatique n'est sûr : un champ renommé efface des données. Passer à
   `prisma migrate` et exécuter `prisma migrate deploy` avant la mise en ligne est le préalable
   à tout le reste.
2. **Publication d'images.** Un job `release` après `quality` : build des trois images Docker,
   tag par SHA de commit (et par version sur un tag `v*`), publication sur GitHub Container
   Registry avec cache de couches entre exécutions.
3. **Deux environnements.** Préproduction déployée à chaque merge sur `main`, production
   déclenchée par un tag et protégée par un *environment* GitHub avec approbation manuelle.
   Les secrets (`DATABASE_URL` en tête) vivent dans l'environnement, jamais dans les images.
4. **Vérification et retour arrière.** `/health` est déjà exposé : le déploiement peut attendre
   une réponse saine avant de basculer le trafic, et le retour arrière consiste à redéployer le
   tag précédent, puisque les images sont immuables.

Côté qualité, quelques ajouts utiles avant d'ouvrir la porte à la production : un seuil minimal
de couverture, des tests d'intégration API contre une vraie base Postgres (service du workflow),
des tests de bout en bout sur les parcours clés (recherche, CRUD d'un titre, profil), un scan de
vulnérabilités des dépendances et des images, et Dependabot pour ne pas dériver.

### Sécuriser les écritures

Limitation connue et assumée à ce stade : **les routes d'écriture du catalogue ne sont pas
protégées**, et `/api/users/me` renvoie le premier abonné du seed faute d'authentification.
Avant tout déploiement réel, il faut une authentification (session ou JWT), des rôles
(`admin` pour les écritures) et une limitation de débit sur les endpoints de mutation.

### Fonctionnalités envisagées

**Streaming** — comptes et profils multiples, « Ma liste » de favoris, reprise de lecture réelle
(le lecteur enregistrerait un `ViewEvent` plutôt que de simuler), recommandations déduites de
l'historique par catégorie, contrôle parental appuyé sur le champ `maturity` déjà présent,
chargement progressif du catalogue et images responsives.

**Admin** — les pages Audience et Temps de visionnage, retirées du menu tant qu'elles n'existent
pas ; un sélecteur de période sur la vue d'ensemble, aujourd'hui figée sur 30 jours ; tri des
colonnes et actions groupées sur le catalogue ; téléversement d'image plutôt qu'une URL à coller ;
export CSV et journal des modifications.

**API** — pagination côté serveur (`?page`, `?limit`) : elle est actuellement calculée dans le
navigateur, ce qui tient pour quelques dizaines de titres mais pas au-delà ; mise en cache
conditionnelle (`ETag`) sur le catalogue ; et des statistiques calculées par requêtes SQL
agrégées plutôt qu'en mémoire, quand le volume de visionnages augmentera.

## Structure

```
.
├── streaming/          # Front streaming (React)
├── admin/              # Dashboard admin (React)
├── backend/            # API Express + Prisma
│   ├── prisma/         # schéma + seed (données simulées)
│   └── src/            # serveur, routes
├── .github/workflows/  # intégration continue
├── docker-compose.yml  # orchestration db + api + fronts
└── README.md
```

Les fronts appellent `/api/*` ; le proxy Vite relaie vers le backend (voir `vite.config.ts`).

## Développement hors Docker

```bash
cd streaming && npm install && npm run dev
cd admin     && npm install && npm run dev
cd backend   && npm install && npm run dev   # voir backend/.env.example
```

Dans chaque projet : `npm run lint`, `npm run build`, `npm test`, `npm run test:coverage`.
