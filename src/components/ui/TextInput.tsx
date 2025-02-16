// src/components/ui/TextInput.tsx
import React from 'react';

export type TextInputProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  type?: string;
};

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
  type = "text",
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label} {required && '*'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
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
      />
      {error && errorMessage && (
        <span style={{ color: 'red', fontSize: '0.8rem' }}>{errorMessage}</span>
      )}
    </div>
  );
};

export default TextInput;
