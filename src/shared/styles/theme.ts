export const theme = {
  colors: {
    primary: '#4a90e2',
    secondary: '#50E3C2',
    dark: '#333333',
    light: '#f5f5f5',
    text: '#333333',
    textLight: '#ffffff',
    background: '#ffffff',
    error: '#e74c3c'
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  fontSizes: {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem',
    xlarge: '1.5rem',
    xxlarge: '2rem'
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    circle: '50%'
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
    large: '0 8px 16px rgba(0, 0, 0, 0.1)'
  }
}

export type Theme = typeof theme 