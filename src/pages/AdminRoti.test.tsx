import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../features/roti/hooks/useRotiStats', () => ({
  useRotiStats: () => ({
    stats: { total: 0, average: null, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, comments: [] },
    isLoading: false,
    error: null,
  }),
}));

import AdminRoti from './AdminRoti';

describe('AdminRoti page', () => {
  it('shows the ROTI stats and goes back to the admin page', () => {
    render(
      <MemoryRouter initialEntries={['/admin/roti']}>
        <Routes>
          <Route path="/admin/roti" element={<AdminRoti />} />
          <Route path="/admin" element={<p>admin home</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'ROTI' })).toBeInTheDocument();
    expect(screen.getByText('No ROTI rating yet.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    expect(screen.getByText('admin home')).toBeInTheDocument();
  });
});
