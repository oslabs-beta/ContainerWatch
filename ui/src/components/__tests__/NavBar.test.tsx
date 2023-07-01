import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

test('renders App component', () => {
  render(<App />);
  const titleElement = screen.getByText('DockerPulse');
  expect(titleElement).toBeInTheDocument();
});

// test('renders App component', () => {
//   expect(1 + 1).toBe(2);
// });
