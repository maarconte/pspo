/**
 * One-shot script: copies every document from the "questions" collection
 * to "questions_dev", preserving document IDs and fields (including
 * createdAt/updatedAt timestamps).
 *
 * Read-only on "questions", write-only (upsert) on "questions_dev" — it
 * never touches published data. Safe to re-run: it just overwrites
 * "questions_dev" with the current prod content again, it does not delete
 * anything else you may have added there via CSV import testing.
 *
 * Setup (one time):
 *   1. Firebase Console > Project settings > Service accounts >
 *      "Generate new private key".
 *   2. Save the downloaded file as functions/serviceAccountKey.json
 *      (already covered by .gitignore, never commit it).
 *
 * Usage (from the functions/ directory):
 *   npm run copy-questions-to-dev
 *
 * Or directly:
 *   node scripts/copy-questions-to-dev.js
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const SOURCE_COLLECTION = "questions";
const TARGET_COLLECTION = "questions_dev";
const BATCH_SIZE = 400; // stays under Firestore's 500 writes/batch limit

// The local key always wins over GOOGLE_APPLICATION_CREDENTIALS: that env
// var is often set globally in a shell for a different project, and using
// it by mistake here would write into the wrong Firebase project.
const LOCAL_SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  "..",
  "serviceAccountKey.json"
);
const serviceAccountPath = fs.existsSync(LOCAL_SERVICE_ACCOUNT_PATH)
  ? LOCAL_SERVICE_ACCOUNT_PATH
  : process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  console.error(
    `Clé de service account introuvable.\n` +
      `Place-la dans functions/serviceAccountKey.json (Firebase Console > ` +
      `Paramètres du projet > Comptes de service > Générer une nouvelle clé ` +
      `privée), ou définis GOOGLE_APPLICATION_CREDENTIALS vers son chemin.`
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

async function main() {
  const snapshot = await db.collection(SOURCE_COLLECTION).get();

  if (snapshot.empty) {
    console.log(`Aucun document trouvé dans "${SOURCE_COLLECTION}".`);
    return;
  }

  console.log(
    `Copie de ${snapshot.size} question(s) de "${SOURCE_COLLECTION}" vers "${TARGET_COLLECTION}"...`
  );

  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach((doc) => {
      batch.set(db.collection(TARGET_COLLECTION).doc(doc.id), doc.data());
    });

    await batch.commit();
    console.log(`  ${Math.min(i + BATCH_SIZE, docs.length)}/${docs.length}`);
  }

  console.log("Copie terminée.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Échec de la copie :", error);
    process.exit(1);
  });
