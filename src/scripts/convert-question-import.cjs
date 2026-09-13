/**
 * Converts a source question-bank CSV (columns: Question, Question Type,
 * Answer Option 1..6, Explanation 1..6, Correct Answers, Overall Explanation,
 * Domain — comma or semicolon delimited, BOM tolerated) into this project's
 * question-import CSV format (title, feedback, answerType, type, domain,
 * answer1..6, explanation1..6, correctAnswer). See
 * public/templates/questions-import-template.csv for the target format.
 *
 * "Question Type" "multi-select" -> answerType "M", everything else -> "S",
 * EXCEPT a row whose only two options are exactly "True" then "False" (case
 * insensitive), which becomes answerType "TF": `answers` stays empty and
 * `answer` becomes a boolean, matching how the app renders True/False
 * questions everywhere else (see src/features/quiz/utils/answerUtils.ts).
 * For those rows, explanation1/explanation2 still carry the per-answer
 * explanations (index 0 = True, index 1 = False) even though answer1/2 are
 * left blank — see getTfExplanations in
 * src/ui/Table/TableActions/utils/csvImport.ts.
 *
 * Usage:
 *   node src/scripts/convert-question-import.cjs <sourceFile> <targetType> [outFile]
 *
 * <targetType> is written as-is into the `type` column (e.g. "pspo-I",
 * "PSM-I" — mind the casing, it must match what the quiz selector filters
 * on). Defaults outFile to overwriting sourceFile in place.
 */

const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const ANSWER_COUNT = 6;

const OUTPUT_FIELDS = [
  "title",
  "feedback",
  "answerType",
  "type",
  "domain",
  "answer1",
  "explanation1",
  "answer2",
  "explanation2",
  "answer3",
  "explanation3",
  "answer4",
  "explanation4",
  "answer5",
  "explanation5",
  "answer6",
  "explanation6",
  "correctAnswer",
];

function convert(srcPath, targetType, outPath) {
  const raw = fs.readFileSync(srcPath, "utf8");
  // No `delimiter` option: Papa Parse auto-detects comma vs semicolon from
  // the header row, and strips a leading UTF-8 BOM on its own.
  const parsed = Papa.parse(raw, { header: true, skipEmptyLines: true });

  if (parsed.errors.length) {
    console.error(`Erreurs de parsing pour ${srcPath} :`, parsed.errors);
    process.exit(1);
  }

  let tfCount = 0;

  const rows = parsed.data
    .filter((row) => (row["Question"] || "").trim() !== "")
    .map((row) => {
      const questionType = (row["Question Type"] || "").trim();
      const opt1 = (row["Answer Option 1"] || "").trim();
      const opt2 = (row["Answer Option 2"] || "").trim();
      const opt3to6Empty = [3, 4, 5, 6].every(
        (n) => (row[`Answer Option ${n}`] || "").trim() === ""
      );

      const isTrueFalse =
        questionType === "multiple-choice" &&
        opt1.toLowerCase() === "true" &&
        opt2.toLowerCase() === "false" &&
        opt3to6Empty;

      const answerType = isTrueFalse
        ? "TF"
        : questionType === "multi-select"
        ? "M"
        : "S";

      const out = {
        title: (row["Question"] || "").trim(),
        feedback: (row["Overall Explanation"] || "").trim(),
        answerType,
        type: targetType,
        domain: (row["Domain"] || "").trim(),
      };

      for (let n = 1; n <= ANSWER_COUNT; n++) {
        out[`answer${n}`] = isTrueFalse
          ? ""
          : (row[`Answer Option ${n}`] || "").trim();
        out[`explanation${n}`] = (row[`Explanation ${n}`] || "").trim();
      }

      const rawCorrect = (row["Correct Answers"] || "").trim();
      if (isTrueFalse) {
        tfCount++;
        out.correctAnswer = rawCorrect === "1" ? "true" : "false";
      } else {
        out.correctAnswer = rawCorrect;
      }

      return out;
    });

  const csvOut = Papa.unparse(rows, { columns: OUTPUT_FIELDS });
  fs.writeFileSync(outPath, csvOut + "\n", "utf8");
  console.log(
    `${path.basename(srcPath)}: ${rows.length} question(s) -> ${outPath} (${tfCount} TF, type="${targetType}")`
  );
}

if (require.main === module) {
  const [, , srcArg, typeArg, outArg] = process.argv;
  if (!srcArg || !typeArg) {
    console.error(
      "Usage: node src/scripts/convert-question-import.cjs <sourceFile> <targetType> [outFile]"
    );
    process.exit(1);
  }
  convert(srcArg, typeArg, outArg || srcArg);
}

module.exports = { convert };
