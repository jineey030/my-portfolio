import type { ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ui-button ui-button-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;