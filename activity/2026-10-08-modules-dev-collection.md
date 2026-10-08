---
health: onTrack
---

# Activité — 8 octobre 2026

## Séparation modules prod / dev (branche `feature/modules-dev-collection`)

- Page d'accueil : la sélection du module passe d'un contrôle segmenté à un `Select`
- Les modules suivent désormais la même séparation que les questions : collection `modules_dev` avec `npm run dev`, `modules` en production — nouvelle constante `MODULES_COLLECTION`, surchargeable via `VITE_FIREBASE_MODULES_COLLECTION`
- Règles Firestore : nouveau bloc `modules_dev` (mêmes règles que `modules`), déployé sur le projet Firebase
- Nouveau script `scripts/copy-modules-to-dev.mjs` (options `--dry-run` / `--force`) pour copier les modules de prod vers `modules_dev` ; 5 modules copiés
- À noter : les PDF restent dans le même chemin Storage pour dev et prod
- Reste à faire : tests manuels puis finish de la feature
