// src/components/ui/UrlInput.tsx
import React from 'react';
import TextInput, { TextInputProps } from './TextInput';

const UrlInput: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} type="url" />;
};

export default UrlInput;
