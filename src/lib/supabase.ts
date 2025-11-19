import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se Supabase está configurado
export function isSupabaseConfigured() {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== '' && 
    supabaseAnonKey !== '' &&
    supabaseUrl !== 'undefined' && 
    supabaseAnonKey !== 'undefined'
  );
}

// Criar cliente Supabase apenas se estiver configurado
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar se usuário está autenticado
export async function getUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper para fazer logout
export async function signOut() {
  if (!supabase) return { error: new Error('Supabase não configurado') };
  const { error } = await supabase.auth.signOut();
  return { error };
}
