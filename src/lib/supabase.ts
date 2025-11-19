import { createClient } from '@supabase/supabase-js';

// Obter variáveis de ambiente (Next.js substitui em build time)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se Supabase está configurado
export function isSupabaseConfigured(): boolean {
  const isConfigured = !!(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.length > 0 && 
    supabaseAnonKey.length > 0 &&
    supabaseUrl.startsWith('https://')
  );
  
  // Debug: log apenas no desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase Config Check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValid: supabaseUrl.startsWith('https://'),
      isConfigured
    });
  }
  
  return isConfigured;
}

// Criar cliente Supabase apenas se estiver configurado
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper para verificar se usuário está autenticado
export async function getUser() {
  if (!supabase) {
    console.warn('Supabase não está configurado');
    return null;
  }
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

// Helper para fazer logout
export async function signOut() {
  if (!supabase) {
    return { error: new Error('Supabase não configurado') };
  }
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { error: error as Error };
  }
}
