import React from 'react';

const CameraFeed: React.FC = () => {
  // Placeholder: V produkci nahradit implementací živého feedu z kamery
  return (
    <div 
      className="camera-feed" 
      style={{ 
        width: '100%', 
        height: '300px', 
        backgroundColor: '#000', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px'
      }}
    >
      Camera Feed Placeholder (ovál pro detekci obličeje)
    </div>
  );
};

export default CameraFeed;
