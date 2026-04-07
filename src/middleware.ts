import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Platform root domain ─────────────────────────────────────────────────────
const PLATFORM_DOMAIN = process.env.PLATFORM_DOMAIN ?? 'localhost';

// ─── In-Memory Rate Limiter ───────────────────────────────────────────────────
// Simples mas eficaz para single-instance. Para multi-instância, usar Redis (Upstash).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimitKey(ip: string, path: string): string {
    // Agrupa auth paths sob a mesma chave
    if (path.startsWith('/api/auth') || path === '/home' || path === '/login') {
        return `rl:auth:${ip}`;
    }
    return `rl:${path}:${ip}`;
}

function checkRateLimit(
    key: string,
    maxRequests: number,
    windowMs: number
): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfterMs: 0 };
    }

    if (entry.count >= maxRequests) {
        return { allowed: false, retryAfterMs: entry.resetAt - now };
    }

    entry.count++;
    return { allowed: true, retryAfterMs: 0 };
}

// Limpa entradas expiradas periodicamente (evita memory leak)
let lastCleanup = Date.now();
function maybeCleanupRateLimits() {
    const now = Date.now();
    if (now - lastCleanup > 60_000) { // a cada 1 minuto
        for (const [key, entry] of rateLimitMap.entries()) {
            if (now > entry.resetAt) rateLimitMap.delete(key);
        }
        lastCleanup = now;
    }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getClientIp(request: NextRequest): string {
    return (
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1'
    );
}

// ─── Middleware Principal ─────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') ?? '';
    const host = hostname.split(':')[0];
    const ip = getClientIp(request);

    maybeCleanupRateLimits();

    // ── Landing page redirect: domínio principal → /home ─────────────────────
    if (pathname === '/') {
        const isStoreDomain = host.endsWith(`.${PLATFORM_DOMAIN}`) && PLATFORM_DOMAIN !== 'localhost';
        if (!isStoreDomain) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    // ── Rate Limiting: rotas de autenticação (5 req / 15 min por IP) ─────────
    const isAuthPath = pathname === '/login' ||
        pathname === '/home' ||
        pathname.startsWith('/api/auth') ||
        pathname === '/api/auth/login';

    if (isAuthPath && request.method === 'POST') {
        const key = getRateLimitKey(ip, pathname);
        const { allowed, retryAfterMs } = checkRateLimit(key, 5, 15 * 60 * 1000);

        if (!allowed) {
            const retryAfterSec = Math.ceil(retryAfterMs / 1000);
            return new NextResponse(
                JSON.stringify({
                    error: 'Muitas tentativas. Aguarde antes de tentar novamente.',
                    retryAfter: retryAfterSec,
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(retryAfterSec),
                        'X-RateLimit-Limit': '5',
                        'X-RateLimit-Remaining': '0',
                    },
                }
            );
        }
    }

    // ── Rate Limiting: API pública (60 req / 1 min por IP) ───────────────────
    if (pathname.startsWith('/api/v1/')) {
        const key = `rl:api:${ip}`;
        const { allowed, retryAfterMs } = checkRateLimit(key, 60, 60 * 1000);
        if (!allowed) {
            return new NextResponse(
                JSON.stringify({ error: 'Rate limit excedido.' }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
                    },
                }
            );
        }
    }

    // ── Resolve store slug from hostname and inject as header ─────────────────
    let storeSlug: string | null = null;
    if (host.endsWith(`.${PLATFORM_DOMAIN}`) && PLATFORM_DOMAIN !== 'localhost') {
        storeSlug = host.replace(`.${PLATFORM_DOMAIN}`, '');
    }

    const requestHeaders = new Headers(request.headers);
    if (storeSlug) requestHeaders.set('x-store-slug', storeSlug);
    requestHeaders.set('x-hostname', host);
    requestHeaders.set('x-forwarded-for-clean', ip);

    // ── Route protection ──────────────────────────────────────────────────────
    const clientPaths = ['/account', '/orders', '/checkout/success'];
    const adminPaths = ['/admin', '/api/admin'];
    const dashboardPaths = ['/dashboard'];

    const isClientPath = clientPaths.some(p => pathname.startsWith(p));
    const isAdminPath = adminPaths.some(p => pathname.startsWith(p));
    const isDashboardPath = dashboardPaths.some(p => pathname.startsWith(p));

    if (!isClientPath && !isAdminPath && !isDashboardPath) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // Verifica cookie de sessão (token aleatório, não userId)
    const sessionToken = request.cookies.get('ecommerce_session')?.value;
    if (!sessionToken) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // NOTA DE SEGURANÇA: A validação do role real é feita nos layouts/pages via
    // getCurrentUser() que consulta o banco. O cookie user_role aqui é usado
    // apenas como otimização (fast-path), mas NUNCA como fonte de verdade.
    // O banco é sempre consultado nas rotas protegidas.
    const userRole = request.cookies.get('user_role')?.value;

    if (isAdminPath && userRole && userRole !== 'admin' && userRole !== 'editor') {
        if (pathname.startsWith('/api/')) {
            return new NextResponse(
                JSON.stringify({ error: 'Não autorizado.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isDashboardPath && userRole && userRole !== 'merchant' && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/home',
        '/admin/:path*',
        '/dashboard/:path*',
        '/account/:path*',
        '/orders/:path*',
        '/checkout/success/:path*',
        '/api/auth/:path*',
        '/api/admin/:path*',
        '/api/v1/:path*',
    ],
};
