import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableQuestions from './TableQuestions';

describe('TableQuestions', () => {
  it('should render the component correctly', () => {
    render(<TableQuestions />);

    expect(screen.getByText('TableQuestions')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
