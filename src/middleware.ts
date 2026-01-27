
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Caminhos que exigem autenticação
    const protectedPaths = ['/admin', '/account', '/orders'];

    // Verifica se o usuário está tentando acessar uma rota protegida
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath) {
        // Verifica se o cookie de sessão existe
        const sessionToken = request.cookies.get('ecommerce_session');

        if (!sessionToken) {
            // Se não estiver logado, redireciona para o login
            // Salva a URL original para redirecionar de volta após o login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configuração para otimizar onde o middleware roda
export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
        '/orders/:path*'
    ],
};
