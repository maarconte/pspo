import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ModuleFormModal } from './ModuleFormModal';
import type { Module } from '../../types/module.types';

vi.mock('../../api/modules.api', () => ({ createModule: vi.fn(), updateModule: vi.fn() }));

const module = {
  id: 'm1',
  title: 'PSPO I',
  isActive: true,
  quizDuration: '01:00',
  questionCount: 80,
  minSuccessPercent: 85,
  usefulLinks: '<p>Guide <a href="https://scrum.org">Scrum</a></p>',
} as Module;

describe('ModuleFormModal useful links', () => {
  it('shows the previously saved useful links in the editor when editing', async () => {
    render(<ModuleFormModal isOpen onClose={() => {}} module={module} />);
    expect(await screen.findByText('Scrum')).toBeInTheDocument();
  });

  it('starts with an empty editor when adding a module', async () => {
    render(<ModuleFormModal isOpen onClose={() => {}} />);
    const editor = await screen.findByLabelText('Liens utiles du module', { selector: '[contenteditable]' });
    expect(editor.textContent).toBe('');
  });
});

describe('ModuleFormModal switching modules', () => {
  it('shows the useful links of the newly opened module, not the previous one', async () => {
    const other = { ...module, id: 'm2', title: 'PSM I', usefulLinks: '<p>Autre module</p>' } as Module;
    const { rerender } = render(<ModuleFormModal isOpen onClose={() => {}} module={module} />);
    expect(await screen.findByText('Scrum')).toBeInTheDocument();

    rerender(<ModuleFormModal isOpen={false} onClose={() => {}} />);
    rerender(<ModuleFormModal isOpen onClose={() => {}} module={other} />);

    expect(await screen.findByText('Autre module')).toBeInTheDocument();
    expect(screen.queryByText('Scrum')).toBeNull();
  });
});
