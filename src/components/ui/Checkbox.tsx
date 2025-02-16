// src/components/ui/Checkbox.tsx
import React from 'react';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: boolean;
  errorMessage?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, error, errorMessage }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error}
          style={{ marginRight: '0.5rem' }}
        />
        {label}
      </label>
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default Checkbox;
