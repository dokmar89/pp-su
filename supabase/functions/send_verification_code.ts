// supabase/functions/send_verification_code.ts
import { createClient } from '@supabase/supabase-js';
import bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Pomocná funkce pro generování 6-místného kódu
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed." }), { status: 405 });
    }
    const { type, value } = await req.json();
    if (!type || !value) {
      return new Response(JSON.stringify({ error: "Missing type or value" }), { status: 400 });
    }
    
    const code = generateCode();
    const codeHash = await bcrypt.hash(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minut expirace
    
    const { error } = await supabase
      .from("verification_codes")
      .insert([{ type, value, code_hash: codeHash, expires_at: expiresAt }]);
    if (error) {
      console.error("DB insert error in send_verification_code:", error.message);
      return new Response(JSON.stringify({ error: "Chyba při ukládání ověřovacího kódu." }), { status: 500 });
    }
    
    // Simulace odeslání SMS nebo emailu:
    console.info(`Ověřovací kód pro ${type} ${value}: ${code} (odeslán prostřednictvím API)`);

    return new Response(JSON.stringify({ success: true, message: "Ověřovací kód byl odeslán." }), { status: 200 });
    
  } catch (err: any) {
    console.error("Exception in send_verification_code:", err);
    return new Response(JSON.stringify({ error: "Chyba při odesílání ověřovacího kódu." }), { status: 500 });
  }
}
