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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateModulePayload = Pick<
  Module,
  'title' | 'isActive' | 'quizDuration' | 'questionCount' | 'minSuccessPercent'
> & {
  pdfFile?: File;
};

export type UpdateModulePayload = Partial<
  Pick<Module, 'title' | 'isActive' | 'quizDuration' | 'questionCount' | 'minSuccessPercent'>
> & {
  pdfFile?: File;
  /** Explicitly detach the existing PDF without uploading a new one. Ignored if `pdfFile` is set. */
  removePdf?: boolean;
};
