// src/components/ui/RadioButton.tsx
import React from 'react';

export type RadioButtonProps = {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

const RadioButton: React.FC<RadioButtonProps> = ({ label, value, checked, onChange }) => {
  return (
    <label style={{ marginRight: '1rem' }}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        style={{ marginRight: '0.5rem' }}
      />
      {label}
    </label>
  );
};

export default RadioButton;
