import bankidVerificationHandler from '../../../../supabase/functions/facescan_verification';

export async function POST(request: Request) {
  return bankidVerificationHandler(request);
}
