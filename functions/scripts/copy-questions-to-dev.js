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
 * Setup (one time): see functions/scripts/lib/firebaseAdmin.js
 *
 * Usage (from the functions/ directory):
 *   npm run copy-questions-to-dev
 *
 * Or directly:
 *   node scripts/copy-questions-to-dev.js
 */

const { admin, initAdminApp } = require("./lib/firebaseAdmin");

initAdminApp();
const db = admin.firestore();

const SOURCE_COLLECTION = "questions";
const TARGET_COLLECTION = "questions_dev";
const BATCH_SIZE = 400; // stays under Firestore's 500 writes/batch limit

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
