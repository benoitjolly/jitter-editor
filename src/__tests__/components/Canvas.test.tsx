import React from 'react';
import { render, screen } from '@testing-library/react';
import Canvas from '../../features/editor/components/canvas';
import { ShapesProvider } from '../../features/editor/context/ShapesContext';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../shared/styles/theme';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Canvas Component', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <ShapesProvider>
          {ui}
        </ShapesProvider>
      </ThemeProvider>
    );
  };

  test('renders the canvas element', () => {
    renderWithProviders(<Canvas />);
    const canvasElement = document.querySelector('canvas');
    expect(canvasElement).toBeTruthy();
  });

  test('displays zoom information', () => {
    renderWithProviders(<Canvas />);
    const zoomInfo = screen.getByText(/Zoom: 100%/i);
    expect(zoomInfo).toBeTruthy();
  });
  
}); 