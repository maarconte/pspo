import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-toastify', () => ({ toast: { success: vi.fn() } }));
vi.mock('../../api/roti.api', () => ({ submitRoti: vi.fn().mockResolvedValue(undefined) }));

import { submitRoti } from '../../api/roti.api';
import { useRotiPromptStore } from '../../stores/useRotiPromptStore';
import RotiPrompt from './RotiPrompt';

describe('RotiPrompt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRotiPromptStore.setState({ isOpen: false });
  });

  it('renders nothing while closed', () => {
    render(<RotiPrompt />);
    expect(screen.queryByText('ROTI !')).toBeNull();
  });

  it('opens from the store with a link to the ROTI page in a new tab', () => {
    render(<RotiPrompt />);
    act(() => useRotiPromptStore.getState().open());

    expect(screen.getByText('ROTI !')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Je t'explique ici/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('href')).toMatch(/#\/roti$/);
  });

  it('closes, saves the rating (source quiz) and shows the success toast on submit', async () => {
    render(<RotiPrompt />);
    act(() => useRotiPromptStore.getState().open());

    fireEvent.click(screen.getByLabelText('4'));
    fireEvent.click(screen.getByRole('button', { name: 'Valider' }));

    await waitFor(() => expect(useRotiPromptStore.getState().isOpen).toBe(false));
    expect(submitRoti).toHaveBeenCalledWith(expect.objectContaining({ score: 4, source: 'quiz' }));
    expect(toast.success).toHaveBeenCalledWith(
      'La note de votre ROTI est bien prise en compte, merci !',
    );
  });

  it('closes without saving when dismissed', () => {
    render(<RotiPrompt />);
    act(() => useRotiPromptStore.getState().open());
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(useRotiPromptStore.getState().isOpen).toBe(false);
    expect(submitRoti).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
