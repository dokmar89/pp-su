// src/components/AddEshopForm.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TextInput from './ui/TextInput';
import UrlInput from './ui/UrlInput';
import MultiSelect from './ui/MultiSelect';
import CheckboxGroup from './ui/CheckboxGroup';
import RadioGroup from './ui/RadioGroup';
import Checkbox from './ui/Checkbox';
import Button from './ui/Button';
import Notification from './ui/Notification';
import Loading from './ui/Loading';
import ReadOnlyDisplay from './ui/ReadOnlyDisplay';
import { useForm } from 'react-hook-form'; // Importuj useForm
import { supabase } from '../lib/supabase';
import { useState } from 'react';

interface Option {
  value: string;
  label: string;
}

const AddEshopForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Použij useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Získej chyby a stav odesílání
  } = useForm();

  // Možné možnosti – placeholder hodnoty
  const sectorOptions: Option[] = [
    { value: 'fashion', label: 'Móda' },
    { value: 'electronics', label: 'Elektronika' },
    { value: 'home', label: 'Domácnost' },
  ];

  const verificationMethodOptions: Option[] = [
    { value: 'bankid', label: 'BankID' },
    { value: 'mojeid', label: 'mojeID' },
    { value: 'ocr', label: 'OCR' },
    { value: 'facescan', label: 'Facescan' },
  ];

  const integrationOptions: Option[] = [
    { value: 'api', label: 'API' },
    { value: 'widget', label: 'Widget' },
    { value: 'plugin', label: 'Plugin' },
  ];

  const pricePlanOptions: Option[] = [
    { value: 'se smlouvou', label: 'Se smlouvou' },
    { value: 'bez smlouvy', label: 'Bez smlouvy' },
  ];

  const onSubmit = async (data: any) => {
    setLoading(true);
    setNotification(null);

    // Příprava datového payloadu
    const payload = {
      shop_name: data.eshopName,
      website_url: data.websiteUrl,
      sector: data.sectors,
      verification_methods: data.verificationMethods,
      integration_type: data.integration,
      price_plan: data.pricePlan,
    };
    try {
      const response = await fetch('/api/create-eshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setNotification({ type: 'error', message: responseData.error || 'Při přidávání eshopu došlo k chybě.' });
      } else {
        setApiKey(responseData.api_key);
        setNotification({ type: 'success', message: 'Eshop byl úspěšně přidán.' });
        setTimeout(() => {
          router.push(`/eshop/${responseData.id}/customize`);
        }, 2000);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Při přidávání eshopu došlo k chybě.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">Přidat Eshop</h1>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {loading && <Loading isLoading={true} />}
      {apiKey && (
        <div>
          <ReadOnlyDisplay label="Vygenerovaný API klíč" value={apiKey} />
          <p>API klíč byl vygenerován a uložen. Nyní můžete přizpůsobit nastavení vašeho eshopu.</p>
        </div>
      )}
      <TextInput
        label="Název eshopu"
        placeholder="Zadejte název eshopu"
        {...register('eshopName', { required: 'Název eshopu je povinný' })}
        error={!!errors.eshopName}
        errorMessage={(errors.eshopName?.message) as string}
      />

      <UrlInput
        label="URL eshopu"
        placeholder="Zadejte URL eshopu"
        {...register('websiteUrl', {
          required: 'URL eshopu je povinná',
          pattern: {
            value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            message: 'Neplatná URL adresa',
          },
        })}
        error={!!errors.websiteUrl}
        errorMessage={(errors.websiteUrl?.message) as string}
      />

      <MultiSelect
        label="Sektor zboží"
        options={sectorOptions}
        {...register('sectors', { required: 'Vyberte alespoň jeden sektor' })}
        // value a onChange už nepotřebujeme, řeší to React Hook Form
        error={!!errors.sectors}
        errorMessage={(errors.sectors?.message) as string}

      />

      <CheckboxGroup
        label="Metody ověření"
        options={verificationMethodOptions}
        {...register('verificationMethods', { required: 'Vyberte alespoň jednu metodu ověření' })}
        error={!!errors.verificationMethods}
        errorMessage={(errors.verificationMethods?.message) as string}
      />

      <RadioGroup
        label="Způsob integrace"
        options={integrationOptions}
        {...register('integration', { required: 'Vyberte způsob integrace' })}
        error={!!errors.integration}
        errorMessage={(errors.integration?.message) as string}
      />

      <RadioGroup
        label="Cenový plán"
        options={pricePlanOptions}
        {...register('pricePlan', { required: 'Vyberte cenový plán' })}
        error={!!errors.pricePlan}
        errorMessage={(errors.pricePlan?.message) as string}
      />

      <Checkbox
        label="Potvrzuji, že informace jsou správné"
        {...register('confirmation', { required: 'Potvrďte správnost informací' })}
        error={!!errors.confirmation}
        errorMessage={(errors.confirmation?.message) as string}
      />

      <Button label={isSubmitting ? 'Odesílám...' : 'Přidat Eshop'}  disabled={isSubmitting} />
    </form>
  );
};

export default AddEshopForm;