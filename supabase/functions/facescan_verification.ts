// supabase/functions/facescan_verification.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FACE_SCAN_API_URL = Deno.env.get("FACE_SCAN_API_URL")!; // Např. https://api.facescanprovider.com/verify
const FACE_SCAN_API_KEY = Deno.env.get("FACE_SCAN_API_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface FaceScanRequest {
  verificationId: string;
  imageData: string; // Base64 encoded string
}

interface FaceScanResponse {
  success: boolean;
  estimatedAge?: number;
  message?: string;
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST requests allowed." }), { status: 405 });
    }
    
    const { verificationId, imageData } = await req.json() as FaceScanRequest;
    if (!verificationId || !imageData) {
      return new Response(JSON.stringify({ error: "Missing parameters." }), { status: 400 });
    }
    
    // Sestavení požadavku na Face Scan API
    const apiResponse = await fetch(FACE_SCAN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${FACE_SCAN_API_KEY}`
      },
      body: JSON.stringify({ image: imageData })
    });
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("FaceScan API error:", errorText);
      return new Response(JSON.stringify({ success: false, message: "Chyba při ověřování obličejem. Prosím, zkuste to znovu později." }), { status: 500 });
    }
    
    const apiResult: FaceScanResponse = await apiResponse.json();
    // Logika ověření věku – pokud odhadnutý věk >= 18, považujeme ověření za úspěšné
    const success = apiResult.success && (apiResult.estimatedAge !== undefined && apiResult.estimatedAge >= 18);
    
    // Aktualizace záznamu ověření v databázi
    const { error: dbError } = await supabase
      .from("verifications")
      .update({
        method: "facescan",
        success,
        age: apiResult.estimatedAge,
        verification_details: apiResult
      })
      .eq("id", verificationId);
      
    if (dbError) {
      console.error("DB update error:", dbError.message);
      return new Response(JSON.stringify({ success: false, message: "Chyba při aktualizaci databáze." }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ success, estimatedAge: apiResult.estimatedAge, message: apiResult.message }), { status: 200 });
  } catch (err: any) {
    console.error("facescan_verification exception:", err);
    return new Response(JSON.stringify({ success: false, message: "Při ověřování obličejem došlo k chybě. Prosím, zkuste to znovu později." }), { status: 500 });
  }
}
