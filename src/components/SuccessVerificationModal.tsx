import React, { useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Icon from './ui/Icon';

interface SuccessVerificationModalProps {
  onClose: () => void;
  showContinueButton?: boolean;
}

const SuccessVerificationModal: React.FC<SuccessVerificationModalProps> = ({ onClose, showContinueButton = false }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title=""
      confirmText=""
      cancelText=""
    >
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Icon type="success" style={{ fontSize: '3rem', color: 'green' }} />
        <h1>Věk úspěšně ověřen!</h1>
        {showContinueButton && (
          <div style={{ marginTop: '1rem' }}>
            <Button label="Pokračovat v nákupu" onClick={onClose} />
          </div>
        )}
      </div>
    </ConfirmationModal>
  );
};

export default SuccessVerificationModal;
