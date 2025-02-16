import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Loading from './ui/Loading';
import Notification from './ui/Notification';
import TextInput from './ui/TextInput';
import Select from './ui/Select';
import CheckboxGroup from './ui/CheckboxGroup';
import RadioGroup from './ui/RadioGroup';
import Button from './ui/Button';
import ImageUpload from './ui/ImageUpload';       // Placeholder komponenta
import ColorPicker from './ui/ColorPicker';         // Placeholder – můžete použít TextInput typu "color"
import VerificationPreview from './ui/VerificationPreview'; // Placeholder komponenta
import { supabase } from '../lib/supabase';

const EshopCustomizationPage: React.FC = () => {
  const { id: eshopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    // Branding
    logo: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    introductionText: '',
    fontType: '',
    buttonShape: '',
    // Povolené metody ověření
    allowedMethods: [] as string[],
    // Akce při neúspěšném ověření
    failedAction: '', // 'redirect' nebo 'block'
    redirectUrl: '',
  });

  // Možné možnosti – placeholder hodnoty
  const fontOptions = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
  ];

  const buttonShapeOptions = [
    { value: 'rounded', label: 'Zaoblené' },
    { value: 'square', label: 'Hranaté' },
    { value: 'oval', label: 'Oválné' },
  ];

  const verificationMethodOptions = [
    { value: 'bankid', label: 'BankID' },
    { value: 'mojeid', label: 'mojeID' },
    { value: 'ocr', label: 'OCR' },
    { value: 'facescan', label: 'Facescan' },
  ];

  const failedActionOptions = [
    { value: 'redirect', label: 'Redirect URL' },
    { value: 'block', label: 'Blokovat dokončení nákupu' },
  ];

  useEffect(() => {
    const fetchEshopData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('eshops')
          .select('*')
          .eq('id', eshopId)
          .single();
        if (error) {
          setNotification({ type: 'error', message: 'Chyba při načítání nastavení eshopu. Prosím, zkuste to znovu později.' });
        } else if (data) {
          setFormData({
            logo: data.branding_settings?.logo || '',
            primaryColor: data.branding_settings?.primaryColor || '#000000',
            secondaryColor: data.branding_settings?.secondaryColor || '#ffffff',
            introductionText: data.branding_settings?.introductionText || '',
            fontType: data.branding_settings?.fontType || '',
            buttonShape: data.branding_settings?.buttonShape || '',
            allowedMethods: data.verification_methods || [],
            failedAction: data.failed_verification_action === 'redirect_url' ? 'redirect' : 'block',
            redirectUrl: data.failed_verification_redirect_url || '',
          });
        }
      } catch (err: any) {
        setNotification({ type: 'error', message: 'Chyba při načítání nastavení eshopu. Prosím, zkuste to znovu později.' });
      }
      setLoading(false);
    };

    if (eshopId) {
      fetchEshopData();
    }
  }, [eshopId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.failedAction === 'redirect' && !formData.redirectUrl) {
      setNotification({ type: 'error', message: 'Zadejte URL pro redirect.' });
      return;
    }
    setLoading(true);
    setNotification(null);
    const updateData = {
      branding_settings: {
        logo: formData.logo,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        introductionText: formData.introductionText,
        fontType: formData.fontType,
        buttonShape: formData.buttonShape,
      },
      verification_methods: formData.allowedMethods,
      failed_verification_action: formData.failedAction === 'redirect' ? 'redirect_url' : 'block_purchase',
      failed_verification_redirect_url: formData.failedAction === 'redirect' ? formData.redirectUrl : null,
    };

    try {
      const { error } = await supabase
        .from('eshops')
        .update(updateData)
        .eq('id', eshopId);
      if (error) {
        setNotification({ type: 'error', message: 'Chyba při ukládání nastavení eshopu. Prosím, zkuste to znovu později.' });
      } else {
        setNotification({ type: 'success', message: 'Nastavení eshopu bylo uloženo.' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: 'Chyba při ukládání nastavení eshopu. Prosím, zkuste to znovu později.' });
    }
    setLoading(false);
  };

  if (loading) return <Loading isLoading={true} />;

  return (
    <form onSubmit={handleSave}>
      <h1>Přizpůsobení eshopu</h1>
      {notification && <Notification type={notification.type} message={notification.message} />}
      <section>
        <h2>Branding</h2>
        <ImageUpload label="Nahrát logo" onChange={(file) => setFormData({ ...formData, logo: file })} />
        <ColorPicker label="Primární barva" value={formData.primaryColor} onChange={(color) => setFormData({ ...formData, primaryColor: color })} />
        <ColorPicker label="Sekundární barva" value={formData.secondaryColor} onChange={(color) => setFormData({ ...formData, secondaryColor: color })} />
        <TextInput label="Úvodní text" placeholder="Zadejte úvodní text" value={formData.introductionText} onChange={(val) => setFormData({ ...formData, introductionText: val })} />
        <Select label="Typ písma" options={fontOptions} value={formData.fontType} onChange={(val) => setFormData({ ...formData, fontType: val })} required />
        <Select label="Tvar tlačítek" options={buttonShapeOptions} value={formData.buttonShape} onChange={(val) => setFormData({ ...formData, buttonShape: val })} required />
      </section>
      <section>
        <h2>Povolené metody ověření</h2>
        <CheckboxGroup label="Metody" options={verificationMethodOptions} value={formData.allowedMethods} onChange={(vals) => setFormData({ ...formData, allowedMethods: vals })} />
      </section>
      <section>
        <h2>Akce při neúspěšném ověření</h2>
        <RadioGroup label="Akce" options={failedActionOptions} value={formData.failedAction} onChange={(val) => setFormData({ ...formData, failedAction: val })} required />
        {formData.failedAction === 'redirect' && (
          <TextInput label="Redirect URL" placeholder="Zadejte URL" value={formData.redirectUrl} onChange={(val) => setFormData({ ...formData, redirectUrl: val })} required />
        )}
      </section>
      <section>
        <h2>Náhled</h2>
        <VerificationPreview eshopSettings={formData} />
      </section>
      <Button label={loading ? 'Ukládám...' : 'Uložit'} onClick={handleSave} disabled={loading} />
    </form>
  );
};

export default EshopCustomizationPage;
