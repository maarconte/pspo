# Déploiement des Firebase Functions

## Étapes pour déployer les Cloud Functions

### 1. Configurer le projet Firebase

Depuis le répertoire racine du projet :

```bash
cd /Users/marconte/Documents/Dev.nosync/pspo
firebase use --add
```

Sélectionnez votre projet Firebase (probablement `pspo-309c0`).

### 2. Déployer les Functions

```bash
firebase deploy --only functions
```

### 3. Déployer les règles Firestore (optionnel)

```bash
firebase deploy --only firestore:rules
```

## Vérification

Après le déploiement, vérifiez dans Firebase Console :
- Functions > onUserCreated et setUserRole doivent apparaître
- Testez en créant un nouvel utilisateur via Magic Link

## Fichiers créés

- ✅ `firebase.json` : Configuration Firebase
- ✅ `firestore.indexes.json` : Index Firestore
- ✅ `functions/src/index.ts` : Cloud Functions
- ✅ `firestore.rules` : Règles de sécurité

## Alternative : Configuration manuelle

Si `firebase use --add` ne fonctionne pas, créez un fichier `.firebaserc` :

```json
{
  "projects": {
    "default": "pspo-309c0"
  }
}
```

Remplacez `pspo-309c0` par votre vrai Project ID Firebase.
