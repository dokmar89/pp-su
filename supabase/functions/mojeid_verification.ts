// supabase/functions/mojeid_verification.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MOJEID_API_URL = Deno.env.get("MOJEID_API_URL")!;
const MOJEID_API_KEY = Deno.env.get("MOJEID_API_KEY")!;
const RETURN_URL = Deno.env.get("MOJEID_RETURN_URL")!;
const FAIL_URL = Deno.env.get("MOJEID_FAIL_URL")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed." }), { status: 405 });
    }
    const { verificationId } = await req.json();
    if (!verificationId) {
      return new Response(JSON.stringify({ error: "Missing verificationId" }), { status: 400 });
    }
    
    // Sestavte autentizační požadavek dle mojeID API dokumentace
    const requestBody = {
      returnUrl: RETURN_URL,
      failUrl: FAIL_URL,
      // Další parametry dle specifikace mojeID API
    };
    
    const apiResponse = await fetch(MOJEID_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MOJEID_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("mojeID API error:", errorText);
      return new Response(JSON.stringify({ error: "Chyba při volání mojeID API." }), { status: 500 });
    }
    
    const responseData = await apiResponse.json();
    const authRequestId = responseData.authRequestId;
    const mojeIdUrl = responseData.mojeIdUrl;
    if (!authRequestId || !mojeIdUrl) {
      console.error("Neplatná odpověď mojeID API:", responseData);
      return new Response(JSON.stringify({ error: "Neplatná odpověď z mojeID API." }), { status: 500 });
    }
    
    // Aktualizace záznamu verifikace v databázi
    const { error: dbError } = await supabase
      .from("verifications")
      .update({
        method: "mojeid",
        status: "pending_mojeid",
        verification_details: { authRequestId, mojeIdUrl },
      })
      .eq("id", verificationId);
    if (dbError) {
      console.error("DB update error:", dbError.message);
      return new Response(JSON.stringify({ error: "Chyba při aktualizaci verifikace v databázi." }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ redirectUrl: mojeIdUrl }), { status: 200 });
    
  } catch (err: any) {
    console.error("Exception in mojeid_verification:", err);
    return new Response(JSON.stringify({ error: "Při ověřování mojeID došlo k chybě. Zkuste to prosím později." }), { status: 500 });
  }
}
