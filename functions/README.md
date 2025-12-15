# Firebase Functions pour la gestion des rôles

Ce dossier contient les Cloud Functions Firebase pour gérer les rôles utilisateur.

## Installation

```bash
# Installer Firebase CLI globalement
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser Functions (si pas déjà fait)
firebase init functions
```

## Déploiement

```bash
# Déployer toutes les fonctions
firebase deploy --only functions

# Déployer une fonction spécifique
firebase deploy --only functions:setUserRole
```

## Fonctions disponibles

### `onUserCreated`
Trigger automatique lors de la création d'un utilisateur.
- Attribue le rôle "client" par défaut
- Crée le document utilisateur dans Firestore

### `setUserRole`
Fonction callable pour attribuer un rôle à un utilisateur.
- **Permissions** : Réservée aux devs uniquement
- **Paramètres** :
  - `userId`: ID de l'utilisateur
  - `role`: 'dev' | 'admin' | 'client'

## Utilisation côté client

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const setUserRole = httpsCallable(functions, 'setUserRole');

// Attribuer le rôle admin à un utilisateur
await setUserRole({
  userId: 'user-id-here',
  role: 'admin'
});
```

## Premier utilisateur dev

Pour créer le premier utilisateur dev, utilisez la Firebase Console :
1. Authentication > Users > Sélectionner un utilisateur
2. Ouvrir la console du navigateur (F12)
3. Exécuter :
```javascript
// Dans la console Firebase
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims('USER_UID_HERE', { role: 'dev' });
```

Ou utilisez le script `scripts/setFirstDev.js` fourni.
