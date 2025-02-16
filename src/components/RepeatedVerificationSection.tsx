import React, { useState } from 'react';
import Button from './ui/Button';
import PhoneInput from './ui/PhoneInput';
import EmailInput from './ui/EmailInput';
import NumberInput from './ui/NumberInput';
import Notification from './ui/Notification';

interface RepeatedVerificationSectionProps {
  eshopId: string;
}

const RepeatedVerificationSection: React.FC<RepeatedVerificationSectionProps> = ({ eshopId }) => {
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'email' | 'google' | 'apple' | null>(null);
  const [verificationStatusMessage, setVerificationStatusMessage] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<number | null>(null);

  const handleMethodClick = (method: 'phone' | 'email' | 'google' | 'apple') => {
    setSelectedMethod(method);
    setVerificationStatusMessage("");
  };

  const handleSendCode = () => {
    // Production-ready: zde bude volání API pro odeslání kódu
    setVerificationStatusMessage("Kód byl odeslán.");
  };

  const handleConfirmCode = () => {
    setVerificationStatusMessage("Probíhá ověřování kódu...");
    setTimeout(() => {
      // Production-ready: zde bude logika ověření kódu
      setVerificationStatusMessage("Ověření úspěšné.");
    }, 2000);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Opakované ověření</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Button label="Telefon" onClick={() => handleMethodClick('phone')} />
        <Button label="Email" onClick={() => handleMethodClick('email')} style={{ marginLeft: '0.5rem' }} />
        <Button label="Google" onClick={() => handleMethodClick('google')} style={{ marginLeft: '0.5rem' }} />
        <Button label="Apple ID" onClick={() => handleMethodClick('apple')} style={{ marginLeft: '0.5rem' }} />
      </div>
      {/* V této verzi se vždy zobrazuje sekce pro ověření telefonem/emailem */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '4px' }}>
        <PhoneInput label="Telefonní číslo" placeholder="Zadejte telefonní číslo" value={phone} onChange={setPhone} />
        <EmailInput label="Emailová adresa" placeholder="Zadejte emailovou adresu" value={email} onChange={setEmail} />
        <div style={{ marginTop: '0.5rem' }}>
          <Button label="Odeslat kód" onClick={handleSendCode} />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <NumberInput label="Ověřovací kód" placeholder="Zadejte ověřovací kód" value={verificationCode !== null ? verificationCode : 0} onChange={(val) => setVerificationCode(val)} />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Button label="Potvrdit kód" onClick={handleConfirmCode} />
        </div>
      </div>
      {verificationStatusMessage && (
        <div style={{ marginTop: '1rem' }}>
          <Notification type="info" message={verificationStatusMessage} />
        </div>
      )}
    </div>
  );
};

export default RepeatedVerificationSection;
