// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Základní validace - přesnější validaci můžeš udělat pomocí knihovny, např. Zod
        if (!body.email || !body.ico || !body.psc || !body.phone || !body.company_name || !body.street || !body.city || !body.country || !body.contact_person_name || !body.contact_person_surname) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('registration_requests')
            .insert([
                {
                    email: body.email,
                    ico: body.ico,
                    psc: body.psc,
                    phone: body.phone,
                    company_name: body.company_name,
                    dic: body.dic, // Může být null
                    street: body.street,
                    city: body.city,
                    country: body.country,
                    contact_person_name: body.contact_person_name,
                    contact_person_surname: body.contact_person_surname,
                    status: 'pending',  // Nastav status na 'pending'
                },
            ])
            .select();


        if (error) {
          console.error("Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log("insert data:", data)
        return NextResponse.json({ success: true, data }, {status: 201});

    } catch (error: any) {
        console.error("API error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}