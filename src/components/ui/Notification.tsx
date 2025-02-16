// src/components/ui/Notification.tsx
import React from 'react';

export type NotificationProps = {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
};

const Notification: React.FC<NotificationProps> = ({ type, message, duration = 3000 }) => {
  const backgroundColor = {
    success: '#d4edda',
    error: '#f8d7da',
    warning: '#fff3cd',
    info: '#d1ecf1',
  }[type];

  return (
    <div
      style={{
        backgroundColor,
        padding: '1rem',
        borderRadius: '4px',
        margin: '1rem 0',
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
