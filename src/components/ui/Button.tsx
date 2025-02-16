// src/components/ui/Button.tsx
import React from 'react';

export type ButtonProps = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
};

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, loading = false, style }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{ padding: '8px 16px', cursor: 'pointer', ...style }}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
};

export default Button;
