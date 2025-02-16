import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verificationId, success, mojeIdUserId, name, surname, dateOfBirth } = body;
    if (!verificationId) {
      return NextResponse.json({ error: "Missing verificationId" }, { status: 400 });
    }
    
    const { error } = await supabase
      .from("verifications")
      .update({
        status: success ? "completed" : "failed",
        success,
        verification_details: { mojeIdUserId, name, surname, dateOfBirth, rawCallback: body },
        method: "mojeid",
      })
      .eq("id", verificationId);
      
    if (error) {
      console.error("DB update error in mojeID callback:", error.message);
      return NextResponse.json({ error: "Chyba při aktualizaci verifikace." }, { status: 500 });
    }
    
    return NextResponse.redirect(new URL("/eshop/success?method=mojeid", req.url));
  } catch (err: any) {
    console.error("mojeID callback error:", err);
    return NextResponse.json({ error: "Chyba při zpracování mojeID callbacku." }, { status: 500 });
  }
}
