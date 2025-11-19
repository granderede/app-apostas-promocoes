import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente do Supabase com fallback seguro
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtcpkwwafpigxgdwstpx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Y3Brd3dhZnBpZ3hnZHdzdHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzQwMjMsImV4cCI6MjA3OTAxMDAyM30.llsAUzkBuOx21yIWtyAKYN4ki7I1bBMGch76cVA8zEI';

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Verificar se Supabase está configurado
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Helper para verificar se usuário está autenticado
export async function getUser() {
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
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return { error: error as Error };
  }
}
