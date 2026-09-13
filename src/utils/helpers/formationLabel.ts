/**
 * Display-only casing fix: `Question.type` / `formation` is stored as "pspo-I"
 * (lowercase "pspo") in existing Firestore data, but user-facing text should
 * always read "PSPO-I". Never use this to rewrite the stored/filtered value —
 * only to format what's shown on screen.
 */
const FORMATION_DISPLAY_LABELS: Record<string, string> = {
  "pspo-I": "PSPO-I",
};

const FORMATION_RAW_VALUES: Record<string, string> = Object.fromEntries(
  Object.entries(FORMATION_DISPLAY_LABELS).map(([raw, label]) => [label, raw])
);

export const getFormationLabel = (type?: string | null): string => {
  if (!type) return "";
  return FORMATION_DISPLAY_LABELS[type] ?? type;
};

/** Inverse of `getFormationLabel`: turns a module's display title back into the raw `Question.type` value. */
export const getFormationValue = (label: string): string =>
  FORMATION_RAW_VALUES[label] ?? label;
