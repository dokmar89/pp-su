import React from 'react';

interface IconProps {
  type: 'success' | 'error' | 'warning';
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ type, style }) => {
  let icon;
  switch (type) {
    case 'success':
      icon = '✔️';
      break;
    case 'error':
      icon = '❌';
      break;
    case 'warning':
      icon = '⚠️';
      break;
    default:
      icon = '';
  }
  return <span style={style}>{icon}</span>;
};

export default Icon;
