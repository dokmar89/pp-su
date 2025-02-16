// src/components/ui/Select.tsx
import React from 'react';

export type Option = {
  value: string;
  label: string;
};

export type SelectProps = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
};

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label} {required && '*'}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default Select;
