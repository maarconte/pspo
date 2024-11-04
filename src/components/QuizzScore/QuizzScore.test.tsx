import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizzScore from './QuizzScore';

describe('QuizzScore', () => {
  it('should render the component correctly', () => {
    render(<QuizzScore />);

    expect(screen.getByText('QuizzScore')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
