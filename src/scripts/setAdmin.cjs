const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Remplacer par l'email de l'utilisateur à promouvoir admin
const userEmail = "adrien.coudron@gmail.com";

admin.auth().getUserByEmail(userEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  })
  .then(() => {
    console.log('Rôle admin attribué avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  });
