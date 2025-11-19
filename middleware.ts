import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se Supabase não estiver configurado, permite acesso
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Criar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Pegar token do cookie
  const token = request.cookies.get('sb-access-token')?.value;

  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser(token);

  // Se não estiver autenticado e tentar acessar rota protegida
  if (!user && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Se estiver autenticado e tentar acessar /auth
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|lasy-bridge.js).*)'],
};
