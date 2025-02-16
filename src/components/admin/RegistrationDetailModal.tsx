import React from 'react';
import ConfirmationModal from '../ui/ConfirmationModal';
import Button from '../ui/Button';
import ReadOnlyDisplay from '../ui/ReadOnlyDisplay';

interface RegistrationDetailModalProps {
  registration: {
    id: string;
    companyName: string;
    ico: string;
    dic?: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  onClose: () => void;
}

const RegistrationDetailModal: React.FC<RegistrationDetailModalProps> = ({ registration, onClose }) => {
  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title="Detail registrace"
      confirmText=""
      cancelText="Zavřít"
    >
      <div style={{ padding: '1rem' }}>
        <ReadOnlyDisplay label="ID registrace" value={registration.id} />
        <ReadOnlyDisplay label="Název firmy" value={registration.companyName} />
        <ReadOnlyDisplay label="IČO" value={registration.ico} />
        <ReadOnlyDisplay label="DIČ" value={registration.dic || "-"} />
        <ReadOnlyDisplay label="Adresa" value={registration.address} />
        <ReadOnlyDisplay label="Kontaktní osoba" value={registration.contactPerson} />
        <ReadOnlyDisplay label="Email" value={registration.email} />
        <ReadOnlyDisplay label="Telefon" value={registration.phone} />
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Button label="Schválit registraci" onClick={() => { /* Placeholder */ }} />
          <Button label="Zamítnout registraci" onClick={() => { /* Placeholder */ }} style={{ marginLeft: '0.5rem' }} />
          <Button label="Zavřít" onClick={onClose} style={{ marginLeft: '0.5rem' }} />
        </div>
      </div>
    </ConfirmationModal>
  );
};

export default RegistrationDetailModal;
