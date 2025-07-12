import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // /admin以下かつ /admin/login ではない → 認証チェック
  const isAdminPath = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminPath && !isLoginPage && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// middlewareの適用対象を限定
export const config = {
  matcher: ['/admin/:path*'],
};
