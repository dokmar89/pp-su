// supabase/functions/bankid_verification.ts
import { createClient } from '@supabase/supabase-js';
import { XMLParser, XMLBuilder } from "fast-xml-parser"; // Ujistěte se, že máte tuto knihovnu nainstalovanou

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BANKID_API_URL = Deno.env.get("BANKID_API_URL")!;
const BANKID_API_KEY = Deno.env.get("BANKID_API_KEY")!;
const MERCHANT_ID = Deno.env.get("MERCHANT_ID")!;
const RETURN_URL = Deno.env.get("BANKID_RETURN_URL")!;
const FAIL_URL = Deno.env.get("BANKID_FAIL_URL")!;

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
    
    // Sestavení XML požadavku dle specifikace BankID API
    const builder = new XMLBuilder({ ignoreAttributes: false });
    const xmlRequest = builder.build({
      AuthRequest: {
        MerchantID: MERCHANT_ID,
        ReturnURL: RETURN_URL,
        FailURL: FAIL_URL,
        // Další parametry dle API dokumentace
      }
    });
    
    // Pokud je vyžadován digitální podpis, podepište xmlRequest zde pomocí Deno kryptografických knihoven.
    // Např.: const signedXml = signXML(xmlRequest, privateKey);
    const signedXml = xmlRequest; // Placeholder – v produkci nahradit skutečným podpisem
    
    // Volání BankID API
    const apiResponse = await fetch(BANKID_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "Authorization": `Bearer ${BANKID_API_KEY}`
      },
      body: signedXml
    });
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("BankID API error:", errorText);
      return new Response(JSON.stringify({ error: "Chyba při volání BankID API." }), { status: 500 });
    }
    
    const responseText = await apiResponse.text();
    const parser = new XMLParser();
    const parsedResponse = parser.parse(responseText);
    
    // Extrakce potřebných údajů – předpokládejme, že odpověď obsahuje AuthRequestID a BankID URL
    const authRequestId = parsedResponse?.AuthResponse?.AuthRequestID;
    const bankIdUrl = parsedResponse?.AuthResponse?.BankIDURL;
    if (!authRequestId || !bankIdUrl) {
      console.error("Chybná odpověď BankID API:", parsedResponse);
      return new Response(JSON.stringify({ error: "Neplatná odpověď z BankID API." }), { status: 500 });
    }
    
    // Aktualizace záznamu verifikace v databázi
    const { error: dbError } = await supabase
      .from("verifications")
      .update({
        method: "bankid",
        status: "pending_bankid",
        verification_details: { authRequestId, bankIdUrl },
        // price: ... můžete doplnit cenu ověření
      })
      .eq("id", verificationId);
    if (dbError) {
      console.error("DB update error:", dbError.message);
      return new Response(JSON.stringify({ error: "Chyba při aktualizaci verifikace v databázi." }), { status: 500 });
    }
    
    // Vrácení přesměrovací URL pro frontend
    return new Response(JSON.stringify({ redirectUrl: bankIdUrl }), { status: 200 });
    
  } catch (err: any) {
    console.error("Exception in bankid_verification:", err);
    return new Response(JSON.stringify({ error: "Při ověřování BankID došlo k chybě. Zkuste to prosím později." }), { status: 500 });
  }
}
