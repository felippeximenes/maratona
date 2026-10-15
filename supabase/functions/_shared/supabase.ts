import { createClient } from 'npm:@supabase/supabase-js@2';

import { HttpError } from './http.ts';

// Chave de serviço: passa por cima do RLS. Só existe nos segredos das funções.
export const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

/** Rejects the request unless it carries a valid session of a logged-in person. */
export async function requireUser(req: Request): Promise<string> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!token) throw new HttpError(401, 'unauthorized');
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) throw new HttpError(401, 'unauthorized');
  return data.user.id;
}
