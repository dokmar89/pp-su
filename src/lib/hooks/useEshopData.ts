// src/lib/hooks/useEshopData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import {EshopBranding} from '../types'

interface EshopData {
  id: string;
  company_id: string;
  shop_name: string;
  website_url: string;
  sector: string[];
  api_key: string | null;
  verification_methods: string[];
  integration_type: string;
  price_plan: string;
  branding_settings: EshopBranding | null;
  failed_verification_action: string | null;
  failed_verification_redirect_url: string | null;

}

interface UseEshopDataResult {
  loading: boolean;
  eshop: EshopData | null;
  error: string | null;
}

const useEshopData = (eshopId: string): UseEshopDataResult => {
  const [loading, setLoading] = useState(true);
  const [eshop, setEshop] = useState<EshopData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEshopData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('eshops')
          .select('*')
          .eq('id', eshopId)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setEshop(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eshopId) { // Přidána kontrola, zda eshopId je definováno
      fetchEshopData();
    }
  }, [eshopId]);

  return { loading, eshop, error };
};

export default useEshopData;