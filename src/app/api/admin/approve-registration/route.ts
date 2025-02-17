// src/app/api/admin/approve-registration/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { registrationId, action } = body;

        if (!registrationId || !action) {
            return NextResponse.json({ error: 'Missing registrationId or action' }, { status: 400 });
        }

        if (action !== 'approve' && action !== 'reject') {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Použijeme servisní klíč pro administrátorské operace
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL as string,
            process.env.SUPABASE_SERVICE_ROLE_KEY as string
        );

        const { data: registration, error: registrationError } = await supabaseAdmin
            .from('registration_requests')
            .select('*')
            .eq('id', registrationId)
            .single();

        if (registrationError || !registration) {
            console.error("Error fetching registration:", registrationError);
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }

        if (registration.status !== 'pending') {
            return NextResponse.json({ error: 'Registration already processed' }, { status: 400 });
        }

        if (action === 'approve') {
            // 1. Vygeneruj UUID
            const companyId = uuidv4();

            // 2. Přesun dat do 'companies'
            const { error: companyError } = await supabaseAdmin
                .from('companies')
                .insert([
                    {
                        id: companyId, // Použij UUID
                        company_name: registration.company_name,
                        ico: registration.ico,
                        dic: registration.dic,
                        street: registration.street,
                        city: registration.city,
                        postal_code: registration.psc,
                        country: registration.country,
                        contact_person_name: registration.contact_person_name,
                        contact_person_surname: registration.contact_person_surname,
                        contact_email: registration.email,
                        contact_phone: registration.phone,
                        wallet_balance: 0, // Inicializuj peněženku
                    },
                ]);

            if (companyError) {
                console.error("Error inserting into companies:", companyError);
                return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
            }

            // 3. Nastavení statusu v 'registration_requests' na 'approved'
            const { error: updateError } = await supabaseAdmin
                .from('registration_requests')
                .update({ status: 'approved' })
                .eq('id', registrationId);
             if(updateError) {
              console.error("Update reg_req table error:", updateError);
             }

            // 4. Vytvoření uživatele v Supabase Auth
            const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: registration.email,
                password: uuidv4(), // Generuj náhodné heslo - uživatel si ho nastaví přes odkaz
                user_metadata: { company_id: companyId }, // Ulož ID firmy do metadat uživatele
                email_confirm: false, // Nepotvrzuj email automaticky
            });

            if (authError) {
                console.error("Error creating user in Supabase Auth:", authError);
                // Zde bys měl *rollbacknout* předchozí operace (smazat záznam z 'companies')
                return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
            }

            // 5. Odeslání emailu s odkazem pro nastavení hesla
            const { error: resetPasswordError } = await supabaseAdmin.auth.resetPasswordForEmail(registration.email, {
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`, // URL, kam bude uživatel přesměrován
            });

            if (resetPasswordError) {
              console.log("reset password error:", resetPasswordError)
                // Zde *nemusíš* provádět rollback, uživatel si může heslo nastavit později.
                // Ale měl bys zalogovat chybu.
            }


        } else if (action === 'reject') {

            const { error: updateError } = await supabaseAdmin
                .from('registration_requests')
                .update({ status: 'rejected' })
                .eq('id', registrationId);
            if (updateError){
                console.error("Update reg_req table error:", updateError);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}