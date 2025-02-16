import React, { useState } from 'react';
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

const AddEshopForm: React.FC = () => {
  const router = useRouter();
  const [eshopName, setEshopName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sectors, setSectors] = useState<string[]>([]);
  const [verificationMethods, setVerificationMethods] = useState<string[]>([]);
  const [integration, setIntegration] = useState('');
  const [pricePlan, setPricePlan] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  // Možné možnosti – placeholder hodnoty
  const sectorOptions = [
    { value: 'fashion', label: 'Móda' },
    { value: 'electronics', label: 'Elektronika' },
    { value: 'home', label: 'Domácnost' },
  ];

  const verificationMethodOptions = [
    { value: 'bankid', label: 'BankID' },
    { value: 'mojeid', label: 'mojeID' },
    { value: 'ocr', label: 'OCR' },
    { value: 'facescan', label: 'Facescan' },
  ];

  const integrationOptions = [
    { value: 'api', label: 'API' },
    { value: 'widget', label: 'Widget' },
    { value: 'plugin', label: 'Plugin' },
  ];

  const pricePlanOptions = [
    { value: 'se smlouvou', label: 'Se smlouvou' },
    { value: 'bez smlouvy', label: 'Bez smlouvy' },
  ];

  // Základní validace URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validace povinných polí
    if (!eshopName || !websiteUrl || sectors.length === 0 || verificationMethods.length === 0 || !integration || !pricePlan || !confirmation) {
      setNotification({ type: 'error', message: 'Vyplňte prosím všechna povinná pole.' });
      return;
    }
    if (!isValidUrl(websiteUrl)) {
      setNotification({ type: 'error', message: 'Zadejte platnou URL.' });
      return;
    }

    setLoading(true);
    setNotification(null);

    // Příprava datového payloadu
    const payload = {
      shop_name: eshopName,
      website_url: websiteUrl,
      sector: sectors,
      verification_methods: verificationMethods,
      integration_type: integration,
      price_plan: pricePlan,
    };

    try {
      const response = await fetch('/api/create-eshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setNotification({ type: 'error', message: data.error || 'Při přidávání eshopu došlo k chybě.' });
      } else {
        // Předpokládáme, že odpověď obsahuje id nového eshopu a vygenerovaný API klíč
        setApiKey(data.api_key);
        setNotification({ type: 'success', message: 'Eshop byl úspěšně přidán.' });
        // Po krátké prodlevě přesměrujeme uživatele na stránku přizpůsobení eshopu
        setTimeout(() => {
          router.push(`/eshop/${data.id}/customize`);
        }, 2000);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Při přidávání eshopu došlo k chybě.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Přidat Eshop</h1>
      {notification && <Notification type={notification.type} message={notification.message} />}
      {loading && <Loading isLoading={true} />}
      {apiKey && (
        <div>
          <ReadOnlyDisplay label="Vygenerovaný API klíč" value={apiKey} />
          <p>API klíč byl vygenerován a uložen. Nyní můžete přizpůsobit nastavení vašeho eshopu.</p>
        </div>
      )}
      <TextInput label="Název eshopu" placeholder="Zadejte název eshopu" value={eshopName} onChange={setEshopName} required />
      <UrlInput label="URL eshopu" placeholder="Zadejte URL eshopu" value={websiteUrl} onChange={setWebsiteUrl} required />
      <MultiSelect label="Sektor zboží" options={sectorOptions} value={sectors} onChange={setSectors} required />
      <CheckboxGroup label="Metody ověření" options={verificationMethodOptions} value={verificationMethods} onChange={setVerificationMethods} />
      <RadioGroup label="Způsob integrace" options={integrationOptions} value={integration} onChange={setIntegration} required />
      <RadioGroup label="Cenový plán" options={pricePlanOptions} value={pricePlan} onChange={setPricePlan} required />
      <Checkbox label="Potvrzuji, že informace jsou správné" checked={confirmation} onChange={setConfirmation} />
      <Button label={loading ? 'Odesílám...' : 'Přidat Eshop'} onClick={handleSubmit} disabled={loading} />
    </form>
  );
};

export default AddEshopForm;
