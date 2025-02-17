// src/components/admin/RegistrationList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import Notification from '../ui/Notification';
import Loading from '../ui/Loading';

interface Registration {
    id: string;
    company_name: string;
    ico: string;
    email: string;
    created_at: string;
    status: string;
}

const RegistrationList: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('registration_requests')
                    .select('*')
                    .order('created_at', { ascending: false }); // Seřadit od nejnovějších

                if (error) {
                    setError(error.message);
                } else {
                    setRegistrations(data || []);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, []);

    const handleApprove = async (registrationId: string) => {
        try {
            const response = await fetch('/api/admin/approve-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ registrationId, action: 'approve' }),
            });

            const data = await response.json();

            if (response.ok) {
                // Aktualizace seznamu registrací
              setRegistrations(
                registrations.map((reg) =>
                  reg.id === registrationId ? { ...reg, status: "approved" } : reg
                )
              );
                setNotification({ type: 'success', message: 'Registrace byla schválena.' });

            } else {
                setNotification({ type: 'error', message: data.error || 'Chyba při schvalování registrace.' });
            }
        } catch (err: any) {
            setNotification({ type: 'error', message: err.message || 'Chyba při schvalování registrace.' });
        }
    };

    const handleReject = async (registrationId: string) => {
        // Podobná logika jako handleApprove, ale s action: 'reject'
        try {
            const response = await fetch('/api/admin/approve-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ registrationId, action: 'reject' }),
            });

            const data = await response.json();

            if (response.ok) {
                  setRegistrations(
                    registrations.map((reg) =>
                      reg.id === registrationId ? { ...reg, status: "rejected" } : reg
                    )
                  );

                setNotification({ type: 'success', message: 'Registrace byla zamítnuta.' });
            } else {
                setNotification({ type: 'error', message: data.error || 'Chyba při zamítání registrace.' });
            }

        } catch(err: any) {
            setNotification({ type: 'error', message: err.message || 'Chyba při zamítání registrace.'});
        }
    };

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Název firmy', key: 'company_name' },
        { header: 'IČO', key: 'ico' },
        { header: 'Email', key: 'email' },
        { header: 'Datum registrace', key: 'created_at' },
        { header: 'Stav', key: 'status' },
        { header: 'Akce', key: 'actions' },
    ];

      const registrationData = registrations.map((reg) => ({
        ...reg,
        actions: (
          <>
            {reg.status === "pending" && (
              <>
                <Button
                  label="Schválit"
                  onClick={() => handleApprove(reg.id)}
                  style={{ marginRight: "4px" }}
                />
                <Button label="Zamítnout" onClick={() => handleReject(reg.id)} />
              </>
            )}
          </>
        ),
      }));

    if (loading) {
        return <Loading isLoading={true} />;
    }

    if (error) {
        return <Notification type="error" message={error} />;
    }


    return (
        <div>
            {notification && <Notification type={notification.type} message={notification.message} />}
            <DataTable columns={columns} data={registrationData} />
        </div>
    );
};

export default RegistrationList;