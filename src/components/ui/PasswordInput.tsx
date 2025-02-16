// src/components/ui/PasswordInput.tsx
import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

const PasswordInput: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} type="password" />;
};

export default PasswordInput;
