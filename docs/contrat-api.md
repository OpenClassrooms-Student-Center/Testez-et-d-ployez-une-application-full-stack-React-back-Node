# Contrat d'API – 724events

Ce contrat est **commun aux deux back-ends** (option A : Node.js, option B : PHP).
Le front-end ne doit dépendre que de ce document : n'importe lequel des deux back-ends doit pouvoir le servir sans modification.

## Généralités

| Élément | Valeur |
|---|---|
| URL de base | variable d'environnement du front `VITE_API_URL` (ex. `http://localhost:3001`) |
| Préfixe | toutes les routes commencent par `/api` |
| Format | JSON en UTF-8 (`Content-Type: application/json; charset=utf-8`) |
| CORS | origines autorisées configurées côté serveur (`CORS_ORIGIN`, liste séparée par des virgules) ; les requêtes préalables `OPTIONS` reçoivent une réponse `204` |
| Corps des requêtes | lu uniquement s'il est envoyé avec `Content-Type: application/json` ; il doit être un objet ou un tableau JSON |
| Dates | chaînes ISO 8601 en UTC (`2022-04-29T20:28:45.744Z`) |

### Format des erreurs

Toute réponse d'erreur (4xx, 5xx) a la même forme :

```json
{
  "error": "CODE_EN_MAJUSCULES",
  "message": "Message lisible en français"
}
```

Les erreurs de validation ajoutent un tableau `details` :

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Les données envoyées sont invalides",
  "details": [
    { "field": "email", "message": "L'adresse e-mail est invalide" }
  ]
}
```

| Code HTTP | `error` | Cas |
|---|---|---|
| 400 | `INVALID_JSON` | corps de requête qui n'est pas du JSON valide |
| 400 | `VALIDATION_ERROR` | données refusées par la validation |
| 404 | `NOT_FOUND` | ressource ou route inexistante, ou méthode non prévue sur une route existante |
| 413 | `PAYLOAD_TOO_LARGE` | corps de requête de plus de 10 Ko |
| 500 | `INTERNAL_ERROR` | erreur inattendue (aucun détail technique ni pile d'appel n'est renvoyé) |

---

## `GET /api/health`

Vérifie que le serveur répond.

**200**
```json
{ "status": "ok" }
```

---

## `GET /api/events`

Renvoie les données affichées sur la page d'accueil : la liste des réalisations et les événements mis en avant dans le carrousel. La structure est identique à celle de l'ancien fichier `events.json`.

**200**
```json
{
  "events": [
    {
      "id": 1,
      "type": "conférence",
      "date": "2022-04-29T20:28:45.744Z",
      "title": "User&product MixUsers",
      "cover": "/images/alexandre-pellaes-6vAjp0pscX0-unsplash.png",
      "description": "Présentation des nouveaux usages UX.",
      "nb_guesses": 900,
      "periode": "14-15-16 Avril",
      "prestations": ["1 espace d’exposition", "1 scéne principale"]
    }
  ],
  "focus": [
    {
      "title": "World economic forum",
      "description": "Oeuvre à la coopération entre le secteur public et le privé.",
      "date": "2022-01-29T20:28:45.744Z",
      "cover": "/images/evangeline-shaw-nwLTVwb7DbU-unsplash1.png"
    }
  ]
}
```

| Champ d'un `event` | Type | Remarque |
|---|---|---|
| `id` | entier | unique |
| `type` | chaîne | catégorie, sert au filtre du front |
| `date` | chaîne ISO 8601 | |
| `title`, `description`, `periode` | chaîne | |
| `cover` | chaîne | chemin d'image servi par le front (`/images/...`) |
| `nb_guesses` | entier | nombre de participants |
| `prestations` | tableau de chaînes | |

L'ordre des tableaux n'est **pas garanti** par l'API : c'est au front de trier selon ses besoins.

---

## `GET /api/events/:id`

Renvoie un événement de la liste `events`.

**200** : l'objet `event` (même forme que ci-dessus).

**404**
```json
{ "error": "NOT_FOUND", "message": "Événement introuvable" }
```
Un identifiant qui n'est pas un entier renvoie aussi `404`.

---

## `POST /api/contact`

Enregistre une demande envoyée depuis le formulaire de contact.

**Corps de la requête**
```json
{
  "lastName": "Dupont",
  "firstName": "Marie",
  "type": "entreprise",
  "email": "marie.dupont@example.com",
  "message": "Bonjour, nous souhaitons organiser un séminaire de 80 personnes."
}
```

| Champ | Type | Règles |
|---|---|---|
| `lastName` | chaîne | obligatoire, 1 à 100 caractères après suppression des espaces en début et fin |
| `firstName` | chaîne | obligatoire, 1 à 100 caractères après suppression des espaces |
| `type` | chaîne | obligatoire, `"personnel"` ou `"entreprise"` |
| `email` | chaîne | obligatoire, adresse e-mail valide, 254 caractères maximum |
| `message` | chaîne | obligatoire, 10 à 2000 caractères après suppression des espaces |

Les champs inconnus sont ignorés. Toutes les erreurs de validation sont renvoyées en une seule fois dans `details`.

**201**
```json
{
  "id": "3f1c2a7e-5b8d-4e7a-9c1f-2b6d8e4a1c90",
  "receivedAt": "2026-10-19T09:30:00.000Z"
}
```

**400** : `VALIDATION_ERROR` (avec `details`) ou `INVALID_JSON`.
**413** : `PAYLOAD_TOO_LARGE`.

> Le stockage des demandes est volontairement simple et **non durable** : en mémoire pour Node (perdu au redémarrage), dans un fichier `var/contacts.json` pour PHP (qui repart de zéro à chaque requête). Aucun e-mail n'est envoyé. Un vrai service de stockage ou d'envoi d'e-mails pourra être branché plus tard derrière la même route sans changer le contrat.
