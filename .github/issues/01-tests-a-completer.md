---
title: "Tests à compléter : atteindre au moins 70 % de couverture"
labels: tests
---

## Constat

L'API fonctionne, mais sa suite de tests est très partielle : seules les routes `GET /api/health` et `GET /api/events` sont testées, et la couverture mesurée par `npm run test:coverage` n'est que d'environ 40 %.

Les tests que je n'ai pas eu le temps d'écrire sont listés dans le dossier `tests/`, marqués « à implémenter » (`it.todo`). Le comportement attendu de chaque route est décrit dans `docs/contrat-api.md`.

## À faire

### `GET /api/events/:id`

- [ ] un événement existant est renvoyé ;
- [ ] un identifiant inconnu ou invalide renvoie une erreur `404` au format du contrat.

### `POST /api/contact`

- [ ] une demande valide est enregistrée et renvoie `201` ;
- [ ] une demande invalide renvoie `400` (`VALIDATION_ERROR`) avec le détail de chaque champ refusé ;
- [ ] un corps qui n'est pas du JSON valide renvoie `400` (`INVALID_JSON`).

### Validation des données

- [ ] chaque règle du formulaire (champs obligatoires, longueurs, type, format de l'e-mail) est testée, y compris aux limites.

### Erreurs

- [ ] une route inconnue renvoie `404` au format JSON ;
- [ ] une erreur interne renvoie `500` sans aucun détail technique.

### Couverture

- [ ] `npm test` passe entièrement ;
- [ ] `npm run test:coverage` atteint au moins 70 %.
