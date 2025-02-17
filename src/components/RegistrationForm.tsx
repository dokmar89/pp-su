'use client';
// src/components/RegistrationForm.tsx
import React, { useState } from 'react';
import EmailInput from './ui/EmailInput';
import TextInput from './ui/TextInput';
import PhoneInput from './ui/PhoneInput';
import Button from './ui/Button';
import Notification from './ui/Notification';
import { supabase } from '../lib/supabase';
import Select from './ui/Select'; // Import Select komponenty

interface Option { // Definuj typ pro option
  value: string;
  label: string;
}

const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [ico, setIco] = useState('');
  const [psc, setPsc] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [dic, setDic] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState(''); // Stav pro zemi
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonSurname, setContactPersonSurname] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

    // Definice možností pro Select (země)
    const countryOptions: Option[] = [
        { value: 'CZ', label: 'Česká republika' },
        { value: 'SK', label: 'Slovensko' },
        { value: 'DE', label: 'Německo' },
        // ... další země
    ];


    const validate = () => {
        if (!email) return 'Email je povinný.';
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) return 'Neplatný formát emailu.';
        if (!ico) return 'IČO je povinné.';
        if (!psc) return 'PSČ je povinné.';
        if (!phone) return 'Telefonní číslo je povinné.';
        if (!companyName) return 'Název firmy je povinný.';
        if (!street) return 'Ulice je povinná.';
        if (!city) return 'Město je povinné.';
        if (!country) return 'Země je povinná.';
        if (!contactPersonName) return 'Jméno kontaktní osoby je povinné.';
        if (!contactPersonSurname) return 'Příjmení kontaktní osoby je povinné.';

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
        .insert([{
          email,
          ico,
          psc,
          phone,
          company_name: companyName, // Přidáno
          dic, // Přidáno
          street, // Přidáno
          city, // Přidáno
          country, // Přidáno
          contact_person_name: contactPersonName, // Přidáno
          contact_person_surname: contactPersonSurname, // Přidáno
          status: 'pending', // Přidáno - serverová logika
        }]);
      if (supabaseError) {
        setNotification({ type: 'error', message: supabaseError.message });
      } else {
        setNotification({ type: 'success', message: 'Žádost o registraci byla úspěšně odeslána.' });
        // Reset formuláře - ponecháme jen vyresetování notifikace, pro debug
        setNotification(null)
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
      <TextInput label="DIČ" placeholder="Zadejte DIČ" value={dic} onChange={setDic}  />
      <TextInput label="Název firmy" placeholder="Zadejte název firmy" value={companyName} onChange={setCompanyName} required />
      <TextInput label="Ulice" placeholder="Zadejte ulici" value={street} onChange={setStreet} required/>
      <TextInput label="Město" placeholder="Zadejte město" value={city} onChange={setCity} required/>
        <TextInput label="PSČ" placeholder="Zadejte PSČ" value={psc} onChange={setPsc} required />
        <Select
          label="Země"
          options={countryOptions}
          value={country}
          onChange={setCountry}
          required
        />
      <TextInput label="Jméno kontaktní osoby" placeholder="Zadejte jméno" value={contactPersonName} onChange={setContactPersonName} required />
      <TextInput label="Příjmení kontaktní osoby" placeholder="Zadejte příjmení" value={contactPersonSurname} onChange={setContactPersonSurname} required />
      <PhoneInput label="Telefon" placeholder="Zadejte telefonní číslo" value={phone} onChange={setPhone} required />
      <Button label={isSubmitting ? 'Odesílám...' : 'Registrovat'} onClick={handleSubmit} disabled={isSubmitting} />
    </form>
  );
};

export default RegistrationForm;