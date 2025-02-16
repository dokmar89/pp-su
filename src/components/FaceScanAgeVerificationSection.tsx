import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import CameraFeed from './ui/CameraFeed';
import Checkbox from './ui/Checkbox';

interface FaceScanAgeVerificationSectionProps {
  verificationId: string;
}

const FaceScanAgeVerificationSection: React.FC<FaceScanAgeVerificationSectionProps> = ({ verificationId }) => {
  const [verificationStatusMessage, setVerificationStatusMessage] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [saveResult, setSaveResult] = useState<boolean>(false);

  // Placeholder: v produkci spustit proces detekce obličeje
  const simulateFaceScanVerification = () => {
    setIsVerifying(true);
    setVerificationStatusMessage("Probíhá ověřování...");
    setTimeout(() => {
      const success = true; // simulace úspěchu, případně false
      if (success) {
        setVerificationStatusMessage("Věk ověřen. Můžete pokračovat v nákupu.");
      } else {
        setVerificationStatusMessage("Věk se nepodařilo ověřit.");
      }
      setIsVerifying(false);
    }, 2500);
  };

  return (
    <ConfirmationModal
      isOpen={true}
      onClose={() => console.info("Face scan modal zavřen.")}
      title="Ověření obličejem"
      confirmText=""
      cancelText="Zavřít"
    >
      <div style={{ padding: '1rem' }}>
        <CameraFeed />
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>Umístěte prosím obličej do oválu.</p>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Button label="Spustit ověření" onClick={simulateFaceScanVerification} disabled={isVerifying} />
        </div>
        {isVerifying && <Loading isLoading={true} />}
        {verificationStatusMessage && (
          <div style={{ marginTop: '1rem', fontWeight: 'bold', textAlign: 'center', color: verificationStatusMessage.includes("ověřen") ? 'green' : (verificationStatusMessage.includes("nepodařilo") ? 'red' : '#333') }}>
            {verificationStatusMessage}
          </div>
        )}
        {verificationStatusMessage === "Věk ověřen. Můžete pokračovat v nákupu." && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Checkbox label="Uložit výsledek?" checked={saveResult} onChange={setSaveResult} />
          </div>
        )}
      </div>
    </ConfirmationModal>
  );
};

export default FaceScanAgeVerificationSection;
