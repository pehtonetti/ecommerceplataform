
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Caminhos que exigem autenticação básica (cliente)
    const clientPaths = ['/account', '/orders', '/checkout/success'];
    // Caminhos que exigem nível administrativo (admin ou editor)
    const adminPaths = ['/admin', '/api/admin'];

    const isClientPath = clientPaths.some(path => pathname.startsWith(path));
    const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

    // Se não for rota protegida, deixa passar
    if (!isClientPath && !isAdminPath) {
        return NextResponse.next();
    }

    // Verifica se o cookie de sessão existe
    const sessionToken = request.cookies.get('ecommerce_session');

    if (!sessionToken) {
        // Bloqueio Total: Sem token, redireciona para login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Validação de Hierarquia (Admin/Editor) via cookie de role 
    if (isAdminPath) {
        const userRole = request.cookies.get('user_role')?.value;

        // Se o cookie de role existir, fazemos a validação estrita
        if (userRole) {
            if (userRole !== 'admin' && userRole !== 'editor') {
                console.error(`Acesso negado ao Admin: Role [${userRole}] insuficiente para ${pathname}`);

                if (pathname.startsWith('/api/')) {
                    return new NextResponse(
                        JSON.stringify({ error: 'Não autorizado. Nível de acesso insuficiente.' }),
                        { status: 403, headers: { 'Content-Type': 'application/json' } }
                    );
                }
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
        // Se o cookie de role não existir (sessão antiga), deixamos passar no middleware 
        // e o AdminLayout (Server Component) fará a validação final no Banco de Dados
        // e regenerará o cookie de role para as próximas requisições.
    }

    return NextResponse.next();
}

// Configuração de Matcher para cobrir todo o projeto sensível
export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
        '/orders/:path*',
        '/checkout/success/:path*',
        '/api/admin/:path*'
    ],
};
