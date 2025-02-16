// src/components/ui/ReadOnlyDisplay.tsx
import React from 'react';

type ReadOnlyDisplayProps = {
  label: string;
  value: string;
};

const ReadOnlyDisplay: React.FC<ReadOnlyDisplayProps> = ({ label, value }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong>{label}:</strong> <span>{value}</span>
    </div>
  );
};

export default ReadOnlyDisplay;
