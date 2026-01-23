const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Remplacer par l'email de l'utilisateur à définir comme client
const userEmail = "user@example.com";

admin.auth().getUserByEmail(userEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { role: 'client' });
  })
  .then(() => {
    console.log('Rôle client attribué avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  });
