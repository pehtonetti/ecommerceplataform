
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Platform root domain (set in .env as PLATFORM_DOMAIN) ───────────────────
const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? 'localhost';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') ?? '';
    const host = hostname.split(':')[0]; // strip port

    // ── Landing page redirect: domínio principal → /home ─────────────────────
    // Em localhost (dev) ou no domínio raiz da plataforma, redireciona / para /home
    if (pathname === '/') {
        const isStoreDomain = host.endsWith(`.${PLATFORM_DOMAIN}`) && PLATFORM_DOMAIN !== 'localhost';
        if (!isStoreDomain) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    // ── Resolve store slug from hostname and inject as header ──────────────────
    let storeSlug: string | null = null;
    if (host.endsWith(`.${PLATFORM_DOMAIN}`) && PLATFORM_DOMAIN !== 'localhost') {
        storeSlug = host.replace(`.${PLATFORM_DOMAIN}`, '');
    }

    const requestHeaders = new Headers(request.headers);
    if (storeSlug) {
        requestHeaders.set('x-store-slug', storeSlug);
    }
    requestHeaders.set('x-hostname', host);

    // ── Route protection ────────────────────────────────────────────────────────

    // Paths requiring basic authentication (customer)
    const clientPaths = ['/account', '/orders', '/checkout/success'];
    // Paths requiring admin or editor role
    const adminPaths = ['/admin', '/api/admin'];
    // Paths requiring merchant role (lojista dashboard)
    const dashboardPaths = ['/dashboard'];

    const isClientPath = clientPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
    const isDashboardPath = dashboardPaths.some(path => pathname.startsWith(path));

    // Pass through if not a protected route
    if (!isClientPath && !isAdminPath && !isDashboardPath) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Check session cookie
    const sessionToken = request.cookies.get('ecommerce_session');
    if (!sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    const userRole = request.cookies.get('user_role')?.value;

    // Admin paths: must be admin or editor
    if (isAdminPath && userRole) {
        if (userRole !== 'admin' && userRole !== 'editor') {
            if (pathname.startsWith('/api/')) {
                return new NextResponse(
                    JSON.stringify({ error: 'Não autorizado. Nível de acesso insuficiente.' }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                );
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Dashboard paths: must be merchant or admin
    if (isDashboardPath && userRole) {
        if (userRole !== 'merchant' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}

// Matcher covering all sensitive project routes
export const config = {
    matcher: [
        '/',
        '/admin/:path*',
        '/dashboard/:path*',
        '/account/:path*',
        '/orders/:path*',
        '/checkout/success/:path*',
        '/api/admin/:path*'
    ],
};
