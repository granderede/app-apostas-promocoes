import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para verificar se usuário está autenticado
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper para fazer logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Helper para verificar se Supabase está configurado
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined');
}
