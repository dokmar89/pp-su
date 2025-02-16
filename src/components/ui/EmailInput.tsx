// src/components/ui/EmailInput.tsx
import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

const EmailInput: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} type="email" />;
};

export default EmailInput;
