import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DataTable from './ui/DataTable';
import ReadOnlyDisplay from './ui/ReadOnlyDisplay';
import NumberInput from './ui/NumberInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import Loading from './ui/Loading';
import ConfirmationModal from './ConfirmationModal';

const AccountAndPayments: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [company, setCompany] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [creditLimit, setCreditLimit] = useState<number | null>(null);
  const [limitLoading, setLimitLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
  const [selectedEshopId, setSelectedEshopId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'deactivate' | 'activate' | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Načtení uživatelských dat, firemních údajů a API klíčů
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Získání uživatele
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setNotification({ type: 'error', message: 'Chyba při načítání uživatelských dat.' });
          setLoading(false);
          return;
        }
        setUserId(userData.user.id);

        // Načtení firemních údajů z tabulky companies
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userData.user.id)
          .single();
        if (companyError) {
          setNotification({ type: 'error', message: 'Chyba při načítání firemních údajů.' });
        } else {
          setCompany(companyData);
          setCreditLimit(companyData.minimum_balance_notification_limit);
        }

        // Načtení API klíčů z tabulky eshops pro firmu
        const { data: eshopData, error: eshopError } = await supabase
          .from('eshops')
          .select('id, shop_name, api_key')
          .eq('company_id', userData.user.id);
        if (eshopError) {
          setNotification({ type: 'error', message: 'Chyba při načítání API klíčů.' });
        } else {
          const keys = eshopData.map((e: any) => ({
            id: e.id,
            shopName: e.shop_name,
            apiKey: e.api_key,
            status: e.api_key ? 'Aktivní' : 'Neaktivní',
          }));
          setApiKeys(keys);
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Funkce pro refetch API klíčů
  const refetchAPIKeys = async () => {
    try {
      const { data: eshopData, error: eshopError } = await supabase
        .from('eshops')
        .select('id, shop_name, api_key')
        .eq('company_id', userId);
      if (!eshopError && eshopData) {
        const keys = eshopData.map((e: any) => ({
          id: e.id,
          shopName: e.shop_name,
          apiKey: e.api_key,
          status: e.api_key ? 'Aktivní' : 'Neaktivní',
        }));
        setApiKeys(keys);
      }
    } catch (err: any) {
      // případně logovat chybu
    }
  };

  // Handler pro deaktivaci API klíče – otevře confirmation modal
  const handleDeactivate = (eshopId: string) => {
    setSelectedEshopId(eshopId);
    setActionType('deactivate');
    setConfirmationModalOpen(true);
  };

  // Handler pro aktivaci API klíče – volá RPC funkci
  const handleActivate = async (eshopId: string) => {
    try {
      // Volání API route, která spouští RPC funkci generate_api_key
      const response = await fetch('/api/generate-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eshopId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotification({ type: 'error', message: data.error || 'Chyba při aktivaci API klíče. Prosím, zkuste to znovu později.' });
        return;
      }
      const newApiKey = data.api_key;
      // Aktualizace sloupce api_key v tabulce eshops
      const { error } = await supabase
        .from('eshops')
        .update({ api_key: newApiKey })
        .eq('id', eshopId);
      if (error) {
        setNotification({ type: 'error', message: 'Chyba při aktivaci API klíče. Prosím, zkuste to znovu později.' });
      } else {
        setNotification({ type: 'success', message: 'API klíč byl aktivován.' });
        await refetchAPIKeys();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Chyba při aktivaci API klíče.' });
    }
  };

  // Potvrzení v confirmation modalu pro deaktivaci API klíče
  const confirmDeactivation = async () => {
    if (!selectedEshopId) return;
    try {
      const { error } = await supabase
        .from('eshops')
        .update({ api_key: null })
        .eq('id', selectedEshopId);
      if (error) {
        setNotification({ type: 'error', message: 'Chyba při deaktivaci API klíče. Prosím, zkuste to znovu později.' });
      } else {
        setNotification({ type: 'success', message: 'API klíč byl deaktivován.' });
        await refetchAPIKeys();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Chyba při deaktivaci API klíče.' });
    }
    setConfirmationModalOpen(false);
    setSelectedEshopId(null);
    setActionType(null);
  };

  // Handler pro změnu limitu s implementací debounce (500 ms)
  const handleCreditLimitChange = (value: number) => {
    setCreditLimit(value);
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(async () => {
      setLimitLoading(true);
      try {
        const { error } = await supabase
          .from('companies')
          .update({ minimum_balance_notification_limit: value })
          .eq('id', userId);
        if (error) {
          setNotification({ type: 'error', message: 'Chyba při ukládání limitu pro upozornění. Prosím, zkuste to znovu později.' });
        } else {
          setNotification({ type: 'success', message: 'Limit pro upozornění byl uložen.' });
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: err.message || 'Chyba při ukládání limitu.' });
      }
      setLimitLoading(false);
    }, 500);
    setDebounceTimer(timer);
  };

  if (loading) return <Loading isLoading={true} />;

  // Definice sloupců pro DataTable API klíčů
  const apiKeyColumns = [
    { header: 'Název eshopu', key: 'shopName' },
    { header: 'API klíč', key: 'apiKey' },
    { header: 'Stav', key: 'status' },
    { header: 'Akce', key: 'actions' },
  ];

  // Převod dat API klíčů, včetně tlačítek pro aktivaci/deaktivaci
  const apiKeyData = apiKeys.map((key) => ({
    ...key,
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {key.apiKey ? (
          <Button label="Deaktivovat" onClick={() => handleDeactivate(key.id)} />
        ) : (
          <Button label="Aktivovat" onClick={() => handleActivate(key.id)} />
        )}
      </div>
    ),
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Účet a Platby</h1>

      {/* Sekce API klíče */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>API klíče</h2>
        <DataTable columns={apiKeyColumns} data={apiKeyData} />
      </section>

      {/* Sekce Firemní údaje */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Firemní údaje</h2>
        {company ? (
          <div>
            <ReadOnlyDisplay label="Název firmy" value={company.company_name} />
            <ReadOnlyDisplay label="IČO" value={company.ico} />
            <ReadOnlyDisplay label="DIČ" value={company.dic || '-'} />
            <ReadOnlyDisplay
              label="Adresa"
              value={`${company.street}, ${company.city}, ${company.postal_code}, ${company.country}`}
            />
            <ReadOnlyDisplay label="Kontaktní osoba" value={`${company.contact_person_name} ${company.contact_person_surname}`} />
          </div>
        ) : (
          <p>Firemní údaje nejsou k dispozici.</p>
        )}
      </section>

      {/* Sekce Upozornění na nízký kredit */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Upozornění na nízký stav kreditu</h2>
        <NumberInput
          label="Nastavit limit"
          placeholder="Zadejte limit"
          value={creditLimit !== null ? creditLimit : 0}
          onChange={handleCreditLimitChange}
          required
        />
        {limitLoading && <p>Ukládám limit...</p>}
      </section>

      {/* Confirmation Modal pro deaktivaci API klíče */}
      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={confirmDeactivation}
        title="Potvrzení deaktivace"
        message="Opravdu chcete deaktivovat API klíč pro tento eshop?"
        confirmText="Deaktivovat"
        cancelText="Zrušit"
      />

      {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
};

export default AccountAndPayments;
