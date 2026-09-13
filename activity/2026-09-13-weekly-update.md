---
health: onTrack
---

# Activité — 13 septembre 2026

## Épic Admin Modules (THA-257 → THA-262)

- **THA-257** — Page admin de gestion des modules finalisée (UI dédiée, API et règles Firestore)
- **THA-260** — Toggle d'activation/désactivation d'un module, branché sur le picker de la Home
- **THA-261** — Suppression restreinte aux modules vides
- **THA-262** — Blocage de la suppression d'un module non-vide avec popup explicatif
- Compteur de questions liées ajouté à la table des modules ; règles Storage pour les PDF de module déployées

## Questions & import CSV

- Table des questions filtrable par module, avec compteur pré-filtré depuis la fiche module
- Import/ajout de questions repensé pour cibler un module (au lieu d'un type par ligne CSV), aligné sur le filtre de la table
- Détection et gestion des doublons à l'import, modale de prévisualisation, nouveaux templates d'import
- Nouveau composant `SafeHtml`, isolation des données de dev via une collection de questions dynamique

## Sécurité & maintenance

- Durcissement du `.gitignore` (arrêt du tracking de `dist/`) et `npm audit fix` (root + functions)
- Réparation des mocks Firebase dans `test/setup.ts` cassés par le refactor auth

## Prochain focus

Suite de l'épic Admin Modules et consolidation de l'import CSV par module.
