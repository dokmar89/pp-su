// supabase/functions/generate_invoice.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Simulovaná funkce pro generování obsahu PDF faktury.
 * V produkci nahraďte voláním knihovny pro generování PDF (např. jspdf-deno).
 */
async function generatePDFInvoiceContent(transaction: any, companyData: any): Promise<Uint8Array> {
  const content = `
    Faktura
    --------------------------------
    Číslo faktury: INV-${transaction.transaction_id}-${new Date().getFullYear()}
    Datum vystavení: ${new Date().toLocaleDateString()}
    Datum splatnosti: ${new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
    
    Odběratel:
    ${companyData.company_name}
    ${companyData.street}, ${companyData.city}, ${companyData.postal_code}, ${companyData.country}
    
    Popis: Dobití kreditu peněženky pro ověřování věku
    Částka: ${transaction.amount} Kč
    DPH (21%): ${(transaction.amount * 0.21).toFixed(2)} Kč
    Celkem k úhradě: ${(transaction.amount * 1.21).toFixed(2)} Kč
    
    Platební údaje:
    Číslo účtu: ${Deno.env.get('PLATFORM_BANK_ACCOUNT')}
    Variabilní symbol: ${transaction.transaction_id}
    
    --------------------------------
    Děkujeme za Vaši platbu.
  `;
  return new TextEncoder().encode(content);
}

export default async function handler(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Pouze metoda POST je povolena.' }), { status: 405 });
    }
    const body = await req.json();
    const { transaction, companyId } = body;
    if (!transaction || !companyId) {
      return new Response(JSON.stringify({ error: 'Chybí data transakce nebo companyId.' }), { status: 400 });
    }

    // Načtení firemních údajů
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    if (companyError) {
      return new Response(JSON.stringify({ error: companyError.message }), { status: 500 });
    }

    // Generování obsahu PDF faktury
    const pdfData = await generatePDFInvoiceContent(transaction, companyData);
    const fileName = `invoice_${transaction.transaction_id}_${Date.now()}.pdf`;

    // Nahrání PDF do Supabase Storage – předpokládáme existenci bucketu "invoices"
    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfData, { contentType: 'application/pdf' });
    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
    }

    // Získání veřejné URL nahraného souboru
    const { data: publicUrlData } = supabase.storage.from('invoices').getPublicUrl(fileName);
    const invoiceUrl = publicUrlData.publicUrl;

    console.log('Faktura vygenerována a nahrána:', invoiceUrl);
    return new Response(JSON.stringify({ invoice_url: invoiceUrl }), { status: 200 });
  } catch (error: any) {
    console.error('Chyba v generate_invoice:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
