// src/components/AgeVerificationModal.tsx
import React, { useState, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import { supabase } from '../lib/supabase';
import { EshopBranding } from '../lib/types';
import useEshopData from '../lib/hooks/useEshopData'; // Import hooku

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
  const { loading: dataLoading, eshop, error: dataError } = useEshopData(eshopId); // Použij hook

  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleVerificationMethod = async (method: string) => {
    setVerificationLoading(true);
    setVerificationError(null);

    try {
      let response;
      let data;

      switch (method.toLowerCase()) {
        case "bankid":
          // Volání API pro BankID (placeholder URL - uprav dle skutečnosti)
          response = await fetch('/api/bankid-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eshopId }), // Můžeš potřebovat další data
          });
          data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Chyba při ověřování BankID.');
          }
          // Zde bys mohl přesměrovat uživatele na BankID URL (data.redirectUrl)
          console.log("BankID response:", data); // Pro debug
          break;
        case "mojeid":
             response = await fetch('/api/mojeid-verification', { // Předpokládám, že máš endpoint
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ eshopId }),
             });
            data = await response.json();
            if (!response.ok) {
              throw new Error(data.error || "Chyba pri overovani MojeID");
            }
            console.log("MojeId response:", data);
          break;
        case "ocr":
            response = await fetch('/api/ocr-verification', { // Předpokládám, že máš endpoint
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ eshopId , /*imageData*/}), // PŘIDEJ SEM DATA OBRÁZKU!
            });
           data = await response.json();
           if(!response.ok){
            throw new Error(data.error || "Chyba pri OCR overeni")
           }
           if(data.success){
            onVerificationSuccess();
           } else {
            onVerificationFail();
           }
          break;
        case "facescan":
           response = await fetch('/api/facescan-verification', { // Předpokládám, že máš endpoint
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ eshopId, /*imageData*/ }), // PŘIDEJ DATA OBRÁZKU!
           });
            data = await response.json();
             if (!response.ok) {
               throw new Error(data.error || "Chyba pri Facescan overeni");
             }
            if (data.success) {
              onVerificationSuccess();
            } else {
              onVerificationFail();
            }
          break;
        case "repeated":
          // Logika pro opakované ověření (např. volání API pro odeslání kódu)
          console.log("Opakované ověření - implementuj logiku");
          break;
        case "qrcode":
          // Logika pro QR kód (např. generování QR kódu)
          console.log("QR kód ověření - implementuj logiku");
          break;
        default:
          throw new Error(`Neznámá metoda ověření: ${method}`);
      }

      // Pokud nenastala chyba a máme data, zpracuj výsledek (např. přesměruj, zavolej callback, atd.)
      // if (data) { ... }

    } catch (error: any) {
      setVerificationError(error.message);
      onVerificationFail(); // V případě chyby volej onVerificationFail

    } finally {
      setVerificationLoading(false);
    }
  };

    if (dataLoading) {
        return <Loading isLoading={true} />;
    }

    if (dataError) {
        return <Notification type="error" message={dataError} />;
    }


    return (
        <ConfirmationModal
            isOpen={true}
            onClose={onClose}
            title={eshop?.branding_settings?.modalTitle || "Ověření Věku"}
            confirmText=""  // Nemáme potvrzovací tlačítko
            cancelText="Zavřít"
        >
            {verificationLoading && <Loading isLoading={true} />}
            {verificationError && <Notification type="error" message={verificationError} />}

            {!verificationLoading && !verificationError && (
                <>
                    <p>
                        {eshop?.branding_settings?.introText ||
                            "Pro dokončení nákupu prosím ověřte svůj věk."}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {eshop?.verification_methods.map((method) => {
                            let label = "";
                            switch (method.toLowerCase()) {
                                case "bankid": label = "BankID"; break;
                                case "mojeid": label = "mojeID"; break;
                                case "ocr": label = "OCR"; break;
                                case "facescan": label = "Face Scan"; break;
                                case "repeated": label = "Opakované ověření"; break;
                                case "qrcode": label = "QR kód"; break;
                                default: label = method;
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