# Changelog

Toutes les évolutions notables du projet sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [2.5.1] - 2026-09-14

### Corrigé

- Le temps de réponse par question continuait de s'accumuler pendant une pause du quiz (pause manuelle ou popup "Temps écoulé"), ce qui pouvait faire dépasser au "Total Time" final la durée configurée sur le module.

## [2.5.0] - 2026-09-14

### Modifié

- Le quiz applique désormais la configuration du module sélectionné (nombre de questions, durée, seuil de réussite) au lieu de valeurs fixes (80 questions / 60 min / 85 %).

## [2.4.0] - 2026-09-13

### Ajouté

- Épic Admin Modules : activation/désactivation, suppression restreinte aux modules vides, blocage de suppression avec popup explicatif, compteur de questions liées, règles Storage pour les PDF de module.
- Table des questions filtrable par module et import/ajout de questions ciblé par module (au lieu d'un type par ligne CSV).
- Détection des doublons à l'import CSV, modale de prévisualisation, nouveaux templates d'import.

### Sécurité

- Durcissement du `.gitignore` (arrêt du tracking de `dist/`) et `npm audit fix`.
