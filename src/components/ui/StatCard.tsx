// src/components/ui/StatCard.tsx
import React from 'react';

type StatCardProps = {
  title: string;
  value: number | string;
  graphData?: any;
};

const StatCard: React.FC<StatCardProps> = ({ title, value, graphData }) => {
  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{value}</p>
      {graphData && <div>Graph placeholder</div>}
    </div>
  );
};

export default StatCard;
