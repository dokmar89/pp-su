import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    // Předpokládejte, že BankID callback posílá XML – parsování by mělo probíhat dle dokumentace
    // Pro tento příklad simulujeme parsování jako JSON
    const callbackData = JSON.parse(body); // V produkci použijte XML parser
    const { verificationId, success, bankIdUserId, name, surname, dateOfBirth } = callbackData;
    if (!verificationId) {
      return NextResponse.json({ error: "Missing verificationId" }, { status: 400 });
    }
    
    // Aktualizace verifikace v databázi
    const { error } = await supabase
      .from("verifications")
      .update({
        status: success ? "completed" : "failed",
        success,
        verification_details: { bankIdUserId, name, surname, dateOfBirth, rawCallback: callbackData },
        method: "bankid",
      })
      .eq("id", verificationId);
      
    if (error) {
      console.error("DB update error in BankID callback:", error.message);
      return NextResponse.json({ error: "Chyba při aktualizaci verifikace." }, { status: 500 });
    }
    
    // Přesměrování uživatele zpět na eshop – zde použijte uložený redirect URL nebo default
    return NextResponse.redirect(new URL("/eshop/success?method=bankid", req.url));
  } catch (err: any) {
    console.error("BankID callback error:", err);
    return NextResponse.json({ error: "Chyba při zpracování BankID callbacku." }, { status: 500 });
  }
}
