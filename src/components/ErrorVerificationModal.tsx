import React from 'react';
import ConfirmationModal from './ConfirmationModal';
import Button from './ui/Button';
import Icon from './ui/Icon';

interface ErrorVerificationModalProps {
  onClose: () => void;
  onRetry: () => void;
}

const ErrorVerificationModal: React.FC<ErrorVerificationModalProps> = ({ onClose, onRetry }) => {
  return (
    <ConfirmationModal
      isOpen={true}
      onClose={onClose}
      title=""
      confirmText=""
      cancelText="Zavřít"
    >
      <div style={{ textAlign: 'center', padding: '1rem' }}>
        <Icon type="warning" style={{ fontSize: '3rem', color: 'orange' }} />
        <h1>Při ověřování věku došlo k chybě. Prosím, zkuste to znovu později.</h1>
        <div style={{ marginTop: '1rem' }}>
          <Button label="Zkusit znovu" onClick={onRetry} />
        </div>
      </div>
    </ConfirmationModal>
  );
};

export default ErrorVerificationModal;
