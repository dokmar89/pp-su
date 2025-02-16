import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import { supabase } from '../lib/supabase';
import { EshopBranding } from '../lib/types';

interface AgeVerificationModalProps {
  eshopId: string;
  onVerificationSuccess: () => void;
  onVerificationFail: () => void;
  onClose: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  eshopId,
  onVerificationSuccess,
  onVerificationFail,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [brandingSettings, setBrandingSettings] = useState<EshopBranding | null>(null);
  const [enabledVerificationMethods, setEnabledVerificationMethods] = useState<string[]>([]);

  useEffect(() => {
    const fetchEshopData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('eshops')
          .select('branding_settings, verification_methods')
          .eq('id', eshopId)
          .single();
        if (error) {
          console.error("Error fetching eshop data:", error.message);
          setError('Chyba při načítání nastavení ověření. Prosím, zkuste to znovu později.');
        } else if (data) {
          setBrandingSettings(data.branding_settings);
          setEnabledVerificationMethods(data.verification_methods || []);
        }
      } catch (err: any) {
        console.error("Exception while fetching eshop data:", err);
        setError('Chyba při načítání nastavení ověření. Prosím, zkuste to znovu později.');
      } finally {
        setLoading(false);
      }
    };

    fetchEshopData();
  }, [eshopId]);

  const handleVerificationMethod = (method: string) => {
    // Production-ready logika: zde by se spustil ověřovací proces.
    console.info(`Metoda ověření "${method}" byla vybrána.`);
    // V produkci by se zavolala příslušná funkce (např. edge function, RPC, apod.)
    // Zde simuluji výsledek: například BankID vede k úspěchu, ostatní k neúspěchu.
    if (method.toLowerCase() === 'bankid') {
      onVerificationSuccess();
    } else {
      onVerificationFail();
    }
  };

  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title={brandingSettings?.modalTitle || "Ověření Věku"}
      confirmText="" // Nemáme standardní potvrzovací tlačítko – pouze tlačítko Zavřít
      cancelText="Zavřít"
    >
      {loading && <Loading isLoading={true} />}
      {error && <Notification type="error" message={error} />}
      {!loading && !error && (
        <>
          <p>
            {brandingSettings?.introText ||
              "Pro dokončení nákupu prosím ověřte svůj věk."}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            {enabledVerificationMethods.map((method) => {
              let label = "";
              switch (method.toLowerCase()) {
                case "bankid":
                  label = "BankID";
                  break;
                case "mojeid":
                  label = "mojeID";
                  break;
                case "ocr":
                  label = "OCR";
                  break;
                case "facescan":
                  label = "Face Scan";
                  break;
                case "repeated":
                  label = "Opakované ověření";
                  break;
                case "qrcode":
                  label = "QR kód";
                  break;
                default:
                  label = method;
              }
              return (
                <Button
                  key={method}
                  label={label}
                  onClick={() => handleVerificationMethod(method)}
                />
              );
            })}
          </div>
        </>
      )}
    </ConfirmationModal>
  );
};

export default AgeVerificationModal;
