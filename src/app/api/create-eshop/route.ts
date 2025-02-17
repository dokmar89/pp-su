// src/app/api/create-eshop/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validace - můžeš použít Zod nebo Yup pro detailnější validaci
    if (
      !body.shop_name ||
      !body.website_url ||
      !body.sector ||
      body.sector.length === 0 ||
      !body.verification_methods ||
      body.verification_methods.length === 0 ||
      !body.integration_type ||
      !body.price_plan
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Kontrola, zda je uživatel přihlášen - získáme company_id z metadat uživatele
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const companyId = user.user_metadata.company_id;

    if (!companyId) {
      return NextResponse.json({error: 'User is not associated with company'}, {status: 401})
    }

      // Vygeneruj API klíč.  Použijeme UUID.
      const apiKey = uuidv4();
      const apiSecretKey = uuidv4(); // Generuj, i když se teď nepoužívá
    // Vložení dat do tabulky 'eshops'
    const { data, error } = await supabase
      .from('eshops')
      .insert([
        {
          company_id: companyId, // Použij company_id z metadat
          shop_name: body.shop_name,
          website_url: body.website_url,
          sector: body.sector,
          api_key: apiKey, // Ulož vygenerovaný API klíč
          apiSecretKey: apiSecretKey, // Ulož vygenerovaný secret klíč
          verification_methods: body.verification_methods,
          integration_type: body.integration_type,
          price_plan: body.price_plan,
        },
      ]).select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data[0].id, api_key: apiKey }, { status: 201 });

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}