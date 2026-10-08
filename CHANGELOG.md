# Changelog

Toutes les évolutions notables du projet sont documentées ici.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [2.8.1] - 2026-10-08

### Modifié

- Les onglets latéraux Co-op, Docs et Links ont tous la même hauteur (100 px), sont espacés de façon identique (16 px) et forment un groupe centré verticalement sur l'écran.
- L'onglet « Liens utiles » est renommé « Links » dans l'interface.

## [2.8.0] - 2026-10-08

### Ajouté

- Notifications par email pour les tickets de bug : l'auteur est prévenu quand le statut de son ticket change (sauf s'il l'a changé lui-même) et quand une réponse lui est envoyée. Nouvelles Cloud Functions `onTicketStatusChanged` et `onTicketMessageCreated`, et champ `updatedBy` enregistré à chaque modification d'un ticket.
- Spinner d'affichage de la capture d'écran d'un ticket pendant son chargement.
- Séparation des modules production / développement : collection `modules_dev` utilisée par `npm run dev` (surchargeable via `VITE_FIREBASE_MODULES_COLLECTION`), règles Firestore associées et script `scripts/copy-modules-to-dev.mjs` pour copier les modules de prod.

### Modifié

- La sélection du module sur la page d'accueil utilise désormais un menu déroulant (`Select`) au lieu d'un contrôle segmenté.
- La session de connexion est conservée entre les onglets et à la fermeture du navigateur (persistance locale), pour qu'un lien externe, comme celui d'un email de notification, arrive sur un utilisateur déjà connecté. La déconnexion après 30 minutes d'inactivité reste active.

### Corrigé

- L'envoi d'une capture d'écran de ticket est annulé au bout de 30 secondes avec un message explicite (un VPN ou un proxy d'entreprise peut bloquer Firebase Storage), au lieu de rester sur « Envoi en cours… ». Un message s'affiche aussi quand une capture ne peut pas être chargée.

## [2.7.0] - 2026-10-06

### Ajouté

- Links par module (THA-596) : un éditeur de texte riche (gras, italique, listes, liens) dans la modale « Edit module », sous le support de cours PDF. Si le champ est renseigné, un onglet « Links » apparaît sur le côté pendant le choix du module et le parcours d'examen ; il déplie un volet affichant le texte mis en forme, les liens s'ouvrant dans un nouvel onglet. Champ vide = pas d'onglet.

## [2.6.0] - 2026-10-06

### Modifié

- L'ordre des réponses possibles est désormais mélangé aléatoirement à chaque session : une même question n'affiche plus ses réponses dans le même ordre d'une session à l'autre. Les bonnes réponses et les explications restent correctement associées.

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
