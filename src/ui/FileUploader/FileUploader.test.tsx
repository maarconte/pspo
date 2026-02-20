import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FileUploader from './FileUploader';
import React from 'react';

describe('FileUploader', () => {
  it('renders correctly', () => {
    const handleFileMock = vi.fn();
    render(<FileUploader handleFile={handleFileMock} />);
    expect(screen.getByText('Import questions')).toBeInTheDocument();
  });

  it('calls handleFile when a file is selected', () => {
    const handleFileMock = vi.fn();
    const { container } = render(<FileUploader handleFile={handleFileMock} />);

    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = container.querySelector('input[type="file"]');

    expect(input).toBeInTheDocument();

    if (input) {
      fireEvent.change(input, { target: { files: [file] } });
      expect(handleFileMock).toHaveBeenCalledTimes(1);
      expect(handleFileMock).toHaveBeenCalledWith(file);
    }
  });

  it('resets input value after file selection', () => {
    const handleFileMock = vi.fn();
    const { container } = render(<FileUploader handleFile={handleFileMock} />);

    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    expect(input).toBeInTheDocument();

    if (input) {
      // Simulate browser setting the value
      Object.defineProperty(input, 'value', {
        value: 'C:\\fakepath\\test.csv',
        writable: true,
      });

      fireEvent.change(input, { target: { files: [file] } });
      expect(handleFileMock).toHaveBeenCalledTimes(1);
      expect(input.value).toBe('');
    }
  });
});
