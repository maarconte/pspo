# PSPO - Professional Scrum Product Owner Quiz

Application de quiz interactive pour la préparation à la certification Professional Scrum Product Owner (PSPO), construite avec React, TypeScript, et Firebase.

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation

```bash
npm install
```

### Configuration Firebase

1. Créez un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Créez un fichier `src/firebase.js` avec votre configuration :

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

export const Firebase = initializeApp(firebaseConfig);
```

## 📜 Scripts disponibles

### Développement

```bash
npm run dev
```

Lance l'application en mode développement avec Vite.
Ouvrez [http://localhost:3000](http://localhost:3000) pour la voir dans le navigateur.
Le serveur se recharge automatiquement lors des modifications.

### Tests

```bash
npm test              # Lance les tests avec Vitest
npm run test:ui       # Lance l'interface UI de Vitest
npm run test:coverage # Génère un rapport de couverture
```

Les tests sont configurés avec Vitest et Testing Library.

### Build & Déploiement

```bash
npm run build         # Construit l'application pour la production
npm run preview       # Prévisualise le build de production
npm run deploy        # Déploie sur GitHub Pages
```

Le build est optimisé et minifié dans le dossier `dist/`.

## 🏗️ Architecture du projet

Le projet suit une **architecture Feature-Based** pour une meilleure scalabilité et maintenabilité :

```
src/
├── features/          # Fonctionnalités métier
│   ├── admin/        # Gestion des questions (CRUD)
│   │   ├── components/
│   │   ├── hooks/
│   │   └── stores/
│   ├── auth/         # Authentification Firebase
│   │   ├── components/
│   │   ├── hooks/
│   │   └── stores/
│   └── quiz/         # Logique du quiz
│       ├── components/
│       ├── hooks/
│       └── stores/
├── ui/               # Composants UI réutilisables
│   ├── Button/
│   ├── Input/
│   ├── Table/
│   └── ...
├── pages/            # Pages de l'application
├── utils/            # Utilitaires partagés
│   └── hooks/        # Hooks Firebase génériques
├── stores/           # Stores Zustand globaux
├── assets/           # Ressources statiques
│   └── scss/         # Styles globaux
└── lib/              # Configurations tierces
```

## 🛠️ Stack technique

### Core
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **React Router** - Routing

### State Management
- **Zustand** - Gestion d'état globale
- **React Query** - Gestion des données asynchrones

### Backend & Database
- **Firebase** - Authentication & Firestore
- **FirebaseUI** - UI d'authentification

### UI & Styling
- **SCSS** - Préprocesseur CSS
- **Lucide React** - Icônes modernes
- **RSuite** - Composants UI
- **React Toastify** - Notifications

### Forms & Data
- **Formik** - Gestion de formulaires
- **TanStack Table** - Tables de données
- **PapaParse** - Parsing CSV

### Testing
- **Vitest** - Framework de test
- **Testing Library** - Tests de composants
- **jsdom** - Environnement DOM pour les tests

## 🎨 Fonctionnalités

### Mode Quiz
- Questions à choix multiples
- Feedback immédiat
- Système de scoring
- Signalement de questions
- Commentaires sur les questions

### Mode Admin
- CRUD complet des questions
- Import/Export CSV
- Gestion des types de réponses
- Tableau de bord avec filtres et recherche
- Édition en ligne

### Authentification
- Connexion Firebase
- Gestion des sessions
- Protection des routes admin

## 🚢 Déploiement sur GitHub Pages

Le projet est configuré pour être déployé sur GitHub Pages :

1. Configurez le `homepage` dans `package.json` :
   ```json
   "homepage": "https://[USERNAME].github.io/[REPO_NAME]/"
   ```

2. Déployez avec :
   ```bash
   npm run deploy
   ```

Le script `predeploy` construit automatiquement l'application avant le déploiement.

## 📝 Configuration Vite

Le projet utilise Vite avec les configurations suivantes :
- Port de développement : `3000`
- Base URL : `/pspo/` (pour GitHub Pages)
- Ouverture automatique du navigateur
- Sourcemaps activés en production

## 🧪 Configuration des tests

Vitest est configuré avec :
- Environnement jsdom
- Globals activés
- Support CSS
- Coverage avec v8
- Exclusion des fichiers de test du coverage

## 📄 License

Ce projet est privé et destiné à un usage personnel.

## 🤝 Contribution

Pour contribuer :
1. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
2. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
3. Pushez vers la branche (`git push origin feature/AmazingFeature`)
4. Ouvrez une Pull Request

---

**Version actuelle :** 2.2.0
