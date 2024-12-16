import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './Alert';

describe('Alert', () => {
  it('should render the component correctly', () => {
    render(<Alert />);

    expect(screen.getByText('Alert')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
