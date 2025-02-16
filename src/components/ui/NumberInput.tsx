// src/components/ui/NumberInput.tsx
import React from 'react';

export type NumberInputProps = {
  label: string;
  placeholder?: string;
  value: number | '';
  onChange: (value: number | '') => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  min?: number;
  max?: number;
};

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
  min,
  max,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label} {required && '*'}
      </label>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' ? '' : Number(val));
        }}
        min={min}
        max={max}
        aria-invalid={error}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default NumberInput;
