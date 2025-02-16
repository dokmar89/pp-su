import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ReadOnlyDisplay from './ui/ReadOnlyDisplay';
import Button from './ui/Button';
import Loading from './ui/Loading';
import Notification from './ui/Notification';

type SupportTicketDetailModalProps = {
  ticket: any;
  onClose: () => void;
};

const SupportTicketDetailModal: React.FC<SupportTicketDetailModalProps> = ({ ticket, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTicket() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('support_tickets')
          .select('*')
          .eq('id', ticket.id)
          .single();
        if (error) {
          setError('Chyba při načítání detailů ticketu.');
        } else {
          setTicketDetails(data);
        }
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    }
    fetchTicket();
  }, [ticket.id]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '500px' }}>
        <h1>Detail ticketu</h1>
        {loading ? (
          <Loading isLoading={true} />
        ) : error ? (
          <Notification type="warning" message={error} />
        ) : ticketDetails ? (
          <div>
            <ReadOnlyDisplay label="ID ticketu" value={ticketDetails.id} />
            <ReadOnlyDisplay label="Předmět" value={ticketDetails.subject} />
            <ReadOnlyDisplay label="Kategorie" value={ticketDetails.category} />
            <ReadOnlyDisplay label="Stav" value={ticketDetails.status} />
            <ReadOnlyDisplay label="Vytvořeno" value={ticketDetails.created_at} />
            <ReadOnlyDisplay label="Zpráva" value={ticketDetails.message} />
          </div>
        ) : (
          <p>Žádné detaily nejsou k dispozici.</p>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <Button label="Zavřít" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetailModal;
