import { createClient } from '@supabase/supabase-js';

// Função para obter variáveis de ambiente de forma segura
function getEnvVar(key: string): string {
  if (typeof window !== 'undefined') {
    // Cliente: usar variáveis públicas
    return (window as any).__ENV__?.[key] || process.env[key] || '';
  }
  // Servidor: usar process.env
  return process.env[key] || '';
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Verificar se Supabase está configurado
export function isSupabaseConfigured() {
  return !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== '' && 
    supabaseAnonKey !== '' &&
    supabaseUrl !== 'undefined' && 
    supabaseAnonKey !== 'undefined' &&
    supabaseUrl.startsWith('https://')
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
