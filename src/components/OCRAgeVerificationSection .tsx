import React, { useState } from 'react';
import Button from './ui/Button';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import ImageUpload from './ui/ImageUpload';
import ImagePreview from './ui/ImagePreview';
import Checkbox from './ui/Checkbox';
import ConfirmationModal from './ConfirmationModal';

interface OCRAgeVerificationSectionProps {
  verificationId: string;
}

const OCRAgeVerificationSection: React.FC<OCRAgeVerificationSectionProps> = ({ verificationId }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [verificationStatusMessage, setVerificationStatusMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [saveResult, setSaveResult] = useState<boolean>(false);

  const handleUploadClick = () => {
    console.log("Otevření dialogu pro výběr souboru.");
    // ImageUpload komponenta provede vlastní obsluhu; zde pouze log
  };

  const handleCameraClick = () => {
    console.log("Otevření kamery (placeholder).");
    // V produkci spustí funkci pro otevření kamery
  };

  const handleVerify = () => {
    if (!imagePreviewUrl) return;
    setIsVerifying(true);
    setVerificationStatusMessage("Probíhá ověřování...");
    // Simulace asynchroní operace (např. volání OCR API)
    setTimeout(() => {
      // Simulujeme úspěšné ověření; v produkci logiku upravte dle skutečných výsledků
      const verificationSuccess = true; // nebo false pro neúspěch
      if (verificationSuccess) {
        setVerificationStatusMessage("Věk ověřen. Můžete pokračovat v nákupu.");
      } else {
        setVerificationStatusMessage("Věk se nepodařilo ověřit z dokladu.");
      }
      setIsVerifying(false);
    }, 2500);
  };

  return (
    <ConfirmationModal
      isOpen={true}
      onClose={() => console.info("OCR modal zavřen.")}
      title="Ověření dokladem totožnosti"
      confirmText=""
      cancelText="Zavřít"
    >
      <div style={{ padding: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button label="Nahrát fotografii" onClick={handleUploadClick} />
          <Button label="Otevřít kameru" onClick={handleCameraClick} style={{ marginLeft: '1rem' }} />
        </div>
        <ImageUpload label="Vyberte soubor:" onChange={setImagePreviewUrl} />
        <ImagePreview imageUrl={imagePreviewUrl} />
        <div style={{ marginTop: '1rem' }}>
          <Button 
            label="Ověřit" 
            onClick={handleVerify} 
            disabled={!imagePreviewUrl || isVerifying}
          />
        </div>
        {isVerifying && <Loading isLoading={true} />}
        {verificationStatusMessage && (
          <div style={{ marginTop: '1rem', fontWeight: 'bold', color: verificationStatusMessage.includes("ověřen") ? 'green' : (verificationStatusMessage.includes("nepodařilo") ? 'red' : '#333') }}>
            {verificationStatusMessage}
          </div>
        )}
        {/* Podmíněné zobrazení: pokud ověření úspěšné, zobrazíme Checkbox "Uložit výsledek?" a tlačítko "Zkusit znovu" pokud selhalo */}
        {verificationStatusMessage === "Věk ověřen. Můžete pokračovat v nákupu." && (
          <div style={{ marginTop: '1rem' }}>
            <Checkbox label="Uložit výsledek?" checked={saveResult} onChange={setSaveResult} />
          </div>
        )}
        {verificationStatusMessage === "Věk se nepodařilo ověřit z dokladu." && (
          <div style={{ marginTop: '1rem' }}>
            <Button label="Zkusit znovu" onClick={handleVerify} />
          </div>
        )}
      </div>
    </ConfirmationModal>
  );
};

export default OCRAgeVerificationSection;
