# LeCoinBiz Admin App

Application d'administration pour gérer la plateforme LeCoinBiz avec **@react-native-firebase** et **React Query**.

## Fonctionnalités

### 1. Gestion des annonces en attente (PENDING)
- Visualiser toutes les annonces en attente de validation
- Activer une annonce et notifier l'utilisateur
- Rejeter une annonce et notifier l'utilisateur
- Cache et invalidation automatique avec React Query

### 2. Gestion des annonces signalées
- Afficher les annonces avec des signalements (reportCount > 0)
- Remettre une annonce en attente pour révision
- Suspendre une annonce
- Ignorer les signalements
- Notifier l'utilisateur concerné après chaque action

### 3. Recherche d'annonces
- Rechercher une annonce par son titre
- Afficher toutes les informations de l'annonce
- Voir le statut actuel de l'annonce
- Utilisation de React Query pour le caching

### 4. Envoi de notifications
- Envoyer des notifications générales à tous les utilisateurs
- Envoyer des notifications à un utilisateur spécifique
- Aperçu avant l'envoi

## Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configuration Firebase

#### Android
1. Télécharger le fichier `google-services.json` depuis la console Firebase
2. Placer le fichier à la racine du projet Android : `android/app/google-services.json`

#### iOS
1. Télécharger le fichier `GoogleService-Info.plist` depuis la console Firebase
2. Placer le fichier dans le projet iOS via Xcode

#### Configuration supplémentaire
Le fichier `config/firebase.ts` initialise automatiquement Firebase via `@react-native-firebase/app`. Aucune configuration manuelle n'est nécessaire.

### 3. Installer les pods (iOS uniquement)
```bash
cd ios && pod install && cd ..
```

### 4. Déployer les Cloud Functions
Les fonctions suivantes doivent être déployées sur Firebase :
- `activateAd`
- `createUserNotification`
- `createGeneralNotification`
- `reportAd`

## Lancer l'application

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios
```

## Architecture technique

### Stack technologique
- **Expo** : Framework React Native
- **@react-native-firebase** : SDK Firebase natif
- **@tanstack/react-query** : Gestion de l'état et cache
- **Expo Router** : Navigation
- **TypeScript** : Type safety

### Structure du projet

```
lecoinbiz-admin/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Navigation par onglets
│   │   ├── index.tsx            # Annonces en attente
│   │   ├── reported.tsx         # Annonces signalées
│   │   ├── search.tsx           # Recherche d'annonces
│   │   └── notifications.tsx    # Envoi de notifications
│   └── _layout.tsx              # Layout racine avec QueryProvider
├── config/
│   └── firebase.ts              # Configuration Firebase
├── hooks/
│   ├── usePendingAds.ts         # Hooks React Query pour pending ads
│   ├── useReportedAds.ts        # Hooks React Query pour reported ads
│   └── useSearchAds.ts          # Hook React Query pour la recherche
├── providers/
│   └── QueryProvider.tsx        # Provider React Query
├── services/
│   └── firebase.ts              # Services Firebase Functions
├── types/
│   └── index.ts                 # Types TypeScript
└── package.json
```

## Collections Firestore

### Ads
```typescript
{
  id: string;
  title: string;
  status: "PENDING" | "ACTIVATED" | "REJECTED" | "SUSPENDED";
  userId: string;
  // ... autres champs
}
```

### Reports
```typescript
{
  id: string;
  userId: string;
  adId: string;
  count: number;
  // ... autres champs
}
```

### Notifications
```typescript
{
  id: string;
  title: string;
  body: string;
  type: "USER_NOTIFICATION" | "GENERAL_NOTIFICATION";
  userId?: string;
  // ... autres champs
}
```

## React Query

### Configuration
Le QueryClient est configuré avec :
- **Retry** : 2 tentatives en cas d'échec
- **StaleTime** : 5 minutes
- **GcTime** : 10 minutes (garbage collection)

### Avantages
- ✅ Cache automatique des données
- ✅ Invalidation intelligente après mutations
- ✅ Refetch avec pull-to-refresh
- ✅ États de chargement gérés automatiquement
- ✅ Optimistic updates possibles

## Notifications Push

L'application utilise Firebase Cloud Messaging pour envoyer des notifications :

- **Notifications générales** : Topic `general`
- **Notifications utilisateur** : Topic `user_{userId}`

Assurez-vous que les utilisateurs sont abonnés aux topics appropriés dans l'app principale.

## Notes importantes

- L'application nécessite une authentification Firebase pour accéder aux fonctionnalités
- Les Cloud Functions doivent être déployées avant d'utiliser l'app
- Le compte admin doit avoir les permissions appropriées sur Firestore
- Pour la recherche, on parcourt toutes les annonces (considérez l'indexation pour de grandes bases)
- React Query gère automatiquement le cache et la synchronisation des données

## Sécurité

⚠️ **Important** : Cette application est destinée aux administrateurs uniquement.

Recommandations :
1. Implémenter une authentification admin
2. Ajouter des règles de sécurité Firestore appropriées
3. Restreindre l'accès aux Cloud Functions aux admins
4. Ne pas partager les credentials Firebase
5. Utiliser Firebase App Check pour sécuriser les requêtes

## Améliorations futures

- Authentification admin avec Firebase Auth
- Statistiques et tableaux de bord
- Historique des actions
- Filtres avancés
- Export de données
- Gestion des utilisateurs
- Chat support
- Optimistic updates avec React Query
- Pagination pour les listes longues
