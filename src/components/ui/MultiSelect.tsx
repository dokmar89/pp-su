// src/components/ui/MultiSelect.tsx
import React from 'react';

export type Option = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selectedOptions);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label} {required && '*'}
      </label>
      <select
        multiple
        value={value}
        onChange={handleChange}
        aria-invalid={error}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
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

export default MultiSelect;
