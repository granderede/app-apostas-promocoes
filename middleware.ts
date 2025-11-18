import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware desabilitado - permite acesso sem autenticação
  // Para ativar autenticação, configure as variáveis de ambiente do Supabase
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|lasy-bridge.js).*)'],
};
