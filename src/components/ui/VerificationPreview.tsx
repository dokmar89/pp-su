// src/components/ui/VerificationPreview.tsx
import React from 'react';

export type VerificationPreviewProps = {
  eshopSettings: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    introductionText?: string;
    // Další nastavení lze doplnit dle potřeby
  };
};

const VerificationPreview: React.FC<VerificationPreviewProps> = ({ eshopSettings }) => {
  return (
    <div style={{ border: '1px dashed #ccc', padding: '1rem', marginTop: '1rem' }}>
      <h3>Náhled ověřovacího procesu</h3>
      <p>Tato sekce slouží jako náhled ověřovacího procesu.</p>
      {eshopSettings && (
        <ul>
          <li>Logo: {eshopSettings.logo ? 'Nahráno' : 'Není nahráno'}</li>
          <li>Primární barva: {eshopSettings.primaryColor || 'Není nastavena'}</li>
          <li>Sekundární barva: {eshopSettings.secondaryColor || 'Není nastavena'}</li>
          <li>Úvodní text: {eshopSettings.introductionText || 'Není nastaven'}</li>
        </ul>
      )}
    </div>
  );
};

export default VerificationPreview;
