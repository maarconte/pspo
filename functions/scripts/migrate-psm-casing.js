/**
 * One-shot script: fixes a pre-existing casing bug where some "questions"
 * documents were saved with type "psm-I" (lowercase) instead of "PSM-I".
 * Home.tsx's quiz selector only ever filters on "PSM-I", so every
 * "psm-I" document was silently invisible in the PSM-I quiz.
 *
 * Updates every matching document's `type` field to "PSM-I" in place
 * (same doc IDs, no other field touched). Safe to re-run: once migrated,
 * the query that finds "psm-I" documents returns nothing.
 *
 * Setup (one time): see functions/scripts/lib/firebaseAdmin.js
 *
 * Usage (from the functions/ directory):
 *   npm run migrate-psm-casing
 *
 * Pass --collection=questions_dev to run it against the dev sandbox
 * instead of prod (defaults to "questions").
 */

const { admin, initAdminApp } = require("./lib/firebaseAdmin");

initAdminApp();
const db = admin.firestore();

const collectionArg = process.argv.find((arg) => arg.startsWith("--collection="));
const COLLECTION = collectionArg ? collectionArg.split("=")[1] : "questions";
const WRONG_VALUE = "psm-I";
const CORRECT_VALUE = "PSM-I";
const BATCH_SIZE = 400; // stays under Firestore's 500 writes/batch limit

async function main() {
  const snapshot = await db
    .collection(COLLECTION)
    .where("type", "==", WRONG_VALUE)
    .get();

  if (snapshot.empty) {
    console.log(`Aucun document "${WRONG_VALUE}" trouvé dans "${COLLECTION}".`);
    return;
  }

  console.log(
    `${snapshot.size} document(s) "${WRONG_VALUE}" trouvé(s) dans "${COLLECTION}". Migration vers "${CORRECT_VALUE}"...`
  );

  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    chunk.forEach((doc) => {
      batch.update(doc.ref, { type: CORRECT_VALUE });
    });

    await batch.commit();
    console.log(`  ${Math.min(i + BATCH_SIZE, docs.length)}/${docs.length}`);
  }

  console.log("Migration terminée.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Échec de la migration :", error);
    process.exit(1);
  });
