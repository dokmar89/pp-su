import React from 'react';

export interface ImagePreviewProps {
  imageUrl: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl }) => {
  return (
    <div className="image-preview" style={{ marginTop: '1rem', textAlign: 'center' }}>
      {imageUrl ? (
        <img src={imageUrl} alt="Náhled" style={{ maxWidth: '100%', maxHeight: '300px' }} />
      ) : (
        <div style={{ width: '100%', height: '300px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          Žádný náhled
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
