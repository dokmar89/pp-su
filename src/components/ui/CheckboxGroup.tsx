// src/components/ui/CheckboxGroup.tsx
import React from 'react';

export type Option = {
  value: string;
  label: string;
};

export type CheckboxGroupProps = {
  label: string;
  options: Option[];
  value?: string[]; // Změna: value je nyní nepovinné
  onChange: (values: string[]) => void;
  error?: boolean;
  errorMessage?: string;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value = [], // Výchozí hodnota: prázdné pole
  onChange,
  error,
  errorMessage,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((val) => val !== optionValue));
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}</label>
      {options.map((option) => (
        <div key={option.value}>
          <label>
            <input
              type="checkbox"
              checked={value?.includes(option.value) ?? false} // Ošetření undefined
              onChange={(e) => handleChange(option.value, e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            {option.label}
          </label>
        </div>
      ))}
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default CheckboxGroup;