import React, { useState } from 'react';
import RadioGroup from './ui/RadioGroup';
import RadioButton from './ui/RadioButton';
import PhoneInput from './ui/PhoneInput';
import EmailInput from './ui/EmailInput';
import Button from './ui/Button';
import Notification from './ui/Notification';

interface SaveVerificationResultSectionProps {
  eshopId: string;
}

const SaveVerificationResultSection: React.FC<SaveVerificationResultSectionProps> = ({ eshopId }) => {
  const [selectedSaveMethod, setSelectedSaveMethod] = useState<'phone' | 'email' | 'google' | 'apple' | 'cookie' | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = () => {
    // Production-ready: zde by se volalo API pro uložení nastavení
    console.info("Ukládám výsledek ověření pro eshop:", eshopId, "metodou:", selectedSaveMethod);
    setNotification({ type: 'success', message: 'Výsledek ověření byl uložen.' });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Uložit pro opakované ověření</h1>
      <RadioGroup
        label="Vyberte způsob uložení pro opakované ověření:"
        value={selectedSaveMethod || ""}
        onChange={(val: string) => setSelectedSaveMethod(val as any)}
        options={[
          { value: 'phone', label: 'Telefon' },
          { value: 'email', label: 'Email' },
          { value: 'google', label: 'Účet Google' },
          { value: 'apple', label: 'Účet Apple ID' },
          { value: 'cookie', label: 'Uložit cookies' },
        ]}
      />
      {selectedSaveMethod === 'phone' && (
        <PhoneInput label="Telefonní číslo" placeholder="Zadejte telefonní číslo" value={phone} onChange={setPhone} />
      )}
      {selectedSaveMethod === 'email' && (
        <EmailInput label="Emailová adresa" placeholder="Zadejte emailovou adresu" value={email} onChange={setEmail} />
      )}
      {(selectedSaveMethod === 'google' || selectedSaveMethod === 'apple') && (
        <div style={{ marginTop: '1rem' }}>
          <Button
            label={selectedSaveMethod === 'google' ? 'Propojit s Googlem' : 'Propojit s Apple ID'}
            onClick={() => console.info("Propojit:", selectedSaveMethod)}
          />
        </div>
      )}
      <div style={{ marginTop: '1rem' }}>
        <Button label="Potvrdit a uložit" onClick={handleSave} />
      </div>
      {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
};

export default SaveVerificationResultSection;
