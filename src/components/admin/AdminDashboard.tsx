import React from 'react';
import StatCard from '../ui/StatCard';
import DataTable from '../ui/DataTable';
import Notification from '../ui/Notification';

const AdminDashboard: React.FC = () => {
  // Placeholder data – ve finální verzi načtěte reálná data přes API
  const statCardsData = [
    { title: "Registrované firmy", value: 120 },
    { title: "Schválené registrace", value: 95 },
    { title: "Čekající registrace", value: 25 },
    { title: "Celkový zůstatek peněženek", value: "€150,000" },
    { title: "Ověření celkem", value: 1000 },
    { title: "Úspěšná ověření", value: 950 },
    { title: "Support tickety", value: 80 },
  ];

  const registrationsColumns = [
    { header: "ID registrace", key: "id" },
    { header: "Název firmy", key: "companyName" },
    { header: "Datum registrace", key: "registeredAt" },
    { header: "Email", key: "email" },
    { header: "Stav", key: "status" },
    { header: "Akce", key: "actions" },
  ];

  const registrationsData = [
    {
      id: "REG-001",
      companyName: "Firma A",
      registeredAt: "2024-01-15",
      email: "kontakt@firma-a.cz",
      status: "Čeká na schválení",
      actions: "Zobrazit detail / Schválit / Zamítnout",
    },
    // Další řádky...
  ];

  const transactionsColumns = [
    { header: "ID transakce", key: "id" },
    { header: "Název firmy", key: "companyName" },
    { header: "Částka", key: "amount" },
    { header: "Variabilní symbol", key: "variableSymbol" },
    { header: "Čas", key: "transactionTime" },
    { header: "Stav", key: "status" },
    { header: "Akce", key: "actions" },
  ];

  const transactionsData = [
    {
      id: "TX-001",
      companyName: "Firma B",
      amount: "€500",
      variableSymbol: "VS123456",
      transactionTime: "2024-01-18 14:30",
      status: "Dokončeno",
      actions: "Zobrazit detail",
    },
    // Další řádky...
  ];

  const ticketsColumns = [
    { header: "ID ticketu", key: "id" },
    { header: "Předmět", key: "subject" },
    { header: "Firma", key: "companyName" },
    { header: "Kategorie", key: "category" },
    { header: "Stav", key: "status" },
    { header: "Vytvořeno", key: "createdAt" },
    { header: "Akce", key: "actions" },
  ];

  const ticketsData = [
    {
      id: "TCK-001",
      subject: "Problém s ověřením",
      companyName: "Firma C",
      category: "Technická",
      status: "Nový",
      createdAt: "2024-01-20 09:00",
      actions: "Detail",
    },
    // Další řádky...
  ];

  return (
    <div>
      <h1>Dashboard Administrátora</h1>
      
      {/* Sekce statistik */}
      <section style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {statCardsData.map((card, index) => (
          <StatCard key={index} title={card.title} value={card.value} />
        ))}
      </section>

      {/* Registrace firem */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Nedávné registrace firem</h2>
        <DataTable columns={registrationsColumns} data={registrationsData} />
      </section>

      {/* Transakce dobití peněženky */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Nedávné transakce dobití peněženky</h2>
        <DataTable columns={transactionsColumns} data={transactionsData} />
      </section>

      {/* Support tickety */}
      <section style={{ marginTop: '2rem' }}>
        <h2>Otevřené support tickety</h2>
        <DataTable columns={ticketsColumns} data={ticketsData} />
      </section>

      <Notification type="success" message="Data byla úspěšně načtena." />
    </div>
  );
};

export default AdminDashboard;
