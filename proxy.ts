import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const SESSION_COOKIE_NAME = 'levantaqui_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protege a rota administrativa /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Mantém export default ou middleware para máxima compatibilidade
export const middleware = proxy;

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
