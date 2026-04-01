export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Identifiants invalides.';
    case 'auth/email-already-in-use':
      return 'Cette adresse e-mail est déjà utilisée.';
    case 'auth/invalid-email':
      return 'Adresse e-mail invalide.';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives échouées. Veuillez réessayer plus tard.';
    default:
      return 'Une erreur est survenue lors de l\'authentification.';
  }
};
