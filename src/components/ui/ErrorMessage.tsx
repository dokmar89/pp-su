// src/components/ui/ErrorMessage.tsx
import React from 'react';

export type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.5rem' }}>
      {message}
    </div>
  );
};

export default ErrorMessage;
