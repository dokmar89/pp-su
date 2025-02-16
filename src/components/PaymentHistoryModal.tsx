// src/components/PaymentHistoryModal.tsx
"use client";

import React from 'react';
import DataTable from './ui/DataTable';
import Button from './ui/Button';

type PaymentHistoryModalProps = {
  onClose: () => void;
};

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ onClose }) => {
  const paymentHistoryData = [
    { time: '2025-02-15 12:00', type: 'Dobití', value: '1000 Kč', price: '1000 Kč', status: 'Úspěšné', vs: '111' },
    { time: '2025-02-14 15:30', type: 'Platba', value: '500 Kč', price: '500 Kč', status: 'Neúspěšné', vs: '222' },
  ];

  const columns = [
    { header: 'Čas', key: 'time' },
    { header: 'Typ transakce', key: 'type' },
    { header: 'Hodnota', key: 'value' },
    { header: 'Cena', key: 'price' },
    { header: 'Stav', key: 'status' },
    { header: 'Variabilní symbol', key: 'vs' },
  ];

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '600px' }}>
        <h1>Výpis plateb</h1>
        <DataTable columns={columns} data={paymentHistoryData} />
        <div style={{ marginTop: '1rem' }}>
          <Button label="Zavřít" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
