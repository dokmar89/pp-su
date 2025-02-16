import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // Optional – pro CSRF ochranu
    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }

    // Výměna autorizačního kódu za tokeny
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Google Token Endpoint error:", errText);
      return NextResponse.json({ error: "Chyba při získávání tokenu" }, { status: 500 });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "Access token not received" }, { status: 500 });
    }

    // Volitelné: Získání informací o uživateli
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      const errText = await userRes.text();
      console.error("Google Userinfo error:", errText);
      return NextResponse.json({ error: "Chyba při získávání informací o uživateli" }, { status: 500 });
    }
    const userInfo = await userRes.json();
    const googleUserId = userInfo.sub; // unikátní ID uživatele v Google
    if (!googleUserId) {
      return NextResponse.json({ error: "Google User ID not found" }, { status: 500 });
    }

    // Předpokládejte, že eshopId byl uložen dříve (např. v cookie nebo state). Pro tento příklad použijeme query parametr "eshopId"
    const eshopId = searchParams.get('state') || ""; // state může obsahovat eshopId, pokud jste jej předali pro CSRF ochranu
    if (!eshopId) {
      return NextResponse.json({ error: "Missing eshopId" }, { status: 400 });
    }

    // Uložení Google User ID do databáze pomocí RPC funkce store_result
    const rpcRes = await supabase.rpc('store_result', {
      eshop_id: eshopId,
      type: 'google',
      value: googleUserId,
    });
    if (rpcRes.error) {
      console.error("RPC store_result error:", rpcRes.error.message);
      return NextResponse.json({ error: "Chyba při ukládání výsledku ověření" }, { status: 500 });
    }

    // Přesměrování zpět na eshop s úspěchem
    const redirectUrl = `/eshop/${eshopId}/customize?verified=google`;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  } catch (err: any) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.json({ error: "Nezvládnutá chyba při zpracování callbacku" }, { status: 500 });
  }
}
