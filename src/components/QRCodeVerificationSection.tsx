import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import Button from './ui/Button';
import QRCode from 'qrcode.react';

interface QRCodeVerificationSectionProps {
  onClose: () => void;
}

const QRCodeVerificationSection: React.FC<QRCodeVerificationSectionProps> = ({ onClose }) => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCodeData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/generate-qr-code-data');
        if (!response.ok) {
          throw new Error('Chyba při generování QR kódu. Prosím, zkuste to znovu později.');
        }
        const data = await response.json();
        if (!data.qrCodeData) {
          throw new Error('QR kód data nebyla vrácena.');
        }
        setQrCodeData(data.qrCodeData);
      } catch (err: any) {
        console.error("Error generating QR code:", err);
        setError(err.message || 'Nepodařilo se vygenerovat QR kód.');
      } finally {
        setLoading(false);
      }
    };

    fetchQrCodeData();
  }, []);

  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title="QR kód pro ověření na jiném zařízení"
      confirmText=""
      cancelText="Zavřít"
    >
      {loading && <Loading isLoading={true} />}
      {error && <Notification type="error" message={error} />}
      {!loading && !error && qrCodeData && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <QRCode value={qrCodeData} size={256} />
          <p style={{ marginTop: '1rem' }}>
            Naskenujte tento QR kód pomocí mobilního telefonu a dokončete ověření na jiném zařízení.
          </p>
        </div>
      )}
    </ConfirmationModal>
  );
};

export default QRCodeVerificationSection;
