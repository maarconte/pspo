const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Get user email from command line arguments
const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide an email address as an argument.');
  console.error('Usage: node setAdmin.cjs <email>');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().getUserByEmail(userEmail)
  .then(user => {
    return admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
  })
  .then(() => {
    console.log(`Rôle admin attribué avec succès à ${userEmail}`);
    process.exit(0);
  })
  .catch(error => {
    console.error('Erreur:', error);
    process.exit(1);
  });
