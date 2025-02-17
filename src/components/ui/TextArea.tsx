// src/components/ui/TextArea.tsx
import React from 'react';

export type TextAreaProps = {
  label?: string; // Label je optional, protože ho třeba v IDScanStep nepoužíváš
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
    <div className="mb-4"> {/* Použij mb-4 pro spacing */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`
          block
          w-full
          px-3
          py-2
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          ${error ? 'border-red-500' : ''}
        `}
        aria-invalid={error}
      />
      {error && errorMessage && (
        <span className="text-red-500 text-xs">{errorMessage}</span>
      )}
    </div>
  );
};

export default TextArea;