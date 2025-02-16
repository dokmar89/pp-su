import React, { ChangeEvent } from 'react';

export interface ImageUploadProps {
  label: string;
  onChange: (fileUrl: string) => void;
  error?: boolean;
  errorMessage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange, error, errorMessage }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(url);
    }
  };

  return (
    <div className="image-upload" style={{ marginBottom: '1rem' }}>
      <label>{label}</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && errorMessage && (
        <div className="error-message" style={{ color: 'red', fontSize: '0.9rem' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
