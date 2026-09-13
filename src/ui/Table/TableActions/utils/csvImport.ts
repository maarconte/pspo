import { Question } from "../../../../utils/types";

// One CSV row = one question. Answer options live in answer1, answer2, ...
// columns (as many as needed), and the correct one(s) are referenced by
// their 1-based column number in `correctAnswer` (e.g. "2", or "1,3" for M).
// An optional explanation1, explanation2, ... column (index-aligned with
// answerN) can carry a per-answer explanation; it's purely additive and
// never required.
export const ANSWER_COLUMN_REGEX = /^answer(\d+)$/i;
export const TRUE_VALUES = ["true", "vrai", "1"];
export const FALSE_VALUES = ["false", "faux", "0"];

export interface CsvQuestionRow {
  title?: string;
  feedback?: string;
  answerType?: string;
  type?: string;
  domain?: string;
  correctAnswer?: string;
  [answerColumn: string]: string | undefined;
}

export type QuestionDraft = Omit<Question, "id">;

const getAnswerColumnNumbers = (row: CsvQuestionRow): number[] =>
  Object.keys(row)
    .filter((key) => ANSWER_COLUMN_REGEX.test(key) && row[key]?.trim())
    .map((key) => Number(key.match(ANSWER_COLUMN_REGEX)?.[1]))
    .sort((a, b) => a - b);

export const getAnswerOptions = (row: CsvQuestionRow): string[] =>
  getAnswerColumnNumbers(row).map((n) => row[`answer${n}`]?.trim() ?? "");

// Index-aligned with getAnswerOptions: explanation N corresponds to answer N.
// Returns undefined (field omitted entirely) when no explanationN column has
// any content, so importing a CSV without them never touches this field.
export const getAnswerExplanations = (
  row: CsvQuestionRow
): string[] | undefined => {
  const numbers = getAnswerColumnNumbers(row);
  const explanations = numbers.map((n) => row[`explanation${n}`]?.trim() ?? "");
  return explanations.some((explanation) => explanation !== "")
    ? explanations
    : undefined;
};

// TF has no `answers` array to align explanations with (True/False is
// implicit), so explanation1/explanation2 are read directly regardless of
// whether answer1/answer2 have any text: [0] = True, [1] = False.
export const getTfExplanations = (
  row: CsvQuestionRow
): string[] | undefined => {
  const explanations = [1, 2].map((n) => row[`explanation${n}`]?.trim() ?? "");
  return explanations.some((explanation) => explanation !== "")
    ? explanations
    : undefined;
};

export const parseCorrectAnswer = (
  answerType: string,
  correctAnswer: string | undefined,
  answersCount: number
): { value: Question["answer"] } | { error: string } => {
  const raw = (correctAnswer ?? "").trim();

  if (answerType === "TF") {
    const normalized = raw.toLowerCase();
    if (TRUE_VALUES.includes(normalized)) return { value: true };
    if (FALSE_VALUES.includes(normalized)) return { value: false };
    return { error: `correctAnswer invalide pour TF : "${raw}"` };
  }

  if (answerType === "S") {
    const index = Number(raw);
    if (!Number.isInteger(index) || index < 1 || index > answersCount) {
      return { error: `correctAnswer hors limites : "${raw}"` };
    }
    return { value: index - 1 };
  }

  if (answerType === "M") {
    const indexes = raw
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .map(Number);

    const isValid =
      indexes.length > 0 &&
      indexes.every(
        (index) => Number.isInteger(index) && index >= 1 && index <= answersCount
      );

    if (!isValid) {
      return { error: `correctAnswer invalide pour M : "${raw}"` };
    }
    return { value: indexes.map((index) => index - 1) };
  }

  return { error: `answerType inconnu : "${answerType}"` };
};

export const parseCsvRow = (
  row: CsvQuestionRow,
  lineNumber: number
): { question: QuestionDraft } | { error: string } => {
  const title = row.title?.trim();
  const answerType = row.answerType?.trim() ?? "";

  if (!title) {
    return { error: `Ligne ${lineNumber} : titre manquant` };
  }
  if (!["TF", "S", "M"].includes(answerType)) {
    return {
      error: `Ligne ${lineNumber} : answerType invalide "${answerType}"`,
    };
  }

  const answers = answerType === "TF" ? [] : getAnswerOptions(row);
  const answerExplanations =
    answerType === "TF" ? getTfExplanations(row) : getAnswerExplanations(row);
  const correctAnswer = parseCorrectAnswer(
    answerType,
    row.correctAnswer,
    answers.length
  );

  if ("error" in correctAnswer) {
    return { error: `Ligne ${lineNumber} : ${correctAnswer.error}` };
  }

  const domain = row.domain?.trim();

  return {
    question: {
      title,
      feedback: row.feedback?.trim() ?? "",
      answerType,
      type: row.type?.trim() || "pspo-I",
      answers,
      answer: correctAnswer.value,
      ...(answerExplanations ? { answerExplanations } : {}),
      ...(domain ? { domain } : {}),
    },
  };
};
