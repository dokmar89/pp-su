// src/components/ui/Loading.tsx
import React from 'react';

export type LoadingProps = {
  isLoading: boolean;
  size?: number;
  color?: string;
};

const Loading: React.FC<LoadingProps> = ({ isLoading, size = 24, color = '#000' }) => {
  if (!isLoading) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          border: `${size / 8}px solid #f3f3f3`,
          borderTop: `${size / 8}px solid ${color}`,
          borderRadius: '50%',
          width: size,
          height: size,
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loading;
