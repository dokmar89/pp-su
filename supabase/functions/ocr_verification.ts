// supabase/functions/ocr_verification.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const OCR_API_URL = Deno.env.get("OCR_API_URL")!; // Např. https://api.ocrprovider.com/extract
const OCR_API_KEY = Deno.env.get("OCR_API_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface OCRVerificationRequest {
  verificationId: string;
  imageUrl: string;
}

interface OCRVerificationResponse {
  success: boolean;
  dateOfBirth?: string; // Ve formátu YYYY-MM-DD
  message?: string;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed." }), { status: 405 });
    }
    
    const { verificationId, imageUrl } = await req.json() as OCRVerificationRequest;
    if (!verificationId || !imageUrl) {
      return new Response(JSON.stringify({ error: "Missing parameters." }), { status: 400 });
    }
    
    // Sestavení požadavku na OCR API
    const ocrResponse = await fetch(OCR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OCR_API_KEY}`
      },
      body: JSON.stringify({ imageUrl })
    });
    
    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      console.error("OCR API error:", errorText);
      return new Response(JSON.stringify({ success: false, message: "Chyba při ověřování dokladem. Prosím, zkuste to znovu později." }), { status: 500 });
    }
    
    const ocrResult: OCRVerificationResponse = await ocrResponse.json();
    
    // Pokus o extrakci data narození
    let ageVerified = false;
    if (ocrResult.dateOfBirth) {
      const birthDate = new Date(ocrResult.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      ageVerified = age >= 18;
    }
    
    // Aktualizace záznamu ověření v databázi
    const { error: dbError } = await supabase
      .from("verifications")
      .update({
        method: "ocr",
        success: ocrResult.success && ageVerified,
        age: ocrResult.dateOfBirth ? new Date().getFullYear() - new Date(ocrResult.dateOfBirth).getFullYear() : null,
        verification_details: ocrResult
      })
      .eq("id", verificationId);
      
    if (dbError) {
      console.error("DB update error:", dbError.message);
      return new Response(JSON.stringify({ success: false, message: "Chyba při aktualizaci databáze." }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ success: ocrResult.success && ageVerified, message: ocrResult.message }), { status: 200 });
  } catch (err: any) {
    console.error("ocr_verification exception:", err);
    return new Response(JSON.stringify({ success: false, message: "Při ověřování dokladem došlo k chybě. Prosím, zkuste to znovu později." }), { status: 500 });
  }
}
