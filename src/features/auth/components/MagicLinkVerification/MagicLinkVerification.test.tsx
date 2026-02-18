import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MagicLinkVerification } from './MagicLinkVerification';
import { authService } from '../../api/authService';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../../api/authService', () => ({
  authService: {
    isMagicLink: vi.fn(),
    completeMagicLinkSignIn: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('MagicLinkVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should NOT log sensitive URL to console', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    (authService.isMagicLink as any).mockReturnValue(true);
    (authService.completeMagicLinkSignIn as any).mockResolvedValue({
      uid: 'test-uid',
      email: 'test@example.com',
    });

    render(
      <BrowserRouter>
        <MagicLinkVerification />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Check that authService was called (to ensure the flow ran)
      expect(authService.completeMagicLinkSignIn).toHaveBeenCalled();
    });

    // Check if console.log was NOT called with the sensitive message
    expect(consoleSpy).not.toHaveBeenCalledWith('URL actuelle:', expect.any(String));

    // Also check for user details logging
    expect(consoleSpy).not.toHaveBeenCalledWith('User UID:', expect.any(String));
    expect(consoleSpy).not.toHaveBeenCalledWith('User Email:', expect.any(String));

    consoleSpy.mockRestore();
  });
});
