import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../api/roti.api', () => ({ submitRoti: vi.fn() }));

import { submitRoti } from '../../api/roti.api';
import RotiForm from './RotiForm';

const submitButton = () => screen.getByRole('button', { name: 'Submit' });
const pick = (score: number) => fireEvent.click(screen.getByLabelText(String(score)));

describe('RotiForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(submitRoti).mockResolvedValue(undefined);
  });

  it('starts empty with the submit button disabled', () => {
    render(<RotiForm source="quiz" />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getAllByRole('radio').some((r) => (r as HTMLInputElement).checked)).toBe(false);
    expect(submitButton()).toBeDisabled();
  });

  it('enables submit once a score is picked', () => {
    render(<RotiForm source="quiz" />);
    pick(4);
    expect(submitButton()).toBeEnabled();
  });

  it('fills every step up to the selected score', () => {
    const { container } = render(<RotiForm source="quiz" />);
    pick(3);
    expect(container.querySelectorAll('.roti-form__step.is-filled')).toHaveLength(3);
  });

  it('shows the comment field only for scores <= 3', () => {
    render(<RotiForm source="quiz" />);
    expect(screen.queryByLabelText(/Comment/)).toBeNull();
    pick(3);
    expect(screen.getByLabelText(/Comment/)).toBeInTheDocument();
    pick(4);
    expect(screen.queryByLabelText(/Comment/)).toBeNull();
  });

  it('submits the score, comment and source, then calls onSuccess', async () => {
    const onSuccess = vi.fn();
    render(<RotiForm source="page" onSuccess={onSuccess} />);
    pick(2);
    fireEvent.change(screen.getByLabelText(/Comment/), { target: { value: 'bof' } });
    fireEvent.click(submitButton());

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(submitRoti).toHaveBeenCalledWith({
      score: 2,
      comment: 'bof',
      source: 'page',
      moduleId: undefined,
    });
  });

  it('shows an error and does not call onSuccess when saving fails', async () => {
    vi.mocked(submitRoti).mockRejectedValue(new Error('boom'));
    const onSuccess = vi.fn();
    render(<RotiForm source="quiz" onSuccess={onSuccess} />);
    pick(5);
    fireEvent.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent("Unable to save");
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('renders French texts when lang is fr', () => {
    render(<RotiForm source="page" lang="fr" />);
    pick(1);
    expect(screen.getByRole('button', { name: 'Valider' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Commentaire/)).toBeInTheDocument();
    expect(screen.getByText("J'ai appris plein de choses !")).toBeInTheDocument();
  });
});
