// src/components/ui/RadioGroup.tsx
import React from 'react';
import RadioButton from './RadioButton';

export type Option = {
  value: string;
  label: string;
};

export type RadioGroupProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  errorMessage,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}</label>
      <div>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
          />
        ))}
      </div>
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default RadioGroup;
