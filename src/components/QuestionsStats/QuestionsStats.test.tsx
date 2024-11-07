import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionsStats from './QuestionsStats';

describe('QuestionsStats', () => {
  it('should render the component correctly', () => {
    render(<QuestionsStats />);

    expect(screen.getByText('QuestionsStats')).toBeInTheDocument();
  });

  // ... tests supplémentaires pour les props et les fonctionnalités du composant ...
});
