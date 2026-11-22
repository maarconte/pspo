import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn() } }));
vi.mock('../features/roti/api/roti.api', () => ({
  submitRoti: vi.fn().mockResolvedValue(undefined),
  subscribeToRoti: vi.fn(),
}));

import { submitRoti } from '../features/roti/api/roti.api';
import Roti from './Roti';

describe('Roti page', () => {
  beforeEach(() => vi.clearAllMocks());

  it('is in English by default', () => {
    render(<Roti />);
    expect(screen.getByRole('heading', { level: 1, name: 'the ROTI!' })).toBeInTheDocument();
    expect(screen.getByText('Return On Time Invested')).toBeInTheDocument();
    expect(screen.getByText('The goal')).toBeInTheDocument();
    expect(screen.getByText('How to proceed')).toBeInTheDocument();
    expect(screen.getByText('Going further')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit the ROTI' })).toBeDisabled();
  });

  it('switches to French and back, including the form', () => {
    render(<Roti />);
    fireEvent.click(screen.getByLabelText('Français'));
    expect(screen.getByRole('heading', { level: 1, name: 'le ROTI !' })).toBeInTheDocument();
    expect(screen.getByText('Retour On Time Invest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Valider le ROTI' })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('English'));
    expect(screen.getByRole('heading', { level: 1, name: 'the ROTI!' })).toBeInTheDocument();
  });

  it('submits from the page (source page) with the toast in the current language', async () => {
    render(<Roti />);
    fireEvent.click(screen.getByLabelText('Français'));
    fireEvent.click(screen.getByLabelText('5'));
    fireEvent.click(screen.getByRole('button', { name: 'Valider le ROTI' }));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        'La note de votre ROTI est bien prise en compte, merci !',
      ),
    );
    expect(submitRoti).toHaveBeenCalledWith(expect.objectContaining({ score: 5, source: 'page' }));
  });
});
