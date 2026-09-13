import { Question } from "../../../../utils/types";

export interface FeedbackProps {
  /**
   * A draft (no `id` yet, e.g. an unsaved CSV import preview row) can be
   * passed with `showReportButton={false}` — reporting needs a real
   * Firestore id, so it's only ever invoked via that button.
   */
  question: Question | Omit<Question, "id">;
  showReportButton?: boolean;
}
