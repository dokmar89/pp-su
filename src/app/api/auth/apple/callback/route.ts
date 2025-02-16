import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID!;
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID!;
const APPLE_KEY_ID = process.env.APPLE_KEY_ID!;
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY!; // Ujistěte se, že správně zpracováváte vícenásobné řádky
const APPLE_REDIRECT_URI = process.env.APPLE_REDIRECT_URI!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    if (!code) {
      return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }
    
    // Výměna kódu za tokeny
    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: APPLE_CLIENT_ID,
        client_secret: generateAppleClientSecret(),
        redirect_uri: APPLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Apple Token Endpoint error:", errText);
      return NextResponse.json({ error: "Chyba při získávání tokenu" }, { status: 500 });
    }
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return NextResponse.json({ error: "Access token not received" }, { status: 500 });
    }
    
    // Získání informací o uživateli pomocí access tokenu
    const userInfoRes = await fetch('https://appleid.apple.com/auth/keys'); // Nebo jiný endpoint dle dokumentace
    // V produkci zpracujte validaci a parsování JWT tokenu z Apple
    const appleUserId = extractAppleUserId(tokenData.id_token);
    if (!appleUserId) {
      return NextResponse.json({ error: "Apple User ID not found" }, { status: 500 });
    }
    
    // Předpokládejte, že eshopId je předán ve state nebo query
    const eshopId = searchParams.get('state') || "";
    if (!eshopId) {
      return NextResponse.json({ error: "Missing eshopId" }, { status: 400 });
    }
    
    // Uložení Apple User ID pomocí RPC funkce store_result
    const rpcRes = await supabase.rpc('store_result', {
      eshop_id: eshopId,
      type: 'apple',
      value: appleUserId,
    });
    if (rpcRes.error) {
      console.error("RPC store_result error:", rpcRes.error.message);
      return NextResponse.json({ error: "Chyba při ukládání výsledku ověření" }, { status: 500 });
    }
    
    const redirectUrl = `/eshop/${eshopId}/customize?verified=apple`;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
    
  } catch (err: any) {
    console.error("Apple OAuth callback exception:", err);
    return NextResponse.json({ error: "Nezvládnutá chyba při zpracování callbacku" }, { status: 500 });
  }
}

// Funkce pro vygenerování Apple client secret (JWT)
function generateAppleClientSecret(): string {
  const claims = {
    iss: APPLE_TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15777000, // 6 měsíců
    aud: 'https://appleid.apple.com',
    sub: APPLE_CLIENT_ID,
  };
  return jwt.sign(claims, APPLE_PRIVATE_KEY, {
    algorithm: 'ES256',
    header: {
      alg: 'ES256',
      kid: APPLE_KEY_ID,
    },
  });
}

// Funkce pro extrakci Apple User ID z id_token (JWT)
function extractAppleUserId(idToken: string): string | null {
  try {
    const decoded = jwt.decode(idToken) as any;
    return decoded?.sub || null;
  } catch (error) {
    console.error("Error decoding Apple id_token:", error);
    return null;
  }
}
