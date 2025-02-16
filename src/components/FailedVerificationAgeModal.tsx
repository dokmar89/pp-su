import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Icon from './ui/Icon';

interface FailedVerificationAgeModalProps {
  onClose: () => void;
}

const FailedVerificationAgeModal: React.FC<FailedVerificationAgeModalProps> = ({ onClose }) => {
  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title=""
      confirmText=""
      cancelText="Zavřít"
    >
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Icon type="error" style={{ fontSize: '3rem', color: 'red' }} />
        <h1>Je nám líto, ale pro nákup tohoto zboží musíte být starší 18 let.</h1>
        <div style={{ marginTop: '1rem' }}>
          <Button label="Zavřít" onClick={onClose} />
        </div>
      </div>
    </ConfirmationModal>
  );
};

export default FailedVerificationAgeModal;
