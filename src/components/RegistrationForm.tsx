'use client';
// src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import EmailInput from './ui/EmailInput';
import TextInput from './ui/TextInput';
import PhoneInput from './ui/PhoneInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import { supabase } from '../lib/supabase';

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [ico, setIco] = useState('');
  const [psc, setPsc] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email) return 'Email je povinný.';
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) return 'Neplatný formát emailu.';
    if (!ico) return 'IČO je povinné.';
    if (!psc) return 'PSČ je povinné.';
    if (!phone) return 'Telefonní číslo je povinné.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      // Sjednocený název tabulky: registration_requests (snake_case)
      const { error: supabaseError } = await supabase
        .from('registration_requests')
        .insert([{ email, ico, psc, phone }]);
      if (supabaseError) {
        setNotification({ type: 'error', message: supabaseError.message });
      } else {
        setNotification({ type: 'success', message: 'Žádost o registraci byla úspěšně odeslána.' });
        setEmail('');
        setIco('');
        setPsc('');
        setPhone('');
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message });
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <EmailInput label="Email" placeholder="Zadejte váš email" value={email} onChange={setEmail} required />
      <TextInput label="IČO" placeholder="Zadejte IČO" value={ico} onChange={setIco} required />
      <TextInput label="PSČ" placeholder="Zadejte PSČ" value={psc} onChange={setPsc} required />
      <PhoneInput label="Telefon" placeholder="Zadejte telefonní číslo" value={phone} onChange={setPhone} required />
      <Button label={isSubmitting ? 'Odesílám...' : 'Registrovat'} onClick={handleSubmit} disabled={isSubmitting} />
    </form>
  );
};

export default RegistrationForm;
