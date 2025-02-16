// supabase/functions/check_verification_code.ts
import { createClient } from '@supabase/supabase-js';
import bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed." }), { status: 405 });
    }
    const { type, value, code } = await req.json();
    if (!type || !value || !code) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }
    
    // Vyhledání ověřovacího kódu v databázi
    const { data, error } = await supabase
      .from("verification_codes")
      .select("code_hash, expires_at")
      .eq("type", type)
      .eq("value", value)
      .single();
      
    if (error || !data) {
      return new Response(JSON.stringify({ success: false, message: "Ověřovací kód nebyl nalezen." }), { status: 404 });
    }
    
    // Kontrola expirace
    if (new Date() > new Date(data.expires_at)) {
      return new Response(JSON.stringify({ success: false, message: "Ověřovací kód expiroval." }), { status: 400 });
    }
    
    // Porovnání kódu
    const valid = await bcrypt.compare(code, data.code_hash);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, message: "Neplatný ověřovací kód." }), { status: 400 });
    }
    
    // Smazání ověřovacího kódu (prevent opakovaného použití)
    await supabase
      .from("verification_codes")
      .delete()
      .eq("type", type)
      .eq("value", value);
      
    return new Response(JSON.stringify({ success: true, message: "Ověřovací kód je platný." }), { status: 200 });
    
  } catch (err: any) {
    console.error("Exception in check_verification_code:", err);
    return new Response(JSON.stringify({ success: false, message: "Chyba při ověřování kódu." }), { status: 500 });
  }
}
