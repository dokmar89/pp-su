// src/components/ui/PhoneInput.tsx
import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

const PhoneInput: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} type="tel" />;
};

export default PhoneInput;
