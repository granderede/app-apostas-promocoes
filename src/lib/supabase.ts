import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente apenas se as variáveis estiverem configuradas
export const supabase = supabaseUrl && supabaseAnonKey 
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
