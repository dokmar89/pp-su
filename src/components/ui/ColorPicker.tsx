// src/components/ui/ColorPicker.tsx
import React from 'react';

export type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ marginLeft: '0.5rem' }}
      />
    </div>
  );
};

export default ColorPicker;
