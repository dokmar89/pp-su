// src/app/api/deactivate-api-key/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: Request) {
    try {
        const { eshopId } = await req.json();

        if (!eshopId) {
            return NextResponse.json({ error: 'Missing eshopId' }, { status: 400 });
        }

      // Kontrola, zda je uživatel přihlášen - získáme company_id z metadat uživatele
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const companyId = user.user_metadata.company_id;
      // Kontrola, zda eshop patří dané firmě
      const {data: eshop, error: eshopError} = await supabase
        .from('eshops')
        .select('company_id')
        .eq('id', eshopId)
        .single();

      if (eshopError || !eshop) {
        return NextResponse.json({ error: 'Eshop not found' }, { status: 404 });
      }
      if (eshop.company_id !== companyId) {
        return NextResponse.json({error: 'Eshop does not belong to your company'}, {status: 403}) // 403 Forbidden
      }

        // Deaktivuj API klíč (nastav na null)
        const { error } = await supabase
            .from('eshops')
            .update({ api_key: null, apiSecretKey: null })
            .eq('id', eshopId);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}