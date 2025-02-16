// src/components/ui/TextArea.tsx
import React from 'react';

export type TextAreaProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  rows?: number;
};

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  required = false,
  rows = 4,
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {label} {required && '*'}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
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

export default TextArea;
