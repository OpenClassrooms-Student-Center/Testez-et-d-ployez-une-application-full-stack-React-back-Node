# 724 Events – API (Node.js)

API du site 724events. Elle fournit les événements affichés sur la page d'accueil et reçoit les demandes du formulaire de contact. Le contrat complet des routes, commun aux back-ends Node et PHP, est décrit dans `docs/contrat-api.md`.

## Prérequis

- Node.js >= 20.19 (version 22 recommandée, voir `.nvmrc`)

## Installation

- `npm install`
- copier `.env.example` en `.env` et adapter si besoin (`PORT`, `CORS_ORIGIN`)

## Lancement

- `npm run dev` : démarre l'API sur http://localhost:3001 et la relance à chaque modification
- `npm start` : démarre l'API sans rechargement automatique

## Routes

| Méthode | Route             | Rôle                                         |
| ------- | ----------------- | -------------------------------------------- |
| GET     | `/api/health`     | vérifie que le serveur répond                |
| GET     | `/api/events`     | événements et carrousel de la page d'accueil |
| GET     | `/api/events/:id` | détail d'un événement                        |
| POST    | `/api/contact`    | enregistre une demande de contact            |

## Tests

- `npm test` : exécute la suite de tests une fois (Vitest + Supertest)
- `npm run test:watch` : relance les tests à chaque modification
- `npm run test:coverage` : génère le rapport de couverture dans `coverage/`

### Objectif de couverture

La suite livrée ne couvre qu'environ 40 % du code : seules les routes `/api/health` et `/api/events` sont testées. Les tests restants sont listés comme « à implémenter » dans le dossier `tests/`.

**Votre objectif : atteindre au moins 70 % de couverture**, mesurée avec `npm run test:coverage`. Testez les cas nominaux comme les cas d'erreur (données invalides, ressource introuvable, erreur interne).

## Organisation du code

```
src/
  app.js            création de l'application Express (sans démarrer le serveur)
  server.js         démarrage du serveur en local
  config.js         lecture des variables d'environnement
  routes/           définition des routes
  services/         lecture des événements
  repositories/     stockage des demandes de contact (en mémoire)
  validators/       validation des données du formulaire
  middlewares/      gestion des erreurs et des routes inconnues
api/index.js        point d'entrée pour Vercel
data/events.json    données des événements
```

## Déploiement sur Vercel

Le fichier `vercel.json` redirige toutes les requêtes vers la fonction `api/index.js`, qui expose l'application Express. Définissez la variable d'environnement `CORS_ORIGIN` avec l'adresse du front déployé.
