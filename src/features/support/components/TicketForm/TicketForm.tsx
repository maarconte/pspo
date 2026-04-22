import { useActionState, useRef, useState } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import { createTicket } from '../../api/tickets.api';
import './TicketForm.scss';

interface TicketFormProps {
  authorId: string;
  authorName: string;
}

type FormState = {
  success: boolean;
  error: string | null;
};

async function submitTicketAction(
  prevState: FormState,
  formData: FormData,
  authorId: string,
  authorName: string,
): Promise<FormState> {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const imageFile = formData.get('image') as File | null;

  if (!name) return { success: false, error: 'Ticket name is required.' };
  if (!description) return { success: false, error: 'Description is required.' };

  try {
    await createTicket(
      { name, description, imageFile: imageFile?.size ? imageFile : undefined },
      authorId,
      authorName,
    );
    return { success: true, error: null };
  } catch {
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

export const TicketForm = ({ authorId, authorName }: TicketFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const boundAction = async (prevState: FormState, formData: FormData) => {
    if (imageFile) formData.set('image', imageFile);
    const result = await submitTicketAction(prevState, formData, authorId, authorName);
    if (result.success) {
      formRef.current?.reset();
      setImagePreview(null);
      setImageFile(null);
    }
    return result;
  };

  const [state, action, isPending] = useActionState<FormState, FormData>(
    boundAction,
    { success: false, error: null },
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // limit file size to 5MB
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File must be less than 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="ticket-form">
      <div className="ticket-form__header">
        <h2 className="ticket-form__title">Report a bug</h2>
        <p className="ticket-form__subtitle">
          Describe the issue you encountered and our team will handle your ticket.
        </p>
      </div>

      <form ref={formRef} action={action} className="ticket-form__body" noValidate>
        {/* Nom */}
        <div className="ticket-form__field">
          <label htmlFor="ticket-name" className="ticket-form__label">
            Ticket name <span className="ticket-form__required">*</span>
          </label>
          <input
            id="ticket-name"
            name="name"
            type="text"
            className="ticket-form__input"
            placeholder="e.g., Error while loading the quiz"
            required
            disabled={isPending}
          />
        </div>

        {/* Description */}
        <div className="ticket-form__field">
          <label htmlFor="ticket-description" className="ticket-form__label">
            Description <span className="ticket-form__required">*</span>
          </label>
          <textarea
            id="ticket-description"
            name="description"
            className="ticket-form__textarea"
            placeholder="Describe the bug in detail: context, steps to reproduce, expected behavior..."
            rows={5}
            required
            disabled={isPending}
          />
        </div>

        {/* Image */}
        <div className="ticket-form__field">
          <label className="ticket-form__label">Screenshot (optional)</label>
          {imagePreview ? (
            <div className="ticket-form__image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                className="ticket-form__image-remove"
                onClick={clearImage}
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="ticket-form__upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus size={32} className="ticket-form__upload-icon" />
              <span>Click to add an image</span>
              <span className="ticket-form__upload-hint">PNG, JPG, WEBP · max 5MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="ticket-form__file-input"
            aria-hidden="true"
          />
        </div>

        {/* Feedback */}
        {state.error && (
          <div className="ticket-form__error" role="alert">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="ticket-form__success" role="status">
            ✓ Ticket created successfully!
          </div>
        )}

        <button
          type="submit"
          className="ticket-form__submit"
          disabled={isPending}
          id="submit-ticket-btn"
        >
          {isPending ? (
            <span className="ticket-form__spinner" />
          ) : (
            <Send size={18} />
          )}
          {isPending ? 'Sending...' : 'Send ticket'}
        </button>
      </form>
    </div>
  );
};
