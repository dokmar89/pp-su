// src/components/WalletTopUpModal.tsx
"use client";

import React, { useState } from 'react';
import Button from './ui/Button';
import NumberInput from './ui/NumberInput';
import QRCode from './ui/QRCode';

type WalletTopUpModalProps = {
  onClose: () => void;
};

const WalletTopUpModal: React.FC<WalletTopUpModalProps> = ({ onClose }) => {
  const [customAmount, setCustomAmount] = useState<number | ''>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const presetAmounts = [500, 1000, 2000, 5000];

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount);
  };

  const handleConfirm = () => {
    // Zde by se v reálné implementaci volala RPC funkce create_top_up_transaction.
    // Prozatím zobrazíme placeholder QR kód a platební informace.
    setShowQRCode(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '400px' }}>
        <h1>Dobít peněženku</h1>
        <div>
          <h3>Předvolené částky:</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {presetAmounts.map((amount) => (
              <Button key={amount} label={`${amount} Kč`} onClick={() => handlePresetClick(amount)} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <NumberInput
            label="Vlastní částka (Kč):"
            placeholder="Zadejte částku"
            value={customAmount}
            onChange={setCustomAmount}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Button label="Potvrdit a zobrazit QR kód" onClick={handleConfirm} />
        </div>
        {showQRCode && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Platební informace:</h3>
            <p>V prospěch účtu: 123456789</p>
            <p>Variabilní symbol: 987654321</p>
            <p>Částka k úhradě (s DPH): {customAmount || selectedAmount} Kč</p>
            <div style={{ marginTop: '1rem' }}>
              <QRCode value="https://placeholder.qrcode.com" />
            </div>
          </div>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Button label="Zavřít" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default WalletTopUpModal;
