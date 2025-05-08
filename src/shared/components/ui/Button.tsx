import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

interface StyledButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  $size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.light};
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}20;
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.error};
          color: white;
          border: none;
          &:hover {
            background-color: ${theme.colors.error}dd;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
          color: white;
          border: none;
          &:hover {
            background-color: ${theme.colors.primary}dd;
          }
        `;
    }
  }}
  
  ${({ $size, theme }) => {
    switch ($size) {
      case 'small':
        return `
          font-size: ${theme.fontSizes.small};
          padding: ${theme.space.xs} ${theme.space.sm};
        `;
      case 'large':
        return `
          font-size: ${theme.fontSizes.large};
          padding: ${theme.space.sm} ${theme.space.lg};
        `;
      default:
        return `
          font-size: ${theme.fontSizes.medium};
          padding: ${theme.space.sm} ${theme.space.md};
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary}60;
    outline-offset: 2px;
  }
`;

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'medium', ...props }) => {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button; 