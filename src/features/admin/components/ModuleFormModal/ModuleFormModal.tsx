import { useEffect, useRef, useState } from 'react';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal from '../../../../ui/Modal/Modal';
import { createModule, updateModule } from '../../api/modules.api';
import type { Module } from '../../types/module.types';
import './style.scss';

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When provided, the modal edits this module instead of creating a new one. */
  module?: Module;
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

const emptyState = {
  title: '',
  isActive: false,
  quizDuration: '',
  questionCount: '',
  minSuccessPercent: '',
};

const stateFromModule = (module: Module) => ({
  title: module.title,
  isActive: module.isActive,
  quizDuration: module.quizDuration,
  questionCount: String(module.questionCount),
  minSuccessPercent: String(module.minSuccessPercent),
});

type TouchedFields = Record<keyof typeof emptyState, boolean>;
const untouchedFields: TouchedFields = {
  title: false,
  isActive: false,
  quizDuration: false,
  questionCount: false,
  minSuccessPercent: false,
};

export const ModuleFormModal = ({ isOpen, onClose, module }: ModuleFormModalProps) => {
  const isEditMode = !!module;
  const [form, setForm] = useState(module ? stateFromModule(module) : emptyState);
  const [touched, setTouched] = useState<TouchedFields>(untouchedFields);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [removeExistingPdf, setRemoveExistingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-sync the form whenever a new module is opened for editing (or the modal reopens in add mode).
  useEffect(() => {
    if (isOpen) {
      setForm(module ? stateFromModule(module) : emptyState);
      setTouched(untouchedFields);
      setPdfFile(null);
      setPdfError(null);
      setRemoveExistingPdf(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, module?.id]);

  const handleClose = () => {
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
    setRemoveExistingPdf(false);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfError(null);
    setRemoveExistingPdf(true);
  };

  const handleConfirm = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        isActive: form.isActive,
        quizDuration: form.quizDuration,
        questionCount: Number(form.questionCount),
        minSuccessPercent: Number(form.minSuccessPercent),
        pdfFile: pdfFile ?? undefined,
      };

      if (isEditMode && module) {
        await updateModule(
          module.id,
          { ...payload, removePdf: removeExistingPdf },
          module.pdfPath
        );
        toast.success('Modifications saved');
      } else {
        await createModule(payload);
        toast.success('Module bien ajouté');
      }
      onClose();
    } catch {
      toast.error(
        isEditMode
          ? "Une erreur est survenue lors de la mise à jour du module"
          : "Une erreur est survenue lors de l'ajout du module"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasPdf = !!pdfFile || (isEditMode && !!module?.pdfUrl && !removeExistingPdf);
  const pdfName = pdfFile?.name ?? (hasPdf ? 'Fichier existant' : null);

  return (
    <Modal
      isOpen={isOpen}
      title={isEditMode ? 'Edit module' : 'Add module'}
      onClose={handleClose}
      setIsClosed={handleClose}
      onConfirm={handleConfirm}
      labelOnConfirm={isEditMode ? 'Save' : 'Add module'}
      labelOnCancel="Cancel"
      confirmButtonDisabled={!isFormValid}
      isConfirmLoading={isSubmitting}
    >
      <div className="module-form">
        <div className="module-form__field">
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
            <span className="module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="module-form__field">
          <span className="module-form__label">Statut</span>
          <button
            type="button"
            className={`module-form__status-toggle ${
              form.isActive
                ? 'module-form__status-toggle--active'
                : 'module-form__status-toggle--inactive'
            }`}
            onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
          >
            {form.isActive ? 'Actived' : 'Desactived'}
          </button>
        </div>

        <div className="module-form__field">
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
            <span className="module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="module-form__field">
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
            <span className="module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="module-form__field">
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
            <span className="module-form__error">{REQUIRED_FIELD_MESSAGE}</span>
          )}
        </div>

        <div className="module-form__field">
          <span className="module-form__label">Support de cours (PDF)</span>
          <div className="module-form__pdf-row">
            <button
              type="button"
              className="module-form__icon-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Ajouter un PDF"
            >
              <FileText size={18} />
            </button>
            <button
              type="button"
              className="module-form__icon-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={!hasPdf}
              title="Remplacer le PDF"
            >
              <Pencil size={18} />
            </button>
            <button
              type="button"
              className="module-form__icon-btn"
              onClick={removePdf}
              disabled={!hasPdf}
              title="Supprimer le PDF"
            >
              <Trash2 size={18} />
            </button>
            {pdfName && <span className="module-form__pdf-name">{pdfName}</span>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfSelected}
            className="module-form__file-input"
            aria-hidden="true"
          />
          {pdfError && <span className="module-form__error">{pdfError}</span>}
        </div>
      </div>
    </Modal>
  );
};
