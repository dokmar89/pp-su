// src/components/Dashboard.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import StatCard from './ui/StatCard';
import DataTable from './ui/DataTable';
import Button from './ui/Button';
import Loading from './ui/Loading';
import WalletTopUpModal from './WalletTopUpModal';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUserId(data.user.id);
        console.log('User ID:', data.user.id);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <Loading isLoading={true} />;

  // Statické hodnoty – prozatím bez dynamického načítání
  const approved = 10;
  const rejected = 2;

  const recentVerifications = [
    { id: '1', eshop: 'Eshop A', method: 'BankID', time: '2025-02-16 10:00', result: 'Schváleno', price: '100 Kč' },
    { id: '2', eshop: 'Eshop B', method: 'OCR', time: '2025-02-16 09:30', result: 'Zamítnuto', price: '80 Kč' },
  ];

  const columns = [
    { header: 'ID ověření', key: 'id' },
    { header: 'Eshop', key: 'eshop' },
    { header: 'Metoda', key: 'method' },
    { header: 'Čas', key: 'time' },
    { header: 'Výsledek', key: 'result' },
    { header: 'Cena', key: 'price' },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <section style={{ display: 'flex', gap: '1rem' }}>
        <StatCard title="Schváleno" value={approved} />
        <StatCard title="Zamítnuto" value={rejected} />
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h2>Nedávná ověření</h2>
        <DataTable columns={columns} data={recentVerifications} />
      </section>
      <section style={{ marginTop: '2rem' }}>
        <h2>Dobít peněženku</h2>
        <div style={{ marginBottom: '1rem' }}>Zůstatek peněženky: 5000 Kč</div>
        <Button label="Dobít peněženku" onClick={() => setShowTopUpModal(true)} />
      </section>
      {showTopUpModal && <WalletTopUpModal onClose={() => setShowTopUpModal(false)} />}
    </div>
  );
};

export default Dashboard;
