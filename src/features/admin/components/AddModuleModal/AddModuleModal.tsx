import { useRef, useState } from 'react';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../../ui/Modal/Modal';
import { createModule } from '../../api/modules.api';
import './style.scss';

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MIN_DURATION_MINUTES = 15; // 00:15
const MAX_DURATION_MINUTES = 5 * 60; // 05:00
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 200;
const MIN_PERCENT = 1;
const MAX_PERCENT = 100;
const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5 Mo

const REQUIRED_FIELD_MESSAGE = 'Champ obligatoire';

const durationToMinutes = (hhmm: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

const initialState = {
  title: '',
  isActive: false,
  quizDuration: '',
  questionCount: '',
  minSuccessPercent: '',
};

type TouchedFields = Record<keyof typeof initialState, boolean>;

export const AddModuleModal = ({ isOpen, onClose }: AddModuleModalProps) => {
  const [form, setForm] = useState(initialState);
  const [touched, setTouched] = useState<TouchedFields>({
    title: false,
    isActive: false,
    quizDuration: false,
    questionCount: false,
    minSuccessPercent: false,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm(initialState);
    setTouched({
      title: false,
      isActive: false,
      quizDuration: false,
      questionCount: false,
      minSuccessPercent: false,
    });
    setPdfFile(null);
    setPdfError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const durationMinutes = durationToMinutes(form.quizDuration);
  const isTitleValid = form.title.trim().length > 0;
  const isDurationValid =
    durationMinutes !== null &&
    durationMinutes >= MIN_DURATION_MINUTES &&
    durationMinutes <= MAX_DURATION_MINUTES;
  const isQuestionCountValid =
    form.questionCount !== '' &&
    Number(form.questionCount) >= MIN_QUESTIONS &&
    Number(form.questionCount) <= MAX_QUESTIONS;
  const isPercentValid =
    form.minSuccessPercent !== '' &&
    Number(form.minSuccessPercent) >= MIN_PERCENT &&
    Number(form.minSuccessPercent) <= MAX_PERCENT;

  const isFormValid =
    isTitleValid && isDurationValid && isQuestionCountValid && isPercentValid;

  const markTouched = (field: keyof TouchedFields) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handlePdfSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setPdfError('only PDF format is accepted');
      return;
    }
    if (file.size > MAX_PDF_SIZE) {
      setPdfError('le fichier doit faire moins de 5 Mo');
      return;
    }

    setPdfError(null);
    setPdfFile(file);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfError(null);
  };

  const handleConfirm = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await createModule({
        title: form.title.trim(),
        isActive: form.isActive,
        quizDuration: form.quizDuration,
        questionCount: Number(form.questionCount),
        minSuccessPercent: Number(form.minSuccessPercent),
        pdfFile: pdfFile ?? undefined,
      });
      toast.success('Module bien ajouté');
      resetForm();
      onClose();
    } catch {
      toast.error("Une erreur est survenue lors de l'ajout du module");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add module"
      onClose={handleClose}
      setIsClosed={handleClose}
      onConfirm={handleConfirm}
      labelOnConfirm="Add module"
      labelOnCancel="Cancel"
      confirmButtonDisabled={!isFormValid}
      isConfirmLoading={isSubmitting}
    >
      <div className="add-module-form">
        <div className="add-module-form__field">
          <label htmlFor="module-title">Title</label>
          <input
            id="module-title"
            type="text"
            placeholder="Module #1"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onBlur={() => markTouched('title')}
            required
          />
          {touched.title && !isTitleValid && (
            <span className="add-module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="add-module-form__field">
          <span className="add-module-form__label">Statut</span>
          <button
            type="button"
            className={`add-module-form__status-toggle ${
              form.isActive
                ? 'add-module-form__status-toggle--active'
                : 'add-module-form__status-toggle--inactive'
            }`}
            onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
          >
            {form.isActive ? 'Actived' : 'Desactived'}
          </button>
        </div>

        <div className="add-module-form__field">
          <label htmlFor="module-duration">Quizz duration</label>
          <input
            id="module-duration"
            type="time"
            placeholder="01:00"
            min="00:15"
            max="05:00"
            value={form.quizDuration}
            onChange={(e) => setForm((f) => ({ ...f, quizDuration: e.target.value }))}
            onBlur={() => markTouched('quizDuration')}
            required
          />
          {touched.quizDuration && !isDurationValid && (
            <span className="add-module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="add-module-form__field">
          <label htmlFor="module-question-count">Nbr question</label>
          <input
            id="module-question-count"
            type="number"
            placeholder="50"
            min={MIN_QUESTIONS}
            max={MAX_QUESTIONS}
            value={form.questionCount}
            onChange={(e) => setForm((f) => ({ ...f, questionCount: e.target.value }))}
            onBlur={() => markTouched('questionCount')}
            required
          />
          {touched.questionCount && !isQuestionCountValid && (
            <span className="add-module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="add-module-form__field">
          <label htmlFor="module-min-success">% minimum to success</label>
          <input
            id="module-min-success"
            type="number"
            placeholder="85%"
            min={MIN_PERCENT}
            max={MAX_PERCENT}
            value={form.minSuccessPercent}
            onChange={(e) => setForm((f) => ({ ...f, minSuccessPercent: e.target.value }))}
            onBlur={() => markTouched('minSuccessPercent')}
            required
          />
          {touched.minSuccessPercent && !isPercentValid && (
            <span className="add-module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="add-module-form__field">
          <span className="add-module-form__label">Support de cours (PDF)</span>
          <div className="add-module-form__pdf-row">
            <button
              type="button"
              className="add-module-form__icon-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Ajouter un PDF"
            >
              <FileText size={18} />
            </button>
            <button
              type="button"
              className="add-module-form__icon-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={!pdfFile}
              title="Remplacer le PDF"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              className="add-module-form__icon-btn"
              onClick={removePdf}
              disabled={!pdfFile}
              title="Supprimer le PDF"
            >
              <Trash2 size={18} />
            </button>
            {pdfFile && <span className="add-module-form__pdf-name">{pdfFile.name}</span>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfSelected}
            className="add-module-form__file-input"
            aria-hidden="true"
          />
          {pdfError && <span className="add-module-form__error">{pdfError}</span>}
        </div>
      </div>
    </Modal>
  );
};
