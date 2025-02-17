// src/lib/hooks/useCompanyData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface CompanyData {
  company_name: string;
  ico: string;
  dic: string | null;
  street: string;
  city: string;
  postal_code: string;
  country: string;
  contact_person_name: string;
  contact_person_surname: string;
  minimum_balance_notification_limit: number | null;
}

interface ApiKey {
  id: string;
  shopName: string;
  apiKey: string | null;
  status: string;
}

interface UseCompanyDataResult {
  loading: boolean;
  company: CompanyData | null;
  apiKeys: ApiKey[];
  error: string | null;
  refetchApiKeys: () => Promise<void>;
}

const useCompanyData = (): UseCompanyDataResult => {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Získání uživatele
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError('Chyba při načítání uživatelských dat.');
          return;
        }
        const userId = userData.user.id;

        // Načtení firemních údajů
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', userId) // Použij userId
          .single();

        if (companyError) {
          setError('Chyba při načítání firemních údajů.');
        } else {
          setCompany(companyData);
        }

        // Načtení API klíčů
        const { data: eshopData, error: eshopError } = await supabase
          .from('eshops')
          .select('id, shop_name, api_key')
          .eq('company_id', userId); // Použij userId

        if (eshopError) {
          setError('Chyba při načítání API klíčů.');
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetchApiKeys = async () => {
      // Získání uživatele
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        setError('Chyba při načítání uživatelských dat.');
        return;
      }
      const userId = userData.user.id;
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
      } else {
          console.error("Error during refetch:", eshopError);
      }
    } catch (err: any) {
      console.error("Exception during refetch:", err);
      setError(err.message)
    }
  };

  return { loading, company, apiKeys, error, refetchApiKeys };
};

export default useCompanyData;