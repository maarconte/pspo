import { Timestamp } from 'firebase/firestore';

export interface Module {
  id: string;
  title: string;
  isActive: boolean;
  quizDuration: string; // "hh:mm"
  questionCount: number;
  minSuccessPercent: number;
  pdfUrl?: string;
  pdfPath?: string; // Firebase Storage path, used to delete the file
  pdfSizeBytes?: number;
  /** Admin-authored HTML (formatted text + links) shown in the "Links" side tab. Empty/absent = no tab. */
  usefulLinks?: string | null;
  /** Number of quiz sessions completed for this module, incremented on quiz completion. */
  completedCount?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateModulePayload = Pick<
  Module,
  'title' | 'isActive' | 'quizDuration' | 'questionCount' | 'minSuccessPercent'
> & {
  pdfFile?: File;
  usefulLinks?: string;
};

export type UpdateModulePayload = Partial<
  Pick<Module, 'title' | 'isActive' | 'quizDuration' | 'questionCount' | 'minSuccessPercent'>
> & {
  pdfFile?: File;
  /** Empty string clears the field. */
  usefulLinks?: string;
  /** Explicitly detach the existing PDF without uploading a new one. Ignored if `pdfFile` is set. */
  removePdf?: boolean;
};
