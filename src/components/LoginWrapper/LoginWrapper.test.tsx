import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginWrapper from './LoginWrapper';

describe('LoginWrapper', () => {
  it('should render the component correctly', () => {
    render(<LoginWrapper />);

    expect(screen.getByText('LoginWrapper')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
