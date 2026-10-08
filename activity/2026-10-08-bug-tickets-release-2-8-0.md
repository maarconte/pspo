---
health: onTrack
---

# Activité — 8 octobre 2026 (suite)

## Gestion des tickets de bug (v2.8.0)

- Notifications par email : l'auteur d'un ticket est prévenu quand son statut change (sauf s'il l'a changé lui-même) et quand une réponse lui est envoyée — nouvelles Cloud Functions `onTicketStatusChanged` / `onTicketMessageCreated`, via le SMTP déjà utilisé pour les liens de connexion
- Spinner pendant le chargement de la capture d'écran d'un ticket
- Postes derrière un VPN / proxy d'entreprise (erreur 407 sur Firebase Storage) : l'envoi d'image est annulé après 30 s avec un message explicite, et un message s'affiche quand une capture ne charge pas. Le blocage lui-même doit être levé côté réseau (liste blanche des domaines Google/Firebase)
- Connexion conservée entre les onglets et à la fermeture du navigateur, pour que le lien du mail de notification arrive sur un utilisateur déjà connecté (déconnexion à 30 min d'inactivité inchangée)
- Page d'accueil : sélection du module via un menu déroulant
- Modules : séparation prod / dev (`modules_dev`), règles Firestore déployées, script de copie `scripts/copy-modules-to-dev.mjs`
- Release v2.8.0
