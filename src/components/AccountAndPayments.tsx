// src/components/AccountAndPayments.tsx
'use client';

import React, { useState, useEffect } from 'react';
import DataTable from './ui/DataTable';
import ReadOnlyDisplay from './ui/ReadOnlyDisplay';
import NumberInput from './ui/NumberInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import Loading from './ui/Loading';
import useCompanyData from '../lib/hooks/useCompanyData'; // Import hooku
import ConfirmationModal from './ConfirmationModal';
import { supabase } from '../lib/supabase';

const AccountAndPayments: React.FC = () => {
    // Použij hook - získáme data a funkce
    const { loading, company, apiKeys, error, refetchApiKeys } = useCompanyData();

    const [creditLimit, setCreditLimit] = useState<number | null>(null);
    const [limitLoading, setLimitLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false);
    const [selectedEshopId, setSelectedEshopId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'deactivate' | 'activate' | null>(null);
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // Nastav creditLimit, když se načtou firemní údaje
    useEffect(() => {
        if (company) {
            setCreditLimit(company.minimum_balance_notification_limit);
        }
    }, [company]);


    // Handler pro deaktivaci API klíče
    const handleDeactivate = (eshopId: string) => {
        setSelectedEshopId(eshopId);
        setActionType('deactivate');
        setConfirmationModalOpen(true);
    };

    // Handler pro aktivaci API klíče
    const handleActivate = async (eshopId: string) => {
        try {
            const response = await fetch('/api/generate-api-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eshopId }),
            });
            const data = await response.json();
            if (!response.ok) {
                setNotification({ type: 'error', message: data.error || 'Chyba při aktivaci API klíče.' });
                return;
            }
            setNotification({ type: 'success', message: 'API klíč byl aktivován.' });
            await refetchApiKeys(); // Použijeme refetch pro aktualizaci

        } catch (err: any) {
            setNotification({ type: 'error', message: err.message || 'Chyba při aktivaci API klíče.' });
        }
    };

    // Potvrzení deaktivace
    const confirmDeactivation = async () => {
        if (!selectedEshopId) return;
        try {
            // Správná cesta k API endpointu
            const response = await fetch(`/api/deactivate-api-key`, {  // Předpokládáme, že vytvoříš tento endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eshopId: selectedEshopId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Chyba při deaktivaci API klíče.');
            }

            setNotification({ type: 'success', message: 'API klíč byl deaktivován.' });
            await refetchApiKeys(); // Použijeme refetch pro aktualizaci

        } catch (err: any) {
            setNotification({ type: 'error', message: err.message || 'Chyba při deaktivaci API klíče.' });
        } finally {
            setConfirmationModalOpen(false); // Zavři modal vždy
            setSelectedEshopId(null); // Resetuj vybraný eshop
            setActionType(null);     // Resetuj typ akce
        }
    };



  // Handler pro změnu limitu (s debounce)
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
                    .eq('id', company?.id);
                if (error) {
                    setNotification({ type: 'error', message: 'Chyba při ukládání limitu.' });
                } else {
                    setNotification({ type: 'success', message: 'Limit uložen.' });
                }
            } catch (err: any) {
                setNotification({ type: 'error', message: err.message || 'Chyba při ukládání limitu.' });
            } finally {
                setLimitLoading(false);
            }
        }, 500);
        setDebounceTimer(timer);
    };


    if (loading) {
        return <Loading isLoading={true} />;
    }

    // Zobraz error, pokud nastal při načítání
    if (error) {
        return <Notification type="error" message={error} />;
    }


    // Definice sloupců pro DataTable
    const apiKeyColumns = [
        { header: 'Název eshopu', key: 'shopName' },
        { header: 'API klíč', key: 'apiKey' },
        { header: 'Stav', key: 'status' },
        { header: 'Akce', key: 'actions' },
    ];

    // Příprava dat pro DataTable
    const apiKeyData = apiKeys.map((key) => ({
        ...key,
        actions: (
            <div className="flex gap-2">
                {key.apiKey ? (
                    <Button label="Deaktivovat" onClick={() => handleDeactivate(key.id)} />
                ) : (
                    <Button label="Aktivovat" onClick={() => handleActivate(key.id)} />
                )}
            </div>
        ),
    }));

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Účet a Platby</h1>

            {/* API klíče */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">API klíče</h2>
                <DataTable columns={apiKeyColumns} data={apiKeyData} />
            </section>

            {/* Firemní údaje */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Firemní údaje</h2>
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

            {/* Upozornění na nízký kredit */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Upozornění na nízký stav kreditu</h2>
                <NumberInput
                    label="Nastavit limit"
                    placeholder="Zadejte limit"
                    value={creditLimit !== null ? creditLimit : 0}
                    onChange={handleCreditLimitChange}
                    required
                />
                {limitLoading && <p>Ukládám limit...</p>}
            </section>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmationModalOpen}
                onClose={() => { setConfirmationModalOpen(false); setActionType(null); }}
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