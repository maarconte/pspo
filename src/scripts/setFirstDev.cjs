const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Usage: node setFirstDev.cjs <email>');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().getUserByEmail(userEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { role: 'dev' });
  })
  .then(() => {
    console.log('Rôle dev attribué avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  });
