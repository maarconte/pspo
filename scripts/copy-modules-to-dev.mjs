#!/usr/bin/env node
/**
 * Copies the `modules` collection (production) into `modules_dev` (used by
 * `npm run dev`), keeping the same document IDs.
 *
 * Usage:
 *   node scripts/copy-modules-to-dev.mjs            # skip modules already in modules_dev
 *   node scripts/copy-modules-to-dev.mjs --force    # overwrite existing modules_dev docs
 *   node scripts/copy-modules-to-dev.mjs --dry-run  # only print what would happen
 *
 * Auth: firebase-admin Application Default Credentials, i.e. either
 *   gcloud auth application-default login
 * or GOOGLE_APPLICATION_CREDENTIALS pointing to a service account key.
 */
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SOURCE = "modules";
const TARGET = "modules_dev";
const PROJECT_ID = "pspo-309c0";

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const [source, target] = await Promise.all([
  db.collection(SOURCE).get(),
  db.collection(TARGET).get(),
]);
const existing = new Set(target.docs.map((d) => d.id));

const batch = db.batch();
let copied = 0;
let skipped = 0;

for (const doc of source.docs) {
  const title = doc.get("title") ?? doc.id;
  if (existing.has(doc.id) && !force) {
    console.log(`skip     ${title} (already in ${TARGET})`);
    skipped++;
    continue;
  }
  console.log(`${existing.has(doc.id) ? "overwrite" : "copy    "} ${title}`);
  batch.set(db.collection(TARGET).doc(doc.id), doc.data());
  copied++;
}

if (!dryRun && copied > 0) await batch.commit();

console.log(
  `\n${dryRun ? "[dry-run] " : ""}${copied} copied, ${skipped} skipped (${SOURCE} -> ${TARGET})`
);
