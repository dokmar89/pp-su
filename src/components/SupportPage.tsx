import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Tabs from './ui/Tabs';
import Tab from './ui/Tab';
import FAQAccordion from './ui/FAQAccordion';
import DataTable from './ui/DataTable';
import TextInput from './ui/TextInput';
import Select from './ui/Select';
import TextArea from './ui/TextArea';
import Button from './ui/Button';
import FileUpload from './ui/FileUpload'; // Placeholder
import Link from './ui/Link';
import Notification from './ui/Notification';
import Loading from './ui/Loading';
import SupportTicketDetailModal from './SupportTicketDetailModal';

const SupportPage: React.FC = () => {
  // Stav formuláře pro odeslání ticketu
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  // Pro případné přílohy – zatím placeholder
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketNotification, setTicketNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Historie ticketů
  const [tickets, setTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  // Identifikátor firmy / uživatele
  const [companyId, setCompanyId] = useState<string>('');
  // Stav modálního okna pro detail ticketu
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Předdefinované možnosti pro kategorii ticketu
  const ticketCategoryOptions = [
    { value: 'technicka', label: 'Technická' },
    { value: 'fakturace', label: 'Fakturace' },
    { value: 'ucet', label: 'Účet' },
    { value: 'funkce', label: 'Žádost o funkci' },
    { value: 'chyba', label: 'Hlášení chyby' },
    { value: 'ostatni', label: 'Ostatní' },
  ];

  // Pro Select v sekci Instalace – placeholder eshopy
  const eshopOptions = [
    { value: 'eshop1', label: 'Eshop 1' },
    { value: 'eshop2', label: 'Eshop 2' },
  ];

  // Simulace načtení companyId z autentizace
  useEffect(() => {
    async function fetchUser() {
      const { data: userData, error } = await supabase.auth.getUser();
      if (userData?.user) {
        // Pro placeholder předpokládáme, že companyId je shodné s uživatelským id
        setCompanyId(userData.user.id);
      }
    }
    fetchUser();
  }, []);

  // Načtení historie ticketů
  useEffect(() => {
    async function fetchTickets() {
      setTicketsLoading(true);
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('companyId', companyId);
        if (error) {
          setTicketNotification({ type: 'error', message: 'Chyba při načítání historie ticketů. Historie ticketů nemusí být kompletní.' });
        } else {
          setTickets(data || []);
        }
      } catch (err: any) {
        setTicketNotification({ type: 'error', message: err.message });
      }
      setTicketsLoading(false);
    }
    if (companyId) {
      fetchTickets();
    }
  }, [companyId]);

  // Odeslání formuláře pro ticket
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !category || !message) {
      setTicketNotification({ type: 'error', message: 'Vyplňte prosím všechna povinná pole: Předmět, Kategorie, Zpráva.' });
      return;
    }
    setTicketLoading(true);
    setTicketNotification(null);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{ subject, category, message, companyId, status: 'new' }]);
      if (error) {
        setTicketNotification({ type: 'error', message: 'Chyba při odesílání požadavku. Prosím, zkuste to znovu později.' });
      } else {
        setTicketNotification({ type: 'success', message: 'Váš požadavek byl úspěšně odeslán. Budeme vás kontaktovat.' });
        // Reset formuláře
        setSubject('');
        setCategory('');
        setMessage('');
        // Refetch historie ticketů
        const { data } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('companyId', companyId);
        setTickets(data || []);
      }
    } catch (err: any) {
      setTicketNotification({ type: 'error', message: err.message });
    }
    setTicketLoading(false);
  };

  // Definice sloupců pro DataTable historie ticketů
  const ticketColumns = [
    { header: 'ID ticketu', key: 'id' },
    { header: 'Předmět', key: 'subject' },
    { header: 'Kategorie', key: 'category' },
    { header: 'Stav', key: 'status' },
    { header: 'Vytvořeno', key: 'created_at' },
    { header: 'Akce', key: 'actions' },
  ];

  // Převod ticketů pro DataTable (přidání tlačítka Detail)
  const ticketData = tickets.map(ticket => ({
    ...ticket,
    actions: <Button label="Detail" onClick={() => { setSelectedTicket(ticket); setDetailModalOpen(true); }} />,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Podpora</h1>
      
      {/* Sekce Rychlá pomoc */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Rychlá pomoc</h2>
        <Tabs>
          <Tab label="Časté dotazy">
            <FAQAccordion
              items={[
                { question: 'Jak nastavit účet?', answer: 'Pro nastavení účtu postupujte následovně: ...' },
                { question: 'Co dělat při chybě přihlášení?', answer: 'Pokud máte problémy s přihlášením, ...' },
              ]}
            />
          </Tab>
          <Tab label="Znalostní báze">
            <ul>
              <li><Link href="https://example.com/zaciname">Začínáme</Link></li>
              <li><Link href="https://example.com/metody">Metody</Link></li>
              <li><Link href="https://example.com/nejlepsi-postupy">Nejlepší postupy</Link></li>
              <li><Link href="https://example.com/troubleshooting">Troubleshooting</Link></li>
              <li><Link href="https://example.com/zabezpeceni">Zabezpečení</Link></li>
            </ul>
          </Tab>
          <Tab label="API dokumentace">
            <Link href="/api-documentation">Přejít na API dokumentaci</Link>
          </Tab>
          <Tab label="Návody integrace">
            <ul>
              <li><Link href="https://example.com/pruvodce">Průvodce</Link></li>
              <li><Link href="https://example.com/integrace-sdk">Integrace SDK</Link></li>
              <li><Link href="https://example.com/pluginy">Pluginy pro e-commerce</Link></li>
            </ul>
          </Tab>
        </Tabs>
      </section>

      {/* Sekce Systém podpory */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Odeslat ticket</h2>
        <form onSubmit={handleTicketSubmit}>
          {ticketNotification && <Notification type={ticketNotification.type} message={ticketNotification.message} />}
          <TextInput label="Předmět" placeholder="Zadejte předmět ticketu" value={subject} onChange={setSubject} required />
          <Select label="Kategorie požadavku" options={ticketCategoryOptions} value={category} onChange={setCategory} required />
          <TextArea label="Zpráva" placeholder="Zadejte zprávu" value={message} onChange={setMessage} required />
          {/* FileUpload komponenta – zatím placeholder */}
          <div style={{ marginBottom: '1rem' }}>
            <p>Přílohy: [FileUpload komponenta]</p>
          </div>
          <Button label={ticketLoading ? 'Odesílám...' : 'Odeslat požadavek / Ticket'} onClick={handleTicketSubmit} disabled={ticketLoading} />
        </form>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Historie ticketů</h2>
        {ticketsLoading ? (
          <Loading isLoading={true} />
        ) : (
          <DataTable columns={ticketColumns} data={ticketData} />
        )}
      </section>

      {/* Sekce Instalace */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Instalace</h2>
        <Select label="Výběr eshopu" options={eshopOptions} value={''} onChange={() => {}} />
        <Button label="Automatická instalace" onClick={() => {}} />
        <ul>
          <li><Link href="https://example.com/woocommerce-navod">Woocommerce - návod</Link></li>
          <li><Link href="https://example.com/shopify-navod">Shopify - návod</Link></li>
          <li><Link href="https://example.com/prestashop-navod">Prestashop - návod</Link></li>
          <li><Link href="https://example.com/vlastni-instalace">Vlastní instalace</Link></li>
        </ul>
      </section>

      {/* Sekce API dokumentace */}
      <section>
        <h2>API dokumentace</h2>
        <Link href="/api-documentation">Přejít na API dokumentaci</Link>
      </section>

      {/* Modal pro Detail Ticketu */}
      {detailModalOpen && selectedTicket && (
        <SupportTicketDetailModal ticket={selectedTicket} onClose={() => { setDetailModalOpen(false); setSelectedTicket(null); }} />
      )}
    </div>
  );
};

export default SupportPage;
