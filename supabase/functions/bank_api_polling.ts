// supabase/functions/bank_api_polling.ts
import { createClient } from '@supabase/supabase-js';

// Načtení konfiguračních proměnných z prostředí
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BANK_API_URL = Deno.env.get('BANK_API_URL')!;
const BANK_API_KEY = Deno.env.get('BANK_API_KEY')!;
const BANK_ACCOUNT_NUMBER = Deno.env.get('BANK_ACCOUNT_NUMBER')!;
// Base URL pro volání další edge funkce generate_invoice
const EDGE_FUNCTION_BASE_URL = Deno.env.get('EDGE_FUNCTION_BASE_URL')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Simulovaná funkce, která vrací pole transakcí získaných z Bankovního API.
 * V produkci nahraďte reálným voláním bankovního API.
 */
async function fetchBankTransactions(): Promise<any[]> {
  console.log('Simuluji volání bankovního API na:', BANK_API_URL);
  // Simulovaná odpověď s jednou transakcí
  return [
    {
      date: new Date().toISOString(),
      amount: 1000, // částka v Kč
      variable_symbol: "TX123456", // použijte jako identifikátor transakce
      payer_account: BANK_ACCOUNT_NUMBER, // číslo účtu plátce
    },
  ];
}

/**
 * Zpracuje jednu transakci – nalezne odpovídající pending transakci v databázi,
 * aktualizuje její status, navýší zůstatek firmy, a spustí generování faktury.
 */
async function processTransaction(transaction: any) {
  // Vyhledání pending transakce dle variabilního symbolu
  const { data: pendingTransactions, error: fetchError } = await supabase
    .from('transactions')
    .select('*')
    .eq('transaction_id', transaction.variable_symbol)
    .eq('status', 'pending');
  
  if (fetchError) {
    console.error('Chyba při načítání pending transakcí:', fetchError.message);
    return;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    const pendingTx = pendingTransactions[0];
    console.log(`Nalezena pending transakce pro ${transaction.variable_symbol}`);

    // Aktualizace statusu transakce na 'completed'
    const { error: updateTxError } = await supabase
      .from('transactions')
      .update({ status: 'completed' })
      .eq('transaction_id', transaction.variable_symbol);
    if (updateTxError) {
      console.error('Chyba při aktualizaci statusu transakce:', updateTxError.message);
      return;
    }

    const companyId = pendingTx.company_id;
    // Načtení aktuálního zůstatku firmy
    const { data: companyData, error: companyFetchError } = await supabase
      .from('companies')
      .select('wallet_balance')
      .eq('id', companyId)
      .single();
    if (companyFetchError) {
      console.error('Chyba při načítání firemních údajů:', companyFetchError.message);
      return;
    }
    const newBalance = (companyData.wallet_balance || 0) + transaction.amount;
    // Aktualizace zůstatku peněženky firmy (ideálně v rámci transakce)
    const { error: updateCompanyError } = await supabase
      .from('companies')
      .update({ wallet_balance: newBalance })
      .eq('id', companyId);
    if (updateCompanyError) {
      console.error('Chyba při aktualizaci zůstatku firmy:', updateCompanyError.message);
      return;
    }

    // Volání funkce generate_invoice pro generování PDF faktury
    try {
      const invoiceResponse = await fetch(`${EDGE_FUNCTION_BASE_URL}/generate_invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction: pendingTx,
          companyId: companyId,
        }),
      });
      const invoiceData = await invoiceResponse.json();
      if (!invoiceResponse.ok) {
        console.error('Chyba při generování faktury:', invoiceData.error);
      } else {
        const invoiceUrl = invoiceData.invoice_url;
        // Vložení záznamu do tabulky invoices
        const { error: insertInvoiceError } = await supabase
          .from('invoices')
          .insert([{ transaction_id: transaction.variable_symbol, invoice_url: invoiceUrl }]);
        if (insertInvoiceError) {
          console.error('Chyba při vkládání faktury:', insertInvoiceError.message);
        }
        // Aktualizace transakce s URL faktury
        const { error: updateTxInvoiceError } = await supabase
          .from('transactions')
          .update({ invoice_url: invoiceUrl })
          .eq('transaction_id', transaction.variable_symbol);
        if (updateTxInvoiceError) {
          console.error('Chyba při aktualizaci transakce (invoice_url):', updateTxInvoiceError.message);
        }
        console.log('Transakce zpracována a faktura vygenerována pro', transaction.variable_symbol);
      }
    } catch (e) {
      console.error('Výjimka při generování faktury:', e);
    }
  } else {
    console.log('Pro transakci', transaction.variable_symbol, 'není nalezena odpovídající pending transakce.');
  }
}

export default async function handler(req: Request): Promise<Response> {
  try {
    console.log('Spouštím bank_api_polling...');
    // Volání Bank API – v produkci použijte reálné volání, zde simulujeme:
    const transactions = await fetchBankTransactions();
    
    for (const transaction of transactions) {
      await processTransaction(transaction);
    }
    
    console.log('Bank API polling dokončen. Další spuštění za 5 minut.');
    // Simulace periodického spouštění (vývojové prostředí)
    setTimeout(() => {
      handler(req);
    }, 5 * 60 * 1000);

    return new Response(JSON.stringify({ message: 'Bank API polling byl úspěšně proveden.' }), { status: 200 });
  } catch (error: any) {
    console.error('Chyba v bank_api_polling:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
