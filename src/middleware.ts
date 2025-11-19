import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não estiver logado e tentar acessar rotas protegidas
  if (!session && (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname === '/')) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // Se estiver logado e tentar acessar /auth
  if (session && req.nextUrl.pathname === '/auth') {
    // Verificar se é admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (userData?.is_admin) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Proteger rota /admin - apenas admins
  if (session && req.nextUrl.pathname.startsWith('/admin')) {
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (!userData?.is_admin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Verificar status de pagamento para usuários comuns (não admins)
  if (session && req.nextUrl.pathname === '/') {
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin, subscription_end_date, payment_status')
      .eq('email', session.user.email)
      .single();

    // Se não for admin, verificar pagamento
    if (userData && !userData.is_admin) {
      const subscriptionEndDate = userData.subscription_end_date 
        ? new Date(userData.subscription_end_date) 
        : null;

      if (subscriptionEndDate) {
        const now = new Date();
        const diffTime = subscriptionEndDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se passou dos 3 dias de carência, bloquear acesso
        // A página principal vai mostrar a tela de bloqueio
        if (diffDays < -3) {
          // Não redireciona, deixa a página principal mostrar o bloqueio
          return res;
        }
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/', '/admin/:path*', '/auth'],
};
