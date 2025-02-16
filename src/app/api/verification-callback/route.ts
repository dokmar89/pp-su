import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Generuje HMAC-SHA256 podpis pro zadaný payload pomocí secretKey.
 * @param payload JSON string
 * @param secretKey API Secret Key
 * @returns HMAC-SHA256 podpis
 */
function generateSignature(payload: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Validace povinných polí
    const requiredFields = ['verificationId', 'eshopId', 'success', 'timestamp', 'method'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        return NextResponse.json({ error: `Missing field ${field}` }, { status: 400 });
      }
    }

    const eshopId = payload.eshopId;
    // Načtení konfigurace callbacku z tabulky eshops
    const { data, error } = await supabase
      .from('eshops')
      .select('callbackUrl, apiSecretKey')
      .eq('id', eshopId)
      .single();

    if (error || !data) {
      console.error("Error fetching callback configuration:", error?.message);
      return NextResponse.json({ error: "Chyba při získávání konfigurace callbacku." }, { status: 500 });
    }

    const { callbackUrl, apiSecretKey } = data;
    if (!callbackUrl || !apiSecretKey) {
      return NextResponse.json({ error: "Callback URL nebo API Secret Key není nastaven." }, { status: 500 });
    }

    // Generování podpisu payloadu
    const payloadString = JSON.stringify(payload);
    const signature = generateSignature(payloadString, apiSecretKey);

    // Odeslání callback notifikace na Callback URL eshopu
    const callbackResponse = await fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Verification-Signature': signature,
      },
      body: payloadString,
    });

    if (!callbackResponse.ok) {
      const errText = await callbackResponse.text();
      console.error("Callback URL error:", errText);
      return NextResponse.json({ error: "Chyba při odesílání callback notifikace." }, { status: 500 });
    }

    console.info(`Callback notifikace úspěšně odeslána pro eshopId: ${eshopId}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verification callback exception:", err);
    return NextResponse.json({ error: "Nezvládnutá chyba při zpracování callbacku." }, { status: 500 });
  }
}
